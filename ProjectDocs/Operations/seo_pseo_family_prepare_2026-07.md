# GenForms pSEO Family Prepare Review — 2026-07

> 预审日期：2026-07-03
> 数据截止：GSC 2026-07-01
> 状态：Architecture Prepare only；Publish Gate closed
> 对象：Event/QR、Lead Capture、Waitlist

## 1. 预审结论

| Family | 3-asset signal | Product truth | Intent separation | Prepare 结论 | Publish 结论 |
|---|---|---|---|---|---|
| Event / QR | Pass：QR Pillar、Event Template、Event+QR Solution 均有 query-page 证据 | Pass：真实 Event Template、链接/二维码、单题流、Dashboard/CSV/Webhook | Conditional：scan-to-fill 与 ticket/check-in 必须进一步拆清 | **Conditional Pass #1** | Closed；等待 JUL-R01 与 07-13 Review |
| Lead Capture | Pass：Pillar、Template、SaaS Solution 均有 query-page 证据 | Pass：真实 Lead Template、AI 字段、单题流、Dashboard/CSV/Webhook | Conditional：AI form 与 AI SDR/lead scoring 容易混意图 | **Conditional Pass #2** | Closed；等待 JUL-R02、冻结到期和 Ownership Review |
| Waitlist | Partial：Use Case、Template 有 query-page 证据；Post 只有 page-level 曝光，query 被隐私阈值隐藏 | Pass：真实 Waitlist Template、链接/QR、Dashboard/CSV/Webhook | Conditional：容易与 Lead Capture、newsletter、referral waitlist 重叠 | **Hold** | Closed；至少补足第三个 query-proven asset |

当前不能选择最终 Pilot Family。07-13 Portfolio Review 只能在 Event/QR 与 Lead 中选一个；若 Gemini SERP、query ownership 或产品差异不通过，则两者也必须 Hold。

2026-07-03 JUL-R01 Codex update：Google US capture 已确认 Event/QR 是 scan-to-fill、RSVP、generic event QR 与 ticket/check-in 的混合意图。Event/QR 仍为 Conditional Pass，但任何 Pilot 候选必须排除 ticket/check-in/unique QR，并由独立 task 与字段差异证明，不得把 `event QR` 当作统一可扩词根。

## 2. 证据口径

本预审使用：

- 生产 `growth_metric_snapshots` 最新成功 GSC 7d/28d page 数据。
- GSC Search Analytics 只读 `page -> query` 查询，窗口 2026-06-04 至 2026-07-01。
- 当前代码中的真实 Template、字段、Prompt、Use Case 和 Solution 定义。

限制：

- GSC query 受隐私阈值影响；没有 query row 不等于没有展示。
- Page impression 只证明 URL 被展示，不能单独证明展示来自目标 query。
- Prepare Gate 只允许设计 Pilot 数据结构，不代表 Google SERP 已证明应该批量建页。

## 3. Event / QR Family

### 3.1 当前资产与信号

| Asset | 28d page data | 可见 query-page 证据 | 判断 |
|---|---:|---|---|
| `/use-cases/qr-code-form-builder` | 53 impressions / pos 38.2 | `qr form submit` 16 / pos 30.7；另有 `form creator with qr code` | QR scan-to-fill 信号成立 |
| `/templates/event-registration` | 17 / pos 46.8 | `ai onsite event registration`、`free event registration form` 等合计至少 7 impressions | Template intent 成立但排名弱 |
| `/solutions/event-registration-form-with-qr-code` | 4 / pos 67 | `event registration qr code`、`qr code event registration` 各 1 impression | Event+QR 组合被测试 |
| `/use-cases/event-registration-form-builder` | 最新窗口未出现 | query row 为空 | 新 owner 尚未获得可用证据 |

历史旧 URL `/use-cases/ai-event-registration-form-builder` 在 28d 中有 1 click / 1 impression，已重定向；该点击不能作为新 owner 的规模证据。

### 3.2 产品事实

真实 Template：`event-registration`。

- 6 个中英文字段：attendee name、contact、company、role、attendance preference、dietary/accessibility needs。
- 真实 Prompt：private workshop RSVP、attendance preference 等变体。
- 可承接：报名、RSVP、workshop、webinar、公开链接、QR scan-to-fill、移动端、Dashboard、CSV、Webhook-ready。
- 不承接：ticket sales、payment、seat inventory、unique ticket QR、check-in scanning、badge、calendar invitation。

### 3.3 允许研究的差异轴

只有出现独立 SERP 意图和独立字段/流程时才可进入 Pilot：

