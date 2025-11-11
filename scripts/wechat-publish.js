#!/usr/bin/env node
'use strict';

require('dotenv').config();

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const axios = require('axios').default;
const FormData = require('form-data');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');
const cheerio = require('cheerio');

const ROOT_DIR = path.resolve(__dirname, '..');
const VITEPRESS_PUBLIC_DIR = path.resolve(ROOT_DIR, 'public');
const REQUIRED_ENV = ['WECHAT_APP_ID', 'WECHAT_APP_SECRET'];
const WECHAT_API_BASE = 'https://api.weixin.qq.com/cgi-bin';

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    assertEnv();

    const mdAbsolutePath = resolveMarkdownPath(options.markdownPath);
    const markdownContent = await fsp.readFile(mdAbsolutePath, 'utf-8');
    const { data: frontmatter, content: markdownBody } = matter(markdownContent);

    const title = frontmatter.title || extractTitleFromMarkdown(markdownBody);
    if (!title) {
      throw new Error('无法从 Frontmatter 或 Markdown 中解析标题，请在 Frontmatter 中提供 title 或在正文开头使用一级标题。');
    }

    const accessToken = await getAccessToken(process.env.WECHAT_APP_ID, process.env.WECHAT_APP_SECRET);

    const converter = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: false,
      breaks: false,
    });

    const rawHtml = converter.render(markdownBody);
    const markdownDir = path.dirname(mdAbsolutePath);

    const htmlWithImages = await transformImagesToWechat(rawHtml, {
      accessToken,
      markdownDir,
    });

    const styledHtml = applyWechatStyles(htmlWithImages, { title });

    if (process.env.WECHAT_DEBUG_HTML === '1') {
      const debugPath = path.resolve(ROOT_DIR, 'wechat-preview.html');
      await fsp.writeFile(debugPath, styledHtml, 'utf-8');
      console.log(`📝 已输出调试 HTML：${debugPath}`);
    }

    const thumbMediaId = await resolveThumbMediaId({
      accessToken,
      frontmatter,
      coverArg: options.cover,
      markdownDir,
    });

    const sourceUrl = resolveSourceUrl({
      frontmatter,
      sourceUrl: options.source,
      markdownPath: mdAbsolutePath,
    });

    const articlePayload = buildArticlePayload({
      frontmatter,
      html: styledHtml,
      title,
      sourceUrl,
      thumbMediaId,
    });

    const draftResult = await createDraft(accessToken, articlePayload);
    console.log('✅ 已创建公众号草稿');
    console.log(`media_id: ${draftResult.media_id}`);

    if (options.publish) {
      const publishResult = await publishDraft(accessToken, draftResult.media_id);
      console.log('🚀 草稿已提交发布');
      console.log(`publish_id: ${publishResult.publish_id}`);
    } else {
      console.log('ℹ️ 默认只创建草稿。如需直接发布，可追加 --publish 参数。');
    }
  } catch (error) {
    console.error('❌ 发布失败：', error.message);
    if (error.response?.data) {
      console.error('微信返回：', JSON.stringify(error.response.data));
    }
    process.exit(1);
  }
}

function parseArgs(args) {
  if (!args.length) {
    printUsage();
    process.exit(1);
  }

  const options = {
    publish: false,
    cover: undefined,
    source: undefined,
    markdownPath: undefined,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--publish') {
      options.publish = true;
    } else if (arg === '--cover') {
      options.cover = args[i + 1];
      i += 1;
      if (!options.cover) {
        throw new Error('--cover 需要一个值，例如图片路径或 URL');
      }
    } else if (arg === '--source') {
      options.source = args[i + 1];
      i += 1;
      if (!options.source) {
        throw new Error('--source 需要一个值，例如原文链接');
      }
    } else if (!options.markdownPath) {
      options.markdownPath = arg;
    } else {
      throw new Error(`无法识别的参数：${arg}`);
    }
  }

  if (!options.markdownPath) {
    throw new Error('缺少 Markdown 文件路径');
  }

  return options;
}

