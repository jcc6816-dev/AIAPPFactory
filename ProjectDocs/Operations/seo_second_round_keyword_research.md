# SEO Second Round Keyword Research

Date: 2026-06-19
Owner: Codex
Status: research complete; no production page changes

## 1. Purpose

第一批已经完成并冻结：

- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-lead-capture-form-builder`

第二批关键词研究的目标不是马上继续大规模改页面，而是回答三个问题：

1. 哪些关键词有真实搜索需求或内部信号。
2. Google 当前更倾向展示什么类型的结果。
3. GenForms 应该借鉴哪些竞品模式，并在哪些地方形成自己的切入口。

本轮遵循 `google_seo_quality_rules.md`：小批量、可归因、避免 doorway 页面、避免夸大未上线能力。

## 2. Evidence Model

| Evidence type | Meaning | Confidence impact |
| --- | --- | --- |
| Internal GSC signal | GenForms 已在 GSC 出现 query 或主题级 impressions | high |
| Existing page fit | 站内已有可承接页面，不需要新建弱页面 | high |
| Live public SERP / competitor sampling | 公开搜索与竞品页面的页面类型、首屏承诺、CTA、FAQ、模板结构 | medium |
| Product capability fit | 当前 MVP 能真实满足，不需要承诺未上线能力 | high |
| Exact keyword evidence missing | 只有主题推导，缺少 exact query 或稳定排名数据 | risk |

本轮没有使用付费关键词工具，因此不写搜索量数字。进入 Brief 前，每个关键词仍需要做一次更细的 SERP capture：记录查询时间、地区/语言、前 10 结果类型、竞品页面首屏、CTA、FAQ、结构化数据和我们可借鉴的模块。

## 3. Overall Decision

| Keyword | Existing target | Evidence strength | Competition | Recommended action | Deployment timing |
| --- | --- | ---: | ---: | --- | --- |
| `contact form builder` | `/use-cases/contact-form-builder-for-websites` plus `/templates/contact-us` and `/solutions/website-contact-form-template` | high | high | Prepare the next Brief first | Wait until first two pages have 3-7 days observation unless Mike explicitly approves earlier |
| `typeform alternative with webhooks` | `/use-cases/typeform-alternative-webhooks` | medium-high | high | Prepare after contact form; keep comparison factual | Stagger after contact form |
| `google forms alternative with webhooks` | `/use-cases/google-forms-alternative-ai` plus comparison/support content | medium | high | Research one more SERP pass before Brief | Do not deploy before fact-boundary review |
| `lead capture form template` | `/templates/lead-capture` plus AI Lead use case | medium | medium-high | Keep as template optimization candidate | Wait for AI Lead page observation first |

## 4. Keyword: `contact form builder`

### Search Intent

用户通常不是想读概念文章，而是想快速完成：

- 创建一个可以嵌入网站或分享链接的联系表单。
- 收集姓名、邮箱、电话、消息、询价或支持请求。
- 收到通知，并能把提交内容转给销售、客服或内部流程。
- 避免遗漏消息、垃圾提交和手动复制。

### How Google Appears To Understand It

公开 SERP 与竞品页面显示，Google 倾向把这个词理解为工具型和模板型意图。更容易出现：

- form builder 产品页。
- contact form template/category 页。
- no-code website/contact form 教程。
- 带 `use template` 或 `start for free` 的高转化模板页面。

Jotform 的 Contact Forms 页面是典型模式：它不是只讲一个联系表单，而是把大量模板、模板预览、`Use Template` CTA、场景解释、字段建议、用途拆分和工作流价值放在同一个入口里。这个页面对我们的启发不是复制文案，而是学习它用“模板库 + 任务说明 + 立即使用”来满足搜索意图。

### Competitor Patterns Worth Borrowing

1. 首屏直接回答“我能不能马上创建联系表单”。
2. 把模板选择放在非常靠前的位置，而不是先讲长篇理念。
3. 解释联系表单能覆盖 general inquiry、support、sales quote、feedback、partnership 等不同场景。
4. 明确提交后的下一步：通知、表格、CRM、Webhook、团队处理。
5. FAQ 回答创建、嵌入、通知、垃圾提交、字段选择等具体问题。

### GenForms Cut-in

不要正面抢泛 `contact form builder` 的大词心智，而是把页面定位成：

`AI contact form builder with webhook notifications`

GenForms 可以形成更窄但更真实的差异化：

- AI 根据网站用途生成字段，而不是从空白表单开始。
- 单题流体验适合移动端询价和线索收集。
- Webhook retry logs 是提交后工作流的可信承接点。
- 内链到 contact template、website contact solution、webhook use case。

### Recommended Page Action

优先做现有页面优化，而不是新建页面：

- Main page: `/use-cases/contact-form-builder-for-websites`
- Supporting pages: `/templates/contact-us`, `/solutions/website-contact-form-template`
- Internal links: Webhook retry logs, AI lead capture, Google Forms alternative。

建议下一份 Brief 就写这个关键词。它有 GSC query 级信号，现有页面也能承接，是第二批最稳的候选。

### Risks

- 泛词竞争强，不能指望短期冲到前排。
- 如果页面只重复“contact form builder”但没有展示模板、字段和提交后处理，会显得空。
- 不要承诺当前没有的原生 CRM 双向同步。

## 5. Keyword: `typeform alternative with webhooks`

### Search Intent

这个词不是普通替代品搜索，而是更接近：

- 用户喜欢 Typeform 的一题一屏体验，但需要更明确的 webhook/workflow 控制。
- 用户正在比较 Typeform、Jotform、Tally、Fillout、Paperform、Formstack 等工具。
- 用户可能关心价格、免费额度、集成、API、Webhook 可靠性、表单体验和数据导出。

### How Google Appears To Understand It

公开结果更可能混合出现：

- `Typeform alternatives` listicle。
- 竞品对比页。
- Typeform 官方 Webhooks help / developer content。
- 表单工具的 integration/workflow 页。

这说明 Google 可能把它理解成“比较 + 集成能力验证”的混合意图，而不是单纯的产品页。

Typeform 官方 Webhooks help 页面说明了 webhook 设置、endpoint、secret、SSL verification、trigger、delivery storage 和错误处理等细节。这个模式对 GenForms 的启发是：如果我们讲 webhook alternative，页面必须把 webhook 交付、失败、重试、日志这些具体问题讲清楚。

### Competitor Patterns Worth Borrowing

1. 先承认 Typeform 的强项：体验、品牌、模板和生态。
2. 对比维度要具体：AI 生成、单题流、Webhook、retry logs、handoff、pricing/limits、template speed。
3. 要有“谁适合 Typeform，谁适合 GenForms”的诚实边界。
4. CTA 不应只有“try us”，还要有“build a webhook form”或“start with lead/contact template”。

### GenForms Cut-in

GenForms 不应该写成攻击 Typeform 的页面，而是写成：

`Typeform-like forms for teams that need webhook handoff and retry visibility`

我们可借的模式是“对比框架”，可撕开的点是：

- 从空白编辑器转向 prompt-to-form。
- 从漂亮表单转向提交后的工作流可靠性。
- 从泛替代品转向 Webhook + logs 的细分场景。

### Recommended Page Action

可以进入第二或第三个 Brief，但建议排在 `contact form builder` 之后。

Target:

- `/use-cases/typeform-alternative-webhooks`

Required modules:

- “When Typeform is enough / when GenForms fits better”
- Webhook delivery and retry explanation
- Lead/contact template CTA
- Internal links to first-batch webhook page and AI lead capture page
- FAQ with factual comparison boundaries

### Risks

- 竞品词容易吸引不精准流量，停留时长和 CTA 可能不稳定。
- 不能写虚假的价格比较或贬低竞品。
- 不能把我们没有的高级逻辑跳转、CRM 原生同步等能力包装成已有功能。

## 6. Keyword: `google forms alternative with webhooks`

### Search Intent

用户往往有一个已经熟悉 Google Forms 的基线，但遇到这些问题：

- 想要更好看的表单体验。
- 想要自动通知、Webhook、API 或下游工作流。
- 想要从 Google Sheets/manual process 升级到更明确的数据处理。
- 想要更适合线索、询价、报名或内部请求的表单。

### How Google Appears To Understand It

公开搜索更容易把这个意图拆成两类：

- 泛 `Google Forms alternative`：listicle 和工具对比。
- `with webhooks`：更偏 workflow/integration/developer 需求。

Google Forms 官方页面强调表单创建、分享/嵌入、数据收集、Google 生态与安全合规。这解释了为什么“替代 Google Forms”不是简单替代一个表单，而是在替代一个熟悉、免费、可信、可协作的工作方式。

### Competitor Patterns Worth Borrowing

1. Listicle 会用“best for X”帮助用户快速分流。
2. 替代品页会明确 Google Forms 的优势，再讲升级理由。
3. 强工具会强调 templates、integrations、automation、payments、CRM、notifications。
4. 可信页面会说明安全、数据和协作，而不是只讲漂亮界面。

### GenForms Cut-in

GenForms 应该切入：

`Google Forms alternative for AI-generated forms and webhook handoff`

而不是泛泛说“best Google Forms alternative”。可承接的真实优势：

- AI 生成字段和单题流体验。
- 发布链接和收集提交。
- Webhook 推送、重试和日志。
- 面向 lead/contact/workflow handoff，而不是通用问卷。

### Recommended Page Action

先做更细的 fact-boundary review，再写 Brief。

Target:

- `/use-cases/google-forms-alternative-ai`

Brief 前必须确认：

- 页面不能承诺 Google Sheets 双向同步。
- 页面不能承诺原生 CRM 直连。
- 页面可以说 webhook handoff、export/dashboard、AI generation、single-question flow。

### Risks

- Google Forms 免费且强品牌，泛词竞争强。
- 如果我们没有清楚写“适合谁/不适合谁”，用户可能快速返回 SERP。
- 过度承诺集成能力会伤害信任和后续转化。

## 7. Keyword: `lead capture form template`

### Search Intent

用户更偏向直接拿一个模板，而不是研究工具：

- 想快速创建一个收集潜在线索的表单。
- 想知道应该问哪些字段。
- 想让表单适配广告、内容下载、SaaS demo、newsletter、event signup 等不同场景。
- 想把线索送到邮件、Slack、CRM、Webhook 或表格中。

### How Google Appears To Understand It

公开竞品页面显示，这类词通常由模板页、template category、lead generation guide 和 form builder 页面承接。

Typeform 的 lead generation template 页面把首屏 CTA、移动端适配、品牌自定义、体验、集成、FAQ 和相关模板放在一起。这个模式说明：模板页不能只是一个模板详情页，还要解释用户为什么应该用这个模板、怎么推广它、线索收集后怎么处理。

### Competitor Patterns Worth Borrowing

1. 模板预览在前，说明在后。
2. CTA 要直接进入模板使用，而不是泛创建。
3. 字段建议要具体：name、email、company、use case、budget、timeline、consent。
4. FAQ 覆盖 lead generation、capture method、promotion、post-submit workflow。
5. 相关模板推荐可以延长停留和二次点击。

### GenForms Cut-in

这个词最适合模板页，而不是再建一个泛 use-case 页。

Target:

- `/templates/lead-capture`
- Support: `/use-cases/ai-lead-capture-form-builder`
- Support: `/use-cases/webhook-form-builder-retry-logs`

定位建议：

`AI-ready lead capture form template with qualification questions and webhook delivery`

### Recommended Page Action

暂时不要立刻改。原因不是它不重要，而是第一批刚优化了 AI Lead Capture 页面，需要先观察 3-7 天，看 Google 是否给出 `lead capture form`、`lead capture form template`、`AI lead capture form builder` 相关 impressions。

如果第一批页面有正向信号，则模板页优化会成为很自然的第二跳。

### Risks

- Exact query 内部证据不足。
- 模板页如果没有足够可见内容，Google 可能认为页面薄。
- 需要确认模板页结构是否支持 FAQ、related templates、internal links 和 clear template CTA。

## 8. Borrowing Rules From Competitors

可以借鉴：

- 页面结构。
- 搜索意图拆解。
- CTA 路径。
- FAQ 问题类型。
- 对比维度。
- 模板/用例组合方式。
- 首屏承诺的清晰度。

不要复制：

- 原文文案。
- 视觉表达和品牌风格。
- 竞品专有命名。
- 未经验证的数据宣称。
- 我们没有能力支撑的功能承诺。

我们的核心方法是：借优秀竞品“怎么满足意图”，然后用 GenForms 的真实能力重新表达。

## 9. Recommended Execution Order

### Step 1: Keep First Batch Frozen

继续冻结：

- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-lead-capture-form-builder`

