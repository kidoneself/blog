import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "我的博客",
  description: "记录生活与工作的点点滴滴",
  lang: 'zh-CN',
  // base: '/blog/', // GitHub Pages 需要取消注释这行（Vercel/Cloudflare 不需要）
  
  // 忽略死链接检查
  ignoreDeadLinks: true,
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '博客', 
        items: [
          { text: '所有文章', link: '/posts/' },
          { text: '技术文章', link: '/posts/tech/' },
          { text: '生活随笔', link: '/posts/life/' },
          { text: '工作感悟', link: '/posts/work/' }
        ]
      },
      { text: '关于', link: '/about' }
    ],

    sidebar: {
      '/posts/tech/': [
        {
          text: '技术文章',
          items: [
            { text: 'MoviePilot 自动分类不完全手册', link: '/posts/tech/moviepilot-auto-classification' },
            { text: 'FRP Panel 四个关键配置详解', link: '/posts/tech/frp-panel-key-configs' },
            { text: '微信公众号自动同步实战指南', link: '/posts/tech/wechat-auto-publish' },
            { text: '博客图片使用演示 ⭐', link: '/posts/tech/image-demo' },
            { text: '学习 VitePress', link: '/posts/tech/learning-vitepress' },
            { text: 'Git 使用技巧', link: '/posts/tech/git-tips' },
            { text: '前端开发最佳实践', link: '/posts/tech/frontend-best-practices' },
          ]
        }
      ],
      '/posts/life/': [
        {
          text: '生活随笔',
          items: [
            { text: '三十而立', link: '/posts/life/san-shi-er-li' },
            { text: '我的第一篇博客', link: '/posts/life/first-post' },
            { text: '阅读的力量', link: '/posts/life/power-of-reading' },
            { text: '时间管理心得', link: '/posts/life/time-management' },
          ]
        }
      ],
      '/posts/work/': [
        {
          text: '工作感悟',
          items: [
            { text: '如何进行有效的代码审查', link: '/posts/work/code-review' },
            { text: '团队协作的艺术', link: '/posts/work/team-collaboration' },
            { text: '职业发展思考', link: '/posts/work/career-development' },
          ]
        }
      ],
      '/posts/': [
        {
          text: '技术',
          collapsed: false,
          items: [
            { text: 'MoviePilot 自动分类不完全手册', link: '/posts/tech/moviepilot-auto-classification' },
            { text: 'FRP Panel 四个关键配置详解', link: '/posts/tech/frp-panel-key-configs' },
            { text: '微信公众号自动同步实战指南', link: '/posts/tech/wechat-auto-publish' },
            { text: '博客图片使用演示 ⭐', link: '/posts/tech/image-demo' },
            { text: '学习 VitePress', link: '/posts/tech/learning-vitepress' },
            { text: 'Git 使用技巧', link: '/posts/tech/git-tips' },
            { text: '前端开发最佳实践', link: '/posts/tech/frontend-best-practices' },
          ]
        },
        {
          text: '生活',
          collapsed: false,
          items: [
            { text: '三十而立', link: '/posts/life/san-shi-er-li' },
            { text: '我的第一篇博客', link: '/posts/life/first-post' },
            { text: '阅读的力量', link: '/posts/life/power-of-reading' },
            { text: '时间管理心得', link: '/posts/life/time-management' },
          ]
        },
        {
          text: '工作',
          collapsed: false,
          items: [
            { text: '如何进行有效的代码审查', link: '/posts/work/code-review' },
            { text: '团队协作的艺术', link: '/posts/work/team-collaboration' },
            { text: '职业发展思考', link: '/posts/work/career-development' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // 页脚
    footer: {
      message: '用心记录，用爱分享',
      copyright: 'Copyright © 2025-present'
    },

    // 搜索
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 文档页脚
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 大纲
    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  // 最后更新时间
  lastUpdated: true,

  // Markdown 配置
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true
    }
  }
})

