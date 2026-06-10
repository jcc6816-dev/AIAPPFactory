# GenForms.ai Codex SEO 运营检查清单

> 版本：2026-06-04
> 用途：记录 Codex 后续需要主动检查、判断和推进的 SEO 增长事项。区别于 `user_action_tracker.md`，本文件只放 Codex 负责的检查和执行任务。

## 使用规则

- 用户说“你自己记住后面要做什么”时，优先读取本文件。
- 用户反馈 GSC、GA4 或后台截图后，Codex 应同步更新相关任务状态。
- 本文件只记录 Codex 自己负责的巡检、判断、内容质量把控和后续优化，不混入需要 Mike 手动完成的事项。

## 当前 Codex 负责事项

| 编号 | 状态 | 优先级 | 事项 | 检查方式 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| C-001 | 进行中 | P0 | 跟踪 testimonial 支撑文章收录 | URL: `https://genforms.ai/posts/customer-testimonial-form-guide`；观察 GSC URL Inspection、GSC 效果报告、sitemap 是否包含。 | 24-72 小时内看是否“已收录”；7 天看展示/查询词。 |
| C-002 | 进行中 | P0 | 跟踪 testimonial Solution 页收录 | URL: `https://genforms.ai/solutions/customer-testimonial-collection-form`；该页此前状态为“已发现 - 尚未编入索引”。 | 若 2026-06-07 仍未收录，加强内链并评估是否继续补内容。 |
| C-003 | 进行中 | P0 | 每次新增/发布文章后做英文质量把控 | 检查标题、description、H1、正文长度、AI 腔、内链、CTA、发布日期、canonical、BlogPosting。 | 英文正文由 Codex 负责修改；Mike 只需确认业务口径。 |
| C-004 | 已完成 | P0 | 复查生产 sitemap 公开可访问性 | 服务器本机 sitemap 已包含新文章；从服务器访问公网 `https://genforms.ai/sitemap.xml` 返回 62,710 字节；本地 Codex 环境公网 curl 曾出现 0 字节，判断为当前本地网络/沙箱抓取异常。 | 后续以服务器公网视角和 GSC 反馈为准；若 GSC sitemap 报错再重新排查 Cloudflare / Next sitemap 响应。 |
| C-005 | 观察中 | P1 | 根据 GSC 效果报告优化页面标题和描述 | 2026-06-05 用户反馈：过去 24 小时总曝光 14、点击 0、平均排名 29；已完成首轮小幅优化。 | 进入 3-7 天观察期，不再反复修改同一批已索引/已优化页面；D7 后再按展示、点击、排名和查询词决定是否调整 title、description、FAQ 或内链。 |
| C-006 | 进行中 | P1 | 准备下一批高意图内容与外部发现入口 | 两篇高意图文章已发布并进入 sitemap；目录提交包已刷新为具体可执行队列。 | 不再批量上线文章；下一步优先做低风险目录提交、观察 GSC/GA4，再按查询词准备后续草稿。 |
| C-007 | 进行中 | P1 | GA4 增长事件复核 | 检查 CTA、模板使用、生成提交、注册、发布表单事件及 `page_location`、`cta_text`、`template_id` 参数。 | 已补首页 `landing_viewed`、首页 prompt 生成提交、`page_leave` GA4 上报；后续等 Mike 在 GA4 反馈是否出现 `landing_view`、`ai_generate_submit`、`template_use_click`、`publish_form` 等事件。 |
| C-008 | 进行中 | P1 | Clarity 移动端交互巡检与性能监控 | 检查 Clarity 录屏，评估移动端双 Tab 切换及全屏预览的使用体验，并监控后台工作区加载性能表现。 | 收集至少 10 条手机端录屏样本，分析是否有死点击或切屏困惑。 |

## 2026-06-04 即时检查记录

```yaml
date: 2026-06-04
checks:
  - production_seo_gate: passed
  - new_testimonial_post_status: online
  - new_testimonial_post_http_status: 200
  - new_testimonial_post_seo_gate: Ready to publish
  - server_local_sitemap_contains_customer_testimonial_post: true
  - server_local_sitemap_contains_customer_testimonial_solution: true
  - public_sitemap_header_status: 200
  - public_sitemap_body_check_from_server: 62710_bytes
  - local_codex_public_sitemap_body_check: empty_body_seen_from_local_curl
interpretation:
  - 新文章页面和结构化数据本身正常。
  - 应用服务器本机 sitemap 已包含新文章和对应 Solution 页。
  - 从服务器访问公网 sitemap 正常；本地 Codex 环境公网 body 为空应视为本地网络/沙箱抓取异常，不作为生产故障。
next_actions:
  - 24-72 小时后确认新文章 URL Inspection 是否进入索引。
  - 2026-06-07 复查 testimonial Solution 页是否仍未索引。
```

