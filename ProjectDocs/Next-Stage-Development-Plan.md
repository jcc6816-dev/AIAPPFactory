# AI AgentFactory 下一阶段开发执行计划

版本：V1.0  
更新时间：2026-05-20  
适用阶段：模板 + Agent + 工作流市场验证阶段  
关联文档：

- [PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md)
- [Page-Agent-Pattern.md](/Users/mike/Documents/AIFactory/ProjectDocs/Page-Agent-Pattern.md)
- [Universal-Template-Catalog-V1.md](/Users/mike/Documents/AIFactory/ProjectDocs/Universal-Template-Catalog-V1.md)

## 1. 执行原则

后续开发围绕四个核心能力推进：

1. 生成表单能力。
2. Agent 能力。
3. 工作流能力。
4. 模板能力。

其他能力如登录、计费、OCR、Webhook、数据列表、统计、发布分享、审计日志，均作为辅助能力处理。

每一阶段必须满足：

- 能解释清楚它增强了哪一个核心能力。
- 有明确验收标准。
- 不扩展到 PRD 明确暂不做的长期能力。
- 不擅自大改用户正在调整的核心 UI。

## 2. 开工前整理

目标：

先整理当前代码边界，避免把未确认 UI 改动、Agent 雏形和后续模板开发混在一起。

当前需要注意的未提交代码：

- `Code/components/forms/form-generator.tsx`
- `Code/components/forms/form-preview-panel.tsx`
- `Code/components/forms/form-preview.css`
- `Code/app/api/forms/agent/route.ts`

执行事项：

- 确认哪些改动是用户认可的 UI 或功能改动。
- 确认 `/api/forms/agent` 是否作为后续 Agent 能力基础保留。
- 后续提交按功能拆分，避免文档、UI、Agent、模板混在一个提交里。

验收标准：

- 开发前清楚知道哪些文件是已有改动，哪些是本轮新增改动。
- 不覆盖用户自行调整的 UI 文件。
- 后续每个阶段都有独立提交边界。

## 3. Phase 1：模板库 MVP

目标：

让用户不再从 0 开始，而是从高质量场景模板开始创建表单。

核心能力：

- 模板能力。
- 生成表单能力。
- Agent 能力的快捷任务入口。

建议文件范围：

- 新增 `Code/services/form-templates.ts` 或 `Code/lib/form-templates.ts`
- 修改 `Code/components/forms/form-generator.tsx`
- 必要时新增模板类型定义文件

功能范围：

- 定义 `SceneTemplate` 数据结构。
- 内置 6 到 8 个通用增长模板。
- 生成页支持选择模板。
- 模板可一键生成草稿。
- 模板携带 `agentQuickActions`。
- Agent 区域能基于模板提示“你可以让我做什么”。

首批模板：

- 线索收集表。
- 联系我们表。
- 活动报名表。
- 活动反馈表。
- 客户满意度调查。
- 产品推荐问卷。
- 预约咨询表。
- 招聘申请表。

不做：

- 模板市场。
- 模板数据库。
- 用户自定义公开模板。
- 模板付费分层。
- 模板版本系统。
- 企业行业深度模板。

验收标准：

- 不输入 Prompt，也能从模板生成可预览、可保存的表单。
- 每个模板都有字段、主题、Agent 快捷任务。
- Prompt 生成能力不被破坏。
- 模板实现不依赖新增数据库表。

## 4. Phase 2：生成页 Agent 增量修改

目标：

让用户基于模板或现有草稿，通过自然语言持续调整表单。

核心能力：

- Agent 能力。
- 生成表单能力。

建议文件范围：

- `Code/app/api/forms/agent/route.ts`
- `Code/components/forms/form-generator.tsx`
- 可能新增 `Code/services/form-agent-tools.ts`

功能范围：

- 支持把当前草稿 schema 传给 Agent。
- 增加 `generator.revise_form_schema` 语义能力。
- 增加 `generator.validate_form_schema` 语义能力。
- 增加变更摘要。
- Agent 返回修改后的 schema。
- 前端预览随 schema 更新。

执行策略：

- 第一阶段采用 Plan-Then-Execute。
- 模型只负责理解、规划、生成结构化修改建议。
- 后端负责校验和执行 schema 修改。
- 通过 SSE 输出阶段事件。

不做：

- 长期记忆。
- 多 Agent 协作。
- 自动发布。
- Tool Calling Loop。
- 删除表单等高风险自动操作。

验收标准：

- 用户说“加一个手机号字段”，预览真实增加字段。
- 用户说“精简到 5 个问题”，Agent 能修改 schema 并说明修改内容。
- 用户说“检查这个表单是否太长”，Agent 能给建议但不擅自修改。
- 所有 schema 修改通过现有校验。

## 5. Phase 3：工作流稳定化

目标：

让提交后的数据处理链路稳定、可追踪、可演示。

核心能力：

- 工作流能力。

建议文件范围：

