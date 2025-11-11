# 微信公众号自动同步实战指南

::: info 文章信息
发布日期：2025年11月11日  
分类：技术 / 自动化  
标签：#微信 #自动化 #发布
:::

## ✨ 能做什么

我们在项目中新增了 `scripts/wechat-publish.js` 脚本，可以把 Markdown 文章一键转换成公众号草稿，自动处理排版、图片上传，并支持可选的立即发布。使用这个脚本可以达到：

- 将 VitePress 文章同步为公众号图文草稿；
- 自动补全标题、摘要、封面、阅读原文链接；
- 按照博客移动端样式注入内联 CSS，让公众号排版更接近网页效果；
- 自动上传本地图片，转换成微信素材链接；
- 通过开关生成调试 HTML，发布前先在浏览器核对样式；
- 可选参数控制封面、阅读原文、是否立即发布。

## 🧱 准备工作

1. **公众号权限**  
   - 需具备公众号开发者权限，账号已认证；  
   - 在“开发 → 基本配置”里启用 `AppID` / `AppSecret`，并添加本机或 CI 的公网 IP 到 API 白名单。

2. **项目依赖**  
   运行 `npm install` 后，会安装好脚本所需的 `axios`、`markdown-it`、`cheerio` 等依赖。

3. **环境变量**  
   在项目根目录创建 `.env`（已加入 `.gitignore`），示例：

   ```bash
   WECHAT_APP_ID=wx_your_appid
   WECHAT_APP_SECRET=your_app_secret
   WECHAT_AUTHOR=无名之辈                 # 可选，默认作者
   WECHAT_SOURCE_BASE_URL=https://naspt.vip/  # 可选，“阅读原文”默认前缀
   WECHAT_DEFAULT_COVER=/images/common/blog-banner.jpg  # 可选，默认封面图
   WECHAT_OPEN_COMMENT=1                  # 可选，开启留言
   WECHAT_ONLY_FANS_COMMENT=0             # 可选，仅粉丝可留言
   ```

   > 注意：密钥切勿提交到仓库。

## 🚀 基本命令

### 生成草稿

```bash
npm run wechat:publish -- posts/life/san-shi-er-li.md
```

- 默认：只创建草稿，不立即发布；
- 输出中会给出 `media_id`，可在公众号后台 → 草稿箱里查看；
- 文章需包含 `title`，若缺失会从 Markdown 一级标题自动补齐。

### 直接发布

```bash
npm run wechat:publish -- posts/life/san-shi-er-li.md --publish
```

> 建议确认草稿排版后再使用 `--publish`，避免排版或图片问题直接上线。

### 指定封面 / 阅读原文

```bash
npm run wechat:publish -- posts/... --cover /images/custom/cover.jpg --source https://naspt.vip/custom
```

- `--cover`：优先级最高，可传本地路径或网络 URL；
- `--source`：覆盖 Frontmatter 或环境变量自动拼接的阅读原文链接。

### 排版调试

```bash
WECHAT_DEBUG_HTML=1 npm run wechat:publish -- posts/tech/image-demo.md
```

- 命令会额外导出 `wechat-preview.html`，可本地浏览器预览公众号最终 HTML；
- 文件已被忽略（`.gitignore`），不会出现在提交中；
- 去掉 `WECHAT_DEBUG_HTML=1` 则不会生成预览文件。

### 批量生成草稿

```bash
find posts -name "*.md" -exec npm run wechat:publish -- {} \;
```

> 执行前请确认所有文章都准备好封面、标题和排版，避免批量报错或生成大量需要手动删除的草稿。

## 🧩 脚本支持的功能细节

- **标题与摘要**  
  - 优先读取 Frontmatter 的 `title`、`description`；  
  - 缺失时自动从 Markdown 一级标题和正文提取；  
  - 摘要默认截取正文内容，可通过 `wechatDigest` 自定义。

- **封面策略**  
  - 优先级依次为：脚本参数 `--cover` → Frontmatter `wechatCover` / `cover` / `image` → 环境变量 `WECHAT_DEFAULT_COVER`；  
  - 若提供 `wechatThumbMediaId`，会直接复用已有封面素材。

- **阅读原文链接**  
  - 优先使用 `--source` 或 Frontmatter 中的 `wechatSourceUrl` / `permalink`；  
  - 若设置了 `WECHAT_SOURCE_BASE_URL`，脚本会基于文章路径自动拼接；  
  - 未配置则留空。

- **图片处理**  
  - Markdown 内本地图片（如 `/images/...`）会自动映射到 `public/images` 下的真实文件；  
  - 上传后替换成微信返回的素材 URL；
  - 表格、Flex、Grid 等布局中嵌套的图片也会增加圆角 & 居中样式。

- **排版样式**  
  - 标题、段落、列表、引用、提示块（`::: info` 等）会注入内联样式，保证在微信端显示整洁；  
  - 列表会转换为自定义圆点或序号，避免原生样式错位；  
  - `::: info` / `:::: info` 等提示块会渲染成带背景色的说明框。

## 🩹 常见问题 & 排查

- **`invalid ip ... not in whitelist`**  
  - 说明当前出口 IP 未加入公众号后台白名单。到“开发 → 基本配置”处添加 IPv4，必要时也添加 `::ffff:x.x.x.x`。

- **`invalid url` 发布失败**  
  - 通常是“阅读原文”链接使用了未配置的业务域名。可先在公众号后台完成域名校验或暂时移除 `--source`。

- **`未提供封面图片`**  
  - 确保文章 Frontmatter 或脚本参数有指定封面，或者配置 `WECHAT_DEFAULT_COVER`。

- **图片上传报错**  
  - 微信对单图大小有 2MB 限制；  
  - 确认本地文件路径存在，或使用网络图片 URL。

## 🔐 安全性与最佳实践

- `.env` 仅在本地或 CI 持有，必要时使用环境变量注入方式存储；
- 建议先通过调试预览验证排版，再提交草稿到后台；
- 批量发布前，可先生成草稿后人工检查，确保审核通过；
- 保留命令行输出或 CI 日志，方便追踪哪些文章同步成功、哪些失败。

---

*把写作流程自动化，省下来的时间用来创作更优质的内容吧！* 💡


