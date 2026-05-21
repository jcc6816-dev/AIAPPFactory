# 页面级 Agent 模式设计文档

## 1. 背景与目标

当前产品已经逐步形成一种统一界面模式：主内容区承载页面业务，左侧 Agent 区域承担辅助工作入口。

这个模式的目标不是在每个页面放一个“AI 聊天框”，而是让 Agent 成为页面上下文里的工作副驾驶：

- 在用户不知道从哪里开始时，给出明确快捷任务。
- 在用户已有目标时，理解当前页面上下文并调用页面工具。
- 在结果产生后，直接影响当前页面的预览、筛选、分析或配置。
- 在高风险操作前，明确展示影响并等待用户确认。

一句话定义：

> 页面级 Agent = 统一 Agent 交互外壳 + 页面上下文 + 页面专属工具 + 风险确认机制。

## 2. 核心原则

### 2.1 Agent 必须有真实工作价值

每个页面的 Agent 至少要能完成 2 到 3 个真实任务，否则不应上线该页面 Agent。

不合格示例：

- 只会回答泛泛问题。
- 不知道当前页面数据。
- 不能调用任何工具。
- 不能影响页面状态。

合格示例：

- 生成页 Agent 能生成、修改、校验表单。
- 数据页 Agent 能筛选、总结、发现异常提交。
- 发布页 Agent 能检查 Webhook 配置并解释失败日志。

### 2.2 Agent 必须依赖页面上下文

Agent 不应该猜用户当前在哪里，也不应该凭空回答。每个页面必须明确提供上下文：

```ts
type AgentPageContext = {
  page: "dashboard" | "generator" | "submissions" | "analytics" | "publish" | "settings";
  resourceId?: string;
  locale?: string;
  summary: string;
  data?: unknown;
  allowedTools: string[];
};
```

### 2.3 工具执行必须在后端

模型负责理解、规划和总结；真正的业务执行必须由后端工具完成。

这样可以避免：

- 模型直接改数据库。
- 模型绕过权限。
- 模型生成不符合系统约束的数据。
- 未来更换大模型时业务逻辑被绑死。

### 2.4 高风险操作必须确认

Agent 行为分为三类：

| 类型 | 示例 | 是否需要确认 |
| --- | --- | --- |
| 只读分析 | 总结数据、解释指标、检查配置 | 不需要 |
| 可撤销编辑 | 修改表单草稿、调整字段顺序、切换主题 | 建议显示变更摘要 |
| 高风险执行 | 发布、推送 Webhook、删除、扣费、外发数据 | 必须确认 |

### 2.5 禁止把 Agent 做成噱头聊天框

团队必须明确区分三种状态：

| 类型 | 含义 | 是否符合目标 |
| --- | --- | --- |
| 假事件流 | 前端定时播放固定文案，不依赖后端任务 | 不符合，仅可临时占位 |
| 轻量事件流 | 后端真实推送事件，但事件文案和工具链较固定 | 可作为 MVP 过渡 |
| 真实工具 Agent | 模型基于上下文规划任务，后端按工具协议执行并回传结果 | 目标方向 |

当前允许从“轻量事件流”起步，但必须朝“真实工具 Agent”演进。

禁止长期停留在以下状态：

- 左侧只显示静态提示文案。
- Agent 不知道当前页面上下文。
- Agent 不能调用后端工具。
- Agent 输出无法影响当前页面。
- Agent 只是把普通接口包装成“AI 正在思考”。

### 2.6 每页必须先提供明确可点的快捷任务

用户不应猜 Agent 能做什么。每个页面左侧 Agent 区域必须先展示 3 到 5 个快捷任务。

快捷任务必须满足：

- 任务名称具体，不写空泛口号。
- 用户点击后能立即触发 Agent 能力或填充输入框。
- 明确影响范围，例如“只分析数据”“会修改右侧草稿”“需要确认后才推送”。
- 每个快捷任务都应对应一个页面工具或一个明确 Agent 流程。

不推荐：

```text
帮我看看
智能分析
优化一下
```

推荐：

```text
检查当前表单是否太长
把电话字段改成邮箱
找出没有上传发票的提交
解释最近 10 条 Webhook 失败原因
```

## 3. 统一交互结构

每个页面左侧 Agent 区域建议由 5 个部分组成。

### 3.1 页面专属欢迎语

欢迎语必须说明当前页面 Agent 的角色和边界。

生成页示例：

```text
我是你的表单设计 Agent，可以帮你生成表单、修改字段、优化填写体验。
```

