# GenForms.ai SEO Core Keyword Observation List

> 创建日期：2026-06-21  
> 用途：固定 GenForms.ai 后续每周观察的核心关键词、目标 URL、当前证据、观察动作和下一次复盘日期。  
> 数据来源：`seo_page_observation_ledger.md`、`seo_mainline_board.md`、已完成 Google SERP 研究与 GSC/GA4 快照。  
> 状态：第一版。后续每周根据 GSC query 级数据补充 7d / 28d impressions、clicks、CTR、average position。

## 1. 为什么需要这张表

我们已经做了 Contact Form、Webhook、Typeform、QR 相关页面和 Post 的优化，但 SEO 结果不是线性确定的。

不能假设：

- 改了 title 就一定增加曝光。
- 加了 CTA 就一定增加点击。
- 提交 URL Inspection 后 Google 一定马上重新分配排名。

应该观察：

1. Google 是否开始把页面展示给目标 query。
2. 目标 query 是否越来越贴近我们的搜索意图。
3. 平均排名是否从 50-80 名区间向 20-50 名区间移动。
4. 排名前 20 后 CTR 是否出现。
5. 点击进来后是否触发 `forms_new_view`、`template_context_loaded`、`ai_generate_submitted`、`workspace_preview_ready`、`form_publish` 等产品事件。

因此，这张表的目的不是“证明我们一定会涨”，而是让我们能科学判断：

- 哪些改变正在被 Google 理解。
- 哪些页面只是被展示但没有点击。
- 哪些页面有点击但产品承接不足。
- 哪些关键词需要新 SERP 研究。
- 哪些页面必须继续冻结，不能凭感觉反复改。

## 2. 观察节奏

| 节奏 | 动作 | 输出 |
|---|---|---|
| 每天 | 检查 GSC/GA4 快照是否成功；查看新上线页面是否开始有 impressions/clicks | 异常只记录，不轻易改页面 |
| 每周 | 更新核心关键词 7d / 28d 数据；看排名、CTR、query 是否变化 | 每周 SEO 判断 |
| 每 14 天 | 对冻结观察页面做一次阶段判断 | 继续观察 / 小修 / 新 Brief |
| 每 30 天 | 判断是否需要进入下一批关键词研究或页面改造 | 下一轮 SEO 主线计划 |

## 3. 结果判断规则

### 3.1 曝光量是否可能增加

曝光量增加通常来自：

- Google 重新理解页面主题。
- 页面覆盖的 query 变多。
- 平均排名上升，进入更多可展示位置。
- 内链增强让 Google 更明确主题集群。
- 页面解决的搜索意图更清楚。

对我们来说，未来 7-14 天最重要的不是马上有很多点击，而是：

- 新页面是否开始出现 impressions。
- 老页面改造后 query 是否更贴近目标。
- Typeform 页面是否从泛 `typeform free alternatives` 逐步靠近 `Typeform alternative with AI/webhooks`。

### 3.2 点击量是否可能增加

点击量增加通常要晚于曝光量。

如果页面平均排名还在 50 名以后，0 点击很正常，不应该先怪 title。

优先级：

1. 排名 50 名以后：先看内容相关性、内链、主题权重。
2. 排名 20-50：看 title/meta 是否更贴合搜索意图。
3. 排名前 20 且有展示但 0 点击：进入 CTR rescue。
4. 有点击但无创建：交给产品路径和 CTA 承接分析。

## 4. 核心关键词观察清单

字段说明：

- `Target URL` 是当前建议承接页，不代表未来不能调整。
- `Current baseline` 先使用页面级数据；query 级数据等下一次 GSC 快照补齐。
- `Action` 必须具体，避免“继续优化”这种空话。

