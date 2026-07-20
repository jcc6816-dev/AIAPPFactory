# Gemini SEO Research Batch Prompt — 2026-07-03

请把下面从“任务开始”到“任务结束”的全部内容作为**一个任务、一次性执行**。不要拆成多个独立对话，也不要修改指定输出目录以外的任何文件。

---

## 任务开始

你正在为 GenForms 执行 `SEO Growth Production Loop` 的首个 3-Topic Research Batch。请按 Topic 1 -> Topic 2 -> Topic 3 的顺序，在**干净浏览会话、Google US 环境**中完成真实 SERP 研究，然后一次性交付全部结果。

### 一、执行目的

本批次不是为了强行创建 3 个新页面，而是回答：

1. QR 现有页面是否值得一次单变量 Golden Tuning。
2. Lead 现有 Cluster 是否缺少可带来排名提升的真实信息增益。
3. Typeform Alternatives 当前问题是否主要在 Authority / Distribution，而不是继续重写正文。

### 二、强制证据规则

1. 必须使用真实 Google 搜索结果，地区为美国、语言为英语、个性化关闭；优先记录 `gl=us&hl=en&pws=0`。
2. 每个 query 记录执行日期、时间、可见 IP/Google inferred location、完整 Google URL。
3. 每个 query 必须保存能复核的全页截图或 HTML；不能只写搜索摘要。
4. 只记录自然搜索 Top 10，并明确标记 Ads、AI Overview、视频、People Also Ask、Reddit/论坛等 SERP feature，不得把它们混入 Organic 1-10。
5. 不得使用搜索 API、第三方关键词 API、推断排名、旧报告补写或模型记忆代替真实页面。
6. 若 Google CAPTCHA、地区错误、浏览器失败或无法保存证据，立即将该 query 标记 `Blocked`；不得补写看似真实的 Top 10。
7. 每条自然结果记录：position、title、URL、domain、page type、主要承诺、为什么符合该 query。
8. 结论必须能追溯到保存的截图/HTML；无证据的判断标记为 hypothesis。

### 三、产品事实红线

GenForms 当前可承接：

- AI 从 prompt 生成表单字段。
- 单题流/移动端填写体验。
- 发布公开链接和二维码分享。
- 提交数据存储、基础数据面板、CSV 导出。
- Webhook 推送、重试和日志。
- 3 套基础主题。

本批次不得把以下能力写成已上线事实：

- iframe / HTML embed。
- 生产级邮件通知或自动回复。
- 条件逻辑。
- PDF-to-form。
- WhatsApp 原生通知或集成。
- 票务、支付、座位、唯一票券二维码或现场核销。
- HubSpot、Salesforce 等 CRM 原生同步。
- spam protection、analytics suite、unlimited free。
- 5 套主题。

如果竞品或 SERP 强依赖这些能力，要记录为 Product Gap，而不是把它变成 GenForms 文案。

### 四、Topic 1：QR scan-to-fill / event QR

执行 queries：

1. `qr code form builder`
2. `how to create a qr code form`
3. `qr code event registration form`

现有 owner：

- Pillar：`/use-cases/qr-code-form-builder`
- Event Pillar：`/use-cases/event-registration-form-builder`
- Template：`/templates/event-registration`

必须回答：

- SERP 是需要产品页、教程、模板页，还是 QR generator？
- `qr code event registration form` 是“scan to fill”还是“ticket/check-in QR”？分别占多少自然结果？
- 当前 GenForms owner 是否正确；是否有 URL cannibalization 风险？
- 在 FAQ、结果感模块、字段/Prompt 示例、Cluster 内链四类中，哪一个是最明确的信息增益？
- 是否足以支持 `Existing Tune`，还是应 `Hold / Reject`？不得默认建议新 URL。

### 五、Topic 2：Lead form AI information gain

执行 queries：

1. `lead form ai`
2. `ai lead capture form builder`
3. `lead capture form builder`

现有 owner：