数据页示例：

```text
我是你的数据分析 Agent，可以帮你筛选提交记录、总结趋势、发现异常数据。
```

发布页示例：

```text
我是你的发布与集成 Agent，可以帮你检查分享链接、Webhook 配置和推送失败原因。
```

### 3.2 快捷任务卡片

快捷任务用于降低用户使用门槛，避免用户猜 Agent 能做什么。

每个页面建议 3 到 5 个快捷任务。

### 3.3 自然语言输入

用户可以继续输入自由指令。自由指令需要结合页面上下文和可用工具执行。

### 3.4 执行事件流

Agent 执行时左侧展示事件流：

```text
理解需求
读取当前页面上下文
规划任务
调用工具
返回结果
等待确认 / 已同步页面
```

对应事件结构：

```ts
type AgentEvent =
  | { type: "planning"; message: string }
  | { type: "tool_start"; tool: string; message: string }
  | { type: "tool_result"; tool: string; result: unknown; message?: string }
  | { type: "draft_updated"; data: unknown; message: string }
  | { type: "summary"; message: string }
  | { type: "confirm_required"; action: string; preview: unknown; message: string }
  | { type: "done"; message: string }
  | { type: "error"; message: string };
```

### 3.5 结果卡片

不同页面不应都用纯聊天文本。结果应该卡片化：

- 表单页：字段变更摘要、Schema 校验结果、体验优化建议。
- 数据页：筛选结果摘要、异常数据列表、字段空值统计。
- 分析页：指标洞察、趋势解释、漏斗问题。
- 发布页：配置检查清单、Webhook 测试结果、失败日志解释。

## 4. 页面能力矩阵

### 4.1 首页 / 工作台 Agent

定位：场景资产与运营概览助手。

可做任务：

- 查找某个场景。
- 总结最近运行情况。
- 提醒异常场景或失败推送。
- 推荐下一步优化动作。

候选工具：

- `dashboard.search_scenes`
- `dashboard.summarize_workspace`
- `dashboard.detect_recent_anomalies`
- `dashboard.recommend_next_actions`

第一阶段建议：暂缓深做，先做只读总结和快捷入口。

### 4.2 生成页 Agent

定位：表单 / 场景设计副驾驶。

可做任务：

- 生成新表单。
- 基于当前表单增量修改字段。
- 优化字段文案。
- 检查表单是否太长。
- 推荐主题和 layout。

候选工具：

- `generator.generate_form_schema`
- `generator.revise_form_schema`
- `generator.validate_form_schema`
- `generator.suggest_improvements`
- `generator.select_theme`

第一阶段建议：优先做深。

### 4.3 数据页 Agent

定位：提交数据分析与处理助手。

可做任务：

- 根据自然语言筛选提交。
- 总结最近提交情况。
- 找出异常记录。
- 统计字段空值。
- 生成导出建议。

候选工具：

- `submissions.filter_records`
- `submissions.summarize_records`
- `submissions.detect_anomalies`
- `submissions.profile_field_quality`
- `submissions.suggest_export`

第一阶段建议：作为第二个重点页面做深。

### 4.4 分析页 Agent

定位：指标解释与运营洞察助手。

可做任务：

- 解释转化率变化。
- 分析提交趋势。
- 查找漏斗流失点。
- 给出优化建议。

候选工具：

- `analytics.explain_metric`
- `analytics.analyze_trend`
- `analytics.detect_funnel_dropoff`
- `analytics.recommend_optimizations`

第一阶段建议：先做静态洞察，后续接真实统计模型。

### 4.5 发布页 Agent

定位：发布、分享与集成配置助手。

可做任务：

- 检查分享链接和二维码。
- 推荐飞书 / 钉钉 / 企业微信 Webhook 配置模式。
- 检查 Webhook 配置是否完整。
- 解释最近失败日志。
- 测试一次推送。

候选工具：

- `publish.validate_share_settings`
- `publish.recommend_webhook_provider`
- `publish.validate_webhook_config`
- `publish.explain_webhook_logs`
- `publish.test_webhook`

第一阶段建议：先做配置检查和失败日志解释，真实推送测试需要确认。

## 5. 技术架构建议

### 5.1 不先绑定重型 Agent 框架

当前阶段建议自研轻量 Agent Orchestrator：

```ts
async function runPageAgent(input: {
  pageContext: AgentPageContext;
  userMessage: string;
  model?: string;
}) {
  // 1. 规划
  // 2. 选择工具
  // 3. 执行工具
  // 4. 校验结果
  // 5. 输出 summary / confirm_required / done
}
```