| Priority | Keyword | Cluster | Search Intent | Target URL | Current baseline | Current action | Next review |
|---|---|---|---|---|---|---|---|
| P0 | `contact form builder` | Contact Form | 立即创建网站联系表单 | `/use-cases/contact-form-builder-for-websites` | 页面级 GSC 7d：106 impressions、0 clicks、avg pos 58.90；28d：234 impressions | 冻结观察；看 query 是否集中到 contact form / website form | 2026-06-28 |
| P0 | `contact form generator` | Contact Form | 生成联系表单 | `/use-cases/contact-form-builder-for-websites` | 已完成 Google US SERP 研究；query 级待填 | 冻结观察；不单独开页 | 2026-06-28 |
| P0 | `website contact form` | Contact Form | 网站联系入口 / 轻教程 / 模板 | `/use-cases/contact-form-builder-for-websites` | 已完成 Google US SERP 研究；query 级待填 | 看是否需要通过 `/templates/contact-us` 补模板入口 | 2026-06-28 |
| P1 | `free contact form builder` | Contact Form | 免费联系表单工具 | `/use-cases/contact-form-builder-for-websites` | query 级待填 | 只辅助覆盖，不承诺 unlimited free | 2026-07-05 |
| P1 | `contact form builder with webhook` | Contact + Webhook | 联系表单 + 技术后续流转 | `/use-cases/webhook-form-builder-retry-logs` | 研究结论：更适合 Webhook 页承接 | Contact 页只内链，不抢主意图 | 2026-07-05 |
| P0 | `form builder with webhook` | Webhook | 找支持 webhook 的表单工具 | `/use-cases/webhook-form-builder-retry-logs` | `/posts/form-builder-with-webhook` GSC 7d：3 impressions、0 clicks、avg pos 9；Use Case 28d：2 impressions、avg pos 1.50 | 小样本观察；增强内链，不改 title | 2026-06-28 |
| P0 | `webhook form builder` | Webhook | 表单工具 + webhook 能力 | `/use-cases/webhook-form-builder-retry-logs` | query 级待填；页面样本少 | 继续用 Webhook 教程和 Feishu/DingTalk Post 支撑 | 2026-06-28 |
| P1 | `send form submissions to webhook` | Webhook | 教程型，想把提交发到 endpoint | `/posts/send-form-submissions-to-webhook` | 新发布观察，GSC/GA4 暂无快照记录 | 等收录和首批 impressions，不改正文 | 2026-06-28 |
| P1 | `form webhook` | Webhook | 开发者/配置型 | `/posts/send-form-submissions-to-webhook` 或 `/use-cases/webhook-form-builder-retry-logs` | query 级待填 | 观察 Google 把它分给教程页还是 Use Case 页 | 2026-07-05 |
| P0 | `Typeform alternatives` | Typeform | 泛替代品比较 | `/posts/typeform-alternatives` | GSC 7d：73 impressions、0 clicks、avg pos 78.11；28d：378 impressions | 已改造并提交 URL Inspection；冻结到 2026-07-05 | 2026-06-28 |
| P0 | `Typeform alternative` | Typeform | 替代工具评估 | `/posts/typeform-alternatives` | 同上，query 级待填 | 看排名是否从 78 附近上移 | 2026-06-28 |
| P0 | `cheaper Typeform alternative` | Typeform | 价格敏感、高购买意图 | `/posts/cheaper-ai-typeform-alternative` | 新发布观察，GSC/GA4 暂无快照记录 | 冻结观察，不和 `/posts/typeform-alternatives` 抢泛词 | 2026-06-28 |
| P0 | `Typeform alternative with AI` | Typeform | AI 功能导向替代 | `/posts/typeform-alternatives` + `/posts/cheaper-ai-typeform-alternative` | query 级待填；竞争强 | 观察是否出现 AI 相关 query；暂不单独开页 | 2026-07-05 |
| P0 | `Typeform alternative with webhooks` | Typeform + Webhook | 替代 Typeform 并重视自动化 | `/use-cases/typeform-alternative-webhooks` | Use Case GSC 7d：1 impression、avg pos 28；28d：3 impressions | 依赖 Typeform Post 内链带动，继续冻结 | 2026-06-28 |
| P1 | `Typeform alternative for startups` | Typeform | 初创团队找低摩擦替代 | `/posts/cheaper-ai-typeform-alternative` | query 级待填 | 并入 cheaper/AI 文章观察，不单独开页 | 2026-07-05 |
| P1 | `Google Forms alternative` | Google Forms | 从基础表单升级 | `/use-cases/google-forms-alternative-ai` 或 `/posts/google-forms-vs-typeform-vs-genforms-workflow` | 老 Post GA4 28d：3 sessions、9 events；GSC 暂无记录 | 暂不优先；等 Typeform/Webhook 集群数据 | 2026-07-05 |
| P2 | `google forms alternative with webhooks` | Google Forms + Webhook | 替代 Google Forms 且需要 webhook | 待定 | 尚未完成 Google SERP 级判断 | 暂缓；进入 Research，不写页面 | 2026-07-12 |
| P1 | `QR code form builder` | QR Code | 创建二维码表单 | `/use-cases/qr-code-form-builder` | GSC 7d：9 impressions、0 clicks、avg pos 22.22；28d：42 impressions | 有可见区信号；优先内链增强，不改 title | 2026-06-28 |
| P1 | `QR code form` | QR Code | 二维码收集表单 | `/use-cases/qr-code-form-builder` | query 级待填 | 观察是否进入 20 名以内；有展示无点击再调 meta | 2026-07-05 |
| P0 | `event registration form builder` | Event Registration / QR Event | 创建活动报名表，发布链接/二维码，收集报名名单 | `/use-cases/event-registration-form-builder` | 2026-06-26 新上线，GSC/GA4 待回补 | 冻结观察；不承诺票务、支付、座位、签到核销 | 2026-07-10 |
| P0 | `event signup form` | Event Registration / QR Event | 轻量活动报名/确认参加 | `/use-cases/event-registration-form-builder` | 已完成 Google US SERP + 产品承接复核；query 级待填 | 并入 Event Pillar，不单独开页 | 2026-07-10 |
| P0 | `RSVP form` | Event Registration / QR Event | 收集是否参加、人数、偏好 | `/use-cases/event-registration-form-builder` 或后续 `/templates/event-registration` | 新上线观察 | 观察是否需要后续独立 RSVP template 支撑页 | 2026-07-10 |
| P1 | `workshop registration form` | Event Registration / QR Event | 小型课程/Workshop 报名 | `/use-cases/event-registration-form-builder` 或后续 `/templates/workshop-registration-form` | 新上线观察 | 先看 Pillar 是否拿到 workshop query，再决定是否扩模板页 | 2026-07-10 |
| P1 | `webinar registration form` | Event Registration / QR Event | Webinar 报名和名单收集 | `/use-cases/event-registration-form-builder` 或后续 `/templates/webinar-registration-form` | 新上线观察 | 先观察，不承诺邮件确认、日程系统或 CRM 同步 | 2026-07-10 |
| P0 | `lead capture form builder` | Lead Capture | 立即创建线索收集表单 | `/use-cases/ai-lead-capture-form-builder` | Google US SERP 已确认产品/工具意图；Pillar GSC 7d：26 impressions、0 clicks、avg pos 49.3 | 接入两篇支撑 Post 与 `lead_capture` CTA；不重写 Pillar | 2026-07-11 |
| P1 | `lead capture form template` | Lead Capture | 想拿线索收集模板 | `/templates/lead-capture` | Google US SERP 已确认模板意图；GSC 7d：14 impressions、0 clicks、avg pos 80.1；query `lead capture templates` 已出现 | 先接受 Topic Cluster 内链；稳定 query 后再开 Template 优化 Goal | 2026-07-11 |
| P1 | `AI lead capture form` / `lead form ai` | Lead Capture | AI 生成线索表单 | `/use-cases/ai-lead-capture-form-builder` | `lead form ai` GSC 7d：10 impressions、0 clicks、avg pos 18.8；当前缺少 query+page 组合维度 | 作为 Golden Tuning 候选观察；先确认目标 URL 归属，不先改 title/meta | 2026-07-05 |
| P1 | `waitlist form builder` | Waitlist / Lead Capture | 创建产品预发布候补表单 | `/use-cases/waitlist-form-builder-indie-hackers` | Google US SERP 已验证；Use Case GSC 28d：36 impressions、0 clicks、avg pos 25 | 进入 Architect；不新建 URL，不承诺 referral/ranking/email campaign | 2026-07-11 |
| P0 | `waitlist form template` | Waitlist / Lead Capture | 直接使用候补名单模板 | `/templates/waitlist` | SERP 以模板页为主；Template GSC 28d：8 impressions、avg pos 71.1 | 通过 Sub-Pillar/Post 内链增强，暂不改 title/meta | 2026-07-11 |
| P1 | `AI waitlist form builder` | Waitlist / Lead Capture | 用 AI 生成 pre-launch signup form | `/use-cases/waitlist-form-builder-indie-hackers` | Google US SERP 以 AI form product + waitlist software 混合；暂无 GSC exact query | 并入现有 Use Case；只承诺 AI 建表与分享/收集 | 2026-07-11 |
| P2 | `AI form builder` | Category | 泛品类大词 | 首页 / `/use-cases` / 资源页 | 全站 28d：1,667 impressions、4 clicks；query 级待填 | 不直接硬打；只作为长期观察词 | 2026-07-05 |
| P2 | `online form builder` | Category | 泛表单工具 | 首页 / 模板页 | query 级待填 | 低优先级，只观察不主动改页面 | 2026-07-12 |
| P2 | `NPS survey maker` | Template / Survey | 调查模板/工具 | 待定模板或后续 Post | 历史 GSC 曾有相关信号；当前未进入主线 | 放入观察，不进入本轮实现 | 2026-07-12 |

