# GenForms.ai SEO 阶段性总结：搜索意图研究到 P0 上线

> 日期：2026-06-21  
> 阶段范围：Contact Form 关键词簇研究、第二批 20 个关键词 Google SERP 研究、P0 页面优化与上线  
> 状态：Contact Form 页面已上线；P0 Webhook/QR 页面已部署；Typeform 比较文章已进入后台草稿，待人工 review/publish  
> 漏斗协作补充：`ProjectDocs/Operations/seo_product_funnel_alignment_2026-06-21.md`

## 1. 本阶段的核心判断

本阶段的 SEO 工作不是从“我们想写什么”出发，而是从 Google 美国区 SERP 和真实竞品承接方式出发，反推搜索用户的意图，再决定 GenForms 应该用哪类页面承接。

最终形成的核心判断：

1. Google 对表单类关键词的排序偏好，仍然围绕“相关、有用、能让用户满意”展开。对我们来说，具体落地为：搜索用户点击进入页面后，要立刻确认 GenForms 能解决他的当前任务，并且有明确 CTA 可以体验。
2. `contact form builder` 这组词的主意图不是 CRM lead nurturing，而是“马上创建一个能放到网站上的联系表单”。因此主承接页应是产品型 use-case 页面，而不是泛博客。
3. 第二批 20 个关键词中，最适合当前 GenForms 产品事实的三条 P0/P0候选线是：
   - Typeform cheaper + AI + webhook 合并比较文章。
   - Webhook 表单承接页补强。
   - QR code form 主承接页补强。
4. Gemini 原始报告中建议新建的 URL 偏多。Codex 复核后采用“已有页面优先补强，避免关键词蚕食”的执行原则。
5. 所有 SEO 文案必须受产品事实边界约束，不能为了匹配竞品而承诺尚未真实支持的能力。

## 2. 研究方法与证据标准

本阶段确立了一个重要原则：SEO 结论必须优先基于 Google SERP，而不是 Brave、Bing、DuckDuckGo 或主观猜测。

采用的研究方法：

- 使用美国 VPN / 美国 Google 环境采集 SERP。
- 保存原始 HTML 和截图，避免后续只保留结论。
- 对关键词分组研究，而不是只研究单个词。
- 对 Top URL 做页面类型判断：产品页、模板页、教程页、比较页、文档页、目录页、视频等。
- 对每个关键词判断：
  - 用户主任务是什么。
  - Google 认为应该展示什么类型的内容。
  - 头部竞品如何解释搜索意图。
  - 竞品如何引导转化。
  - GenForms 是否有真实产品能力承接。
  - 应该优化现有页还是新建页。

主要证据文件：

- `ProjectDocs/Operations/seo_keyword_cluster_contact_form_2026-06-19.md`
- `ProjectDocs/Operations/seo_brief_contact_form_builder_for_websites.md`
- `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-037-google-serp-contact-form-us-vpn-final-zh.md`
- `ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-037-google-serp-contact-form-us-vpn-final-review.md`
- `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-038-google-serp-keyword-batch-final-zh.md`
- `ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-038-google-serp-keyword-batch-final-review.md`
- `SEOData/serp_raw/us_vpn/`
- `SEOData/serp_raw/keyword_batch_2026_06_20/`

## 3. Contact Form 关键词簇结论

### 3.1 研究关键词

| 关键词 | Google 意图判断 | GenForms 承接策略 |
| --- | --- | --- |
| `contact form builder` | 产品/工具页意图，用户想马上创建网站联系表单 | 主承接 `/use-cases/contact-form-builder-for-websites` |
| `contact form generator` | 与 builder 高度重叠，更强调即时生成 | 同一 use-case 页承接，强调 AI generate |
| `website contact form` | 产品、模板、教程混合意图 | 同一 use-case 页承接，补轻教程和字段清单 |
| `contact us form template` | 模板意图 | `/templates/contact-us` 辅助承接 |
| `free contact form builder` | 免费工具意图 | 可辅助覆盖，但不承诺 unlimited free |
| `contact form builder with webhook` | 技术/Webhook 独立意图 | 由 `/use-cases/webhook-form-builder-retry-logs` 承接 |

### 3.2 Google 展示了什么