原因：

- 当前工具数量少。
- 当前任务链路短。
- 更容易控制权限和输出。
- 不会被某个 Agent 框架绑定开发方式。

### 5.2 模型供应商必须可替换

业务层不直接依赖 OpenAI / DeepSeek / Claude 的原始结构，而是通过统一适配层：

```ts
interface AgentModelProvider {
  plan(input: unknown): Promise<AgentPlan>;
  summarize(input: unknown): Promise<string>;
  generateText(input: unknown): Promise<string>;
}
```

这样以后可以切换：

- OpenAI
- DeepSeek
- Claude
- Gemini
- OpenRouter
- 本地模型

### 5.3 工具协议独立于模型

工具由我们定义和执行：

```ts
type AgentTool<Input = unknown, Output = unknown> = {
  name: string;
  description: string;
  riskLevel: "read" | "draft_edit" | "confirm_required";
  execute(input: Input, context: AgentPageContext): Promise<Output>;
};
```

模型只负责决定“要做什么”，不能直接越权执行。

### 5.4 工具注册、规划与执行原理

真实工具 Agent 的核心流程如下：

```text
1. 后端注册工具
2. 后端把可用工具说明、输入结构、风险等级提供给模型
3. 模型读取用户输入和当前页面上下文
4. 模型输出 plan 或 tool call
5. Agent Orchestrator 校验模型输出
6. 后端执行对应工具
7. 工具结果回传给模型或直接生成页面事件
8. 前端通过事件流展示过程并更新页面状态
```

关键原则：

- 大模型不直接执行工具。
- 大模型只决定“建议调用哪个工具、参数是什么”。
- 后端必须校验工具名、参数结构、权限、风险等级。
- 工具结果可以直接更新页面，也可以再交给模型生成总结。

示例计划：

```json
{
  "steps": [
    {
      "step": "修改表单结构",
      "tool": "generator.revise_form_schema",
      "input": {
        "instruction": "把电话字段改成邮箱，并加一个发票上传字段"
      }
    },
    {
      "step": "校验修改后的表单结构",
      "tool": "generator.validate_form_schema",
      "input": {}
    }
  ]
}
```

后端执行时对应事件：

```text
planning
tool_start: generator.revise_form_schema
tool_result: generator.revise_form_schema
tool_start: generator.validate_form_schema
tool_result: generator.validate_form_schema
draft_updated
summary
done
```

### 5.5 推荐采用 Plan-Then-Execute 起步

Agent 有两种常见实现方式：

| 方式 | 说明 | 当前建议 |
| --- | --- | --- |
| Plan-Then-Execute | 模型先输出完整计划，后端按计划执行 | 第一阶段采用 |
| Tool Calling Loop | 模型一步步决定工具调用，并根据结果继续决策 | 后续再考虑 |

当前产品的表单生成、字段修改、数据筛选任务链路较短，工具数量也少，优先采用 Plan-Then-Execute。

原因：

- 更容易控制成本。
- 更容易展示给用户。
- 更容易做权限检查。
- 更容易调试和回放。
- 不需要一开始就引入复杂 Agent 框架。

暂不建议第一阶段做多轮 Tool Calling Loop，因为它会增加：

- 模型调用次数。
- Token 成本。
- 失败重试复杂度。
- 调试难度。
- 不确定行为。

### 5.6 事件流协议

前后端使用 SSE 传输 Agent 执行过程。

当前已具备雏形：

- API：`/api/forms/agent`
- 事件类型：`thinking`、`tool_start`、`draft_updated`、`done`、`error`

后续应升级为统一 `/api/agent/run` 或按页面拆分：

- `/api/forms/agent`
- `/api/submissions/agent`
- `/api/publish/agent`

短期建议保留页面级 API，避免过早抽象。

### 5.7 模型与 Agent 框架不得绑死业务

第二阶段或第三阶段如果接入 OpenAI Responses API、OpenAI Agents SDK、LangGraph、AutoGen、CrewAI 等框架，必须遵守：

- 业务工具协议由我们定义。
- 页面上下文协议由我们定义。
- 事件流协议由我们定义。
- 模型供应商只作为 provider。
- Agent 框架只作为执行引擎或编排辅助，不得反向决定业务模型。

禁止把业务逻辑写死在某个模型厂商的消息格式、tool call 格式、trace 格式或 agent handoff 结构里。

推荐抽象：

