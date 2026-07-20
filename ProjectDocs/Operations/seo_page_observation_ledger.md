# GenForms.ai SEO 页面观察台账

> 创建日期：2026-06-21  
> 数据来源：生产环境 `growth_metric_snapshots`，由 daily-brief-agent 汇总 GSC / GA4 数据  
> 用途：记录 SEO 页面上线、冻结、观察和再次优化的证据，避免凭感觉频繁改动页面。
> 执行口径：状态判断与下一步动作按 `seo_growth_sop_v2.md` 的页面分区执行。

## 1. 使用原则

SEO 页面上线后，不立即反复修改。先进入观察台账，等待 Google 收录、展示和点击数据形成最小样本，再决定是否调整标题、摘要、首屏、CTA 或页面结构。

判断顺序：

1. 先看 Google 是否已经理解页面：GSC impressions / query / position。
2. 再看搜索用户是否愿意点击：CTR、标题摘要匹配度、SERP 竞争环境。
3. 再看进入后是否有动作：GA4 / Clarity sessions、Pricing、CTA click、form_generate、form_publish、form_submit。
4. 最后才决定页面修改，且每次修改尽量只改一个主要变量，保留 3-7 天观察窗口。

数据延迟口径：

- GSC 是 query、排名、展示和 CTR 的最终判断来源，但不是实时数据源，常见延迟为 24-48 小时。
- Clarity / GA4 是当天用户行为的领先信号，适合判断 SEO 页面是否已经有 Google 用户进入、是否有高意图动作、是否存在产品体验阻塞。
- 当 Clarity 出现 Google 会话而 GSC 仍滞后时，不把它判定为“GSC 没效果”，先记录领先行为信号，等待 GSC 回补后再做排名和 CTR 判断。

## 2. 全站当前基线

截至 2026-06-21，恢复 GSC / GA4 后的最新快照如下：

| 观察窗口 | GSC 展示 | GSC 点击 | CTR | 平均排名 | GA4 sessions | GA4 active users | GA4 new users | GA4 events |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 7d | 415 | 2 | 0.48% | 51.21 | 157 | 135 | 133 | 897 |
| 28d | 1,667 | 4 | 0.24% | 46.55 | 416 | 297 | 297 | 2,777 |

阶段判断：

- SEO 已经有真实搜索曝光和点击，但整体仍处于早期样本期。
- 28d 展示和点击在增长，说明 Google 开始更频繁测试页面。
- 7d 展示回落，说明页面级观察要优先看哪些 URL 已被 Google 理解、哪些 URL 还没有足够数据。
- 当前最核心的问题不是单个页面“写得不够长”，而是要把高意图页面稳定推入“展示 -> 点击 -> 创建表单”的闭环。

## 3. 目标页面观察表

