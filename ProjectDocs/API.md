# MVP 接口设计

## POST /api/forms/generate
- 作用：一句话生成表单草稿
- 请求：`{ prompt: string, theme?: "minimal" | "business" | "dark", provider?: "openai" | "deepseek", model?: string }`
- 响应：`{ code: 0, data: { title, description, theme, schema, source, provider, model } }`

## POST /api/forms
- 作用：保存表单草稿
- 请求：`{ title: string, description?: string, theme?: string, schema: FormSchema, ocr_template?: "general_image" | "invoice" | "receipt" | "id_card", generation?: { source?: "ai" | "fallback", provider?: "openai" | "deepseek", model?: string, prompt?: string } }`
- 响应：`{ code: 0, data: FormRecord }`

## PATCH /api/forms/:id
- 作用：更新表单草稿配置
- 当前支持：
  - `webhook_*`
  - `ocr_template`

## GET /api/forms
- 作用：获取当前登录用户的表单列表
- 响应：`{ code: 0, data: FormRecord[] }`

## GET /api/forms/:id
- 作用：获取当前登录用户的单个表单详情
- 响应：`{ code: 0, data: FormRecord }`

## POST /api/forms/:id/submit
- 作用：从分享页提交表单
- 请求：
  - `application/json`：`{ answers: Record<string, string | number | boolean | string[]>, files?: SubmissionFileValue[], storage_files?: StoredFileAsset[] }`
  - `multipart/form-data`：
    - `answers`: JSON 字符串
    - `file:<field_key>`: 对应字段的真实上传文件
- 响应：`{ code: 0, data: FormSubmissionRecord }`
  当前会同步创建一个固定 workflow skeleton，并把 `workflow_run_uuid` 回写到提交记录中。
  如果配置了对象存储，会优先上传到对象存储；否则会在本地开发环境落到 `Code/data/uploads/`。
  当 OCR 与 DeepSeek 结构化开启后，提交记录还会补充：
  - `answers_json` 中的 OCR 自动回填字段
  - `ocr_result_json.summary`
  - `ocr_result_json.structured_data`

## Webhook Payload 扩展
- 当前 webhook 推送体除 `answers` 外，还会包含：
  - `form_share_code`
  - `submission_status`
  - `files`
  - `storage_files`
  - `ocr.status`
  - `ocr.provider`
  - `ocr.result`
  - `ocr.error_message`

## GET /api/forms/:id/submissions
- 作用：获取当前登录用户该表单的提交记录
- 响应：`{ code: 0, data: FormSubmissionRecord[] }`

## POST /api/forms/:id/webhook-logs/:logId/retry
- 作用：重试当前表单下某条失败的 Webhook 日志
- 权限：必须登录，且 `:id` 必须属于当前用户
- 约束：
  - 只能重试 `status = "failed"` 的日志
  - 会校验日志、提交记录、workflow run 都属于同一表单
  - 重试会复用现有 Webhook Skill，并生成新的 Webhook 日志
- 响应：`{ code: 0, data: SkillExecutionResult }`

## POST /api/forms/:id/webhook-logs/agent
- 作用：Webhook 日志页 Agent，只读诊断当前表单的推送日志
- 权限：必须登录，且 `:id` 必须属于当前用户
- 请求：`{ query: string }`
- 响应：`{ code: 0, data: { answer: string, summary: FormWebhookAgentSummary } }`
- 当前能力：
  - 汇总 Webhook 日志成功、失败、处理中数量
  - 摘要最近失败日志、HTTP 状态码、目标地址和失败原因
  - 给出重试前检查建议
  - 说明如何按日志 ID / 提交 ID 定位问题
- 约束：不会自动触发重试；重试仍必须由用户在日志列表中点击按钮
- 成本策略：规则统计，不调用大模型，不消耗 Token

## POST /api/forms/workspace-agent
- 作用：工作台页面 Agent，只读分析当前用户的场景资产与运行概况
- 请求：`{ query: string }`
- 响应：`{ code: 0, data: { answer: string, metrics: FormDashboardMetrics, form_count: number, can_create: boolean } }`
- 当前能力：
  - 工作台概览
  - 异常/失败提醒
  - 下一步建议
  - 创建额度与模板使用建议
- 成本策略：规则统计，不调用大模型，不消耗 Token

## POST /api/forms/settings-agent
- 作用：设置页 Agent，只读说明当前账户、套餐额度、API Key 入口与团队协作边界
- 权限：必须登录
- 请求：`{ query: string }`
- 响应：`{ code: 0, data: { answer: string, allowance: FormCreationAllowance } }`
- 当前能力：
  - 查询当前套餐和剩余场景创建额度
  - 说明 API Keys 页面入口与密钥安全边界
  - 说明团队协作在 MVP 阶段的边界
  - 展示当前账户基础信息
- 约束：不会修改账户、创建密钥、邀请成员或变更订阅
- 成本策略：规则统计，不调用大模型，不消耗 Token

## POST /api/forms/:id/data-agent
- 作用：数据页 Agent，只读分析当前表单提交、OCR、Webhook 与字段质量
- 权限：必须登录，且 `:id` 必须属于当前用户
- 请求：`{ query: string }`
- 响应：`{ code: 0, data: { answer: string, summary: FormDataAgentSummary } }`
- 当前能力：
  - 总结最近提交情况
  - 统计字段缺失
  - 定位 OCR 失败提交与原因
  - 定位 Webhook 失败日志与原因
  - 分析文件/图片/PDF 上传缺失
- 成本策略：后端规则统计，不把原始提交批量发送给大模型

## POST /api/forms/:id/analytics-agent
- 作用：分析页 Agent，只读解释当前表单指标
- 权限：必须登录，且 `:id` 必须属于当前用户
- 请求：`{ query: string }`
- 响应：`{ code: 0, data: { answer: string, metrics: FormDashboardMetrics } }`
- 当前能力：
  - 整体表现概览
  - OCR 成功率解释
  - Webhook 成功率解释
  - 漏斗边界说明
- 注意：当前还没有真实访问、开始填写等埋点，漏斗只能说明边界，不能作为完整转化分析
- 成本策略：规则统计，不调用大模型

## POST /api/forms/:id/publish-agent
- 作用：发布页 Agent，只读检查分享、OCR 与 Webhook 配置
- 权限：必须登录，且 `:id` 必须属于当前用户
- 请求：`{ query: string, locale?: string }`
- 响应：`{ code: 0, data: { answer: string, responses: FormPublishAgentResponses } }`
- 当前能力：
  - 发布配置检查
  - 分享链接说明
  - Webhook 配置诊断
  - OCR 模板提示
- 约束：不会自动修改配置，也不会自动外发测试事件
- 成本策略：规则统计，不调用大模型

## 后续计划接口
- `POST /api/forms/:id/publish`
- `GET /api/webhooks/test`

## 当前 mock 执行留痕
- 提交后会生成 `workflow_run`
- mock webhook skill 会生成 `webhook_log`
- 本地无数据库时会写入开发文件，便于页面直接查看
