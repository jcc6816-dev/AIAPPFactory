# AI AgentFactory 阶段进展回顾

更新时间：2026-05-22  
适用阶段：MVP 市场验证前的模板、页面 Agent、数据与发布链路收口  
主工程：[Code](/Users/mike/Documents/AIFactory/Code)

关联文档：

- [PRD-Next-Stage-Template-Agent-Data-Platform.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md)
- [Next-Stage-Development-Plan.md](/Users/mike/Documents/AIFactory/ProjectDocs/Next-Stage-Development-Plan.md)
- [Page-Agent-Pattern.md](/Users/mike/Documents/AIFactory/ProjectDocs/Page-Agent-Pattern.md)
- [Homepage-Template-First-Revamp-Plan.md](/Users/mike/Documents/AIFactory/ProjectDocs/Homepage-Template-First-Revamp-Plan.md)
- [MVP-Runbook.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Runbook.md)

## 1. 阶段目标

这段时间的工作重点已经从“单点功能能跑”转向“形成可演示、可验证、可继续扩展的 MVP 闭环”。

当前共识是产品核心能力围绕四条主线推进：

1. 生成表单能力。
2. 页面 Agent 能力。
3. 工作流能力。
4. 模板能力。

其他能力，如登录、计费、OCR、Webhook、数据列表、统计、发布分享、日志与文档，当前都作为支撑能力服务这四条主线。

## 2. 最近完成的主要工作

### 2.1 模板能力

已完成：

- 建立统一模板数据源 `Code/services/form-templates.ts`。
- 内置 20 个公共高频模板，覆盖线索收集、活动报名、满意度调查、产品推荐、预约咨询、票据收集、招聘申请、资料领取等通用场景。
- 首页模板卡片与生成页模板入口读取同一份模板数据，避免两边文案和能力不一致。
- 首页精选模板支持跳转到 `/forms/new?template=<template_id>`。
- 生成页能根据 query 自动应用模板并生成草稿。
- 模板草稿会携带推荐 `ocr_template` 和 `webhook_provider`。
- 保存模板草稿时，会把推荐 Webhook 平台写入表单配置，为发布页配置做准备。
- 生成页模板区域展示分类、适用场景、字段数、OCR 与推送建议。

价值：

- 用户不必从空白页开始。
- 模板不仅是文案展示，而是能直接生成可保存、可发布的表单草稿。
- 票据类、证件类模板可以自然衔接 OCR。
- 飞书、钉钉、企微等模板推荐可以自然衔接发布页 Webhook 配置。

### 2.2 生成页 Agent

已完成：

- `/api/forms/agent` 作为生成页 Agent 事件流接口保留。
- 生成页支持后端驱动的轻量事件流。
- 初次生成、基于草稿的增量修改、只读检查分开处理。
- 用户输入“检查这个表单是否太长”等只读意图时，不再擅自改动草稿。
- Agent 修改后会返回变更摘要和校验提醒。
- 生成页前端会把 Agent 返回的草稿同步到预览和字段编辑区。

价值：

- 当前已经不是纯前端假事件流。
- 虽然还不是完整 Tool Calling Loop，但已经具备“页面上下文 + 后端工具 + 结构化结果”的雏形。
- 用户可以基于模板继续用自然语言微调表单。

### 2.3 数据页 Agent

已完成：

- 数据页 Agent 支持总结最近提交情况。
- 支持分析字段缺失、OCR 失败、Webhook 失败、文件上传缺失等规则统计。
- 支持自然语言筛选结果。
- Agent 返回的筛选结果可以联动右侧提交列表，不只是文本回答。
- 已补充数据页 Agent 相关单测。

价值：

- 数据页 Agent 开始对页面状态产生真实影响。
- 用户可以用“找出没有上传发票的记录”等自然语言完成筛选。
- 这证明页面 Agent 不只是聊天框，而是可以成为业务页面的操作入口。

### 2.4 发布页 Agent

已完成：

- 发布页 Agent 支持发布配置检查。
- 支持分享链接说明。
- 支持 Webhook 配置诊断。
- 支持飞书、钉钉、企业微信和通用 Webhook 的平台配置建议。
- 支持测试推送前置检查，并明确不会自动外发测试消息。
- 高风险外发动作保留人工确认边界。

价值：

- 用户面对飞书、钉钉等 Webhook 安全设置时，不需要理解太多技术细节。
- 系统会优先给出“关键词优先，签名用于更高安全要求”的实用建议。
- 发布页 Agent 能帮助用户降低集成配置失败率。