`contact form builder` 和 `contact form generator` 的头部结果主要是 Jotform、POWR、AidaForm、HubSpot、Zoho、Shopify/WordPress 生态页等产品页或工具页。

这说明 Google 理解该类关键词时，重点不是“学习概念”，而是“创建工具”。页面必须清楚表达：

- no-code / easy setup。
- website contact form。
- template / fields。
- publish/share/embed 语境。
- submissions / response handling。
- FAQ 回答常见担忧。

`website contact form` 的头部结果混入 Adobe、Mailchimp、Wix、StaticForms 等教程/指南页，说明用户还需要知道“联系表单应该有哪些字段”“怎么放到网站上”“提交后怎么处理”。

### 3.3 竞品可借鉴点

可借鉴：

- Jotform：精准命中 `contact form generator`，页面直接服务创建任务。
- POWR：强调 website contact form 和 no-code。
- HubSpot / Zoho：把表单提交和 lead / follow-up 联系起来。
- Adobe / Mailchimp / Wix：提供字段、设计和网站使用建议。

不能照搬：

- 大规模模板库承诺。
- iframe / HTML embed 作为已上线能力。
- 生产级邮件通知。
- spam protection / captcha。
- CRM 原生同步。
- unlimited free。

### 3.4 最终上线内容

主承接页：

- URL: `https://genforms.ai/use-cases/contact-form-builder-for-websites`
- H1/Title: `AI Website Contact Form Builder`
- 中文 CTA: `免费创建联系表单`
- 英文 CTA: `Create a contact form for free`

页面已补强：

- 推荐字段：name、email/phone、company、inquiry type、message、preferred response time。
- 网站使用路径：contact page、button、footer link、support page、social profile、QR code。
- 提交后处理：submission dashboard、CSV export、Webhook-ready follow-up。
- FAQ：无代码创建、字段建议、网站使用、提交后查看、Webhook、高级 embed 边界。

## 4. 第二批 20 个关键词研究结论

第二批关键词按 4 组研究：

1. Lead Capture / Lead Generation。
2. Webhook Form。
3. Typeform Alternative。
4. QR Code Form。

原始材料：

- 报告：`ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-038-google-serp-keyword-batch-final-zh.md`
- Codex 复核：`ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-038-google-serp-keyword-batch-final-review.md`
- 原始 HTML/截图：`SEOData/serp_raw/keyword_batch_2026_06_20/`
- 解析结果：`SEOData/serp_raw/keyword_batch_2026_06_20/_all_parsed.json`
- 抓取摘要：`SEOData/serp_raw/keyword_batch_2026_06_20/_summary.md`

### 4.1 Lead Capture 组

研究关键词：

- `AI lead capture form builder`
- `lead capture form builder`
- `lead generation form builder`
- `SaaS lead capture form`
- `lead capture form template`

市场/搜索意图：

- Google 混合展示大平台产品页、垂直工具、比较博客、模板页和教程页。
- 典型竞品包括 HubSpot、Zoho、LeadCapture.io、Weavely.ai、MakeForm.ai、OrbitForms、Cometly、Typeform、Jotform。
- 用户不只是想创建表单，也在评估“哪个工具更适合获客/线索筛选”。

Codex 结论：

- 该组有价值，但竞争较强。
- 不建议立刻新建多个泛比较页。
- 优先优化现有资产：
  - `/use-cases/ai-lead-capture-form-builder`
  - `/solutions/saas-lead-capture-form-builder`
  - `/templates/lead-capture`
- 需要补强 AI 生成、qualification questions、Webhook handoff，但不能承诺 CRM 原生同步或 AI 自动跟进线索。

本阶段执行状态：

- 暂未作为 P0 第一批上线。
- 保留为 P1：等待 P0 数据反馈后再决定是否优化现有页面或写教程/比较文章。

### 4.2 Webhook Form 组

研究关键词：

- `form builder with webhook`
- `webhook form builder`
- `form webhook`
- `send form submissions to webhook`
- `webhook form integration`

市场/搜索意图：

- Google 头部结果以比较博客、开发者文档、教程页为主。
- 典型竞品和内容类型包括 Zapier、Make、Jotform docs、Typeform docs、Paperform、Stack Overflow。
- 用户意图非常明确：把表单提交发送到 webhook，并且关心配置、日志、失败处理。

