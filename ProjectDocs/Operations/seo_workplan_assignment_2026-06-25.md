# GenForms.ai SEO Workplan & Assignment

> 创建日期：2026-06-25
> 用途：把 SEO 后续 4 周工作拆成明确任务、负责人、输入、输出和交接规则。
> 关联文档：`seo_global_operating_plan_2026-06-25.md`、`seo_topic_universe.md`、`seo_topic_cluster_map.md`、`seo_mainline_board.md`、`seo_page_observation_ledger.md`、`seo_backlink_work_queue.md`。

## 1. 当前总判断

当前已经完成一轮受控发布，Webhook Cluster、Contact Form、QR Code Form、Typeform Alternative 等页面进入冻结观察期。2026-06-25 已完成产品经理 Topic 扩展评审与 Gemini Batch 2 SERP 研究复核，下一批优先 Brief 已收敛到 `Web Design Client Intake Form`。

接下来 2 周不应继续大面积改页面，而应把工作拆成三条并行线：

1. **观察线**：Codex 每天/每周看 GSC、GA4、Clarity，给页面分区。
2. **扩展线**：产品经理和 Gemini 从竞品、模板和 Google SERP 拓展下一批经过市场验证的 Topic；当前已确认 `Web Design Client Intake Form` 进入 Brief 草案，`Beta Feedback Form` 进入后续改造候选，`Quote Request Form` 保留为 P1。
3. **权重线**：Mike 继续外链、品牌提及、目录和社区种子流量。

2026-06-26 起补充一条总管规则：

> 所有 Topic 按 Topic Operating Loop 管理：Discover -> Validate -> Architect -> Build -> Ship -> Observe -> Decide -> Expand。任何人交付的结论，都必须说明该 Topic 当前处于哪个阶段、下一步进入哪个阶段、需要谁接手。

这意味着后续不再把“研究一个关键词”或“做一个页面”视为完整任务。一个 Topic 的完整工作包含：

- Pillar / Use Case / Solution 承接页。
- Template 创建入口。
- 必要的 Post / FAQ / 教程 / 集成 / Alternatives 周边资产。
- 内链和 CTA intent。
- Schema 和技术 SEO。
- GSC / GA4 / Clarity 观察窗口。
- 是否扩展、微调、提权或停止的决策。

核心原则：

- 页面冻结期内不频繁改正文。
- Topic 扩展必须来自竞品和 SERP，不闭门造车。
- 产品经理负责“能不能承接、是否值得作为产品方向”，Codex 负责“Google 是否会给这个搜索意图分配流量”。
- Gemini / 外部研究助手只做证据采集和初稿分析，不直接决定上线。

## 2. 角色职责

| 角色 | 当前职责 | 本轮具体任务 |
|---|---|---|
| Mike | 决策、外链、URL Inspection、资源协调 | 继续做外链/目录/社区；对产品经理和 Gemini 分发任务；确认是否进入下一批页面 |
| Codex | SEO 负责人、数据判断、Brief、实现和部署建议 | 观察 GSC/GA4/Clarity；维护 Topic Universe；复核 PM/Gemini 结论；产出 Brief；必要时实现小修 |
| 产品经理 | 产品承接和 Topic 产品价值判断 | 从竞品模板/分类/用例中拓展 Topic，判断 GenForms 是否真实支持，给出产品承接建议 |
| Gemini / 外部研究助手 | SERP 与竞品证据采集 | 对指定 Topic 抓 Google US SERP、Top 10 页面类型、竞品承接方式和搜索意图 |
| UX / 体验负责人 | 搜索进入后的体验和转化 | 对进入下一批候选的页面方向评估首屏、CTA、结果感和移动端体验 |

### 2.1 Topic Loop 交接口径

| 角色 | 交接时必须回答 | 不再接受的交付方式 |
|---|---|---|
| 产品经理 | 该 Topic 是否是竞品验证过的真实需求；GenForms 能否真实承接；缺口是什么；适合作为什么资产包 | 只给一个“可以做/不可以做”的结论 |
| Gemini | Google US SERP 如何理解该 Topic；Top 10 URL 和截图；竞品如何转化；建议页面类型和优先级 | 只给关键词列表或泛泛总结 |
| UX | 首屏是否匹配搜索意图；CTA 是否让用户进入正确创建路径；移动端是否能理解和行动 | 只评价好看不好看 |
| Codex | Topic 当前 Loop 阶段；是否进入 Brief；资产包怎么设计；上线后看什么数据；下一轮如何 Expand | 只做一个页面后停止 |
| Mike | 是否投入资源；是否提交 URL Inspection；是否做外链/目录/社区支持 | 被动逐页确认细节 |

## 3. 未来 4 周排期

### Week 1：冻结观察 + Topic 扩展准备

时间：2026-06-25 至 2026-07-01

目标：

- 不新增页面。
- 不大改 Contact / Webhook / QR / Typeform 已上线页面。
- 产品经理开始从竞品拓展 Topic。
- Codex 建立下一批研究任务包。

任务：

