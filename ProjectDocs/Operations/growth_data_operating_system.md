# GenForms.ai 增长经营指挥系统

> 版本：2026-06-14  
> 适用范围：GenForms.ai 搜索增长、产品激活、商业转化、运营系统与 AI-Team 协同  
> 目标：把 GA4、GSC、PageSpeed、Clarity、Bing Webmaster 和后台数据从“数据看板”变成每天可执行的增长经营决策系统，最终服务注册、发布、提交、付费和高质量业务线索。

## 1. 核心原则

GenForms.ai 当前不应再只凭主观感觉优化，而应进入“数据驱动的增长运营”阶段。

Codex 在本系统中的定位不是单点执行者，而是 **增长总指挥 / 产品架构师 / 商业负责人视角的复核者**。每天的判断必须从业务目标倒推，而不是从某个局部优化点出发。

三个总问题：

1. **今天网站表现怎么样？** 流量、索引、点击、体验、性能、转化有没有异常。
2. **我们做对了什么？** 哪些页面、关键词、体验改动、性能修复或内容动作开始产生正向信号。
3. **我们接下来最该做什么？** 选择 1-3 个最高杠杆动作，明确 Mike、Gemini、Codex 各自责任。

四类数据源的分工：

- **GSC**：判断 Google 是否发现我们、哪些关键词和页面有 SEO 机会。
- **GA4**：判断流量是否进入关键行为漏斗。
- **Clarity**：判断用户真实体验在哪里卡住。
- **PageSpeed**：判断技术性能是否拖累用户体验和 SEO。
- **Bing Webmaster / IndexNow**：判断 Bing 是否发现我们、是否存在 SEO/GEO 规则问题，并为新增或更新内容提供更快发现通道。
- **后台业务数据**：判断注册、表单创建、发布、提交、付费限制和付费意图是否形成商业闭环。

所有优化动作都必须服务四条主线：

1. **搜索增长**：让高意图用户发现 GenForms.ai。
2. **产品激活**：让用户快速发现价值、体验价值、留下来并触发关键事件。
3. **商业转化**：让用户理解为什么值得注册、发布、升级和付费。
4. **运营系统**：让 AI-Team 每天知道该看什么、做什么、谁负责、何时复盘。

核心漏斗：

```text
page_view -> demo_start -> demo_complete -> template_use_click -> form_generate -> form_publish -> form_submit
```

商业漏斗：

```text
organic_impression -> organic_click -> activated_visitor -> registered_user -> published_form -> real_submission -> upgrade_intent -> paid_user / qualified_lead
```

## 2. 四条主线的目标与验收

### 2.1 主线 A：搜索增长

目标：让更多高意图用户发现 GenForms.ai，并从搜索结果点击进入。

重点：

- 技术 SEO 健康：sitemap、robots、canonical、hreflang、结构化数据、noindex 边界。
- 高意图内容页：Blog、Template、Solution、Use Case 主题集群。
- Bing / Google 双索引：GSC、Bing Webmaster、IndexNow。
- 排名能力：内容质量、页面主题、内链、外链、页面性能。
- 点击能力：Title、Description、SERP 摘要、品牌可信度。

验收：

- GSC / Bing 已索引页面增加。
- 高潜词进入前 20 / 前 10。
- 高曝光页面开始出现点击。
- 404、重复标题、过长标题、参数页泄露等问题下降。

### 2.2 主线 B：产品激活

目标：让进来的用户快速体验价值，而不是只看完首页就离开。

重点：

- 首页一键 Demo。
- `/forms/new` 游客承接体验。
- 模板详情页沙盒预览。
- 移动端和小桌面首屏体验。
- 发布后测试表单闭环。

验收：

- `demo_start`
- `demo_complete`
- `template_use_click`
- `form_generate`
- `form_publish`
- `form_submit`

### 2.3 主线 C：商业转化

目标：让用户知道为什么值得注册、发布、升级和付费。

重点：

- 免费 / 付费边界清晰。
- 升级提示时机合理，不太早吓退，也不太晚失去付费理由。
- Pricing 文案强调业务价值，而不只是功能清单。
- Pro 功能包装：更多表单、更多提交量、去品牌、Webhook、OCR、导出、高级主题、数据面板。
- 后端付费限制必须兜底，不能只靠前端提示。

验收：

- 注册率。
- 发布表单用户数。
- 触达付费墙次数。
- 付费点击。
- 真实购买或高质量业务线索。

### 2.4 主线 D：运营系统

目标：让 Mike / Codex / Gemini 每天知道该做什么，而不是靠感觉推进。

