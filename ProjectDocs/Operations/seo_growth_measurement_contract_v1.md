# GenForms SEO Growth Measurement Contract V1

> 版本：2026-07-03
> Owner：Codex / Growth；产品结果 source of truth 由产品数据库控制
> 生效状态：Search metrics active；product attribution instrumented，3-day quality gate active

## 1. 决策对象

本 Contract 只服务以下决策：

- Topic / URL：Scale、Tune、Authority、Hold、Merge、Retire。
- Editorial Batch：是否继续同类内容。
- pSEO Pilot：是否从 5-10 页扩大、保持或停止。
- 产品漏斗：SEO 用户在 create、publish、submit 哪一步受阻。

它不把展示量、页面数量或 raw event rows 当成业务成功。

## 2. Metric Dictionary

| Stage | Metric | Grain / Definition | Source of truth | Window |
|---|---|---|---|---|
| Demand | Relevant impressions | 目标 query 与 owning page 的 GSC impressions | GSC page x query | 7d / 28d |
| Click | Organic clicks | GSC 对目标 page/cluster 记录的 clicks | GSC | 7d / 28d |
| Entry | Organic content entrant | first/last non-direct organic context 有效的 unique visitor | attribution context + growth event | session / 7d |
| CTA | SEO CTA entrant | organic entrant 触发 `template_used`，带 content source、intent、template | deduped growth event | 7d |
| Generate | Organic generator | organic cohort unique visitor 触发 generate；重复尝试只算一个 visitor | deduped growth event | 7d |
| Create | Organic created form | Form 持久 attribution 为 organic 且在窗口内 created | `forms` | 7d activation |
| Publish | Organic published creator | organic-attributed Form 在创建后 7d 内达到 published | `forms` | 7d activation |
| Submit | Organic value-realized creator | organic-attributed published Form 在创建后 28d 内至少 1 个 `is_test=false` submission | `forms` + `form_submissions` | 28d value |
| Upgrade intent | Organic upgrade-intent user | organic-attributed user 触发 paywall click 或 checkout start；同一 user/window 去重 | events + user attribution | 28d |
| Qualified lead | Human-qualified GenForms opportunity | organic-attributed user/account 经业务 owner 审核为真实购买/合作机会 | future lead outcome source | 28d / monthly |

`public_form_submitted` 是 GenForms 用户获得价值的结果，不自动等于 GenForms 自己获得 qualified lead。

## 3. Primary KPIs

### KPI 1：Organic Search Clicks

- 定义：目标 page/cluster 的 GSC clicks。
- 用途：判断搜索需求是否从 impression 转成访问。
- 优点：Google source of truth，不依赖站内埋点。
- 限制：无法识别单个 visitor，低样本波动大。

### KPI 2：Organic Published Creators

- 定义：first/last non-direct attribution 为 organic，且 7 天内成功发布至少一个 Form 的 unique creator。
- 用途：判断 SEO 流量是否进入可用产品结果。
- 当前状态：Instrumented；等待 2026-07-07 质量复核与 internal cohort 后启用 conversion decision。

### KPI 3：Organic Value-Realized Creators

- 定义：Organic Published Creator 的 Form 在创建后 28 天内获得至少一个非测试 submission。
- 用途：区分“发布了页面”和“真实完成数据收集”。
- 当前状态：Instrumented；等待 2026-07-07 质量复核与 internal cohort 后启用 conversion decision。

## 4. Drivers and Guardrails

### Driver metrics

- CTA entrants by `content_source / intent / template`。
- Organic generators。
- Created forms。
- Publish start -> publish success。
- Test submission completed -> first result viewed。

### Guardrails

- Internal/dev/Admin exclusion rate 与 unknown attribution rate。
- page/query cannibalization。
- product truth violations 与 unsupported capability claims。
- pSEO pairwise similarity / doorway risk。
- client/server result event duplication rate。

## 5. Attribution Rules

### Required context

- `channel`：organic_search / referral / direct / campaign。
- `search_engine`：google / bing / other。
- `landing_path`。
- `content_source`：例如 `usecase_qr-code-form-builder`。
- `intent`：例如 `qr_form`。
- `template_id`。
- `first_touch_at`、`last_non_direct_at`。
- visitor/session identifier；不得存 prompt、answer、email 等 PII。

### Windows

- Session：30 分钟无活动后重置。
- Activation attribution：7 天。
- Value realization / upgrade attribution：28 天。
- Direct visit 不覆盖已有 last non-direct attribution。

### Source precedence

1. GSC：搜索 clicks 与 query/page。
2. Form / Submission tables：create、publish、real submission。
3. Persisted acquisition context：把 Form 连接到 Topic/URL/channel。
4. Growth events / GA4：漏斗诊断，不覆盖业务事实。

## 6. Data Sufficiency Rules

- 少于 20 个 unique organic content entrants：不报告 conversion rate，只报告 counts 与行为样本。
- 少于 10 个 CTA entrants：不因 0 generate 判页面失败。
- 至少 10 个 CTA entrants 且 0 generate：进入 Product Activation Diagnose。
- 至少 5 个 organic created forms 且 0 publish：进入 Publish Friction Diagnose。
- 至少 3 个 organic published forms，28d 后仍 0 non-test submission：进入 Value Realization Diagnose。
- 任何阈值都不能绕过 P0 技术错误、产品事实或 cannibalization Guardrail。

这些阈值是调查触发器，不是行业 benchmark 或成功承诺。

## 7. Batch Decisions

### Scale

- SERP/Ownership/Product Gate 继续通过。
- 相关 impressions 与 clicks 增长，或至少一个 owning URL 稳定前 30。
- attribution ready 后，出现 CTA/generate；更高信号为 published/value-realized creator。
- 无明显 cannibalization、thin content 或 tracking integrity 问题。

### Tune

- 排名 11-30 有相关 impressions，或前 10 有足够 impressions 但 0 click。
- 一轮只改一个主变量。

### Hold

- 数据不足、归因 unknown、隐私阈值隐藏或冻结期未结束。

### Stop

- 45 天无相关 impressions。
- 意图与产品能力不匹配。
- 多 URL 抢同一 query。
- pSEO 页面缺少实质差异。
- 修复后有足够 CTA/create 样本，但持续无法 publish/value realize。

## 8. Qualified Lead Gate

当前没有可用的 qualified lead source of truth，因此：

- `paywall_clicked` / `checkout_started` 只叫 Upgrade Intent，不叫 qualified lead。
- 普通 Form submission 不叫 GenForms qualified lead。
- 只有业务 owner 明确 criteria、review state 和 outcome source 后，才启用 qualified lead KPI。
- 在此之前月报中显示 `Qualified lead: N/A (not instrumented)`，不能填 0，也不能推断。