### 2.5 页面 Agent 统一规范

已完成：

- 定义页面 Agent 不是泛聊天框，而是页面上下文中的工作副驾驶。
- 统一要求每页必须有快捷任务，避免用户猜 Agent 能做什么。
- 建立统一 `agent_response` 结构，保留向后兼容的 `answer` 字段。
- 明确 Agent 三类行为：
  - 只读分析。
  - 可撤销编辑。
  - 高风险执行。
- 明确高风险动作必须确认，例如发布、推送、删除、扣费、外发数据。

价值：

- 后续所有页面 Agent 都有统一开发准则。
- 可以避免为了噱头堆 AI 聊天框。
- 能逐步从规则 Agent 演进到真实工具 Agent。

### 2.6 首页与模板优先方向

已完成：

- 产品方向从“完整展示所有能力”调整为“让用户一眼知道从模板或一句话开始”。
- 首页当前强调模板、生成、发布、提交、Webhook 与数据查看闭环。
- 模板卡片加入更接近场景的视觉缩略图。
- 明确当前不做模板市场、社区模板、复杂行业方案墙。

价值：

- 更适合 MVP 阶段市场验证。
- 用户第一步更明确。
- 减少从 0 学习表单构建的门槛。

## 3. 最近提交记录

近期关键提交：

- `ac29688 feat: carry template automation presets`
- `aba4f15 feat: guide publish agent integrations`
- `b88a128 feat: link data agent filters to submissions table`
- `7735fef feat: add data agent filter results`
- `6595cad feat: harden form generator agent revisions`
- `af77354 docs: update mvp runbook for agent smoke tests`
- `8ed969d fix: keep form agent inspection read-only`
- `3db5434 feat: standardize page agent responses`
- `a64933a feat: preserve template ocr settings`
- `f758e8c feat: diversify template preview artwork`
- `ecbce2b feat: guide workspace agent to templates`
- `61d06e6 feat: surface templates in workspace`

## 4. 当前已验证情况

最近验证过：

- `npm run test` 通过。
- `npm run build` 通过。
- 发布页 Agent 页面可打开，快捷任务可返回钉钉配置建议和 Webhook 测试前检查。
- 发票票据模板可从 `/zh/forms/new?template=invoice-receipt-collection` 自动生成草稿。
- 模板生成后能看到分类、字段数、适用场景、OCR 与推送建议。
- 数据页 Agent 筛选结果可以影响提交列表。

已有真实链路能力仍以 [MVP-Runbook.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Runbook.md) 为准：

- 分享页提交。
- 文件上传。
- 百度 OCR。
- DeepSeek 结构化。
- Webhook 推送。
- Webhook 日志和重试。

## 5. 当前边界与注意事项

### 5.1 UI 仍不是最终定稿

用户已经明确：涉及核心审美和界面视觉的部分，后续可能由用户亲自重新设计。

因此后续开发应避免：

- 大规模重写创建页视觉。
- 未经确认改首页整体风格。
- 为了“看起来更高级”引入复杂布局和动画。

可以继续做：

- 不破坏现有视觉的功能增强。
- 结构清晰的字段、状态、元信息展示。
- 服务于验收的轻量交互修复。

### 5.2 当前 Agent 仍处于轻量工具阶段

当前 Agent 不是完整多轮自主 Agent，也不是长期记忆 Agent。

当前更准确的定义是：

- 页面上下文明确。
- 后端工具明确。
- 大多数页面优先规则统计。
- 生成页可调用模型生成或修订草稿。
- 高风险操作不自动执行。

后续如果要升级为真实工具 Agent，需要继续设计：

- 工具注册协议。
- 工具输入输出 schema。
- 多步规划。
- 执行确认。
- 事件流协议。
- 成本控制和审计。

### 5.3 模板仍是内置模板，不是模板市场

当前模板体系是：

- 内置公共高频模板。
- 不新增模板数据库。
- 不做模板上传、审核、版本、付费和市场分发。

这样做是为了先验证：

- 用户是否愿意从模板开始。
- 模板能否提升生成质量。
- 模板能否带动 OCR、Webhook 和 Agent 使用。

### 5.4 工作流目前是处理链路，不是可视化编排器

当前工作流更接近：

```text
提交 -> 文件上传 -> OCR -> DeepSeek 结构化 -> 写库 -> Webhook -> 日志
```

暂不做：

