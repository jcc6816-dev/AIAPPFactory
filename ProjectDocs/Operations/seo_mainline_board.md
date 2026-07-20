# GenForms.ai SEO 主线作战板

> 2026-07-03：本看板继续作为主题/资产全局视图；Research、Brief、Build、Observe、Scale 的容量和调度以 `seo_growth_production_loop.md` 与 `seo_growth_production_loop_state.md` 为准。首个 Production Research Batch `2026-07-03-R01` 已编排、等待 Gemini 执行，月度动作见 `seo_growth_production_backlog_2026-07.md`。

> 创建日期：2026-06-21  
> 用途：把关键词研究、SERP 调研、Brief、页面/Post 改造、上线提交、冻结观察和数据反馈统一到一张主线看板里。  
> 原则：所有 SEO 工作必须回到同一条链路，不再拆成互相孤立的“关键词研究”“写 Post”“改老页面”。
> 执行口径：先按 `seo_growth_sop_v2.md` 判断所属增长策略和页面分区，再决定 Topic Cluster、Alternatives、pSEO、Backlinks 或 GSC 微调动作。
> 当前 Topic Loop 游标：`seo_topic_loop_cursor_2026-06-30.md`。

## 1. 主线流程

GenForms.ai SEO 后续只按这条主线推进：

```text
关键词研究 / SERP 调研
  -> Search Intent 结论
  -> Brief
  -> 页面或 Post 改造
  -> 构建 / 部署 / URL Inspection
  -> 冻结观察
  -> GSC / GA4 / Bing 数据反馈
  -> 下一轮决策
```

这意味着：

- 关键词研究不是为了“攒关键词”，而是为了决定页面/文章是否值得做。
- 老 Post 改造不是随机翻新，而是修复已经被 Google 测试过、但点击或转化不好的资产。
- 新页面上线后必须冻结观察，不能连续改到无法归因。
- 每一次动作都要能回答：它服务哪个搜索意图？它承接到哪个产品路径？它的成败看什么数据？
- 任何观察期后的二次优化，必须先按 SOP V2 的页面分区决定动作类型，不能只因为“没点击”就改正文。
- 后续新增或修改页面时，必须先判断它属于哪个 Topic Cluster、是否服务 Alternatives 商业意图、是否属于 pSEO 试点、是否需要外链提权。

## 2. 队列定义

| 队列 | 含义 | 进入条件 | 退出条件 |
|---|---|---|---|
| Research | 关键词和 Google SERP 调研 | 有潜在搜索意图，但还没有足够证据判断是否值得做 | 形成 Search Intent 结论和页面类型建议 |
| Brief | 已有研究结论，准备转为执行方案 | SERP/竞品/产品边界已明确 | Brief 通过评审，进入实现或写作 |
| Implement / Published | 页面或 Post 已完成实现、发布或部署 | Brief 已通过，内容或代码已上线 | 已提交 Google/Bing，进入观察 |
| Observe | 冻结观察和数据反馈 | 页面刚上线、刚修改、或样本不足 | 观察期结束，按 GSC/GA4 决定继续观察、二次优化或转入沉淀 |
| Backlog | 暂不做，但保留机会 | 有价值但证据不足、资源不足或优先级低 | 新数据或新战略触发后重新评估 |

## 2.1 Topic Operating Loop 队列

从 2026-06-26 起，Topic 不再按单点页面推进，而按工程 Loop 管理：

```text
Discover -> Validate -> Architect -> Build -> Ship -> Observe -> Decide -> Expand
```

每个 Topic 都必须能回答：

- 这个主题来自哪里：竞品、GSC、Clarity、GA4、模板库，还是产品战略。
- Google SERP 是否证明它是真搜索意图。
- GenForms 当前能不能真实承接用户主任务。
- 它的资产包是什么：Pillar、Template、Post、Use Case、Integration、Alternative、内链、CTA、Schema。
- 当前处于 Loop 哪个阶段，下一步动作是谁负责。

### 当前 Topic Loop 状态

