# V1.2 MVP 最小闭环实施计划

本文档基于 [PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md) 编写，目标是在现有 [Code](/Users/mike/Documents/AIFactory/Code) 工程基础上，按 `AGENTS.md` 要求，用“三步法”推进第一阶段最小可运行闭环。

更新时间：2026-05-08

## 0. 目标与边界

本次实施目标不是完成整个平台，而是先跑通一个最小商业闭环：

AI 生成表单
→ 发布分享
→ 用户填写提交
→ 触发固定 Workflow
→ 执行 OCR / Webhook / 导出 Skill
→ 扣减 Credits
→ 留下提交记录与执行日志

## 本次必须做

- AI 生成表单 Schema
- 表单保存、发布、分享链接
- 面向终端用户的单题流填写页
- 表单提交与文件上传
- 固定工作流执行
- 3 个内置 Skill
  - OCR
  - Excel 导出
  - Webhook 推送
- Credits 扣减与用量流水
- 提交记录列表
- Webhook 日志页

## 本次不做

- 自定义复杂工作流编排
- Skill 市场
- 多租户
- OpenClaw / MCP
- 多 Agent 协作体系
- 可视化拖拽编排器
- 高级权限系统

## 1. Plan

## 1.1 实施策略

现有 `Code/` 是一套 Next.js 15 单体工程，因此本阶段优先沿用：

- `app/` 承接页面与 API
- `models/` 承接数据访问
- `services/` 承接业务逻辑
- `components/` 承接表单编辑、运行时和后台页面

不在本阶段额外拆分独立后端服务。

## 1.2 最小闭环场景

建议先以“票据 / 资料采集”类场景作为默认模板。

原因：

- 最容易验证 OCR Skill
- 同时覆盖文本、图片、PDF、文件上传
- 天然适合 Webhook 与 Excel 导出
- 更贴近 V1.2 的“数据处理与自动化消费”定位

## 1.3 需要新增 / 修改的文件

以下为建议的最小文件清单。

### 数据与类型层

- [Code/models/form.ts](/Users/mike/Documents/AIFactory/Code/models/form.ts)
  表单主表读写。
- [Code/models/form-submission.ts](/Users/mike/Documents/AIFactory/Code/models/form-submission.ts)
  提交记录读写。
- [Code/models/workflow.ts](/Users/mike/Documents/AIFactory/Code/models/workflow.ts)
  工作流定义与运行记录读写。
- [Code/models/skill.ts](/Users/mike/Documents/AIFactory/Code/models/skill.ts)
  内置 Skill 定义读取。
- [Code/models/webhook-log.ts](/Users/mike/Documents/AIFactory/Code/models/webhook-log.ts)
  Webhook 推送日志读写。
- [Code/models/usage-ledger.ts](/Users/mike/Documents/AIFactory/Code/models/usage-ledger.ts)
  Credits 消耗流水。
- [Code/types/form.ts](/Users/mike/Documents/AIFactory/Code/types/form.ts)
  表单 schema、字段、主题、提交体定义。
- [Code/types/workflow.ts](/Users/mike/Documents/AIFactory/Code/types/workflow.ts)
  Workflow 节点、运行状态、Skill 结果定义。

### 服务层

- [Code/services/form.ts](/Users/mike/Documents/AIFactory/Code/services/form.ts)
  表单创建、发布、查询、分享。
- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)
  AI 生成表单 schema。
- [Code/services/form-runtime.ts](/Users/mike/Documents/AIFactory/Code/services/form-runtime.ts)
  提交校验、文件整理、提交存储。
- [Code/services/workflow.ts](/Users/mike/Documents/AIFactory/Code/services/workflow.ts)
  固定工作流执行器。
- [Code/services/skill.ts](/Users/mike/Documents/AIFactory/Code/services/skill.ts)
  Skill 注册与统一执行入口。
- [Code/services/skills/ocr.ts](/Users/mike/Documents/AIFactory/Code/services/skills/ocr.ts)
  OCR Skill。
- [Code/services/skills/excel-export.ts](/Users/mike/Documents/AIFactory/Code/services/skills/excel-export.ts)
  Excel 导出 Skill。
- [Code/services/skills/webhook.ts](/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts)
  Webhook 推送 Skill。
- [Code/services/billing.ts](/Users/mike/Documents/AIFactory/Code/services/billing.ts)
  Credits 校验、扣减、退款补偿。
- [Code/services/ai-gateway.ts](/Users/mike/Documents/AIFactory/Code/services/ai-gateway.ts)
  统一封装 AI 调用与基础容错。

### API 层

- [Code/app/api/forms/generate/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/generate/route.ts)
  一句话生成表单。
- [Code/app/api/forms/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/route.ts)
  新建表单、查询表单列表。
- [Code/app/api/forms/[id]/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/route.ts)
  获取 / 更新单个表单。
- [Code/app/api/forms/[id]/publish/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/publish/route.ts)
  发布表单与生成分享标识。
- [Code/app/api/forms/[id]/submit/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/submit/route.ts)
  提交表单并触发工作流。
- [Code/app/api/forms/[id]/submissions/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/submissions/route.ts)
  提交记录列表。