Codex 结论：

- 这是最贴合 GenForms MVP 真实能力的关键词组。
- 不需要新开多个重复页面，优先补强现有 `/use-cases/webhook-form-builder-retry-logs`。
- 后续可以写支撑博客或开发者文档，但第一步是把现有页面和元信息对齐搜索意图。

本阶段上线内容：

- URL: `https://genforms.ai/use-cases/webhook-form-builder-retry-logs`
- Title: `Webhook Form Builder with Retry Logs`
- 新 CTA: `Create a webhook form`
- 强化关键词：
  - `form builder with webhook logs`
  - `webhook form builder`
  - `send form submissions to webhook`
  - `webhook form integration`
  - `form webhook retry`
  - `submission delivery logs`
- 强化内容：
  - send form submissions to a webhook。
  - delivery logs。
  - retry status。
  - illustrative webhook payload。
  - common delivery states。
  - when retry logs matter。
  - FAQ：什么是 webhook form、endpoint 失败怎么办、日志能否查看、安全边界、是否需要开发协助。

产品事实边界：

- 可以写 Webhook 配置、日志、失败重试、Feishu/DingTalk/WeCom/Slack Bot 路径。
- 不写 Zapier native integration。
- 不写“无需任何配置”。
- payload 示例必须被理解为 illustrative，不是固定格式承诺。

### 4.3 Typeform Alternative 组

研究关键词：

- `Typeform alternative with webhooks`
- `Typeform webhook alternative`
- `Typeform alternative for startups`
- `cheaper Typeform alternative`
- `Typeform alternative with AI`

市场/搜索意图：

- `Typeform alternative with webhooks` 和 `Typeform webhook alternative` 由联盟比较博客和替代品列表主导。
- `cheaper Typeform alternative` 是高购买意图词，用户已经被 Typeform 价格或套餐限制刺激，正在寻找更便宜但仍可用的替代方案。
- `Typeform alternative with AI` 竞争激烈，有 AI Overview，且 Deformity、Baktoform、CogniForm、ZaiForm、Tally、Youform 等 AI-native 竞品密集出现。

Codex 结论：

- 不应该为每个 Typeform 长尾单独开页，否则会造成关键词互相蚕食。
- 最优解是合并为一篇 `cheaper + AI + webhook` 比较文章。
- 页面角度不打“最强 AI”，而是打“更低成本 + AI 生成 + Webhook-ready workflow”。

本阶段完成内容：

- 本地草稿：`ProjectDocs/Operations/blog_drafts/cheaper-ai-typeform-alternative.md`
- 后台草稿 slug: `cheaper-ai-typeform-alternative`
- 后台草稿 UUID: `a3c6d5a7-aec5-489e-898b-bb2710bbb303`
- 状态：`created`，待人工 review/publish。

文章定位：

- Title/H1: `Cheaper AI Typeform Alternative with Webhooks`
- 覆盖意图：
  - `cheaper Typeform alternative`
  - `Typeform alternative with AI`
  - `Typeform alternative with webhooks`
  - `Typeform alternative for startups`

产品事实边界：

- 不说“最便宜”。
- 不说“100% Typeform 替代”。
- 不贬低竞品。
- 不承诺 CRM 原生同步、生产级邮件通知、spam protection、captcha、unlimited free、direct HTML embed。

### 4.4 QR Code Form 组

研究关键词：

- `QR code form builder`
- `form builder with QR code`
- `QR code survey form`
- `event registration QR code form`
- `mobile form with QR code`

市场/搜索意图：

- 多个 SERP 中出现 TIGER FORM、Google Forms / Microsoft Forms 教程、纯 QR 生成器、SurveySparrow、Jotform、Qualtrics、Flowcode、YouTube 教程。
- 组级机会明显：几乎没有 AI-native 表单工具系统性占据该方向。
- 但也存在风险：不少用户其实在找 Google/Microsoft Forms + QR 的 DIY 教程，或纯 QR code generator。

Codex 结论：

- QR 是真实机会，但不应一次开 3 个新页面。
- 先优化现有 `/use-cases/qr-code-form-builder`，用一个主承接页验证：
  - `QR code form builder`
  - `form builder with QR code`
  - `mobile form with QR code`
  - 部分覆盖 `QR code survey form`
  - 后续内链到 event registration 场景。