function printUsage() {
  console.log(`
用法：
  node scripts/wechat-publish.js <markdown-path> [--cover <path-or-url>] [--source <url>] [--publish]

参数说明：
  <markdown-path>    要同步到公众号的 Markdown 文件路径（可为相对路径）
  --cover            指定封面图片路径或 URL，优先级高于 Frontmatter 的 cover/wechatCover
  --source           设置“阅读原文”链接，优先级高于 Frontmatter 的 wechatSourceUrl
  --publish          创建草稿后立即调用公众号接口发布

依赖的环境变量：
  WECHAT_APP_ID
  WECHAT_APP_SECRET
  （可选）WECHAT_AUTHOR      默认作者署名
  （可选）WECHAT_OPEN_COMMENT=1|0
  （可选）WECHAT_ONLY_FANS_COMMENT=0|1
  （可选）WECHAT_DEFAULT_COVER 默认封面图片路径或 URL
  （可选）WECHAT_SOURCE_BASE_URL   若 Frontmatter 未提供 wechatSourceUrl 会尝试拼接
`);
}

function assertEnv() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`缺少环境变量：${missing.join(', ')}`);
  }
}

function resolveMarkdownPath(inputPath) {
  const absolutePath = path.isAbsolute(inputPath) ? inputPath : path.resolve(ROOT_DIR, inputPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`未找到 Markdown 文件：${absolutePath}`);
  }
  return absolutePath;
}

async function getAccessToken(appId, appSecret) {
  const { data } = await axios.get(`${WECHAT_API_BASE}/token`, {
    params: {
      grant_type: 'client_credential',
      appid: appId,
      secret: appSecret,
    },
  });

  if (data.errcode) {
    throw new Error(`获取 access_token 失败：${data.errmsg || data.errcode}`);
  }

  return data.access_token;
}

async function transformImagesToWechat(html, { accessToken, markdownDir }) {
  const $ = cheerio.load(html, null, false);
  const imgElements = $('img').toArray();

  await Promise.all(
    imgElements.map(async (img) => {
      const $img = $(img);
      const src = $img.attr('src');
      if (!src || isWechatHosted(src)) return;

      const uploadedUrl = await uploadRichMediaImage({
        source: src,
        accessToken,
        baseDir: markdownDir,
      });

      $img.attr('src', uploadedUrl);
      $img.removeAttr('referrerpolicy');
    }),
  );

  return $.html();
}

async function resolveThumbMediaId({ accessToken, frontmatter, coverArg, markdownDir }) {
  if (frontmatter.wechatThumbMediaId) {
    return frontmatter.wechatThumbMediaId;
  }

  const coverSource =
    coverArg ??
    frontmatter.wechatCover ??
    frontmatter.cover ??
    frontmatter.banner ??
    frontmatter.thumbnail ??
    frontmatter.image ??
    process.env.WECHAT_DEFAULT_COVER;

  if (!coverSource) {
    throw new Error('未提供封面图片。请在 Frontmatter 中设置 wechatThumbMediaId 或 cover/wechatCover，或使用 --cover 参数，或在环境变量中配置 WECHAT_DEFAULT_COVER。');
  }

  const resolved = await uploadThumbImage({
    source: coverSource,
    accessToken,
    baseDir: markdownDir,
  });

  return resolved.media_id;
}

