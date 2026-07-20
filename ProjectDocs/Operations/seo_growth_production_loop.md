# GenForms SEO Growth Production Loop

> 版本：2026-07-03  
> 状态：Active  
> Goal：在产品事实和质量门禁下，将 SERP/GSC 证据稳定转化为 Topic 研究、Brief、内容生产、发布、观察、内链与 pSEO 小批量放大。  
> 吞吐目标：每月 12-20 个高质量内容动作；进入 Scale 后可提高到每月 20-30 个，但不得以页面数量替代点击、激活和合格线索。

## 1. 这个 Loop 解决什么问题

之前的 SEO 执行容易在两种状态间摆动：

- 为避免乱改页面，一次只推进一个点，整体速度过慢。
- 为追求长尾覆盖，想一次性批量铺页面，证据、产品事实和归因失控。

本 Loop 采用“**多管线并行、单 URL 串行、批次化发布**”模型：

- 多个 Topic 可以同时处于不同阶段。
- 同一个 URL 在冻结期内不能被多条任务重复修改。
- Build 以批次为单位，不以零散修改为单位。
- Observe 不占用 Research 和 Draft 产能。
- pSEO 先做 5-10 页试点，达到升级指标后才扩大。

## 2. 顶层成功标准

### 2.1 吞吐指标

稳定阶段每月完成：

- 4-6 个新高意图资产：Post、Template、Solution 或 Use Case。
- 4-6 个已有资产的实质优化：Golden Tuning、CTR Rescue、Cluster 内链或结果感增强。
- 4-8 个研究/Brief/证据包，为下一个月持续供给。
- 当 pSEO Gate 打开时，每月最多 1-2 个批次，每批 5-10 页；试点页数量单独记录，不用来冲高质量动作数量。

### 2.2 结果指标

Loop 不以“发布多少页”作为最终成功：

```text
qualified impressions
-> organic clicks
-> forms_new_view / template_use_click
-> form_generate
-> form_publish
-> form_submit
-> upgrade intent / qualified lead
```

升级优先看：

- 目标 query 与 owning page 关系是否清楚。
- 目标页面是否进入前 30 / 前 10。
- Search CTR 是否改善。
- 搜索用户是否进入创建、发布和提交闭环。
- 一个 Topic Cluster 是否形成多个页面共同增长，而不是单页偶然曝光。

## 3. 六条并行管线

### Lane A：Signal / Data Observe

Owner：Codex  
并发：不限页面，只读运行  
频率：每日轻量、每周正式分区

输入：

- GSC 1d/7d/28d、page × query。
- GA4 搜索着陆与产品漏斗。
- Clarity 合格真实 Session。
- Bing、索引、技术 SEO 和生产健康。

输出：

- Frozen / CTR Rescue / Golden Tuning / Authority Needed / Hold / Retire。
- GSC 新 query 回填 Topic Universe。
- 向 Lane B、C、F 发出候选，不直接改页面。

规则：

- 1d GSC 不完整时使用 7d/28d。
- Observe 可以同时覆盖很多页面，但不能绕过冻结窗口触发 Build。
- 404、CTA 失效、canonical/noindex 错误等物理 Bug 直接进入 Hotfix，不等待冻结结束。

### Lane B：Discover / SERP Research

Owner：Gemini 研究，Codex 复核  
并发：最多 3 个 Topic  
目标：每周完成 2-3 个可决定的证据包

进入条件：

- GSC 已出现产品相关 query；或
- 已有资产可能需要扩展/合并；或
- 产品当前能力直接支持且商业价值明确；或
- Scale Lane 需要验证下一批长尾组合。

必需产物：

- 地区和语言明确的 Google Top 10。
- 页面类型、主要意图、竞品、SERP 特征。
- GenForms 产品承接与不能承诺的能力。
- Owner 决策：existing tune / template-only / post-only / new asset / merge / reject。

退出：Decide / Hold / Reject。没有真实证据不能进入 Architect。

### Lane C：Architect / Brief

Owner：Codex；产品经理负责产品承接复核  
并发：最多 2 个 Brief  
目标：每周 1-2 个 Build-ready Brief