| 任务 | 负责人 | 输入 | 输出 | 截止 |
|---|---|---|---|---|
| 观察 Webhook Cluster 上线后表现 | Codex | GSC/GA4/Clarity、`seo_page_observation_ledger.md` | 每日/每周判断：继续冻结、CTR Rescue、Golden Tuning 或 Authority Needed | 每日轻量，周末汇总 |
| 从竞品拓展 Topic | 产品经理 | Jotform、Typeform、Tally、Fillout 模板/分类/用例；`seo_topic_universe.md` | 10-20 个经过市场验证的 Topic 候选，含产品承接判断 | 2026-06-28 |
| 准备 Gemini SERP 研究任务 | Codex | Topic Universe、PM Topic 候选 | Gemini 任务提示词，第一批只给 2 组 Topic | 2026-06-28 |
| 复核 Batch 2 Topic 并产出首个 Brief | Codex | PM Topic 扩展评审、Gemini Batch 2 SERP 研究 | `seo_brief_web_design_client_intake_form.md` | 2026-06-25 |
| 外链/品牌提及继续执行 | Mike | `seo_backlink_work_queue.md` | 本周新增外链/目录/社区记录 | 每周 |

产品经理 Topic 扩展要求：

- 不能只列“看起来能做”的主题。
- 每个 Topic 至少要说明来自哪些竞品信号。
- 每个 Topic 要判断 GenForms 是否已有模板、创建路径、数据面板、CSV、二维码、Webhook 后续能力。
- 不能建议当前产品不支持的主承诺，例如支付/订单、CRM 原生同步、生产级邮件通知、iframe embed、unlimited free。

### Week 2：GSC 分区 + 第一批新 Topic SERP 研究

时间：2026-07-02 至 2026-07-08

目标：

- 根据 GSC 回补数据给重点页面分区。
- Gemini 完成 1-2 个新 Topic 的 Google US SERP 研究。
- Codex 判断是否进入 Brief。

建议第一批研究 Topic：

1. `Event Registration Form / QR Event Form`
2. `Customer Feedback / Satisfaction / NPS`

2026-06-25 调整：

- 产品经理已先完成一批更具体的场景 Topic 评审。
- Gemini 已完成 Batch 2：Quote Request、Client / Project Intake、Product Feedback / Feature Request。
- Codex 复核后，将 `Web Design Client Intake Form` 提升为当前第一 Brief 候选；`Beta Feedback Form` 作为第二候选；`Quote Request Form` 保留 P1，不降为暂不做。

任务：

| 任务 | 负责人 | 输入 | 输出 | 截止 |
|---|---|---|---|---|
| 页面 SOP V2 分区 | Codex | GSC 7d/28d、GA4、Clarity | 页面分区表：Frozen / CTR Rescue / Golden Tuning / Authority Needed | 2026-07-03 |
| Google SERP 抓取和 Top 10 分析 | Gemini | Codex 提示词 | 每个 Topic 的 SERP 10 项分析和原始 URL/截图 | 2026-07-05 |
| 产品承接复核 | 产品经理 | Gemini SERP、Topic 候选 | 哪些 Topic 能进入产品承接页、模板页或 Post | 2026-07-06 |
| Codex 复核并定优先级 | Codex | Gemini + PM 输出 | 是否进入 Brief；如进入，排 P0/P1/P2 | 2026-07-08 |

### Week 3：只做 1 个最高优先级 Brief

时间：2026-07-09 至 2026-07-15

目标：

- 不开多条战线。
- 只选择一个 Topic 或一个已有页面进入 Brief。

候选来源：

- GSC 显示已有页面进入 Golden Tuning。
- SERP 研究证明新 Topic 有明确机会。
- 产品经理确认有真实产品承接。
- Mike 外链/社区信号显示某个主题更容易起量。

任务：

| 任务 | 负责人 | 输入 | 输出 | 截止 |
|---|---|---|---|---|
| 选择一个 Brief 主题 | Mike + Codex | GSC 分区、SERP、PM 复核 | 明确本周只做一个 P0 Brief | 2026-07-09 |
| 写 Brief | Codex | SERP、竞品、产品边界、现有页面 | 页面/文章/模板 Brief | 2026-07-11 |
| 产品与 UX 评审 | 产品经理 + UX | Brief | 产品承接、首屏、CTA、结果感建议 | 2026-07-13 |
| 决策是否实现 | Mike | Brief + 评审 | 通过 / 暂缓 / 退回研究 | 2026-07-15 |

### Week 4：小范围实现或继续观察

时间：2026-07-16 至 2026-07-22

目标：

- 如果 Brief 通过，只做小范围实现。
- 如果证据不足，继续观察，不硬做页面。

任务：

| 任务 | 负责人 | 输入 | 输出 | 截止 |
|---|---|---|---|---|
| 小范围实现 | Codex | 已通过 Brief | 页面/内链/CTA/FAQ 小修 | 2026-07-18 |
| 验证与部署建议 | Codex | tests/build/SEO gate | 是否上线 | 2026-07-19 |
| URL Inspection | Mike | 已上线 URL | Google/Bing 提交 | 上线当天 |
| 冻结观察记录 | Codex | 上线结果 | 更新观察台账 | 上线后 |