本阶段上线内容：

- URL: `https://genforms.ai/use-cases/qr-code-form-builder`
- Title: `QR Code Form Builder`
- CTA: `Create a QR code form`
- 强化关键词：
  - `QR code form builder`
  - `form builder with QR code`
  - `QR code survey form`
  - `event QR registration form`
  - `mobile form with QR code`
- 强化内容：
  - AI-generated form fields。
  - public form link。
  - QR code sharing for print and mobile access。
  - mobile-first filling。
  - submission dashboard and CSV export。
  - webhook-ready follow-up。
  - real-world collection points：events、counters、posters、classrooms、reception、field collection。
  - FAQ：二维码表单是什么、是否无代码、适用场景、移动端体验、提交后在哪里查看、是否提供打印/票务/离线 App。

产品事实边界：

- 不承诺打印服务。
- 不承诺票务、座位、现场签到系统。
- 不承诺离线模式或原生移动 App。
- 不承诺高级调查分析、多语言调查。

## 5. P0 执行清单与上线状态

| P0 项 | 原始判断 | 执行方式 | 状态 |
| --- | --- | --- | --- |
| Contact Form 主承接页 | Google US SERP 确认工具/网站联系表单意图 | 优化 `/use-cases/contact-form-builder-for-websites` | 已上线，已提交 Google/Bing URL Inspection |
| Typeform cheaper + AI + webhook | 高购买意图，且可形成价格 + AI + Webhook 差异化 | 创建合并比较文章草稿 | 已进后台草稿，待人工发布 |
| Webhook Form | 最贴合当前产品能力 | 补强 `/use-cases/webhook-form-builder-retry-logs` | 已部署生产 |
| QR Code Form | 竞争较弱，AI-native 空白明显 | 补强 `/use-cases/qr-code-form-builder` | 已部署生产 |

## 6. 本阶段已执行的生产验证

Contact Form 页面：

- 本地验证通过。
- 生产部署完成。
- 用户已提交 Google 和 Bing URL Inspection。

P0 Webhook / QR 页面：

- `npm test -- use-case-landing-pages.test.ts` 通过。
- `npm run build` 通过。
- 已执行 PM2 生产部署。
- PM2 `aiform-factory` online。
- `./scripts/verify-production-seo.sh https://genforms.ai` 全部通过。
- 生产 HTML 已确认：
  - `/use-cases/webhook-form-builder-retry-logs` 已包含新的 title、description、keywords、canonical、hreflang。
  - `/use-cases/qr-code-form-builder` 已包含新的 title、description、keywords、canonical、hreflang。

## 7. SEO 优化逻辑沉淀

本阶段形成的可复用规则：

1. 先看 Google 真实 SERP，再定义搜索意图。
2. 关键词要按 cluster 研究，不要孤立研究单词。
3. 竞品不是凭感觉选，而是从 Google Top URL 里选。
4. 先判断页面类型，再决定 URL：
   - 产品页意图：use-case / feature。
   - 模板意图：template。
   - 教程意图：post / docs。
   - 比较意图：comparison post。
   - 技术配置意图：docs / tutorial。
5. 已有页面能承接时，优先补强现有页，避免新建多个相近 URL。
6. 页面不能只为了 SEO 塞词，必须让用户首屏确认：
   - 我搜的问题被理解了。
   - 这个页面能解决我的任务。
   - 我下一步可以创建/试用/查看模板。
7. Webhook 是 GenForms 差异化，但不是所有关键词的首屏主角。对于 contact form，主角是 website contact form；Webhook 是高级 follow-up path。
8. 每个页面必须有产品事实 Gate，避免过度承诺。
9. 上线后进入观察期，不要频繁大改，否则无法归因。
10. SEO 页面不应只是信息页，应尽量成为“预配置创建入口”，把高意图用户带入 `create -> publish/share/QR -> submit -> dashboard/CSV/Webhook` 的完整产品漏斗。

SEO 与产品侧的职责分工已单独沉淀到：

- `ProjectDocs/Operations/seo_product_funnel_alignment_2026-06-21.md`

## 8. 后续观察指标

P0 页面进入观察期后，应按以下节奏看数据：

3-7 天：

