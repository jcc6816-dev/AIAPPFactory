# GenForms.ai SEO Topic Cluster Map

> 创建日期：2026-06-25
> 用途：把 GenForms.ai 当前 SEO 资产按 Topic Cluster / 内容茧房组织起来，明确每个 Pillar Page、Cluster Page、内链动作、缺口和下一步优先级。
> 依据：`seo_growth_sop_v2.md`、`seo_topic_universe.md`、`seo_mainline_board.md`、`seo_core_keyword_observation_list.md`、`seo_page_observation_ledger.md`、`seo_post_conversion_audit_2026-06-21.md`。

## 1. 为什么需要这张图

之前我们的 SEO 工作已经完成了关键词研究、SERP 研究、Use Case 页面、Post 改造和 GSC/GA4 观察，但仍然容易出现一个问题：

> 页面是一个个做的，Google 未必能立刻理解它们属于同一个主题权威体系。

Topic Cluster 的目的不是马上新增很多内容，而是先把已有内容变成向心结构：

```text
Cluster Page / 支撑文章 / 模板页
  -> 链接到对应 Pillar Page
  -> Pillar Page 获得更清晰的主题信号
  -> 同一主题下多个页面一起提高搜索理解和排名机会
```

执行原则：

- 先整理已有资产，再决定是否新增页面。
- 每个 Cluster Page 必须有自然内链指向对应 Pillar Page。
- Pillar Page 只反向链接到最有帮助的 2-4 个支撑资产。
- CTA 必须进入正确的 `intent`、`template`、`mode` 或 `prompt`，不能为了 SEO 牺牲产品承接。
- 每次只改一组主题集群的内链，改完进入观察窗口。
- 新主题先进入 `seo_topic_universe.md`，只有通过 SERP、GSC 和产品承接判断后，才升级为本文件中的正式 Topic Cluster。

## 2. 当前四大主题集群总览

| Cluster | Pillar Page | 当前状态 | 近期目标 | 本轮优先级 |
|---|---|---|---|---|
| Contact Form | `/use-cases/contact-form-builder-for-websites` | 主页面已上线并提交 Google/Bing，处于冻结观察 | 明确 contact-us 模板、website contact form、contact form with webhook 的分工 | P0 |
| Webhook Form | `/use-cases/webhook-form-builder-retry-logs` | 已有多个支撑 Post，且 Clarity 已出现 Google 来源访问 | 统一支撑文章到 Webhook Pillar 的内链和 CTA intent | P0 |
| Typeform Alternative | `/posts/typeform-alternatives` + `/use-cases/typeform-alternative-webhooks` | 老 Post 已结构改造并冻结观察，是商业意图收割层 | 保护当前改造，梳理 Alternatives 内链，不继续大改正文 | P1 |
| QR Code Form | `/use-cases/qr-code-form-builder` | 已有 GSC 20-30 名区间信号 | 补模板/场景支撑和自然内链，观察是否进入 Golden Tuning | P1 |

## 3. Contact Form Cluster

### 3.1 主题定位

搜索用户主任务：

- 立即创建一个可用于网站的联系表单。
- 知道字段应该怎么设计。
- 知道如何作为网站联系入口使用。
- 知道提交后在哪里查看回复、导出数据或进入 Webhook 后续流程。

Pillar Page：

- `/use-cases/contact-form-builder-for-websites`

主要关键词：

- `contact form builder`
- `contact form generator`
- `website contact form`
- `free contact form builder`

### 3.2 已有资产

| 资产 | 角色 | 当前判断 |
|---|---|---|
| `/use-cases/contact-form-builder-for-websites` | Pillar Page | 已按 Google US SERP 和产品事实边界上线，当前冻结观察 |
| `/templates/contact-us` | Template / 创建入口 | 应作为 Contact Form Pillar 的模板承接，不替代 Pillar |
| Contact Form SERP 研究文档 | 研究资产 | 已确认主意图是“马上做一个网站联系表单”，不是泛 CRM nurturing |
| `/use-cases/webhook-form-builder-retry-logs` | 技术分流页 | 承接 `contact form builder with webhook`，Contact Pillar 不硬抢技术词 |

### 3.3 内链动作

| From | To | 建议锚文本 | 动作类型 | 优先级 |
|---|---|---|---|---|
| `/templates/contact-us` | `/use-cases/contact-form-builder-for-websites` | `website contact form builder` / `AI contact form builder` | 模板页补 Pillar 内链 | P0 |
| `/use-cases/contact-form-builder-for-websites` | `/templates/contact-us` | `contact us form template` | Pillar 指向创建模板 | P0 |
| `/use-cases/contact-form-builder-for-websites` | `/use-cases/webhook-form-builder-retry-logs` | `contact form with webhook and retry logs` | 技术意图分流 | P1 |
| 后续 contact form 教程/FAQ | `/use-cases/contact-form-builder-for-websites` | `create a website contact form` | 新 Cluster 回链 | P1 |

