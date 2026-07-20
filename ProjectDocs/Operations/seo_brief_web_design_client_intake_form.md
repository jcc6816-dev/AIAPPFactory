# SEO Brief: Web Design Client Intake Form

> 版本：2026-06-25
> 建议页面：`/templates/web-design-client-intake`
> 状态：本地实现已完成；待产品/UX 复核与生产部署决策
> 主证据：PM Topic 扩展评审、Gemini Batch 2 SERP 研究、Codex 复核

## 1. 结论

建议将 `web design client intake form` 作为下一批 SEO 页面候选中的第一优先级。

核心判断：

- Google 对泛 `client intake form` 的理解比较混合，包含法律、医疗、咨询、通用模板等意图。
- Google 对 `project intake form` / `project request form` 更偏项目管理、审批、PM 工具，不适合 GenForms 当前 MVP 强承接。
- `web design client intake form` 更窄、更具体，用户主任务是“马上拿到一个给网站设计客户填写的需求收集表”。
- 该场景不必承诺文件上传、电子签名、审批流、项目管理看板或 HIPAA 医疗合规，和 GenForms 当前能力边界更吻合。
- GenForms 的差异化不应是“模板数量更多”，而是“AI 快速生成客户需求字段 + 移动端单题流填写 + 分享链接/二维码 + 提交面板/CSV + Webhook/Bot 后续通知”。

建议先做一个 Template / Use Case 混合型页面，页面首屏直接给创建入口，避免写成泛泛的教程文章。

2026-06-25 实施记录：

- 已新增 Solution 页面数据：`/solutions/web-design-client-intake-form-template`。
- 页面使用真实存在的 `contact-us` 模板承接，不新增未验证模板 ID。
- CTA 已携带 `source=solution_web-design-client-intake-form-template`、`intent=client_intake` 和 Web design intake 预设 prompt。
- 页面覆盖 `web design client intake form` 与 `website design questionnaire` 两个 SERP 证据词。
- FAQ 已明确边界：不承诺文件上传、不替代项目管理软件、不承诺合同/审批/任务看板。
- 已新增测试，锁定该页面的模板承接、关键词覆盖和文件上传边界。
- 已通过 `npm run test -- solution-landing-pages.test.ts` 与 `npm run build`。
- 已本地验证英文和中文页面的 title、description、canonical、CTA href、intent 和文件上传边界。

2026-06-26 产品/UX 复核后小修记录：

- 产品经理与 UX 均认可页面方向，但指出首屏右侧不能继续展示通用 `Contact Us` 预览。
- 已将首屏右侧替换为 Web design intake mini questionnaire，展示 `Current website`、`Project goals`、`Reference sites`、`Brand style`、`Budget range`、`Launch timeline` 等场景化示例。
- 已将二级 CTA 从 `View template` 改为 `Preview intake fields`，跳转到字段清单锚点，避免用户误以为当前已有独立 `web-design-client-intake` 模板。
- 已将当前页主 CTA 辅助 badge 从 `AI Ready • 30s Deploy` 改为 `AI Ready • Share link / QR`。
- 已在首屏 description 中补充 `Replace static PDF questionnaires`，对齐 Google SERP 中 PDF / questionnaire 替代意图。
- 复测通过：`npm run test -- solution-landing-pages.test.ts`、`npm run build`，并在本地浏览器验证新版首屏、CTA、badge 和创建 URL。

2026-06-26 部署前技术 SEO 修复：

- 已新增 `buildBreadcrumbListJsonLd` helper，统一 BreadcrumbList JSON-LD 输出。
- 已覆盖 Posts、Skills Catalog、Solutions、Templates、Use Cases 五类详情页。
- 每个 `ListItem.item` 现在统一输出为 `{ "@id": absoluteUrl, "name": label }`，用于修复 GSC Breadcrumb 缺少 id 相关警告。
- 已新增 `breadcrumb-json-ld.test.ts`。
- 已抽样验证 `/solutions/web-design-client-intake-form-template` 和 `/posts/send-form-submissions-to-webhook` 的 Breadcrumb JSON-LD 均包含 `item.@id`。

## 2. 证据与限制

已确认的输入：

- 产品经理 Topic 扩展评审：`Client / Project Intake Form` 被列为 P0，理由是竞品中存在明确模板和 Use Case，且 GenForms 当前能力可真实承接。
- Gemini Batch 2 SERP 研究：`web design client intake form` 被判定为 P0，认为其比泛 `project intake` 更适合 GenForms。
- Gemini 已补充 Google US SERP 原始证据：
  - `SEOData/serp_raw/us_vpn/web_design_client_intake_form.html`
  - `SEOData/serp_raw/us_vpn/web_design_client_intake_form.png`
  - `SEOData/serp_raw/us_vpn/website_design_questionnaire.html`
  - `SEOData/serp_raw/us_vpn/website_design_questionnaire.png`
