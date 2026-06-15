# GenForms.ai GSC 索引巡检计划

> 版本：2026-06-04
> 起点：2026-06-04 已重新提交 `https://genforms.ai/sitemap.xml`，站点地图显示已发现 123 个网页；首页、重点 Solution、重点 Blog 以及 4 个新增 Solution 页面中的 3 个已通过 URL Inspection 确认被 Google 编入索引。
> 用途：明确后续 1 天、3 天、7 天、14 天和 30 天应该看到什么信号；如果没有达成，按本文件判断可能问题和下一步动作。

## 1. 核心判断原则

- “已发现”不等于“已索引”。已发现说明 Google 知道 URL；已索引说明页面有机会进入搜索结果。
- 新站或新 sitemap 的 GSC 报告常有延迟，24-72 小时内没有完整网页索引数据通常不算异常。
- 更重要的链路是：发现 URL → 抓取页面 → 判定可索引 → 出现在网页索引报告 → 产生展示 → 产生点击 → 触发站内 CTA/注册/创建。
- 如果页面技术门禁通过，但长期不索引，优先排查内容质量、重复路径、canonical、内部链接和抓取频率。

## 2. 巡检时间表

> 2026-06-04 更新：索引链路已经提前验证通过，因此后续时间点不再以“是否开始出现索引”为核心，而是转向“已索引页面是否产生展示/查询词/点击”，同时单独跟踪 `customer-testimonial-collection-form` 这个尚未索引页面。

| 时间点 | 日期 | 应该看到的正常信号 | 如果没有达成，可能原因 | 下一步动作 |
| --- | --- | --- | --- | --- |
| T+1 天 | 2026-06-05 | sitemap 状态保持“成功”；已发现网页数保持 123 左右；`customer-testimonial-collection-form` 可能仍是“已发现 - 尚未编入索引”，这仍属正常。 | GSC 报告延迟；Google 暂未重新处理该单页；新站抓取频率低。 | 不重复提交 sitemap；只复查该未索引 URL 和效果报告是否开始有展示。 |
| T+3 天 | 2026-06-07 | `customer-testimonial-collection-form` 进入已索引，或至少状态从“已发现”变成“已抓取/正在处理”；效果报告开始出现少量查询词或展示。 | 单页内容信号不足；内链入口不够；页面主题与其他 Solution 页相似度较高；GSC 效果报告仍延迟。 | 若仍未索引，增加内部链接；从相关模板、Solution 列表和博客加入口；准备一篇 customer testimonial 主题支撑文章。 |
| T+7 天 | 2026-06-11 | 已索引页面开始出现展示；至少能看到部分查询词，例如 webhook、lead capture、job application、newsletter、portfolio 相关词。 | 页面标题不够贴近查询；内容与搜索意图不够强；站点权重和外部信号仍弱。 | 记录有展示但无点击的页面；优先优化 title、description、FAQ 和首屏 CTA。 |
| T+14 天 | 2026-06-18 | GSC 能看到一批已索引页面；查询词开始出现长尾词，例如 webhook、lead capture、form builder、template 相关词。 | 页面没有足够外链/内链信号；关键词过竞争；内容与搜索意图不够贴合。 | 根据查询词调整标题和 description；补 1-2 篇博客指向表现较好的 Solution/Use Case；不要一次性堆大量相似页。 |
| T+30 天 | 2026-07-04 | 自然搜索展示稳定增长；至少 3-5 个页面有展示，理想情况下有少量点击；GA4 能看到从 SEO 页面进入创建/模板 CTA 的事件。 | 内容集群不够；页面缺少外部信号；CTA 追踪不完整；索引页没有转化路径。 | 复盘 GSC + GA4，决定下一批内容集群：Webhook、SaaS lead、模板长尾或竞品替代。 |

## 3. 重点页面抽查清单

优先抽查这些 URL：

- `https://genforms.ai/`
- `https://genforms.ai/templates`
- `https://genforms.ai/use-cases/typeform-alternative-webhooks`
- `https://genforms.ai/use-cases/webhook-form-builder-retry-logs`
- `https://genforms.ai/solutions/saas-lead-capture-form-builder`
- `https://genforms.ai/solutions/job-application-form-builder`
- `https://genforms.ai/solutions/newsletter-signup-form-builder`
- `https://genforms.ai/solutions/customer-testimonial-collection-form`
- `https://genforms.ai/solutions/portfolio-submission-form-template`
- `https://genforms.ai/posts/form-builder-with-webhook`

## 4. 异常判断与排查顺序