| URL | 关键词/意图组 | 当前证据 | 当前状态 | 下一步动作 |
|---|---|---|---|---|
| `/use-cases/contact-form-builder-for-websites` | contact form builder / website contact form | GSC 7d：106 展示、0 点击、平均排名 58.90；GSC 28d：234 展示、0 点击；GA4 暂无页面会话记录 | 冻结观察 | 这是刚完成定位和 CTA 的主承接页。继续观察 7-14 天，重点看 impressions 是否继续增长、query 是否集中到 contact form / website form、CTR 是否出现首个点击。 |
| `/use-cases/webhook-form-builder-retry-logs` | webhook form builder / retry logs | GSC 28d：2 展示、0 点击、平均排名 1.50；GA4 7d：2 sessions、7 events | 小样本观察 | 排名样本很好但展示太少。先不改页面，继续通过内部链接和 webhook 支撑文章增强主题信号。 |
| `/use-cases/qr-code-form-builder` | QR code form builder / QR form | GSC 7d：9 展示、0 点击、平均排名 22.22；GSC 28d：42 展示、0 点击；GA4 7d：2 sessions、9 events | 观察 + 内链增强 | 已进入可见区但排名还不稳定。下一步优先从相关 Post 和模板入口补内部链接，不急于改标题。 |
| `/use-cases/typeform-alternative-webhooks` | typeform alternative / webhook / single-question form | GSC 7d：1 展示、0 点击、平均排名 28；GSC 28d：3 展示、0 点击 | 冻结观察 | 数据太少，暂不判断页面质量。后续依赖 Typeform comparison 文章和内部链接带动。 |
| `/posts/send-form-submissions-to-webhook` | send form submissions to webhook / form webhook | GSC/GA4 暂无快照记录 | 新发布观察 | 已按 Post 转化标准优化方向通过产品侧确认。等待收录和首批 impressions，再看是否需要调整 title/meta。 |
| `/posts/cheaper-ai-typeform-alternative` | cheaper Typeform alternative / AI Typeform alternative | GSC/GA4 暂无快照记录 | 新发布观察 | 等待 Google 收录和关键词归因。重点观察是否拿到 cheaper / pricing / alternative 类 query。 |
| `/use-cases/event-registration-form-builder` | event registration form builder / event signup form / RSVP form / workshop registration / webinar registration / QR event form | 2026-06-26 已部署生产并完成发布验证：中英文页面 200、旧 URL `/use-cases/ai-event-registration-form-builder` 308 到新 URL、sitemap 包含 Pillar/Template/Solution、canonical/hreflang/FAQPage/BreadcrumbList/CTA intent=`event_registration` 均通过；GSC/GA4 暂无上线后快照记录。 | 新发布观察 / 冻结观察 | Google/Bing URL Inspection 后冻结 7-14 天，建议观察至 2026-07-10。重点看 event registration / event signup / RSVP / workshop / webinar query、CTR、`event_registration` 创建事件；页面正文不要继续改，除非出现技术 SEO 问题。 |
| `/use-cases/customer-feedback-form-builder` | customer feedback form / customer feedback form builder / customer feedback form template / satisfaction survey template | 2026-06-27 已部署生产并已提交 Google/Bing URL Inspection：中英文页面 200；CTA 保留 `source=usecase_customer-feedback-form-builder`、`intent=customer_feedback`、Prompt 和 `warm-feedback` 视觉参数；canonical、FAQPage、BreadcrumbList、sitemap 及全站 SEO Gate 通过；GSC/GA4 暂无上线后快照记录。 | 新发布观察 / 冻结观察 | 冻结至 2026-07-11。重点看 customer feedback / satisfaction survey template query、impressions、CTR，以及 `customer_feedback` 创建事件；不因早期零数据修改正文。 |
| `/use-cases/ai-lead-capture-form-builder` + Lead Capture Cluster | lead capture form builder / AI lead capture form builder / lead form AI | GSC 7d：Pillar 26 impressions、0 clicks、avg pos 49.3；Template 14 impressions、avg pos 80.1；SaaS Solution 9 impressions、avg pos 77.8。Query `lead form ai` 10 impressions、avg pos 18.8。两篇 Lead Post 分别出现 avg pos 7.0 和 3.5 的小样本。2026-06-27 已部署集群内链与 Post `lead_capture` CTA，源站验证通过。 | Ship / 冻结观察 | 冻结至 2026-07-11。观察 Pillar、Template、Solution、两篇 Post 的 query/position，以及 `post_*` source 下的 `lead_capture` 创建事件；不改两篇 Post 的 title/meta/正文。 |
| `/use-cases/waitlist-form-builder-indie-hackers` + Waitlist Subcluster | waitlist form builder / waitlist form template / startup waitlist / AI waitlist form builder | GSC 28d 基线：Use Case 36 impressions、avg pos 25；Post 20 impressions、avg pos 10；Template 8 impressions、avg pos 71.1；query `create waitlist` 1 impression、avg pos 12。2026-06-27 已部署 Cluster Post、`intent=waitlist`、Template/Post 创建上下文、Webhook 内链与安全预览；生产页面、CTA、canonical、Schema、sitemap 和 SEO Gate 通过。 | Ship / 冻结观察 | 冻结至 2026-07-11。观察 Use Case、Template、Post 的 query/position/CTR，以及 `usecase_*`、`template_waitlist`、`post_waitlist-form-demand-validation` source 下的 `waitlist` 创建事件；保护 Post title/meta/正文，不新建同义 URL。 |
| `/use-cases/quote-request-form-builder` + `/templates/quote-request` | quote request form / request a quote form / quote request form template / service quote request form | Google US SERP 6 词已研究并经 Codex 数据质量复核；2026-06-27 已部署真实模板、专属预览、FAQ、Schema、Lead Capture/Webhook/Post 内链和 `intent=quote_request`。四个中英文 URL 200，两条 CTA、sitemap、全站 SEO/Release Gate 均通过；尚无上线后 GSC/GA4 数据。 | Ship / 冻结观察 | 冻结至 2026-07-11。观察两个 owning URL 的收录、query、impressions、CTR、position，以及 `usecase_quote-request-form-builder`、`template_quote-request` source 下的创建与发布事件；不扩 Service Quote / Estimate 近义页。 |
| `/use-cases/demo-request-form-builder` + `/templates/demo-request` | demo request form builder / demo request form template / request a demo form | Google US Consultation/Booking 研究经 Codex 复核后拆出有效 Demo Request 意图；2026-06-28 已部署真实 8 字段模板、专属首屏预览、FAQ、Schema、Lead Capture/Webhook/Post 内链和 `intent=demo_request`。四个中英文 URL 200，CTA、sitemap、canonical/hreflang 及全站 SEO/Release Gate 均通过；尚无上线后 GSC/GA4 数据。 | Ship / 冻结观察 | 冻结至 2026-07-12。观察两个 owning URL 的收录、query、impressions、CTR、position，以及 `usecase_demo-request-form-builder`、`template_demo-request` source 下的 create/generate/publish/submit 事件；不扩 Solution、新 Post 或 Calendar 同义页面。 |
| `/solutions/course-registration-form-builder` + `/templates/course-registration` | course registration form builder / course registration form template / class registration / training registration | Google US SERP 已研究并经 Codex 数据质量复核；2026-06-28 已部署真实课程报名预览、9 项推荐字段、6 项产品边界 FAQ、FAQPage Schema、Event/QR/Webhook 内链和 `intent=course_registration`。中英文保留页面均为 200，CTA、sitemap 及全站 SEO/Release Gate 通过；尚无上线后 GSC/GA4 数据。 | Ship / 冻结观察 | 冻结至 2026-07-12。观察 Solution 与 Template 的收录、owning query、impressions、CTR、position，以及 `course_registration` 创建事件；不新增 Use Case/Post/pSEO，不承诺支付、名额、邮件、日历或 LMS。 |
| `/templates/community-application` | community application form / community application form template | Google US SERP 已研究并经 Codex 数据质量复核；2026-06-28 已完成 Template-only 收口：补联系方式、人工跟进许可、人工审核边界、可见 FAQ/FAQPage Schema 与 `intent=community_application`。重复 Solution 三条路径均 308 到本地化 Template，且已从 sitemap 移除；尚无上线后 GSC/GA4 数据。 | Ship / 冻结观察 / Template-only | 冻结至 2026-07-12。观察 Template 收录、community application query、CTR、`community_application` 创建事件及旧 URL 信号迁移；不扩 Use Case/Post/Integration/pSEO。 |
| `/posts/typeform-alternatives` | typeform alternatives / Typeform alternative with AI / Typeform alternative with webhooks | GSC 7d：73 展示、0 点击、平均排名 78.11；GSC 28d：378 展示、0 点击；GA4 28d：10 sessions、38 events。2026-06-21 已完成结构改造并部署：title/meta、Quick Answer、顶部 CTA、对比表、workflow handoff、产品事实边界、侧边栏 `typeform_alternative + typeform_style` CTA；Google/Bing URL Inspection 已提交。 | 已执行结构改造，冻结观察 | 2026-06-21 至 2026-07-05 冻结观察。重点看 `typeform alternatives`、`cheaper Typeform alternative`、`Typeform alternative with AI/webhooks` 的 impressions、position 是否改善，以及 `post_typeform-alternatives` 创建事件。 |
| `/posts/google-forms-vs-typeform-vs-genforms-workflow` | Google Forms vs Typeform / workflow comparison | GA4 28d：3 sessions、9 events；GSC 暂无记录 | 内容审计候选 | 有少量访问但 Google 搜索信号不足。审计是否需要更明确的 comparison intent、内部链接和创建入口。 |
| `/posts/feishu-dingtalk-webhook-notification` | Feishu/DingTalk webhook notification | GSC 7d：16 展示、0 点击、平均排名 8.06；GSC 28d：314 展示、0 点击、平均排名约 6-9。2026-06-21 已完成 title/meta/H1/首屏 CTA 小修。 | 已执行 CTR 修复，冻结观察 | 新 title：`Send Form Submissions to Feishu and DingTalk via Webhook`。右侧 CTA 已改为 `intent=webhook_form`，不再指向 event-registration。冻结观察 7 天，重点看 CTR 是否从 0 起量。 |
| `/posts/form-builder-with-webhook` | form builder with webhook | GSC 7d：3 展示、0 点击、平均排名 9；GSC 28d：5 展示、0 点击 | 小样本观察 | 排名不错但展示太少，暂不大改。后续可通过 webhook 主文和 use case 做内部链接补强。 |
| `/use-cases/webhook-form-builder-retry-logs` + Webhook Cluster | webhook form builder / form builder with webhook / send form submissions to webhook | Clarity 已出现 Google 来源访问进入 Webhook 相关页面；GSC 仍需等待回补 | 已执行内链配置小修，冻结观察 | 2026-06-25 已补全 Topic Cluster 配置，让 Webhook Pillar 的 Related guides 优先展示 `send-form-submissions-to-webhook`、`form-builder-with-webhook`、`feishu-dingtalk-webhook-notification`。上线后观察 7 天，不重写冻结页面正文。 |
| Clarity 7 天冷启动样本 | homepage / BetaList / webhook posts / webhook use case / templates | 2026-06-30 审计 41 条录制；外部样本约 20 条。BetaList 有长读但少点击，Google webhook 有 `10vsljc` 01:37/1 click，首页有 `18it1sc` 04:47/0 click，另有多条 1-4 秒 quickback | 继续观察 / 不触发 Build | 报告：`seo_cold_start_session_audit_2026-06-30.md`。没有发现可越过冻结期的物理 Bug；不改冻结页，不建 Slack 独立页；U-061 已完成，优先继续 U-053 公网种子。 |