- 代码资产现状：
  - 已有 `law-firm-client-intake-form-template`，但该页是法律服务垂直场景，不适合直接承接 web design / agency 用户。
  - 已有 `contact-us` 模板，可作为最小承接模板，但建议新增更贴合 web design intake 的模板或解决方案映射。

证据状态：

- `web design client intake form` 已补 Top 9 自然结果，Google 长尾结果页当前只展示 9 个主自然结果。
- `website design questionnaire` 已补 Top 10 自然结果。
- 两个关键词均已保存 HTML DOM 和截图，可作为实现评审证据。
- 当前证据强化了本 Brief 的判断：该组词应作为同一语义簇承接，页面需要同时覆盖 “client intake form” 和 “website design questionnaire”。

## 3. 目标关键词与承接边界

主承接：

- `web design client intake form`
- `website design client intake form`
- `web design intake form template`

辅助覆盖：

- `client intake form for web designers`
- `website design questionnaire`
- `website design client questionnaire`
- `web design project questionnaire`
- `creative agency client intake form`
- `freelance web design intake form`

不作为本页主攻：

- `project intake form`
- `project request form`
- `client intake form` 泛词
- `patient intake form`
- `law firm client intake form`
- `intake form with signature`
- `client intake form with file upload`

原因：

- `project intake` / `project request` 更偏企业项目管理、审批和资源分配。
- `patient intake` 涉及医疗隐私、HIPAA 和敏感信息。
- `law firm client intake` 已有独立垂直页，不应混淆。
- 文件上传、电子签名不是当前已确认能力，不能作为搜索承诺。

## 4. Google 搜索意图判断

### 4.1 用户真正想完成什么

用户通常是：

- 自由职业网站设计师。
- 小型 Web design agency。
- Branding / creative agency。
- Freelance developer。
- 帮客户做网站改版、落地页、品牌官网或 Shopify / WordPress 站点的服务商。

他们搜索这个词时，不是想读一篇长文章，而是想快速得到一套可复用的问题：

- 客户是谁，联系方式是什么。
- 现在有没有网站。
- 为什么要新建或改版网站。
- 目标受众是谁。
- 喜欢哪些竞品或参考网站。
- 需要哪些页面。
- 有哪些品牌偏好、色彩偏好、内容准备情况。
- 预算和上线时间是什么。
- 是否需要 SEO、表单、博客、支付、会员、预约等功能。

### 4.2 Google 更可能奖励什么页面

基于 Gemini 报告、补充 SERP 原始证据和竞品模式，Google 更可能奖励：

- 垂直模板页，而不是泛表单首页。
- 能展示字段清单和表单预览的页面。
- 有明确 `Use this template` / `Create intake form` CTA 的页面。
- 解释“为什么 Web design intake 需要这些问题”的轻教程内容。
- 能给用户复制、生成或直接创建的页面。
- 能替代 PDF / Word 问卷的在线填写体验。

对 GenForms 的含义：

- 首屏必须让用户立刻确认“这就是给 Web design 客户用的 intake form”。
- CTA 要进入预配置创建路径，而不是只去泛 `/forms/new`。
- 页面中段需要字段清单和工作流说明，帮助 Google 理解页面语义。

## 5. 竞品借鉴点

### 5.1 Tally

可借鉴：

- 以具体模板页承接细分意图。
- CTA 直接进入模板使用路径。
- 页面不把用户带到复杂产品介绍，而是围绕模板本身展开。

GenForms 切入：

- 不拼编辑器轻量程度，而是突出 AI 根据不同网站项目自动生成字段。
- 通过移动端单题流强化客户填写体验。

### 5.2 Jotform

可借鉴：

- 字段覆盖完整。
- 模板分类多，Google 容易理解主题覆盖。
- `Use Template` 入口明确。

GenForms 切入：

- 不做海量模板库对抗。
- 用一个清晰场景页说明“Web design intake 的推荐字段 + AI 生成 + 发布/收集/流转”。

### 5.3 Reddit / 社区讨论

可借鉴：

- 这个细分场景具有真实同行经验需求。
- 用户不只想要表单，还想知道该问客户哪些问题，避免项目启动后反复沟通。

GenForms 切入：

- 页面要有“字段为什么重要”的解释，而不是只罗列字段。
- 可以强调减少 kickoff 前沟通反复，但不能承诺项目管理或合同交付。

### 5.4 Smartsheet / Asana / Monday 等 PM 工具

可借鉴：

- 泛 project intake 页面强调流程、审批和项目转化。

GenForms 切入：

- 明确不和 PM 工具竞争。
- 本页定位为“项目开始前的信息收集入口”，不是项目管理系统。

## 6. 页面定位

英文定位：

`AI web design client intake form builder for freelancers and agencies.`