Brief 必须定义：

- Owning keyword、page type、URL ownership 和防 cannibalization。
- 独立用户任务和信息增益。
- 首屏承诺、主要模块、真实预览/字段/Prompt。
- CTA `source / intent / template / prompt`。
- 内链、Schema、canonical、hreflang、sitemap。
- 产品红线、测试、发布和观察窗口。

退出：Build Ready / Return to Research / Hold。

### Lane D：Build / Verify / Release

Owner：Codex 总管；Gemini 可按 Brief 执行内容或代码  
并发：最多 1 个 Active Build Batch  
批次大小：

- Editorial Batch：1-3 个相互关联的页面或一次 Cluster Tune。
- pSEO Pilot Batch：5-10 个同一结构族页面。

Build Gate：

1. Evidence、Product、Ownership、Freeze Gate 全部通过。
2. 页面不是只替换关键词。
3. 每个资产有真实模板/字段/Prompt/预览/FAQ 或独立工作流价值。
4. CTA 能进入当前真实产品路径。
5. 测试、build、SEO Gate 和生产验证方案完整。

发布节奏：

- 每周最多 2 个发布窗口，避免每天零散部署。
- 同一 Cluster 单次最多一个 Batch。
- 发布后立即进入 Lane E，不在发布窗口继续追加修改。

### Lane E：Freeze / Measure

Owner：Codex  
并发：多个 Batch  
窗口：常规 7-14 天；规模批次同时看 14/28/45 天

记录：

- Indexed / impressions / clicks / CTR / position。
- Query 是否相关，是否出现多个 URL 竞争同一 query。
- CTA、generate、publish、submit。
- 技术错误和真实 Session 卡点。

冻结期允许：

- 修 P0 技术错误。
- 继续其他 Lane 的 Research、Brief 和非重叠 Build。

冻结期禁止：

- 因 1-2 天零数据重写页面。
- 同时改 title、正文、FAQ、CTA 和内链导致无法归因。

### Lane F：Scale / Tune / Retire

Owner：Codex 决策，Mike 只处理需要外部账号权限的动作  
频率：每两周一次 Portfolio Review

可能动作：

- Scale：扩大同类长尾或 pSEO 下一批。
- Tune：CTR Rescue 或 Golden Tuning，每轮一个主变量。
- Authority：内链、外链、品牌提及，不继续堆正文。
- Merge：合并重复 Topic 或退役重叠 URL。
- Hold：数据不足，保留不动。
- Retire：长期无价值、冲突或产品不能承接。

## 4. Loop 状态机

```text
Backlog
  -> Evidence Queue
  -> SERP Captured
  -> Decide
  -> Brief Ready
  -> Build Batch
  -> Verify
  -> Publish
  -> Frozen Observe
  -> Scale | Tune | Authority | Hold | Merge | Retire
  -> 回到 Evidence Queue 或下一批 Build Batch
```

Hotfix 是旁路：

```text
Any State -> P0 Hotfix -> Verify -> 恢复原状态和观察窗口
```

## 5. pSEO Scale Gate

### 5.1 Prepare Gate

以下全部满足才允许设计批次：

- 同一 Topic Family 至少 3 个现有资产已有相关 impressions。
- Google SERP 证明用户需要模板/场景/组合页，而不是只需要一篇教程。
- 每一页能映射到真实模板 schema、字段、Prompt、预览和 CTA。
- 页面之间存在实质差异，不是城市/行业/关键词替换。
- 已确定 canonical、sitemap、内链和重复页处理。

### 5.2 Publish Gate

首批只允许 5-10 页，并满足：

- 人工抽检 100%。
- 产品事实、字段、Prompt、预览和 CTA E2E 通过。
- 相似性抽检通过，无 doorway 风险。
- 不与现有 Page Owner 抢 query。

### 5.3 14/28/45 天决策

- **Scale：** 大部分页面被索引，至少 3 页出现相关 impressions；至少 1 页或 owning cluster 进入前 30，且没有明显 cannibalization。
- **Tune：** 有相关 impressions、排名 11-30 或前 10 零点击，只允许一次单变量优化。
- **Hold：** 已索引但样本不足，不扩批次。
- **Stop：** 45 天仍无相关 impressions、出现重复意图、页面薄弱或产品承接失败。

