# GenForms SEO Growth Measurement Gap Audit — 2026-07-03

> 审计目的：判断 SEO Production Loop 能否用 clicks -> create -> publish -> submit -> upgrade/qualified lead 做可靠升级或停止决策。
> 数据窗口：GSC 截止 2026-07-01；GA4 截止 2026-07-02；生产表审计至 2026-07-03。
> 结论：**搜索侧可用，产品事实总量可用，SEO 到产品结果的归因不可用；不得计算 SEO publish/submit conversion rate。**

## 1. 数据集与预期粒度

| Source | 预期粒度 | 当前可回答 | 当前不能回答 |
|---|---|---|---|
| GSC snapshot / Search Analytics | date range x page/query | impressions、clicks、CTR、position、query owner | 单个点击对应哪个 visitor |
| GA4 snapshot | date range x event/landing page | 前端事件方向、落地页分布 | 可靠排除 Admin/internal 后的 SEO cohort |
| `growth_events` | event row | landing、CTA、generate 等行为诊断 | 不经去重直接作为业务结果 |
| `forms` | form | create、当前 publish 状态 | 创建来源是否来自 SEO page/query |
| `form_submissions` | submission | test / non-test submission 事实 | submission 所属 form 的 SEO acquisition source |
| paid / lead outcome | user/account/lead | checkout/purchase 零散事件 | 统一 `qualified_lead` 状态及 owner 审核 |

## 2. 当前基线

### Search

| Window | Impressions | Clicks | CTR | Position |
|---|---:|---:|---:|---:|
| GSC 7d，截止 2026-07-01 | 787 | 2 | 0.254% | 43.45 |
| GSC 28d，截止 2026-07-01 | 3,003 | 7 | 0.233% | 45.75 |

### Frontend analytics

GA4 7d，截止 2026-07-02：117 sessions、2 `template_use_click`、1 `form_generate`、0 `form_publish`、0 `form_submit`。该窗口包含 Admin/internal/Unknown，不能直接计算自然搜索转化率。

### Product source of truth

2026-06-27 至 2026-07-03：

- `forms`：2 created，2 当前为 published。
- `form_submissions`：1 non-test，1 test。
- non-test submission 属于已知 U-061 内部验证表单；另一个 published form 只产生 test submission。
- 因此当前可确认的 **external SEO publish / real submission = 0 或 unknown，不是 2 / 1**。

## 3. Data Quality Findings

| ID | Finding | Evidence | Impact | Severity | Confidence |
|---|---|---|---|---|---|
| DQ-01 | SEO acquisition context 没有持久写入 Form | 2/2 新 Form 的 `generation_meta_json` 只有 generation source，没有 landing/content source/intent/organic channel | 无法把发布与真实提交归因到 SEO Topic、URL 或 Batch | **Critical** | High |
| DQ-02 | Server success events 缺 visitor/session/content attribution | 7d `form_created` 与 `public_form_submitted` 各 1 条，visitor/session 均为空；`form_published` 为 0 | 事件漏斗在结果节点断链 | **Critical** | High |
| DQ-03 | Client/server 同名结果事件存在结构性双报风险 | create、publish、submit 均可能由客户端和 API 分别上报；业务表与 event count 已不一致 | 直接 sum event rows 可能漏报或翻倍 | High | High |
| DQ-04 | `session_id` 实际不是 session | `aiff_session_id` 存在 `localStorage`，没有 30 分钟过期或浏览器会话重置 | 跨天行为可能被错误串成同一 session | High | High |
| DQ-05 | `source` 不是稳定的内容归因字段 | URL 的 `source=usecase_*` 只在 metadata；事件顶层 source 仅读取 `utm_source/ref/referrer`，内跳后常变为 `genforms.ai`/direct | Topic 与 CTA 贡献难以稳定聚合 | High | High |
| DQ-06 | `intent` 完整率不足 | 7d 的 5 个 template/use/new/generate 事件全部 missing/unspecified；28d 63 个也全部 missing/unspecified | 无法按 `qr_form`、`lead_capture`、`waitlist` 比较产品承接 | High | High |
| DQ-07 | Internal/dev/Admin 污染比例高 | 7d raw 762 rows，排除 `is_dev` 与 `/admin` 后 262，排除 65.6%；28d 2,868 -> 1,539，排除 46.3% | 未统一过滤的 Dashboard 会夸大流量和行为 | High | High |
| DQ-08 | Referrer Google 不能替代 GSC clicks | 对齐 2026-06-25 至 07-01 后，Growth `landing_viewed` 仍有 10 个 Google referrer unique visitors，而 GSC clicks 为 2 | Google referrer 可能含非自然、人工、自动化或口径差异 | High | High |
| DQ-09 | Qualified lead 没有可执行定义或数据表 | 代码无 `qualified_lead` event/state；只有 paywall/checkout/purchase 与表单里的 qualification 文案 | Loop 不能以 qualified lead 做正式 Scale/Stop | **Critical** | High |
| DQ-10 | `growth_events` 事件名和 GA4 名称为两套语义 | DB 使用 `template_used` / `ai_generate_submitted`；GA4 使用 `template_use_click` / `form_generate` | 报表容易混用两套名字与重复计算 | Medium | High |

## 4. 可用性判定

### Ready

- GSC impressions/clicks/CTR/position：搜索结果判断的 source of truth。
- `forms` create/current status：产品事实总量。
- `form_submissions.is_test = false`：真实提交总量，但必须排除内部验证并通过 form attribution 才能归因 SEO。
- page x query：Topic ownership 判断，注意隐私阈值。

### Direction-only

- GA4 funnel：用于发现方向，不用于当前 SEO conversion rate。
- `growth_events` landing/CTA/generate：经过 dev/Admin/internal 过滤、unique visitor 去重后用于诊断。
- Google referrer：行为富化字段，不作为 organic clicks。

### Not ready

- SEO-created forms。
- SEO-published forms。
- SEO-attributed real submissions。
- Organic upgrade intent。
- Qualified leads。

## 5. 决策影响

在归因修复前：

1. 页面/Cluster 可根据 GSC query ownership、排名、点击和产品事实进入 Tune/Hold/Authority。
2. pSEO Publish Gate 必须继续关闭；不能声称 Pilot 能测量 publish/submit outcome。
3. 不计算 `SEO click -> generate`、`generate -> publish`、`publish -> submit` rate。
4. 产品结果只报告全站总量，并明确 external/internal 与 test/non-test。
5. 任何“SEO 已带来发布或提交”的结论必须有 Form 上的持久 acquisition context，否则判为 unproven。

## 6. 最小修复顺序

1. 持久化 first/last non-direct acquisition、content source、intent、landing path、template 到 Form。
2. 建立真实 30-minute session，而不是永久 localStorage session。
3. 用业务表计算 create/publish/submit；事件只做行为诊断和 attribution handoff。
4. 统一内部/dev/Admin 排除规则与 search source normalization。
5. 单独定义 upgrade intent；qualified lead 需业务 owner 审核状态，不能把任意 submission 当成 qualified lead。

详细实现见 `seo_growth_attribution_repair_plan_2026-07.md`。