中文内部解释：

面向网站设计师、自由职业者和小型 Agency 的客户需求收集表。用户可以用 AI 快速生成一套 Web design 项目前期问题，发布给客户填写，然后在 GenForms 后台查看提交、导出 CSV，或通过 Webhook/Bot 推送给团队。

建议 H1：

`Web Design Client Intake Form Template`

备选 H1：

- `AI Web Design Client Intake Form Builder`
- `Create a Web Design Client Intake Form with AI`

建议 title：

`Web Design Client Intake Form Template | GenForms.ai`

建议 meta description：

`Create a web design client intake form with AI. Collect project goals, website needs, budget, timeline, brand preferences, and client details with a mobile-friendly form.`

## 7. 产品事实边界

可以明确写：

- AI 生成表单。
- 公开分享链接。
- 二维码分享。
- 移动端单题流填写。
- 提交收集。
- 提交数据面板。
- CSV 导出。
- Webhook 配置。
- Webhook 日志和失败重试。
- 通用 Webhook。
- Feishu / DingTalk / WeCom / Slack Bot 推送路径。
- 从模板或预设 prompt 创建。

不能写：

- 支持客户上传 Logo、品牌文件、PDF、图片或设计稿。
- 支持电子签名、合同签署或法律效力。
- 支持付款、订金、报价单或 invoice。
- 支持项目管理看板、审批流、任务分配、甘特图。
- 支持自动同步 Jira、Linear、Asana、Monday 或 CRM。
- 支持无限免费。
- 支持生产级邮件通知、反垃圾、验证码。

谨慎写法：

- 可以写 `ask clients to share links to brand assets or reference websites`。
- 不写 `upload your brand assets`。
- 可以写 `route submissions to your team through webhook or bot notification paths`。
- 不写 `native Slack/Jira/Asana project sync`。

## 8. 推荐字段清单

页面应展示推荐字段，并说明其作用。

| 字段 | 目的 |
|---|---|
| Client name | 识别客户和联系人 |
| Work email | 后续沟通和项目确认 |
| Company / brand name | 理解客户业务和品牌主体 |
| Current website URL | 判断是新站还是改版 |
| Project type | 区分 landing page、company website、ecommerce、portfolio、redesign |
| Project goals | 明确业务目标，例如获客、展示、销售或招聘 |
| Target audience | 帮设计师理解访问者是谁 |
| Reference websites | 收集客户喜欢或不喜欢的网站 |
| Brand style preferences | 收集色彩、语气、视觉偏好 |
| Required pages | 明确首页、关于我们、服务、案例、联系页等页面范围 |
| Required features | 收集表单、博客、预约、会员、支付等需求；注意只作为需求字段，不承诺 GenForms 实现这些功能 |
| Content readiness | 判断文案、图片、Logo 是否已经准备好 |
| Budget range | 初步判断项目规模 |
| Timeline | 判断启动和上线节奏 |
| Additional notes | 给客户补充上下文 |

## 9. 建议页面结构

### 9.1 Hero

目标：

- 首屏直接回答“这是不是我要找的 Web design intake form”。
- 首屏直接给创建动作。

建议内容：

- Eyebrow：`For web designers and creative agencies`
- H1：`Web Design Client Intake Form Template`
- Subheading：`Use AI to create a client intake form for website projects. Collect goals, brand preferences, budget, timeline, reference sites, and project scope before kickoff.`
- Primary CTA：`Create web design intake form`
- Secondary CTA：`Preview recommended fields`

CTA 目标：

`/forms/new?template=contact-us&source=template_web-design-client-intake&intent=client_intake&prompt=Create+a+web+design+client+intake+form+with+client+details+current+website+project+goals+target+audience+reference+websites+brand+preferences+required+pages+budget+timeline+and+additional+notes`

如果后续新增 `web-design-client-intake` 模板，则将 `template=contact-us` 替换为 `template=web-design-client-intake`。

### 9.2 Field Overview

展示字段表格，说明每个字段解决什么沟通问题。

重点：

- 不说“上传 Logo”。
- 改为“提供品牌资产链接 / reference links”。
- Required features 只作为客户需求收集字段，不暗示 GenForms 支持建站功能。

### 9.3 How It Works

建议 4 步：

1. Describe the website project intake you need.
2. Let AI draft the client questions.
3. Share the form link or QR code with your client.
4. Review submissions, export CSV, or route updates through Webhook/Bot paths.

### 9.4 Web Design Intake Use Cases

可以列出：

- New website kickoff.
- Website redesign discovery.
- Landing page project intake.
- Freelance web design inquiry.
- Creative agency onboarding.
- Shopify / ecommerce website discovery.

注意：

- Shopify / ecommerce 只作为项目类型，不承诺电商系统功能。

### 9.5 Why GenForms

建议强调：

