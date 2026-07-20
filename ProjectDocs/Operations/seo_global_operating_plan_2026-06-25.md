# GenForms.ai SEO Global Operating Plan

> 创建日期：2026-06-25
> 用途：把 GenForms.ai SEO 的全局策略、主题扩展、页面优化、数据观察、外链增长和职责分工收束成一份总控计划。
> 关联文档：`seo_growth_sop_v2.md`、`seo_workplan_assignment_2026-06-25.md`、`seo_topic_universe.md`、`seo_topic_cluster_map.md`、`seo_mainline_board.md`、`seo_page_observation_ledger.md`、`seo_core_keyword_observation_list.md`、`seo_backlink_work_queue.md`。

## 1. 当前总判断

GenForms.ai 当前 SEO 不应该继续以“单个关键词、单篇文章、单个页面”为中心推进，而应该进入体系化增长阶段。

新的主线是：

```text
市场验证 Topic
  -> Topic Universe 扩展池
  -> SERP / GSC / 产品承接判断
  -> Topic Cluster / Alternatives / pSEO / Backlinks / GSC 微调
  -> 页面或内链小范围执行
  -> 冻结观察
  -> 数据反馈
  -> 下一轮决策
```

这意味着：

- Topic 不靠内部想象，必须经过竞品和 Google 结果验证。
- 已上线页面不能频繁改，先分区、再动作、再冻结。
- 新页面不是越多越好，优先把已有主题集群连起来。
- pSEO 是后续放大器，不是当前主引擎。
- 外链不是附属动作，而是 Authority Needed 页面和强竞争主题的必要配套。

## 1.1 Topic Operating Loop

后续 SEO 不能按“一个 Topic 做完一个页面”来推进，而要按 Topic Operating Loop 循环运行。每个 Topic 都是一组资产和动作，而不是单一 URL。

```text
Discover 发现主题
  -> Validate 验证市场和搜索意图
  -> Architect 设计主题资产包
  -> Build 小范围实现
  -> Ship 发布和提交索引
  -> Observe 冻结观察
  -> Decide 决策扩展、微调、提权或停止
  -> Expand 进入下一轮周边资产
```

### Loop 各阶段定义

| 阶段 | 目标 | 输入 | 输出 | 负责人 |
|---|---|---|---|---|
| Discover | 发现经过市场验证的候选主题 | 竞品模板/分类、GSC query、Clarity/GA4、产品模板库 | Topic 候选进入 `seo_topic_universe.md` | 产品经理 + Codex |
| Validate | 判断搜索意图和产品承接是否成立 | Google US SERP Top 10、竞品承接、产品事实边界 | 是否进入 Topic Brief，或暂缓 | Gemini + Codex + 产品经理 |
| Architect | 设计一个 Topic 的资产包 | SERP 结论、现有页面、模板、Post、Use Case、内链图谱 | Pillar / Cluster / Template / Post / CTA / Schema 方案 | Codex |
| Build | 只实现当前最小必要资产 | 已通过 Brief 和评审 | 1 个主页面或 1 组内链/CTA/FAQ 小修 | Codex |
| Ship | 发布、验证、提交索引 | build、SEO gate、生产 HTML | 上线 URL、URL Inspection、观察窗口 | Codex + Mike |
| Observe | 冻结观察数据 | GSC 7d/28d、GA4、Clarity、Bing | 页面分区：Frozen / CTR Rescue / Golden Tuning / Authority Needed / Dead Lock | Codex |
| Decide | 决定下一步动作 | 数据分区、产品承接、外链情况 | 扩展周边资产、微调、外链提权、继续冻结或停止 | Mike + Codex |
| Expand | 围绕 Topic 做周边 | 已证明有效的 Pillar 或高意图 query | 支撑 Post、Template、Use Case、Alternative、pSEO 小批量试点 | Codex + Gemini + 产品经理 |

### 每个 Topic 的资产包标准

一个 Topic 进入执行后，Codex 需要同时管理这些资产，而不是只盯着一个页面：

| 资产 | 作用 | 是否必须 |
|---|---|---|
| Pillar Page | 承接主搜索意图和产品创建路径，通常是 Use Case 或 Solution | 必须 |
| Template Page | 给用户一个可直接创建的模板入口 | 优先 |
| Cluster Post | 回答教程、字段、流程、错误、集成等周边问题 | 视 SERP 决定 |
| Integration / Workflow Page | 承接 Webhook、Feishu、DingTalk、Slack 等后续流转 | 视产品能力决定 |
| Alternative / Comparison | 承接竞品替代和商业意图 | 只在 SERP 支持时做 |
| Internal Links | Cluster 指向 Pillar，Pillar 指向关键模板和支撑页 | 必须 |
| CTA Context | `source / intent / mode / prompt / template` 必须和搜索意图一致 | 必须 |
| Schema | Breadcrumb、FAQ、SoftwareApplication 等与可见内容一致 | 必须按页面类型判断 |
| Observation Ledger | 记录上线、提交、冻结、GSC/GA4 数据和下一步判断 | 必须 |

### Loop 的 WIP 限制

为了避免陷入“做完一个 Topic 又不知道做什么”，后续同时运行三类队列：