重点：

- GSC、GA4、Clarity、PageSpeed、Bing Webmaster、Admin Growth Dashboard。
- Daily Brief。
- `user_action_tracker.md`。
- Gemini 任务流。
- 每周复盘与每月目标重设。

验收：

- 每天能看到问题。
- 每天能生成 1-3 个动作。
- 每周能复盘结果。
- Codex / Gemini / Mike 三方任务清楚。

## 3. 每日巡检

建议每天上午执行一次，时间控制在 10-20 分钟。

每日巡检不是简单罗列数据，必须输出“今日经营判断”：

1. 今天表现是否正常。
2. 哪条主线最需要动作。
3. 今天 Mike 做什么。
4. 今天 Gemini 做什么。
5. Codex 是否需要复核、部署或观察。

### 3.1 GSC / Bing 每日看点

记录：

- 过去 24 小时或最近可用周期的总曝光。
- 总点击。
- 平均排名。
- 排名 11-30 的机会词。
- 高曝光低点击页面。
- 新页面是否出现 query。
- 是否出现异常掉曝光、掉排名、404、未收录。
- Bing 是否提示 title、description、crawl、IndexNow 或 GEO 问题。

触发动作：

- **有曝光无点击**：优先优化 Title、Description、首屏卖点和搜索摘要匹配度。
- **排名 11-30**：优先补 FAQ、内链、相关模板 / Solution / Use Case 支撑，不大改已稳定文章主体。
- **新页面无 query**：继续观察 3-7 天，不重复提交 sitemap。
- **404 或抓取异常**：当天进入 P0 修复。
- **Bing title / description 规则问题**：优先修 metadata，不要大改页面主题。
- **参数页进入索引**：优先 noindex / canonical / robots 边界治理。

### 3.2 GA4 每日看点

记录：

- 总会话数。
- 来源 / 媒介。
- Landing Page。
- `demo_start`
- `demo_complete`
- `template_use_click`
- `form_generate`
- `form_publish`
- `form_submit`

触发动作：

- **访问有增长但 `demo_start` 少**：优化首页首屏 Demo、CTA、建议按钮可见性。
- **`demo_start` 有但 `demo_complete` 少**：优化 Demo 步骤、移动端可见性、交互反馈。
- **`template_use_click` 有但 `form_generate` 少**：优化 `/forms/new` 的上下文承接、游客预览和登录拦截时机。
- **`form_generate` 有但 `form_publish` 少**：检查保存/发布按钮、付费限制、登录提示、发布页引导。
- **`form_publish` 有但 `form_submit` 少**：检查分享页性能、提交表单引导和测试闭环。

样本门槛：

- 单日会话 < 20 时，不做强结论。
- 连续 3 天趋势一致时，才进入较大体验改版。

### 3.3 Clarity 每日看点

记录：

- 首页点击热区。
- 首页滚动深度。
- `/forms/new` 是否有访问与流失。
- Rage clicks / Dead clicks。
- Quick backs。
- 移动端录屏中的首屏遮挡、看不到预览、按钮不可点等问题。

触发动作：

- **用户没看到 CTA**：调整首屏布局和按钮位置。
- **用户误点 / 怒点**：修交互反馈和按钮可点击区域。
- **用户进入 `/forms/new` 后退出**：优化承接页默认预览和游客体验。
- **移动端看到内容不完整**：进入移动端专项修复。

隐私边界：

- 不分析用户输入的隐私内容。
- 不把公开表单填写端、Admin 后台、提交数据页的敏感内容作为报告素材。

### 3.4 PageSpeed 每日看点

记录核心页面移动端和桌面端：

- 首页 `/`
- 模板页 `/templates`
- 高潜博客页，如 `/posts/typeform-alternatives`
- 创建页 `/forms/new`

重点指标：

- Performance
- LCP
- TBT
- CLS
- Accessibility
- Best Practices
- SEO
- unused JavaScript
- render-blocking resources

触发动作：

- **移动端 LCP > 4s**：进入 P0 性能诊断。
- **TBT > 300ms**：检查脚本、水合和第三方依赖。
- **CLS > 0.1**：检查图片尺寸、骨架屏、动态模块高度。
- **Accessibility < 90**：修按钮名称、链接名称、对比度、点击区域。
- **SEO < 100**：当天检查 meta、canonical、结构化数据、robots、sitemap。

### 3.5 商业转化每日看点

记录：

- 新注册用户数。
- 新建表单数。
- 发布表单数。
- 真实提交数。
- 触发登录弹窗次数。
- 触发付费墙或升级提示次数。
- Stripe / Billing Portal / Checkout 是否有点击或异常。

