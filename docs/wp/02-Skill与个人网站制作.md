# WP 02 — Skill 安装与个人网站制作

> 覆盖课程第 3、4、5、6 点：项目级 Skill、网站原料、Plan → Build → Review，以及把视觉规范写入项目记忆。

## 1. 目标

为个人主页安装 `frontend-design` Skill，根据真实个人资料和技术约束制作第一版网站，再经过响应式与交互检查形成可上线版本，并把稳定后的视觉规范写入项目级 `AGENTS.md`。

最终产物：

```text
index.html
styles.css
script.js
assets/favicon.svg
AGENTS.md
.agents/skills/frontend-design/SKILL.md
.agents/skills/frontend-design/LICENSE.txt
skills-lock.json
```

## 2. 安装项目级 Skill

官方安装命令：

```powershell
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

目标是安装到当前项目，而不是全局。对 Codex 来说，项目级 Skill 路径为：

```text
.agents/skills/frontend-design/
```

本次首次克隆 GitHub 时网络超时。最终通过 GitHub 官方源文件完成同一版本的本地安装，再由安装器识别。

Skill 包含：

```text
SKILL.md
LICENSE.txt
```

项目根目录还生成：

```text
skills-lock.json
```

用于记录来源、路径和内容哈希。

验证：

```powershell
npx skills list
```

预期识别结果：

```text
frontend-design
Agents: Codex, GitHub Copilot
Source: anthropics/skills
```

## 3. 准备网站原料

本次使用的真实内容：

- 名称：spark
- 身份：在读大二计算机学生、AI 学习者
- 经历：从大一开始学习网络安全相关知识
- 当前兴趣：学习 AI Agent，把它作为生活和学习的伙伴
- 喜欢的句子：“你若瞄准月亮，即使迷失也是落在星河之间”
- 视觉方向：新粗野主义、黄色和蓝色

技术约束：

- 只使用原生 HTML、CSS 和 JavaScript
- 不使用 Vue、React、Node 后端或数据库
- 添加 `title`、`description` 和基础 Open Graph
- 兼容移动端和 PC

内容原则：

- 不使用“待补充”以外的虚构经历
- 不编造作品、粉丝数、客户、联系方式和项目成果

## 4. Plan：先确定视觉系统

### 4.1 设计目标

页面需要同时表达：

1. 计算机学生的技术感
2. 网络安全学习背景
3. AI 学习伙伴带来的探索感
4. spark 这个名字对应的能量和个性

### 4.2 色彩

| Token | 色值 | 用途 |
| --- | --- | --- |
| 电光黄 | `#ffe600` | 高亮、个人档案、重点区域 |
| 钴蓝 | `#2457ff` | 主视觉、标题、阶段背景 |
| 墨黑 | `#111318` | 粗边框、正文和硬阴影 |
| 纸张白 | `#fffdf4` | 主背景 |
| 冷灰 | `#ecebe4` | 辅助背景 |

### 4.3 字体

- 展示标题：Bahnschrift Condensed → Arial Black → 微软雅黑
- 正文：Aptos → Segoe UI → 微软雅黑
- 引言：Georgia → Times New Roman → 宋体

### 4.4 布局

首屏采用非对称结构：

```text
┌──────────────────────────┬──────────────┐
│ 你好 / 我是 spark        │ 黄色信号牌   │
│ 自我介绍                 │ 蓝色星芒     │
│ 关键词标签               │ 个人档案     │
│ 学习轨迹入口             │ currently... │
└──────────────────────────┴──────────────┘
```

学习经历采用可切换双轨结构：

```text
┌─────────────────────────────────────────┐
│ 网络安全        │ AI 学习伙伴          │
├─────────────────┼───────────────────────┤
│ 文字说明        │ 观察 → 拆解 → ...     │
└─────────────────┴───────────────────────┘
```

### 4.5 方案审查

初版方案如果只是“黄色背景 + 黑色粗字 + 卡片网格”，会落入常见黄蓝粗野主义模板。

实际采用的变化：