- [Code/app/api/webhooks/test/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/webhooks/test/route.ts)
  Webhook 连通性测试。

### 页面与组件层

- [Code/app/[locale]/(default)/(console)/forms/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/page.tsx)
  表单列表页。
- [Code/app/[locale]/(default)/(console)/forms/new/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/new/page.tsx)
  AI 生成表单页。
- [Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx)
  表单配置 / 发布页。
- [Code/app/[locale]/(default)/(console)/submissions/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/submissions/page.tsx)
  提交记录页。
- [Code/app/[locale]/(default)/(console)/webhooks/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/webhooks/page.tsx)
  Webhook 日志页。
- [Code/app/[locale]/f/[shareCode]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/f/[shareCode]/page.tsx)
  面向终端用户的分享表单页。
- [Code/components/forms/form-generator.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx)
  AI 生成表单输入与结果预览。
- [Code/components/forms/form-editor.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-editor.tsx)
  表单 schema 配置。
- [Code/components/forms/form-runner.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-runner.tsx)
  单题流运行组件。
- [Code/components/forms/form-theme-preview.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-theme-preview.tsx)
  3 套主题预览。
- [Code/components/forms/submission-table.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/submission-table.tsx)
  提交记录表格。
- [Code/components/forms/webhook-log-table.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/webhook-log-table.tsx)
  Webhook 日志表格。

### 配置与文档

- [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
  增补 MVP 表结构，或拆分出独立迁移文件。
- [Code/.env.example](/Users/mike/Documents/AIFactory/Code/.env.example)
  增补 AI、Webhook、存储相关环境变量说明。
- [ProjectDocs/API.md](/Users/mike/Documents/AIFactory/ProjectDocs/API.md)
  同步补全真实接口定义。

## 1.4 数据库变更

当前项目还没有成型迁移体系，因此建议先在 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql) 中追加 MVP 表结构，并在后续确认是否切换到 Prisma / 正式 migration。

### 新增表建议

- `forms`
  - `id`
  - `uuid`
  - `user_uuid`
  - `title`
  - `description`
  - `theme`
  - `schema_json`
  - `status`
  - `share_code`
  - `webhook_url`
  - `webhook_headers_json`
  - `created_at`
  - `updated_at`
- `form_submissions`
  - `id`
  - `uuid`
  - `form_uuid`
  - `answers_json`
  - `files_json`
  - `status`
  - `workflow_run_uuid`
  - `created_at`
- `workflows`
  - `id`
  - `uuid`
  - `form_uuid`
  - `name`
  - `definition_json`
  - `status`
  - `created_at`
- `workflow_runs`
  - `id`
  - `uuid`
  - `workflow_uuid`
  - `form_submission_uuid`
  - `status`
  - `steps_json`
  - `error_message`
  - `created_at`
  - `finished_at`
- `skills`
  - `id`
  - `code`
  - `name`
  - `type`
  - `config_json`
  - `status`
- `webhook_logs`
  - `id`
  - `uuid`
  - `form_uuid`
  - `submission_uuid`
  - `target_url`
  - `request_body_json`
  - `response_status`
  - `response_body`
  - `attempt_count`
  - `status`
  - `created_at`
  - `last_attempt_at`
- `usage_ledger`
  - `id`
  - `uuid`
  - `user_uuid`
  - `form_uuid`
  - `submission_uuid`
  - `workflow_run_uuid`
  - `skill_code`
  - `credits_delta`
  - `usage_type`
  - `remark`
  - `created_at`

## 1.5 API 设计

### `POST /api/forms/generate`

- 请求

```json
{
  "prompt": "帮我生成一个票据识别与资料收集表单",
  "theme": "minimal"
}
```

- 响应

```json
{
  "success": true,
  "data": {
    "title": "票据识别与资料收集",
    "description": "用于收集票据图片与补充信息",
    "theme": "minimal",
    "schema": {
      "fields": []
    }
  }
}
```

### `POST /api/forms`

- 作用：保存表单草稿。

### `GET /api/forms`

- 作用：返回当前用户表单列表。

### `GET /api/forms/:id`

- 作用：返回表单详情与 schema。

### `PUT /api/forms/:id`

- 作用：更新标题、主题、Webhook 配置、固定 workflow 配置。

### `POST /api/forms/:id/publish`

- 作用：发布表单并生成 `share_code`。

### `POST /api/forms/:id/submit`

- 请求

```json
{
  "answers": {
    "invoice_image": "uploaded-file-url",
    "remark": "五月票据"
  }
}
```

- 响应

```json
{
  "success": true,
  "data": {
    "submissionId": "sub_xxx",
    "workflowRunId": "run_xxx",
    "status": "processing"
  }
}
```

### `GET /api/forms/:id/submissions`

- 作用：查询表单提交记录。

### `GET /api/webhooks/test`

- 作用：测试目标 Webhook 是否可达。

## 1.6 第三方依赖

优先复用现有依赖，避免无谓扩容。

### 现有可直接复用

- `zod`
- `react-hook-form`
- `ai`
- `@ai-sdk/openai`
- `@supabase/supabase-js`
- `stripe`
- `sonner`

