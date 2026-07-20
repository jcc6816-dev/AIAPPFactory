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

## 当前主线：G3 首次成功试点（2026-07-14 至 2026-07-21）

> 取代把 SEO、目录站、社交渠道同时铺开的旧执行方式。本轮只验证：**可归因外部用户 → 创建表单 → 发布 → 首次提交**。内容场景固定为 `Event Registration`；不自动发帖、不绕过人机验证。

| 编号 | 状态 | 优先级 | 事项 | 操作与验收 |
| --- | --- | --- | --- | --- |
| U-104 | 已完成 | P0 | 校准“创建”统计口径 | Codex 已核验：生产数据库 7 月 7 日后有 2 个真实 Draft，均有对应服务端 `form_created` 事实；GA4 漏斗显示的 `form_generate` 实际只代表 `ai_generate_submitted`，不是保存创建。后续主口径改为数据库 `forms` + 服务端 `form_created`；GA4 仅解释前端路径。 |
| U-105 | 待处理 | P0 | 发布第一条 X Event Registration 反馈帖 | Mike 使用 `activation_sample_x_event` 专用链接发布已准备文案；只发一条，记录帖子 URL 与发布时间。不发 LinkedIn、Reddit 或目录站来混淆第一波来源。 |
| U-106 | 等待产物 | P0 | 录制并发布真实完整演示 | Codex 负责在可用测试登录态下补齐 60–90 秒真实路径录屏：模板 → 创建 → 发布 → 无敏感测试提交 → 结果页。Mike 只在成片事实核对后发布到 YouTube；现有 15 秒素材仅可作 teaser。 |
| U-107 | 暂缓 | P1 | TikTok 复用短视频 | Mike 完成 TikTok 注册后，复用 U-106 的竖屏版并使用 `activation_sample_tiktok_event` 资料页链接；不新增第二个主题。 |
| U-108 | 进行中 | P0 | 7 天首次成功观察与单变量决策 | Hermes 每日只汇总可归因来源、创建、发布、首次提交；Codex 每 2–3 天复核数据库事实与来源。Pass：20 个非内部有效访问、5 个真实创建、2 个发布、1 个首次提交。Iterate：同一断点重复出现才只改一个变量。有效访问少于 10 个则 Hold 产品改动，先补精准分发。 |

### 被本轮取代的旧分支

- `U-053-D2` NavTools：继续暂缓；不值得在首轮内容样本前投入人工验证码。
- `U-053-D3` LinkedIn/X：拆分为本轮 `U-105`，先只执行 X。
- `U-053-D4` Futurepedia/Reddit 与 `U-053-D5` 社区回复：暂缓，待出现第一条可归因反馈后再决定。
- `U-103` 的“等待高曝光推广”已被本轮小样本、可归因的 X/YouTube 测试替代；不进行大范围推广。

## Agent 共用规则

Codex 和 Gemini 都必须遵守：

1. 如果要给 Mike 安排工作，必须更新或引用本文件。
2. 不允许只在执行报告、日报或聊天里给 Mike 安排待办，而不同步到本文件。
3. 当 Mike 问“我还有哪些工作要做”时，必须先读取本文件，再回答。
4. 新增待办必须写清：编| U-004 | 待处理 | P1 | 在 GA4 检查新增增长事件参数 | 访问网站并点击首页 prompt生成、模板使用、表单生成、发布等关键动作；24 小时内在 GA4 查看是否能看到 `landing_view`、`ai_generate_submit`、`template_use_click`、`publish_form`、`page_leave` 等事件，以及 `page_location`、`page_path`、`cta_text`、`template_id`、`entry_point`、`landing_slug` 参数。 | GA4 能区分页面来源和按钮点击；如果看不到，反馈具体事件列表截图。 |
| U-055 | 已完成 | P0 | 指派 WorkBuddy 在美国 IP 环境下执行 Google SERP 校验 | 连上美国 VPN，运行命令 `python3 /Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/us_serp_crawler.py`。该脚本会自动抓取美国 Google SERP，保存 DOM 与截图，并自动生成比对报告。 | 确认 us_vpn 原始数据抓取成功，且自动生成最终报告：`/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-037-google-serp-contact-form-us-vpn-final.md` |

