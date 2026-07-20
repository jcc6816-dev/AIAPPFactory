# GenForms.ai SEO Strategy Execution Index

> 版本：2026-07-03  
> 用途：把本轮 SEO 搜索意图研究、关键词研究、主题集群、页面审计、执行 Brief、上线冻结和第二批关键词研究串成一条可复用工作流。  
> 状态：SEO Growth Production Goal 已激活；研究、Brief、Build、Observe 和 Scale 改为多管线并行，由 `seo_growth_production_loop.md` 统一调度。

## 1. 当前阶段

当前 SEO 工作已经从“方向讨论”进入“研究驱动执行”阶段。

2026-07-03 起，执行方式从“单点任务推进”升级为“多管线 Production Loop”：

- 多个 Topic 可同时处于 Research、Brief、Frozen Observe 或 Scale。
- Active Build 仍保持一个 Batch，防止同一 URL 多线修改和归因混乱。
- 稳定阶段目标为每月 12-20 个高质量内容动作。
- pSEO 只允许 5-10 页试点批次，通过 14/28/45 天 Scale Gate 后再扩大。
- 当前运行状态见 `seo_growth_production_loop_state.md`。

已完成：

1. 搜索意图研究方法论。
2. 第一轮关键词候选池。
3. `AI lead capture` 单词组深挖样本。
4. 第一轮 10 个关键词横向研究。
5. E-E-A-T / 技术 SEO / 满意度 / 生命周期 Addendum。
6. 4 个已有 Use Case 承接页审计。
7. 第一批 2 个页面 Brief。
8. 第一批 2 个页面小范围优化、生产部署、Google/Bing URL Inspection 提交。
9. 第二批关键词研究。
10. Contact Form Google US SERP 采集、原始证据保存和 Codex 复核。
11. Contact Form 关键词簇与 Brief 修正为 Google 主证据版。
12. SEO Growth SOP V2 已建立，用于把 Topic Cluster、Alternatives、pSEO、Digital PR / Backlinks、GSC 分区、SERP 竞品对标、页面冻结和结构化数据统一成可执行规则。

下一步：

1. 按 `seo_growth_production_loop_state.md` 运行 2026-07-03 至 2026-07-17 首个 Cycle。
2. Observe、Research 和 Brief 并行；Build 仍以一个 Batch 为上限。
3. 2026-07-05 先复核 QR Golden Tuning 门槛；2026-07-10 至 07-13 复核集中到期的冻结 Batch。
4. 从 Event/QR、Lead Capture、Waitlist 中只选择一个 pSEO Prepare Family；首批发布仍需单独通过 5-10 页 Pilot Gate。
5. Authority Needed 页面优先安排内链、外链和品牌提及，不用新增同义 URL 或反复重写正文。

## 2. 文档地图

