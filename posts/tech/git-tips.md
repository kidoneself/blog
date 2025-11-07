# Git 使用技巧

::: info 文章信息
发布日期：2025年11月7日  
分类：技术 / 工具  
标签：#Git #版本控制 #效率
:::

## 📝 前言

Git 是程序员必备的版本控制工具，掌握一些实用技巧可以大大提升工作效率。

## 🚀 常用命令

### 基础操作

```bash
# 初始化仓库
git init

# 克隆远程仓库
git clone <url>

# 查看状态
git status

# 添加文件
git add .
git add <file>

# 提交更改
git commit -m "commit message"

# 推送到远程
git push origin main
```

### 分支操作

```bash
# 创建并切换分支
git checkout -b feature-branch

# 切换分支
git checkout main

# 查看所有分支
git branch -a

# 删除本地分支
git branch -d feature-branch

# 删除远程分支
git push origin --delete feature-branch

# 合并分支
git merge feature-branch
```

## 💡 实用技巧

### 1. 美化 Git 日志

```bash
# 单行显示日志
git log --oneline

# 图形化显示分支
git log --graph --oneline --all

# 自定义格式
git log --pretty=format:"%h - %an, %ar : %s"

# 创建别名
git config --global alias.lg "log --graph --oneline --all"
```

### 2. 暂存工作区

```bash
# 暂存当前更改
git stash

# 查看暂存列表
git stash list

# 恢复最近的暂存
git stash pop

# 恢复指定的暂存
git stash apply stash@{0}

# 删除暂存
git stash drop stash@{0}
```

### 3. 撤销操作

```bash
# 撤销工作区的修改
git checkout -- <file>

# 撤销暂存区的文件
git reset HEAD <file>

# 修改最后一次提交
git commit --amend

# 回退到指定版本
git reset --soft HEAD~1   # 保留更改
git reset --hard HEAD~1   # 丢弃更改
```

### 4. 查看差异

```bash
# 查看工作区和暂存区的差异
git diff

# 查看暂存区和最后一次提交的差异
git diff --staged

# 查看两个分支的差异
git diff branch1..branch2

# 查看某个文件的修改历史
git log -p <file>
```

### 5. 标签管理

```bash
# 创建标签
git tag v1.0.0

# 创建带注释的标签
git tag -a v1.0.0 -m "版本 1.0.0"

# 查看所有标签
git tag

# 推送标签到远程
git push origin v1.0.0
git push origin --tags  # 推送所有标签

# 删除标签
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0  # 删除远程标签
```

## 🔧 高级技巧

### 1. Cherry-pick

```bash
# 将指定的提交应用到当前分支
git cherry-pick <commit-hash>

# 应用多个提交
git cherry-pick <commit1> <commit2>
```

### 2. Rebase

```bash
# 变基到主分支
git rebase main

# 交互式变基（合并提交）
git rebase -i HEAD~3

# 继续 rebase
git rebase --continue

# 中止 rebase
git rebase --abort
```

### 3. 搜索和查找

```bash
# 在提交历史中搜索
git log --grep="关键词"

# 查找谁修改了某行代码
git blame <file>

# 查找包含特定内容的提交
git log -S "function_name"
```

### 4. 子模块管理

```bash
# 添加子模块
git submodule add <url> <path>

# 初始化子模块
git submodule init

# 更新子模块
git submodule update

# 克隆包含子模块的仓库
git clone --recursive <url>
```

## ⚙️ Git 配置

### 基础配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 设置默认编辑器
git config --global core.editor "code --wait"

# 设置默认分支名
git config --global init.defaultBranch main

# 启用颜色
git config --global color.ui auto
```

### 常用别名

```bash
# 状态简写
git config --global alias.st status

# 提交简写
git config --global alias.ci commit

# 检出简写
git config --global alias.co checkout

# 分支简写
git config --global alias.br branch

# 美化日志
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

## 🛡️ 最佳实践

1. **频繁提交**：小步快跑，每完成一个小功能就提交
2. **写好提交信息**：清晰描述做了什么改动
3. **使用分支**：不要直接在 main 分支上开发
4. **及时同步**：经常 pull 和 push，避免冲突
5. **.gitignore**：合理配置忽略文件
6. **代码审查**：使用 Pull Request 进行代码审查

## 📚 提交信息规范

推荐使用 Conventional Commits 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

常用类型：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：

```bash
git commit -m "feat(blog): 添加分类功能"
git commit -m "fix(api): 修复登录接口错误"
git commit -m "docs: 更新 README 文档"
```

## 🎯 总结

掌握 Git 是每个开发者的必备技能。通过这些技巧，可以：

- ✅ 提高工作效率
- ✅ 更好地管理代码版本
- ✅ 团队协作更顺畅
- ✅ 避免常见错误

## 📖 参考资源

- [Git 官方文档](https://git-scm.com/doc)
- [Pro Git 中文版](https://git-scm.com/book/zh/v2)
- [Learn Git Branching](https://learngitbranching.js.org/)

---

*工欲善其事，必先利其器* 🛠️