- Workshop registration：session/topic、capacity note、dietary/accessibility。
- Webinar registration：online attendance、role、questions for host；不承诺 calendar/email reminders。
- Meetup/Community event RSVP：attendance preference、guest count、community context。
- QR event registration：仅限 scan-to-fill；不写 ticket/check-in QR。

这些只是 manifest 候选轴，不是已批准 URL。若页面只是替换 event type 名称，必须 Reject。

## 4. Lead Capture Family

### 4.1 当前资产与信号

| Asset | 28d page data | 可见 query-page 证据 | 判断 |
|---|---:|---|---|
| `/use-cases/ai-lead-capture-form-builder` | 117 impressions / pos 50.1 | `lead form ai` 53 / pos 21.3；`lead capture form builder` 等 | 最强 query signal；现有 Pillar owner |
| `/templates/lead-capture` | 51 / pos 77.1 | `lead capture form template`、`lead capture templates`、`lead forms template` 等 | Template intent 清楚 |
| `/solutions/saas-lead-capture-form-builder` | 16 / pos 76.7 | `lead capture form builder`、`lead generation form builder` 等 | SaaS Solution 被测试但权威弱 |
| 两篇 Lead Posts | 8 / 4 impressions，pos 6.25 / 3.25 | page-filtered query 受隐私阈值隐藏 | 小样本支持，不作为第三资产 Gate 的必要证据 |

### 4.2 产品事实

真实 Template：`lead-capture`。

- 6 个中英文字段：name、company/project、contact、interest、budget/timeline、notes。
- 真实 Prompt：SaaS early access、company size、enterprise sales qualification。
- 可承接：AI draft、qualification fields、单题流、链接/QR、Dashboard、CSV、Webhook-ready handoff。
- 不承接：AI SDR、lead enrichment、自动评分、CRM 原生同步、自动邮件跟进、spam protection。

### 4.3 允许研究的差异轴

- SaaS lead qualification：company size、use case、budget、timeline。
- Agency/project lead intake：service need、project scope、budget、timeline。
- Event/booth lead capture：contact、company、interest、follow-up consent、QR entry。

Pilot 候选必须与现有 Pillar、Template、SaaS Solution 分工清楚。若 query 只是 `lead form builder` 的同义改写，必须 Merge，不得新增 URL。

## 5. Waitlist Family

### 5.1 当前资产与信号

| Asset | 28d page data | 可见 query-page 证据 | 判断 |
|---|---:|---|---|
| `/use-cases/waitlist-form-builder-indie-hackers` | 43 impressions / pos 25.2 | `create waitlist` pos 12；另有 waitlist builder/creator/maker | Use Case intent 成立 |
| `/templates/waitlist` | 19 / pos 65.6 | waitlist creator/form/maker/template 等 | Template intent 成立 |
| `/posts/waitlist-form-demand-validation` | 30 / pos 9 | page-filtered query 为空 | 有 page signal，但 query ownership 未证明 |

### 5.2 产品事实

真实 Template：`waitlist`。

- 5 个中英文字段：name、email、role、pain point、invite preference。
- 真实 Prompt：AI SaaS pre-launch waitlist、referrer source。
- 可承接：早期用户收集、需求验证、链接/QR、Dashboard、CSV、Webhook-ready。
- 不承接：referral leaderboard、position/rank、invite codes、viral rewards、自动邮件 campaign。

### 5.3 Hold 原因

- 只有 2 个资产可直接证明 target query ownership。
- Post 的高排名 page signal 可能来自低量或非核心 query，不能假定。
- 与 Lead Capture、newsletter signup 的边界仍需 SERP 和 query-page 证据。

## 6. 07-13 Selection Gate

每个候选 Family 按以下顺序审查：

1. **SERP Gate**：真实 Google 结果需要 template / scenario / product page，而非纯教程或更宽平台能力。
2. **Three-asset Gate**：至少 3 个现有资产有相关 query-page impressions；隐私阈值缺失时降为 Partial。
3. **Product Gate**：每个候选页能映射到当前真实能力与 Template schema。
4. **Difference Gate**：每页至少有独立任务、独立字段组合、独立 Prompt、独立 workflow/限制，不是关键词替换。
5. **Ownership Gate**：不抢现有 Pillar、Template、Solution、Post 的主 query。
6. **Activation Gate**：CTA 必须进入真实 create -> generate -> publish -> submit 路径，并能区分 source/intent/template。

选择结果只能是：

- `Select one Family for 5-10 page Pilot Brief`
- `Hold all Families`

不得同时启动两个 Family。
