# GenForms 搜索数据判断与下一步规划

> 日期：2026-07-03  
> 最新 GSC 数据截止：2026-07-01，2026-07-03 09:00（Asia/Shanghai）抓取  
> 决策范围：Google 搜索表现、页面分区、未来 7-14 天动作  
> 结论：**曝光与排名改善，但点击没有同步增长；继续 Observe，不开启新 Topic Build。**

## Executive Summary

- **Google 正在扩大对 GenForms 的测试。** 最新 7 天为 787 impressions、2 clicks、CTR 0.254%、平均排名 43.45；相对 2026-06-24 的同口径滚动 7 天，impressions 增长 32.9%，平均排名改善约 4.3 位。
- **增长尚未转化为点击。** 7 天点击仍为 2，CTR 从 0.338% 降至 0.254%。28 天 impressions 增长 42.4%、clicks 从 4 增至 7，但绝对点击量仍极低，不能称为流量成功。
- **当前不是继续扩页面的时候。** 6 月 26-30 上线或重构的 Event、Feedback、Lead、Waitlist、Quote、Demo、Course、Community 等资产仍在冻结窗口，正文和 TDK 不应反复修改。
- **下一候选不是新 Topic，而是现有资产的小步动作。** QR Pillar 是最接近 Golden Tuning 的候选；Lead Capture 的 `lead form ai` 查询进入约第 17 位，但集群冻结到 7 月 11；Contact 与 Typeform 仍属于 Authority Needed。
- **搜索扩张必须让位于产品激活。** GA4 7 天记录 117 sessions、2 demo starts、1 form generate、0 publish、0 submit，且含 Admin/内部噪声。SEO 即使继续增加曝光，也还没有可验证的后续成功闭环。

## 1. 数据质量结论

### 可用于决策

- `growth_metric_snapshots` 中 GSC 1d/7d/28d 均成功写入。
- 最新 GSC target date 为 2026-07-01，符合代码中两天延迟口径。
- 本次使用 GSC 7d/28d 汇总、page 维度、query 维度，以及一次只读 `page × query` Search Analytics 查询交叉验证。

### 不可直接用于决策

- GSC 1d 为 0 impressions/0 clicks，属于延迟或不完整窗口，不解释为搜索崩盘。
- Query 与 Page 快照各只保存 Top 100，隐私阈值会隐藏点击查询；页面点击总和可见，但 clicked query 为空。
- Clarity 2026-07-02 仍出现 `3 sessions = 3 rage clicks = 3 script errors` 的旧错误形态，不用于本轮判断。
- GA4 包含 `/zh/admin`、`/admin`、Unknown 和内部访问，不计算自然搜索转化率。

数据质量评级：**GSC Ready to use with caveats；GA4 direction-only；Clarity current aggregate not decision-safe。**

## 2. 全站搜索趋势

| 窗口 | 当前截止日 | 当前 | 对比截止日 | 对比 | 变化 |
|---|---|---:|---|---:|---:|
| 7d impressions | 2026-07-01 | 787 | 2026-06-24 | 592 | **+32.9%** |
| 7d clicks | 2026-07-01 | 2 | 2026-06-24 | 2 | 0 |
| 7d CTR | 2026-07-01 | 0.254% | 2026-06-24 | 0.338% | -0.084 pp |
| 7d avg position | 2026-07-01 | 43.45 | 2026-06-24 | 47.75 | **改善 4.30 位** |
| 28d impressions | 2026-07-01 | 3,003 | 2026-06-24 | 2,109 | **+42.4%** |
| 28d clicks | 2026-07-01 | 7 | 2026-06-24 | 4 | +3 |
| 28d CTR | 2026-07-01 | 0.233% | 2026-06-24 | 0.190% | +0.043 pp |
| 28d avg position | 2026-07-01 | 45.75 | 2026-06-24 | 46.52 | 改善 0.78 位 |