```ts
type AgentModelProvider = {
  name: string;
  plan(input: unknown): Promise<AgentPlan>;
  summarize(input: unknown): Promise<string>;
};

type AgentFrameworkAdapter = {
  run(input: AgentRunInput): AsyncIterable<AgentEvent>;
};
```

这样未来可以替换：

- OpenAI
- DeepSeek
- Claude
- Gemini
- OpenRouter
- 本地模型
- OpenAI Agents SDK
- LangGraph

替换目标应该是模型适配层或框架适配层，而不是重写页面业务。

## 6. Token 成本控制规范

页面级 Agent 必须从第一天开始控制 Token 成本。

### 6.1 成本风险判断

不同页面的 Token 风险不同：

| 页面 | Token 风险 | 原因 |
| --- | --- | --- |
| 生成页 | 中等 | 主要消耗在生成 Schema、修订字段和总结 |
| 数据页 | 高 | 如果直接把大量提交记录丢给模型，成本会快速上升 |
| 分析页 | 中等 | 如果先做指标聚合，再让模型解释，成本可控 |
| 发布页 | 低 | 上下文主要是配置和少量日志 |
| 首页 | 低到中等 | 取决于是否传全量场景和数据 |

### 6.2 必须遵守的成本原则

1. 模型只读摘要，不读全量数据。
2. 统计、筛选、排序、校验优先由后端工具完成。
3. 能用规则完成的任务，不调用模型。
4. 简单任务使用低成本模型或规则。
5. 复杂生成和复杂解释才使用强模型。
6. 每次 Agent Run 必须限制最大步骤数、最大工具次数和最大输出长度。
7. 每页上下文只传当前任务必要信息，不默认传全部历史。
8. 重复计算结果应缓存，例如字段质量检查、固定时间范围数据摘要。

### 6.3 数据页特殊要求

数据页禁止直接把大量原始提交记录传给模型。

必须先由后端工具做：

- 筛选。
- 聚合。
- 统计。
- 脱敏。
- 截断。
- 摘要。

然后只把结果摘要传给模型。

不推荐：

```text
把最近 1000 条提交完整传给模型分析。
```

推荐：

```text
后端先统计：
- 最近 7 天提交 128 条
- OCR 失败 6 条
- 发票字段缺失 18 条
- 手机号重复 5 条

再让模型解释这些结果并给出建议。
```

### 6.4 推荐成本结构

当前 MVP 推荐：

```text
规则和后端工具判断：70%
LLM 规划、解释和文案：30%
```

不做：

- 长循环 Agent。
- 全量原始数据上下文。
- 每一步都问模型。
- 工具结果无脑回灌模型。

## 7. 真实 Agent 能力分级

为了避免团队对 Agent 预期混乱，后续开发按以下等级判断成熟度。

### Level 0：静态提示

只有欢迎语和快捷提示，不调用工具。

用途：

- 原型展示。
- 页面占位。

不得作为正式 Agent 能力交付。

### Level 1：真实事件流

后端通过 SSE 推送事件，但工具链较固定。

当前 `/api/forms/agent` 属于此级别。

用途：

- 建立前后端事件流机制。
- 让用户看到真实执行过程。

不足：

- 事件文案可能仍是预设。
- 模型没有真正动态规划。
- 工具选择有限。

### Level 2：真实工具 Agent

模型基于页面上下文输出计划，后端按计划调用工具。

必须具备：

- 工具注册表。
- 页面上下文。
- Plan-Then-Execute。
- 工具参数校验。
- 工具结果事件。
- 页面状态更新。

这是近期目标。

### Level 3：带记忆与复杂编排的 Agent

支持会话记忆、多工具循环、任务恢复、人工中断、执行轨迹。

适用场景：

- 多步骤数据处理。
- 跨页面任务。
- 复杂 Workflow。
- 企业级审计。

当前阶段不做。

## 8. 推荐迭代顺序

### 8.0 当前实现状态（2026-05-21）

当前页面级 Agent 已从“静态提示”推进到“后端规则工具 Agent”的过渡状态。

已落地页面：