### 3.4 缺口

当前不急着新建页面，但后续可能需要：

1. `How to create a contact form for a website` 教程型 Cluster Page。
2. `Contact form fields checklist` 字段清单型 Cluster Page。
3. `Contact form with webhook` 继续由 Webhook Cluster 承接，不在 Contact Pillar 内展开太深。

### 3.5 当前动作

- 不改 Contact Pillar 主体内容。
- 先检查 `/templates/contact-us` 是否能自然链接回 Contact Pillar。
- 等 GSC 回补后判断 `/use-cases/contact-form-builder-for-websites` 是 Frozen、Authority Needed 还是 Golden Tuning。

## 4. Webhook Form Cluster

### 4.1 主题定位

搜索用户主任务：

- 找一个支持 Webhook 的表单工具。
- 学会把 form submissions 发到 webhook endpoint。
- 看到 payload、delivery status、retry log 和 failure reason。
- 把提交继续推送到 Feishu、DingTalk、WeCom、Slack Bot 等后续流程。

Pillar Page：

- `/use-cases/webhook-form-builder-retry-logs`

主要关键词：

- `form builder with webhook`
- `webhook form builder`
- `send form submissions to webhook`
- `form webhook`
- `contact form builder with webhook`

### 4.2 已有资产

| 资产 | 角色 | 当前判断 |
|---|---|---|
| `/use-cases/webhook-form-builder-retry-logs` | Pillar Page | Webhook 产品承接页，当前应作为主题中心 |
| `/posts/send-form-submissions-to-webhook` | 教程 Cluster | 高意图教程页，应该回链 Pillar，并保持 webhook intent CTA |
| `/posts/form-builder-with-webhook` | 支撑 Post | GSC 小样本排名好但展示少，应补内链而非大改 |
| `/posts/feishu-dingtalk-webhook-notification` | 集成通知 Cluster | 已做 CTR 修复，冻结观察；应回链 Webhook Pillar |
| `/use-cases/typeform-alternative-webhooks` | 交叉集群页 | 属于 Typeform + Webhook 交叉意图，链接应谨慎自然 |

### 4.3 内链动作

| From | To | 建议锚文本 | 动作类型 | 优先级 |
|---|---|---|---|---|
| `/posts/send-form-submissions-to-webhook` | `/use-cases/webhook-form-builder-retry-logs` | `webhook form builder with retry logs` | 教程回链 Pillar | P0 |
| `/posts/form-builder-with-webhook` | `/use-cases/webhook-form-builder-retry-logs` | `form builder with webhook logs and retries` | 支撑 Post 回链 Pillar | P0 |
| `/posts/feishu-dingtalk-webhook-notification` | `/use-cases/webhook-form-builder-retry-logs` | `webhook form builder for notifications` | 集成文章回链 Pillar | P0 |
| `/use-cases/webhook-form-builder-retry-logs` | `/posts/send-form-submissions-to-webhook` | `send form submissions to a webhook` | Pillar 指向教程 | P1 |
| `/use-cases/webhook-form-builder-retry-logs` | `/posts/feishu-dingtalk-webhook-notification` | `send submissions to Feishu and DingTalk` | Pillar 指向集成说明 | P1 |

### 4.4 缺口

优先不新建，先补内链。如果 GSC 后续出现更多 query，可评估：

1. `Webhook delivery logs explained`。
2. `Webhook retry best practices for forms`。
3. `Form webhook payload examples`。

### 4.5 当前动作

- 第一批内链动作优先从 Webhook Cluster 开始，因为 Clarity 已经看到 Google 来源访问进入 Webhook 相关页面。
- 2026-06-25 已补全代码层 Topic Cluster 配置：Webhook Pillar 的 Related guides 优先展示 `/posts/send-form-submissions-to-webhook`、`/posts/form-builder-with-webhook`、`/posts/feishu-dingtalk-webhook-notification`。
- 只补链接和 CTA 一致性，不重写正文。
- 补完后冻结 7 天，观察 Pillar 和 Cluster 的 GSC impressions、Clarity Google sessions 和 `intent=webhook_form` 创建事件。

## 5. Typeform Alternative Cluster

### 5.1 主题定位

搜索用户主任务：