| 队列 | 同时数量 | 当前含义 |
|---|---:|---|
| Active Build | 1 | 当前只允许一个 Topic 或一个页面动作进入实现和部署 |
| Active Research | 2-3 | Gemini / 产品经理可以并行研究 2-3 个候选 Topic |
| Active Observe | 不限，但必须登记 | 已上线页面进入冻结观察，只看数据，不频繁改 |

Codex 的职责是每周维护这个 Loop：哪些 Topic 在 Discover、哪些在 Validate、哪些在 Observe、哪些需要 Expand，而不是只完成一个点状任务。

## 2. 五层增长架构

| 层级 | 作用 | 当前状态 | 主文档 |
|---|---|---|---|
| Topic Universe | 收集和筛选未来主题，避免闭门造车 | 已建立，已加入竞品市场验证门 | `seo_topic_universe.md` |
| Topic Cluster | 把已有页面组织成 Pillar / Cluster 内容茧房 | 已建立四组主集群 | `seo_topic_cluster_map.md` |
| Alternatives | 收割竞品替代和商业意图 | Typeform 已进入主线并冻结观察 | `seo_topic_cluster_map.md` |
| pSEO | 未来批量覆盖长尾组合词 | 暂缓大规模，只保留试点门槛 | `seo_growth_sop_v2.md` |
| GSC Data Tuning | 每周按数据分区微调页面 | 已建立 Not Indexed / Frozen / CTR Rescue / Golden Tuning / Authority Needed / Dead Lock 模型 | `seo_growth_sop_v2.md` |

## 3. 当前已进入主线的主题

| 主题 | 当前角色 | 状态 | 下一步 |
|---|---|---|---|
| Contact Form | 场景型 Pillar | `/use-cases/contact-form-builder-for-websites` 已上线，冻结观察 | 核查 `/templates/contact-us` 内链和创建入口 |
| Webhook Form | 功能型 Pillar | 已有 Use Case + 多篇支撑 Post，Clarity 已有 Google 来源访问；2026-06-25 已补全 Topic Cluster 配置 | 冻结观察 Webhook Pillar 和三篇支撑 Post 的 GSC/GA4/Clarity 反馈 |
| Typeform Alternative | Alternatives 商业意图收割层 | `/posts/typeform-alternatives` 已改造，冻结观察到 2026-07-05 | 不改正文，观察 GSC 回补和外链需求 |
| QR Code Form | 功能/场景交叉 Pillar | 已有 20-30 名区间信号 | 内链增强，等待是否进入 Golden Tuning |
| Lead Capture | 场景/行业候选集群 | 已有研究、Use Case 和模板修正 | 等 GSC 数据，后续可能升级为正式 Cluster |

## 4. 扩展主题池

扩展主题先进入 `seo_topic_universe.md`，不直接进入页面实现。

### 4.1 下一批最值得研究的主题

| 优先级 | 主题 | 市场验证 | 产品承接 | 建议动作 |
|---|---|---|---|---|
| P1 | Event Registration Form / QR Event Form | Jotform / Typeform / Tally 均有强重复信号 | `event-registration` 模板 + QR 能力 | 进入 Gemini SERP 研究候选 |
| P1 | Lead Capture Form Template / SaaS Lead Capture Form | Typeform / Tally 有 lead gen 强信号 | `lead-capture` 模板 + Lead Capture Use Case | 等 GSC 后进入 SERP 研究或 Cluster 升级 |
| P1 | Customer Feedback / Satisfaction / NPS | Jotform / Typeform / Tally 重复信号强 | `satisfaction-survey`、`event-feedback`、`nps-survey` 模板 | 进入 SERP 研究候选 |
| P1/P2 | Client Intake / Project Request Form | Tally / Fillout 有明显信号 | 可由 `contact-us` / `booking-consultation` 延展 | 先补产品承接定义，再研究 |
| P2 | Job Application Form Builder | 市场强 | `job-application` 模板 | ATS 边界确认后再研究 |
| P2 | Waitlist Form Builder | Tally / SaaS / indie 场景有信号 | `waitlist` 模板 | 等 Lead Capture / Event 之后 |

### 4.2 暂缓主题

| 主题 | 暂缓原因 |
|---|---|
| Order / Checkout / Payment Form | 市场很强，但当前支付/订单能力边界不适合承诺 |
| Form to CRM / Google Sheets | 若无稳定原生同步，不应作为主承诺 |
| ID / Qualification Verification | 高信任和合规语义较重，当前 MVP 不优先 |
| Expense / Receipt OCR | 与当前 SEO 主线不一致，且 OCR 不在 MVP 重点 |

## 5. 页面动作规则

任何页面动作必须先判断属于哪类：

