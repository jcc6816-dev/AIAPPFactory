# Execution Report: Growth/GA4 Key Event Parameter Design

- **Task ID**: AI-TASK-2026-006-016
- **Status**: SUBMITTED
- **Files Read**:
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-008-execution-report.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-008-review-report.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/goals/2026-06-growth-goals.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/roadmap/2026-06-growth-execution-capacity-plan.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md`
- **Files Changed**:
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-016-execution-report.md` (本报告文件)
- **Exact Work Completed**:
  - 针对在 `AI-TASK-2026-006-008` 中发现的埋点信息缺口，设计了第一批 7 个最关键流量漏斗事件的参数规格。
  - 定义了每个事件的：GA4 映射名称、触发时机、必填/可选参数、参数示例、转化事件标记，并针对隐私与数据安全风险进行了详细审计。
  - 制定了本周开发执行的优先级（P0/P1），并为 Codex 给出了安全合规的埋点实现注意事项。
- **Commands Run**: none
- **Validation Results**:
  - 严格遵守 `code_modification_allowed: false` 规则，未修改 `Code/**` 下的埋点代码或事件路由。
- **Risks or Uncertain Points**: none
- **Recommended Follow-up**:
  - 建议 Mike 审阅本设计，无异议后由 Codex 在下周迭代中作为 `B-008` 任务将 P0 级参数补强写入 `Code/lib/growth.ts` 及相应页面中部署上线。

---

## 一、 7 个关键增长事件参数规格设计

### 1. 提交表单生成 (`ai_generate_submitted`)
- **GA4 映射名称**: `ai_generate_submit`
- **触发时机**: 用户在首页或编辑区点击“生成表单/修改表单”并发送请求时。
- **必填参数**:
  - `source`: string (取值范围: `homepage_prompt` | `editor_reprompt` | `template`)
  - `prompt_length`: number (输入 Prompt 字符串长度，用于分析用户意图复杂度)
- **可选参数**:
  - `template_id`: string (若为模板派生则上报，如 `lead-capture`)
  - `has_existing_draft`: boolean (是否是在已保存草稿上再次调整生成)
- **参数示例**: `{ source: "homepage_prompt", prompt_length: 32, has_existing_draft: false }`
- **是否设为转化事件**: **是**（衡量初始产品意图转化）。
- **隐私/敏感风险**: **极低**。仅采集 Prompt 长度，**严格禁止记录 Prompt 完整正文明文**（防范用户在 Prompt 中误输个人邮箱、电话或内部 API 密钥）。

### 2. 展示澄清问题 Q&A (`clarification_shown`)
- **GA4 映射名称**: `clarification_show`
- **触发时机**: 生成器判定需要用户澄清细节，弹出三题 Q&A 问答窗口时。
- **必填参数**:
  - `questions_count`: number (问题个数)
- **可选参数**:
  - `prompt_length`: number
- **参数示例**: `{ questions_count: 3, prompt_length: 45 }`
- **是否设为转化事件**: 否（用于漏斗摩擦和跳出分析）。
- **隐私/敏感风险**: 无。不记录问题文本。

### 3. 提交澄清问题回答 (`clarification_submitted`)
- **GA4 映射名称**: `clarification_submit`
- **触发时机**: 用户在 Q&A 界面回答完毕并点击“确认生成”正式发起 AI 生成时。
- **必填参数**:
  - `answers_count`: number (回答的题数)
  - `is_default_answers`: boolean (是否全部保留的默认选项，用于评估默认推荐的接受度)
- **可选参数**:
  - `duration_ms`: number (用户在澄清页面的停留作答耗时，毫秒)
- **参数示例**: `{ answers_count: 3, is_default_answers: false, duration_ms: 18400 }`
- **是否设为转化事件**: 否。
- **隐私/敏感风险**: **极低**。**严格禁止记录用户填写的回答内容明文**，仅记录题数与是否默认。

### 4. 注册成功 (`user_signed_up`)
- **GA4 映射名称**: `sign_up`
- **触发时机**: 游客完成注册并生成会话 Session 时。
- **必填参数**:
  - `auth_method`: string (注册渠道，取值范围: `google` | `credentials`)
  - `entry_point`: string (触发注册的入口，取值范围: `save_form_intercept` | `pricing_page` | `nav_bar` | `landing_page`)
- **可选参数**:
  - `has_draft_pending`: boolean (注册前浏览器中是否已经有一个未保存的 AI 生成表单草稿，用于评估“先体验后注册”的漏斗效率)