- 使用纸张白作为主体，蓝黄只承担结构和重点
- 首屏 memorable element 是蓝色星芒 + 黄色个人信号牌
- 学习经历做成“双轨路径”，与真实经历对应
- 引言使用整块蓝色海报结尾，不再追加同质卡片
- 动效只有首屏鼠标粒子，且尊重触屏和减少动态设置

## 5. Build：实现网站

### 5.1 HTML

`index.html` 包含：

- 跳转主要内容链接
- 品牌和页内导航
- `h1` 个人标题
- 个人关键词
- 个人信号牌
- 网络安全 / AI 双轨标签页
- 关于我与做事原则
- 引言海报
- 页脚

基础 SEO：

```html
<title>spark — 计算机学生 / AI 学习者</title>
<meta name="description" content="...">
<meta property="og:type" content="website">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:locale" content="zh_CN">
```

### 5.2 CSS

`styles.css` 实现：

- CSS 设计 Token
- 桌面双栏首屏
- 980px 以下改为单列
- 680px 以下移动端导航和双轨面板
- 可见焦点样式
- 减少动态模式
- 不使用外部 UI 框架

### 5.3 JavaScript

`script.js` 实现：

1. 网络安全 / AI 标签页点击切换
2. `ArrowLeft`、`ArrowRight`、`Home`、`End` 键盘切换
3. 正确的 `aria-selected`、`tabindex` 和 `hidden` 状态
4. 首屏 pointer fine 设备上的 spark 粒子
5. `prefers-reduced-motion` 下关闭粒子
6. 自动更新页脚年份

## 6. Review：检查和修复

### 6.1 响应式

检查宽度：

- `1440px` 桌面
- `768px` 平板
- `390px` 手机

验证结果：

- 页面 `scrollWidth` 不超过可视宽度
- 双轨面板在手机端改为单列
- 首屏标题、标签和按钮不被横向裁切
- 导航和焦点元素可操作

### 6.2 可访问性

- 页面只有一个主 `h1`
- 使用 `header`、`main`、`section`、`footer`
- 标签页使用 `role="tablist"`、`role="tab"`、`role="tabpanel"`
- 按钮具备 `aria-selected` 和 `aria-controls`
- 提供跳转主要内容的 skip link
- 焦点轮廓清晰
- 动画遵循 `prefers-reduced-motion`

### 6.3 修正过的问题

1. 首屏介绍中的中文在“技术”中间换行，改为两个完整的语义段落。
2. 引言在宽屏下把“间”单独挤到下一行，通过缩小字级和扩大版心修复。
3. 中文源码换行引入多余空格，整理为连续句子。
4. 浏览器测试使用 `.playwright-mcp/` 产生临时文件，已加入 `.gitignore`。

### 6.4 资源验证

```text
index.html       200
styles.css       200
script.js        200
favicon.svg      200
```

JavaScript 语法通过 `node --check script.js`。

## 7. 把视觉规范写入项目记忆

项目根目录新增 `AGENTS.md`，只记录稳定、可复用的规范：

- 技术边界
- 色彩、字体、版式
- 新粗野主义和需要避免的模板化元素
- 内容真实性原则
- 动效限制
- 390 / 768 / 桌面验证要求

以后修改网站时，Codex 会先读取该文件，不需要在每轮重新解释全部视觉标准。

## 8. 增量迭代原则

第二版以后：

- 保留已经确认的文案、结构和视觉系统
- 不重复发送整份初始 Prompt
- 每轮只修改明确问题
- 动画先列方案再实施
- 视觉方向无法继续收敛时，使用具体参考模板，而不是无限随机重做

## 9. 验收清单

- [ ] `frontend-design` 安装为项目级 Skill
- [ ] 已生成 `skills-lock.json`
- [ ] 技术栈只有原生 HTML/CSS/JS
- [ ] `title`、`description` 与 Open Graph 完整
- [ ] 内容来自用户资料，没有虚构成果
- [ ] 首屏、学习双轨和引言模块完整
- [ ] 桌面、平板、手机无横向溢出
- [ ] 标签页鼠标和键盘均可操作
- [ ] 动效尊重减少动态设置
- [ ] 项目 `AGENTS.md` 已记录稳定视觉规范