这些是组合门槛，不以单一低样本数字机械决定。

## 6. 固定节奏

### 每日

- 09:30：Data Observe freshness + P0 异常检查。
- 不因普通波动创建新任务。

### 每周一：Portfolio Intake

- 从 GSC、Topic Universe、SERP Backlog 选最多 3 个 Research Topic。
- 维护 2 个 Brief Slot 和 1 个 Build Batch Slot。
- 检查冻结到期 Batch。

### 每周三：Evidence / Architect Review

- 关闭无证据或产品不承接的 Topic。
- 把最多 2 个 Topic 提升到 Brief。
- 选择下一个 Build Batch，不临时插单。

### 每周五：Release / Measure

- 发布通过 Verify 的 Batch，或明确本周不发布。
- 记录 freeze date、目标 query、URL、CTA intent 和复盘日。
- 更新 Mainline Board、Observation Ledger 和 Production Loop State。

### 每两周：Scale Review

- 按 Cluster 比较 impressions、clicks、position、激活和 cannibalization。
- 决定 Scale / Tune / Authority / Hold / Merge / Retire。
- pSEO 只能在这个节点扩大。

## 7. 容量与防乱规则

| 对象 | 并发上限 |
|---|---:|
| Active Research Topic | 3 |
| Active Brief | 2 |
| Active Build Batch | 1 |
| 单次 Editorial Batch | 1-3 URLs |
| 单次 pSEO Pilot | 5-10 URLs |
| 同一 URL Active Mutation | 1 |
| Active Observe Batch | 不限，但必须有复盘日 |

禁止：

- 观察中的 URL 被另一个 Topic 当作新 Build 修改。
- Research 结束后跳过 Decide/Brief 直接发布。
- 为达到月度数字降低产品事实或内容质量标准。
- 把多个弱同义关键词拆成多个近似 URL。

## 8. 角色

### Codex

- Goal Owner 和 Loop Controller。
- Data Observe、产品事实复核、Owner 决策、Brief、Build Gate、Verify 和 Scale 决策。
- 维护状态文件，确保没有 Topic 跳阶段。

### Gemini

- 按 Batch Prompt 完成 SERP、竞品、关键词和初稿。
- 一个 Topic 一个证据包；不得虚构排名或用推断代替 Google 结果。
- 只在 Brief 已通过后生产内容或实现。

### 产品经理 / UX

- 复核产品承接、用户任务、首屏、字段、CTA、结果感和红线。
- 不单独授权 SEO 发布。

### Mike

- 只处理需要外部账号、人工浏览器、GSC URL Inspection、第三方发布或范围决策的动作。
- 不需要手动运行 Data Observe Loop。
- Mike 的动作必须进入 `user_action_tracker.md`；没有外部动作时不新增待办。

## 9. 文档职责

- 本文：唯一 Loop 调度规则。
- `seo_growth_production_loop_state.md`：当前活动 Slot、批次、容量和下次节点。
- `seo_topic_loop_cursor_2026-06-30.md`：保留历史 Topic 证据库存，不再作为总调度器。
- `seo_page_observation_ledger.md`：URL 冻结和数据证据。
- `seo_mainline_board.md`：主题/资产全局视图。
- `seo_search_intent_research_system.md`：Research 方法。
- `seo_growth_sop_v2.md`：页面分区、Cluster、Authority 和 pSEO Gate 细则。
- `google_seo_quality_rules.md`：内容和 Google 合规红线。

## 10. Goal 完成条件

该 Goal 不是“发布一批页面”即完成。至少完成一个完整闭环：

1. Loop 连续运行 4 周。
2. 完成 12-20 个高质量内容动作，且状态可追踪。
3. 至少一个 Editorial 或 pSEO Batch 完成 Research -> Publish -> 28-day Decide。
4. 搜索点击或产品激活出现可归因改善；若没有改善，已明确 Stop/Change 策略。
5. Loop 不依赖 Mike 每天手动推动，只有外部权限动作才升级给 Mike。

