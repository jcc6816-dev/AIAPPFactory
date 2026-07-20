# Topic 2: Lead form AI information gain

## 1. Environment and evidence status
Success. Captured in Google US (gl=us&hl=en&pws=0) via Playwright after manual CAPTCHA clearance. Evidence saved in `evidence/`.

## 2. Query list and evidence file mapping
- `lead form ai`: `evidence/lead_form_ai.*`
- `ai lead capture form builder`: `evidence/ai_lead_capture_form_builder.*`
- `lead capture form builder`: `evidence/lead_capture_form_builder.*`

## 3. Organic Top 10 tables
(See `serp_data.json` for full URLs and titles).
Top domains include: HubSpot, Weavely, Makeform, Zoho, Mailchimp, Typeform, Perspective Funnels.

## 4. SERP feature and page-type distribution
- Product Pages (AI Form Builders): ~60% (Weavely, Makeform, Zoho)
- Traditional CRM/Marketing Suites: ~30% (HubSpot, Mailchimp)
- Listicles/Blogs: ~10% (Taskade, Perspective Funnels)

## 5. Search intent conclusion
- 三个 query 的 SERP intent 是否相同？产品页、模板页、教程、AI lead generation 工具各占多少？
  答：基本相同，主要是寻找**构建表单的工具**（产品落地页占 60% 以上）。用户在找的是“AI 生成表单”（即用 AI Prompt 快速生成用于获取线索的表单），而不是“AI 自动找/评分/跟进 leads 的智能体”。
- 排名前列页面最常见的可见模块是：表单构建界面的截图、功能列表（集成 CRM）和模板展示。

## 6. Competitor patterns and information gain
- 现有竞品大多在鼓吹“AI 自动化”，但多为传统表单加上 AI 包装。
- GenForms 独立的信息增益是：**字段/Prompt 示例**。展示具体的“一句话 Prompt”如何瞬间生成针对特定行业（如房地产、SaaS）的单题流 Lead 收集表单，并展示极简的用户端体验。

## 7. GenForms product fit and product gaps
- Fit: AI 一句话生成 JSON Schema，单题流体验，Webhook 投递线索。
- Gap: 缺乏原生 CRM 深度集成（HubSpot/Salesforce 同步）、Spam Protection 和生产级自动回复。我们必须在文案中 Hold 住这些承诺，强调通过 Webhook + Zapier/Make 来实现路由。

## 8. Existing owner and cannibalization decision
- 当前 Pillar 为 `/use-cases/ai-lead-capture-form-builder`，Solution 为 `/solutions/saas-lead-capture-form-builder`。定位清晰，无需新增 Pillar 造成同义词蚕食。

## 9. Recommended single next action
Execute an Existing Tune on `/use-cases/ai-lead-capture-form-builder` to inject concrete "AI Prompt to Form" examples and clarify the Webhook-based integration model.

## 10. Final decision
`Existing Tune`

## 11. Confidence
High. The SERP explicitly rewards "AI form builder" product pages over automated sales SDRs, matching GenForms' MVP capabilities perfectly.