## 2026-06-05 GSC 效果反馈记录

```yaml
date: 2026-06-05
source: Mike feedback from Google Search Console
period: last_24_hours
impressions: 14
clicks: 0
average_position: 29
queries_seen:
  - genforms: 1 impression
  - generation form: 1 impression
  - lead form ai download: 1 impression
  - job application maker: 1 impression
  - generate form: 1 impression
  - nps survey maker: 1 impression
  - typeform free alternative: 1 impression
  - alternative to typeform: 1 impression
pages_seen:
  - https://genforms.ai/en/posts/feishu-dingtalk-webhook-notification: 3 impressions
  - https://genforms.ai/: 3 impressions
  - https://genforms.ai/zh/: 2 impressions
  - https://genforms.ai/posts/typeform-alternatives: 2 impressions
  - https://genforms.ai/posts/feishu-dingtalk-webhook-notification: 1 impression
  - https://genforms.ai/solutions/lead-magnet-download-form: 1 impression
  - https://genforms.ai/templates/job-application: 1 impression
  - https://genforms.ai/templates/nps-survey: 1 impression
technical_follow_up:
  - /en/posts/feishu-dingtalk-webhook-notification returns 301 to /posts/feishu-dingtalk-webhook-notification, so this is likely legacy URL reporting rather than a current duplicate-indexing configuration issue.
interpretation:
  - 这是冷启动期的正向信号，说明 Google 已经开始给 GenForms.ai 页面分配搜索展示。
  - 0 点击暂时不异常，因为平均排名 29 通常在第 3 页附近，真实点击机会很少。
  - 查询词已经覆盖品牌词、生成表单泛词、Lead Magnet、Job Application、NPS 和 Typeform 替代品，说明前期页面方向是对的。
  - 当前不应该因为 0 点击而大规模改页面；更高价值的下一步是围绕已经有曝光的页面做小幅标题/描述/内链优化。
next_actions:
  - 优先优化 /posts/typeform-alternatives 的 title 和 description，使其覆盖 typeform free alternative 与 alternative to typeform。
  - 检查 /templates/job-application 与 /templates/nps-survey 是否有足够的首屏解释和指向相关 Solution/Use Case 的内链。
  - 检查 /solutions/lead-magnet-download-form 是否对 lead form ai download 查询词有更明确的标题、FAQ 和 CTA。
  - 继续观察 /en/posts/feishu-dingtalk-webhook-notification 是否在后续被 canonical 路径替代；当前不需要紧急修复。
```

## 2026-06-05 首批查询词命中优化记录

```yaml
date: 2026-06-05
trigger: GSC query/page report showed 14 impressions, 0 clicks, average position 29
actions:
  - page: https://genforms.ai/posts/typeform-alternatives
    change: Updated title, description, and H1 in production DB.
    new_title: 9 Best Typeform Free Alternatives in 2026 (Free and Paid)
    target_queries:
      - typeform free alternative
      - alternative to typeform
  - page: https://genforms.ai/templates/job-application
    change: Added English SEO metadata override in code and deployed.
    new_title: Job Application Maker - Free AI Form Template
    target_query: job application maker
  - page: https://genforms.ai/templates/nps-survey
    change: Added English SEO metadata override in code and deployed.
    new_title: NPS Survey Maker - Free AI Form Template
    target_query: nps survey maker
  - page: https://genforms.ai/solutions/lead-magnet-download-form
    change: Updated title, description, search intent, FAQ, and keywords in code and deployed.
    new_title: AI Lead Magnet Download Form Builder
    target_query: lead form ai download
validation:
  - npm_run_build: passed
  - production_deploy: completed
  - production_metadata_check: passed
  - production_seo_gate: passed
next_actions:
  - Wait 3-7 days before judging impact.
  - In GSC, compare impressions, average position, and query mix for the four optimized pages.
  - Do not keep editing the same pages daily unless a technical issue appears.
indexing_request_status:
  - https://genforms.ai/posts/typeform-alternatives: submitted_successfully_on_2026_06_05
  - https://genforms.ai/solutions/lead-magnet-download-form: pending_due_to_daily_quota
  - https://genforms.ai/templates/job-application: pending_due_to_daily_quota
  - https://genforms.ai/templates/nps-survey: pending_due_to_daily_quota
```