- AI helps draft better questions than a blank form.
- Mobile single-question flow is easier for clients to complete.
- Share link and QR code make it easy to send before kickoff.
- Submission dashboard and CSV keep project discovery organized.
- Webhook/Bot paths help your team see new intake responses quickly.

### 9.6 Boundaries / Best Practices

用正向写法提醒用户：

- Keep the form focused on discovery, not contracts.
- Ask for links to files instead of collecting uploads.
- Use budget ranges, not exact pricing promises.
- Avoid asking for sensitive legal, medical, or payment details.

### 9.7 FAQ

建议 FAQ：

1. `What should a web design client intake form include?`
2. `Can I use this before a website redesign kickoff?`
3. `Can clients fill it out on mobile?`
4. `Can I share the form with a link or QR code?`
5. `Can I export client intake responses?`
6. `Can I send new intake responses to Slack or another team channel?`
7. `Does this include file upload or e-signature?`
8. `Is this the same as project management software?`

FAQ 边界：

- 对 file upload / e-signature 的回答必须明确：当前不作为本页承诺；可以让客户粘贴链接或后续通过团队流程补充文件。
- 对 project management 的回答必须明确：GenForms 用于项目开始前的信息收集和流转，不替代 Asana、Monday、Jira 等项目管理工具。

## 10. 内链策略

本页应链接到：

- `/use-cases/contact-form-builder-for-websites`
- `/use-cases/webhook-form-builder-retry-logs`
- `/templates/contact-us`
- `/solutions/law-firm-client-intake-form-template`
- `/solutions/beta-feedback-form-template`

从这些页面回链到本页：

- Contact Form 页面：在 “website inquiry / professional service intake” 处加入。
- Webhook 页面：在示例场景中加入 “web design client intake”。
- Law Firm Intake 页面：在 “other professional intake forms” 处加入。
- Beta Feedback 页面：不强制，只在 product/team workflow 内链中可选。

## 11. 创建路径与埋点建议

建议 CTA URL 参数：

- `source=template_web-design-client-intake`
- `intent=client_intake`
- `mode=` 可暂不设置，除非后续创建页支持更具体模式。
- `prompt=` 使用完整预设 prompt。

建议后续观察事件：

- `template_viewed`
- `template_use_click`
- `forms_new_view`
- `template_context_loaded`
- `ai_generate_submitted`
- `workspace_preview_ready`
- `form_publish`

建议 GSC 观察关键词：

- `web design client intake form`
- `website design client intake form`
- `web design intake form template`
- `client intake form for web designers`
- `website design questionnaire`
- `website design client questionnaire`

## 12. 实现建议

第一阶段建议实现：

- 新增 Solution/Template 页面数据，URL 优先使用 `/solutions/web-design-client-intake-form-template` 或 `/templates/web-design-client-intake`。
- 若现有模板系统无法快速新增模板 ID，可先使用 `contact-us` 模板承接，并通过 `prompt` 生成 Web design intake 字段。
- 页面必须有独立 title、description、keywords、FAQ 和结构化数据。
- sitemap 必须包含目标 URL。
- 创建 CTA 必须携带 `source`、`intent`、`prompt`。

路径选择建议：

- 如果想快速上线并复用现有 `solution-landing-pages.ts` 模式：优先 `/solutions/web-design-client-intake-form-template`。
- 如果产品侧愿意新增真实模板 ID：再补 `/templates/web-design-client-intake`，并让 Solution 页链接到 Template 页。

我更建议第一步走 `/solutions/web-design-client-intake-form-template`，原因是：

- 现有 Solution 页已支持字段、workflow、FAQ、CTA、prompt、keywords。
- 不需要立刻新增完整 template schema。
- 更适合承接“搜索意图 + 创建入口”的混合页面。
- 后续可以再补真正的 Template 页，形成 Solution -> Template 的内链。

## 13. 发布与观察规则

上线前：

- 补 Google Top 10 原始 URL / 截图归档，或明确标注本页基于 Batch 2 策略判断进入小规模测试。
- 跑 `npm run build`。
- 跑相关页面测试。
- 跑生产 SEO Gate。

上线后：

- Mike 在 Google 和 Bing 提交 URL Inspection。
- 冻结观察 7 天，不因 1-2 天无数据立即改动。
- 7-14 天观察 GSC impressions、queries、CTR、average position。
- 同步观察 GA4 / Clarity：是否有人点击创建、是否进入 `/forms/new`、是否生成预览。

## 14. 最终建议

建议进入实现评审，优先做 `/solutions/web-design-client-intake-form-template`。

执行顺序：

1. 开始实现 Solution 页。
2. 上线后提交 URL Inspection。
3. 冻结观察 7-14 天。
4. 如果 GSC 出现相关 query，再决定是否新增独立 `/templates/web-design-client-intake` 模板页。