## 5. 页面与关键词分工

### 5.1 Typeform 集群

| 页面 | 角色 | 不做什么 |
|---|---|---|
| `/posts/typeform-alternatives` | 广义比较 hub，承接 Typeform alternatives / AI / workflow | 不承诺 100% 替代 Typeform，不写最便宜 |
| `/posts/cheaper-ai-typeform-alternative` | 价格 + AI + webhook 商业意图 | 不再拆 `Typeform alternative with AI` 独立页 |
| `/use-cases/typeform-alternative-webhooks` | 产品承接页，负责创建路径 | 不写成长篇比较博客 |

### 5.2 Contact Form 集群

| 页面 | 角色 | 不做什么 |
|---|---|---|
| `/use-cases/contact-form-builder-for-websites` | 主承接页，满足“马上创建网站联系表单” | 不承诺 iframe embed、生产级邮件通知、spam protection |
| `/templates/contact-us` | 模板入口 | 不替代主承接页 |
| `/use-cases/webhook-form-builder-retry-logs` | contact form with webhook 的技术承接 | 不让 Contact 页硬抢技术词 |

### 5.3 Webhook 集群

| 页面 | 角色 | 不做什么 |
|---|---|---|
| `/use-cases/webhook-form-builder-retry-logs` | 主产品承接页 | 不写成纯教程 |
| `/posts/send-form-submissions-to-webhook` | 教程支撑页 | 不抢 webhook product 主词 |
| `/posts/feishu-dingtalk-webhook-notification` | 集成通知支撑页 | 不承诺原生 Feishu/DingTalk 深集成，只写 webhook/bot 路径 |

