# 博客图片使用演示

::: info 文章信息
发布日期：2025年11月7日  
分类：技术 / 教程  
标签：#图片 #Markdown #示例
:::

## 📸 图片展示示例

这篇文章展示了博客中各种图片的使用方式。

## 1️⃣ 基础图片

最简单的图片引用：

![VitePress 封面](/images/tech/vitepress-cover.jpg)

*图1：这是一张封面图*

---

## 2️⃣ 指定大小的图片

使用 HTML 标签可以控制图片大小：

<img src="/images/tech/code-screenshot.jpg" alt="代码截图" width="600">

*图2：代码截图示例（宽度 600px）*

---

## 3️⃣ 居中显示

<div align="center">
  <img src="/images/common/blog-banner.jpg" alt="博客横幅" width="800">
  <p><em>图3：博客横幅图片（居中显示）</em></p>
</div>

---

## 4️⃣ 并排显示多张图片

### 使用 Flexbox 布局

<div style="display: flex; gap: 1rem; margin: 2rem 0;">
  <img src="/images/life/reading-photo.jpg" alt="阅读" style="flex: 1;">
  <img src="/images/life/travel-photo.jpg" alt="旅行" style="flex: 1;">
</div>

*图4-5：并排显示的两张图片*

---

## 5️⃣ 网格布局

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0;">
  <div>
    <img src="/images/tech/vitepress-cover.jpg" alt="技术1" style="width: 100%;">
    <p align="center"><small>技术文章配图</small></p>
  </div>
  <div>
    <img src="/images/life/reading-photo.jpg" alt="生活1" style="width: 100%;">
    <p align="center"><small>生活随笔配图</small></p>
  </div>
  <div>
    <img src="/images/work/team-meeting.jpg" alt="工作1" style="width: 100%;">
    <p align="center"><small>工作感悟配图</small></p>
  </div>
</div>

*图6-8：网格布局展示*

---

## 6️⃣ 带边框和阴影的图片

<div style="text-align: center; margin: 2rem 0;">
  <img src="/images/tech/code-screenshot.jpg" 
       alt="带样式的图片" 
       style="max-width: 600px; border: 2px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  <p><em>图9：带边框和阴影效果</em></p>
</div>

---

## 7️⃣ 响应式图片

<picture>
  <source media="(min-width: 768px)" srcset="/images/common/blog-banner.jpg">
  <img src="/images/tech/vitepress-cover.jpg" alt="响应式图片" style="width: 100%;">
</picture>

*图10：根据屏幕大小显示不同图片*

---

## 8️⃣ 图片对比展示

<table style="width: 100%; margin: 2rem 0;">
  <tr>
    <td align="center" width="50%">
      <img src="/images/life/reading-photo.jpg" alt="图片A" style="max-width: 100%;">
      <br><strong>示例 A</strong>
      <p>这是第一张图片的说明</p>
    </td>
    <td align="center" width="50%">
      <img src="/images/life/travel-photo.jpg" alt="图片B" style="max-width: 100%;">
      <br><strong>示例 B</strong>
      <p>这是第二张图片的说明</p>
    </td>
  </tr>
</table>

---

## 9️⃣ 圆角图片

<div style="display: flex; gap: 2rem; justify-content: center; margin: 2rem 0;">
  <img src="/images/tech/vitepress-cover.jpg" alt="圆角1" style="width: 200px; border-radius: 12px;">
  <img src="/images/life/reading-photo.jpg" alt="圆角2" style="width: 200px; border-radius: 12px;">
  <img src="/images/work/team-meeting.jpg" alt="圆角3" style="width: 200px; border-radius: 12px;">
</div>

*图11-13：圆角效果的图片*

---

## 🔟 卡片式布局

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2rem 0;">
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <img src="/images/tech/code-screenshot.jpg" alt="卡片1" style="width: 100%; display: block;">
    <div style="padding: 1rem;">
      <h4 style="margin: 0 0 0.5rem 0;">技术文章</h4>
      <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">这是技术类文章的配图示例</p>
    </div>
  </div>
  
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <img src="/images/work/team-meeting.jpg" alt="卡片2" style="width: 100%; display: block;">
    <div style="padding: 1rem;">
      <h4 style="margin: 0 0 0.5rem 0;">工作感悟</h4>
      <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">这是工作类文章的配图示例</p>
    </div>
  </div>
</div>

---

## 📚 使用的图片清单

当前示例中使用的图片：

| 位置 | 图片路径 | 大小 | 用途 |
|------|---------|------|------|
| tech/ | `/images/tech/vitepress-cover.jpg` | 71KB | 技术文章封面 |
| tech/ | `/images/tech/code-screenshot.jpg` | 52KB | 代码截图 |
| life/ | `/images/life/reading-photo.jpg` | 76KB | 生活配图 |
| life/ | `/images/life/travel-photo.jpg` | 63KB | 旅行照片 |
| work/ | `/images/work/team-meeting.jpg` | 41KB | 团队会议 |
| common/ | `/images/common/blog-banner.jpg` | 98KB | 博客横幅 |

**总大小**：约 400KB

---

## 💡 使用建议

### ✅ 推荐做法

1. **优化图片大小**
   - 使用 [TinyPNG](https://tinypng.com) 压缩
   - 控制在 200KB 以内

2. **提供替代文本**
   ```markdown
   ![清晰的图片描述](/images/example.jpg)
   ```

3. **按分类组织**
   - tech/ - 技术文章
   - life/ - 生活随笔
   - work/ - 工作感悟

4. **统一命名规范**
   ```
   article-name-01.jpg
   cover-image.jpg
   screenshot-demo.png
   ```

### 📏 尺寸建议

- **封面图**：1200 x 630 px
- **配图**：800 x 600 px
- **缩略图**：400 x 300 px
- **图标**：64 x 64 px 或 128 x 128 px

---

## 🎨 样式技巧

### 图片圆角

```html
<img src="/images/example.jpg" style="border-radius: 12px;">
```

### 图片阴影

```html
<img src="/images/example.jpg" style="box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
```

### 图片边框

```html
<img src="/images/example.jpg" style="border: 2px solid #e5e7eb;">
```

### 组合效果

```html
<img src="/images/example.jpg" 
     style="border-radius: 8px; 
            border: 2px solid #e5e7eb; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
```

---

## 🚀 下一步

现在你已经看到了各种图片使用方式，可以：

1. 将自己的图片放到 `public/images/` 对应目录
2. 在文章中使用这些语法引用图片
3. 根据需要调整样式和布局

详细文档请查看 [IMAGE_GUIDE.md](../../IMAGE_GUIDE.md)

---

*让图片为你的文章增色！* 📸
