# Open Design Artifact 模式经验

## 背景

AI FormFactory 当前已经不是传统的“AI 问答工具”，而是在构建一种可保存、可预览、可编辑、可发布、可运营的 AI 表单资产创作流程。

在这个方向上，`nexu-io/open-design` 的 Artifact 模式有很强的参考价值。它的核心启发不是具体代码，而是产品对象和生成流程的组织方式：

- AI 不只输出文字，而是生成可运行的作品对象。
- 每个作品对象都有结构化元数据、主输出、资源和历史记录。
- 用户可以持续预览、编辑、导出或复用这个对象。
- 生成过程被 Skill、Design System、Checklist 等规则约束，减少模型自由发挥带来的不稳定。

参考项目：

- https://github.com/nexu-io/open-design
- https://github.com/nexu-io/open-design/blob/main/docs/architecture.md
- https://github.com/nexu-io/open-design/blob/main/QUICKSTART.md

## 核心判断

AI FormFactory 现在做的也是 Artifact 模式，只是 Artifact 类型不同。

Open Design 的 Artifact 通常是网页原型、移动端界面、PPT、文档或其他设计产物。AI FormFactory 的 Artifact 应该是“可发布的表单业务资产”。

也就是说，我们的核心产物不是一段回答，也不是一次性 JSON，而是：

> Form Artifact = schema + visual settings + generation metadata + version history + publish state

## 可借鉴经验

### 1. Artifact 要成为一等对象

当前表单 schema 已经承担了主要产物职责，但还可以更明确地升级为 Form Artifact。

一个 Form Artifact 至少应该包含：

- 表单标题、描述和字段 schema
- Step Flow / Long Form 布局
- Phone / Desktop 默认预览偏好
- Theme / Visual FX / Visual Direction
- 来源 prompt 与澄清问答
- 生成模型、生成时间、生成版本
- 草稿、已发布、已归档等状态
- 发布链接、二维码、提交统计

这样表单不再只是“数据库里的一条记录”，而是一个可以被创作、管理、复用和优化的资产。

### 2. Skill 和视觉系统要分离

Open Design 的一个关键设计是：Skill 决定生成什么，Design System 决定长什么样。

AI FormFactory 可以借鉴为：

- 表单类型/业务 Skill：Lead Capture、Event Registration、Feedback Survey、Application Form
- 视觉方向：Premium Event、Corporate Intake、Creator Launch、Finance Ops、Warm Feedback
- 视觉参数：Theme、Visual FX、Phone/Desktop、Step Flow/Long Form

这样用户选择的是“意图 + 视觉方向”，系统内部再映射到受控 schema，而不是让用户面对一堆散乱配置。

### 3. 先锁定 Brief，再开始生成

Open Design 会先通过 discovery form 锁定 surface、audience、tone、brand context，再让模型生成。

AI FormFactory 也应该强化这个模式：

1. 用户输入一句话需求。
2. AI 判断需求是否足够明确。
3. 若不明确，提出 2-4 个澄清问题。
4. 用户选择行业、目标、字段复杂度、视觉方向等关键选项。
5. 系统再生成受控 Form Artifact。

这个流程比直接生成更稳定，也更像专业创作工具。

### 4. 生成必须受控

受控 Artifact 的关键是：AI 输出必须符合产品可渲染、可保存、可发布的结构。

对 AI FormFactory 来说，生成结果必须约束在：

- 允许的字段类型
- 允许的布局类型
- 允许的主题枚举
- 允许的视觉效果枚举
- 允许的设备偏好
- 可提交、可校验、可发布的数据结构

AI 可以有创造力，但不能绕开 schema 边界。

### 5. 预览不是装饰，而是 Artifact 的运行环境

Open Design 使用 sandbox preview 让 Artifact 生成后立刻可见。

AI FormFactory 的预览区也应该承担同样职责：

- 实时渲染当前 Form Artifact
- 切换 Phone/Desktop
- 切换 Step Flow/Long Form
- 切换 Theme / Direction / Visual FX
- 支持 Demo Mode
- 支持保存草稿和发布前检查

这意味着右侧预览区不是“效果展示”，而是核心创作工作台。

### 6. 历史记录是 Artifact 治理的基础

Open Design 使用 append-only history 记录生成、编辑、评论等动作。

AI FormFactory 后续也应该记录关键事件：

- 初始生成
- 用户选择模板
- 用户切换视觉方向
- AI 添加/删除/重排字段
- 用户保存草稿
- 用户发布版本
- 用户修改已发布表单

这会为回滚、审计、版本比较和后续 AI 优化打基础。

## 对当前 MVP 的边界

当前阶段仍然只做 AI Form Generator MVP，不引入完整平台的 Skill 编排、MCP、OCR、复杂治理、多租户和可视化拖拽编辑器。

Artifact 模式在 MVP 中的落地边界应该是：

- 做 Form Artifact，不做通用 Artifact 平台。
- 做表单 schema 与视觉配置版本化，不做复杂低代码画布。
- 做生成记录和发布状态，不做企业级审批治理。
- 做可测试的核心创作流程，不做过度抽象。

## 结论

Open Design 最值得借鉴的是它把 AI 输出产品化的方式：

> Prompt -> Brief -> Controlled Artifact -> Preview -> Edit -> Save -> Export/Publish -> History

AI FormFactory 可以对应为：

> Prompt -> Clarification -> Form Artifact -> Preview -> Save Draft -> Publish -> Share/Submit -> Analyze

这个方向能让产品从“AI 表单生成器”升级为“AI 表单资产创作台”。