解释：滚动窗口高度重叠，不能把变化归因为某一个页面改动；它只能证明 Google 展示面扩大、整体排名方向改善。

## 3. 页面分区

| 页面/集群 | 最新证据 | 分区 | 判断与动作 |
|---|---|---|---|
| `/posts/lark-feishu-form-webhook-bot` | 7d 119 imps / 0 clicks / pos 9.6；主要可见 query 是 Feishu 官方文档类 | CTR/Intent Diagnostic | 排名改善明显，但用户更像在找官方文档。先不再改正文；7 月 8 日复核 query 是否转向“form submissions to Feishu/Lark”。 |
| `/use-cases/feishu-dingtalk-form-notifications` | 7d 38 imps / 0 clicks / pos 7.6 | CTR Rescue candidate | Query 受隐私阈值影响。先补足一周数据，不在不知道 owning query 时改 title。 |
| `/posts/feishu-dingtalk-webhook-notification` | 7d 52 imps / 0 clicks / pos 13.3；曾做过 CTR 修复 | Observe / Intent mismatch risk | 已修过一次且排名上升；继续改标题会破坏归因。当前可见 query 仍偏官方文档。 |
| `/posts/form-builder-with-webhook` | 28d 8 imps / 1 click / pos 7.25 | Protect / Small-sample winner | 当前少数有真实点击的高意图资产。保持内容稳定，通过现有 Cluster 内链保护。 |
| `/use-cases/qr-code-form-builder` | 7d 7 imps / pos 19；从上一同口径约 37 位改善 | **Golden Tuning candidate** | 7 月 5 日后若仍稳定 11-30，作为唯一小调候选；优先补结果感/FAQ/内链中的一个变量，不重写全页。 |
| Lead Capture Cluster | Pillar 7d 28 imps / pos 49.2；`lead form ai` 12 imps / pos 17 | Frozen；未来 Golden Tuning | Query 已出现明确近首页信号，但集群冻结至 7 月 11。到期后只围绕 `lead form ai` 做一次信息增益判断。 |
| Waitlist Cluster | Use Case 28d 43 imps / pos 25.2；Post 30 imps / pos 9 / 0 clicks | Frozen | 冻结至 7 月 11。Post 属 CTR 候选，Use Case 属 Golden Tuning 候选；到期后只选一个动作，不同时改两页。 |
| Contact Form Pillar | 7d 71 imps / pos 48.6；query `contact form builder` 25 imps / pos 51.2 | Authority Needed / Frozen | Topic 方向成立，但未到 CTR Rescue。等待 Embed/邮件产品能力和更多主题权威，不做标题党式改动。 |
| `/posts/typeform-alternatives` | 28d 502 imps / 0 clicks / pos 73；7d 78 / pos 68 | Authority Needed | 曝光多但排名低；冻结至 7 月 5。下一步应是意图/权威诊断和外部提及，不是第二轮全文重写。 |
| Demo Request Pillar + Template | 新页面 7d 各 45/39 imps；整体 pos 42/57 | Frozen | 已获得快速展示，冻结至 7 月 12。特殊长尾进入约 27-38 位，但不据此重做页面。 |
| Event / Feedback / Quote / Course / Community | 新上线或近期收口 | Frozen | 按原台账分别冻结至 7 月 10-12，只记录 query/page，不改主体。 |

## 4. 查询层判断

### 已验证方向

- `contact form builder`：7d 25 imps / pos 51.2；28d 111 / pos 46.5。需求真实，但当前权威不足。
- `lead form ai`：7d 12 imps / pos 17，指向 AI Lead Capture Pillar。属于最有价值的近首页 owned query 之一。
- Typeform free/cheap alternatives：多个查询各有 13-15 impressions，但排名约 71-81。商业意图真实，暂时不是 CTR 问题。
- Feishu official webhook documentation：多组 query 进入 8-10 位，但意图偏官方文档；不能把这些排名等同于表单产品需求。
- `demo request form`：7d 8 imps / pos 44.1；新资产已开始被理解，但仍需冻结。