- **参数示例**: `{ auth_method: "google", entry_point: "save_form_intercept", has_draft_pending: true }`
- **是否设为转化事件**: **是**（核心商业获客事件）。
- **隐私/敏感风险**: **极低**。**严禁采集用户注册邮箱、用户名、密码或任何个人身份标识**。

### 5. 表单首次保存 (`form_created`)
- **GA4 映射名称**: `form_saved`
- **触发时机**: 表单草稿首次写入数据库生成唯一 UUID 时。
- **必填参数**:
  - `template_id`: string (源模板 ID，自定义生成则为 `custom`)
  - `is_ai_generated`: boolean (是否为 AI 辅助生成)
  - `fields_count`: number (表单拥有的字段/问题总数)
- **可选参数**:
  - `theme`: string (选择的主题，如 `dark`, `minimal`)
  - `layout`: string (单题流 `single` 或长表单 `long`)
- **参数示例**: `{ template_id: "lead-capture", is_ai_generated: true, fields_count: 6, theme: "dark", layout: "single" }`
- **是否设为转化事件**: **是**（核心产品激活事件）。
- **隐私/敏感风险**: **极低**。不采集用户表单的自定义 Title、描述或字段名称明文。

### 6. 表单正式发布 (`form_published`)
- **GA4 映射名称**: `publish_form`
- **触发时机**: 用户在控制台或编辑区点击“发布表单”，生成公开分享链接及二维码时。
- **必填参数**:
  - `form_uuid`: string (表单标识，用于前后端数据串联)
  - `template_id`: string (源模板 ID)
  - `is_ai_generated`: boolean
  - `fields_count`: number
- **可选参数**:
  - `theme`: string
- **参数示例**: `{ form_uuid: "form_912f_18471", template_id: "lead-capture", is_ai_generated: true, fields_count: 6 }`
- **是否设为转化事件**: **是**（核心转化指标，标志着用户完成了核心产品体验）。
- **隐私/敏感风险**: 无。

### 7. 终端公开表单提交 (`public_form_submitted`)
- **GA4 映射名称**: `form_submit`
- **触发时机**: 填单人（End User）在公开分享页填写完毕并点击“提交”，后端接口成功写入数据时。
- **必填参数**:
  - `form_uuid`: string
  - `fields_count`: number (表单字段数量)
- **可选参数**:
  - `template_id`: string (对应的表单源模板)
  - `duration_ms`: number (填单耗时，毫秒)
- **参数示例**: `{ form_uuid: "form_912f_18471", fields_count: 6, template_id: "lead-capture", duration_ms: 35000 }`
- **是否设为转化事件**: **是**（衡量表单的真正使用效率和终端网络传播效应）。
- **隐私/敏感风险**: **高风险，需严格防御**。**绝对不允许上报填单人输入的任何明文数据（姓名、邮箱、电话、意见、上传文件名等）**。埋点脚本仅被允许统计字段个数、耗时和状态。

---

## 二、 推进优先级与开发排期

| 优先级 | 事件名称 | 本周开发状态 | 理由 |
| :--- | :--- | :--- | :--- |
| **P0** | `user_signed_up` | **本周必须上线** | 首要打通从 SEO 入口页到注册成功的漏斗归因。 |
| **P0** | `form_published` | **本周必须上线** | 衡量流量质量最核心的产品资产发布指标，必须绑定 `template_id`。 |
| **P0** | `ai_generate_submitted` | **本周必须上线** | 确保首屏及创建页的生成动作能够携带来源参数（`source`）。 |
| **P1** | `form_created` | 本周可选实现 | 跟踪草稿创建与发布之间的流失。 |
| **P1** | `public_form_submitted`| 延后执行 | 在初期站内访客量和表单创建量未上升前，公共填单页埋点的优先级可略微放低。 |
| **P2** | `clarification_shown`/`submitted` | 延后执行 | 澄清 Q&A 漏斗分析属于精细化体验优化，可待基线流量稳定后再加装。 |

---

## 三、 Codex 实现注意事项（合规防线）

1. **严格遵守隐私防线**：
   - 客户端 `Code/lib/growth.ts` 整合的 `metadata` 拼装时，需使用解构赋值过滤敏感字段。
   - **红线**：严禁通过 `JSON.stringify` 自动导出 `fields` 或 `answers` 等文本，任何埋点不允许读取 `input.value` 文本进行上报。
2. **防范伪引荐污染**：
   - 为避免 `user_signed_up` 丢失原本在 `visitor_id`/`session_id` 中的来源参数，Codex 在实现时，应确保 `getStoredId`（利用 `localStorage`）能够跨域名回跳稳定保存（例如从 Google 授权页面返回时来源不会被重置为 `accounts.google.com`）。
