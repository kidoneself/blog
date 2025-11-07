# 📸 博客图片使用指南

## 🎯 快速开始

### 1. 图片存放位置

```
public/images/
├── tech/        # 技术文章的图片
├── life/        # 生活随笔的图片
├── work/        # 工作感悟的图片
└── common/      # 通用图片（logo、头像等）
```

### 2. 添加图片三步走

```bash
# 步骤 1：放置图片到对应目录
cp my-photo.jpg public/images/life/

# 步骤 2：在 Markdown 中引用
![图片描述](/images/life/my-photo.jpg)

# 步骤 3：预览效果
# 开发服务器会自动更新，刷新浏览器查看
```

## 📝 Markdown 中使用图片

### 基础语法

```markdown
# 简单图片
![图片描述](/images/tech/example.png)

# 带标题的图片
![图片描述](/images/life/photo.jpg "鼠标悬停显示的标题")

# 图片链接
[![图片](/images/logo.png)](https://example.com)
```

### HTML 高级用法

```html
<!-- 指定大小 -->
<img src="/images/tech/diagram.png" alt="架构图" width="600">

<!-- 居中显示 -->
<div align="center">
  <img src="/images/work/flowchart.svg" alt="流程图" width="500">
  <p><em>图1：工作流程图</em></p>
</div>

<!-- 响应式图片 -->
<picture>
  <source srcset="/images/tech/screenshot.webp" type="image/webp">
  <img src="/images/tech/screenshot.png" alt="截图">
</picture>
```

## 🎨 实用示例

### 示例 1：文章封面图

```markdown
# 我的技术文章

![文章封面](/images/tech/article-cover.jpg)

这是文章的正文内容...
```

### 示例 2：并排显示多张图片

```html
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0;">
  <img src="/images/life/photo1.jpg" alt="照片1">
  <img src="/images/life/photo2.jpg" alt="照片2">
  <img src="/images/life/photo3.jpg" alt="照片3">
</div>
```

### 示例 3：带说明的图片

```markdown
![代码截图](/images/tech/code-screenshot.png)
*图1：完整的代码示例*

---

![运行结果](/images/tech/result.png)
*图2：程序运行结果*
```

### 示例 4：图片对比

```html
<table>
  <tr>
    <td align="center">
      <img src="/images/tech/before.png" alt="优化前" width="300">
      <br>优化前
    </td>
    <td align="center">
      <img src="/images/tech/after.png" alt="优化后" width="300">
      <br>优化后
    </td>
  </tr>
</table>
```

## 📏 图片规范

### 文件命名

```bash
# ✅ 推荐命名方式
git-tips-01.png          # 文章名-序号
reading-cover.jpg        # 文章名-用途
vitepress-logo.svg       # 描述性命名

# ❌ 避免的命名
IMG_1234.jpg            # 无意义
截图.png                # 中文名称
my photo (1).jpg        # 空格和括号
```

### 文件大小建议

| 图片类型 | 推荐大小 | 推荐尺寸 | 格式 |
|---------|---------|---------|------|
| 文章封面 | < 500KB | 1200x630 | JPG |
| 内容配图 | < 200KB | 800x600 | PNG/JPG |
| 代码截图 | < 300KB | 实际大小 | PNG |
| 图表图示 | < 100KB | 自适应 | SVG |
| 照片 | < 500KB | 1200x800 | JPG |
| 图标 | < 50KB | 64-256px | SVG/PNG |

### 格式选择

```markdown
## 选择合适的格式

- **PNG** 📊
  - 截图、界面
  - 需要透明背景
  - 文字清晰的图片

- **JPG** 📷
  - 照片、风景
  - 不需要透明背景
  - 文件大小敏感

- **SVG** 📈
  - 图标、Logo
  - 流程图、架构图
  - 需要缩放的图形

- **WebP** 🚀
  - 现代浏览器
  - 更好的压缩率
  - 配合 <picture> 使用
```

## 🛠️ 图片优化工具

### 在线压缩

```markdown
1. **TinyPNG** (https://tinypng.com)
   - PNG/JPG 智能压缩
   - 保持视觉质量
   - 最高减少 70% 体积

2. **Squoosh** (https://squoosh.app)
   - Google 出品
   - 支持多种格式
   - 实时预览效果

3. **SVGOMG** (https://jakearchibald.github.io/svgomg)
   - SVG 专用优化
   - 清理无用代码
   - 减小文件体积
```

### 命令行工具

```bash
# 安装 ImageMagick（Mac）
brew install imagemagick

# 批量压缩 JPG
magick mogrify -quality 85 -resize 1200x *.jpg

# 批量转换为 WebP
for i in *.jpg; do magick "$i" "${i%.jpg}.webp"; done
```

## 💡 最佳实践

### ✅ 推荐做法

