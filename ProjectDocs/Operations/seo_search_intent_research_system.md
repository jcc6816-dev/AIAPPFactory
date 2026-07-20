# GenForms.ai SEO Search Intent Research System

> 版本：2026-06-18  
> 适用范围：GenForms.ai 英文公开站、SEO 页面、模板页、Use Case、Solution、Blog、竞品对比页和后续增长实验。  
> 文档定位：这是 SEO 选题和页面 Brief 的上游研究方法，不直接替代 `google_seo_quality_rules.md`、`low_competition_keyword_map.md` 或 `seo_content_topic_queue.md`。

## 1. 目标

本系统用于解决一个核心问题：

> 在创建任何 SEO 页面之前，先用数据和调研判断搜索用户真实想完成什么、Google 当前如何理解这个关键词、竞品如何满足这个意图，以及 GenForms.ai 能否给出更相关、更有用、更令人满意的答案。

最终产出必须服务增长漏斗：

```text
搜索曝光
-> 搜索点击
-> 页面满足搜索意图
-> 点击 CTA
-> 生成表单
-> 发布表单
-> 收到提交
-> 注册 / 付费 / 高质量线索
```

## 2. 基本原则

### 2.1 不靠臆测定关键词

关键词池不能只来自内部想象。任何候选关键词都必须标注来源、用户任务假设、产品承接能力和证据等级。

允许进入候选池的来源：

- GSC 已有 impressions / clicks / average position 的查询词。
- Google 自动补全、People Also Ask、Related Searches、SERP 特征。
- 竞品页面反推：标题、URL、H1、模板目录、Use Case 分类、对比页和文档页。
- GenForms 当前 MVP 能力反推：AI 生成表单、单题流、模板、分享链接、二维码、Webhook、提交存储、日志与重试、基础数据面板。
- 用户任务反推：收集线索、活动报名、把提交推送到系统、替代复杂表单工具、快速生成可发布表单。
- 第三方工具数据：Google Trends、Ahrefs、Semrush、Keywords Everywhere 等。没有这些工具时，必须注明未验证搜索量。

### 2.2 先看 Google 奖励什么，再决定页面类型

页面类型不能先拍板。必须先观察目标关键词的 SERP：

- 如果头部结果主要是模板页，说明 Google 倾向认为用户想拿来即用。
- 如果头部结果主要是教程，说明用户需要步骤和解释。
- 如果头部结果主要是产品页，说明用户有工具选择意图。
- 如果头部结果主要是对比清单，说明用户处于评估阶段。
- 如果头部结果出现大量文档、API、开发者页面，说明用户可能偏技术实现。
- 如果出现 Reddit、论坛或社区内容，说明用户可能不完全信任营销页面，正在寻找真实经验。

### 2.3 竞品不是用来复制的，而是用来找切入点

竞品拆解必须同时记录：

- 竞品做对了什么。
- Google 为什么可能奖励它。
- 用户在哪一步可能仍然不满意。
- GenForms 当前能力能否给出更轻、更快、更具体、更可执行的答案。

### 2.4 先形成研究结论，再沉淀规则

不能一边看关键词一边直接套“template -> 模板页”这类规则。正确顺序是：

1. 收集候选关键词。
2. 做 SERP 和竞品证据记录。
3. 形成关键词级研究结论。
4. 和人工一起分析竞品优势、缺口和 GenForms 切入点。
5. 再沉淀页面类型规则。
6. 最后输出页面 Brief。

## 3. 官方依据

本系统与 Google Search Central 的公开原则对齐：

- Google Search 分为 crawling、indexing、serving search results 三个阶段；页面被发现和索引不保证一定会展示或排名。
- Google 会分析页面内容、关键标签、图片、视频、canonical、语言、地区和可用性等信号，再在用户查询时返回相关和高质量结果。
- Search Console Performance report 可按 query、page、country 等维度查看 impressions、clicks 等指标，应作为关键词机会判断的核心数据源。
- Title link 和 meta description 会影响用户对搜索结果的理解和点击意愿，必须准确、具体、唯一，避免关键词堆砌和模板化。
- Google 强调 people-first content，反对为搜索排名而规模化生成低价值内容。