function applyWechatStyles(html, { title }) {
  const $ = cheerio.load(`<div id="wechat-root">${html}</div>`, {
    decodeEntities: false,
  });

  const root = $('#wechat-root');

  root.find('p').each((_, element) => {
    convertAdmonitionParagraph($, element);
  });

  root.find('h1').each((index, element) => {
    const text = $(element).text().trim();
    if (!text) {
      $(element).remove();
      return;
    }
    const heading = $('<p></p>')
      .attr('style', 'margin:0 0 24px;font-size:26px;font-weight:700;letter-spacing:0.5px;color:#111;')
      .attr('data-wechat-fixed', 'true')
      .text(text);
    $(element).replaceWith(heading);
  });

  root.find('h2').each((_, element) => {
    const text = $(element).text().trim();
    if (!text) {
      $(element).remove();
      return;
    }
    const heading = $('<p></p>')
      .attr('style', 'margin:32px 0 16px;font-size:22px;font-weight:600;color:#111;')
      .attr('data-wechat-fixed', 'true')
      .text(text);
    $(element).replaceWith(heading);
  });

  root.find('h3').each((_, element) => {
    const text = $(element).text().trim();
    if (!text) {
      $(element).remove();
      return;
    }
    const heading = $('<p></p>')
      .attr('style', 'margin:28px 0 12px;font-size:18px;font-weight:600;color:#111;')
      .attr('data-wechat-fixed', 'true')
      .text(text);
    $(element).replaceWith(heading);
  });

  root.find('blockquote').each((_, element) => {
    const $el = $(element);
    $el.attr(
      'style',
      'margin:20px 0;padding:16px 20px;border-left:4px solid #4e8df1;background:#f6f9ff;border-radius:10px;color:#1f1f1f;',
    );
    $el.find('p').each((__, p) => {
      $(p).attr('style', 'margin:6px 0;font-size:15px;line-height:1.8;');
    });
  });

  root.find('ul').each((_, element) => {
    const $ul = $(element);
    $ul.attr('style', 'margin:0 0 18px 0;padding:0;list-style:none;');
    $ul.children('li').each((__, li) => formatListItem($, li, { ordered: false }));
  });

  root.find('ol').each((_, element) => {
    const $ol = $(element);
    $ol.attr('style', 'margin:0 0 18px 0;padding:0;list-style:none;');
    $ol.children('li').each((index, li) => formatListItem($, li, { ordered: true, index: index + 1 }));
  });

  root.find('img').each((_, element) => {
    $(element).attr(
      'style',
      'max-width:100%;display:block;margin:0 auto;border-radius:12px;object-fit:cover;',
    );
  });

  root.find('p').each((_, element) => {
    const $el = $(element);
    if (!$el.html() || !$el.html().trim()) {
      $el.remove();
      return;
    }

    if ($el.closest('[data-wechat-fixed="true"]').length) {
      return;
    }

    if ($el.find('img').length) {
      $el.attr('style', 'margin:24px 0;text-align:center;');
      return;
    }

    if ($el.parents('blockquote').length) {
      return;
    }

    $el.attr('style', 'margin:0 0 18px;font-size:16px;line-height:1.8;color:#1f1f1f;');
  });

  root.find('hr').each((_, element) => {
    $(element).replaceWith('<div style="margin:32px 0;border-top:1px solid #e5e5e5;"></div>');
  });

  const contentHtml = root.html();

  return `<section style="font-family:'PingFang SC','Microsoft YaHei','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.8;color:#1f1f1f;">${contentHtml}</section>`;
}

function convertAdmonitionParagraph($, element) {
  const $el = $(element);
  const textContent = $el.text();
  if (!textContent || !/:{3,}/.test(textContent)) {
    return false;
  }

  const lines = textContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length);

  if (!lines.length) {
    return false;
  }

  const first = lines.shift();
  const match = first.match(/^:{3,}\s*([a-z]+)\s*(.*)$/i);
  if (!match) {
    return false;
  }

  const type = match[1].toLowerCase();
  const title = match[2]?.trim() ?? '';

  while (lines.length && /^:{3,}/.test(lines[lines.length - 1])) {
    lines.pop();
  }

  const styleMap = {
    info: { border: '#4e8df1', background: '#f6f9ff', titleColor: '#1f3d99' },
    tip: { border: '#31c48d', background: '#f1fbf5', titleColor: '#0f5132' },
    warning: { border: '#f59e0b', background: '#fff8e5', titleColor: '#92400e' },
    danger: { border: '#ef4444', background: '#fde8e8', titleColor: '#991b1b' },
  };

  const colors = styleMap[type] || styleMap.info;

  const container = $('<section></section>').attr(
    'style',
    `margin:24px 0;padding:18px 20px;border-radius:12px;background:${colors.background};border-left:4px solid ${colors.border};color:#1f1f1f;`,
  );
  container.attr('data-wechat-fixed', 'true');

  if (title) {
    const titleEl = $('<p></p>')
      .attr('style', `margin:0 0 10px;font-weight:600;font-size:15px;color:${colors.titleColor};`)
      .text(title);
    container.append(titleEl);
  }

  lines.forEach((line) => {
    const infoEl = $('<p></p>')
      .attr('style', 'margin:6px 0;font-size:14px;line-height:1.7;')
      .text(line);
    container.append(infoEl);
  });

  $el.replaceWith(container);
  return true;
}