```markdown
1. **优化后再上传**
   - 使用压缩工具处理
   - 检查文件大小
   - 保证加载速度

2. **提供替代文本**
   ![清晰描述图片内容](/images/example.png)
   
3. **按分类组织**
   tech/   - 技术相关
   life/   - 生活相关
   work/   - 工作相关

4. **使用相对路径**
   /images/tech/example.png  ✅

5. **为重要图片提供说明**
   ![架构图](/images/tech/architecture.svg)
   *图：系统整体架构设计*
```

### ❌ 避免的做法

```markdown
1. ❌ 直接上传原图（可能几MB）
2. ❌ 不写 alt 文本
3. ❌ 使用中文文件名
4. ❌ 图片堆在根目录
5. ❌ 引用外部链接（可能失效）
```

## 🎬 完整示例

创建一篇带图片的文章：

```markdown
# Git 分支管理策略

![封面图](/images/tech/git-branching-cover.jpg)

## Git Flow 工作流

Git Flow 是一个经典的分支管理模型：

![Git Flow 示意图](/images/tech/git-flow-diagram.svg)
*图1：Git Flow 分支模型*

### 主要分支

<div style="display: flex; gap: 2rem; margin: 2rem 0;">
  <div style="flex: 1;">
    <img src="/images/tech/main-branch.png" alt="主分支">
    <p align="center"><strong>Main 分支</strong></p>
  </div>
  <div style="flex: 1;">
    <img src="/images/tech/develop-branch.png" alt="开发分支">
    <p align="center"><strong>Develop 分支</strong></p>
  </div>
</div>

## 实际应用

下面是一个实际项目的分支截图：

![项目分支截图](/images/tech/project-branches.png)

从图中可以看到...
```

## 🔗 外部图片

### 使用外部图片

```markdown
# 可以，但不推荐
![外部图片](https://example.com/image.jpg)

# 问题：
- 外部链接可能失效
- 加载速度不可控
- 影响离线访问

# 建议：
下载到本地使用
```

### 下载外部图片

```bash
# 使用 curl 下载
curl -o public/images/tech/example.jpg https://example.com/image.jpg

# 使用 wget 下载
wget -O public/images/tech/example.jpg https://example.com/image.jpg
```

## 📱 响应式图片

```html
<!-- 不同屏幕显示不同图片 -->
<picture>
  <source media="(min-width: 768px)" srcset="/images/tech/desktop.jpg">
  <source media="(min-width: 480px)" srcset="/images/tech/tablet.jpg">
  <img src="/images/tech/mobile.jpg" alt="响应式图片">
</picture>

<!-- 不同格式的图片 -->
<picture>
  <source srcset="/images/tech/diagram.webp" type="image/webp">
  <source srcset="/images/tech/diagram.png" type="image/png">
  <img src="/images/tech/diagram.jpg" alt="后备图片">
</picture>
```

## ❓ 常见问题

### Q1: 图片不显示？

```markdown
检查：
1. 路径是否以 / 开头
   ✅ /images/tech/example.png
   ❌ images/tech/example.png

2. 文件是否在 public 目录
   ✅ public/images/tech/example.png
   ❌ src/images/tech/example.png

3. 文件名是否正确（区分大小写）
   ✅ example.png
   ❌ Example.PNG
```

### Q2: 图片加载太慢？

```markdown
解决方案：
1. 压缩图片（使用 TinyPNG）
2. 使用合适的格式（照片用 JPG，截图用 PNG）
3. 调整图片尺寸（不要上传过大的图片）
4. 使用 WebP 格式
```

### Q3: 如何添加图片说明？

```markdown
# 方法 1：使用斜体文字
![图片](/images/example.png)
*图：这是图片说明*

# 方法 2：使用 HTML
<figure>
  <img src="/images/example.png" alt="图片">
  <figcaption>图1：详细的图片说明</figcaption>
</figure>
```

### Q4: 本地图片 vs 图床？

```markdown
**本地存储（推荐）**
✅ 完全掌控
✅ 离线可访问
✅ 不依赖外部服务
❌ 占用仓库空间

**图床服务**
✅ 不占用仓库空间
✅ CDN 加速
❌ 可能失效
❌ 需要网络访问
```

## 📋 图片清单模板

每次添加图片时使用这个清单：

```markdown
## 图片添加清单

- [ ] 图片已优化压缩
- [ ] 文件大小合适（< 500KB）
- [ ] 文件命名规范（小写、连字符）
- [ ] 放在正确的分类目录
- [ ] 添加了 alt 描述文字
- [ ] 本地预览显示正常
- [ ] 提供了图片说明（如需要）
```

## 🎉 开始使用

现在你可以：

1. 将图片放到 `public/images/` 对应目录
2. 在 Markdown 中使用 `![描述](/images/xxx.jpg)`
3. 刷新浏览器查看效果

记住：好的配图让文章更生动！📸

---

*有问题随时查看这份指南* ✨