## 2026-06-06 近第一页页面轻量增强记录

```yaml
date: 2026-06-06
trigger: GSC export showed lead-form/download intent near page-one opportunity
principle:
  - 接近第一页的页面可以优化，但只做小幅、可归因、面向搜索意图的增强。
  - 不改 slug/canonical，不伪造更新日期，不整页重写，不堆关键词。
  - 每轮只改少数页面，之后观察 3-7 天。
actions:
  - page: https://genforms.ai/templates/content-download
    change:
      - Added specific English SEO metadata override.
      - Updated template English name, scenario, and description to emphasize AI lead magnet download forms.
    target_queries:
      - lead form ai download
      - AI lead magnet download form
      - content download form template
  - page: https://genforms.ai/solutions/lead-magnet-download-form
    change:
      - Refined H1/title and description around PDFs, whitepapers, gated resources, and qualified leads.
      - Tightened search intent and workflow copy.
      - Added FAQ about what happens after a download request.
      - Updated CTA and prompt to emphasize AI download form creation.
validation:
  - npm_run_targeted_tests: passed
  - tests:
      - services/solution-landing-pages.test.ts
      - services/form-templates.test.ts
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: passed_200
  - production_metadata_check:
      - https://genforms.ai/templates/content-download: updated_title_description_canonical_hreflang_confirmed
      - https://genforms.ai/solutions/lead-magnet-download-form: updated_title_description_canonical_hreflang_confirmed
  - production_seo_gate: passed
next_actions:
  - Observe GSC for 3-7 days before making another edit to these same two pages.
```

## 2026-06-05 模板页到 Solution 页内链优化记录

```yaml
date: 2026-06-05
trigger: User asked to continue optimization after first GSC query/page report
reason:
  - GSC 已显示模板页开始获得曝光，例如 job application 和 nps survey。
  - 模板页需要更清晰地链接到完整 Solution 页面，帮助 Google 理解内容簇，也帮助访客从模板进入更完整的使用场景。
actions:
  - Added automatic Related solution guides block on template detail pages when a Solution page shares the same templateId.
  - /templates/job-application now links to /solutions/job-application-form-builder.
  - /templates/nps-survey now links to /solutions/saas-nps-survey-form-template.
  - /templates/content-download now links to /solutions/lead-magnet-download-form.
validation:
  - npm_run_build: passed
  - production_deploy: completed
  - production_internal_link_check: passed
  - production_seo_gate: passed
next_actions:
  - Observe whether related Solution pages gain more impressions over the next 3-7 days.
  - Avoid further daily edits to these same pages unless GSC shows a clear query mismatch.
```

## 2026-06-05 Solution 页到 Use Case / Solution 页横向内链优化记录

```yaml
date: 2026-06-05
trigger: Continue SEO growth plan after GSC showed first impressions on solution/template/post pages
reason:
  - Solution 页面已有模板链接和 FAQ，但同类用例与相邻 Solution 的横向探索路径还不够明显。
  - 对冷启动 SEO 来说，清晰内容簇比单页孤立优化更重要，可以帮助 Google 理解模板、用例、方案之间的主题关系。
  - 对访客来说，相关入口能把“看到一个方案”延伸到“比较几个可落地工作流”，更接近注册和创建动作。
actions:
  - Added Related paths block to every solution detail page.
  - The block links to up to 3 use-case pages sharing the same templateId.
  - The block links to up to 3 sibling solution pages sharing the same templateId.
  - If no same-template related pages exist, the block falls back to high-intent core workflows such as Typeform alternative, AI lead capture, and webhook form builder.
  - Both English and Chinese copy are rendered from the existing page locale.
validation:
  - npm_run_build: passed
  - fallback_logic_build_check: passed
  - production_deploy: completed
  - production_seo_gate: passed
  - production_origin_check: passed_via_127_0_0_1_for_target_solution_pages
  - public_head_check: passed_200_dynamic_cloudflare
  - local_public_body_check: inconclusive_due_to_zero_byte_body_in_codex_environment
next_actions:
  - Re-check GSC after 3-7 days for solution/use-case discovery growth.
  - Do not use this as a reason to mass-produce thin pages; keep following google_seo_quality_rules.md.
```