- 寻找 Typeform 替代品。
- 比较价格、免费额度、单题流体验、AI 能力和 Webhook 自动化。
- 判断 GenForms 是否适合替代 Typeform 的某一类场景，而不是 100% 替代 Typeform。

核心页面：

- `/posts/typeform-alternatives`：商业意图比较 Hub。
- `/use-cases/typeform-alternative-webhooks`：产品承接页。

主要关键词：

- `Typeform alternatives`
- `Typeform alternative`
- `cheaper Typeform alternative`
- `Typeform alternative with AI`
- `Typeform alternative with webhooks`

### 5.2 已有资产

| 资产 | 角色 | 当前判断 |
|---|---|---|
| `/posts/typeform-alternatives` | Alternatives Hub | 已结构改造并提交 Google/Bing，冻结观察到 2026-07-05 |
| `/use-cases/typeform-alternative-webhooks` | Product Pillar / 承接页 | 承接 Typeform-style + webhook-ready 创建路径 |
| `/posts/cheaper-ai-typeform-alternative` | 商业意图 Cluster | 承接 cheaper / AI / pricing 细分意图 |
| `/posts/google-forms-vs-typeform-vs-genforms-workflow` | 辅助比较 Cluster | 当前 GSC 弱，先作为辅助链接，不优先大改 |

### 5.3 内链动作

| From | To | 建议锚文本 | 动作类型 | 优先级 |
|---|---|---|---|---|
| `/posts/typeform-alternatives` | `/use-cases/typeform-alternative-webhooks` | `Typeform alternative with webhooks` | Hub 指向产品承接 | 已完成/待核查 |
| `/posts/cheaper-ai-typeform-alternative` | `/posts/typeform-alternatives` | `Typeform alternatives` | 细分商业意图回到 Hub | P1 |
| `/posts/cheaper-ai-typeform-alternative` | `/use-cases/typeform-alternative-webhooks` | `AI Typeform alternative with webhook-ready forms` | 细分文章指向承接 | P1 |
| `/posts/google-forms-vs-typeform-vs-genforms-workflow` | `/posts/typeform-alternatives` | `Typeform alternatives` | 辅助比较页回链 Hub | P2 |
| `/use-cases/typeform-alternative-webhooks` | `/posts/typeform-alternatives` | `compare Typeform alternatives` | 产品页给比较入口 | P2 |

### 5.4 缺口

短期不建议继续新增 Typeform 页面。原因：

- `/posts/typeform-alternatives` 刚改造，仍在冻结观察。
- 该集群竞争强，短期更依赖外链、内链和主题权威，而不是继续拆新页。
- 如果后续 `cheaper` 或 `AI` query 明显增长，再决定是否加强对应 Cluster。

### 5.5 当前动作

- 不继续改 `/posts/typeform-alternatives` 正文。
- 核查现有内链是否真实存在，避免 Hub 和 Product Pillar 断开。
- 如果 2026-07-05 后仍排名 70+，优先做外链和相关内容簇提权，而不是继续大改正文。

## 6. QR Code Form Cluster

### 6.1 主题定位

搜索用户主任务：

- 创建一个带二维码分享入口的表单。
- 用于线下活动、签到、报名、门店反馈、现场收集。
- 在手机上扫码填写，并能查看提交数据。

Pillar Page：

- `/use-cases/qr-code-form-builder`

主要关键词：

- `QR code form builder`
- `QR code form`
- `QR form`

### 6.2 已有资产

| 资产 | 角色 | 当前判断 |
|---|---|---|
| `/use-cases/qr-code-form-builder` | Pillar Page | 已有 GSC 20-30 名区间信号，适合优先内链增强 |
| `/solutions/event-registration-form-with-qr-code` | 场景支撑页 | 可作为活动报名/线下场景支撑 |
| Event registration 模板 | Template / 创建入口 | 可作为 QR form 的产品承接 |

### 6.3 内链动作

| From | To | 建议锚文本 | 动作类型 | 优先级 |
|---|---|---|---|---|
| `/solutions/event-registration-form-with-qr-code` | `/use-cases/qr-code-form-builder` | `QR code form builder` | 场景页回链 Pillar | P1 |
| Event registration 模板 | `/use-cases/qr-code-form-builder` | `create a QR code form` | 模板页回链 Pillar | P1 |
| `/use-cases/qr-code-form-builder` | `/solutions/event-registration-form-with-qr-code` | `event registration form with QR code` | Pillar 指向场景页 | P2 |

### 6.4 缺口

后续可评估：