| Topic | Loop 阶段 | 当前资产包 | 下一步 | 负责人 |
|---|---|---|---|---|
| Contact Form | Observe / Decide | Builder Pillar：`/use-cases/contact-form-builder-for-websites`；Enquiry/Template owner：`/solutions/website-contact-form-template`；Starter：`/templates/contact-us`；Webhook 分流页 | GSC query×page 已确认 enquiry/inquiry Template 意图由现有 Solution 承接；冻结观察，不新建同义页面。如持续有展示无点击，冻结后再评估小幅 copy/FAQ 调整 | Codex |
| Webhook Form | Observe / Expand | Pillar：`/use-cases/webhook-form-builder-retry-logs`；Posts：`send-form-submissions-to-webhook`、`form-builder-with-webhook`、Feishu/DingTalk | 先看 Google 来源和 webhook intent 创建事件；如果有效，扩展 payload / retry / delivery logs 周边 Post | Codex + Gemini |
| Typeform Alternative | Authority / Observe | Hub：`/posts/typeform-alternatives`；Product：`/use-cases/typeform-alternative-webhooks`；Cheaper Post | JUL-R03 完成：Authority / Medium-High；Plan Ready，不扩页、不重写，外部执行需单独授权 | Codex；Mike 外部授权 |
| QR Code Form | Brief Ready / Observe | Pillar：`/use-cases/qr-code-form-builder`；Event Pillar 与 Template 已存在 | JUL-R01 完成：Existing Tune / Medium；Visual Proof Brief Ready，07-05 GSC 决定 Build/Hold | Codex |
| Lead Capture | Decide / Observe | Pillar：`/use-cases/ai-lead-capture-form-builder`；Template：`/templates/lead-capture`；Solution：`/solutions/saas-lead-capture-form-builder`；Posts：`ai-lead-capture-form-builder-saas`、`saas-lead-capture-form` | JUL-R02 完成：Existing Tune / Medium；SERP 混合 form generation 与 scoring/outreach，冻结至 07-11，不提前改页 | Codex |
| Waitlist Form | Ship / Observe | Parent：Lead Capture；Sub-Pillar：`/use-cases/waitlist-form-builder-indie-hackers`；Template：`/templates/waitlist`；Post：`/posts/waitlist-form-demand-validation`；Brief：`seo_brief_waitlist_subcluster_architecture.md`；Audit：`audits/waitlist-subcluster-2026-06-27/README.md` | 2026-06-27 已部署生产：公网与源站 Waitlist 页面、`intent=waitlist`、Template/Post CTA、canonical、SoftwareApplication/FAQPage/BreadcrumbList、sitemap 和全站 SEO Gate 均通过。冻结至 2026-07-11，观察 owning URL、query 与创建事件；不改 Post title/meta/正文 | Codex 观察；Mike 可提交 Google/Bing URL Inspection |
| Web Design Client Intake | Ship / Observe | Solution：`/solutions/web-design-client-intake-form-template`；基于 contact-us + prompt 承接 | 已上线并提交 URL Inspection；冻结观察，不马上扩周边 | Codex |
| Event Registration / QR Event | Ship / Observe | Pillar：`/use-cases/event-registration-form-builder`；Template：`/templates/event-registration`；QR 支撑：`/use-cases/qr-code-form-builder`；Solution：`/solutions/event-registration-form-with-qr-code`；Brief：`seo_brief_event_registration_qr.md` | 2026-06-26 已部署生产并完成验证：中英文页面 200、旧 URL 308、sitemap/canonical/FAQ/Breadcrumb Schema、CTA intent=`event_registration` 均通过。下一步提交 URL Inspection 并冻结观察 7-14 天 | Codex + Mike |
| Customer / Product Feedback | Observe | Architect Brief：`seo_brief_customer_product_feedback.md`；Pillar：`/use-cases/customer-feedback-form-builder`；模板承接：`/templates/satisfaction-survey`；CTA intent：`customer_feedback`；产品与 UX 审计已完成 | 2026-06-27 已部署并已提交 Google/Bing URL Inspection；冻结观察至 2026-07-11，只记录 query、CTR 和 `customer_feedback` 创建事件 | Codex 观察 |
| Product Feedback / Beta Feedback | Architect Candidate / Hold | Decide：`seo_topic_product_beta_feedback_decide_2026-06-27.md`；现有 `/templates/beta-feedback` 只承接 Beta Bug/复现，不冒充通用 Product Feedback | Google US SERP 已证明轻量表单意图，但暂无 GSC query，且 Customer Feedback 刚上线。2026-07-11 后按 query 归属和真实 `product-feedback` 模板准备度决定是否进入 Architect | Codex + 产品经理 |
| Client Intake / Project Request | Decide / Topic Universe | Google US 6 词证据已复核；Review：`GenForms_SEO_Topic_SERP_Research_Client_Quote_review.md` | 泛 Client Intake 混合医疗/法律/PDF，Project Intake 强 PM/审批意图。保护已上线 Web Design 子场景；Creative Agency / Consulting 暂不新建页面，等待独立证据和产品字段 | Codex 观察 |
| Quote Request | Ship / Observe | Brief：`seo_brief_quote_request_subcluster.md`；Audit：`audits/quote-request-subcluster-2026-06-27/README.md`；Pillar：`/use-cases/quote-request-form-builder`；Template：`/templates/quote-request`；Parent：Lead Capture | 2026-06-27 已部署生产；四个中英文 URL 200，CTA `intent=quote_request`、Schema、sitemap、全站 SEO/Release Gate 均通过。冻结至 2026-07-11，观察 owning URL、query 和创建事件 | Codex 观察；Mike 提交 Google/Bing URL Inspection |
| Job Application | Ship / Observe / Hold | Google US 6 词研究已复核；Review：`GenForms_SEO_Topic_SERP_Research_Job_Booking_review.md`；Audit：`audits/template-product-truth-repair-2026-06-28/README.md`；Template：`/templates/job-application` | 2026-06-28 已收窄为轻量候选人意向/初筛，移除文件上传、OCR、ATS 和自动解析承诺，并停止从模板页推荐 Solution；冻结观察，不扩 Use Case/Solution | Codex 观察 |
| Booking / Consultation Request | Ship / Observe / Topic Universe | Google US 6 词研究已复核；泛 Consultation 被医疗/政府/PDF 污染，Booking/Appointment 偏排期；Audit：`audits/template-product-truth-repair-2026-06-28/README.md` | 2026-06-28 已将现有模板收窄为“咨询请求 + 偏好时间段 + 人工确认”，移除实时排期、calendar invite 等承诺；停止从模板页推荐 Solution；泛 Consultation、Booking、Appointment 不建 Pillar | Codex 观察 |
| Demo Request | Ship / Observe | Brief：`seo_brief_demo_request_subcluster.md`；Audit：`audits/demo-request-subcluster-2026-06-28/README.md`；Parent：Lead Capture；Pillar：`/use-cases/demo-request-form-builder`；Template：`/templates/demo-request`；Post：`/posts/saas-lead-capture-form` | 2026-06-28 已部署生产；中英文 4 个 URL、CTA `intent=demo_request`、Schema、sitemap 和全站 SEO/Release Gate 均通过。冻结至 2026-07-12，观察 owning query 与创建漏斗，不扩 Solution/Post/pSEO | Codex 观察；Mike 提交 Google/Bing URL Inspection |
| Lead Magnet / Content Download | Ship / Observe / Merge into Lead Capture | Gemini 报告 + Codex Review：`GenForms_SEO_Topic_SERP_Research_Lead_Magnet_Newsletter_review.md`；Template：`/templates/content-download`；父级：`/use-cases/ai-lead-capture-form-builder` | 2026-06-28 已部署：保留资料访问申请模板，旧 `/solutions/lead-magnet-download-form` 中英文路由 308 到 Lead Capture Pillar；不承诺 Redirect、文件托管或自动邮件交付。冻结至 2026-07-12，不扩独立 Pillar/Solution/Post/pSEO | Codex 观察 |
| Newsletter Signup | Ship / Observe / Template-only | Gemini 报告 + Codex Review：`GenForms_SEO_Topic_SERP_Research_Lead_Magnet_Newsletter_review.md`；Template：`/templates/newsletter-signup` | 2026-06-28 已部署：模板明确无 embed、无邮件发送/双重确认、无 ESP 原生同步；旧 Solution 中英文路由 308 到模板。冻结至 2026-07-12，不进入 Architect/pSEO | Codex 观察 |
| Course Registration | Ship / Observe | Solution：`/solutions/course-registration-form-builder`；Template：`/templates/course-registration`；唯一分类：Education & Training；关联产品族：Event Registration；Brief：`seo_brief_course_registration_architect.md`；Build Audit：`audits/course-community-build-2026-06-28/README.md` | 2026-06-28 已部署：真实课程报名首屏预览、字段/FAQ/产品边界、Event/QR/Webhook 内链和 `course_registration` CTA 均已上线；不新增页面。冻结至 2026-07-12，观察 course registration / class registration / training registration query 与创建事件 | Codex 观察；Mike 提交 Google/Bing URL Inspection |
| Community Application | Ship / Observe / Template-only | 唯一承接页：`/templates/community-application`；退役 Solution：`/solutions/community-application-form-template`；Brief：`seo_brief_community_application_template_only.md`；Build Audit：`audits/course-community-build-2026-06-28/README.md` | 2026-06-28 已部署：补联系方式和人工跟进许可、可见 FAQ/Schema、`community_application` CTA 与产品边界；旧 Solution 三条路径均 308 到本地化 Template，且已从 sitemap 移除。冻结至 2026-07-12，不扩 Use Case/Post/Integration/pSEO | Codex 观察；Mike 提交 Template URL Inspection |
| Volunteer Application | Ship / Observe / Template-only | Batch 3 Decide：`GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md`；Brief：`seo_brief_volunteer_application_template.md`；验证：`seo_volunteer_application_build_verification_2026-06-29.md`；Template：`/templates/volunteer-application` | 2026-06-29 已部署并通过中英文、桌面/移动、CTA、Schema、sitemap 和生产 SEO Gate；2026-06-30 Mike 已提交中英文 Template 到 Google/Bing；冻结至 2026-07-13 | Codex 观察收录、query 与 `volunteer_application` 创建事件 |
| Service Request / Complaint | Ship / Observe / Merge / Template-only | Batch 3 Decide：`GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md`；Brief：`seo_brief_customer_service_request_template.md`；验证：`seo_customer_service_request_build_verification_2026-06-29.md`；Template：`/templates/customer-service-request`；归属 Contact Form / Customer Feedback | 2026-06-29 已部署并通过中英文、CTA、Schema、sitemap、生产 Release/SEO Gate；2026-06-30 Mike 已提交中英文 Template 到 Google/Bing；冻结至 2026-07-13，不建独立 SEO 页面 | Codex 观察收录、query 与 `service_request_intake` 创建事件 |
| Slack Incoming Webhook Notifications | Validate complete / Merge / Product Gate Pass | Goal：`seo_goal_slack_incoming_webhook_validate.md`；SERP：`GenForms_SEO_Topic_SERP_Research_Slack_Incoming_Webhook.md`；Gate Report：`slack_incoming_webhook_gate_report_2026-06-29.md`；Parent：Webhook Form | Google US SERP 已决定 `Merge / Post-only`；2026-06-30 已完成生产字段迁移、固定 Slack Test Send、真实生产表单提交 E2E、部署和 SEO Gate，Slack 返回 HTTP 200 / `ok`。不建独立 Slack 页面；仅保留未来窄技术 Post 可能性 | Codex 观察；后续只看 Webhook/Slack query 与创建事件 |
| Customer Testimonial / Customer Story | Ship / Observe / Template-only | Owner：`/templates/customer-testimonial-form`；Post：`/posts/customer-testimonial-form-guide`；退役：`/solutions/customer-testimonial-collection-form`、`/templates/customer-story`；Decide：`seo_testimonial_ownership_decide_2026-06-29.md`；Verify：`seo_testimonial_ownership_build_verification_2026-06-29.md` | SERP 3/6 成功词支持 Template + Guide；Solution 退役、模板规范改名、本地化 308、Post CTA 和 sitemap 收口已随 U-061 统一部署。2026-06-30 生产验证：Template 200、Post 200、旧 Solution/旧 Template 均落到新 Template；Mike 已提交新 Template 与 retained Guide 到 Google/Bing | 进入 Observe；不提交退役 URL，观察收录、query、CTR 和旧 URL 信号迁移 |
| Website / Business Enquiry Form | Decide / Merge / Observe | Decide：`seo_website_enquiry_form_decide_2026-06-29.md`；Parent：Contact Form；Template-intent Owner：`/solutions/website-contact-form-template` | Google US 两组 SERP 均由 Inquiry/Contact Template 主导；GSC 23 个 query×page 行、62 impressions 由现有 Solution 承接。合并 Contact Cluster，不新建 URL、不改冻结页面 | Closed to Observe；Codex |
| Vendor / Supplier Registration | Reject | Batch 3 Decide：`GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md` | 当前 MVP 不建任何资产；未来 event vendor interest 需重新 Discover，不继承本批结论 | Closed |
| WorkBuddy / Mike SERP batches | Research import / Decide | Review：`workbuddy_serp_topic_loop_review_2026-06-30.md`；Evidence：`gemini_keyword_research_loop/workbuddy_serp_captures/` | 18 个 Topic 中 11 个已有截图并完成 Codex Review，7 个仍 Evidence Blocked；第三批 9 张英文 Google US 全页截图已由 Mike 完成并由 Codex 转录。11 个均未触发 Build | 不开新 Build；停在第三批 Decide checkpoint |
| Topic Loop Cursor | Historical evidence control | `seo_topic_loop_cursor_2026-06-30.md` | 历史 Active Capture=0；第三批 Portfolio/WeCom/Mobile-friendly 已关闭。Production Research Batch 独立运行，不重开 blocked inventory | Codex 控制游标；不得自动替换或跳 Topic |