## 4. 产品经理任务：竞品 Topic 拓展

### 4.1 产品经理需要看的竞品

优先看：

- Jotform templates
- Typeform templates
- Tally templates
- Fillout templates
- POWR / AidaForm / 123FormBuilder / Formcarry / Zoho 的相关 landing page

不要只看首页，要看：

- 模板分类
- 热门模板
- 用例页
- Alternatives / comparison 页
- 集成/工作流页
- CTA 到创建路径的方式

### 4.2 输出格式

产品经理给 Codex 的输出建议按这个表：

| Topic | 竞品证据 | 用户主任务 | GenForms 当前承接 | 产品缺口 | 建议 SEO 页面类型 | 产品优先级 |
|---|---|---|---|---|---|---|
| Event Registration Form | Jotform / Typeform / Tally 均有 event registration 模板 | 创建活动报名表，分享给参会者 | `event-registration` 模板、公开链接、二维码、提交面板 | 是否需要 ticket/payment 明确排除 | Use Case / QR Cluster | P1 |

### 4.3 产品经理判断标准

产品经理只回答四件事：

1. 这个 Topic 是否是经过竞品验证的真实市场需求。
2. GenForms 现在是否真实能承接用户主任务。
3. 哪些能力可以明确写，哪些只能写成高级路径/后续路径，哪些不能写。
4. 这个 Topic 进入产品路线图是否有价值。

产品经理不需要判断：

- Google Top 10 SERP 类型。
- GSC 排名和 CTR。
- title/meta 怎么写。
- 是否立即上线页面。

这些由 Codex 负责。

## 5. Gemini / 外部助手任务：Google SERP 研究

Gemini 每次只研究 1-2 个 Topic，不要一次塞 20 个。

每个 Topic 必须输出：

- 关键词组，不只一个词。
- Google US SERP Top 10 原始 URL、title、snippet、page type。
- 每个结果的搜索意图解释。
- 头部竞品如何承接创建/注册/模板/集成。
- GenForms 可借鉴点。
- GenForms 不能承诺的能力边界。
- 建议页面类型：Use Case / Template / Post / Alternatives / pSEO。
- 是否建议进入 Brief。

原始材料必须保存，不能只给总结。

## 6. Codex 每周固定动作

Codex 每周做四件事：

1. 把 GSC 新 query 回填到 `seo_topic_universe.md`。
2. 给重点 URL 打 SOP V2 分区。
3. 复核产品经理和 Gemini 的 Topic 结论。
4. 只推荐 1 个下一步 Brief 或明确继续观察。

如果数据还不够，Codex 应明确说“继续观察”，而不是为了推进而推进。

## 7. Mike 每周固定动作

Mike 每周做三件事：

1. 持续执行外链和目录提交，优先 Webhook、Contact、Typeform 三个方向。
2. 对已上线并需要重新抓取的 URL 做 Google/Bing URL Inspection。
3. 对产品经理/Gemini/Codex 输出做最终资源优先级判断。

## 8. 当前立即任务清单

| 优先级 | 任务 | 负责人 | 状态 |
|---|---|---|---|
| P0 | Webhook Cluster 上线后冻结观察 | Codex | 进行中 |
| P0 | 从竞品拓展 Topic 候选 10-20 个 | 产品经理 | 已完成首批评审 |
| P0 | 复核 Gemini Batch 2：Quote / Intake / Feedback | Codex | 已完成 |
| P0 | 准备并本地实现 `Web Design Client Intake Form` 页面 | Codex | 已完成本地实现：`/solutions/web-design-client-intake-form-template`；待产品/UX 复核与部署决策 |
| P0 | 补 `web design client intake form` Google Top 10 原始证据 | Gemini | 已完成：HTML/PNG 已保存到 `SEOData/serp_raw/us_vpn/` |
| P0 | 完成 `Event Registration / QR Event` 第一阶段 Build | Codex | 已完成：`seo_brief_event_registration_qr.md` 已落地到 `/use-cases/event-registration-form-builder`、`event-registration` 模板、QR Solution、CTA intent 和测试；待预览确认后进入 Ship |
| P1 | 准备 `Beta Feedback Form` 页面改造 Brief | Codex | 候选 |
| P1 | 保留 `Quote Request Form` 为 P1 Brief 候选 | Codex | 候选 |
| P1 | 外链与品牌提及继续执行 | Mike | 持续 |
| P1 | 每周 GSC query 回填 Topic Universe | Codex | 每周 |

## 9. 当前不做

- 不同时开多个新页面。
- 不做大规模 pSEO。
- 不批量发博客。
- 不为了 Topic 扩展承诺未上线能力。
- 不把竞品有的功能自动视为 GenForms 必须马上做的功能。
- 不在冻结观察期频繁修改 Contact / Webhook / QR / Typeform 已上线页面。

## 10. 一句话安排

> Codex 负责数据和 SEO 判断，产品经理负责从竞品和产品承接角度拓展 Topic，Gemini 负责 Google SERP 证据采集，Mike 负责外链和最终优先级；未来 2 周以观察和研究为主，不急着新建页面。