## 2026-06-05 高意图英文博客草稿创建记录

```yaml
date: 2026-06-05
trigger: User asked Codex to execute today's traffic growth work without stopping for piecemeal confirmation
reason:
  - GSC 已出现 Typeform alternative、NPS survey maker、Webhook/Feishu 相关页面曝光信号。
  - 文章适合承接搜索词，Solution/Template 负责承接转化，因此今天优先补两篇高意图英文草稿。
  - 遵循 google_seo_quality_rules.md，不做大批量低质量内容。
drafts_created:
  - title: Typeform Alternative with Webhooks: A Practical Guide for 2026
    slug: typeform-alternative-with-webhooks
    uuid: 92494ea5-4e7a-4e34-9041-4843246fcc88
    status: created
    word_count: 996
    internal_links: 7
    gate: Ready to publish
    target_entry:
      - /use-cases/typeform-alternative-webhooks
      - /use-cases/webhook-form-builder-retry-logs
      - /templates/lead-capture
  - title: NPS Survey Form Template Guide for SaaS Teams
    slug: nps-survey-form-template-guide
    uuid: ceabf95a-ff76-4992-a1d2-1fb7800ed0b3
    status: created
    word_count: 942
    internal_links: 6
    gate: Ready to publish
    target_entry:
      - /solutions/saas-nps-survey-form-template
      - /templates/nps-survey
validation:
  - dry_run_seo_gate: passed
  - production_create_drafts: completed
  - production_post_audit: passed
notes:
  - Blog Automation API intentionally creates drafts only; it cannot publish online posts.
  - Human/admin publish remains a product safety gate, even when Codex writes the English content.
next_actions:
  - Mike reviews and publishes the two drafts from /admin/posts.
  - After publish, request indexing for the two new URLs in GSC.
  - Observe impressions/clicks after 3-7 days, especially Typeform webhook and NPS query groups.
```

## 2026-06-05 已曝光 Feishu/DingTalk 文章优化记录

```yaml
date: 2026-06-05
trigger: GSC page report showed /posts/feishu-dingtalk-webhook-notification and legacy /en URL already receiving impressions
reason:
  - 该文章已经有展示信号，优先做小幅搜索信号优化，而不是重写或另起相似页面。
  - 原标题较长，搜索意图聚焦度略分散；开头缺少直接回答和产品内链。
  - Feishu/DingTalk 通知属于 GenForms Webhook 自动化内容簇的核心入口之一。
actions:
  - Updated online post title and H1 to: Feishu and DingTalk Form Notifications via Webhook.
  - Updated meta description to focus on Feishu/Lark/DingTalk webhook notification workflow, payload checks, and retry visibility.
  - Added Quick Answer section near the top.
  - Added stronger internal links to:
      - /use-cases/feishu-dingtalk-form-notifications
      - /use-cases/webhook-form-builder-retry-logs
  - Updated article modified time to reflect the real content update.
validation:
  - production_post_audit: passed
  - production_page_metadata_check: passed
  - production_seo_gate: passed
result:
  - slug: feishu-dingtalk-webhook-notification
  - status: online
  - word_count_after_update: 1344
  - internal_links_after_update: 6
  - gate: Ready to publish
next_actions:
  - Request re-crawl in GSC when quota allows.
  - Watch Feishu/DingTalk/Webhook query impressions over the next 3-7 days.
```

## 2026-06-05 已优化页面观察期规则

```yaml
date: 2026-06-05
trigger: Mike questioned whether repeatedly editing already indexed articles is necessary
decision:
  - 结论：不应该在同一个观察窗口内反复修改已索引或刚优化过的页面正文。
  - 允许：发现技术错误、标题明显错配、canonical/结构化数据异常、页面不可访问时立即修复。
  - 不允许：因为 24-72 小时内曝光少或 0 点击，就连续重写同一篇文章或同一批页面。
  - 节奏：D0 发布/修复并请求索引；D1-D3 只做相关页面内链和记录；D3-D7 观察；D7 后基于 GSC 数据决定是否调整。
frozen_observation_pages:
  - https://genforms.ai/posts/typeform-alternatives
  - https://genforms.ai/posts/feishu-dingtalk-webhook-notification
  - https://genforms.ai/solutions/lead-magnet-download-form
  - https://genforms.ai/templates/job-application
  - https://genforms.ai/templates/nps-survey
next_focus_without_reediting:
  - 发布并索引已经准备好的两篇新草稿。
  - 复核 GA4/Growth 事件，确保流量能被归因到创建、注册和发布动作。
  - 低风险目录提交，先拿外部发现信号，不做高曝光推广。
  - 准备新内容只进入草稿和质量审核，不批量上线。
```

