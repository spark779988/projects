# WP 01 — Git 代码管理与远程仓库

> WP 指 Workflow / Work Procedure，即可以照着复现的操作流程。

## 1. 目标

从“检查电脑是否安装 Git”开始，完成 Git 全局配置、本地仓库初始化、提交、GitHub/Gitee 远程仓库关联和推送验证，为后续网站开发与部署建立版本管理基础。

本次结果：

- 本地项目：`C:\Users\SparK\Desktop\工作\myself-website`
- 默认分支：`main`
- Git 远程：GitHub `origin`、Gitee `gitee`
- GitHub 当前部署提交：`9252671`
- 远程仓库：
  - <https://github.com/spark779988/projects>
  - <https://gitee.com/spark779988/projects-site>

## 2. 检查 Git 环境

先确认 Git、Node.js 和 npm 是否可用：

```powershell
git --version
node --version
npm --version
```

本次环境：

```text
git version 2.56.0.windows.2
v24.20.0
11.19.0
```

Git 已经安装，因此无需重复安装。

## 3. 配置 Git 身份

先检查全局配置：

```powershell
git config --global --get user.name
git config --global --get user.email
```

未配置时，将用户提供的提交身份写入全局 Git 配置。邮箱属于个人信息，本 WP 不记录具体值。

```powershell
git config --global user.name "Spark779988"
git config --global user.email "用户指定的 Git 邮箱"
```

同时设置适合 Windows 和网站项目的基础规则：

```powershell
git config --global init.defaultBranch main
git config --global core.autocrlf true
git config --global core.safecrlf warn
git config --global pull.rebase false
```

验证：

```powershell
git config --global --list --show-origin
git config --get user.name
git config --get user.email
```

## 4. 初始化本地仓库

进入项目目录：

```powershell
cd "C:\Users\SparK\Desktop\工作\myself-website"
git init -b main
```

检查状态：

```powershell
git rev-parse --is-inside-work-tree
git branch --show-current
git status --short --branch
```

预期：

```text
true
main
## No commits yet on main
```

## 5. 创建网站项目忽略规则

项目根目录新增 `.gitignore`，忽略以下内容：

- 操作系统文件：`.DS_Store`、`Thumbs.db`、`desktop.ini`
- 编辑器配置：`.vscode/`、`.idea/`
- 依赖目录：`node_modules/`
- 本地环境变量：`.env`、`.env.*`，保留 `.env.example`
- 构建目录：`dist/`、`build/`
- 缓存和测试结果：`.cache/`、`.vite/`、`.parcel-cache/`、`coverage/`
- 日志和临时文件：`*.log`、`*.tmp`
- 浏览器自动化产物：`.playwright-mcp/`

创建图片资源目录：

```powershell
New-Item -ItemType Directory -Path "assets" -Force
```

空目录默认不会被 Git 跟踪，因此加入 `assets/.gitkeep`。

## 6. 创建首次本地提交

只暂存明确需要的文件：

```powershell
git add .gitignore assets/.gitkeep
git commit -m "chore: initialize website project"
git status --short --branch
git log -1 --pretty=fuller
```

首次提交：

```text
17b4f2b chore: initialize website project
```

## 7. 处理 Git 目录所有权警告

本次在 Codex 沙盒中遇到了以下提示：

```text
detected dubious ownership in repository
```

原因是 `.git` 由沙盒隔离账户创建，而运行命令的 Windows 账户是 `SparK`。

只对当前明确项目路径添加安全例外：

```powershell
git config --global --add safe.directory "C:/Users/SparK/Desktop/工作/myself-website"
```

不要使用通配符或直接关闭所有安全目录检查。

## 8. 创建和关联远程仓库

### 8.1 GitHub

创建空仓库：

```text
https://github.com/spark779988/projects.git
```

可见性：公开。

### 8.2 Gitee

尝试创建 `projects` 时，Gitee 提示该路径是保留关键字。最终配置：

- 仓库名称：`projects`
- 实际路径：`projects-site`
- 地址：`https://gitee.com/spark779988/projects-site.git`
- 初次创建时可见性：私有

当时 Gitee 新账号如需创建公开仓库，还需要开启 2FA 或绑定指定第三方账号。

### 8.3 添加远程

```powershell
git remote add origin "https://github.com/spark779988/projects.git"
git remote add gitee "https://gitee.com/spark779988/projects-site.git"
git remote -v
```

远程命名约定：

- `origin`：GitHub，主远程和 EdgeOne 部署来源
- `gitee`：Gitee，第二个备份远程

## 9. 提交、推送和验证

首次推送：

```powershell
git push -u origin main
git push -u gitee main
```

将默认跟踪远程恢复为 GitHub：

```powershell
git branch --set-upstream-to=origin/main main
```

验证本地与远程 SHA：

```powershell
$local = git rev-parse HEAD
$github = (git ls-remote origin refs/heads/main).Split("`t")[0]
$gitee = (git ls-remote gitee refs/heads/main).Split("`t")[0]
[PSCustomObject]@{
  LocalHead = $local
  GitHubMatches = ($local -eq $github)
  GiteeMatches = ($local -eq $gitee)
} | Format-List
```

两份远程 SHA 都与本地一致时，才能认为推送完成。

## 10. 后续提交变化

项目后续产生了以下关键提交：

```text
e26a7bb chore: install frontend-design skill
9252671 feat: build personal homepage
```

GitHub 已推送至 `9252671`。

Gitee 在启用 2FA 后，HTTPS 推送收到 `403`：

```text
Two-factor authentication (2FA) is enabled for your account.
Please use a personal access token instead of your password.
```

因此当前 Gitee 分支停留在：

```text
d270f6f chore: ignore browser automation artifacts
```

这不是本地代码丢失，而是 Gitee 需要新的认证方式。

## 11. Gitee 恢复推送的方法

二选一：

### 方案 A：私人令牌

1. 登录 Gitee。
2. 打开“设置 → 私人令牌”。
3. 创建只具备仓库读写所需最小权限的令牌。
4. 在执行 `git push gitee main` 时，将令牌作为 HTTPS 密码使用。
5. 不要把令牌写进仓库、命令历史或 Markdown。

### 方案 B：SSH

1. 生成 SSH 密钥。
2. 将公钥添加到 Gitee。
3. 将远程地址改为 SSH 形式。
4. 执行 `ssh -T git@gitee.com` 验证。
5. 再运行 `git push gitee main`。

## 12. 日常检查清单

- [ ] `git status` 中没有未知或不应提交的文件
- [ ] 敏感信息未进入暂存区
- [ ] 提交说明准确描述本次改动
- [ ] 本地提交已经推送到 GitHub
- [ ] 需要双远程备份时，Gitee 认证仍然有效
- [ ] 发布前本地与远程 SHA 一致