- Google/Bing 是否重新抓取。
- SERP title/description 是否更新。
- GSC 是否出现新 query。
- 页面是否正常 index。

2-4 周：

- impressions 是否增长。
- CTR 是否偏低。
- 平均排名是否进入可优化区间。
- 真实访问是否产生 CTA、Pricing、template、form creation 行为。
- Clarity/GA4 是否看到搜索用户的停留和点击路径。

判断动作：

- 有曝光没点击：优先优化 title / meta description / SERP 摘要匹配。
- 有点击没停留：优先优化首屏、页面结构、用户主任务回答。
- 有停留没创建：优先优化 CTA、免费体验入口、示例、模板入口。
- 有创建没发布：优先回到产品漏斗优化。

## 9. 下一阶段建议

不要把后续计划理解成“等待”。P0 页面需要观察，但 SEO 研究可以继续推进。

建议下一阶段：

1. 对 P1 关键词继续做 Google US SERP 证据采集，而不是直接开页面。
2. 优先研究和 Brief：
   - `send form submissions to webhook`
   - `form webhook`
   - `lead capture form template`
   - `QR code survey form`
   - `event registration QR code form`
3. 对现有页面做优先级判断：
   - `/use-cases/ai-lead-capture-form-builder`
   - `/solutions/saas-lead-capture-form-builder`
   - `/templates/lead-capture`
   - `/solutions/event-registration-form-with-qr-code`
4. Typeform 草稿人工 review 后再发布。发布后提交 URL Inspection。
5. 每次新页面或大改动都保留：
   - 关键词证据。
   - 原始 SERP URL/截图。
   - 竞品 Top URL。
   - 搜索意图判断。
   - 产品事实 Gate。
   - 上线验证结果。

## 10. 原始材料索引

Contact Form:

- `SEOData/serp_raw/us_vpn/contact_form_builder.html`
- `SEOData/serp_raw/us_vpn/contact_form_builder.png`
- `SEOData/serp_raw/us_vpn/contact_form_generator.html`
- `SEOData/serp_raw/us_vpn/contact_form_generator.png`
- `SEOData/serp_raw/us_vpn/website_contact_form.html`
- `SEOData/serp_raw/us_vpn/website_contact_form.png`
- `ProjectDocs/Operations/seo_keyword_cluster_contact_form_2026-06-19.md`
- `ProjectDocs/Operations/seo_brief_contact_form_builder_for_websites.md`

Second keyword batch:

- `SEOData/serp_raw/keyword_batch_2026_06_20/_summary.md`
- `SEOData/serp_raw/keyword_batch_2026_06_20/_all_parsed.json`
- `SEOData/serp_raw/keyword_batch_2026_06_20/*.html`
- `SEOData/serp_raw/keyword_batch_2026_06_20/*.png`
- `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-038-google-serp-keyword-batch-final-zh.md`
- `ProjectDocs/AI-Team/reports/codex-review/AI-TASK-2026-006-038-google-serp-keyword-batch-final-review.md`

Implemented content:

- `Code/services/use-case-landing-pages.ts`
- `Code/services/use-case-landing-pages.test.ts`
- `Code/services/form-templates.ts`
- `ProjectDocs/Operations/blog_drafts/cheaper-ai-typeform-alternative.md`
- `ProjectDocs/Operations/blog_drafts/send-form-submissions-to-webhook.md`
- `ProjectDocs/Operations/seo_brief_send_form_submissions_to_webhook.md`

Production URLs:

- `https://genforms.ai/use-cases/contact-form-builder-for-websites`
- `https://genforms.ai/use-cases/webhook-form-builder-retry-logs`
- `https://genforms.ai/use-cases/qr-code-form-builder`
- `https://genforms.ai/posts/cheaper-ai-typeform-alternative`
- `https://genforms.ai/posts/send-form-submissions-to-webhook`

## 11. 2026-06-21 后续执行记录

Mike 已在后台发布并提交 Google/Bing URL Inspection：

- `https://genforms.ai/posts/cheaper-ai-typeform-alternative`

Codex 已补充提交后台草稿，待 Mike 在后台发布后再提交 Google/Bing URL Inspection：

- `https://genforms.ai/posts/send-form-submissions-to-webhook`
- 后台 UUID：`e4034e12-b53c-49f7-8cb3-5a86da2f53da`
- 当前状态：`created`