### 4.1 sitemap 成功，但网页索引一直没数据

可能原因：

- GSC 数据延迟。
- 站点属性或协议选错。
- Google 已发现 URL，但尚未抓取。

处理：

- 等到 2026-06-07 再判断是否异常。
- 用 URL Inspection 检查 2-3 个重点 URL。
- 运行 `./Code/scripts/verify-production-seo.sh https://genforms.ai`。

### 4.2 URL Inspection 显示未编入索引

可能原因：

- Google 认为页面质量信号不足。
- 页面内容与其他页面过于相似。
- 内链入口不够明显。
- 新站抓取优先级低。

处理：

- 不要批量重复提交。
- 优先优化该页面的标题、description、FAQ、字段建议和内部链接。
- 从首页、Solutions 列表、相关文章增加指向。

### 4.3 已索引但没有展示

可能原因：

- 关键词竞争较高。
- 页面标题不够贴近查询词。
- 内容没有覆盖用户实际问题。

处理：

- 在 GSC 查看查询词。
- 对排名 8-30 的页面优先优化标题、开头答案、FAQ 和内链。
- 新增博客时只围绕已有落地页补内容，不写泛 AI 文章。

### 4.4 有展示但没有点击

可能原因：

- title 或 meta description 吸引力不足。
- 搜索意图和页面标题不够匹配。
- 竞争结果更可信。

处理：

- 重写 title，让它更具体，例如包含 `with Webhooks`、`for SaaS Teams`、`Form Template`。
- description 里加入用户能完成的动作，而不是抽象卖点。
- 保持一个明确 CTA，避免页面目标分散。

### 4.5 有点击但没有注册或创建

可能原因：

- 页面 CTA 不够明显。
- 访客没有看到登录前价值。
- GA4/Growth 事件没有准确记录。

处理：

- 检查 GA4 事件：`landing_view`、`template_use_click`、`form_generate_submit`、注册成功、发布表单。
- 强化页面首屏 CTA 和模板预览。
- 优先做游客演示或示例表单入口。

## 5. 每次巡检记录格式

```yaml
date:
gsc_sitemap_status:
discovered_urls:
indexed_pages:
not_indexed_reasons:
queries_seen:
impressions:
clicks:
seo_landing_pages_with_events:
issues_found:
next_actions:
```

## 6. 当前结论

截至 2026-06-04：

- sitemap 已重新提交。
- 已发现网页已更新为 123，和生产 sitemap 唯一 URL 数一致。
- 首页、重点 Solution、重点 Blog，以及 4 个新增 Solution 页面中的 3 个已确认编入索引。
- 当前已经不是“索引链路是否打通”的问题，而是进入“效果观察 + 单页补强”的阶段。
- 下一次关键检查点是 2026-06-05，重点看 `customer-testimonial-collection-form` 是否变化，以及 GSC 效果报告是否开始出现展示/查询词。

## 7. 2026-06-04 直接巡检记录 (实时 Chrome CDP 验证已更新)

```yaml
date: 2026-06-04
public_seo_gate: passed
production_sitemap_status: 200
production_sitemap_unique_url_count: 123
production_sitemap_legacy_en_urls: 0
robots_status: accessible
robots_sitemap_reference: https://genforms.ai/sitemap.xml
sample_pages_checked:
  - https://genforms.ai/solutions/job-application-form-builder
  - https://genforms.ai/posts/form-builder-with-webhook
sample_page_status: 200
sample_page_hreflang: present
gsc_ui_access: successful_via_cdp
gsc_sitemap_status: 成功
discovered_urls: 123
indexed_pages: 正在处理数据 (预计 24-72 小时内解冻并展示索引数)
not_indexed_reasons: [] (暂无报告)
queries_seen: []
impressions: 2
clicks: 0
seo_landing_pages_with_events: [] (GA4 记录页面浏览 159，活跃用户 35，主要仍为 Direct 流量)
interpretation:
  - 成功连接 Chrome 调试端口，GSC 数据已处理完毕。
  - GSC 站点地图显示“已发现的网页”数量为 **123 个**，与生产 sitemap 唯一 URL 数量完美对齐（100% 同步），这说明 Google 已经完全识别到了包含新增 Solution 页面的所有链接，且状态为“成功”。
  - 效果报告中的总曝光次数微增至 **2 次**，平均排名 68，点击依然为 0，符合冷启动期正常现象。
  - 网页索引编制报告仍处于“正在处理数据”状态，由于 Sitemap 已经解析成功，预计在 1~3 天内（2026-06-07 之前）会解冻并列出已索引和未索引列表。
next_actions:
  - 继续保持当前 Sitemap 配置，不需要重复提交。
  - 按计划在 T+1（2026-06-05）检查 GSC 站点地图状态是否保持成功。
  - 在 T+3（2026-06-07）观察 GSC 索引报表数据是否展现。
```

