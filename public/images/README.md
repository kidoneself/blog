# 📸 图片资源管理

## 目录结构

```
public/images/
├── tech/        # 技术文章配图
├── life/        # 生活随笔配图
├── work/        # 工作感悟配图
└── common/      # 通用图片（logo、头像等）
```

## 使用方法

### 1. 添加图片

将图片文件放到对应的分类目录：

```bash
# 技术文章配图
public/images/tech/article-name-01.png

# 生活随笔配图
public/images/life/story-01.jpg

# 工作感悟配图
public/images/work/diagram-01.svg
```

### 2. 在 Markdown 中引用

```markdown
# 绝对路径（推荐）
![图片描述](/images/tech/example.png)

# 带标题
![图片描述](/images/life/photo.jpg "图片标题")

# 指定大小（HTML）
<img src="/images/work/chart.png" alt="图表" width="500">
```

### 3. 图片命名规范

```
格式：{文章名}-{序号}.{扩展名}

示例：
- git-tips-01.png
- git-tips-02.jpg
- reading-cover.jpg
- team-workflow.svg
```

## 图片优化建议

### 文件大小
- 普通配图：< 200KB
- 封面图：< 500KB
- 截图：使用 PNG（< 1MB）
- 照片：使用 JPG（< 500KB）

### 推荐尺寸
- 文章封面：1200x630px
- 内容配图：800x600px
- 缩略图：400x300px
- 图标：64x64px 或 128x128px

### 格式选择
- **PNG**：截图、图标、需要透明背景
- **JPG**：照片、风景图
- **SVG**：图表、图标、矢量图
- **WebP**：新格式，更小的文件体积

## 在线图片工具

### 压缩工具
- [TinyPNG](https://tinypng.com/) - PNG/JPG 压缩
- [Squoosh](https://squoosh.app/) - 在线图片优化
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG 优化

### 图床服务
如果不想本地存储：
- [GitHub](https://github.com) - 仓库存储
- [Cloudinary](https://cloudinary.com) - 免费图床
- [ImgBB](https://imgbb.com) - 免费图床

## 示例

### Markdown 基础用法

```markdown
## 文章配图

![VitePress Logo](/images/tech/vitepress-logo.png)

这是一张展示 VitePress 的图片。
```

### HTML 高级用法

```html
<!-- 响应式图片 -->
<picture>
  <source srcset="/images/tech/diagram.webp" type="image/webp">
  <img src="/images/tech/diagram.png" alt="架构图">
</picture>

<!-- 图片组 -->
<div style="display: flex; gap: 10px;">
  <img src="/images/life/photo1.jpg" width="200">
  <img src="/images/life/photo2.jpg" width="200">
  <img src="/images/life/photo3.jpg" width="200">
</div>

<!-- 居中图片 -->
<div align="center">
  <img src="/images/work/flowchart.svg" alt="流程图" width="600">
</div>
```

### VitePress 图片增强

```markdown
<!-- 懒加载（VitePress 自动支持） -->
![大图片](/images/life/large-photo.jpg)

<!-- 点击放大（需要插件） -->
![可点击的图片](/images/tech/screenshot.png)
```

## 最佳实践

### ✅ 推荐做法

1. **统一命名规范**
   ```
   article-slug-01.png
   article-slug-02.jpg
   ```

2. **按分类存放**
   ```
   tech/ - 技术相关
   life/ - 生活相关
   work/ - 工作相关
   ```

3. **提供替代文本**
   ```markdown
   ![清晰的图片描述](/images/example.png)
   ```

4. **优化文件大小**
   - 压缩后再上传
   - 使用合适的格式

5. **使用绝对路径**
   ```markdown
   ![图片](/images/tech/example.png)  ✅
   ![图片](../../public/images/tech/example.png)  ❌
   ```

### ❌ 避免做法

1. 图片文件过大（> 2MB）
2. 不提供 alt 文本
3. 使用中文文件名
4. 图片堆积在根目录

## 常见问题

### Q: 图片显示不出来？

检查路径是否正确：
```markdown
# ✅ 正确（以 / 开头）
![图片](/images/tech/example.png)

# ❌ 错误
![图片](images/tech/example.png)
![图片](/public/images/tech/example.png)
```

### Q: 如何添加图片说明？

```markdown
![图片描述](/images/example.png)
*图：这是图片说明文字*

或使用 HTML：

<figure>
  <img src="/images/example.png" alt="图片">
  <figcaption>图1：这是图片说明</figcaption>
</figure>
```

### Q: 如何并排显示多张图片？

```html
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
  <img src="/images/1.jpg" alt="图1">
  <img src="/images/2.jpg" alt="图2">
</div>
```

### Q: 外部图片链接可以用吗？

可以，但不推荐（可能失效）：
```markdown
![外部图片](https://example.com/image.jpg)
```

建议下载到本地使用。

## 图片清单模板

创建新文章时，可以用这个清单：

```markdown
## 图片准备清单

- [ ] 准备封面图（1200x630px）
- [ ] 准备配图（压缩至 < 200KB）
- [ ] 图片已命名（article-slug-01.png）
- [ ] 图片已分类存放
- [ ] 添加了 alt 文本
- [ ] 测试图片显示正常
```

---

*好的图片让文章更生动！* 📸