| 类型 | 触发条件 | 动作 |
|---|---|---|
| Topic Cluster 内链 | 已有 Pillar / Cluster，但内链关系弱 | 补自然内链和 CTA intent，不大改正文 |
| CTR Rescue | 排名 1-10，但 CTR 明显低或 0 点击 | 只改 title / meta / SERP 摘要相关元素 |
| Golden Tuning | 排名 11-30，有稳定 impressions | 小范围补 FAQ、字段清单、结果感、内链 |
| Authority Needed | 排名 50-80+，query 明确但权重弱 | 先判断内容厚度，合格则内链/外链，不合格重新 Brief |
| Frozen | 刚上线、刚修改、刚提交索引 | 5-14 天不动主体 |
| pSEO 试点 | 同类页面已有 GSC 证明，产品可承接 | 每批 5-10 页，20% 人工抽检 |

## 6. 近期 4 周计划

### Week 1：体系连接和数据稳定

目标：

- 不新增页面。
- 完成 Webhook Cluster 内链核查和小修 Brief。2026-06-25 已完成代码配置小修，等待上线后观察。
- 继续观察 Contact / Typeform / QR / Webhook 已上线页面。
- 每天用 Clarity / GA4 看领先行为，用 GSC 回补做正式判断。

交付：

- Webhook Cluster 内链核查结果。
- 若缺链，形成小修 Brief。
- 更新 `seo_page_observation_ledger.md`。

### Week 2：第一轮分区复盘

目标：

- 用 GSC 7d / 28d 回补数据给重点页面打分区。
- 判断是否有 CTR Rescue 或 Golden Tuning 页面。
- 不在 Frozen 页面上做大改。

交付：

- 重点 URL 分区结果。
- 1 个最高优先级 Brief，可能来自 Webhook、QR 或 Contact。

### Week 3：扩展主题 SERP 研究

目标：

- 从 `seo_topic_universe.md` 中选 1-2 个市场验证主题交给 Gemini 做 Google SERP 研究。
- 优先候选：Event Registration / QR Event Form，Customer Feedback / Satisfaction / NPS。

交付：

- Gemini SERP 研究任务提示词。
- Codex 复核结论。
- 是否升级为 Topic Cluster 或 pSEO 试点的判断。

### Week 4：小范围实现或继续观察

目标：

- 只对已经通过 Brief 的动作做小范围实现。
- 如果没有足够 GSC 证据，就继续观察和外链。

交付：

- 1 个页面或内链动作上线。
- URL Inspection。
- 冻结观察记录。

## 7. 职责分工

| 角色 | 主要职责 | 不负责什么 |
|---|---|---|
| Mike | 方向确认、Google/Bing URL Inspection、外链/目录/社区执行、产品事实最终确认、资源优先级判断 | 不需要逐篇判断页面技术实现细节 |
| Codex | SEO 方法论、Topic Universe / Cluster Map、GSC/GA4/Clarity 分析、页面分区、Brief、代码/内容实现、验证、部署建议 | 不凭空发明 Topic，不越过产品事实边界 |
| Gemini / 外部研究助手 | Google SERP 抓取、竞品 Top 10、模板/分类市场样本、批量关键词初筛 | 不直接决定上线，不直接写最终页面结论 |
| 产品经理 | 产品定位、真实能力边界、创建路径承接、模板质量、SEO 页面进入后的激活漏斗 | 不负责 Google SERP 判断和排名策略 |
| UX / 体验负责人 | 首屏理解、CTA 清晰度、结果感、移动端可用性、竞品体验借鉴 | 不负责关键词优先级和技术 SEO 判断 |

具体 4 周排期和任务交接见：`seo_workplan_assignment_2026-06-25.md`。

## 8. 每周固定会议/复盘输入

每周复盘只看这些输入：

1. GSC 7d / 28d：impressions、clicks、CTR、average position、query、page。
2. GA4：landing pages、sessions、activation events。
3. Clarity：当天 Google 来源高意图会话、Pricing、CTA、无效点击、反复探索。
4. 新外链：URL、是否被索引、UTM referral、是否产生创建事件。
5. Topic Universe：是否出现新 query 或竞品验证主题。
6. Product funnel：`forms_new_view`、`template_use_click`、`form_generate`、`form_publish`、`form_submit`。

## 9. 当前立即执行顺序

1. Webhook Cluster 内链核查与配置小修已完成，等待上线后冻结观察。
2. 保持 Contact / Typeform / QR / Webhook 已改页面冻结观察。
3. 等 GSC 回补后给重点页面打 SOP V2 分区。
4. 每周把 GSC 新 query 回填到 `seo_topic_universe.md`。
5. 准备 Gemini SERP 研究任务：Event Registration / QR Event Form，Customer Feedback / Satisfaction / NPS。
6. Mike 继续长期外链和品牌提及，优先指向 Webhook Pillar、Contact Pillar、Typeform Alternatives Hub。

## 10. 当前不做

- 不大规模 pSEO。
- 不批量发博客。
- 不继续大改 `/posts/typeform-alternatives` 正文。
- 不追泛 `AI form builder` 大词做重页面。
- 不承诺 iframe embed、生产级邮件通知、spam protection、CRM 原生同步、unlimited free、支付/订单能力等未确认能力。

## 11. 一句话作战判断

当前最重要的不是多写页面，而是：

> 用市场验证过的 Topic 扩展未来空间，用 Topic Cluster 连接已有资产，用 GSC 分区决定微调动作，用外链和品牌提及补权重，最后才在条件成熟时做小批量 pSEO。
