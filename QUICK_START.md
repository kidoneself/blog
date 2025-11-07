# 🚀 快速开始指南

## 📖 项目已创建成功！

您的 VitePress 博客已经搭建完成，现在可以开始使用了！

## 🎯 立即开始

### 1. 查看博客

开发服务器已经在后台启动，请访问：

**http://localhost:5173**

### 2. 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## ✍️ 开始写作

### 创建新文章

1. 在 `posts/` 目录下创建新的 `.md` 文件
2. 添加文章内容
3. 在 `.vitepress/config.mts` 中更新侧边栏配置（可选）

### 文章模板

```markdown
# 文章标题

::: info 文章信息
发布日期：2025年11月7日  
分类：技术/生活  
标签：#标签1 #标签2
:::

## 介绍

这里是文章内容...

## 小结

总结内容...
```

## 📁 项目结构

```
blog/
├── .vitepress/              # VitePress 配置
│   ├── config.mts           # 主配置文件
│   └── config.mts.example   # 配置示例
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Pages 部署配置
├── posts/                   # 博客文章目录
│   ├── index.md             # 文章列表页
│   ├── first-post.md        # 示例：第一篇博客
│   └── learning-vitepress.md # 示例：VitePress 教程
├── index.md                 # 首页
├── about.md                 # 关于页面
├── package.json             # 项目配置
├── .gitignore               # Git 忽略文件
└── README.md                # 项目说明
```

## 🎨 自定义配置

### 修改站点信息

编辑 `.vitepress/config.mts`：

```typescript
export default defineConfig({
  title: "你的博客名称",
  description: "你的博客描述",
  // ... 其他配置
})
```

### 修改导航栏

```typescript
nav: [
  { text: '首页', link: '/' },
  { text: '博客', link: '/posts/' },
  { text: '关于', link: '/about' },
  // 添加更多导航项...
]
```

### 修改社交链接

```typescript
socialLinks: [
  { icon: 'github', link: 'https://github.com/你的用户名' }
]
```

## 📸 添加图片

### 图片目录结构

```
public/images/
├── tech/        # 技术文章配图
├── life/        # 生活随笔配图
├── work/        # 工作感悟配图
└── common/      # 通用图片（logo、头像等）
```

### 使用方法

```bash
# 1. 将图片放到对应目录
cp my-photo.jpg public/images/life/

# 2. 在 Markdown 中引用
![图片描述](/images/life/my-photo.jpg)

# 3. 刷新浏览器查看效果
```

### 常用图片语法

```markdown
# 基础图片
![VitePress Logo](/images/tech/vitepress.png)

# 指定大小
<img src="/images/tech/diagram.png" alt="架构图" width="600">

# 居中显示
<div align="center">
  <img src="/images/work/flowchart.svg" alt="流程图">
  <p><em>图1：工作流程图</em></p>
</div>

# 并排显示
<div style="display: flex; gap: 1rem;">
  <img src="/images/life/photo1.jpg" width="200">
  <img src="/images/life/photo2.jpg" width="200">
</div>
```

### 图片优化建议

- **文件大小**：普通配图 < 200KB，封面图 < 500KB
- **命名规范**：使用小写字母和连字符，如 `git-tips-01.png`
- **格式选择**：
  - PNG：截图、图标、需要透明背景
  - JPG：照片、风景图
  - SVG：图表、流程图、矢量图标

详细指南：[IMAGE_GUIDE.md](./IMAGE_GUIDE.md)

## 🎯 进阶功能

### 1. 添加评论系统

可以集成：
- Giscus（推荐，基于 GitHub Discussions）
- Gitalk
- Valine

### 2. 添加统计分析

- Google Analytics
- 百度统计
- Umami

### 3. 自定义主题

创建 `.vitepress/theme/index.ts`：

```typescript
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default DefaultTheme
```

### 4. 使用自定义组件

在 `.vitepress/theme/components/` 下创建 Vue 组件，然后在 Markdown 中使用。

## 🚀 部署

### 部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 推送代码：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/用户名/仓库名.git
   git push -u origin main
   ```
3. 在仓库设置中启用 GitHub Pages
4. 选择 GitHub Actions 作为源

### 部署到 Vercel

1. 访问 [vercel.com](https://vercel.com)
2. 导入 GitHub 仓库
3. 点击部署（自动识别 VitePress）

### 部署到 Netlify

1. 访问 [netlify.com](https://netlify.com)
2. 连接 GitHub 仓库
3. 配置：
   - 构建命令：`npm run build`
   - 发布目录：`.vitepress/dist`

## 📚 学习资源

- [VitePress 官方文档](https://vitepress.dev)
- [Markdown 基础语法](https://markdown.com.cn/basic-syntax/)
- [Vue 3 文档](https://cn.vuejs.org)
- [Git 使用教程](https://git-scm.com/book/zh/v2)

## 💡 写作建议

1. **保持更新**：定期发布新内容
2. **注重质量**：宁缺毋滥
3. **分类管理**：合理组织文章结构
4. **添加标签**：方便读者查找
5. **优化 SEO**：设置合适的标题和描述
6. **响应读者**：如果有评论系统，及时回复

## 🎉 开始你的博客之旅

现在一切准备就绪！打开浏览器访问 **http://localhost:5173**，开始你的写作之旅吧！

祝您写作愉快！✍️

---

如有问题，请参考：
- README.md - 项目说明
- .vitepress/config.mts.example - 配置示例
- posts/learning-vitepress.md - VitePress 使用教程