| 文档 | 角色 | 什么时候用 |
| --- | --- | --- |
| `seo_growth_production_loop.md` | SEO 生产总循环和唯一调度规则 | 决定每周 Research、Brief、Build、Observe、Scale 的容量、节奏和升级/停止条件 |
| `seo_growth_production_loop_state.md` | Production Loop 当前状态 | 查看 Active Slot、冻结批次、首个 Cycle 和下一个 Controller Action |
| `seo_growth_production_backlog_2026-07.md` | 7 月生产 Backlog 与吞吐核算 | 查看 12-16 个动作、负责人、时间窗、Gate 和完成定义 |
| `gemini_seo_research_batch_prompt_2026-07-03.md` | 首个 3-Topic Research Batch 唯一提示词 | 一次性让 Gemini 采集 QR、Lead、Typeform 的真实 Google US 证据 |
| `seo_pseo_family_prepare_2026-07.md` | pSEO 三 Family Prepare 预审 | 比较 Event/QR、Lead、Waitlist 的 3-asset、产品事实、意图和 Ownership Gate |
| `seo_pseo_pilot_manifest_schema_v1.json` | pSEO Pilot 机器可校验 manifest schema | 约束首批 5-10 页必须带证据、owner、真实字段/Prompt、CTA、差异性与测量计划 |
| `seo_pseo_pilot_quality_gate.md` | pSEO Pilot 人工 QA Gate | Build、发布和 14/28/45 天 Scale/Tune/Hold/Stop 前逐项检查 |
| `seo_growth_measurement_gap_audit_2026-07-03.md` | SEO 到产品结果的数据质量审计 | 判断 GSC、GA4、growth events、Form、Submission、qualified lead 是否可用于决策 |
| `seo_growth_measurement_contract_v1.md` | SEO Growth KPI 与归因契约 | 统一 clicks、create、publish、submit、upgrade intent、qualified lead 的定义、来源和窗口 |
| `seo_growth_attribution_repair_plan_2026-07.md` | Attribution Repair 三步法 Plan | Mike 确认后再修改 tracking、Form attribution、Admin report 与测试 |
| `notebooks/seo_growth_measurement_quality_audit_2026-07-03.ipynb` | 可重复数据质量 Notebook | 只读复核 event、Form、Submission 的覆盖、污染、identity 与 attribution 缺口 |
| `seo_growth_production_loop/research_batch_2026-07-03/codex_evidence_review.md` | 首个 3-Topic Batch 正式证据审计 | 修正 Gemini 对 QR、Lead、Typeform 的过度结论并给出 governing Decide |
| `notebooks/gemini_serp_batch_quality_audit_2026-07-03.ipynb` | SERP Batch 可重复完整性审计 | 验证 9 HTML、9 长截图、80 organic rows、US markers、缺失 snippets 与 canonical duplicate |
| `seo_brief_qr_scan_to_fill_visual_proof_2026-07.md` | QR Golden Tuning Build-ready Brief | 只增加扫码到手机单题流再到结果面板的视觉证明；Build 等 07-05 GSC Gate |
| `seo_authority_distribution_plan_typeform_2026-07.md` | Typeform Authority/Distribution Plan | 保护现有 owner，以真实价格和产品事实开展 editorial/community 分发 |
| `seo_search_intent_research_system.md` | SEO 研究方法论和质量闸门 | 任何新关键词、新页面、新 Brief 前先对齐 |
| `seo_global_operating_plan_2026-06-25.md` | SEO 全局作战计划 | 查看当前总策略、4 周计划、职责分工、立即执行顺序和当前不做事项 |
| `seo_workplan_assignment_2026-06-25.md` | SEO 任务分配与排期 | 分配 Codex、产品经理、Gemini、UX、Mike 的具体任务、交付格式和时间窗口 |
| `seo_growth_sop_v2.md` | SEO V2 执行 SOP | 每周复盘、主题集群整理、页面二次优化、竞品对标、外链和 pSEO 试点前使用，先判断增长策略和页面分区再决定动作 |
| `genforms_seo_intent_research_table.md` | 候选关键词证据库 | 收集、分级和筛选关键词时使用 |
| `seo_keyword_research_ai_lead_capture.md` | 单关键词深挖样本 | 评估一个关键词组是否值得做页面时使用 |
| `seo_first_round_keyword_research.md` | 第一轮 10 个关键词横向研究 | 选择第一批页面方向时使用 |
| `seo_first_round_keyword_research_addendum.md` | Brief 前补充校验 | 检查 E-E-A-T、技术 SEO、满意度和生命周期 |
| `seo_use_case_landing_page_audit.md` | 4 个已有承接页审计 | 进入页面 Brief 前判断页面现状与缺口 |
| `seo_brief_webhook_form_builder_retry_logs.md` | 第一批页面 Brief 1 | 评审 Webhook 页是否进入小范围优化 |
| `seo_brief_ai_lead_capture_form_builder.md` | 第一批页面 Brief 2 | 评审 AI Lead Capture 页是否进入小范围优化 |
| `seo_second_round_keyword_research.md` | 第二批关键词研究 | 第一批冻结观察期间，决定下一批 Brief 的优先级 |
| `seo_serp_capture_contact_form_builder_2026-06-19.md` | Contact Form SERP/市场调研校正版 | 用统一评分表校准竞品样本，避免只凭代表性判断 |
| `seo_serp_contact_form_builder_top10_2026-06-19.json` | Contact Form Top 10 机器可读样本 | 后续 SEO、产品、竞品分析复用 URL/title/description/page type |
| `seo_serp_contact_form_builder_top10_review_2026-06-19.md` | Contact Form Top 10 研究复盘 | 对比旧结论和新样本，修正页面定位与竞品集合 |
| `seo_keyword_cluster_contact_form_2026-06-19.md` | Contact Form 关键词簇研究 | 判断一组关键词是否同页承接、模板页承接或独立 Webhook 承接 |
| `seo_google_serp_capture_contact_form_required_2026-06-19.md` | Contact Form Google SERP 强制采集模板 | 已完成 Gemini US VPN 版本，可作为后续同类采集模板 |
| `seo_brief_contact_form_builder_for_websites.md` | 第二批页面 Brief 1 | 已修正为实现评审版；评审 Contact Form Builder 页是否进入小范围优化 |
| `seo_post_conversion_standard.md` | SEO Post 转化标准 | 任何 Post 发布或更新前检查搜索意图、CTA、创建入口、结果感模块、产品事实边界和结构化数据 |
| `seo_page_observation_ledger.md` | SEO 页面观察台账 | 每天查看 GSC/GA4 后记录页面状态、冻结窗口、下一步动作和是否进入 CTR/内容修复 |
| `seo_core_keyword_observation_list.md` | 核心关键词观察清单 | 每周固定跟踪 15-30 个核心 query、目标 URL、7d/28d 数据和下一步动作 |
| `seo_topic_universe.md` | SEO 主题宇宙 | 把场景、功能、集成、竞品、行业/角色和模板主题整理成扩展池，用于后续关键词研究和 pSEO 候选筛选 |
| `seo_topic_cluster_map.md` | SEO 主题集群地图 | 整理 Contact Form、Webhook、QR、Typeform 四组 Pillar / Cluster 关系、内链动作和缺口 |
| `seo_backlink_work_queue.md` | 外链工作待办目录 | Mike 长期执行目录提交、替代品平台、社区回答和 outreach，并记录 UTM/referral/收录状态 |
| `seo_post_conversion_audit_2026-06-21.md` | SEO Post 转化审计 | 复核旧 Post 是否符合“搜索意图 -> 结果感 -> 创建入口”的新标准，并决定 P0/P1/P2 改造顺序 |
| `seo_mainline_board.md` | SEO 主线作战板 | 统一查看关键词研究、Brief、页面/Post 改造、上线提交、冻结观察和下一步动作，避免 SEO 工作散乱 |
| `seo_brief_typeform_alternatives_structure_refresh.md` | Typeform Alternatives 老 Post 结构改造 Brief | 评审 `/posts/typeform-alternatives` 是否进入标题、结构、CTA、内链和事实边界改造 |
| `seo_brief_web_design_client_intake_form.md` | Batch 2 Topic 首个新页面 Brief | 评审 `web design client intake form` 是否进入新 Solution / Template 页面实现；当前为草案，待 Google Top 10 原始证据补全 |
| `seo_brief_event_registration_qr.md` | Event Registration / QR Event Architect Brief | 评审活动报名与扫码报名 Topic 是否进入 Build；定义 Pillar、Template、Cluster Post、内链、CTA intent、Schema 和票务/支付/核销红线 |