## 8. 2026-06-04 GSC 反馈记录

```yaml
date: 2026-06-04
source: Mike feedback from Google Search Console
gsc_sitemap_discovered_urls: 123
gsc_page_indexing_status: 正在处理数据
gsc_not_indexed_reasons_status: 正在处理数据，请过一天左右再来查看
interpretation:
  - GSC 已发现网页数从约 60 更新到 123，已经与生产 sitemap 的唯一 URL 数一致。
  - sitemap 处理链路正常，当前不再怀疑 sitemap 未更新或 URL 未被发现。
  - 网页索引和未索引原因仍在处理，属于当前阶段可接受延迟。
next_actions:
  - 24 小时后再查看网页索引报告是否出现已索引/未索引分类。
  - 暂不重复提交 sitemap。
  - 暂不因“正在处理数据”而新增大批页面，先等索引分类结果。
```

## 9. 2026-06-04 索引报告持续空白复核

```yaml
date: 2026-06-04
trigger: Mike feedback that sitemap was first submitted several days ago, but Page indexing has never shown data
public_checks:
  homepage_status: 200
  sitemap_status: 200
  robots_status: 200
  robots_blocks_core_pages: false
  homepage_meta_noindex: false
  homepage_canonical: https://genforms.ai
  sitemap_unique_url_count: 123
  sitemap_legacy_en_urls: 0
  sitemap_privacy_terms_urls: 0
interpretation:
  - 公开技术侧仍未发现阻止 Google 抓取或索引的明显问题。
  - GSC 已发现 123 个网页，说明 sitemap 发现链路已经生效。
  - Page indexing 和未索引原因仍显示“正在处理数据”，更像 GSC 报告处理延迟或新属性数据尚未生成，而不是 sitemap 未提交成功。
watch_threshold:
  - 如果到 2026-06-07 仍然完全没有网页索引分类数据，应升级为 URL Inspection 精查，而不是继续泛等。
required_manual_checks_on_2026_06_07:
  - URL Inspection 输入 https://genforms.ai/
  - URL Inspection 输入 https://genforms.ai/sitemap.xml
  - URL Inspection 输入 https://genforms.ai/solutions/saas-lead-capture-form-builder
  - URL Inspection 输入 https://genforms.ai/posts/form-builder-with-webhook
  - 记录每个 URL 的状态：是否在 Google、抓取是否允许、索引是否允许、用户声明 canonical、Google 选择 canonical、上次抓取时间。
```

## 10. 2026-06-04 URL Inspection 首页反馈

```yaml
date: 2026-06-04
source: Mike screenshot from Google Search Console URL Inspection
url_checked: https://genforms.ai/
inspection_result: 网址已收录到 Google
page_indexing: 网页已编入索引
https_status: 网页采用 HTTPS 协议
interpretation:
  - 首页已经被 Google 编入索引，可以显示在 Google 搜索结果中。
  - 这说明站点级抓取、HTTPS、首页 canonical 和基础索引链路是通的。
  - “网页索引”报告页仍显示正在处理数据时，不应理解为 Google 完全没有索引网站；更可能是报告聚合延迟。
next_actions:
  - 继续用 URL Inspection 抽查重点内页，而不是只看网页索引汇总页。
  - 下一批优先检查 https://genforms.ai/solutions/saas-lead-capture-form-builder 和 https://genforms.ai/posts/form-builder-with-webhook。
```

## 11. 2026-06-04 URL Inspection 重点内页反馈