- 表单提交 API。
- OCR / LLM 处理服务。
- Webhook 服务。
- `workflow_runs` 与 `webhook_logs` 相关模型和页面。

功能范围：

- 梳理提交链路：提交、文件上传、OCR、DeepSeek 结构化、写库、Webhook。
- 明确成功、失败、重试中的状态。
- 强化错误信息。
- 强化日志可读性。
- 页面上能看到关键处理结果和失败原因。

不做：

- Google Vision OCR 立即接入。
- PDF OCR 深度处理。
- 可视化工作流编排器。
- 多步骤审批流。

验收标准：

- 一次带图片提交能完整产生 OCR、LLM 结构化和 Webhook 记录。
- Webhook 失败后可看懂原因。
- Webhook 失败可重试。
- 数据库中能追踪处理链路。

## 6. Phase 4：数据页 Agent

目标：

让用户感受到收集到的数据可以被 AI 理解和处理。

核心能力：

- Agent 能力。
- 工作流能力。

建议文件范围：

- 数据列表页。
- 数据统计服务。
- 可能新增数据页 Agent API。

功能范围：

- 总结最近提交。
- 统计字段缺失。
- 识别异常记录。
- 总结 OCR 成功率和 Webhook 成功率。

执行策略：

- 优先用数据库查询和规则统计。
- LLM 只负责解释和总结。
- 不把大量原始提交数据直接发送给大模型。

不做：

- 复杂 BI。
- 自定义报表系统。
- 长期记忆。
- 自动数据修复。

验收标准：

- 用户能问“最近提交情况怎么样？”
- Agent 能输出提交数量、常见缺失字段、OCR 成功率、Webhook 成功率。
- Token 消耗可控。
- 不暴露敏感原始数据。

## 7. Phase 5：部署与市场验证准备

目标：

让系统具备可演示、可部署、可小范围客户试用的基础条件。

核心能力：

- 四个核心能力的整体收口。

功能范围：

- 更新环境变量清单。
- 补充 Supabase RLS 策略。
- 明确正式登录方案。
- 整理 OCR / LLM provider 配置说明。
- 整理 Webhook 测试说明。
- 准备标准演示脚本。

验收标准：

- 新环境能按文档完成部署。
- 演示人员能按脚本走完整链路。
- 核心链路失败时有排错入口。
- 不依赖开发者口头说明才能演示。

## 8. 推荐实施顺序

### 8.1 当前实施进度（2026-05-21）

已完成：

- 模板库 MVP：已内置通用模板，并支持从模板生成草稿。
- 工作流稳定化：
  - Webhook 失败日志可读化。
  - Webhook 失败可在日志页手动重试。
  - 提交列表中的提交、OCR、Workflow 状态已统一为可读文案。
- 页面级 Agent 轻量后端化：
  - 工作台 Agent：`/api/forms/workspace-agent`
  - 数据页 Agent：`/api/forms/:id/data-agent`
  - 分析页 Agent：`/api/forms/:id/analytics-agent`
  - 发布页 Agent：`/api/forms/:id/publish-agent`

当前 Agent 实现边界：

- 优先使用后端规则统计，不调用大模型，不消耗 Token。
- 不把大量原始提交数据发送给模型。
- 发布页不自动修改配置，不自动外发测试事件。
- 分析页漏斗当前只做边界说明，尚未具备真实访问/开始填写埋点。

下一步建议：

1. 回到生成页 Agent 做深，完善自然语言增量改表单能力。
2. 做部署与演示准备，补齐环境变量、OCR/LLM/Webhook 测试脚本和演示 Runbook。
3. 如要继续强化数据页，再做筛选结果影响表格视图，而不是只返回文字摘要。

推荐顺序：

1. 整理当前未提交代码边界。
2. 实现模板库 MVP。
3. 实现生成页 Agent 增量修改。
4. 稳定工作流链路。
5. 实现数据页 Agent。
6. 做部署与演示准备。

原因：

- 模板能最快降低用户上手难度。
- 模板给 Agent 提供稳定上下文。
- Agent 修改能力依赖稳定 schema。
- 工作流证明业务闭环价值。
- 数据页 Agent 需要真实提交数据做支撑。

## 9. 当前明确不做

- 模板市场。
- 企业行业模板凭空设计。
- 多租户复杂架构。
- Skill 商店。
- Workflow 可视化编排。
- 审批流。
- Agent 长期记忆。
- 多 Agent 协作。
- AI 自动发布。
- OpenClaw / MCP 对外开放。

## 10. 完整演示目标

最终需要支撑一条完整演示链路：

```text
用户选择一个高质量模板
→ Agent 解释模板用途和可修改方向
→ 用户要求按自身业务修改
→ Agent 修改表单字段
→ 用户发布分享链接
→ 外部用户提交数据和文件
→ 系统 OCR 识别并用 DeepSeek 结构化
→ 数据写库
→ Webhook 推送到外部系统
→ 数据页 Agent 总结提交情况
```

这条链路跑通且稳定后，产品才具备下一阶段市场验证价值。