### 5.4 Lead Capture 集群

| 页面 | 角色 | 不做什么 |
|---|---|---|
| `/use-cases/ai-lead-capture-form-builder` | Pillar，承接 lead capture form builder / AI lead capture form builder | 不承诺 CRM 原生同步、AI SDR、spam protection |
| `/templates/lead-capture` | 模板意图入口 | 不替代 Pillar，不单独抢泛 builder 词 |
| `/solutions/saas-lead-capture-form-builder` | SaaS 场景与工作流承接 | 不扩成泛 lead generation 平台 |
| `/posts/ai-lead-capture-form-builder-saas` | AI 生成与适用边界教育页 | 已有前 10 小样本，不改 title/meta/正文 |
| `/posts/saas-lead-capture-form` | 字段、资格判断和跟进工作流指南 | 已有前 10 小样本，不改 title/meta/正文 |

## 6. 下一轮数据回填字段

每周复盘时，为上表补充这些字段：

| Field | Meaning |
|---|---|
| `gsc_7d_impressions` | 近 7 天展示 |
| `gsc_7d_clicks` | 近 7 天点击 |
| `gsc_7d_ctr` | 近 7 天 CTR |
| `gsc_7d_avg_position` | 近 7 天平均排名 |
| `gsc_28d_impressions` | 近 28 天展示 |
| `gsc_28d_clicks` | 近 28 天点击 |
| `gsc_28d_avg_position` | 近 28 天平均排名 |
| `target_url` | 当前承接 URL |
| `decision` | observe / title-meta-rescue / content-brief / serp-research / no-action |
| `next_review_date` | 下一次复盘日期 |

## 7. 当前判断

目前我们做过的 SEO 改造不保证一定立刻带来曝光和点击，但方向是合理的：

- Contact Form 页面解决的是 Google 已确认的“马上创建网站联系表单”意图。
- Webhook 页面和 Post 解决的是工具 + 教程 + 排错意图。
- Typeform 老 Post 改造解决的是已有展示但排名低、内容结构泛的问题。
- QR 页面已有 20-30 名区间信号，值得继续观察。

短期判断标准：

- 2026-06-28：看是否有新增 impressions 和目标 query。
- 2026-07-05：看 Typeform / Contact / Webhook 的冻结观察结果，决定是否做第二轮小修。
- 2026-07-12：再决定是否启动 `google forms alternative with webhooks` 或 `lead capture form template` 的下一轮 SERP 研究。