## 4. 状态定义

### 4.1 观察台账状态

| 状态 | 含义 | 推荐动作 |
|---|---|---|
| 新发布观察 | 页面刚上线或刚提交 URL Inspection，数据不足 | 冻结 7-14 天，记录收录、impressions、query |
| 冻结观察 | 页面刚完成较大改动，避免连续改动干扰判断 | 不改主体内容，只补必要的技术问题 |
| 小样本观察 | 排名或点击样本太少，不能得出稳定结论 | 等样本，优先通过内链增强 |
| 老页面审计候选 | 已有曝光或访问，但不符合当前 SEO-to-creation 标准 | 按 Post 转化规范做内容和 CTA 审计 |
| 高优先级 CTR 候选 | 排名较靠前且有展示，但点击为 0 | 优先检查 title/meta、首屏承诺、SERP 差异化 |
| 执行优化 | 已达到可判断阈值，需要修改 | 建 brief，明确只改哪些变量和观察窗口 |

### 4.2 SOP V2 分区映射

后续每次周复盘，除记录上面的观察台账状态外，还要给重点页面补一个 SOP V2 分区，避免动作混乱。

| SOP V2 分区 | 典型条件 | 对应动作 |
|---|---|---|
| Not Indexed | 未收录、无 impressions、GSC 显示已发现未收录或已抓取未收录 | 查 robots、canonical、sitemap、内链和 URL Inspection，不改正文 |
| Frozen | 新上线、新改造、刚提交 Google/Bing | 5-14 天冻结观察，除非技术 SEO 出错 |
| CTR Rescue | 平均排名 1-10，但 CTR 明显偏低或点击为 0 | 只改 title/meta/SERP 摘要相关元素 |
| Golden Tuning | 平均排名 11-30，有稳定 impressions | 小范围补 FAQ、字段清单、结果感、对比表或内链 |
| Authority Needed | 平均排名 50-80+，有少量 impressions | 先判断意图匹配和内容厚度；合格做内链/外链，不合格重新 Brief |
| Dead Lock | 45 天内两轮优化和内链输血后仍卡在 50 名外 | 停止频繁改正文，转入外链、品牌提及和主题权威沉淀 |