### Codex 总管规则

- 每周维护 Topic Loop 状态，不只维护单个页面状态。
- Active Build 同时最多 1 个，避免页面互相抢资源和数据无法归因。
- Active Research 同时最多 2-3 个，由 Gemini / 产品经理承担证据采集。
- Active Observe 可以多个并行，但必须记录提交日期、冻结窗口和指标。
- 每个 Topic 的下一步必须落到一种动作：继续观察、SERP 复核、Brief、内链/CTA 小修、外链提权、扩展周边资产、停止。

## 3. 当前 SEO 工作全局看板

| 主题 / URL | 类型 | 当前阶段 | 状态 | 下一步 | 负责人 |
|---|---|---|---|---|---|
| Contact Form 关键词组 | 关键词簇 / Use Case | Observe | Google US SERP 已完成；`/use-cases/contact-form-builder-for-websites` 已上线并提交 Google/Bing | 冻结观察 7-14 天，看 contact form / website form query、impressions、CTR、进入创建事件 | Codex 观察，Mike 不需要再改页面 |
| `/use-cases/contact-form-builder-for-websites` | Use Case | Observe | 主承接页已按产品事实边界完成定位和 CTA | 暂不改；等 GSC query 和 CTR；若有展示无点击，再做 title/meta 或 FAQ 小修 | Codex |
| Webhook Retry Logs 关键词组 | Use Case / Post 集群 | Observe | `/use-cases/webhook-form-builder-retry-logs` 已上线；`send-form-submissions-to-webhook` 已上线；2026-06-25 已补全 Webhook Cluster 配置 | 冻结观察 7 天，看 Webhook Pillar、教程页和支撑 Post 是否扩大 impressions | Codex |
| `/posts/send-form-submissions-to-webhook` | Post | Observe | 已达到当前 Webhook 教程型 Post 标杆：首屏 CTA、webhook intent、mini console、keywords 已匹配 | 冻结观察；等首批 impressions/query | Codex |
| `/posts/feishu-dingtalk-webhook-notification` | 老 Post | Observe | 2026-06-21 已完成 CTR 修复并提交 Google/Bing：title/meta/H1/CTA 已更新 | 冻结观察 7 天；看 CTR 是否从 0 起量，以及 `post_feishu-dingtalk-webhook-notification` 创建事件 | Codex 观察，Mike 已完成提交 |
| QR Code Form 关键词组 | Use Case | Observe | `/use-cases/qr-code-form-builder` 已上线，有少量展示 | 暂不改 title；优先内链增强，看是否从 20-30 名区间上升 | Codex |
| Event Registration / QR Event | Use Case / Template / Solution 集群 | Observe | `/use-cases/event-registration-form-builder`、`/templates/event-registration`、`/solutions/event-registration-form-with-qr-code` 已上线；旧 URL 已 308 到新 Pillar；产品边界已收窄为报名/RSVP/Workshop/Webinar，不承诺票务、支付、座位、签到核销 | 冻结观察 7-14 天；看 event registration / event signup / RSVP / workshop / webinar query、CTR、`event_registration` 创建事件 | Codex 观察，Mike 提交 URL Inspection |
| Customer / Product Feedback | Topic Cluster | Observe | `/use-cases/customer-feedback-form-builder` 已部署并已提交 Google/Bing URL Inspection；对齐 `satisfaction-survey`、`customer_feedback`、字段/FAQ/内链/Schema，CTA 进入 `warm-feedback` 创建视觉；生产 SEO Gate 通过 | 冻结至 2026-07-11，观察 customer feedback / satisfaction template query、CTR 和 `customer_feedback` 创建事件 | Codex 观察 |
| Lead Capture | Use Case / Template / Solution / Post 集群 | Observe | Google US SERP 已验证 5 个核心词；GSC 7d 出现 `lead form ai` 10 impressions / position 18.8；Pillar 26 impressions / position 49.3；两篇 Lead Post 已出现 position 3.5-7 的小样本。2026-06-27 集群接线已部署并通过源站验证 | 冻结至 2026-07-11；不改已有 Post 的 title/meta/正文，观察 Pillar/Template/Post 与 `lead_capture` 创建事件 | Codex 观察 |
| Typeform Alternative with Webhooks | Use Case / Post 集群 | Observe | `/use-cases/typeform-alternative-webhooks`、`/posts/cheaper-ai-typeform-alternative`、`/posts/typeform-alternatives` 均已上线；老 Post 已完成结构改造；Google/Bing URL Inspection 已提交 | 冻结观察 Typeform 集群 7-14 天，看 Google 是否分配 AI / webhook / cheaper 相关 query | Codex |
| `/posts/typeform-alternatives` | 老 Post | Observe | 2026-06-21 已完成结构改造并部署：title/meta、Quick Answer、顶部 CTA、对比表、workflow handoff、侧边栏 Typeform-style CTA；生产 SEO gate 通过；Google/Bing URL Inspection 已提交 | 2026-06-21 至 2026-07-05 冻结观察，不继续改正文；记录 GSC/GA4 数据 | Codex 观察 |
| `/posts/google-forms-vs-typeform-vs-genforms-workflow` | 老 Post / 辅助内容 | Backlog | GA4 有少量 sessions，但 GSC 信号弱 | 暂不优先；后续判断是否合并到 Typeform/Google Forms 对比集群 | Codex |
| `/posts/form-builder-with-webhook` | 老 Post / 辅助内容 | Observe | 平均排名不错但展示太少；2026-06-25 已补到 Webhook Pillar 的 Related guides | 继续观察，不大改正文；看展示量是否随主题簇增强扩大 | Codex |
| `google forms alternative with webhooks` | 关键词候选 | Architect Backlog / Hold | WorkBuddy 2026-06-30 已完成 3 个 Google US 截图证据；SERP 证明商业意图和 webhook 替代痛点，但竞品/列表页/AI Overview 强，GenForms 暂无该 query 权威 | 暂不建独立页面；等 Typeform/Webhook 集群数据或现有 Google Forms/Webhook 页面出现 query 后再 Brief | Codex |
| `tally alternative` | 关键词候选 | Backlog / Hold | WorkBuddy 2026-06-30 已完成 3 个 SERP 截图；意图强但 SERP 拥挤，Tally 免费层心智强，GenForms 当前不适合打 broad competitor alternative | 不进入 Build；后续只在 Alternatives authority 起量后重评 | Codex |
| `user interview recruitment form` | Template / Solution cluster | Observe / Golden Tuning candidate | WorkBuddy 2026-06-30 截图显示 GenForms 已在主 query 可见；截图实际指向现有 `/solutions/user-interview-recruitment-form`，不是 WorkBuddy 表格误写的 404 模板别名 | 不新建页面；等 GSC 确认 query/page 后再决定 title/meta 或 FAQ 小调 | Codex |
| `event feedback survey` | Template candidate | Template-only / Architect Backlog | WorkBuddy SERP 证明 post-event survey / conference feedback template 意图；现有 `/templates/event-feedback` 中英文生产 200 | 不建 `/post-event-survey` 重复页；Event cluster 冻结数据回来后再调现有 Template | Codex |
| `customer feedback form with QR code` | Cluster support evidence | Observe / Support evidence | WorkBuddy SERP 证明 QR feedback intent；代码与产品文案确认 GenForms 有 share QR code；已有 Customer Feedback + QR Code clusters 覆盖 | 冻结至 2026-07-11；之后只考虑内链/FAQ/文案小调，不新建页 | Codex |
| `lead capture form with webhook` | Webhook / Lead Capture support evidence | Decide / Merge / Observe | 3 张截图已由 Codex 重做转录；SERP 为技术配置/文档意图，现有 Webhook + Lead Capture 资产已覆盖 | 不新建页面；冻结至现有集群观察窗口结束，后续只按 GSC owning query 决定小调 | Codex |
| `form notification workflow` | Webhook notification candidate | Decide / Hold / Merge | 3 张截图已修复；SERP 期待 Power Automate、邮件/任务和条件工作流，超出 MVP | 不建 workflow 页面；仅保留真实 Incoming Webhook notification 表达 | Codex |
| `public form link / shareable form` | Product education support | Decide / Merge | 3 张截图已修复；SERP 为平台帮助和 broad form-builder discovery，公开链接属于基础能力 | 不建独立 SEO 页面；留在产品教育和 QR/share 现有资产 | Codex |
| `portfolio submission form` | Template / Solution cluster | Observe / Golden Tuning candidate | Mike 3 张英文 Google US 截图显示现有 `/solutions/portfolio-submission-form-template` 已在 exact template query 第一页 | 不新建页面；等 GSC 确认 query/page 后再决定现有资产小调 | Codex |
| `form submissions to WeCom` | Notification / Webhook support | Observe / Merge | 产品相关 query 下现有 `/use-cases/feishu-dingtalk-form-notifications` 为首个自然结果；其他 query 偏技术文档或噪声 | 保护现有 owner，不建 WeCom 独立页；只写 Incoming Webhook/group-bot 能力 | Codex |
| `mobile-friendly form builder` | Broad category candidate | Reject standalone / Merge | SERP 期待 drag-and-drop、原生 App、离线/现场工作流等宽能力，超出 MVP | 不建独立页；mobile-friendly 只作为具体场景页的支持文案 | Closed |
| `lead capture form template` | 关键词候选 | Observe / Architect Backlog | Google US SERP 已确认模板意图；`/templates/lead-capture` GSC 7d 14 impressions、平均排名 80.1 | 先接受 Lead Capture 集群内链；出现稳定 template query 后，再启动 Template Page 独立优化 Goal | Codex |
| 核心关键词排名清单 | 监控系统 | Observe | `seo_core_keyword_observation_list.md` 已建立，覆盖 Contact、Webhook、Typeform、QR、Lead Capture、Google Forms、泛品类词 | 每周补充 GSC query 级 7d/28d 数据；用它决定下一轮 Brief 或继续冻结 | Codex |
| 外链与品牌提及 | 外部信号 | Backlog / Ongoing | `seo_backlink_work_queue.md` 已建立，按目录、社区、替代品平台和 outreach 分层执行 | Mike 长期执行；每周记录新增外链、UTM referral、收录和转化事件 | Mike |
| 公网小流量种子验证 | 外部发现 | Backlog / 待执行 | `U-053` 已有执行包，但需要 Mike 或外部执行 | 按 D1-D5 小步执行，记录 UTM 和外部链接 | Mike / 外部执行 |
| 冷启动真实 Session 审计 | Clarity / 产品激活 | Observe / Diagnose | 2026-06-30 已完成过去 7 天 Clarity 审计：41 条录制中外部样本约 20 条；Google webhook 有 1 个 01:37/1 click 的有效阅读信号，BetaList 有 01:10、03:21、02:48 等长读但无创建，首页存在长停留 0 点击样本；未发现 404、核心 CTA 失效或 `/forms/new` 重复硬故障 | 不触发新 SEO Build 或冻结页改写；U-061 已解锁，继续 Observe 与公网种子，拿更多合格样本 | Codex |