触发动作：

- **有访问无注册**：检查首页 Demo、模板 CTA、登录时机。
- **有生成无发布**：检查保存/发布按钮、发布前检查、付费边界提示。
- **有发布无提交**：检查分享页、测试表单引导、二维码和复制链接。
- **付费墙无人触发**：说明免费/付费价值边界过弱或触发时机太晚。
- **付费墙触发多但无人付费**：检查 Pricing、Pro 价值、价格和信任背书。

## 4. 每周复盘

建议每周一做一次，时间控制在 30-45 分钟。

每周输出五类清单：

1. **SEO 机会清单**
   - 3-5 个机会词。
   - 3 个可优化页面。
   - 1-2 个新内容或新 Solution / Use Case 方向。

2. **体验卡点清单**
   - GA4 漏斗最大流失点。
   - Clarity 真实体验问题。
   - 移动端优先问题。

3. **性能健康清单**
   - 最差的 1-2 个页面。
   - LCP / TBT / CLS 是否恶化。
   - 第三方脚本是否影响首屏。

4. **商业转化清单**
   - 免费 / 付费边界是否清楚。
   - 哪个功能最接近付费价值。
   - 是否需要优化 Pricing、升级提示或 Pro 包装。

5. **本周执行清单**
   - Codex 负责拆任务和复核。
   - Gemini 负责执行任务和报告。
   - Mike 负责提供外部数据、GSC 请求索引、上线确认和主观体验反馈。

## 5. 行动优先级

P0 当天处理：

- 生产页面 404、500、无法登录、无法发布、无法提交。
- GSC 重要页面抓取失败。
- PageSpeed 移动端 LCP 极差且影响首页。
- Clarity 显示关键按钮不可点或移动端严重遮挡。
- 付费权益、免费额度、发布和提交链路被破坏。

P1 本周处理：

- GSC 排名 11-30 的高潜页面优化。
- 首页 `demo_start` 偏低。
- `/forms/new` 游客承接差。
- 模板页 / 博客页 CTA 不清晰。
- Pricing、升级提示、Pro 价值表达不清。

P2 排队处理：

- 新博客。
- 新 Solution / Use Case 页面。
- 外链和目录提交。
- 视觉细节增强。

## 6. AI-Team 分工

### Codex

- 读取和解释数据。
- 判断优先级。
- 创建 Gemini 任务。
- 复核代码和报告。
- 决定是否部署。
- 部署后复测。
- 每日从业务目标倒推 1-3 个动作。
- 避免团队陷入只修小问题、不看商业目标的局部优化。

### Gemini

- 根据任务文件做分析或代码修改。
- 严格遵守 Allowed Files。
- 输出中文执行报告。
- 不自行提交 Git。
- 不自行部署生产。
- 每个任务必须说明服务哪条主线和哪个指标。

### Mike

- 提供无法自动读取的数据截图或导出。
- 批准关键上线。
- 在 GSC 请求索引。
- 提供真实产品体验反馈。
- 批准关键商业策略，例如免费额度、价格、付费墙和外部发布节奏。

## 7. 每日触发模板

当 Mike 问“今天该做什么”时，Codex 或 Gemini 应按以下顺序判断：

1. 先看商业目标：今天有没有更接近注册、发布、提交、付费或高质量线索。
2. 再看 GSC / Bing：有没有 SEO 机会或抓取异常。
3. 再看 GA4：流量是否进入关键事件。
4. 再看 Clarity：用户真实卡在哪里。
5. 再看 PageSpeed：是否有性能拖累。
6. 最后输出当天 1-3 个优先动作，避免给出过多低价值任务。

输出格式：

```text
今日判断：
- 今日总判断：
- 做对了什么：
- 最大问题：
- 今日 1-3 个动作：
- Mike：
- Gemini：
- Codex：
- 是否需要上线：
- 观察窗口：
```

## 8. 当前基线

截至 2026-06-14，生产复测基线：

| 端 | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 73-91 波动 | 96 | 100 | 100 | 3.0s-5.6s 波动 | 待复测 | 低 |
| Desktop | 92-98 | 96 | 100 | 100 | 0.7s | 待复测 | 低 |

当前优先专项：

- `AI-TASK-2026-006-027`：首页 768-1199px 小桌面断点首屏体验修复。
- `AI-TASK-2026-006-028`：首页移动端 PageSpeed 波动与 LCP 退化诊断。
- `AI-TASK-2026-006-026`：Bing 首页 metadata 修复与 IndexNow 接入准备。