## 5. 决策规则

### 5.1 新页面

- 上线后先冻结 7-14 天。
- 如果 7 天内没有 GSC 数据，不等于失败，先确认是否收录。
- 如果有 impressions 但没有点击，先看排名位置：50 名以后优先增强主题和内链，20 名以内才优先考虑 title/meta。

### 5.2 高排名零点击页面

满足以下条件时进入 title/meta rescue：

- GSC 7d 或 28d 有稳定 impressions。
- 平均排名大致在前 20。
- 点击为 0 或 CTR 明显低于同类页面。
- 页面最近 3-7 天没有刚做过大改。

当前候选：

- `/posts/feishu-dingtalk-webhook-notification`：2026-06-21 已执行第一轮 CTR 修复，进入冻结观察。
- `/posts/form-builder-with-webhook`，但展示量暂时太小，先观察。

### 5.3 低排名有展示页面

如果页面有展示但排名在 50 名以后，不优先做标题党式 CTR 优化。优先处理：

- 页面是否真正匹配搜索意图。
- 是否有足够的教程、对比、字段、示例、FAQ。
- 是否从相关 use case / post / template 建立内链。
- 是否存在更合适的承接页面。

当前候选：

- `/posts/typeform-alternatives`
- `/use-cases/contact-form-builder-for-websites`，但该页是新改造主承接页，先冻结观察。