| 页面 | API | 当前能力 | 成本策略 |
| --- | --- | --- | --- |
| 工作台 | `POST /api/forms/workspace-agent` | 场景概览、异常提醒、下一步建议、创建额度说明 | 后端规则统计，0 Token |
| 数据页 | `POST /api/forms/:id/data-agent` | 提交总结、字段缺失、OCR 失败、Webhook 失败、文件上传缺失 | 后端规则统计，0 Token |
| 分析页 | `POST /api/forms/:id/analytics-agent` | 指标解释、OCR/Webhook 成功率解释、漏斗边界说明 | 后端规则统计，0 Token |
| 发布页 | `POST /api/forms/:id/publish-agent` | 发布配置检查、分享链接说明、Webhook 诊断、OCR 配置提示 | 后端规则统计，0 Token |
| Webhook 日志页 | `POST /api/forms/:id/webhook-logs/agent` | 推送日志概览、失败原因摘要、重试前检查建议、日志定位说明 | 后端规则统计，0 Token |
| 生成页 | `POST /api/forms/agent` | 表单草稿修订、校验、变更摘要雏形 | 规则 + 可选模型能力，仍需继续做深 |

当前实现等级：

- 工作台 / 数据页 / 分析页 / 发布页 / Webhook 日志页：介于 Level 1 和 Level 2 之间，已调用后端工具读取页面上下文，但暂未引入模型规划。
- 生成页：已有 Agent API 雏形，是后续最需要做深的页面。

当前明确边界：

- 不调用大模型即可回答的问题，优先使用规则统计。
- 数据页不把全量提交记录发送给大模型。
- 发布页不自动修改配置，不自动外发测试事件。
- Webhook 重试必须由用户在日志页明确点击触发。
- 漏斗分析当前只做边界说明，因为尚未记录真实访问与开始填写事件。

下一步建议：

1. 生成页 Agent 做深，支持更稳定的自然语言增量改表单。
2. 为页面 Agent 统一结构化响应格式，为后续结果卡片和事件流做准备。
3. 补部署与演示文档，形成可复现演示脚本。

### Phase 1：生成页 Agent 做深

目标：让用户能用自然语言持续修改右侧表单。

必须能力：

- 初次生成。
- 基于 existingSchema 增量修改。
- Schema 校验。
- 输出变更摘要。
- 右侧预览实时同步。

验收标准：

- 用户输入“加一个发票上传字段”，右侧能新增字段。
- 用户输入“把电话改成邮箱”，右侧能修改字段类型和文案。
- 用户输入“帮我检查这个表单是否太长”，Agent 能给出建议但不擅自修改。

### Phase 2：数据页 Agent 做深

目标：让用户能用自然语言理解和处理提交数据。

必须能力：

- 筛选提交记录。
- 总结提交情况。
- 找出异常或缺失字段。
- 给出导出建议。

验收标准：

- 用户输入“找出没有上传发票的记录”，列表能筛选。
- 用户输入“总结最近 20 条提交”，Agent 能输出摘要。
- 用户输入“哪些字段经常为空”，Agent 能统计字段质量。

### Phase 3：发布页 Agent

目标：降低 Webhook / 分享 / 集成配置门槛。

必须能力：

- 推荐常见平台配置方式。
- 检查 Webhook 配置。
- 解释失败日志。
- 高风险推送测试需确认。

## 9. 团队必须遵守的 Agent 开发规范

1. Agent 必须服务页面任务，不为噱头而存在。
2. 每个页面至少定义 3 个明确快捷任务。
3. 每个页面必须提供结构化 Page Context。
4. 每个工具必须注册名称、说明、输入结构、风险等级和 execute 方法。
5. 模型不得直接执行工具，工具必须由后端执行。
6. 后端必须校验模型输出的工具名和参数。
7. 高风险工具必须走确认机制。
8. 数据页不得把全量原始数据直接传给模型。
9. Agent Run 必须有成本限制。
10. Agent 框架和模型供应商不得绑死业务协议。
11. 第一阶段优先做 Plan-Then-Execute，不做复杂循环 Agent。
12. 生成页和数据页优先做深，其他页面先做轻量只读或快捷任务。

## 10. 当前边界

当前阶段不做：

- 多 Agent 协作。
- 长期记忆系统。
- Agent 自动发布。
- Agent 自动扣费。
- Agent 自动删除数据。
- Agent 自动外发敏感数据。
- LangGraph / CrewAI / AutoGen 等重框架接入。

当前阶段要做：

- 真实页面上下文。
- 少量真实工具。
- 明确事件流。
- 可解释结果。
- 必要确认机制。

## 11. 总结

页面级 Agent 模式的核心不是“每页都有 AI”，而是：

> 每页都有一个知道当前上下文、能调用当前页面工具、能帮用户完成真实工作的 AI 副驾驶。

优先把生成页和数据页做深，比把所有页面都铺一个浅层聊天框更有价值。