## 3. 执行阶段定义

### 阶段 1：研究资产冻结

完成标准：

- 研究方法、关键词表、第一轮研究、Addendum、承接页审计都已落文档。
- 每份文档职责清楚，不互相替代。
- 后续页面 Brief 必须引用这些文档，而不是重新拍脑袋。

当前状态：已完成。

### 阶段 2：第一批页面 Brief

目标：

- 先写 Brief，不直接改页面。
- 只处理最高优先级 2 页。

页面：

1. `/use-cases/webhook-form-builder-retry-logs`
2. `/use-cases/ai-lead-capture-form-builder`

完成标准：

- 每份 Brief 明确当前覆盖内容、缺失模块、建议改动、E-E-A-T、技术 SEO、CTA 承接、内链计划、验证指标和风险边界。

当前状态：已完成，并已进入生产冻结观察。

### 阶段 3：Brief 评审

目标：

- 和 Mike 一起确认哪些建议值得进入实现。
- 明确哪些只记录，不本轮做。

评审问题：

- 是否仍符合 MVP 能力边界？
- 是否会引入虚假承诺或未上线能力？
- 是否能保持 3-7 天观察可归因？
- 是否只改 1-2 页，而不是扩大到全站？

### 阶段 4：小范围实现

目标：

- 只对评审通过的 1-2 页做小范围优化。
- 优先改内容块、FAQ、内链、CTA 承接和 SEO Gate 覆盖。