## 2026-06-05 GA4 / Growth 归因修复记录

```yaml
date: 2026-06-05
trigger: Continue traffic growth plan without repeatedly editing indexed content
reason:
  - 当前 GSC 已有少量曝光，但需要确认 SEO 流量进入网站后是否触发创建、注册、发布等关键动作。
  - 用户已指出不应频繁修改已索引文章，因此本轮转向测量基础，而不是继续改文章正文。
actions:
  - Added homepage landing_viewed tracking with landing_slug homepage/homepage-zh and entry_point homepage.
  - Added ai_generate_submitted tracking before homepage hero prompt redirects to /forms/new.
  - Added GA4 mapping for page_leave so duration metadata can be observed as a custom event.
validation:
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: 200
  - production_seo_gate: passed
next_actions:
  - After deployment, Mike can click homepage prompt, template use, form generate, publish, and then check GA4 events after the normal delay.
  - Keep the frozen observation pages unchanged until the 3-7 day data window produces a clearer signal.
```

## 2026-06-05 新文章发布与外部发现准备记录

```yaml
date: 2026-06-05
trigger: Mike confirmed the two drafted SEO posts are published and clarified that traffic growth now matters more than GA4 without clicks
published_posts_confirmed:
  - https://genforms.ai/posts/typeform-alternative-with-webhooks
  - https://genforms.ai/posts/nps-survey-form-template-guide
validation:
  - both_posts_online: true
  - both_posts_have_title_description_canonical: true
  - both_posts_have_blogposting_jsonld: true
  - both_posts_have_visible_published_dates: true
  - both_posts_are_in_sitemap: true
indexing:
  - Mike will batch-submit indexing requests later.
  - No immediate manual URL Inspection action required from Codex.
traffic_growth_action:
  - Refreshed directory_submission_pack.md with a concrete first-round queue:
      - ListAi.cc
      - AI Workbench
      - Fushion NoCode Directory
      - NavTools AI
      - Future-pedia.com
  - Added UTM links, category suggestions, short descriptions, logo/OG image URLs, and execution notes.
next_actions:
  - First external traffic push should be low-risk directory submissions, not Product Hunt or Reddit main posts.
  - Track referral and UTM sources in GA4 after submission.
  - Keep recently optimized/indexed content unchanged during the observation window.
```

## 2026-06-05 资源中心 Hub SEO 优化记录

```yaml
date: 2026-06-05
trigger: User clarified that GA4 has no clicks yet and traffic growth is the priority
reason:
  - /posts was functioning, but the title "Resources" was too generic for search discovery.
  - The resources page is now the central hub for blog articles and should clearly signal AI form builder topics.
actions:
  - Updated English blog hub title to "AI Form Builder Resources".
  - Updated English description to cover AI form generation, Typeform alternatives, webhooks, templates, NPS, and publishable data collection.
  - Updated Chinese title/description accordingly.
  - Added CollectionPage JSON-LD with ItemList entries for visible blog posts.
validation:
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: 200
  - production_seo_gate: passed
  - production_posts_hub_check: title_description_collectionpage_present
next_actions:
  - Treat /posts as the content hub for directory submissions and internal linking.
  - Watch whether GSC begins showing /posts impressions for AI form builder resources or related queries.
```

## 2026-06-05 核心 Hub 页结构化数据补强记录