1. `How to create a QR code form` 教程 Cluster。
2. `QR code event registration form` 场景页或模板页。
3. `QR feedback form` 轻量 pSEO 候选。

### 6.5 当前动作

- 不改 QR Pillar title。
- 先补自然内链。
- 等 GSC 回补后，如果稳定 11-30 名，进入 Golden Tuning，补 FAQ / 场景示例 / 移动端结果感。

## 7. 跨集群规则

### 7.1 交叉关键词承接

| Query 类型 | 主承接 | 说明 |
|---|---|---|
| `contact form builder with webhook` | Webhook Cluster | 不让 Contact Pillar 抢技术词，Contact 页只做自然分流 |
| `Typeform alternative with webhooks` | Typeform Alternative Cluster + Webhook 交叉 | 由 `/use-cases/typeform-alternative-webhooks` 承接 |
| `send form submissions to webhook` | Webhook 教程 Cluster | 教程页承接，回链 Webhook Pillar |
| `QR code event registration form` | QR Cluster | 由 QR Pillar 或活动场景页承接 |

### 7.2 CTA 规则

| Cluster | CTA intent / mode 建议 |
|---|---|
| Contact Form | `intent=contact_form`，优先 `template=contact-us` |
| Webhook Form | `intent=webhook_form`，可用 webhook-ready prompt，不承诺未上线原生集成 |
| Typeform Alternative | `intent=typeform_alternative`，需要时加 `mode=typeform_style` |
| QR Code Form | `intent=qr_form`，优先进入 event / QR 场景创建路径 |

## 8. 本轮优先执行清单

### P0：Webhook Cluster 内链核查和小修

原因：

- Clarity 已看到当天 Google 来源进入 Webhook 相关页面。
- `/posts/form-builder-with-webhook` 和 `/use-cases/webhook-form-builder-retry-logs` 都有小样本高排名信号。
- Webhook 是 GenForms 当前产品差异化最强的 SEO 主题之一。

动作：

1. 已核查 `/posts/send-form-submissions-to-webhook` 的 CTA 和 Webhook Pillar 承接。
2. 已把 `/posts/send-form-submissions-to-webhook`、`/posts/form-builder-with-webhook`、`/posts/feishu-dingtalk-webhook-notification` 补入 Webhook Pillar 的代码层 Topic Cluster 配置。
3. 不改冻结页面正文，只等待上线后观察 GSC / GA4 / Clarity。

### P0：Contact Form Cluster 内链核查

动作：

1. 核查 `/templates/contact-us` 是否链接到 `/use-cases/contact-form-builder-for-websites`。
2. 核查 Contact Pillar 是否给 `/templates/contact-us` 明确创建入口。
3. 保持 Contact Pillar 主体冻结，不做内容大改。

### P1：Typeform Alternative Cluster 保护观察

动作：

1. 核查 `/posts/typeform-alternatives` 与 `/use-cases/typeform-alternative-webhooks` 的双向承接是否存在。
2. 暂不改 `/posts/typeform-alternatives` 正文。
3. 等 2026-07-05 后再根据 GSC 判断是否需要外链提权或小修。

### P1：QR Cluster 内链增强

动作：

1. 核查 `/solutions/event-registration-form-with-qr-code` 到 `/use-cases/qr-code-form-builder` 的内链。
2. 核查 event registration 模板是否能自然链接 QR Pillar。
3. 等 GSC 判断是否进入 Golden Tuning。

## 9. 对后续计划的影响

计划变化：

- 原计划重点是“页面分区后决定下一篇 Brief”。
- 新计划先增加一个前置动作：整理 Topic Cluster 内链和承接关系。
- 短期少写新页面，多做现有资产的体系化连接。
- pSEO 不取消，但后移到 Topic Cluster 和 GSC 信号更清楚之后。
- 外链不是单独做，而是优先指向当前最需要权重的 Pillar 或 Alternatives Hub。

下一项 Codex 工作建议：

> Webhook Cluster 已完成内链核查和代码层配置小修。下一步只做上线后冻结观察，不大改正文，不影响归因。

## 10. 观察指标

| 层级 | 指标 |
|---|---|
| Pillar Page | impressions、clicks、CTR、average position、进入创建事件 |
| Cluster Page | 相关 query 是否增加、是否带来 Pillar 内链点击、是否产生创建事件 |
| Topic Cluster | 同一主题下多个 URL 是否同时获得 impressions 或排名改善 |
| Product Funnel | `forms_new_view`、`template_use_click`、`form_generate`、`form_publish`、`form_submit` |
| External Signals | referral sessions、branded search、外链收录、外链来源创建事件 |