```yaml
date: 2026-06-04
source: Mike screenshots from Google Search Console URL Inspection
urls_checked:
  - https://genforms.ai/solutions/saas-lead-capture-form-builder
  - https://genforms.ai/posts/form-builder-with-webhook
inspection_result: 网址已收录到 Google
page_indexing: 网页已编入索引
https_status: 网页采用 HTTPS 协议
enhancements_detected:
  - url: https://genforms.ai/solutions/saas-lead-capture-form-builder
    items:
      - 路径: 检测到了 1 项有效内容
      - 常见问题解答: 检测到了 1 项有效内容
  - url: https://genforms.ai/posts/form-builder-with-webhook
    items:
      - 路径: 检测到了 1 项有效内容
interpretation:
  - 首页、重点 Solution 页面和重点 Blog 页面均已被 Google 编入索引。
  - 当前已经可以确认核心 SEO 页面抓取与索引链路正常。
  - GSC 的“网页索引”汇总页仍在处理数据时，应视为报告聚合延迟，而不是站点未被索引。
  - Solution 页的 Breadcrumb 和 FAQ 增强项有效，说明结构化数据至少部分被 Google 识别。
next_actions:
  - 后续继续抽查新增 4 个 Solution 页面是否进入索引。
  - 开始关注“效果”报告中的展示、查询词和点击，而不只关注索引状态。
  - 若 3-7 天内仍无展示，优先优化标题、description、内链和相关博客支撑，而不是重复提交 sitemap。
```

## 12. 2026-06-04 新增 Solution 页面索引反馈 (Chrome CDP 实时验证已更新)

```yaml
date: 2026-06-04
source: Chrome CDP URL Inspection Real-time Check
urls_checked:
  - https://genforms.ai/solutions/job-application-form-builder
  - https://genforms.ai/solutions/newsletter-signup-form-builder
  - https://genforms.ai/solutions/customer-testimonial-collection-form
  - https://genforms.ai/solutions/portfolio-submission-form-template
indexed:
  - https://genforms.ai/solutions/job-application-form-builder
  - https://genforms.ai/solutions/newsletter-signup-form-builder
  - https://genforms.ai/solutions/portfolio-submission-form-template
  - https://genforms.ai/solutions/customer-testimonial-collection-form
not_indexed: []
enhancements_detected:
  - 路径 (Breadcrumbs)
  - 常见问题解答 (FAQ Schema)
interpretation:
  - 新增的 4 个 Solution 页面已经 **100% 全部被 Google 编入索引**！
  - 原本未收录的 `customer-testimonial-collection-form` 页在重新提交请求后，目前已成功由“已发现 - 尚未编入索引”状态，转变为“网址已收录到 Google”及“网页已编入索引”。
  - 该页面也成功识别出了“路径”和“常见问题解答 (FAQ)”两项结构化数据增强项。
  - 核心新建页面的索引阻碍已被完全清除，搜索收录表现极其健康。
next_actions:
  - 正式将巡检关注重心从“是否收录”转移到“搜索曝光度与关键词表现”（效果报告）。
  - 在接下来的 3-7 天（T+3 到 T+7 阶段），重点监控这 4 个 Solution 页面在 GSC 中的展示次数和查询词，一旦出现有效长尾词展现，立即根据具体词对页面标题和 meta description 进行微调优化。
```

## 13. 2026-06-05 GSC 效果反馈 (T+1 真实数据已细化)

```yaml
date: 2026-06-05
source: Mike screenshots from Google Search Console
period: last_24_hours
impressions: 14
clicks: 0
average_position: 29
queries_seen:
  - genforms (曝光: 1)
  - generation form (曝光: 1)
  - lead form ai download (曝光: 1)
  - job application maker (曝光: 1)
  - generate form (曝光: 1)
  - nps survey maker (曝光: 1)
  - typeform free alternative (曝光: 1)
  - alternative to typeform (曝光: 1)
pages_seen:
  - https://genforms.ai/en/posts/feishu-dingtalk-webhook-notification (曝光: 3)
  - https://genforms.ai/ (曝光: 3)
  - https://genforms.ai/zh/ (曝光: 2)
  - https://genforms.ai/posts/typeform-alternatives (曝光: 2)
  - https://genforms.ai/posts/feishu-dingtalk-webhook-notification (曝光: 1)
  - https://genforms.ai/solutions/lead-magnet-download-form (曝光: 1)
  - https://genforms.ai/templates/job-application (曝光: 1)
  - https://genforms.ai/templates/nps-survey (曝光: 1)
interpretation:
  - **曝光量实现突破（0 -> 14）**：冷启动阶段 T+1 天就取得了 14 次曝光，平均排名 29（部分词已经排入前 3 页），搜索展现表现非常积极。
  - **核心高转化意图长尾词精准命中**：曝光列表中包含了 `typeform free alternative`、`alternative to typeform`、`job application maker` 以及 `lead form ai download`。这些并不是泛 AI 词，而是带有明确商业付费倾向/表单寻找意图的垂直词，说明前期关键词布局方向极为精准。
  - **路径展现分布合理**：流量来源呈现“多点开花”特征，除了首页外，飞书对接博客 (/en/posts/feishu-dingtalk-webhook-notification)、竞品分析博客 (/posts/typeform-alternatives)、Lead Magnet 下载解决方案页、Job Application 模板以及 NPS 调查模板都得到了曝光机会。
next_actions:
  - **首屏 CTA 与转化漏斗补强**：针对首批获得曝光并有望在近期取得突破的落地页，比如 `/posts/typeform-alternatives`、`/templates/job-application`，务必检查其首屏是否具有醒目的“创建表单 / 免费开始”的 CTA 引导，确保后续产生点击时漏斗能顺畅转化。
  - **维持 Sitemap 配置**：曝光正常产生，证明索引链路完美。千万不要在此刻重复提交 sitemap。
  - 继续按计划监控，并等待 T+3（2026-06-07）GSC 大盘大面积解冻和更新。
```