```yaml
date: 2026-06-05
trigger: Continue traffic growth plan without taking over Mike's directory submission work
reason:
  - /use-cases, /solutions, and /templates are important search discovery hubs.
  - These pages already list useful pages, but needed clearer CollectionPage/ItemList signals for Google to understand the content clusters.
  - This improves existing hub pages without creating new thin pages or repeatedly editing observed articles.
actions:
  - /use-cases:
      - Updated English title to "AI Form Builder Use Cases and Workflows".
      - Added CollectionPage JSON-LD with ItemList entries for use-case pages.
  - /solutions:
      - Added CollectionPage JSON-LD with ItemList entries for solution pages.
  - /templates:
      - Added x-default hreflang on the template gallery.
      - Added CollectionPage JSON-LD with ItemList entries for template detail pages.
      - Normalized template links through localizePath to avoid unnecessary /en public links.
validation:
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: 200
  - production_seo_gate: passed
  - production_hub_check:
      - /use-cases has CollectionPage, ItemList, x-default
      - /solutions has CollectionPage, ItemList, x-default
      - /templates has CollectionPage, ItemList, x-default
next_actions:
  - Watch GSC for hub-page impressions, especially /templates, /use-cases, /solutions, and /posts.
  - Continue avoiding mass page generation; next content work should be one focused draft or one existing hub/template improvement based on GSC signals.
```

## 2026-06-05 生产 SEO Gate 覆盖 Hub 页记录

```yaml
date: 2026-06-05
trigger: Hub pages were strengthened and should not rely on manual memory for future verification
reason:
  - /posts, /use-cases, /solutions, and /templates are now traffic-growth entry hubs.
  - Their CollectionPage/ItemList JSON-LD, canonical URLs, and hreflang tags are growth-critical.
  - Adding these checks to the SEO Gate reduces the risk of future deploys silently breaking search signals.
actions:
  - Updated Code/scripts/verify-production-seo.sh.
  - Added CollectionPage and ItemList checks for:
      - /posts
      - /use-cases
      - /solutions
      - /templates
  - Added canonical/hreflang/x-default checks for the same hub pages.
validation:
  - command: ./Code/scripts/verify-production-seo.sh https://genforms.ai
  - result: passed
notes:
  - This does not create new pages or alter recently indexed article content.
  - It strengthens the quality gate for future traffic-growth releases.
```

## 2026-06-05 下一篇 P0 SEO 草稿储备记录

```yaml
date: 2026-06-05
trigger: Continue traffic growth plan while avoiding repeated edits to indexed or newly published articles
topic:
  title: "Google Forms vs Typeform vs GenForms: Which Form Builder Fits Your Workflow?"
  slug: google-forms-vs-typeform-vs-genforms-workflow
  priority: P0
  target_keyword: Google Forms vs Typeform
  target_use_case: /use-cases/google-forms-alternative-ai
file:
  path: ProjectDocs/Operations/blog_drafts/google-forms-vs-typeform-vs-genforms-workflow.md
status: draft_only_not_published
quality_notes:
  - 1934 words.
  - Focuses on choosing by workflow after submission, not generic tool ranking.
  - Links to existing GenForms product routes:
      - /use-cases/google-forms-alternative-ai
      - /use-cases/typeform-alternative-webhooks
      - /templates
      - /forms/new
      - /posts/form-builder-with-webhook
  - Avoids invented pricing, market-share claims, and unsupported enterprise claims.
next_actions:
  - Do not publish immediately unless Mike wants the next content push.
  - Before publishing, run the normal admin draft review and verify title/description/canonical/BlogPosting/date after it goes live.
```

## 2026-06-05 Website Contact Form Solution 页上线记录

```yaml
date: 2026-06-05
trigger: User confirmed that strong internal quality should be expanded into Solution, Template, and landing-page assets
strategy_fit:
  - Adds one focused long-tail Solution page instead of bulk-generating pages.
  - Targets website contact form template, business inquiry form, professional contact form, and contact form with webhook.
  - Binds to the existing contact-us template and current MVP workflow.
url:
  canonical: https://genforms.ai/solutions/website-contact-form-template
  zh: https://genforms.ai/zh/solutions/website-contact-form-template
actions:
  - Added website-contact-form-template to solutionLandingPages.
  - Added bilingual title, description, search intent, audience, recommended fields, workflow, FAQ, CTA, prompt, and keywords.
  - Updated growth content cluster slugs to use google-forms-vs-typeform-vs-genforms-workflow.
  - Added the new Solution URL to production SEO Gate checks.
  - Added U-014 to user_action_tracker.md for future GSC URL Inspection submission.
validation:
  - targeted_tests: npm run test -- services/solution-landing-pages.test.ts services/growth-content-clusters.test.ts
  - targeted_tests_result: passed
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: 200
  - production_seo_gate: passed
quality_notes:
  - The page has a concrete product-backed use case and is not a thin keyword swap page.
  - It links naturally into the contact-us template family and Google Forms alternative workflow.
  - It avoids unsupported claims and stays within the current AI form generation MVP.
next_actions:
  - Mike can submit the URL in GSC when quota is available.
  - Watch impressions for website contact form template, business inquiry form, contact form builder, and Google Forms alternative variants.
```