Codex 后续执行：

- 基于前期 Lead Capture 研究，复核 `/use-cases/ai-lead-capture-form-builder` 已覆盖 lead qualification questions、lead capture workflows、after-submission handoff、FAQ 和 `intent=lead_capture` 创建上下文。
- 发现 `/templates/lead-capture` 英文默认字段仍带有旧业务语境，如 `AI Agent Page`、`OCR Workflow`，与 Lead Capture 搜索意图不完全匹配。
- 已将英文模板选项调整为 `Product demo`、`Pricing or plan details`、`Partnership or integration`、`Other request`，并将补充说明字段调整为跟进前需要了解的信息。
- 已部署生产。

验证结果：

- `npm test -- use-case-landing-pages.test.ts` 通过。
- `npm run build` 通过。
- `./scripts/verify-production-seo.sh https://genforms.ai` 通过。
- 源站验证 `/templates/lead-capture` 已出现新的 Lead Capture 英文字段。
- 源站验证 `/use-cases/ai-lead-capture-form-builder` 已包含 `template=lead-capture`、`intent=lead_capture`、`Lead qualification questions` 和 `Common lead capture workflows`。
- `cheaper-ai-typeform-alternative` 已发布。
- `send-form-submissions-to-webhook` 已进入后台草稿；发布后需要再做公网内容、canonical、BlogPosting 和 sitemap 验证。

观察要求：

- `cheaper-ai-typeform-alternative` 进入 3-7 天冻结观察期。
- `send-form-submissions-to-webhook` 发布前不进入观察期；发布后再提交 Google/Bing，并进入 3-7 天冻结观察期。
- Lead Capture use-case 与 template 页也进入观察期，重点看 `AI lead capture form builder`、`lead capture form template`、`lead generation form builder`、`SaaS lead capture form` 等 query 是否出现 impressions。
- 如有曝光无点击，优先调 title/meta；如有点击无创建，优先检查创建页承接和模板预览。

## 12. 2026-06-21 Webhook 教程页转化小修

页面：

- `https://genforms.ai/posts/send-form-submissions-to-webhook`

产品/SEO 反馈：

- 页面作为 SEO 支撑文章合格，但首屏偏文章，不够像“教程 + 创建入口”。
- 主 CTA 出现偏晚。
- 缺少 webhook mini console / payload / delivery log 的可视化结果感。
- 博客详情默认侧边栏 CTA 会根据相关场景推断模板，可能落到 `lead-capture` 这类泛入口。
- metadata keywords 偏泛。
- 可见 FAQ 已存在，适合补 FAQPage JSON-LD。

已执行修正：

- 正文第一屏后新增 `Create a webhook-ready form` CTA，统一携带：
  - `template=contact-us`
  - `source=post_send-form-submissions-to-webhook`
  - `intent=webhook_form`
  - webhook-ready prompt
- 新增 `Webhook Workflow Preview` 表格，覆盖 endpoint、payload preview、delivery status、retry log、failure reason。
- 对 `send-form-submissions-to-webhook` slug 增加博客侧边栏专属 CTA，避免落到 `lead-capture` 或泛 `/forms/new`。
- 对该 slug 增加精准 keywords：
  - `send form submissions to webhook`
  - `form webhook`
  - `webhook form builder`
  - `webhook delivery logs`
  - `form webhook retry`
- 对该 slug 增加 FAQPage JSON-LD，内容与页面可见 FAQ 一致。

验证结果：

- 已更新在线文章正文，UUID：`e4034e12-b53c-49f7-8cb3-5a86da2f53da`。
- `npm test -- use-case-landing-pages.test.ts` 通过。
- `npm run build` 通过。
- 已部署生产，PM2 online。
- `./scripts/verify-production-seo.sh https://genforms.ai` 通过。
- 源站 HTML 已确认包含：
  - `Create a webhook-ready form`
  - `Webhook Workflow Preview`
  - `FAQPage`
  - `template=contact-us`
  - `intent=webhook_form`
  - `webhook delivery logs`
  - `form webhook retry`
- 源站 sitemap 已确认包含该 URL；公网边缘 sitemap/HTML 可能存在短暂 Cloudflare 缓存延迟。
