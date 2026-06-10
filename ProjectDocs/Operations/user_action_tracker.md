# GenForms.ai Mike 协作待办看板

> 版本：2026-06-07
> 用途：记录需要 Mike 手动完成、确认或反馈的事项。后续 Mike 问 Codex 或 Gemini “我还有哪些工作要做”时，必须优先读取本文件。
> 定位：这是 Mike 工作安排的唯一事实源，不允许把给 Mike 的待办长期散落在日报、聊天记录或单个 Agent 报告里。

## 使用规则

- `待处理`：需要 Mike 操作或确认。
- `进行中`：Mike 已开始处理，但还没反馈完成。
- `已完成`：Mike 已明确反馈完成，Codex 已确认或记录。
- `暂缓`：当前不急，等条件成熟再做。
- `等待产物`：需要 Gemini 或 Codex 先产出/复核材料，Mike 暂时不应执行。

## Agent 共用规则

Codex 和 Gemini 都必须遵守：

1. 如果要给 Mike 安排工作，必须更新或引用本文件。
2. 不允许只在执行报告、日报或聊天里给 Mike 安排待办，而不同步到本文件。
3. 当 Mike 问“我还有哪些工作要做”时，必须先读取本文件，再回答。
4. 新增待办必须写清：编| U-004 | 待处理 | P1 | 在 GA4 检查新增增长事件参数 | 访问网站并点击首页 prompt生成、模板使用、表单生成、发布等关键动作；24 小时内在 GA4 查看是否能看到 `landing_view`、`ai_generate_submit`、`template_use_click`、`publish_form`、`page_leave` 等事件，以及 `page_location`、`page_path`、`cta_text`、`template_id`、`entry_point`、`landing_slug` 参数。 | GA4 能区分页面来源和按钮点击；如果看不到，反馈具体事件列表截图。 |
| U-006 | 待处理 | P0 | 2026-06-05 检查 GSC sitemap 与 URL Inspection 初始状态 | 按 [GSC 索引巡检计划](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/gsc_indexing_check_plan.md) 的 T+1 天节点，查看 sitemap 是否仍为成功、已发现网页是否接近或高于 60，并抽查 2-3 个重点 URL Inspection。 | 如果 sitemap 成功且 URL 可抓取，继续等待；如果失败或不可抓取，反馈截图。 |
| U-008 | 待处理 | P0 | 2026-06-11 做第一次 7 天索引复盘 | 按巡检计划 T+7 天节点，查看是否至少有部分首页、模板、Use Case 或 Solution 页面进入已编入索引，并记录是否出现展示。 | 如果 7 天仍无索引，优先排查内容质量、内链和抓取频率，不继续盲目加页面。 |
| U-010 | 待处理 | P1 | 提交 5 个低风险工具目录作为外部发现信号 | 按 [低风险目录提交包](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/directory_submission_pack.md) 的第一轮具体提交队列执行：ListAi.cc、AI Workbench、Fushion NoCode Directory、NavTools AI、Future-pedia.com。每个提交使用文档里的 UTM 链接、短描述、分类和素材 URL。 | 获得第一批外部发现信号和少量外链；不以短期转化为目标，不做夸大宣传，不一次性提交过多站点。 |
| U-018 | 待处理 | P1 | 发布 AI Lead Capture 长尾博客 | `reworked-post-ai-lead-capture-admin-payload-2026-06-07.md` 已导入为后台草稿。建议在 Webhook 博客收录 24-48 小时后（明天 6 月 7 日）手动将状态修改为 Online，并去 GSC 请求索引。 | 避免同一天集中发布相近增长内容；发布前确认页面显示正常，并提交 GSC。 |
| U-021 | 待处理 | P1 | 检查 Workbuddy 并在 Indie Hackers 发帖 | 督促 Workbuddy 在 IH 每日发表 1-2 条有价值评论积累活跃度。一旦其发帖权限解锁，让其使用 `/AI-Team/reports/gemini/external-discovery-action-pack-2026-06-07.md` 里的文案在 IH 发表经验贴。 | 确认贴子发布成功，并将结果链接写回结果文件。 |
| U-023 | 待处理 | P0 | 检查 Workbuddy 执行 AlternativeTo Phase 2 提交结果 | 6 月 13 日（冷却期满）后，检查 Workbuddy 是否使用 `/Code/public/logo.png` 将 GenForms.ai 成功提交到 AlternativeTo，并建立与 Typeform/Google Forms 的替代品关系。 | 确认 AlternativeTo 提交成功，并产生提交申请记录。 |
| U-024 | 待处理 | P2 | 检查并发布 Gemini 编写 of Lark 飞书海外版 Webhook 博客 | 已由 Gemini 撰写并导入 Supabase 数据库为草稿（UUID: 49e09548-2ea9-4dc9-a75f-fb1f40bc8707）。请 Mike 在后台检查内容，修改状态为 Online 并提交 GSC 抓取。 | 博客成功上线并提交 GSC 抓取。 |
| U-025 | 待处理 | P1 | 检查并修改高展现页 (Typeform Alternatives) 转化小组件与 CTA 区域 | Gemini 已在本次对话中提供详尽的对比重构 Markdown 载荷（新增 TL;DR 对比模块、按钮式 Blockquote CTA 和高对比度表格）。请 Mike 复制该载荷更新后台文章内容并去 GSC 请求重新抓取。 | 页面修改生效，转化漏斗优化完毕。 |