## 2026-06-05 模板详情页内链与 x-default 补强记录

```yaml
date: 2026-06-05
trigger: Continue growth plan by improving internal quality before adding more pages
strategy_fit:
  - Improves existing Template pages instead of creating thin pages.
  - Connects Template detail pages to related Use Case workflows.
  - Strengthens multilingual SEO signals on Template detail pages.
actions:
  - Added x-default hreflang to template detail metadata.
  - Added related Use Case workflow cards to template detail pages, limited to 3 matching template-backed workflows.
  - Added /templates/lead-capture canonical/hreflang and legacy /en checks to production SEO Gate.
validation:
  - targeted_tests: npm run test -- services/solution-landing-pages.test.ts services/growth-content-clusters.test.ts services/use-case-landing-pages.test.ts services/form-templates.test.ts
  - targeted_tests_result: passed
  - npm_run_build: passed
  - production_deploy: completed
  - production_auth_session_check: 200
  - production_seo_gate: passed
quality_notes:
  - No new indexed pages were added in this step.
  - This supports the Template -> Use Case -> Solution -> Create Form funnel.
  - The change follows the Google SEO rule of improving useful internal navigation and avoiding doorway-like page expansion.
next_actions:
  - Continue observing GSC signals before adding more pages.
  - If template pages begin getting impressions with low CTR, prioritize title/description refinement and stronger above-the-fold CTA.
```

## 2026-06-09 P0 两篇中英文文章正式发布记录

```yaml
date: 2026-06-09
trigger: User manually published the two prepared P0 blog drafts from admin console.
published_posts:
  - title: "Google Forms vs Typeform vs GenForms: Which Form Builder Fits Your Workflow?"
    slug: google-forms-vs-typeform-vs-genforms-workflow
    locale: en
    url: https://genforms.ai/posts/google-forms-vs-typeform-vs-genforms-workflow
    status: online
    gate: Ready to publish
  - title: "带 Webhook 的 Typeform 替代方案怎么选"
    slug: typeform-alternative-webhook-zh
    locale: zh
    url: https://genforms.ai/zh/posts/typeform-alternative-webhook-zh
    status: online
    gate: Ready to publish
validation:
  - production_post_audit: passed
  - public_sitemap_check: pending_gsc_indexing
next_actions:
  - Submit the two newly online URLs for indexation in GSC when daily quota allows.
  - Keep recently published posts untouched during the D1-D7 observation window.
  - Watch for impressions on "Google Forms vs Typeform" and "Typeform 替代 Webhook" query clusters.

## 2026-06-10 移动端预览、AI日志国际化及首屏性能优化记录

```yaml
date: 2026-06-10
trigger: Microsoft Clarity RUM check & user feedback (mobile layout cutting off preview, AI logs returning Chinese, and slow load times)
actions:
  - mobile_layout:
      - Changed split screen layout on screens < lg to dual-tab switcher (AI Assistant vs Preview).
      - Added auto-switching to Preview tab when AI schema is updated or template is applied.
      - Removed bezel, notch, background, and width bounds on mobile viewports for phone mockups in form-generator and interactive-detail-preview.
  - ai_feedback_logs_localization:
      - Refactored summarizeFormSchemaChanges, validateFormSchemaForAgent, buildFormAgentProgressMessage, buildFormAgentSummaryMessage, and buildFormAgentDoneMessage in services/form-agent-tools.ts to accept and respect optional locale parameter.
      - Modified app/api/forms/agent/route.ts to parse locale from request and generate localized progress/error logs in English/Chinese dynamically.
  - css_performance_refine:
      - Split typeform-home.css (71KB) from globals.css into landing.css.
      - Imported landing.css only in default layout ([locale]/(default)/layout.tsx) to decrease console/workspace `/forms/*` CSS size by 71KB.
validation:
  - tsc_type_check: passed
  - npm_run_build: passed
  - production_deploy: completed (PM2 running online)
next_actions:
  - Observe user session recordings in Microsoft Clarity to check for layout issues or frustration signals on mobile viewports.
  - Monitor core workspace page speed metrics to confirm the 71KB reduction improves LCP.
```
```
