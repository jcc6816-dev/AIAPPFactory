# 执行报告：GA4 Event Taxonomy Audit

- **任务 ID**: AI-TASK-2026-006-008
- **状态**: SUBMITTED
- **读取的文件**:
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/README.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/protocol.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/codex_seo_operations_tracker.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_analytics_setup_guide.md`
  - `/Users/mike/Documents/AIFactory/Code/lib/growth.ts`
  - `/Users/mike/Documents/AIFactory/Code/app/api/growth/events/route.ts`
  - `/Users/mike/Documents/AIFactory/Code/components/analytics/landing-page-tracker.tsx`
  - `/Users/mike/Documents/AIFactory/Code/components/templates/template-use-button.tsx`
  - `/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx`
- **修改的文件**: none
- **实际完成的工作**:
  - 审计了客户端埋点核心工具 `lib/growth.ts`、服务端路由 `/api/growth/events` 以及首页、模版按钮、生成器、支付墙等关键组件的事件上报逻辑。
  - 分析了当前已埋点事件对于漏斗“流量来源 ➔ 点击创建 ➔ 注册 ➔ 创建表单 ➔ 发布表单”的支撑力度。
  - 发现了 5 个影响增长分析和转化漏斗归因的严重数据缺口，并给出了具体补强建议。
  - 整理并输出了统一的推荐事件字典。
- **执行的命令**: none
- **验证结果**:
  - 审计完全基于现有代码，没有修改任何 `Code/**` 文件。
  - 报告中不包含任何真实流量数据或敏感密钥（如 GSC API Key 等），仅针对事件命名与参数设计进行逻辑层审计。
- **风险与不确定点**: none
- **后续建议**:
  - 建议下阶段让 Codex 根据本报告中提出的 5 个数据缺口，在 `Code/` 相应组件中补充对应的埋点参数及事件。

---

## 1. 当前埋点现状评估

目前代码侧已经实现了基于 `visitor_id` 和 `session_id` 的客户端-服务端双向事件上报框架（`lib/growth.ts` 和 `/api/growth/events`）。每次上报均会自动携带页面 URL (`page_location`)、页面路径 (`page_path`) 和 `referrer`。
- 对于**流量来源**：客户端会自动解析 `utm_source` / `ref` 或从 `referrer` 提取 host，将其保存并推送到数据库，具备基础的归因能力。
- 对于**核心漏斗**：已注册 `landing_viewed`、`template_used`、`ai_generate_submitted`、`form_created`、`form_published` 和 `public_form_submitted` 等事件。

---

## 2. 核心漏斗归因的 5 大关键缺口

### 缺口 1：注册成功事件 (`user_signed_up`) 缺少入口与方式属性
- **现状**: `auth-conversion-tracker.tsx` 在触发 `user_signed_up` (GA4: `sign_up`) 时，没有携带任何参数。
- **问题**: 运营团队无法得知新注册用户是通过 Google 快捷登录还是账号密码注册的，也无法直接归因该用户是在哪个页面（例如是阅读博客后、还是在保存表单时）被拦截并引导注册的。
- **建议**: 补充 `auth_method` (如 `google` / `credentials`) 和 `entry_point` (如 `save_form_intercept` / `pricing_page`)。

### 缺口 2：发布表单事件 (`form_published`) 丢失模版归因
- **现状**: `form_published` (GA4: `publish_form`) 仅携带了 `{ form_uuid }`。
- **问题**: 无法直接通过事件分析“究竟是哪个模版产生的表单最终被成功发布了”。如果要分析，必须将事件与数据库的表单表进行联表查询，无法在 GA4 控制台直接看清“模版 ➔ 发布”的漏斗转化率。
- **建议**: 在事件中补齐 `template_id` 和 `is_ai_generated` (是否为 AI 生成) 字段。

### 缺口 3：表单提交事件 (`public_form_submitted`) 丢失模版归因
- **现状**: `public_form_submitted` (GA4: `form_submit`) 仅携带了 `{ form_uuid, share_code, fields_count }`。
- **问题**: 无法快速评估哪个模版吸引来的终端用户提交数据最多。
- **建议**: 补齐 `template_id`。

### 缺口 4：AI 表单澄清 Q&A 阶段缺少数据埋点
- **现状**: `form-generator.tsx` 新增了澄清 Q&A 机制（在生成前向用户提问以精确生成），但该交互过程在 `lib/growth.ts` 的 `ALLOWED_EVENTS` 中完全没有事件定义。
- **问题**: AI 生成漏斗在“用户输入 Prompt”到“生成表单草稿”之间多了一个人工交互步骤，但该步骤是数据盲区。无法统计有多少比例的用户因为觉得回答问题麻烦而流失，也无法统计回答了几个问题。
- **建议**: 新增 `clarification_shown` (展示问题) 和 `clarification_submitted` (提交回答) 事件。

### 缺口 5：付费墙转化链路缺失升级意向埋点
- **现状**: 目前仅有 `paywall_impression` (展现) 和 `paywall_clicked` (点击升级)，但如果用户点击后进入了 Stripe 支付流，或是在支付页放弃，我们缺少与 Stripe 联动上报的 `checkout_started`（虽然代码里有这个事件映射，但付费墙本身并未触发它）。
- **问题**: 难以区分用户是在网站内放弃（点击了 Paywall 但未进入 Stripe）还是在 Stripe 收银台放弃（进入了 Stripe 但未付款）。
- **建议**: 规范付费墙点击后触发 `checkout_started`，携带 `plan_id` / `source: paywall` 参数。

---

## 3. 推荐增长事件字典 (Growth Event Taxonomy)

为支持漏斗复盘，建议 Codex 在后续更新中规范并补全以下事件及参数字典：

| 阶段 | 推荐事件名称 (Event Name) | GA4 对应名称 (GA4 Name) | 核心上报参数 (元信息) | 触发时机与漏斗含义 |
| :--- | :--- | :--- | :--- | :--- |
| **0. 流量进入** | `landing_viewed` | `landing_view` | `landing_slug`, `template_id`, `entry_point` | 访问 Use Case / Solution 落地页，记录着陆起点。 |
| | `template_viewed` | `template_view` | `template_id` | 浏览某个具体模板的详情页。 |
| **1. 意图触发** | `template_used` | `template_use_click` | `template_id`, `cta_text`, `preferences` | 点击“使用模板”或“预览模板”按钮。 |
| | `ai_generate_submitted` | `ai_generate_submit` | `source` (`prompt`/`template`), `template_id`, `has_existing_draft` | 提交 Prompt 进行表单生成或调整。 |
| | `clarification_shown` | `clarification_show` | `prompt`, `questions_count` | 展示 AI 澄清提问界面（Q&A 启动）。 |
| | `clarification_submitted` | `clarification_submit` | `prompt`, `answers_count` | 用户完成提问回答，正式触发生成。 |
| **2. 决策与转化**| `signup_started` | `signup_start` | `entry_point` (`save_intercept`/`pricing`/`nav`) | 触发登录/注册弹窗或页面。 |
| | `user_signed_up` | `sign_up` | `auth_method` (`google`/`credentials`), `entry_point` | 注册成功，用于衡量渠道获客效率。 |
| | `form_created` | `form_saved` | `template_id`, `is_ai_generated` | 生成的表单草稿首次被用户保存到数据库。 |
| | `form_published` | `publish_form` | `form_uuid`, `template_id`, `is_ai_generated` | 用户点击“发布表单”，生成公开分享链接。 |
| **3. 付费转化** | `paywall_impression` | `paywall_view` | `form_uuid`, `reason` (`limit_reached`) | 免费用户触碰限制（如超过 1 个表单）时展示付费墙。 |
| | `checkout_started` | `checkout_start` | `plan_id`, `source` (`paywall`/`pricing`) | 点击付费墙升级或价格页升级按钮，跳转 Stripe。 |
| | `purchase_completed` | `purchase` | `transaction_id`, `value`, `currency` | Stripe 回调成功，用户升级为订阅会员。 |
| **4. 终端使用** | `public_form_submitted`| `form_submit` | `form_uuid`, `template_id`, `fields_count` | 最终用户填写并提交了该公开表单。 |
