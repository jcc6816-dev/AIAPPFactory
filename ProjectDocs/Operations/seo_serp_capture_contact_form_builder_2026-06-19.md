# SERP Capture: `contact form builder`

Date: 2026-06-19
Owner: Codex
Status: revised market-research pass; no page/code changes

## 1. Why This Exists

上一版 `seo_brief_contact_form_builder_for_websites.md` 选择了 Jotform 和 HubSpot 作为竞品样本，但选择逻辑偏“代表性模式判断”，不够严格。

本文件重新用更科学的方法校准：

1. 先从搜索关键词和公开市场结果中识别候选竞品。
2. 再用统一评分表判断它们是否真正满足 `contact form builder` 搜索意图。
3. 最后再决定哪些页面模式值得 GenForms 借鉴。

核心原则：不靠主观小聪明猜竞品，先看市场已有结果，再抽象搜索意图。

## 2. Research Method

### 2.1 Query Set

本轮围绕以下查询进行公开搜索与页面采样：

- `contact form builder`
- `contact form builder website`
- `best contact form builder`
- `free contact form builder`

### 2.2 Evidence Sources

本轮采用三类证据：

| Evidence | Role |
| --- | --- |
| Public search result sample | 看 Google/搜索结果会把哪些页面类型放进候选 |
| Third-party market review | 看成熟市场如何定义主要 form builder 竞争集合 |
| Official competitor pages | 验证竞品自己如何满足搜索意图 |

### 2.3 Important Limitation

当前环境拿到的公开搜索结果不是稳定、可复现的 Google Top 10 SERP 截图。因此本文件不宣称“某页面就是 Google 第 1 名/第 2 名”。

更严谨的正式实现前动作应该是：

- 用同一地区、无登录或干净浏览器；
- 搜索 `contact form builder`；
- 记录前 10 名 URL、标题、摘要、页面类型；
- 截图保存；
- 再做最终 Brief 审批。

本轮结论只能作为“市场调研校正版”，比上一版更可靠，但还不是完整 SERP 审计。

## 3. Candidate Discovery

### 3.1 Search / Market Result Signals

公开搜索和第三方 form builder 市场结果共同暴露出这些候选：

| Candidate | Why included |
| --- | --- |
| Jotform | 在 form builder 市场中高频出现；有直接的 Contact Forms 模板类页面 |
| HubSpot | 有 Free Online Form Builder 页面，强绑定 lead capture、CRM、follow-up |
| Formstack | 第三方市场评测中常作为 comprehensive / workflow / enterprise form builder 出现 |
| Typeform | 强交互体验、设计、single-question flow，是用户体验型竞品 |
| Zoho Forms | 强 email workflow / automation，适合 workflow 维度参考 |
| Microsoft Forms / Google Forms | 通用表单基线，代表免费、可信、熟悉的用户心智 |
| Wix | Website builder 场景下的 contact form / website form 候选 |

### 3.2 Why Jotform And HubSpot Were Initially Selected

上一版选择 Jotform 和 HubSpot，不是因为它们被严格验证为 SERP 前 2 名，而是因为它们分别代表两种重要模式：

- Jotform：模板库和立即使用。
- HubSpot：表单提交后的业务跟进。

这个判断方向仍然有价值，但方法不够完整。科学流程应先发现候选，再评分，而不是先挑代表。

## 4. Search Intent Scoring Rubric

`contact form builder` 的用户核心任务被拆成 6 个维度，每项 0-5 分：

| Dimension | Question |
| --- | --- |
| Direct keyword/page fit | 页面是否直接服务 contact form / form builder，而不是泛营销工具？ |
| Immediate creation path | 是否让用户马上创建、使用模板、开始构建？ |
| Template/field depth | 是否提供模板、字段、子场景和示例？ |
| Website publishing fit | 是否说明嵌入网站、分享链接、移动端体验？ |
| Post-submit workflow | 是否说明提交后进入哪里、如何通知/跟进/路由？ |
| Trust/commercial maturity | 是否体现可靠性、安全、FAQ、成熟品牌或市场认可？ |

满分 30 分。

## 5. Competitor Scoring

| Candidate | Direct fit | Creation path | Template/field depth | Website fit | Workflow | Trust | Total | Read |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Jotform Contact Forms | 5 | 5 | 5 | 5 | 4 | 5 | 29 | 最强 contact-specific 样本 |
| HubSpot Form Builder | 3 | 4 | 4 | 4 | 5 | 5 | 25 | 最强 post-submit / lead workflow 样本 |
| Formstack | 3 | 4 | 3 | 4 | 5 | 5 | 24 | 强 workflow/enterprise 样本，需后续采样官方页 |
| Typeform | 3 | 4 | 4 | 4 | 3 | 5 | 23 | 强体验样本，但不一定最贴 contact form |
| Zoho Forms | 3 | 4 | 3 | 3 | 5 | 4 | 22 | 强 email/workflow 样本 |
| Wix | 4 | 4 | 3 | 5 | 2 | 4 | 22 | 强 website context 样本 |
| Microsoft / Google Forms | 3 | 4 | 3 | 3 | 2 | 5 | 20 | 免费通用基线，非 contact-specific 最强 |