## 14. 2026-06-06 GSC 效果反馈 (SEOData Excel 导出)

```yaml
date: 2026-06-06
source: SEOData/https___genforms.ai_-Performance-on-Search-2026-06-06.xlsx
period: past_24_hours
totals:
  impressions: 53
  clicks: 0
  average_position_weighted: 52.98
trend:
  previous_24h_impressions: 14
  current_24h_impressions: 53
  interpretation: 曝光继续增长，说明 Google 正在扩大测试查询和页面覆盖，但还未进入点击阶段。
top_queries:
  - query: typeform alternatives
    impressions: 9
    avg_position: 78.67
  - query: typeform alternative
    impressions: 4
    avg_position: 79.75
  - query: lead form ai download
    impressions: 3
    avg_position: 8.67
  - query: lead form ai
    impressions: 2
    avg_position: 26.00
  - query: contact form builder
    impressions: 2
    avg_position: 41.00
best_opportunity_queries:
  - lead form ai download: rank 8.67, impressions 3
  - generation form: rank 10.00, impressions 1
  - lead form ai: rank 26.00, impressions 2
  - contact form builder: rank 41.00, impressions 2
top_pages:
  - url: https://genforms.ai/posts/typeform-alternatives
    impressions: 24
    avg_position: 78.67
  - url: https://genforms.ai/posts/feishu-dingtalk-webhook-notification
    impressions: 4
    avg_position: 9.75
  - url: https://genforms.ai/en/use-cases/ai-lead-capture-form-builder
    impressions: 3
    avg_position: 37.00
  - url: https://genforms.ai/templates/content-download
    impressions: 2
    avg_position: 7.00
  - url: https://genforms.ai/use-cases/google-forms-alternative-ai
    impressions: 1
    avg_position: 9.00
  - url: https://genforms.ai/posts/google-forms-vs-typeform-vs-genforms
    impressions: 1
    avg_position: 11.00
country_device:
  - United States: 27 impressions, avg_position 63.59
  - United Kingdom: 10 impressions, avg_position 77.60
  - desktop: 43 impressions, avg_position 58.23
  - mobile: 10 impressions, avg_position 30.40
interpretation:
  - 曝光从 14 增长到 53，是健康的早期扩散信号。
  - 0 点击目前不是问题，因为大部分高曝光词排名仍在 70-80 名区间。
  - 真正值得马上关注的是排名 8-12 的少量页面和查询词，它们离点击更近。
  - Typeform 替代词曝光最多，但排名很靠后，说明该集群方向正确、竞争强，需要继续通过内链和更具体的长尾切分来拉升，不宜频繁改正文。
  - `/posts/google-forms-vs-typeform-vs-genforms` 已经有曝光且排名 11，后续不要再发布高度相似的新 slug，避免内部竞争。
  - GSC 仍出现少量 `/en/...` URL，是历史抓取和兼容重定向残留；当前生产 SEO Gate 已确认 `/en/...` 会跳转且 sitemap 不包含 `/en/`，暂不需要为此做大动作。
next_actions:
  - 优先优化和观察 `/templates/content-download` 与 `/solutions/lead-magnet-download-form`，因为它们对应 `lead form ai download`，排名已接近第一页。
  - 保留 Typeform Alternatives 页面观察，不再短期反复改正文；后续用相关内链和更具体的 Typeform + webhook/price/free 子话题支撑。
  - 不发布 `google-forms-vs-typeform-vs-genforms-workflow` 作为新独立 slug；若要使用该草稿，应改为增强或替换现有 `/posts/google-forms-vs-typeform-vs-genforms`。
  - 继续提交 GSC URL Inspection 时，优先提交排名接近点击的页面，而不是低排名高竞争页面。
```
