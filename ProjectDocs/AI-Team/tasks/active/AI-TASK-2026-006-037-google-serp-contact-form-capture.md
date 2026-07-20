# AI-TASK-2026-006-037：Google SERP Contact Form 关键词簇采集

## 任务元信息

- task_id: AI-TASK-2026-006-037
- status: active
- assignee: Gemini
- reviewer: Codex
- priority: P0
- created_at: 2026-06-19
- due: 2026-06-19
- permission_level: REPORT_ONLY
- code_modification_allowed: false
- language: zh-CN
- dependencies:
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_google_serp_capture_contact_form_required_2026-06-19.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_keyword_cluster_contact_form_2026-06-19.md`
  - `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_serp_contact_form_builder_top10_review_2026-06-19.md`
- observation_pages:
  - `https://www.google.com/search?q=contact+form+builder&num=10&hl=en&gl=us&pws=0`

## 目标

采集 Contact Form 关键词簇的 Google SERP 样本，并判断 Google 对这些关键词的搜索意图、竞品集合和页面类型理解。

本任务的核心是补齐 Google 样本，不允许用 Brave、Bing、DuckDuckGo、第三方榜单或主观推断替代 Google 结论。

## 背景

Codex 曾尝试自动抓取 Google SERP，但 Google 返回 CAPTCHA / unusual traffic 页面，无法获得可信 Google Top 10。

由于 GenForms 当前主要做 Google SEO，最终页面优化必须以 Google SERP 为准。此前保存的 Brave Search 样本只能作为临时市场参考，不能作为最终优化依据。

Gemini 本次任务是尝试通过自身可用方式获取 Google SERP 样本。如果 Gemini 也无法获取，必须如实报告失败原因，不得用其他搜索引擎结果代替。

## 需要读取的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_google_serp_capture_contact_form_required_2026-06-19.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_keyword_cluster_contact_form_2026-06-19.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_serp_contact_form_builder_top10_review_2026-06-19.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_brief_contact_form_builder_for_websites.md`

## 允许修改的文件

- `/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-037-google-serp-contact-form-capture.md`

## 禁止触碰的文件和动作

- 不修改 `Code/**`
- 不修改生产页面
- 不修改 SEO Brief
- 不部署
- 不提交 Git
- 不访问或输出 secrets、cookies、API keys
- 不使用 Brave/Bing/DuckDuckGo/第三方榜单作为最终 Google 结论
- 不把付费 SEO 工具或估算搜索量当作 Google SERP Top 10
- 不根据个人判断直接建议页面实现

## 需要采集的关键词

P0 必须采集：

1. `contact form builder`
2. `contact form generator`
3. `website contact form`

P1 尽量采集：

4. `free contact form builder`
5. `contact us form template`
6. `business inquiry form`
7. `contact form builder with webhook`

如果时间或访问限制只允许采集部分关键词，必须优先完成 P0。

## 每个关键词必须记录的字段

查询信息：

- 查询关键词
- 查询日期和时间
- 地区/语言设置
- 是否登录 Google
- 是否无痕/干净浏览器
- 是否出现广告
- 是否出现 AI Overview
- 是否出现 Featured Snippet
- 是否出现 People Also Ask

Top 10 自然结果：

| Rank | Title | URL | Domain | Snippet | Page type | First-screen promise | CTA type | Notes |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- |

页面类型建议枚举：

- tool/product landing page
- template category page
- single template page
- how-to guide
- marketplace/app listing
- plugin/docs/integration page
- comparison/listicle
- forum/community discussion
- official Google/Docs/Form page

## 分析要求

每个关键词完成 Top 10 后，需要给出：

1. Google 对该关键词的主搜索意图。
2. Google 对该关键词的次级搜索意图。
3. 前 10 名中最常见页面类型。
4. 最值得 GenForms 借鉴的 3 个页面。
5. 不适合 GenForms 借鉴的页面及原因。
6. 该关键词应由哪个 GenForms 页面承接：
   - `/use-cases/contact-form-builder-for-websites`
   - `/templates/contact-us`
   - `/solutions/website-contact-form-template`
   - `/use-cases/webhook-form-builder-retry-logs`
   - 暂不承接
7. Google 样本与 Brave 样本是否一致。
8. 如果不一致，以 Google 为准，并说明 Brave 样本偏差在哪里。

## 输出报告结构

报告必须使用中文，建议结构如下：

1. 执行摘要
2. 采集方法和限制
3. P0 关键词 Google SERP Top 10
4. P1 关键词 Google SERP Top 10
5. Google 搜索意图总结
6. Google 竞品集合总结
7. 与 Brave 样本对比
8. GenForms 页面承接建议
9. 是否允许 Contact Form Brief 进入实现
10. 风险与后续动作

## 验证要求

- 如果成功获取 Google SERP，请在报告中说明每个关键词的采集时间和环境。
- 如果 Google 结果页出现 CAPTCHA、登录要求、地区异常或结果不完整，请如实记录。
- 如果无法获取 Google SERP，不要编造 Top 10，不要改用其他搜索引擎替代。
- 报告不得包含 cookies、登录态、账号信息或任何敏感数据。

## 报告路径

请将执行报告写入：

`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-037-google-serp-contact-form-capture.md`

## 验收标准

- P0 三个关键词至少有 Google Top 10 或明确失败原因。
- 每个成功采集的关键词包含 URL、title、snippet、页面类型和承接建议。
- 明确指出 Brave 样本是否可参考、不可参考或只能部分参考。
- 明确给出是否允许 `/use-cases/contact-form-builder-for-websites` 进入实现。
- 结论必须基于 Google SERP，不基于 Brave/Bing/DDG 替代样本。
