# 前端开发最佳实践

::: info 文章信息
发布日期：2025年11月7日  
分类：技术 / 前端  
标签：#前端 #最佳实践 #代码规范
:::

## 🎯 代码质量

### 1. 代码规范

使用 ESLint 和 Prettier 保持代码风格一致：

```bash
npm install -D eslint prettier
npm install -D eslint-config-prettier eslint-plugin-vue
```

### 2. TypeScript

优先使用 TypeScript，提升代码质量：

```typescript
// 定义接口
interface User {
  id: number
  name: string
  email: string
}

// 类型安全的函数
function getUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(res => res.json())
}
```

### 3. 组件设计原则

- **单一职责**：每个组件只做一件事
- **可复用性**：提取通用组件
- **Props 验证**：定义明确的 props 类型
- **合理拆分**：大组件拆分成小组件

## ⚡ 性能优化

### 1. 懒加载

```javascript
// 路由懒加载
const Home = () => import('./views/Home.vue')

// 组件懒加载
const HeavyComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
)
```

### 2. 虚拟滚动

处理大列表时使用虚拟滚动：

```vue
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </RecycleScroller>
</template>
```

### 3. 图片优化

```html
<!-- 懒加载 -->
<img loading="lazy" src="image.jpg" alt="description">

<!-- 响应式图片 -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="description">
</picture>
```

## 🔒 安全实践

### 1. XSS 防护

```javascript
// 避免直接插入 HTML
// ❌ 不好
element.innerHTML = userInput

// ✅ 好
element.textContent = userInput
```

### 2. CSRF 防护

```javascript
// 使用 CSRF Token
axios.defaults.headers.common['X-CSRF-Token'] = csrfToken
```

### 3. 敏感信息

```javascript
// ❌ 不要在前端存储敏感信息
localStorage.setItem('password', password)

// ✅ 使用 HTTP-only Cookie
// 让服务器设置 cookie
```

## 📱 响应式设计

### 1. 移动优先

```css
/* 移动端样式 */
.container {
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### 2. 灵活布局

```css
/* Flexbox */
.flex-container {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
```

## 🎨 CSS 最佳实践

### 1. 使用 CSS 变量

```css
:root {
  --primary-color: #3498db;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.button {
  background: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}
```

### 2. BEM 命名规范

```css
/* Block Element Modifier */
.card { }
.card__header { }
.card__body { }
.card--highlighted { }
```

## 🧪 测试

### 1. 单元测试

```javascript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from './MyComponent.vue'

describe('MyComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(MyComponent, {
      props: { msg: 'Hello' }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### 2. E2E 测试

```javascript
// Playwright 示例
test('用户登录流程', async ({ page }) => {
  await page.goto('/')
  await page.fill('#username', 'user')
  await page.fill('#password', 'pass')
  await page.click('#login')
  await expect(page).toHaveURL('/dashboard')
})
```

## 📦 构建优化

### 1. 代码分割

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['element-plus']
        }
      }
    }
  }
}
```

### 2. 压缩优化

```javascript
// vite.config.js
import { compression } from 'vite-plugin-compression'

export default {
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ]
}
```

## 🔍 SEO 优化

### 1. Meta 标签

```html
<head>
  <title>页面标题</title>
  <meta name="description" content="页面描述">
  <meta property="og:title" content="分享标题">
  <meta property="og:description" content="分享描述">
  <meta property="og:image" content="分享图片">
</head>
```

### 2. 语义化 HTML

```html
<header>
  <nav>
    <ul>
      <li><a href="/">首页</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容</p>
  </article>
</main>

<footer>
  <p>&copy; 2025</p>
</footer>
```

## 🛠️ 开发工具

### 1. VSCode 插件推荐

- ESLint
- Prettier
- Volar (Vue 3)
- GitLens
- Auto Rename Tag
- Path Intellisense

### 2. Chrome 插件

- Vue.js devtools
- React Developer Tools
- Lighthouse
- Wappalyzer

## 📚 学习资源

- [MDN Web Docs](https://developer.mozilla.org/)
- [Vue.js 官方文档](https://cn.vuejs.org/)
- [React 官方文档](https://react.dev/)
- [web.dev](https://web.dev/)

## 🎯 总结

前端开发最佳实践涵盖：

- ✅ 代码质量和规范
- ✅ 性能优化
- ✅ 安全实践
- ✅ 响应式设计
- ✅ 测试和构建
- ✅ SEO 优化

持续学习和实践这些最佳实践，可以帮助我们写出更好的代码！

---

*Stay curious, keep learning!* 🚀