## 4. 当前不能继续改的冻结页面

以下页面已经进入冻结观察期。除非出现技术错误、页面不可访问、canonical/robots 异常，否则不要继续修改：

| URL | 冻结原因 | 观察窗口 | 观察指标 |
|---|---|---|---|
| `/posts/feishu-dingtalk-webhook-notification` | 2026-06-21 刚做 CTR 修复并重新提交 Google/Bing | 7 天 | impressions、clicks、CTR、average position、webhook intent 创建事件 |
| `/posts/send-form-submissions-to-webhook` | 新发布且已符合 Webhook Post 标准 | 7-14 天 | 是否出现 send form submissions to webhook / form webhook query |
| `/posts/cheaper-ai-typeform-alternative` | 新发布，等待 Google 理解 cheaper / pricing / alternative 意图 | 7-14 天 | cheaper / pricing / alternative query、CTR、创建事件 |
| `/use-cases/contact-form-builder-for-websites` | 新上线主承接页，已提交 Google/Bing | 7-14 天 | contact form / website contact form query、impressions、CTR |
| `/use-cases/qr-code-form-builder` | 已上线且有少量展示，先观察排名变化 | 7-14 天 | QR form query、average position、进入页事件 |
| `/use-cases/typeform-alternative-webhooks` | 新页面数据太少 | 7-14 天 | Typeform/webhook query 是否出现 |
| `/use-cases/event-registration-form-builder` | 2026-06-26 刚部署并通过生产验证 | 7-14 天，建议观察到 2026-07-10 | event registration / event signup / RSVP / workshop registration / webinar registration query、CTR、`event_registration` 创建事件 |
| `/use-cases/customer-feedback-form-builder` | 2026-06-27 已部署并提交 Google/Bing | 冻结到 2026-07-11 | customer feedback / satisfaction query、CTR、`customer_feedback` 创建事件 |
| Lead Capture Pillar + Template + 2 Posts | 2026-06-27 刚完成 Topic Cluster 内链与 CTA 接线 | 冻结到 2026-07-11 | lead capture / lead form AI query、页面分工、`lead_capture` 创建事件 |
| Quote Request Pillar + Template | 2026-06-27 已部署生产并通过全站 Gate | 冻结到 2026-07-11 | quote request / request a quote / service quote query、两个 owning URL、`quote_request` 创建事件 |
| Course Registration Solution + Template | 2026-06-28 已完成产品边界与转化承接改造并部署 | 冻结到 2026-07-12 | course registration / class registration / training registration query、两个 owning URL、`course_registration` 创建事件 |
| Community Application Template | 2026-06-28 已完成 Template-only 收口并部署，重复 Solution 已 308 退役 | 冻结到 2026-07-12 | community application query、Template 收录与 CTR、`community_application` 创建事件、旧 URL 信号迁移 |