参考：

- [How Google Search Works](https://developers.google.com/search/docs/fundamentals/how-search-works)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [How to use Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [Influencing title links](https://developers.google.com/search/docs/appearance/title-link)
- [How to write meta descriptions](https://developers.google.com/search/docs/appearance/snippet)
- [Spam policies for Google web search](https://developers.google.com/search/docs/essentials/spam-policies)

## 4. 工作流总览

```text
候选关键词收集
-> 关键词证据分级
-> SERP 解读
-> 竞品页面拆解
-> 用户意图判断
-> 竞品优势 / 缺口 / 我们的切入点
-> 页面类型规则
-> 第一批页面 Brief
-> 上线后 GSC / GA4 / Clarity 验证
```

本流程的前三个交付物：

1. `GenForms SEO Intent Research Table`：关键词与 SERP 研究表。
2. `SEO Page Type Decision Rules`：页面类型决策规则。
3. `First SEO Page Briefs`：第一批页面 Brief。

## 5. 第一步：候选关键词收集

### 5.1 候选词字段

每个候选词必须记录：

| 字段 | 说明 |
| --- | --- |
| keyword | 原始英文关键词 |
| source | 来源：GSC / SERP suggest / PAA / competitor / product capability / user task / tool |
| source_detail | 具体来源，例如 GSC 日期范围、竞品 URL、Google 自动补全文案 |
| user_task_hypothesis | 用户搜索时可能想完成的任务 |
| product_fit | GenForms 当前 MVP 是否能真实承接 |
| commercial_value | 是否可能带来注册、创建、发布、Webhook、付费或高质量线索 |
| evidence_level | A / B / C / D，见下方定义 |
| research_status | candidate / serp_checked / analyzed / brief_ready / rejected |
| notes | 备注 |

### 5.2 免费搜索需求验证

如果没有 Ahrefs、Semrush、Keywords Everywhere 等第三方工具，候选词仍应尽量使用免费信号做基础验证：

- Google Search Console：已有 impressions / clicks / average position 是最高优先级信号。
- Google Trends：用于比较多个候选词的相对趋势、地区差异和季节性，不当作绝对搜索量。
- Google Keyword Planner：如果可用，用搜索量区间辅助判断商业词是否值得投入。
- Google 自动补全：候选词是否被补全或扩展，说明 Google 已看到一定搜索需求。
- People Also Ask：问题数量和问题方向可帮助判断用户是否有连续疑问。
- Related Searches：用于发现更窄、更接近任务完成的长尾词。
- 竞品目录和模板库：多个成熟竞品反复覆盖的主题，可以作为需求存在的辅助证据。

没有任何外部信号的词，只能标为 `C` 或 `D`，不得直接进入页面生产。

### 5.3 证据等级

| 等级 | 定义 | 可用于什么 |
| --- | --- | --- |
| A | GSC 已有 impressions 或 clicks，且 query 与产品能力相关 | 优先优化已有页面或新建强相关承接页 |
| B | Google SERP 自动补全、PAA、Related Searches 或竞品多次出现 | 可进入 SERP 研究 |
| C | 产品能力和用户任务强相关，但暂无搜索证据 | 可作为实验候选，不直接进入高优先级 |
| D | 内部灵感或泛行业词，未验证需求 | 仅记录，不进入页面生产 |

### 5.4 候选词来源模板

```yaml
keyword:
source:
source_detail:
user_task_hypothesis:
product_fit: high | medium | low
commercial_value: high | medium | low
evidence_level: A | B | C | D
research_status: candidate
notes:
```

## 6. 第二步：SERP 解读

### 6.1 SERP 观察项

每个进入研究的关键词至少检查：

- Top 10 自然结果 URL。
- 每个结果的页面类型：product / template / guide / comparison / listicle / docs / community / marketplace / video。
- SERP 特征：广告、AI Overview、People Also Ask、视频、图片、Reddit/论坛、工具卡片、Featured Snippet。
- 排名前 3 的标题和描述如何定义问题。
- 是否出现强品牌垄断。
- 是否出现多个不同意图混在一起。
- 是否存在更窄、更清晰的长尾词。

### 6.2 SERP 意图判断

| SERP 信号 | 初步判断 | GenForms 可能动作 |
| --- | --- | --- |
| 模板页多 | 用户想直接拿来用 | 做模板页，首屏预览 + Use this template |
| 教程多 | 用户想学步骤 | 做 Post / Guide，步骤 + 示例 + 创建 CTA |
| 产品页多 | 用户想找工具 | 做 Solution / Product landing，强调能力和低摩擦创建 |
| 对比清单多 | 用户想评估选择 | 做对比页或资源页，避免虚假排行 |
| 文档 / API 多 | 用户偏技术实现 | 做工作流页，加入 payload、失败原因和配置说明 |
| 社区结果多 | 用户寻找真实评价 | 做更诚实的经验型页面，减少营销口吻 |
| 结果混杂 | 意图不稳定 | 拆成长尾词，不急着做主词 |

### 6.3 SERP 研究模板

```yaml
keyword:
checked_at:
locale: en-US
device: desktop | mobile
serp_summary:
dominant_result_type:
secondary_result_types:
serp_features:
top_results:
  - rank:
    url:
    brand:
    page_type:
    title:
    visible_angle:
google_intent_read:
intent_confidence: high | medium | low
long_tail_opportunities:
notes:
```

## 7. 第三步：竞品页面拆解

### 7.1 拆解对象

优先拆：

- 排名前 3 的页面。
- 最像 GenForms 当前产品路径的页面。
- 最强品牌页面。
- 看起来弱但排名好的页面。

### 7.2 拆解字段

| 字段 | 要回答的问题 |
| --- | --- |
| page_url | 页面地址 |
| brand | 竞品或站点 |
| page_type | 页面类型 |
| first_screen_promise | 首屏承诺什么 |
| user_problem_definition | 它如何定义用户问题 |
| key_content_modules | 主要内容模块 |
| proof_points | 信任证据：模板数、客户、评价、案例、集成、截图 |
| primary_cta | 主 CTA |
| secondary_cta | 次 CTA |
| conversion_path | 点击后去注册、模板、demo、文档还是创建 |
| friction | 注册前能不能看到价值，是否太复杂 |
| strength | 值得借鉴的点 |
| gap | 没满足用户的点 |
| genforms_opening | GenForms 可以从哪里切入 |

### 7.3 竞品拆解模板

```yaml
keyword:
competitor_url:
brand:
page_type:
first_screen_promise:
user_problem_definition:
key_content_modules:
proof_points:
primary_cta:
secondary_cta:
conversion_path:
friction:
strength:
gap:
genforms_opening:
```

## 8. 第四步：关键词级研究结论

每个关键词研究完以后，必须形成结论，而不是只留原始观察。

### 8.1 结论字段

| 字段 | 说明 |
| --- | --- |
| google_intent_read | Google 当前更像把它理解成什么意图 |
| user_intent | 搜索用户真正想完成什么 |
| search_stage | discovery / learning / evaluation / execution / migration |
| competitor_advantages | 竞品优势 |
| competitor_gaps | 竞品缺口 |
| genforms_opening | 我们可以撕开的切入点 |
| recommended_page_type | 推荐页面类型 |
| recommended_cta | 推荐主 CTA |
| supporting_assets | 需要模板、截图、payload、FAQ、内链、工具还是案例 |
| priority | P0 / P1 / P2 / rejected |
| confidence | high / medium / low |
| decision | build / optimize_existing / observe / reject |

### 8.2 结论模板

```yaml
keyword:
google_intent_read:
user_intent:
search_stage:
competitor_advantages:
  - 
competitor_gaps:
  - 
genforms_opening:
recommended_page_type:
recommended_cta:
supporting_assets:
  - 
priority:
confidence:
decision:
reason:
```

## 9. 第五步：页面类型规则沉淀

页面类型规则必须从一批关键词研究结论中归纳，不允许一开始固定。

初始规则可以按以下方向沉淀，但每条规则都必须能追溯到研究样本：

| 关键词信号 | 可能意图 | 候选页面类型 | 默认 CTA |
| --- | --- | --- | --- |
| `template`, `example`, `sample` | 拿来即用 | Template page | Use this template |
| `how to`, `guide`, `steps` | 学会怎么做 | Blog guide / tutorial | Create this form |
| `with webhook`, `to slack`, `to google sheets`, `notification` | 配置工作流 | Workflow page / Use Case | Create a webhook form |
| `alternative`, `vs`, `compare` | 替代和评估 | Comparison page | Try GenForms |
| `AI ... generator` | 快速生成 | Product / tool page | Generate now |
| 行业 + `form` | 垂直场景 | Solution page | Create this form |

规则沉淀时必须附上：

- 支撑关键词样本。
- SERP 观察依据。
- 适用边界。
- 不适用场景。
- 推荐产品落点。

## 10. 第六步：页面 Brief

只有满足以下条件，才能写页面 Brief：

- 关键词来源清楚。
- SERP 已检查。
- 至少 3 个头部页面已拆解，或说明为什么不足 3 个。
- 已形成关键词级研究结论。
- 已明确 GenForms 当前 MVP 能兑现页面承诺。
- 已明确页面 CTA 和产品落点。

### 10.1 Brief 模板

```yaml
page_name:
target_url:
primary_keyword:
secondary_keywords:
source_keywords:
search_intent:
google_serp_read:
competitor_summary:
  strengths:
    - 
  gaps:
    - 
genforms_angle:
page_type:
target_reader:
first_screen_promise:
must_include_modules:
  - 
main_cta:
secondary_cta:
internal_links:
  - 
structured_data:
eeat_signals:
  experience:
  expertise:
  authority:
  trust:
technical_seo_checks:
  canonical:
  hreflang:
  mobile_first:
  core_web_vitals:
  structured_data_matches_visible_content:
  internal_links:
success_metrics:
  gsc:
    - impressions
    - clicks
    - ctr
    - average_position
  product:
    - cta_click
    - form_generate
    - form_publish
risk_notes:
```

## 11. 页面满意度标准

每个页面 Brief 都必须定义“用户满意”的标准。

| 页面类型 | 用户满意标准 | 常见失败 |
| --- | --- | --- |
| Template page | 用户能确认模板适合自己，并能直接使用 | 只有介绍，没有预览和字段 |
| Blog guide | 用户读完知道下一步怎么做 | 内容泛泛，没有步骤和产品落点 |
| Workflow page | 用户知道如何把表单接入下游流程 | 没有 payload、配置步骤和失败处理 |
| Comparison page | 用户知道什么场景下 GenForms 更适合 | 虚假贬低竞品，或只做营销口号 |
| Solution page | 用户认为页面描述了自己的业务场景 | 场景太泛，和模板/CTA 不匹配 |
| Tool page | 用户能马上完成一个小任务 | 只有长文，没有可互动动作 |

### 11.1 量化满意度基准

定性判断必须配合可观察指标。下列数值是早期参考线，不是硬 KPI；当样本量过小、bot 流量明显或 Mike 自测混入时，不做强结论。

| 页面类型 | 量化参考线 |
| --- | --- |
| Template page | CTA 点击率 > 8%；停留时间 > 30s；进入 `/forms/new?template=...` 后出现 `template_use_click` 或 `form_generate` |
| Blog guide | 滚动深度 > 60%；CTA 点击率 > 3%；至少点击 1 个相关 Use Case / Template 内链 |
| Workflow page | CTA 点击率 > 5%；出现 `form_generate`；用户查看 payload、Webhook 或 FAQ 模块 |
| Comparison page | 停留时间 > 45s；至少点击 1 个内链或 CTA；低快速返回率 |
| Solution page | CTA 点击率 > 5%；相关模板或创建入口点击增长 |
| Tool page | 触发工具交互事件；进入 `form_generate` 或等价产品动作 |

样本门槛：

- 单页自然搜索访问少于 20 次时，只记录现象，不做结论。
- 连续 3-7 天趋势一致时，再进入优化动作。
- 已经有 GSC 信号的页面优化后进入观察冻结期，不连续大改。

## 12. E-E-A-T 与信任信号

每个 Brief 都必须说明页面如何建立 Experience、Expertise、Authoritativeness、Trustworthiness。GenForms 当前阶段不应伪造权威背书，而应优先展示真实产品能力、边界和可操作细节。

| 信号 | GenForms 可用表达 |
| --- | --- |
| Experience | 展示实际表单预览、字段清单、提交路径、Webhook payload、后台日志或用户任务流程 |
| Expertise | 解释字段设计、筛选问题、Webhook 失败原因、重试策略、隐私和数据处理边界 |
| Authority | 使用真实内链、相关模板、官方文档、产品截图、可验证的功能事实；后续可加入真实客户案例 |
| Trust | 清楚说明当前能做什么、不能做什么；避免夸大 CRM/ATS/双向同步等未上线能力；提供隐私、价格和产品边界链接 |

页面不得使用虚假评价、虚假评分、虚假客户、虚假日期或不存在的集成能力来制造信任。

## 13. 技术 SEO 检查

内容研究不能替代技术 SEO。任何进入 Brief 或上线流程的页面，都必须引用并遵守 `google_seo_quality_rules.md`，并至少检查：

| 技术项 | 要求 |
| --- | --- |
| HTTP status | 可索引页面返回 200 |
| Indexability | 不被 robots.txt、noindex、登录态或客户端空壳阻挡 |
| Canonical | 每个页面有唯一、正确 canonical |
| Hreflang | 中英双语页面互指清晰，避免 `/en` 兼容路径进入主索引 |
| Title / Description | 唯一、准确、非关键词堆砌 |
| Structured data | 只标记页面可见内容；类型以 `google_seo_quality_rules.md` 允许项为准 |
| Internal links | 新页面至少有 2 个自然内链入口，且锚文本与意图一致 |
| Mobile-first | 移动端首屏能看见主题、预览或 CTA，不重叠、不遮挡 |
| Core Web Vitals | 以 PageSpeed / CrUX 可得数据观察 LCP、INP、CLS；性能问题不得靠删除核心 SEO 内容解决 |

每次新增或显著修改 SEO 页面后，应按现有发布流程运行生产 SEO Gate。

## 14. 优先级评分

每个关键词按 1-5 分评分，满分 25 分。

| 维度 | 说明 |
| --- | --- |
| Intent clarity | 用户任务是否明确 |
| Product fit | 当前 MVP 是否能真实承接 |
| Commercial value | 是否可能带来创建、发布、Webhook、付费或线索 |
| SERP gap | 头部结果是否存在可切入缺口 |
| Execution cost | 我们是否能低成本做出高质量页面 |

优先级建议：

- 21-25：P0，进入第一批 Brief。
- 16-20：P1，进入候选队列。
- 11-15：P2，继续观察或等待产品能力。
- 10 以下：暂缓或拒绝。

## 15. 上线后验证

页面上线后必须用数据反向验证搜索意图判断。

### 15.1 GSC 验证

观察：

- Google 给这个页面分配了哪些 query。
- query 是否符合 Brief 的目标意图。
- impressions 是否出现。
- CTR 是否明显偏低。
- average position 是否进入 8-30 的可优化区间。
- 页面是否被错误 query 命中。

动作：

- 有曝光没点击：优先优化 title、description、首屏承诺。
- 有点击没 CTA：优化首屏 CTA、页面结构和产品落点。
- query 偏离目标：收紧主题、调整内链锚文本和 H1/H2。
- 排名 8-30：增加 FAQ、模板示例、内部链接、实操细节。
- 完全无曝光：检查索引、内链、页面质量、关键词是否过窄。

### 15.2 GA4 / 产品事件验证

观察：

- SEO 页面访问。
- CTA 点击。
- `form_generate`。
- `form_publish`。
- `form_submit`。
- 注册和付费意图。

若页面有 SEO 点击但没有产品动作，说明页面可能满足了阅读意图，但没有自然承接任务完成。

### 15.3 观察冻结

对已有 GSC 信号的页面，优化后进入 3-7 天观察期；不要连续频繁修改同一页面，除非发现技术 SEO 错误、事实错误或生产故障。

## 16. 内容生命周期管理

SEO 页面上线后需要持续管理，不能只创建不维护。

### 16.1 复查节奏

| 时间点 | 复查重点 |
| --- | --- |
| 上线后 3-7 天 | 是否被发现、是否有 impressions、是否出现错误 query |
| 上线后 14 天 | 是否进入有效 query 池，是否需要 title/description 或内链微调 |
| 上线后 30 天 | 是否有点击、CTA、`form_generate`，是否值得继续投入 |
| 上线后 60-90 天 | 内容是否过时，是否需要合并、扩展、冻结或下调优先级 |

### 16.2 更新触发条件

允许更新：

- GSC 出现高曝光低点击。
- 页面排名 8-30 且搜索意图明确。
- Google 给错 query，需要收紧主题。
- 产品能力变化，原页面需要事实同步。
- 竞品 SERP 形态明显变化。
- 页面包含过时信息、失效链接或事实风险。

暂缓更新：

- 页面刚优化后仍在 3-7 天观察期。
- 单日波动，没有连续趋势。
- 只有内部主观感觉，没有 GSC/GA4/Clarity 证据。

### 16.3 合并与归档

如果多个页面长期覆盖相同意图、内容高度相似、都没有有效 GSC 信号，应考虑：

- 合并为一个更强页面。
- 保留最清晰 canonical。
- 移除或 noindex 低价值重复页面。
- 更新内链指向主页面。

任何合并或 noindex 动作都必须先列出影响 URL 和预期风险。

## 17. 禁止事项

- 不允许只因为内部认为某词重要，就直接写页面。
- 不允许没有 SERP 证据就断言 Google 理解了某个意图。
- 不允许复制竞品结构后只替换品牌名。
- 不允许用未上线能力承诺用户任务。
- 不允许批量生成高度相似的行业页、模板页或对比页。
- 不允许为了新鲜度只改日期。
- 不允许把所有关键词都做成 Blog。
- 不允许把所有页面都导向通用首页。

## 18. 与现有文档关系

- `google_seo_quality_rules.md`：质量与合规红线，本系统所有输出必须遵守。
- `low_competition_keyword_map.md`：已有关键词资产，本系统可重新验证其来源、SERP 和优先级。
- `seo_content_topic_queue.md`：内容生产队列，本系统负责提供更可靠的上游研究依据。
- `growth_data_operating_system.md`：上线后的 GSC、GA4、Clarity、PageSpeed 验证体系。
- `genforms_growth_operating_guideline.md`：增长漏斗和商业目标，本系统负责提高入口页面的搜索意图命中率。

## 19. 下一步执行建议

1. 新建 `GenForms SEO Intent Research Table`，先放 20-30 个候选词，不急着写页面。
2. 对每个候选词标注来源和证据等级。
3. 优先选择 10 个 evidence level A/B 的词做 SERP 与竞品拆解。
4. 每个关键词形成研究结论：Google 理解、竞品优势、竞品缺口、GenForms 切入点。
5. 与 Mike 共同复核结论后，再沉淀页面类型规则。
6. 最后只选择 3-5 个 P0 页面写 Brief 并进入生产。
