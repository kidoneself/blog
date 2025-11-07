# 学习 VitePress 搭建博客

::: info 文章信息
发布日期：2025年11月7日  
分类：技术 / 教程  
标签：#VitePress #博客 #教程
:::

## 📚 什么是 VitePress？

VitePress 是一个基于 Vite 和 Vue 3 的静态站点生成器，专为文档和博客网站设计。

### 核心特点

- ⚡️ **超快的开发体验**：基于 Vite，热更新速度极快
- 🎨 **简洁美观**：默认主题现代化，开箱即用
- 📝 **Markdown 增强**：支持代码高亮、容器、emoji 等
- 🔧 **高度可定制**：可以使用 Vue 组件扩展
- 🚀 **SEO 友好**：静态生成，性能优秀

## 🛠️ 快速开始

### 1. 安装依赖

\`\`\`bash
npm init -y
npm install -D vitepress vue
\`\`\`

### 2. 创建配置文件

创建 \`.vitepress/config.mts\` 文件：

\`\`\`typescript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的博客",
  description: "记录生活与工作",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/posts/' }
    ]
  }
})
\`\`\`

### 3. 创建首页

创建 \`index.md\` 文件。

### 4. 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

## 📖 写作指南

### Markdown 基础语法

VitePress 完全支持标准 Markdown 语法。

### 自定义容器

VitePress 支持多种提示容器：

::: tip 提示
这是一个提示信息
:::

::: warning 注意
这是一个警告信息
:::

::: danger 危险
这是一个危险提示
:::

::: info 信息
这是一个普通信息
:::

## 🎨 主题定制

### 自定义 CSS

创建 \`.vitepress/theme/style.css\` 来自定义样式。

### 使用 Vue 组件

在 Markdown 中可以直接使用 Vue 组件。

## 🚀 部署

### 部署到 GitHub Pages

1. 在 \`package.json\` 中添加部署脚本
2. 配置 GitHub Actions
3. 推送到仓库

### 部署到 Vercel

1. 导入 GitHub 仓库
2. Vercel 自动检测 VitePress
3. 一键部署完成

## 💡 最佳实践

1. **合理组织目录结构**：按类别或时间组织文章
2. **添加搜索功能**：启用本地搜索或集成 Algolia
3. **使用自定义组件**：提升阅读体验
4. **启用 Git 时间戳**：显示文章更新时间
5. **配置 SEO**：设置 meta 信息和 sitemap

## 📚 相关资源

- [VitePress 官方文档](https://vitepress.dev)
- [VitePress GitHub](https://github.com/vuejs/vitepress)
- [Vite 官网](https://vitejs.dev)
- [Vue 3 文档](https://vuejs.org)

## 🎯 总结

VitePress 是一个优秀的静态博客生成工具，适合：

- ✅ 技术博客和文档网站
- ✅ 追求性能和现代化体验
- ✅ 熟悉 Vue 生态的开发者
- ✅ 想要高度定制化的用户

开始你的 VitePress 博客之旅吧！🚀

---

*如果这篇文章对你有帮助，欢迎分享给更多的人！*