- Pillar：`/use-cases/ai-lead-capture-form-builder`
- Template：`/templates/lead-capture`
- Solution：`/solutions/saas-lead-capture-form-builder`
- 已有支撑 Post，不允许再创建同义 Pillar。

必须回答：

- 三个 query 的 SERP intent 是否相同；产品页、模板页、教程、AI lead generation 工具各占多少？
- 排名前列页面最常见的可见模块、证明、字段示例、AI 演示是什么？
- 用户在找“AI 生成表单”，还是“AI 自动找/评分/跟进 leads”？如果混合，明确边界。
- GenForms 当前能增加的独立信息增益是什么；哪些需求需要 CRM、AI SDR、邮件或 spam protection，必须 Hold？
- 输出只能是 `Existing Tune / Template Tune / Authority / Hold / Reject` 之一；除非现有 owner 明显错误，否则不得建议新 URL。

### 六、Topic 3：Typeform Alternatives Authority / Distribution

执行 queries：

1. `free typeform alternative`
2. `typeform alternative free`
3. `cheaper typeform alternative`

现有 owner：

- Commercial Hub：`/posts/typeform-alternatives`
- Product angle：`/use-cases/typeform-alternative-webhooks`
- Price angle：`/posts/cheaper-ai-typeform-alternative`
- Comparison support：已有 Google Forms vs Typeform vs GenForms 内容。

已知约束：`/posts/typeform-alternatives` 已完成一次结构改造，本批次**不允许建议第二次全文重写，也不允许新增另一个 Typeform Alternatives URL**。

必须回答：

- Top 10 的 domain strength、页面类型、更新时间、第一方产品页 vs 第三方 listicle 分布。
- “free”结果实际强调永久免费、free tier、开源/self-hosted，还是低价？
- “cheaper”结果强调价格比较、功能表、迁移、模板还是单题流体验？
- GenForms 当前排名问题更像 Intent、Content depth、Freshness、Brand/Authority、Backlinks、Internal links 或 Distribution 中的哪些；按证据排序。
- 给出一个不重写全文的 Authority/Distribution 计划：目标页面、可获得的提及类型、Cluster 内链来源、可信证明资产和衡量方式。
- 最终只能输出 `Authority / Existing Tune / Hold / Reject`；不得默认新建竞品页。

### 七、输出目录与文件

只允许创建或修改以下目录：

`ProjectDocs/Operations/seo_growth_production_loop/research_batch_2026-07-03/`

必须生成：

1. `batch_index.md`
2. `qr_scan_to_fill_intent.md`
3. `lead_form_ai_information_gain.md`
4. `typeform_authority_distribution.md`
5. `evidence/` 下每个 query 的截图或 HTML，文件名可明确映射到 query。

不要修改：

- `seo_growth_production_loop_state.md`
- `seo_growth_production_backlog_2026-07.md`
- `seo_topic_loop_cursor_2026-06-30.md`
- 任何代码、页面、sitemap、Schema、旧研究报告或 index 文件。

### 八、每个 Topic 的固定报告结构

1. Environment and evidence status
2. Query list and evidence file mapping
3. Organic Top 10 tables
4. SERP feature and page-type distribution
5. Search intent conclusion
6. Competitor patterns and information gain
7. GenForms product fit and product gaps
8. Existing owner and cannibalization decision
9. Recommended single next action
10. Final decision：`Existing Tune / Template Tune / Authority / Hold / Reject / Blocked`
11. Confidence：High / Medium / Low，并解释原因

### 九、batch_index.md 必须包含

- 3 个 Topic 的 Evidence status。
- 每个 query 的证据文件链接。
- 每个 Topic 的 Final decision 和 confidence。
- 任何 Blocked query。
- 明确声明：`No page, code, sitemap, schema, or existing operations file was modified.`

完成后只报告实际生成的文件、证据状态和 3 个 Final decision。不要声称页面已可 Build；Build Gate 由 Codex 复核后决定。

## 任务结束