## 6. Revised Finding

上一版结论：

- Jotform + HubSpot 可以作为两个代表竞品。

本轮修正后结论：

- Jotform 仍应作为第一参考样本，因为它直接覆盖 contact form 搜索意图：模板、字段、子场景、Use Template、FAQ、创建步骤和提交后管理。
- HubSpot 仍有价值，但它不是 `contact form builder` 的最直接竞品，而是“提交后业务跟进 / lead workflow”的参考样本。
- Formstack、Typeform、Wix、Zoho 应该进入正式 Brief 前的竞品对照表，而不是被忽略。
- 因此，Brief 不应该写成“参考 Jotform 和 HubSpot 两家”，而应该写成“以 Jotform 为主样本，HubSpot/Formstack/Zoho 补 workflow，Typeform 补体验，Wix 补 website context”。

## 7. What Google / Market Likely Defines As The Intent

基于公开搜索结果和竞品页面结构，`contact form builder` 的搜索意图不是单一的“创建表单”。

它至少包括 5 个层次：

1. Template intent：给我一个可以直接用的 contact form。
2. Builder intent：让我不用代码就能调整字段和样式。
3. Website intent：我能把它放到网站、落地页或分享链接里。
4. Follow-up intent：提交后团队能收到、整理、回复、路由。
5. Trust intent：表单要可靠、移动端可用、数据不要丢。

这意味着 GenForms 页面必须同时回答：

- 怎么创建；
- 应该收哪些字段；
- 用在哪些联系/咨询场景；
- 提交后怎么跟进；
- 为什么这个工具不是一个孤立表单。

## 8. Implications For GenForms

### 8.1 Page Strategy

`/use-cases/contact-form-builder-for-websites` 仍然是正确承接页。

但页面优化重点要改成：

1. 以 Jotform 的模板/字段/场景深度作为主借鉴对象。
2. 以 HubSpot/Formstack/Zoho 的 post-submit workflow 作为辅助借鉴。
3. 以 Typeform 的一题一屏体验作为 GenForms 自己的体验差异化。
4. 以 Wix 的 website publishing 语境作为页面表达的补充。

### 8.2 Messaging

建议定位从：

`AI contact form builder with webhook-ready handoff`

微调为：

`AI website contact form builder with fields, share links, and webhook-ready follow-up`

原因：

- `website` 更贴合搜索场景。
- `fields` 回答模板/字段需求。
- `share links` 回答发布需求。
- `webhook-ready follow-up` 保留 GenForms 差异化，但不抢走 contact form 主意图。

### 8.3 Modules To Keep

上一版 Brief 里建议的模块大体成立：

- Intent Match
- Field Checklist
- Contact inquiry sub-scenarios
- Post-submit Workflow
- FAQ
- Internal links

但 Brief 需要改写竞品依据：不要只写“Jotform + HubSpot”，而是写成“SERP/市场样本支持这些模块”。

## 9. Updated Competitive Borrowing Rules

可以借鉴：

- Jotform 的模板和子场景组织方式。
- HubSpot 的 follow-up / lead workflow 叙事方式。
- Formstack/Zoho 的 automation/workflow 维度。
- Typeform 的 mobile-friendly / conversational form 体验表达。
- Wix 的 website publishing 语境。

不应复制：

- 任何竞品原文。
- 竞品品牌风格。
- Jotform 的大规模模板库承诺。
- HubSpot 的 CRM 原生同步、lead nurturing、Salesforce 双向同步承诺。
- Formstack/Zoho 的企业自动化和审批能力，除非 GenForms 当前产品事实支持。

## 10. Required Change To Existing Brief

`seo_brief_contact_form_builder_for_websites.md` 应更新：

1. 竞品章节改名为“SERP / Market Patterns”。
2. 不再说“选择 Jotform 和 HubSpot 两个竞品样本”。
3. 改为：
   - Primary pattern: Jotform-style contact template depth。
   - Workflow pattern: HubSpot/Formstack/Zoho-style post-submit follow-up。
   - UX pattern: Typeform-style guided mobile experience。
   - Website context: Wix-style website publishing。
4. 结论保持不变：仍建议优化现有 Use Case，而不是新建页面。

## 11. Source Notes

本轮实际查看或采样的公开来源：

- Jotform Contact Forms template category: https://www.jotform.com/form-templates/category/contact-form
- HubSpot Free Online Form Builder: https://www.hubspot.com/products/marketing/forms
- TechRadar Best online form builder of 2025: https://www.techradar.com/best/best-online-form-builder

下一轮进入实现前应补充：

- Clean Google SERP screenshot。
- Formstack official page capture。
- Typeform official form builder / templates capture。
- Wix form builder or website contact form capture。
- Zoho Forms workflow/email automation capture。