禁止：

- 不批量新建页面。
- 不一次修改 4 个以上 SEO 页面。
- 不做大范围 UI 改版。
- 不改数据库、认证、计费。

### 阶段 5：验证与观察冻结

目标：

- 实现后完成构建、SEO Gate 和关键路径验证。
- 上线后进入 3-7 天冻结观察。

观察指标：

- GSC impressions / clicks / CTR / average position。
- query 是否更贴合目标意图。
- CTA click。
- `template_used` / `form_generate` / `form_publish`。

### 阶段 6：第二轮扩展

根据第一批结果选择路线：

- Webhook 表现好：做 `how to create a webhook form` 教程或 Webhook 内容簇。
- AI Lead Capture 表现好：优化 `/templates/lead-capture` 或研究 `lead capture form template`。
- Typeform/Google Forms query 增长：做可信比较页 Brief。
- Contact Form 有曝光无点击：做 FAQ/CTA/内链微调 Brief。

当前第二批研究排序：

1. `contact form builder`：Google US SERP 样本已补齐，关键词簇和 Brief 已修正，目标页为 `/use-cases/contact-form-builder-for-websites`，下一步是实现评审。
2. `typeform alternative with webhooks`：排第二，目标页 `/use-cases/typeform-alternative-webhooks`，必须保持事实边界。
3. `google forms alternative with webhooks`：先补 SERP capture 和产品能力边界，再判断 Brief。
4. `lead capture form template`：等待第一批 AI Lead 页面观察结果后再优化 `/templates/lead-capture`。

### 阶段 7：Post 发布前转化门禁

目标：

- 所有 SEO Post 不只满足内容质量，也必须能把高意图搜索用户带入产品创建路径。
- Post 发布前统一使用 `seo_post_conversion_standard.md` 检查。

完成标准：

- 明确主关键词、SERP 意图和页面类型。
- 首屏或第一屏后有场景化 CTA。
- CTA URL 至少包含 `source`，优先包含 `intent`、`template`、`prompt`。
- 有结果感模块，例如 webhook mini console、字段清单、对比表、模板预览或移动端扫码路径。
- 产品事实边界清楚，不承诺未上线能力。
- BlogPosting / BreadcrumbList 正常；如有可见 FAQ，则 FAQPage JSON-LD 与页面一致。

当前标杆：

- `/posts/send-form-submissions-to-webhook`

### 阶段 8：数据观察与旧内容修复

目标：

- 把已经上线的 Use Case 和 Post 纳入统一观察台账。
- 优先修复 Google 已经给过展示或排名测试的页面，而不是继续盲目增加新页面。

完成标准：

- 每个目标 URL 都有 7d / 28d GSC 与 GA4 基线。
- 页面状态明确：新发布观察、冻结观察、小样本观察、老页面审计候选、高优先级 CTR 候选或执行优化。
- 旧 Post 必须按 `seo_post_conversion_standard.md` 复核，确认 CTA intent、首屏动作、可视化结果感和产品事实边界。
- 每次改动后进入 3-7 天冻结观察，避免连续改动导致无法归因。

当前新增资产：

- `seo_mainline_board.md`
- `seo_page_observation_ledger.md`
- `seo_post_conversion_audit_2026-06-21.md`

### 阶段 9：SOP V2 分区执行

目标：

- 把页面优化从“看到数据就想改”升级为“先判断页面处在哪个区间，再选择动作”。
- 避免把未收录、低 CTR、11-30 名微调、50-80 名权重不足和长期无效页面混为一谈。
- 让外链、内链、标题摘要、正文信息增益、结构化数据和 pSEO 试点都有明确触发条件。

完成标准：

- 重点页面在 `seo_page_observation_ledger.md` 中标记 SOP V2 分区。
- CTR Rescue 页面只改 title/meta/摘要相关元素。
- Golden Tuning 页面每轮只补 1 个主变量，例如 FAQ、字段清单、结果感或内链。
- Authority Needed 页面先做 SERP 和内容厚度判断，再决定重新 Brief 或外链提权。
- pSEO 只在已有同类页面被 GSC 证明有 impressions 后，小批量 5-10 页试点。