function formatListItem($, element, options = {}) {
  const $li = $(element);
  if ($li.attr('data-wechat-list') === 'true') return;

  const { ordered = false, index = 1 } = options;
  const bulletText = ordered ? `${index}.` : '•';

  const bulletSpan = $('<span></span>')
    .attr(
      'style',
      'display:inline-block;width:1.6em;flex-shrink:0;margin-top:0.1em;font-size:16px;line-height:1.8;text-align:left;color:#111;',
    )
    .text(bulletText);

  const contentHtml = $li.html();
  const contentSpan = $('<span></span>')
    .attr('style', 'flex:1;line-height:1.8;font-size:16px;color:#1f1f1f;')
    .html(contentHtml);

  $li
    .attr(
      'style',
      'margin:0 0 12px;font-size:16px;line-height:1.8;display:flex;gap:0.6em;align-items:flex-start;',
    )
    .attr('data-wechat-list', 'true')
    .empty()
    .append(bulletSpan, contentSpan);
}

function buildArticlePayload({ frontmatter, html, sourceUrl, thumbMediaId, title }) {
  const digest =
    frontmatter.wechatDigest ??
    frontmatter.description ??
    frontmatter.summary ??
    truncateText(stripHtml(html).replace(/\s+/g, ' '), 120);

  const article = {
    title,
    author: frontmatter.author || process.env.WECHAT_AUTHOR || '',
    digest,
    content: html,
    thumb_media_id: thumbMediaId,
    need_open_comment: toWechatBoolean(frontmatter.wechatOpenComment, process.env.WECHAT_OPEN_COMMENT, 1),
    only_fans_can_comment: toWechatBoolean(
      frontmatter.wechatOnlyFansComment,
      process.env.WECHAT_ONLY_FANS_COMMENT,
      0,
    ),
    content_source_url: sourceUrl,
  };

  return article;
}

function toWechatBoolean(...values) {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'number') return value ? 1 : 0;
    if (typeof value === 'boolean') return value ? 1 : 0;
    const str = String(value).trim();
    if (!str) continue;
    if (str === '1' || str.toLowerCase() === 'true' || str.toLowerCase() === 'yes') return 1;
    if (str === '0' || str.toLowerCase() === 'false' || str.toLowerCase() === 'no') return 0;
  }
  return 0;
}

function resolveSourceUrl({ frontmatter, sourceUrl, markdownPath }) {
  if (sourceUrl) return sourceUrl;
  if (frontmatter.wechatSourceUrl) return frontmatter.wechatSourceUrl;
  if (frontmatter.permalink) return frontmatter.permalink;

  const base = process.env.WECHAT_SOURCE_BASE_URL;
  if (!base) return '';

  const slug = frontmatter.slug || deriveSlugFromPath(markdownPath);
  if (!slug) return base;

  try {
    return new URL(slug, base).toString();
  } catch (error) {
    console.warn('⚠️ 无法拼接阅读原文链接，返回 base URL：', error.message);
    return base;
  }
}

function deriveSlugFromPath(markdownPath) {
  if (!markdownPath) return '';
  const relativePath = path.relative(ROOT_DIR, markdownPath).replace(/\\/g, '/');
  if (!relativePath) return '';

  let withoutExt = relativePath.replace(/\.md$/i, '');
  if (withoutExt.endsWith('/index')) {
    withoutExt = withoutExt.slice(0, -'/index'.length);
  } else if (withoutExt === 'index') {
    withoutExt = '';
  }

  const normalized = withoutExt
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean)
    .join('/');

  if (!normalized) {
    return '/';
  }

  return `/${normalized}`.replace(/\/{2,}/g, '/');
}

function extractTitleFromMarkdown(markdown) {
  if (!markdown) return '';
  const lines = markdown.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const atxMatch = line.match(/^#\s+(.+)/);
    if (atxMatch) {
      return atxMatch[1].trim();
    }

    if (i < lines.length - 1) {
      const underline = lines[i + 1].trim();
      if (/^=+$/.test(underline)) {
        return line;
      }
    }
  }

  return '';
}