### 建议新增

- `xlsx`
  用于 Excel 导出。
- `p-retry`
  用于 Webhook 重试控制。

### 本阶段尽量不新增

- Redis 队列
- Prisma
- 重型工作流引擎

理由是先跑通闭环，再决定是否升级基础设施。

## 1.7 重试 / 容错策略

### AI 表单生成

- OpenAI 调用失败时返回明确错误码。
- 保留“手动编辑 schema”入口，避免 AI 失败即完全阻塞。

### 表单提交

- 先校验必填字段与文件类型。
- 提交记录先入库，再触发 workflow，避免前端重复点击造成数据丢失。

### Workflow 执行

- 采用固定串行执行：
  `ocr -> excel_export -> webhook`
- 任一步失败即记录失败状态，并写入 `workflow_runs.error_message`。

### Webhook

- 默认最多重试 3 次。
- 重试间隔采用简单退避，例如 5s / 15s / 30s。
- 记录每次请求与响应摘要，禁止日志明文输出敏感 token。

### Billing

- 提交前先校验可用 Credits。
- 扣费与工作流记录放在同一业务事务语义内处理。
- 如 Workflow 在 OCR 前即失败，不扣费。
- 如扣费后 Webhook 失败，允许保留扣费但标记失败日志，不自动退款。

## 2. Code

本阶段建议按四个实现批次推进。

### 批次一：数据与 API 基础

- 新增表结构
- 建立 `models/*`
- 建立 `services/form.ts`
- 建立表单 CRUD API

完成标志：

- 能创建、读取、更新、发布表单
- 能查看表单列表

### 批次二：AI 生成与前台运行时

- 建立 `form-generator`
- 建立 `form-editor`
- 建立 `form-runner`
- 打通分享页

完成标志：

- 能一句话生成 schema
- 能保存并打开分享页填写

### 批次三：提交流程与 Skill 执行

- 新增 `form_submissions`
- 新增 `workflow` / `skill` 服务
- 实现固定串行执行器
- 接入 OCR / Excel / Webhook 三个内置 Skill

完成标志：

- 提交后自动跑完整条处理链
- 能查看运行状态与失败原因

### 批次四：Billing 与后台记录

- 接入 Credits 校验与扣减
- 建立 `usage_ledger`
- 建立提交记录页
- 建立 Webhook 日志页

完成标志：

- 能看到扣费记录
- 能看到提交记录与 webhook 状态

## 3. Verify

## 3.1 单元测试要求

建议使用 Vitest 或 Jest，与当前工程最终选型保持一致。

每个新增 API 至少包含：

- 正常请求测试
- 参数缺失测试
- 未登录测试
- AI / Webhook 外部依赖失败的 mock 测试

每个核心服务至少包含：

- `form-generator` schema 规范化测试
- `form-runtime` 提交校验测试
- `workflow` 串行执行测试
- `billing` 扣费条件测试
- `webhook` 重试次数测试

## 3.2 手动测试步骤

### 成功链路

1. 登录控制台。
2. 输入一句话生成表单。
3. 保存并发布表单。
4. 打开分享页填写文本与上传图片。
5. 提交后检查：
   - 提交记录已生成
   - Workflow 运行成功
   - OCR 结果存在
   - 导出文件已生成
   - Webhook 推送成功
   - Credits 被正确扣减

### 失败链路

1. 配置错误的 Webhook URL。
2. 再次提交表单。
3. 检查：
   - 提交记录仍被保存
   - Workflow 标记失败
   - Webhook 出现重试日志
   - 前台不应因 webhook 失败而直接报 500 页面

### 额度不足链路

1. 将测试用户 Credits 调低至不足。
2. 提交表单。
3. 检查：
   - 提交被拒绝或直接标记不可执行
   - 不应继续进入 Skill 执行
   - 有明确错误提示

## 3.3 潜在风险与应对

- 风险：当前工程使用 Supabase 直接访问，而 PRD 建议 Prisma + PostgreSQL。
  应对：本阶段先不迁移，只把模型边界抽清楚，后续再替换底层实现。

- 风险：无队列系统时，Webhook 重试与 Excel 导出会占用请求时长。
  应对：本阶段先接受“短链路同步 + 轻量重试”，后续再引入队列。

- 风险：AI 生成 schema 质量不稳定。
  应对：保留人工编辑与字段修正能力，不把生成结果直接视为最终稿。

- 风险：文件上传与 OCR 会涉及存储与权限。
  应对：先限定支持的文件类型、大小与数量，并在日志中避免暴露原始文件地址。

- 风险：现有控制台导航仍偏模板语义。
  应对：在实施时同步重排导航，避免用户继续看到订单 / 邀请 / API Key 作为主入口。

## 4. 验收标准

满足以下条件即可判定第一阶段最小闭环完成：

- 登录用户能创建并发布一个 AI 表单
- 终端用户能通过分享链接完成填写与上传
- 系统会自动执行固定 Workflow
- 至少 3 个内置 Skill 可运行
- 系统能记录提交、执行、Webhook 与计费结果
- 控制台能查看表单、提交记录、Webhook 日志和用量记录