## 5. 下一步执行顺序

> 2026-06-29 更新：本节旧版中 Event Registration、Lead Capture 等“下一批候选”已完成研究与上线，不再作为新 Research。当前 Portfolio 和执行队列以 `seo_topic_portfolio_2026-06-29.md` 为准。

### 当前执行队列

1. `Observe`：冻结并监控 2026-06-26 至 2026-06-28 上线的 Topic 资产，不自动改页。
2. `Observe`：Volunteer Application 已部署，冻结至 2026-07-13，只观察收录、query 与创建事件。
3. `Observe`：Service Request 已部署，冻结至 2026-07-13，不建独立 SEO 页面。
4. `Reject`：Vendor / Supplier Registration 当前不进入 Architect 或 Build。
5. `Observe / Diagnose`：2026-06-30 冷启动 Clarity Session 审计已完成，未触发 Hotfix 或新 SEO Build。
6. `Research import / Decide`：历史 18 个 Topic 中 11 个 Captured 已复核、7 个仍 Evidence blocked；这些 Topic 均不因新 Loop 而重新打开。
7. `Production Research`：Batch `2026-07-03-R01` 已填满 3 个槽位，只处理 QR Tune、Lead 信息增益、Typeform Authority。
8. `Brief`：当前 0/2；研究证据和对应 GSC/Freeze Gate 通过后再填充。
9. `Build`：当前 0/1；下一 Build 必须同时通过 Google SERP、Product Gate、冻结窗口和现有资产 ownership 检查。