只观察，不改正文、不改 title、不改 meta，除非出现严重索引或渲染问题。

### Step 2: Prepare Brief For `contact form builder`

下一份 Brief 建议写：

`AI Contact Form Builder with Webhook Notifications`

目标页面：

- `/use-cases/contact-form-builder-for-websites`

配套内链：

- `/templates/contact-us`
- `/solutions/website-contact-form-template`
- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-lead-capture-form-builder`

### Step 3: Prepare Brief For `typeform alternative with webhooks`

第二份 Brief：

`Typeform Alternative With Webhooks`

但要保持事实边界，不做攻击性对比。

### Step 4: Revalidate Google Forms Alternative

第三个主题先做 SERP capture 和产品事实边界表，再决定是否进入 Brief。

### Step 5: Wait Before Lead Capture Template Optimization

等 AI Lead Capture 页面 GSC 反馈后，再决定是否优化 `/templates/lead-capture`。如果相关 impressions 出现，模板页会是很好的转化承接页。

## 10. Measurement Plan

每个第二批页面进入优化后，按同一套观察方式：

| Window | What to check |
| --- | --- |
| Day 0 | Production canonical, hreflang, title, meta, JSON-LD, visible FAQ, CTA path |
| Day 3-7 | GSC impressions, query variants, indexed/crawled status, CTR direction |
| Day 14 | 是否被错误 query 拉偏；是否需要 title/meta 小改 |
| Day 30 | 是否扩展支撑 Post、模板页或 comparison page |

重点指标：

- Search impressions by query cluster.
- CTR by page/query.
- Average position movement.
- CTA click to `/forms/new` or template start.
- Internal link clicks to support pages.
- Engagement time / bounce proxy if analytics available.

## 11. Final Recommendation

第二批不要同时改四个页面。建议顺序：

1. `contact form builder`：最先写 Brief，证据最稳，页面承接最自然。
2. `typeform alternative with webhooks`：第二个写 Brief，商业价值高，但对比边界要克制。
3. `google forms alternative with webhooks`：先补事实边界和 SERP capture，再决定 Brief。
4. `lead capture form template`：等第一批 AI Lead 页面观察结果，再优化模板页。

这套顺序能延续第一批的科学依据：先选真实需求和已有信号，再看 Google/竞品如何满足搜索意图，最后才改页面并冻结观察。

## 12. Public Sources Sampled

- Jotform Contact Forms template category: https://www.jotform.com/form-templates/category/contact-form
- Typeform Lead Generation Form Template: https://www.typeform.com/templates/t/lead-generation/
- Typeform Webhooks Help Center: https://help.typeform.com/hc/en-us/articles/360029573471-Webhooks
- Google Forms official product page: https://workspace.google.com/products/forms/
- TechRadar Google Forms alternatives overview: https://www.techradar.com/pro/best-alternative-to-google-forms-of-year