| U-006 | 待处理 | P0 | 2026-06-05 检查 GSC sitemap 与 URL Inspection 初始状态 | 按 [GSC 索引巡检计划](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/gsc_indexing_check_plan.md) 的 T+1 天节点，查看 sitemap 是否仍为成功、已发现网页是否接近或高于 60，并抽查 2-3 个重点 URL Inspection。 | 如果 sitemap 成功且 URL 可抓取，继续等待；如果失败或不可抓取，反馈截图。 |
| U-008 | 待处理 | P0 | 2026-06-11 做第一次 7 天索引复盘 | 按巡检计划 T+7 天节点，查看是否至少有部分首页、模板、Use Case 或 Solution 页面进入已编入索引，并记录是否出现展示。 | 如果 7 天仍无索引，优先排查内容质量、内链和抓取频率，不继续盲目加页面。 |
| U-010 | 待处理 | P1 | 提交 5 个低风险工具目录作为外部发现信号 | 按 [低风险目录提交包](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/directory_submission_pack.md) 的第一轮具体提交队列执行：ListAi.cc、AI Workbench、Fushion NoCode Directory、NavTools AI、Future-pedia.com。每个提交使用文档里的 UTM 链接、短描述、分类和素材 URL。 | 获得第一批外部发现信号和少量外链；不以短期转化为目标，不做夸大宣传，不一次性提交过多站点。 |
| U-018 | 待处理 | P1 | 发布 AI Lead Capture 长尾博客 | `reworked-post-ai-lead-capture-admin-payload-2026-06-07.md` 已导入为后台草稿。建议在 Webhook 博客收录 24-48 小时后（明天 6 月 7 日）手动将状态修改为 Online，并去 GSC 请求索引。 | 避免同一天集中发布相近增长内容；发布前确认页面显示正常，并提交 GSC。 |
| U-021 | 待处理 | P1 | 检查 Workbuddy 并在 Indie Hackers 发帖 | 督促 Workbuddy 在 IH 每日发表 1-2 条有价值评论积累活跃度。一旦其发帖权限解锁，让其使用 `/AI-Team/reports/gemini/external-discovery-action-pack-2026-06-07.md` 里的文案在 IH 发表经验贴。 | 确认贴子发布成功，并将结果链接写回结果文件。 |
| U-023 | 待处理 | P0 | 检查 Workbuddy 执行 AlternativeTo Phase 2 提交结果 | 6 月 13 日（冷却期满）后，检查 Workbuddy 是否使用 `/Code/public/logo.png` 将 GenForms.ai 成功提交到 AlternativeTo，并建立与 Typeform/Google Forms 的替代品关系。 | 确认 AlternativeTo 提交成功，并产生提交申请记录。 |
| U-024 | 待处理 | P2 | 检查并发布 Gemini 编写 of Lark 飞书海外版 Webhook 博客 | 已由 Gemini 撰写并导入 Supabase 数据库为草稿（UUID: 49e09548-2ea9-4dc9-a75f-fb1f40bc8707）。请 Mike 在后台检查内容，修改状态为 Online 并提交 GSC 抓取。 | 博客成功上线并提交 GSC 抓取。 |
| U-025 | 待处理 | P1 | 检查并修改高展现页 (Typeform Alternatives) 转化小组件与 CTA 区域 | Gemini 已在本次对话中提供详尽的对比重构 Markdown 载荷（新增 TL;DR 对比模块、按钮式 Blockquote CTA 和高对比度表格）。请 Mike 复制该载荷更新后台文章内容并去 GSC 请求重新抓取。 | 页面修改生效，转化漏斗优化完毕。 |
| U-026 | 待处理 | P0 | 登录后核验 Pro 付费权益与免费额度边界 | 生产环境已上线多项混合改动，其中 `billing.ts` 曾涉及付费权益判断。请用 Pro/付费账号登录，检查是否仍能创建超过免费额度的表单、使用高级功能、进入 Stripe Billing Portal；再用免费账号确认免费额度限制仍生效。 | 付费用户权益正常，免费用户限制正常；如发现 Pro 被误判为免费或免费额度绕过，立即反馈截图和账号类型。 |
| U-027 | 待处理 | P1 | 生产部署脚本变更单独复核 | 本轮上线后 `deploy-pm2.sh` 和生产启动 guard 相关逻辑已有较大变化。请后续任何再次部署前，先让 Codex/Gemini 单独复核部署脚本，不要把部署脚本改动混入 SEO、内容或体验任务提交。 | 下一次部署前确认脚本不会覆盖生产 `.env.local`、PM2 启动路径正确、`/api/auth/session` 健康检查可通过。 |
| U-028 | 待处理 | P0 | 2026-06-12 验收首页首屏与导航优化 | 清理 Cloudflare 缓存后，用真实电脑分别打开 `https://genforms.ai/` 和 `https://genforms.ai/zh`，检查公开导航是否不再挤压 Login、`Console/工作台` 和 `View Delivery Path/查看落地路径` 是否已消失、`AI Form SaaS V2.0` 是否已消失、Suggestions 是否能进入首屏或明显露出。 | 如果首屏仍看不到 Suggestions 或 Login 仍被挤压，请反馈浏览器宽度、截图和访问语言版本。 |
| U-029 | 待处理 | P0 | 2026-06-12 提供 GSC/GA4/Clarity 最新数据 | 提供最近 24 小时或 7 天的 GSC 曝光/点击/查询词截图或导出；GA4 关键事件截图，重点看 `demo_start`、`demo_complete`、`template_use_click`、`form_generate`、`form_publish`、`form_submit`；Clarity 首页和 `/forms/new` 最新录屏或热力图摘要。 | Codex/Gemini 根据数据判断 SEO 与产品激活路径是否正常，并决定下一批优化。 |
| U-030 | 待处理 | P1 | 2026-06-12 标注真实访客体验卡点 | 如果 Clarity 里出现真实用户访问首页或 `/forms/new` 的录屏，请标注录屏时间、来源国家/设备、停留时长、退出页面，以及你认为用户卡住的位置。 | 帮助团队把体验优化绑定到真实证据，而不是凭感觉继续改页面。 |
| U-031 | 待处理 | P0 | 一次性完成 GSC 与 GA4 API 只读接入配置 | 1. 在 Google Cloud 启用 Search Console API 与 Google Analytics Data API；2. 创建 Service Account 并下载 JSON Key；3. 将 Service Account email 加入 GSC 属性，权限为 Restricted User；4. 将同一个 email 加入 GA4 Property Access Management，权限为 Viewer；5. 准备 `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64`、`GSC_PROPERTY_URL`、`GA4_PROPERTY_ID`，不要把真实密钥发到聊天或文档；6. 将这些变量写入本地 `Code/.env.local` 和生产 `/app/aiform-factory/.env.local`；7. 重启服务后让 Codex/Gemini 验证 Admin Growth 的 GSC、GA4 Tab 是否能读取真实数据。 | Admin Growth 能在后台读取 GSC 与 GA4 真实只读数据；未登录或非 Admin 访问 API 返回 403；密钥不泄露、不进入 Git；GSC/GA4 配置错误时页面只显示配置提示，不使用假数据。 |
| U-032 | 待处理 | P1 | 接入 Bing Webmaster Tools | 用 `genforms.ai` 域名添加 Bing Webmaster Tools 站点；优先使用 DNS/CNAME 或 Cloudflare 可控方式完成验证；提交 `https://genforms.ai/sitemap.xml`；后续观察 Bing 是否能发现页面、是否有抓取错误。 | Bing Webmaster Tools 显示站点已验证，sitemap 提交成功；如果有抓取、索引或 robots 异常，截图反馈给 Codex/Gemini。 |
| U-033 | 待处理 | P1 | 准备 Cloudflare / 服务器抓取日志分析入口 | 在 Cloudflare 中确认是否可查看搜索引擎 Bot 访问、404、5xx、缓存命中率和热门路径；如果当前套餐或面板无法导出日志，记录可用截图或限制。不要开启会泄露用户隐私的明细日志导出。 | 能提供 Googlebot/Bingbot 抓取、404/5xx、缓存命中率的摘要数据；用于判断 GSC 波动是否来自抓取异常、服务错误或缓存问题。 |
| U-034 | 待处理 | P2 | 建立外链与品牌提及监控 | 先用低成本方式设置 Google Alerts：`GenForms`、`GenForms.ai`、`AI FormFactory`；同时选择一个轻量外链工具（如 Ahrefs Webmaster Tools、Ubersuggest、Semrush 免费额度或 Bing 外链报告）观察外链来源。 | 每周能看到新增品牌提及或外链来源；发现低质量垃圾外链或高价值提及时，反馈链接给 Codex/Gemini 判断是否需要处理。 |
| U-035 | 已完成 | P1 | 建立核心关键词排名观察清单 | 已创建 `ProjectDocs/Operations/seo_core_keyword_observation_list.md`，覆盖 Contact、Webhook、Typeform、QR、Lead Capture、Google Forms、泛品类词；后续每周补充 GSC query 级 7d / 28d 数据。 | 固定关键词观察清单已形成；后续内容优化围绕稳定关键词组判断趋势。 |
| U-036 | 已完成 | P1 | 建立站内 SEO 内容质量台账 | Codex 已创建 `ProjectDocs/Operations/seo_page_observation_ledger.md`，字段覆盖 URL、页面类型/意图组、近 7/28 天 GSC 曝光/点击/CTR/排名、GA4 会话、当前状态、冻结观察和下一步动作；并补充 `seo_post_conversion_audit_2026-06-21.md` 作为旧 Post 转化审计。 | 已形成可持续维护的内容台账，后续每天跟随 SEO monitor 更新判断。 |
| U-037 | 待处理 | P0 | 2026-06-14 复测首页 PageSpeed 与首屏体验 | 022 无障碍治理与 023 桌面缓存优化已上线，Cloudflare 缓存已清理。等待 2-5 分钟后，对 `https://genforms.ai/` 分别跑 PageSpeed Mobile 和 Desktop，并打开首页人工检查 logo、导航、首屏 suggestions、语言/主题按钮是否正常。 | 把 PageSpeed 链接或截图反馈给 Codex/Gemini；重点看 Mobile LCP、Performance、Accessibility、Best Practices、SEO，以及 logo 图片和缓存 TTL 告警是否下降。 |
| U-038 | 已完成 | P0 | 2026-06-14 导出 GSC 下滑诊断数据 | Mike 已导出 `SEODATA/GSC/2026-06-12.xlsx`、`2026-06-13.xlsx`、`2026-06-14-last24hours.xlsx` 与 `2026-06-14-Last7Days.xlsx`。Codex 已分析：6/12、6/13、6/14 近 24 小时曝光分别为 72、39、58，平均排名为 55.4、52.8、52.9；这不是排名急速崩盘，而是曝光波动回落 + Typeform/contact form 等低排名长尾拉低均值。Feishu/DingTalk 页面排名高但 0 点击；`/forms/new?template=...` 参数页出现在 GSC，需要治理。 | 后续动作转入 U-039/U-040。 |
| U-039 | 已完成 | P1 | 在 GSC 请求重新抓取两篇 Webhook 文章 | Codex 已完成两篇文章的 title/description/H1 更新，公网已验证新 SEO 摘要生效：`/posts/feishu-dingtalk-webhook-notification` 与 `/posts/lark-feishu-form-webhook-bot`。Mike 已在 GSC 请求编入索引。 | 冻结观察 5-7 天，看 CTR、点击和排名变化；观察期内不要继续反复修改这两篇文章。 |
| U-040 | 已完成 | P0 | 部署 `/forms/new` noindex 创建页索引治理 | 2026-06-14 已部署上线。Codex 已确认源站和公网 `https://genforms.ai/forms/new?template=waitlist&source=codex_noindex_20260614b` 均输出 `<meta name="robots" content="noindex, nofollow" />`；Cloudflare 返回 `cf-cache-status: DYNAMIC`。未改 robots.txt、canonical、UI 或业务逻辑。 | 后续可在 GSC 对已发现参数 URL 请求重新抓取，观察是否变成“已排除 - noindex”。 |
| U-041 | 待处理 | P0 | 部署并验证 TASK-026 / TASK-027 生产生效 | 2026-06-15 Codex 只读核验发现：`TASK-026` 与 `TASK-027` 已提交到 git，但生产首页仍显示旧 title/description，生产包也未查到 TASK-027 CSS 标记。请先让 Gemini 或 Codex 执行一次只包含 `ff12f4a`、`ed53ae1` 当前 main 代码的生产部署，并清理 Cloudflare 缓存。 | 部署后由 Codex 验证：生产首页 title/description 已缩短，Bing 首页 URL Inspection 的 `Title too long` / `Meta Description too long or too short` 消失或进入等待刷新；生产 CSS 包含 768-1023px 小桌面修复。 |
| U-042 | 待处理 | P1 | 2026-06-17/18 观察首页小桌面断点修复效果 | 等 U-041 完成后，在 Clarity 和 GA4 中观察 768-1023px 桌面段、小窗口电脑或类似 970×565 会话：停留时间是否从 9 秒类低值改善，首页 Suggestions/Mockup 是否可见，`demo_start` 是否有新增触发。 | 如果 2-3 天内仍出现小桌面首页 5-10 秒离开、Suggestions 看不见或 Mockup 空白，请反馈 Clarity 录屏时间、设备尺寸、国家和截图；否则将 TASK-027 标记为有效修复。 |
| U-043 | 待处理 | P0 | 整理正式发布基线并消除受控脏发布状态 | Codex 已建立发布治理文档与门禁脚本：`release_governance.md`、`release-preflight.sh`、`verify-release-state.sh`，并已接入 `deploy-pm2.sh`；同时已新增 [发布基线审计](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/release_baseline_audit_2026-06-15.md)，把发布守护、Admin Growth、SEO 基础设施、产品激活、性能无障碍、本地数据和临时脚本分批分类。下一步由 Codex 按审计文件先提交发布治理 guardrails，再分批整理已上线生产能力。 | 后续常规发布可以在不设置 `RELEASE_ALLOW_DIRTY=1` 的情况下通过门禁；Gemini 发布也必须被同一套脚本约束；`SEOData/` 和根目录截图不再进入 Git 状态噪音。 |
| U-044 | 待复核 | P0 | 复核 Gemini 的 GSC 单日曝光下滑归因报告 | Gemini 已输出 `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-031-execution-report.md`。Codex 初步判断：报告方向有价值，但“CTR 为 0 导致 Google 回收 80% 曝光”属于推断，不能作为确定事实；应表述为高排名 0 点击可能削弱继续扩大展示的意愿，同时叠加周末 B2B 搜索量下降。 | 搜索侧先冻结观察已更新的两篇 Webhook 文章 5-7 天，不继续频繁改正文；重点转向产品激活事件和真实点击验证。 |
| U-045 | 待复核 | P0 | 复核 Gemini 的高曝光低点击页面 SERP 点击救援包 | Gemini 已输出 `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-032-execution-report.md`。Codex 初步判断：两篇 Webhook 文章已经在 U-039 更新并请求索引，短期内不应再反复修改；Typeform Alternatives 排名仍靠后，优先级低于埋点修复。 | 暂不新增 Mike 后台修改动作；等待 5-7 天观察 Webhook 页 CTR/排名，Typeform Alternatives 进入后续内容策略再处理。 |
| U-046 | 待复核 | P0 | 复核 Gemini 的产品激活关键事件为 0 诊断报告 | Gemini 已输出 `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-033-execution-report.md`。2026-06-16 Mike 已人工确认：不是 GA4 丢事件，而是真实没有触发关键产品激活事件。Codex 判断：下一步不再优先修 GA4 技术上报，而应优先修首页 `page_view -> demo_start` 和 `/forms/new` 承接体验。 | Codex 已准备将后续动作转为产品激活修补任务；重点检查首页 Demo 入口是否足够明显、Suggestions 是否可见、进入 `/forms/new` 后是否立即看到与入口一致的预览和下一步动作。 |
| U-047 | 待决策 | P1 | 评估高级视觉主题 / WOW 预览能力是否进入开发 | Gemini 已提出暗黑毛玻璃、渐变霓虹、高质感预览方向。Codex 初步判断：不建议全站默认换皮，也不建议重构后台整体风格；更适合收敛为可选高级表单主题，优先用于公开表单页、模板详情页预览和 `/forms/new` 沙盒预览，并作为 Pro 价值感知资产。 | Mike 先决定是否做、做到什么范围。若批准，下一步只允许先输出实施计划和风险清单，重点说明性能、移动端、无障碍、SEO、付费转化路径；未经批准不得直接开发或部署。 |
| U-048 | 已复核 | P0 | 复核 Gemini 的产品激活入口修补实施方案 | Gemini 已输出 `ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-034-execution-report.md`。Codex 复核结论：方向通过，但不照单全收；不批准 PC 首页退回 skeleton CTA 初始态，批准强化真实 Mockup Slide 0 的主 CTA 和可点击性，并修复 `/forms/new` prompt-only 入口默认预览不匹配。 | Codex 已创建 `AI-TASK-2026-006-035` 作为第一批代码实现任务；等待 Gemini 输出实现报告后再复核是否部署。 |
| U-049 | 待部署验证 | P0 | 部署并验证产品激活入口第一批修补 | Gemini 已完成 `AI-TASK-2026-006-035` 代码实现，Codex 已复核并补充一个保护条件：只有在没有有效初始 template 时才执行 prompt-only 映射，避免 `template + prompt` URL 被二次覆盖。`npx tsc --noEmit` 与 `npm run build` 均通过。 | 下一步可部署生产并清理 Cloudflare 缓存；上线后验证首页 Mockup 主 CTA 是否触发 `demo_start`，`/forms/new?prompt=SaaS%20lead%20collection` 是否显示 lead-capture 沙盒预览，观察 GA4/Growth Events 的 `demo_start`、`template_context_loaded`、`workspace_preview_ready` 是否出现。 |
| U-050 | 已修复，继续观察 | P0 | 修复增长数据快照与 Clarity 数据可靠性 | 2026-06-18 至 2026-06-21 已完成 OAuth 失效诊断、新 refresh token 写入生产、GSC/GA4 历史补抓和错误提示增强。2026-06-23 Gemini 完成 cron 长时间无回执修复，Codex 复核后补修 Clarity `apiUrl` 漏变量、增加 `source` 参数白名单，测试与构建通过并部署生产。生产验证：`/api/admin/growth/snapshots/cron?source=google` 约 110ms 返回后台任务已启动；PM2 已输出 GSC/GA4 分源 Starting/Skipped 日志；快照库已具备 GA4 2026-06-22、Clarity 2026-06-22、PageSpeed 2026-06-23，GSC 最新为 2026-06-21，符合 GSC 延迟口径。已于 2026-06-23 在生产服务器成功建立 9:00 GSC/GA4、9:05 Clarity 每日定时任务及周一 3:00 PageSpeed 性能定时任务。 | 后续 daily monitor 默认优先跑 `source=google`，避免被 PageSpeed 拖住；PageSpeed/Clarity 可低频或独立触发。若再次出现 `invalid_grant`，优先重新授权 OAuth 或改造为可用的服务端凭证方案。 |
| U-051 | 等待产物 | P0 | 修复真实用户产品激活样本不足的问题 | 2026-06-18 Mike 确认：6 月 17 日 Clarity 只有 2 个用户录屏，其中 1 个还是 Mike 自己；GA4 激活事件也主要来自 Mike 自测。因此当前不能把“真实用户不激活”作为强结论，首要问题是有效访客样本太少。 | 需要 Gemini 制定并执行小流量冷启动验证方案：先获得 20-50 个真实目标访客，再评估首页 Demo、`/forms/new` 承接和发布闭环。验收以非 Mike 访客会话、Clarity 录屏、GA4 激活事件为准。 |
| U-053 | 已复核，待执行 | P0 | 公网小流量种子验证计划 | 当前每日真实访客太少，Clarity/GA4 样本不足。Gemini 已输出公网种子执行包（reports/gemini/AI-TASK-2026-006-053-public-seed-traffic-pack.md），并将未来 3-7 天 Mike 的具体操作拆解为 U-053-D1 至 U-053-D5。Codex 已复核通过：文案已避开 Clarity/录屏/监控等敏感表达，UTM 清楚，动作可执行。 | 执行节奏建议：先做 U-053-D1 与 D2 的低风险目录，再做 D3 社交贴；Reddit/社区动作放到有基础信号后执行，避免太早被判定为推广。 |
| U-053-D1 | 已完成 | P0 | [第1天] 提交 ListAi.cc 与 AI Workbench 目录 | 1. ✅ ListAi.cc 已提交成功（2026-06-24，WorkBuddy 通过 API 提交，返回 success:true）；2. ❌ AI Workbench 网站已失效（域名重定向到垃圾追踪页面），跳过。 | ListAi.cc 预计 24-48h 审核上线。AI Workbench 不再可用。 |
| U-053-D2 | 进行中 | P0 | [第2天] 提交 Fushion NoCode 与 NavTools AI 目录 | 1. ✅ Fushion NoCode 已提交（2026-06-24，表单填写完毕并提交，无错误返回，待审核）；2. ⚠️ NavTools AI 遇到 Cloudflare Turnstile 验证，NEEDS_MANUAL，Mike 手动提交。 | Fushion 待审核。NavTools 需 Mike 手动完成。 |
| U-053-D3 | 待处理 | P0 | [第3天] 发布 LinkedIn 与 X 创始人寻求反馈社交贴 | 1. 在 LinkedIn 和 X 发布个人测试反馈邀请贴；2. 使用执行包中克制、真实的早期口吻文案，绝不使用夸大词和隐私录屏词汇；3. 使用带 UTM 的首页链接。 | 成功发帖，并在看板记录帖子链接。 |
| U-053-D4 | 待处理 | P0 | [第4天] 提交 Future-pedia，并在 Reddit (r/sideproject 等) 发布问题型反馈贴 | 1. 提交 Future-pedia 目录；2. 在 Reddit 挑选合适板块 (如 r/sideproject, r/nocode) 发布早期产品吐槽邀请贴；3. 使用带 UTM 的链接。 | 成功提交目录与发帖，记录 Reddit 帖子链接。 |
| U-053-D5 | 待处理 | P0 | [第5-7天] 寻找 Reddit/社区中的表单与集成痛点帖子进行价值解答 | 1. 寻找有关 Typeform 贵、Webhook 丢单或推送飞书/Slack 痛点贴；2. 进行高价值解答，并在末尾贴上 GenForms Webhook 重试用例带 UTM 的链接；3. 观察引流效果。 | 记录回复帖子的链接。 |
| U-054 | 观察中 | P0 | SEO 低曝光主动恢复动作，不被动等待 | 当前 GSC 曝光和点击都很弱，不能只等待 Google 自然恢复；但也不能大面积频繁改页面。短期应围绕已有展示的 Contact Form / Webhook / lead capture 小集群做主动恢复：提升内链、增加场景入口、检查 Bing metadata、推进 IndexNow、提交少量高相关目录。Codex 已新增 SEO 页面观察台账和 Post 转化审计，用来决定哪些页面冻结、哪些页面进入 CTR 修复或内容改造。2026-06-21 已对 `/posts/feishu-dingtalk-webhook-notification` 执行小范围 CTR 修复并部署：title/meta/H1 贴近“send form submissions to Feishu/DingTalk”，侧边 CTA 改为 webhook intent。 | Mike 已发布 2 篇 P0 Webhook 文章并提交 Google/Bing 索引，同时已修正 Bing 提示的首页 Title / Meta Description 过长问题。进入 7 天观察期：不要继续反复修改新文、首页 metadata、Feishu/DingTalk 文章和已冻结 Use Case 页；重点看 Google/Bing 是否收录、GSC/Bing impressions、clicks、CTR、average position，以及进入页后的 `template_use_click`、`forms_new_view`、`form_generate` 等激活信号。 |
| U-056 | 已完成 | P1 | 重新提交 Feishu/DingTalk Webhook 文章 URL Inspection | Codex 已在 2026-06-21 修改并部署 `https://genforms.ai/posts/feishu-dingtalk-webhook-notification` 的 title/meta/H1 和侧边 CTA。Mike 已完成 Google Search Console 和 Bing Webmaster Tools 重新提交。 | 进入 7 天冻结观察，重点看该 URL 的 impressions、clicks、CTR、average position 和 webhook intent 创建事件。 |
| U-057 | 已完成 | P0 | 修复 2026-06-29 Google OAuth `invalid_grant` 并恢复 GSC/GA4 快照 | Mike 已更新 OAuth refresh token；Codex 于 2026-06-29 验证 token exchange HTTP 200，将新 token 安全写入本地与生产环境并重启 PM2，随后强制补抓 Google 数据。GSC 2026-06-27 与 GA4 2026-06-28 的 1d/7d/28d 六个任务均成功写入数据库。 | 数据链路已恢复。最新 GSC：7d 757 impressions / 2 clicks / 0.264% CTR / average position 44.98，28d 2510 / 6 / 0.239% / 46.29；最新 GA4：7d 169 sessions，28d 590 sessions。后续 daily monitor 恢复正常观察。 |
| U-058 | 已完成 | P1 | 提交 Volunteer Application Template URL Inspection | Volunteer Template 已于 2026-06-29 部署并通过生产 Gate。2026-06-30 Mike 已在 Google Search Console 与 Bing Webmaster Tools 提交 `https://genforms.ai/templates/volunteer-application` 和 `https://genforms.ai/zh/templates/volunteer-application`；未重新提交 sitemap。 | 冻结至 2026-07-13，观察 `volunteer application form`、`volunteer application form template`、`volunteer registration form` 及 `volunteer_application` 创建事件，不新增 Solution/Use Case/Post/pSEO。 |
| U-059 | 已完成 | P1 | 提交 Customer Service Request Template URL Inspection | Customer Service Request Template 已于 2026-06-29 部署并通过生产 Gate。2026-06-30 Mike 已在 Google Search Console 与 Bing Webmaster Tools 提交 `https://genforms.ai/templates/customer-service-request` 和 `https://genforms.ai/zh/templates/customer-service-request`；未重新提交 sitemap。 | 冻结至 2026-07-13，观察 `service request form`、`service request form template`、`customer support request form` 及 `service_request_intake` 创建事件，不新增 Solution/Use Case/Post/pSEO。 |
| U-060 | 已完成 | P1 | 部署后提交 Customer Testimonial 新 Owner 与 Post | 2026-06-30：Codex 已随 U-061 统一部署并验证生产：`/templates/customer-testimonial-form` 200、`/posts/customer-testimonial-form-guide` 200、旧 `/solutions/customer-testimonial-collection-form` 与 `/templates/customer-story` 均落到新 Template。Mike 已在 Google Search Console 和 Bing Webmaster Tools 提交新 Template 与 `/posts/customer-testimonial-form-guide`。 | 进入冻结观察；不提交已退役 Solution/旧 Template，不提交 sitemap。观察新 Template、Guide 的收录、query、CTR，以及旧 URL 信号迁移。 |
| U-061 | 已完成 | P0 | 完成 Slack Webhook 加密迁移与受控 E2E 前置配置 | 2026-06-30：Mike 已在 Supabase 执行 `Code/data/migrations/2026-06-29-encrypt-webhook-url.sql`，并在本机 `Code/.env.local` 添加 `SLACK_E2E_WEBHOOK_URL`；Codex 已完成迁移脚本 dry-run/apply/verify/clear（0 行需处理）、固定 Slack Test Send（HTTP 200 / `ok`）、相关测试（6 文件 / 44 用例）、TypeScript、`npm run build`、受控 PM2 部署、release-state 验收和 production SEO gate。真实生产表单提交 E2E 已通过：`sub_qu5erfmr0o8dyc` / `run_ooqww0mr0o8e4g` / `wh_w20fhtmr0o8f1t`，Slack 返回 HTTP 200 / `ok`，日志中目标 URL 脱敏为 `https://hooks.slack.com/***`。 | Slack Product Gate 更新为 Pass。后续只允许进入窄技术 Post / Webhook cluster，不创建独立 Slack Solution、Use Case 或 pSEO 页面；公开文案必须称 `Slack Incoming Webhook`，并说明无 OAuth、无频道发现、无交互按钮/审批、无 Block Kit 自定义。 |
| U-062 | 已实现，需迭代 | P0 | SEO Growth Attribution Repair | 2026-07-03 Mike 已确认 Plan；Codex 已上线 30 分钟 session、30 天 first/last non-direct context、PII allowlist、Form `generation_meta_json.attribution`、Form/Submission 事实去重和中文 Admin API `/api/admin/growth/seo-attribution`。不新增数据库列或依赖；qualified lead 继续 N/A。全量 81 文件 / 382 测试、TypeScript、Next.js build、受控 PM2 部署、release-state 与 production SEO gate 均通过。2026-07-07 Codex 完成只读质量审查：3 个 release-window 外部 Form 均有 attribution，unattributed rate 为 0，PII allowlist 未发现违规，公开 Admin API 403 正常。 | Attribution Gate 仍关闭：当前 Chrome 无 GenForms 登录态，internal create -> publish -> test submission excluded -> real submission included cohort 未补跑；同时 1 个 published Form fact 缺少 `publish_succeeded` event，`form_created` event 相对 Form fact 有重复。补跑和诊断完成前，不把归因结果用于 pSEO Scale 或 conversion-rate 决策。 |
| U-052 | 待复核 | P1 | 制定 Contact Form / Webhook SEO 点击恢复小战役 | GSC 单日历史显示 `contact form builder`、`website contact form template`、Webhook 相关页面曾有展示，但 CTR 仍为 0；`typeform-alternatives` 排名仍偏后，不适合作为短期主攻。 | 已包含在 AI-TASK-2026-006-036 作战计划中，聚焦于 Webhook 与 Contact Form 两个集群的内链和 SERP 优化，等待复核。 |


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
| U-DONE-022 | 2026-06-15 | 建立 6 月增长作战地图 | 已新增 `ProjectDocs/Operations/genforms_june_growth_battle_map.md`，明确搜索增长、产品激活、商业转化、运营系统四条主线，以及 6 月阶段目标、战术动作、指标和 Mike/Gemini/Codex 分工；并已在 Gemini 启动文件和增长经营系统中加入引用。 |
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