当前不启动 Product Feedback Build、Alternatives 扩页或 pSEO 试点；它们分别等待冻结数据、主题权威和成熟度证据。

### Step 0：先建立主题集群视角

在继续做页面微调前，先把当前资产按主题集群整理清楚：

| 主题集群 | Pillar Page | 当前 Cluster Pages / 支撑资产 | 近期动作 |
|---|---|---|---|
| Contact Form | `/use-cases/contact-form-builder-for-websites` | contact-us 模板、Contact Form 关键词研究、后续 contact form 教程/FAQ | 建立内链清单，先不改主页面正文 |
| Webhook Form | `/use-cases/webhook-form-builder-retry-logs` | `/posts/send-form-submissions-to-webhook`、`/posts/form-builder-with-webhook`、Feishu/DingTalk 通知文章 | 优先补支撑文章到 Pillar 的内链和创建入口一致性 |
| QR Code Form | `/use-cases/qr-code-form-builder` | QR 分享、线下收集、活动报名、扫码提交相关资产 | 等 GSC 回补后判断是否进入 Golden Tuning |
| Typeform Alternative | `/posts/typeform-alternatives`、`/use-cases/typeform-alternative-webhooks` | cheaper Typeform alternative、Google Forms vs Typeform、Typeform-style 创建路径 | 冻结观察，作为 Alternatives 商业意图集群保护 |
| Lead Capture | `/use-cases/ai-lead-capture-form-builder` | `/templates/lead-capture`、SaaS Solution、两篇 Lead Capture Post | 已完成集群接线，冻结观察，不改已有排名 Post 正文 |
| Customer Feedback | `/use-cases/customer-feedback-form-builder` | satisfaction-survey 模板、Product Feedback 研究结论 | 新发布冻结观察；后续由 query 决定是否扩 Product/Beta Feedback 支撑页 |
| Quote Request | `/use-cases/quote-request-form-builder` | `/templates/quote-request`、Lead Capture Parent、Webhook Pillar、`saas-lead-capture-form` Post | 第一批资产包已完成；部署后冻结观察，不扩 Service Quote / Estimate 同义页 |