- 可视化工作流编排。
- 多节点审批。
- 定时任务。
- 外部事件触发。
- Skill 编排。

## 6. 后续建议路线

后续可以按用户已经确认的顺序继续推进：

```text
C2 -> P -> T -> D
```

当前状态：

- C2：数据页 Agent 筛选联动已经完成。
- P：发布页 Agent 集成指导已经完成。
- T：模板体系第一轮深化已经完成。
- D：演示版本用户倾向自己处理，因此代码侧暂不主动推进视觉演示大改。

建议下一阶段不要继续零散推进，而是按“目标包”推进。

### 6.1 下一包建议：工作流稳定化

目标：

让提交后的处理链路更稳定、可观测、可复现。

建议做：

- 梳理一次提交链路状态字段。
- 确认 OCR 成功、OCR 失败、Webhook 成功、Webhook 失败的页面呈现一致。
- 强化失败原因摘要。
- 增加回归测试覆盖。
- 更新运行手册中的联调步骤。

不做：

- 可视化工作流编排器。
- 审批流程。
- 复杂条件分支。

验收标准：

- 一次带图提交能完整看到 OCR、结构化、Webhook 和日志。
- 出错时能在页面上看懂失败在哪一步。
- 测试能覆盖成功和失败分支。

### 6.2 下一包建议：模板体系第二轮

目标：

让模板不只是“能生成”，而是更能指导用户选对模板。

建议做：

- 模板分类进一步收敛为更少、更好懂的类别。
- 为模板增加 `bestFor`、`notFor` 或 `recommendedWhen` 说明。
- 增加模板到 Agent 快捷任务的更明确映射。
- 增加模板到 OCR / Webhook 默认建议的说明文案。

不做：

- 企业深度行业模板。
- 模板市场。
- 模板数据库。

验收标准：

- 用户能在 30 秒内理解哪个模板适合自己。
- 从模板创建后，Agent 能给出该模板特有的快捷修改建议。
- 保存后的表单能自然进入发布页配置。

### 6.3 下一包建议：页面 Agent 真实工具化第一步

目标：

不做复杂 Agent 框架，先把页面 Agent 工具协议固定下来。

建议做：

- 定义页面 Agent 工具注册结构。
- 把现有规则能力包装为明确工具。
- 统一工具执行日志。
- 统一只读、编辑、高风险三类动作。

不做：

- 长期记忆。
- 多 Agent 协作。
- 自动改代码。
- 让模型直接操作数据库。

验收标准：

- 每个页面 Agent 能列出它有哪些工具。
- 每次执行能看到调用了哪个工具。
- 高风险工具默认不执行，只返回确认请求。

### 6.4 部署准备

目标：

为后续线上演示做环境和安全收口。

建议做：

- 补全生产环境变量清单。
- 确认 Supabase RLS 策略。
- 确认正式登录方式。
- 确认 Vercel + Supabase + R2 或替代部署方案。
- 建立上线前回归清单。

不做：

- 大规模商业化套餐改造。
- 多租户复杂隔离。
- 企业 SSO。

验收标准：

- 新环境按文档能完整部署。
- 核心链路能跑通。
- 不提交任何真实密钥。

## 7. 当前协作建议

建议后续继续采用“目标包”模式，而不是每次问一个很小的下一步。

每个目标包建议包含：

- 目标。
- 范围。
- 不做什么。
- 涉及文件。
- 验收标准。
- 自动测试。
- 浏览器或手动验收。
- 独立提交。

这样可以减少碎片化推进，也更适合你统一验收。

## 8. 需要特别保护的边界

后续 AI 协作必须注意：

- 不擅自重写用户正在思考的核心 UI。
- 不把 PRD V2.8 的长期能力提前塞进 MVP。
- 不引入模板市场、工作流编排器、Skill 编排等超范围能力。
- 不把 Agent 做成只有静态文案的假聊天框。
- 不让模型直接执行高风险动作。
- 不提交 `.env.local`、密钥和本地测试数据。
- `Code/data/dev-*.json` 属于本地演示数据，除非明确要求，否则不应提交。

## 9. 一句话当前状态

当前系统已经从“AI 表单生成 MVP”推进到了“模板启动 + 页面 Agent + 数据筛选 + 发布集成指导”的可演示阶段。

下一步最值得做的不是继续堆 UI 细节，而是把工作流链路、模板选择价值和页面 Agent 工具化继续做稳，为后续真实市场验证铺路。