## 暂缓事项

| 编号 | 状态 | 优先级 | 事项 | 暂缓原因 |
| --- | --- | --- | --- | --- |
| U-101 | 暂缓 | P2 | Product Hunt 发布准备 | 需要先积累更多可见内容、稳定游客演示路径和首批数据。 |
| U-102 | 暂缓 | P2 | 高价值外链主动 outreach | 先等第一批内容页稳定收录，再制作更适合 outreach 的对比页或资源页。 |
| U-103 | 暂缓 | P2 | Reddit、Hacker News、LinkedIn/X 等高曝光主动推广 | 这些渠道会带来真实用户测试，需要等首页首屏、模板页、生成/注册/发布主链路、价格页和 GA4 转化事件更稳定后再做。 |

## 已完成事项

| 编号 | 完成日期 | 事项 | 结果 |
| --- | --- | --- | --- |
| U-DONE-001 | 2026-06-04 | Cloudflare 开启 Always Use HTTPS | 已完成，减少 HTTP/HTTPS 分裂风险。 |
| U-DONE-002 | 2026-06-04 | Google Search Console 初始索引检查 | 已确认有页面进入索引。 |
| U-DONE-003 | 2026-06-04 | 在 GSC 请求索引 4 个新增 Solution 页面 | 已提交 `job-application-form-builder`、`newsletter-signup-form-builder`、`customer-testimonial-collection-form`、`portfolio-submission-form-template`，后续观察 1-7 天收录和展示。 |
| U-DONE-004 | 2026-06-04 | 在 GSC 重新提交 sitemap | 已重新提交 `https://genforms.ai/sitemap.xml`，站点地图显示已发现约 60 个网页。 |
| U-DONE-005 | 2026-06-04 | 发布 testimonial 支撑文章 | `customer-testimonial-form-guide` 已上线，生产 URL 返回 200，SEO Gate 为 `Ready to publish`，可在 GSC 请求索引。 |
| U-DONE-006 | 2026-06-04 | 在 GSC 请求索引 testimonial 支撑文章 | 已对 `https://genforms.ai/posts/customer-testimonial-form-guide` 请求编入索引；后续与 `customer-testimonial-collection-form` Solution 页一起观察收录、展示和点击。 |
| U-DONE-007 | 2026-06-05 | 在 GSC 请求重新抓取 Typeform Alternatives 页面 | 已成功提交 `https://genforms.ai/posts/typeform-alternatives`；该页已更新标题、description 和 H1，用于覆盖 `typeform free alternative` 与 `alternative to typeform` 查询。 |
| U-DONE-008 | 2026-06-05 | 发布 2 篇新 SEO 文章 | 已发布 `https://genforms.ai/posts/typeform-alternative-with-webhooks` 和 `https://genforms.ai/posts/nps-survey-form-template-guide`；Codex 已确认两篇页面在线、BlogPosting/发布日期/canonical 正常，且已进入 sitemap。 |
| U-DONE-009 | 2026-06-06 | 观察 Google Search Console 查询词并导出 SEOData | 已导出 `SEOData/https___genforms.ai_-Performance-on-Search-2026-06-06.xlsx`；Codex 已分析：过去 24 小时 53 曝光、0 点击，机会集中在 `lead form ai download`、`generation form`、`contact form builder`、Feishu/DingTalk Webhook 和 Google Forms 对比页。 |
| U-DONE-010 | 2026-06-06 | 请求重新抓取 3 个已优化页面 | 已完成 `https://genforms.ai/solutions/lead-magnet-download-form`、`https://genforms.ai/templates/job-application`、`https://genforms.ai/templates/nps-survey` 的 GSC 请求。 |
| U-DONE-011 | 2026-06-06 | 请求索引 2 篇新 SEO 文章 | 已完成 `https://genforms.ai/posts/typeform-alternative-with-webhooks` 和 `https://genforms.ai/posts/nps-survey-form-template-guide` 的 GSC 请求。 |
| U-DONE-012 | 2026-06-06 | 请求索引官网联系表单 Solution 页 | 已完成 `https://genforms.ai/solutions/website-contact-form-template` 的 GSC 请求；后续 3-7 天观察是否出现 `website contact form template`、`business inquiry form`、`contact form builder` 相关展示。 |
| U-DONE-013 | 2026-06-06 | 请求重新抓取 Feishu/DingTalk 文章 | 已完成 `https://genforms.ai/posts/feishu-dingtalk-webhook-notification` 的 GSC 请求；后续观察 `Feishu form notification`、`DingTalk form webhook`、`form webhook notification` 相关展示和点击。 |
| U-DONE-014 | 2026-06-06 | 请求索引第一批 P0 博客文章与确认 (U-001/U-002) | 已完成对 `form-builder-with-webhook` 和 `saas-lead-capture-form` 在 GSC 的抓取请求，且公网测试可访问。 |
| U-DONE-015 | 2026-06-06 | 发布并索引 Waitlist 需求验证文章 (U-015) | 文章上线，且已在 GSC 请求编入索引。 |
| U-DONE-016 | 2026-06-06 | 发布并索引 Webhook 重试日志博客 (U-017) | 博客上线，且已在 GSC 请求编入索引。 |
| U-DONE-017 | 2026-06-07 | 提供最新 GSC Excel 数据并做出评价 (U-019) | 已分析 `SEOData/https___genforms.ai_-Performance-on-Search-2026-06-07.xlsx`，详见 `ProjectDocs/AI-Team/metrics/2026-06-07-gsc-performance-review.md`。结论：24 小时展示 101、点击 1、查询词 47，增长健康；机会集中在 Webhook、AI lead form、contact form、testimonial 和 Google Forms 对比方向。 |
| U-DONE-018 | 2026-06-07 | 发布并检查 QR Code 离线数据收集文章 (U-016) | 博客已在生产环境上线 (Status: online)。 |
| U-DONE-019 | 2026-06-07 | 检查 GSC 网页索引并分析分类数据 (U-007) | 已读取最新 Search Console 2026-06-07 数据包，确认主打词开始录得展示，首页在巴基斯坦有一次移动端点击，typeform-alternatives 和 Webhook 博客展示排名正常。 |
| U-DONE-020 | 2026-06-10 | 在 Cloudflare 配置 HTML 边缘缓存规则 (U-026) | 已完成 Cloudflare Cache Rule 规则配置（Cache Everything 1小时，针对登录 Cookie 自动绕过）。已由 Mike 成功部署上线。 |
| U-DONE-020 | 2026-06-07 | 人工核验 BetaList / Indie Hackers / AlternativeTo 外部提交规则 (U-020) | 已由 Gemini 联网核查，Mike 已完成首期 BetaList 提交。 |
| U-DONE-021 | 2026-06-07 | 手动提交 Betapage / Launching Next 免费目录 (U-022) | Launching Next 与 PitchWall 已由 Mike 手动完成免费提交排队。 | |
| --- | --- | --- | --- |
| U-DONE-001 | 2026-06-04 | Cloudflare 开启 Always Use HTTPS | 已完成，减少 HTTP/HTTPS 分裂风险。 |
| U-DONE-002 | 2026-06-04 | Google Search Console 初始索引检查 | 已确认有页面进入索引。 |
| U-DONE-003 | 2026-06-04 | 在 GSC 请求索引 4 个新增 Solution 页面 | 已提交 `job-application-form-builder`、`newsletter-signup-form-builder`、`customer-testimonial-collection-form`、`portfolio-submission-form-template`，后续观察 1-7 天收录和展示。 |
| U-DONE-004 | 2026-06-04 | 在 GSC 重新提交 sitemap | 已重新提交 `https://genforms.ai/sitemap.xml`，站点地图显示已发现约 60 个网页。 |
| U-DONE-005 | 2026-06-04 | 发布 testimonial 支撑文章 | `customer-testimonial-form-guide` 已上线，生产 URL 返回 200，SEO Gate 为 `Ready to publish`，可在 GSC 请求索引。 |
| U-DONE-006 | 2026-06-04 | 在 GSC 请求索引 testimonial 支撑文章 | 已对 `https://genforms.ai/posts/customer-testimonial-form-guide` 请求编入索引；后续与 `customer-testimonial-collection-form` Solution 页一起观察收录、展示和点击。 |
| U-DONE-007 | 2026-06-05 | 在 GSC 请求重新抓取 Typeform Alternatives 页面 | 已成功提交 `https://genforms.ai/posts/typeform-alternatives`；该页已更新标题、description 和 H1，用于覆盖 `typeform free alternative` 与 `alternative to typeform` 查询。 |
| U-DONE-008 | 2026-06-05 | 发布 2 篇新 SEO 文章 | 已发布 `https://genforms.ai/posts/typeform-alternative-with-webhooks` 和 `https://genforms.ai/posts/nps-survey-form-template-guide`；Codex 已确认两篇页面在线、BlogPosting/发布日期/canonical 正常，且已进入 sitemap。 |
| U-DONE-009 | 2026-06-06 | 观察 Google Search Console 查询词并导出 SEOData | 已导出 `SEOData/https___genforms.ai_-Performance-on-Search-2026-06-06.xlsx`；Codex 已分析：过去 24 小时 53 曝光、0 点击，机会集中在 `lead form ai download`、`generation form`、`contact form builder`、Feishu/DingTalk Webhook 和 Google Forms 对比页。 |
| U-DONE-010 | 2026-06-06 | 请求重新抓取 3 个已优化页面 | 已完成 `https://genforms.ai/solutions/lead-magnet-download-form`、`https://genforms.ai/templates/job-application`、`https://genforms.ai/templates/nps-survey` 的 GSC 请求。 |
| U-DONE-011 | 2026-06-06 | 请求索引 2 篇新 SEO 文章 | 已完成 `https://genforms.ai/posts/typeform-alternative-with-webhooks` 和 `https://genforms.ai/posts/nps-survey-form-template-guide` 的 GSC 请求。 |
| U-DONE-012 | 2026-06-06 | 请求索引官网联系表单 Solution 页 | 已完成 `https://genforms.ai/solutions/website-contact-form-template` 的 GSC 请求；后续 3-7 天观察是否出现 `website contact form template`、`business inquiry form`、`contact form builder` 相关展示。 |
| U-DONE-013 | 2026-06-06 | 请求重新抓取 Feishu/DingTalk 文章 | 已完成 `https://genforms.ai/posts/feishu-dingtalk-webhook-notification` 的 GSC 请求；后续观察 `Feishu form notification`、`DingTalk form webhook`、`form webhook notification` 相关展示和点击。 |
| U-DONE-014 | 2026-06-06 | 请求索引第一批 P0 博客文章与确认 (U-001/U-002) | 已完成对 `form-builder-with-webhook` 和 `saas-lead-capture-form` 在 GSC 的抓取请求，且公网测试可访问。 |
| U-DONE-015 | 2026-06-06 | 发布并索引 Waitlist 需求验证文章 (U-015) | 文章上线，且已在 GSC 请求编入索引。 |
| U-DONE-016 | 2026-06-06 | 发布并索引 Webhook 重试日志博客 (U-017) | 博客上线，且已在 GSC 请求编入索引。 |
| U-DONE-017 | 2026-06-07 | 提供最新 GSC Excel 数据并做出评价 (U-019) | 已分析 `SEOData/https___genforms.ai_-Performance-on-Search-2026-06-07.xlsx`，详见 `ProjectDocs/AI-Team/metrics/2026-06-07-gsc-performance-review.md`。结论：24 小时展示 101、点击 1、查询词 47，增长健康；机会集中在 Webhook、AI lead form、contact form、testimonial 和 Google Forms 对比方向。 |
| U-DONE-018 | 2026-06-07 | 发布并检查 QR Code 离线数据收集文章 (U-016) | 博客已在生产环境上线 (Status: online)。 |
| U-DONE-019 | 2026-06-07 | 检查 GSC 网页索引并分析分类数据 (U-007) | 已读取最新 Search Console 2026-06-07 数据包，确认主打词开始录得展示，首页在巴基斯坦有一次移动端点击，typeform-alternatives 和 Webhook 博客展示排名正常。 |