这一步的产物不是马上新建页面，而是：

- 明确每个 Cluster Page 应该指向哪个 Pillar Page。
- 检查 CTA 是否进入对应 intent / template / prompt。
- 找出每个 Pillar 缺少哪些必要支撑页。

### Step 1：按 SOP V2 给页面分区

每周先用 `seo_growth_sop_v2.md` 对重点页面做状态判断：

- Not Indexed：优先查索引、canonical、sitemap、内链，不改正文。
- Frozen：保持 5-14 天冻结观察，除非技术 SEO 出错。
- CTR Rescue：排名 1-10 但 CTR 低，只动 title / meta / SERP 摘要相关元素。
- Golden Tuning：排名 11-30 且有 impressions，补 FAQ、字段清单、结果感、内链等小范围信息增益。
- Authority Needed：排名 50-80+，先判断意图匹配和内容厚度；合格则做内链/外链，不合格重新 Brief。
- Dead Lock：45 天两轮优化仍无改善，停止频繁修改，转入外链和主题权威沉淀。

分区结果记录到：

- `seo_page_observation_ledger.md`

### Step 2：稳定数据和观察

每天 09:30 检查 SEO monitor：

- GSC / GA4 快照是否成功写入。
- 重点 URL 是否新增 impressions / clicks / query。
- 新页面是否开始被 Google 展示。
- SEO 页面进入后的 `forms_new_view`、`template_use_click`、`form_generate` 是否出现。