## 6. 每日观察动作

每天 09:30 的 SEO monitor 应检查：

1. GSC / GA4 快照是否成功写入。
2. 上述目标页面是否新增 impressions、clicks、query。
3. 新上线页面是否开始被 Google 展示。
4. 任何页面是否出现“排名前 20 + 有展示 + 0 点击”的 CTR 修复机会。
5. SEO 页面进入后的产品漏斗：template_use_click、form_generate、form_publish、form_submit。
6. Clarity 是否出现当天 Google 来源会话，尤其是进入 SEO 优化后的页面、Pricing 点击、CTA 尝试、无效点击或反复探索行为。

2026-06-25 补充观察样例：

- GSC 页面数据约滞后 40 小时，但 Clarity 当天已看到 Google 来源访问。
- Clarity 顶级页面显示 `/posts/form-builder-with-webhook` 2 个会话、`/use-cases/webhook-form-builder-retry-logs` 2 个会话、首页 1 个会话。
- 智能事件中出现 `Price` 1 个会话，占 20%，说明至少有一部分搜索进入用户存在价格评估意图。
- 这类信号用于判断页面承接质量和产品漏斗机会，不直接用于替代 GSC 的 query / position / CTR 结论。

## 7. 本轮结论

当前不建议立刻扩大改页面数量。更合理的顺序是：

1. 保持 Contact Form、Webhook、QR、Typeform 新页面冻结观察。
2. 用 Post 审计找出旧内容里最接近“高排名零点击”和“有访问但无创建入口”的页面。
3. `/posts/feishu-dingtalk-webhook-notification` 已完成本轮 CTR 修复；下一轮优先观察它的 CTR，并准备 `/posts/typeform-alternatives` 的结构改造。

## 8. 2026-06-29 Data Readout

- 最新可用 GSC 截止 2026-06-26：7d 654 impressions、1 click、CTR 0.153%、平均排名 46.13；相比 2026-06-21，7d impressions 增长 57.6%，平均排名改善约 5 位。
- 最新可用 GA4 截止 2026-06-27：7d 187 sessions，但包含 Admin、内部和非自然搜索流量，不能作为 SEO sessions 使用。
- `/posts/form-builder-with-webhook` 在 GSC 7d 获得 4 impressions / 1 click / position 6.75；自建 Growth Events 记录到对应 Google 会话约 98 秒，是本轮最明确的“正确搜索意图 + 有效阅读”信号。
- Contact、Typeform、Lead Capture 已被 Google 按预期主题测试，但大部分排名仍在 40-80，当前问题更接近权威度/竞争力不足，而非 Topic 方向错误。
- 2026-06-29 手动补抓 GSC/GA4 时发现 OAuth refresh token `invalid_grant`；六个新快照均失败。正式报告见 `seo_growth_readout_2026-06-29.md`，用户动作登记为 `U-057`。
- 在 U-057 完成前，不使用旧数据判断 2026-06-27/28 新上线页面成败，也不触发页面改动。

## 9. 2026-06-30 WorkBuddy SERP import

- WorkBuddy 输出位置：`ProjectDocs/Operations/gemini_keyword_research_loop/workbuddy_serp_captures/`。
- 18 个 Topic 文件中只有 5 个具备可用截图证据：`google_forms_alternative_with_webhooks`、`tally_alternative`、`user_interview_recruitment_form`、`customer_feedback_form_qr_code`、`event_feedback_survey`；其余 13 个仍为 CAPTCHA blocked，不能用于 Build 决策。
- Codex 复核报告：`workbuddy_serp_topic_loop_review_2026-06-30.md`。
- 本轮不触发新 Build：User Interview 保护现有资产；Event Feedback 使用现有 Template；Customer Feedback QR 作为冻结后支撑证据；Google Forms Webhook 进入 Alternatives/Webhook Backlog；Tally Alternative 继续 Hold。