async function resolveLocalMediaPath(source, baseDir) {
  if (!source) return null;
  const normalized = source.trim();
  if (!normalized) return null;

  const candidates = [];

  if (path.isAbsolute(normalized)) {
    try {
      const stats = await fsp.stat(normalized);
      if (stats.isFile()) {
        return normalized;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  let withoutSlash = normalized;
  if (normalized.startsWith('/')) {
    withoutSlash = normalized.replace(/^\//, '');
    candidates.push(path.join(VITEPRESS_PUBLIC_DIR, withoutSlash));
    candidates.push(path.join(ROOT_DIR, withoutSlash));
  }

  if (baseDir) {
    candidates.push(path.resolve(baseDir, normalized));
    candidates.push(path.resolve(baseDir, withoutSlash));
  }

  candidates.push(path.resolve(VITEPRESS_PUBLIC_DIR, normalized));
  candidates.push(path.resolve(VITEPRESS_PUBLIC_DIR, withoutSlash));
  candidates.push(path.resolve(ROOT_DIR, normalized));
  candidates.push(path.resolve(ROOT_DIR, withoutSlash));

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      const stats = await fsp.stat(candidate);
      if (stats.isFile()) {
        return candidate;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return null;
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}

function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

function isWechatHosted(src) {
  return /^https?:\/\/mmbiz\.qpic\.cn/.test(src) || /^https?:\/\/mmbiz\.qlogo\.cn/.test(src);
}

async function uploadRichMediaImage({ source, accessToken, baseDir }) {
  const form = await buildMediaFormData(source, baseDir);
  const url = `${WECHAT_API_BASE}/media/uploadimg?access_token=${accessToken}`;

  const response = await axios.post(url, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (response.data.errcode) {
    throw new Error(`上传图文内嵌图片失败：${response.data.errmsg || response.data.errcode}`);
  }

  return response.data.url;
}

async function uploadThumbImage({ source, accessToken, baseDir }) {
  const form = await buildMediaFormData(source, baseDir);
  const url = `${WECHAT_API_BASE}/material/add_material?access_token=${accessToken}&type=thumb`;

  const response = await axios.post(url, form, {
    headers: form.getHeaders(),
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  if (response.data.errcode) {
    throw new Error(`上传封面图失败：${response.data.errmsg || response.data.errcode}`);
  }

  return response.data;
}

async function buildMediaFormData(source, baseDir) {
  const form = new FormData();

  if (isRemoteUrl(source)) {
    const { buffer, filename } = await downloadRemoteFile(source);
    form.append('media', buffer, { filename });
  } else {
    const resolvedPath = await resolveLocalMediaPath(source, baseDir);
    if (!resolvedPath) {
      throw new Error(`无法解析本地媒体路径：${source}`);
    }
    await ensureFileExists(resolvedPath);
    form.append('media', fs.createReadStream(resolvedPath));
  }

  return form;
}

function isRemoteUrl(url) {
  return /^https?:\/\//i.test(url);
}

async function ensureFileExists(filePath) {
  try {
    const stats = await fsp.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`路径不是文件：${filePath}`);
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`未找到文件：${filePath}`);
    }
    throw error;
  }
}

async function downloadRemoteFile(url) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const filename = path.basename(new URL(url).pathname) || 'image.jpg';
  return { buffer: response.data, filename };
}

async function createDraft(accessToken, article) {
  const { data } = await axios.post(
    `${WECHAT_API_BASE}/draft/add?access_token=${accessToken}`,
    { articles: [article] },
  );

  if (data.errcode) {
    throw new Error(`创建草稿失败：${data.errmsg || data.errcode}`);
  }

  return data;
}

async function publishDraft(accessToken, mediaId) {
  const { data } = await axios.post(
    `${WECHAT_API_BASE}/draft/publish?access_token=${accessToken}`,
    { media_id: mediaId },
  );

  if (data.errcode) {
    throw new Error(`发布草稿失败：${data.errmsg || data.errcode}`);
  }

  return data;
}

main();