### 尚未验证方向

- 最新 Top 100 查询中没有形成稳定的日语或西语查询簇；只有一个法语 AI form 查询出现 2 impressions。
- 因此此前 `es-419` 优先结论仍是 SERP + 产品 Pilot 决策，不是 GenForms 已有 GSC 需求证明。
- **继续 Hold 西语/日语 SEO 页面翻译。** 多语言产品 Pilot 与多语言 SEO 发布仍是两个 Gate。

## 5. 产品激活护栏

最新 GA4 7 天（截止 2026-07-02）：

| 指标 | 数值 | 解释 |
|---|---:|---|
| Sessions | 117 | 含 Admin/内部/Unknown，不作为自然搜索 denominator |
| Demo start / complete | 2 / 2 | 有极小量体验行为 |
| Template use click | 2 | 样本不足 |
| Form generate | 1 | 生成仍有发生 |
| Form publish | 0 | 后续闭环未形成 |
| Form submit | 0 | 后续闭环未形成 |

判断：搜索侧的主要业务风险不是“Google 完全不展示”，而是获取到的极少点击尚未转成可观察的发布与提交。V1.3 P0-A 激活闭环的优先级高于新 SEO 页面。

## 6. 未来 14 天规划

### 7 月 3-5 日：保护归因

- 不开启新 Topic Capture、Architect 或 Build。
- 不修改 7 月 10-13 前仍在冻结的页面。
- 继续每日检查 GSC 快照是否成功；1d 为 0 时不触发告警。
- 7 月 5 日后复核 QR Pillar 和 Typeform Alternatives，不自动修改。

### 7 月 6-8 日：只选择一个 SEO 小动作

优先顺序：

1. 若 QR Pillar 仍稳定在 11-30 且 impressions 增长：建立一个 Golden Tuning Brief，只允许 FAQ、结果感或内链三选一。
2. 若 QR 回落：不硬做；改为对 `/posts/lark-feishu-form-webhook-bot` 做 query-intent 诊断，不立即改文案。
3. Typeform Alternatives 只做 Authority plan：目标外链/品牌提及/Cluster 内链，不再全文重写。

### 7 月 10-13 日：冻结期到期复盘

- Event：看 event registration / RSVP / workshop / webinar owning query。
- Lead：重点看 `lead form ai` 是否保持 11-30。
- Waitlist：在 Post CTR Rescue 与 Use Case Golden Tuning 中二选一。
- Feedback / Quote / Course / Community / Demo：只对已出现稳定 owning query 的资产升级状态。
- 全部仍无合格点击/激活时，不开启 pSEO 或多语言 SEO。

## 7. 责任分工

| 负责人 | 下一步 |
|---|---|
| Codex | 维护 Data Observe；7 月 5、8、11 分别复核 QR、Webhook intent、冻结集群；一次最多提出一个 Brief。 |
| Gemini | 当前不需要新 SERP 批次；如 Codex 7 月 5 选择 QR，只按单一 Brief 做竞品信息增益核查。 |
| Mike | 当前无新的 GSC/Google 手动任务；不要重复提交 sitemap 或冻结页面。只有 Codex 明确提出 URL Inspection/外链动作时再执行。 |

`user_action_tracker.md` 本轮不需要新增 Mike 待办。

## 8. 最终判断

**当前状态：Observe / Improve quality, not expand inventory。**

- 搜索可见性：改善。
- 点击效率：仍弱。
- Topic 方向：Contact、Webhook、Typeform、Lead、QR 均被 Google 测试，方向没有被否决。
- 可立即改页：没有；最早候选是 7 月 5 日后的 QR Golden Tuning 判断。
- 可立即新建页面：没有。
- 多语言 SEO：继续 Hold。
- 产品优先级：完成首次发布/测试提交/结果回看闭环，高于增加搜索页面。