## Codex 更新要求

后续 Codex 每次更新本文件时，应：

1. 只更新与用户手动工作相关的内容。
2. 不把 Codex 自己要做的开发任务混入本看板。
3. 用户反馈完成后，将对应事项移到“已完成事项”，或更新状态为 `已完成`。
4. 如果新增事项，应给出清晰编号、优先级、操作说明和验收标准。
5. 若事项已经不再需要，应标记为 `暂缓` 或注明原因，而不是直接删除。

## Gemini 更新要求

后续 Gemini 每次需要给 Mike 安排工作时，应：

1. 先读取本文件，避免重复安排。
2. 如果任务授权允许修改本文件，则直接更新对应事项状态或新增事项。
3. 如果任务未授权修改本文件，则在报告中写“建议更新 Mike 待办看板”，由 Mike 或 Codex 统一更新。
4. 不得把未经核验的外部推广、未经复核的文章、未经确认的生产动作写成 Mike 的 `待处理` 事项。

## 后台草稿协作规则

如果博客内容已经通过 Codex 复核，且任务明确授予 Gemini `ADMIN_DRAFT_WRITE` 权限，Gemini 可以将文章写入后台草稿。

但发布仍由 Mike 完成：

1. Gemini 只能写草稿，不能发布。
2. Gemini 写入草稿后，应把事项更新为“Mike 检查并发布草稿”。
3. Mike 发布后，再反馈完成编号，Codex 或 Gemini 更新为已完成。
