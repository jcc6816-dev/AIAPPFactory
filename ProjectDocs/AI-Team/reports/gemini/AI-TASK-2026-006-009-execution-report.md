# 执行报告：Homepage Activation Audit

- **任务 ID**: AI-TASK-2026-006-009
- **状态**: SUBMITTED
- **读取的文件**:
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_growth_operating_guideline.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
  - `/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx`
  - `/Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx`
- **修改的文件**: none
- **实际完成的工作**:
  - 审计了首页（`page.tsx`）的首屏布局、首尾信息、各子模块的展现逻辑。
  - 详细剖析了 Hero 区域（`hero/index.tsx`）的 Prompt 提交跳转机制，以及右侧高物理拟真交互 Mockup 的操作漏斗。
  - 针对从“游客进入 ➔ 体验生成 ➔ 注册激活 ➔ 发布使用”的完整链路，找出了 5 个影响用户转化的关键摩擦点，并给出了具体设计建议。
- **执行的命令**: none
- **验证结果**:
  - 审计结果完全基于现有代码，没有修改任何 `Code/**` 文件。
  - 所有优化方向均紧密围绕 MVP 的核心功能，拒绝任何大改版或泛泛的营销空话。
- **风险与不确定点**: none
- **后续建议**:
  - 建议 Mike 审核后，让 Codex 优先跟进“Mockup 最终页跳转”和“首屏预设 Prompt 标签”这两个高性价比的轻量优化项。

---

## 首页激活链路的 5 个关键改进点

### 改进点 1：首屏右侧交互 Mockup 最终页缺少转化跳转（最高杠杆）
- **问题现状**: 
  - Hero 区域右侧的 Typeform 风格交互 Mockup 设计非常精美，用户可以模拟选择业务诉求（线索收集、活动报名、反馈调查），输入工作邮箱进行“认证”。
  - 但当用户完成这三步进入 Slide 3 时，界面仅显示“体验环境已准备完毕”，下方的按钮是“重新开始 ↺”。
- **转化瓶颈**: 这是一个极大的流量浪费。用户已经表达了具体的表单类型意向，并留下了工作邮箱，但最终页却将他们拦截在原地，没有将他们带入真实的产品工作流中。
- **具体建议**:
  - 将 Slide 3 的“重新开始 ↺”主按钮，改为 **“进入我的测试沙箱 →” (Enter My Sandbox →)**。
  - 用户点击该按钮后，直接重定向到 `/[locale]/forms/new`。
  - **参数带入**: URL 自动携带用户在 Slide 1 选择的模板类型（如 `?template=lead-capture` 或 `?template=event-registration`），并可以通过 query 携带或 sessionStorage 自动填充刚才填写的邮箱，直接进入 AI 表单生成界面，实现无缝衔接。

### 改进点 2：建立“游客免登录试用模式”（Guest Playground）
- **问题现状**:
  - 用户在首屏输入 Prompt 或在 Landing 页点击“创建表单”后，系统会跳转到创建页，但在没有登录的情况下，通常会被 NextAuth 中间件拦截或在保存时遇到登录墙。
- **转化瓶颈**: 在用户还没有感知到 AI 表单生成的真正威力前，强制注册会带来极高的摩擦力，导致大量冷启动流量流失。
- **具体建议**:
  - 允许**游客（免登录）**直接在 `/[locale]/forms/new` 中体验 AI 生成流程，并能在右侧预览面板中实时交互。
  - **流失控制**: 只有当游客点击“保存场景”或“发布表单”（即需要往数据库写数据或生成公开外链）时，才弹出轻量级登录/注册模版（Sign-in Modal）。此时由于他们已经看到了生成的精美表单，注册意愿会成倍增加。

### 改进点 3：在主输入框下方增加“一键试用预设 Prompt”标签 (Quick Suggestions)
- **问题现状**: 
  - 首页 Hero 区域的主输入框只提供了一个 Placeholder。
- **转化瓶颈**: 很多用户在冷启动进入网站时，脑子里没有现成的 Prompt 想法，手打 Prompt 存在输入摩擦。
- **具体建议**:
  - 在主输入框下方新增一行扁平风格的预设 Prompt 标签，例如：
    - `[Try: SaaS Lead Capture]` (线索收集)
    - `[Try: Tech Summit RSVP]` (活动报名)
    - `[Try: Customer NPS Survey]` (NPS 调查)
  - 用户点击标签后，输入框自动填充对应文本，并可选择自动触发生成。这能直观展示产品的边界，并给没有想法的用户提供一键体验的通道。

### 改进点 4：首屏英文 Value Prop 精准聚焦（提升商业定位）
- **问题现状**:
  - 现有的英文首屏 Title: `"Generate publishable data-collection scenarios with AI and templates"` 表达较长且稍显学术，未能一针见血指明核心卖点。
- **转化瓶颈**: 访客前 3 秒内如果看不懂产品是干什么的、有什么特色，就会直接流失。
- **具体建议**:
  - 将英文标题精简为更具吸引力和核心竞争力的文案：
    - **标题 (H1)**: `"Create Beautiful Typeform-Like Forms in 30 Seconds with AI"`
    - **副标题 (Subtitle)**: `"Generate responsive flows from a single prompt. Automatically route submissions to Feishu, DingTalk, WeCom, or Webhooks. No coding required."`
  - 这能瞬间让用户明白：1) 像 Typeform 一样漂亮；2) AI 生成极快；3) 支持国内/国际主流 Webhook 自动化推送。

### 改进点 5：首页嵌入一个“真正可填写的交互式表单演示”（Showcase Live Embed）
- **问题现状**:
  - 首页隐藏了大部分传统 SaaS 长滚动板块（Branding, Features, Benefits），这是对的，能保持 Typeform 的极简空气感。但目前整站没有一个能让游客“在不跳转的情况下，直接动手填一下”的表单实例。
- **转化瓶颈**: 纸上得来终觉浅，直接体验单题流交互是展示产品品质最快的方式。
- **具体建议**:
  - 在首页首屏下方或特定区域，直接嵌入一个默认加载的、真实的轻量单题流表单（例如“GenForms 体验官登记”表单）。
  - 用户不需要跳转，在首页就能点几下，滑一滑，直观感受 GenForms 的物理拟真动效和流畅度。填写完毕后提示“你想用 AI 生成一个类似的表单吗？”，点击带入创建页。