结果记录到：

- `seo_page_observation_ledger.md`

### Step 3：观察 `/posts/typeform-alternatives` 改造结果

这是当前已完成实现、进入观察的主线工作。

原因：

- 它已经有 28d 378 impressions。
- 0 clicks。
- 排名约 78，说明不是单纯 CTR 问题，而是内容结构和搜索意图竞争力不足。
- 它能连接 Typeform Alternative、Cheaper Typeform Alternative、Typeform-style form、Webhook-ready form 等多个集群。

Brief 已创建并已执行：

- `seo_brief_typeform_alternatives_structure_refresh.md`

它回答：

- Google 当前如何理解 Typeform alternatives。
- 搜索用户到底想要“替代品列表”“价格替代”“免费替代”“AI 替代”“Typeform-style 体验”中的哪一种。
- 老页面当前哪里和搜索意图不匹配。
- GenForms 应该切哪个角度，不应承诺哪些能力。
- CTA 如何进入 `typeform_alternative + typeform_style` 创建路径。

已完成：

- Mike 评审 Brief。
- 后台文章内容改造。
- 博客 CTA 覆盖。
- 本地 `npm run build`。
- 生产部署。
- 生产 HTML 验证。
- 生产 SEO gate。

下一步：

- Google/Bing URL Inspection 已提交。
- 页面冻结观察 7-14 天，观察窗口：2026-06-21 至 2026-07-05。
- 只记录 GSC/GA4，不继续改正文。

### Step 4：维护核心关键词观察清单

对应 `U-035`。

已建立：

- `seo_core_keyword_observation_list.md`

已固定这些类型：

- 品类词：`AI form builder`、`online form builder`
- 替代品词：`Typeform alternative`、`cheaper Typeform alternative`、`Google Forms alternative`
- 场景词：`contact form builder`、`website contact form`、`lead capture form template`
- 能力词：`webhook form builder`、`QR code form builder`、`send form submissions to webhook`

每周补充字段包括：

- keyword
- cluster
- target URL
- current 7d / 28d impressions
- clicks
- CTR
- average position
- current action
- next review date

下一步：

- 2026-06-28 做第一次周复盘，补 GSC query 级数据。
- 如果 GSC/GA4 快照仍有 OAuth token 错误，先修数据链路，再做 SEO 判断。

### Step 5：Batch 3 Decide 完成，进入 Volunteer Architect Gate

Batch 3 的研究、产品事实复核与 Codex Decide 已完成：

- Volunteer Application：P0，Template-only，已部署并冻结观察至 2026-07-13。
- Service Request / Complaint：P1，并入 Contact Form / Customer Feedback，当前 Active Architect，只规划一个轻量 Template。
- Vendor / Supplier Registration：Reject，当前不创建资产。

决策报告：`../AI-Team/reports/codex-review/GenForms_SEO_Batch3_Codex_Decide_2026-06-29.md`。
Volunteer Brief：`seo_brief_volunteer_application_template.md`。

`google forms alternative with webhooks`、`lead capture form template` 与 QR/Webhook/Typeform 更细长尾继续暂缓，避免在现有集群冻结期内制造页面重叠。

### Step 6：长期外链与品牌提及

已建立：

- `seo_backlink_work_queue.md`

执行原则：

- 外链不追求数量，追求真实相关和可归因。
- 第一批优先 AlternativeTo、SaaSHub、Uneed、Fazier、DevHunt 这类真实目录或替代品平台。
- 社区回答以解决问题为主，不伪装路人，不硬贴链接。
- 所有链接尽量带 UTM，方便 GA4 / 增长后台识别来源。
- 每周复盘新增外链、referral traffic、注册/创建事件和是否被 Google 收录。

## 6. 每周复盘问题

每周 SEO 复盘时只问这些问题：

1. 哪些页面获得了新的 impressions？
2. 哪些页面有排名但 0 点击？
3. 哪些页面有点击但没有创建事件？
4. 哪些 query 和我们预期不一致？
5. 哪个页面应该进入下一轮 Brief？
6. 哪些页面继续冻结，不允许改？
7. 是否有新的关键词值得进入 Google SERP 调研？

## 7. 当前一句话判断

当前主线不是继续铺很多新页面，而是：

> 让已经上线和已经被 Google 测试过的 Contact Form、Webhook、Typeform、QR 相关页面进入可观测状态；优先修复已有展示但承接不足的老 Post；等数据反馈后再决定下一批关键词研究。

因此，下一项最清晰的 Codex 工作已经推进为：

> `/posts/typeform-alternatives` 已完成结构改造并进入冻结观察；下一步回到数据观察和核心关键词清单。