当前状态：已建立 SOP，下一步是用现有 GSC 数据给重点页面打分区。

### 阶段 10：主题集群与增长策略整合

目标：

- 把 SEO 工作从“单页面优化”升级为“主题集群 + 商业意图收割 + 长尾放大 + 外链提权 + 数据微调”的组合策略。
- 明确每个页面属于哪个主题集群，避免 Post、Use Case、Template 互相孤立。
- 让内链从随机添加变成向 Pillar Page 传递主题权威。

完成标准：

- Contact Form、Webhook、QR、Typeform 四组主题集群有明确 Pillar Page。
- 每个已上线 Cluster Page 都有对应 Pillar 内链。
- 新扩展主题先进入 `seo_topic_universe.md`，再根据 SERP / GSC / 产品承接决定是否升级为 Topic Cluster 或 pSEO 试点。
- Alternatives 页面单独作为商业意图收割层保护和观察。
- pSEO 只在已有同类页面被 GSC 证明有 impressions 后启动 5-10 页试点。
- Digital PR / Backlinks 每月以 3-5 条高质量相关提及为目标，并记录 referral / branded search / 创建事件。

当前状态：SOP 已补齐战略层，Topic Universe 和 Topic Cluster Map 已建立；2026-06-25 已完成 Webhook Cluster 内链核查和代码配置小修，并记录到 `seo_brief_webhook_cluster_internal_link_audit_2026-06-25.md`。下一步是冻结观察 Webhook Pillar 和三篇支撑 Post，并每周把 GSC 新 query 回填到 Topic Universe。

## 4. 当前推荐动作

立即执行：

1. 每天 09:30 检查 SEO monitor 是否成功写入 GSC/GA4 快照。
2. 用 `seo_growth_sop_v2.md` 先判断页面属于 Topic Cluster、Alternatives、pSEO、Backlinks 还是 GSC 微调动作。
3. 用 `seo_topic_universe.md` 维护扩展主题池，把新 query 归入场景、功能、集成、竞品、行业/角色或模板维度。
4. 用 `seo_topic_cluster_map.md` 执行 Contact Form、Webhook、QR、Typeform 四组 Topic Cluster 内链清单；Webhook Cluster 本轮配置小修已完成，先观察。
5. 再给每个重点页面判断 Not Indexed / Frozen / CTR Rescue / Golden Tuning / Authority Needed / Dead Lock 分区。
6. 用 `seo_mainline_board.md` 查看每个关键词、页面和 Post 处于 Research / Brief / Published / Observe 哪个阶段。
7. 用 `seo_page_observation_ledger.md` 跟踪 Contact Form、Webhook、QR、Typeform 和重点 Post 的 7d / 28d 数据，并记录 SOP V2 分区。
8. 用 `seo_core_keyword_observation_list.md` 每周固定跟踪核心 query，不再只看单个页面当天波动。
9. 用 `seo_backlink_work_queue.md` 长期积累真实外链和品牌提及，不做垃圾外链或批量目录。
10. 让 `/posts/feishu-dingtalk-webhook-notification`、`/posts/send-form-submissions-to-webhook`、Contact Form / QR / Typeform 新页面保持冻结观察。
11. `/posts/typeform-alternatives` 的结构改造已完成并部署，Google/Bing URL Inspection 已提交，进入 2026-06-21 至 2026-07-05 冻结观察。
12. Webhook Cluster 小修上线后观察 7 天，重点看 `/use-cases/webhook-form-builder-retry-logs`、`/posts/form-builder-with-webhook`、`/posts/send-form-submissions-to-webhook` 的 impressions 和 `intent=webhook_form` 创建链路。
13. 按 `seo_workplan_assignment_2026-06-25.md` 分配产品经理从竞品拓展 Topic，Codex 准备 Gemini SERP 研究任务。

暂不执行：

- 不新建 SEO 页面。
- 不批量发布新博客。
- 不继续频繁修改已进入冻结观察的新 Use Case 页和新 Post。
- 不直接追 `AI form generator` 或泛 `Typeform alternative` 大词。
