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

## 后续计划接口
- `POST /api/forms/:id/publish`
- `GET /api/webhooks/test`

## 当前 mock 执行留痕
- 提交后会生成 `workflow_run`
- mock webhook skill 会生成 `webhook_log`
- 本地无数据库时会写入开发文件，便于页面直接查看
