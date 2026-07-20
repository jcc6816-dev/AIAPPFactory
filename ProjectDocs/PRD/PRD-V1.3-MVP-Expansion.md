# GenForms.ai PRD V1.3 - MVP Expansion

> 状态：Draft，待 Mike 确认  
> 版本：V1.3  
> 日期：2026-07-01  
> 产品范围：GenForms.ai AI Form Generator MVP 扩围  
> 关联评审：[V1.3 产品评审结论](/Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/reports/codex-review/GenForms_V1.3_MVP_Expansion_Product_Review_2026-07-01.md)

## 0. 文档关系

本文件是当前 AI Form Generator MVP 的增量扩围草案，不修改或替代以下冻结/历史文档：

- `/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt`
- `/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.1-AI-Form-Generator.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md`
- `/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md`

若旧文档中的 Workflow、Skill、文件处理或平台化描述与本文件冲突，V1.3 开发只采用本文件明确列入的最小范围；长期平台能力仍保留在 V2.8 路线图，不进入本阶段实现。

## 1. 产品决策

### 1.1 核心目标

V1.3 的唯一主目标：

> 让首次用户从一个明确场景或模板出发，生成并发布表单，完成一次安全的测试提交，并在结果页看到这条提交。

首次成功闭环：

```text
场景/模板入口
-> 预配置生成
-> 预览并保存
-> 发布公开链接
-> 发起测试提交
-> 回到结果详情
-> 可选开启邮件/Webhook 后续提醒
```

新增能力只有在增强这条路径、提高结果可见性或解除已验证市场阻力时才能进入 V1.3。

### 1.2 当前基线

截至 2026-06-30：

| 证据 | 当前状态 | 产品含义 |
|---|---|---|
| GA4 7 天 | 164 sessions、3 template use、1 generate、0 publish、0 submit | 样本混有内部/Admin，不计算真实转化率；但发布后闭环缺少可观察成功。 |
| GA4 28 天 | 579 sessions、22 template use、29 generate、0 publish、0 submit | 生成事件存在，但后续事件没有形成连续证据。 |
| Clarity 外部样本 | 多数未进入 `/forms/new`；有长停留但无 CTA 行为 | 入口信任和产品交接仍需改善。 |
| 当前代码 | 创建、发布、公开提交、数据面板、CSV、QR、Webhook 已存在 | 不应重写主链路，应在现有路径上补可见步骤和 Gate。 |
| 当前邮件 | `email-notification.ts` 为 Mock | 不得对外承诺生产级邮件，V1.3 必须替换或隐藏。 |
| 当前 PDF 上传 | 已能持久化文件，但安全控制不完整 | 先做安全收口，再扩展预览、导出和 PDF-to-form。 |

数据 caveat：GA4 仍含 Admin、内部访问、Unknown 等噪声。本 PRD 用这些数据确定改造方向，不据此承诺具体收入或转化提升。

## 2. 产品原则

1. **闭环优先。** 新能力不得抢占首次成功路径资源。
2. **一个核心，多种入口。** SEO 场景和模板共享同一创建、发布、提交和结果链路。
3. **能力必须真实。** Mock、内部痕迹或未通过 E2E 的功能不得进入公开承诺。
4. **简单规则，不做 Workflow。** 条件逻辑只改变表单填写路径，不执行外部业务流程。
5. **安全默认。** Embed、文件和通知类能力默认最小权限、限流、脱敏、可撤销和可审计。
6. **逐阶段 Gate。** 每项能力单独上线、单独观察，避免同时改变漏斗多个环节。
7. **多语言不等于多模型。** 先解决表单内容和运行时语言，再依据成本/质量证据决定模型路由。

## 3. V1.3 范围

### 3.1 P0-A：首次成功闭环

#### 用户任务

用户希望快速证明：表单能生成、能发布、别人能填写、自己能看到结果。

#### 最小范围

1. 场景/模板进入 `/forms/new` 后显示来源上下文、模板名称和推荐字段。
2. 生成完成后显示固定 Action Rail：
   - Preview
   - Publish
   - Open public form
   - Send test submission
   - View result
   - Configure notification/Webhook
3. 发布成功页显示公开链接、QR、WhatsApp 分享入口和“下一步测试”主 CTA。
4. 测试提交使用真实运行时和存储链路，但标记为 `is_test=true`：
   - 不计入免费提交额度或 Credits。
   - 默认不触发邮件、Webhook、WhatsApp、付费 AI Skill 或其他外部自动化，避免误发和隐性成本。
   - 文件字段仍执行基础校验和安全存储；OCR、AI 处理和外部通知必须通过各自独立 Test Send/Test Run 显式触发。
   - 用户可在对应通知设置中单独执行显式 Test Send。
5. 测试提交完成后，将创建者带回该条结果详情，并高亮答案、状态和下一步。
6. 空数据面板的主 CTA 改为“发送测试提交”，而不是只显示空状态。

#### 激活定义

`activation_completed`：同一用户在 24 小时内完成：

```text
form_created
-> form_published
-> test_submission_completed 或第一条真实 public_form_submitted
-> first_result_viewed
```

辅助事件：

- `activation_started`
- `publish_started`
- `publish_succeeded`
- `test_submission_started`
- `test_submission_completed`
- `first_result_viewed`
- `activation_completed`

事件 metadata 不得记录答案、Prompt、邮箱、文件名或通知凭证。

#### Product Gate

- 10 组全新账户/全新表单 E2E 中至少 9 组完成闭环。
- 桌面与移动端均不存在无下一步的死路。
- 测试提交不会计费、不会默认外发、可在结果页识别和删除。
- 原有真实公开提交、Webhook、CSV 和订阅限制回归测试通过。
- 事件顺序可按 `user_uuid + form_uuid` 复现，Admin/internal/dev 流量可排除。

### 3.2 P0-B：生产级创建者邮件提交通知

#### 用户任务

表单创建者希望有新提交时立即收到提醒，不必持续刷新数据面板。

#### V1.3 最小范围

- 仅发送给表单创建者已验证邮箱，或一个经验证的自定义团队邮箱。
- 每个表单只支持开/关、收件人、主题前缀和 Test Send。
- 邮件包含表单名、提交时间、结果页安全链接和有限答案摘要。
- 默认不在邮件中包含文件附件、完整敏感答案或公开下载 URL。
- 使用 provider message id、幂等键、状态日志和有限重试。
- 记录 accepted、delivered、bounced、complained、failed；发送失败不回滚已成功保存的提交。

#### 明确不做

- Respondent confirmation email。
- Marketing Campaign、序列邮件、Newsletter、双重确认。
- 条件收件人路由、多人抄送、附件、回复收件箱。
- 自定义 HTML 编辑器和任意发件域名。

#### 推荐实现

- 首选供应商：Resend，使用 API + verified subdomain。
- 使用原生 `fetch` 即可，首版不强制增加 SDK。
- 幂等键建议：`submission-notification/{submission_uuid}/{recipient_hash}`。Resend 官方支持发送幂等键和交付 Webhook。[Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)、[Resend webhooks](https://resend.com/docs/webhooks/introduction)
- 配置 SPF、DKIM，建议同步 DMARC；供应商 API Key 只在服务端环境变量中保存。

#### Product Gate

- 已验证域名完成 SPF/DKIM，发件地址通过生产测试。
- Test Send、真实提交、重复请求、provider timeout、429、5xx、hard bounce 和 complaint 均有测试。
- 重试不会重复发送同一封邮件。
- 发送日志不保存 API Key，不把完整答案写入错误信息。
- 生产 Pilot 中 accepted 成功率不低于 99%，可观察 delivered/bounced 最终状态。
- 邮件失败不改变 `form_submissions.status=completed`。

### 3.3 P0-C：表单级多语言 + AI 翻译 Pilot

#### 用户任务

创建者希望维护一个表单，让英文、简体中文和拉美西班牙语受访者看到本地语言版本，同时仍把回复汇总到同一个结果面板。

#### 最小产品模型

- 一个 `form_uuid`、一个公开链接、多个语言版本。
- 首批语言：`en`、`zh-Hans`、`es-419`。
- 现有站点 `/zh` 路由作为兼容别名继续保留；表单内容版本、提交记录和 API 内部统一使用规范化的 `zh-Hans`，不得因本次 Pilot 批量改写既有公开 URL。
- 创建者设置默认语言，并选择启用语言。
- AI 从 source locale 生成目标语言草稿，必须由创建者确认后发布。
- 翻译范围：
  - 表单标题、描述。
  - 字段 label、placeholder、help text。
  - option label。
  - Welcome、按钮、校验错误和 success message。
- 不翻译：
  - field key、option value、Webhook payload key。
  - URL、邮箱、品牌名和用户答案。
- 受访者可手动切换语言；缺失翻译时回退到默认语言并记录 QA 告警。
- 三种语言的回复进入同一 submissions 数据集，保存 `response_locale`。

#### 明确不做

- 全站西班牙语翻译。
- Admin 后台完整西语版本。
- 自动翻译已提交答案。
- 按语言复制三个独立表单。
- 自动检测后强制跳转且不给用户切换。
- 多模型智能路由。

#### Product Gate

- 30 个不同模板/自定义表单的翻译测试中，字段、选项和运行时文案覆盖率 100%。
- 翻译不会修改 key/value、required、field type、逻辑目标或 Webhook payload 结构。
- 创建者能逐项编辑并撤销未发布翻译。
- `en`、`zh-Hans`、`es-419` 在桌面和移动端完成发布、提交、验证、成功页和结果回看 E2E。
- 同一公开链接可切换语言，canonical/SEO 不因 `?lang=` 产生重复索引。
- 西语 SEO 页面必须另过 SERP Validate；本功能上线不自动授权批量翻译 SEO 页面。

#### 第一外语选择

- 2026-07-01 的 `ja-JP vs es-419` SERP 对比评分为 64:68，差距只有 4 分。
- 该结果只授权 `es-419` 先进入产品 Pilot，不证明西语市场规模更大，也不授权西语 SEO 页面。
- `ja-JP` 保留第二顺位。西语 Pilot 观察 28 天后，若没有合格创建入口、发布或激活信号，应停止扩页并重新评估日语。
- 首轮西语使用中性拉美表达；不复制 `es-MX`、`es-AR`、`es-CO` 或 `es-ES` 页面。

#### 长期演化

1. **Locale 基础层：** 所有语言使用 BCP 47 标识；禁止长期使用无法区分地区和文字体系的模糊 `zh/es`。
2. **表单内容层：** 一个 form、多个 localization version；字段 key、option value 和 Webhook payload 始终稳定。
3. **翻译工作流层：** AI draft -> 人工确认 -> 发布 -> source version 变化提醒 -> 选择性重译。
4. **质量资产层：** 建立品牌术语表、禁译词、翻译记忆、母语 QA 记录和回退策略。
5. **区域产品层：** 按市场逐步补通知渠道、支付、隐私文案、字体和支持流程，不把语言包误当作完整市场进入。
6. **SEO 层：** 每个语言/Topic 独立 Discover、Validate、Architect；不批量复制英语页面。
7. **模型层：** 默认复用现有 provider abstraction；只有出现可量化的质量、成本或可用性问题时才评估按语言模型路由。

候选顺序：`es-419` Pilot -> `ja-JP` 或 `zh-Hant` -> `pt-BR`（依赖 WhatsApp）-> `ko-KR` -> `de-DE`（依赖合规准备）。顺序必须由 Pilot 数据更新，不是永久承诺。

### 3.4 P0 安全 Gate：现有 PDF 上传收口

这不是新营销功能，而是当前文件上传能力的发布安全债。

#### 最小范围

- 仅允许明确白名单类型；PDF 必须同时校验扩展名、MIME 与文件签名。
- 单文件最大 10 MB，最多 20 页；限制每次提交文件数和总大小。
- 服务器生成 storage key，不使用原文件名作为路径。
- 对象默认私有；下载通过短时签名 URL 和权限校验。
- 新文件先进入 quarantine，完成恶意文件扫描后才可预览或下载。
- 扫描失败、超时或未知状态默认不可访问。
- 保存 SHA-256、大小、检测 MIME、scan status 和扫描时间。
- 禁止把上传文件直接作为可执行 Web 内容返回。

OWASP 建议采用扩展名、内容类型、文件签名、大小、随机文件名、隔离存储和恶意文件扫描等多层控制。[OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)

#### Product Gate

- 合法 PDF、伪造 MIME、双扩展、非 PDF、超限文件、损坏文件、恶意测试样本和扫描超时均有测试。
- 未通过扫描的对象无法通过 URL、预览页或 API 读取。
- 文件 URL 不进入公开 API、Webhook 错误、埋点或普通日志。
- 上传失败不创建半完成 submission；或能够清理 orphan object。

### 3.5 P0-A 子能力：WhatsApp 分享公开链接

#### 最小范围

- 发布成功页提供 `Share to WhatsApp`。
- 分享内容只包含表单标题、创建者可编辑短文案和公开链接。
- 移动端优先 Web Share API；WhatsApp 入口使用官方 URL share 方式。
- 不存储 WhatsApp 联系人、手机号、消息内容或发送状态。
- 埋点只记录 `whatsapp_share_clicked`，不记录目标联系人。

#### 对外名称

`Share form link on WhatsApp` / `通过 WhatsApp 分享表单链接`

不得使用：

- WhatsApp Integration
- WhatsApp Bot
- WhatsApp notification
- Send submissions to WhatsApp

### 3.6 P1：基础条件逻辑

#### 用户任务

受访者只看到与自己答案相关的问题，减少无关字段和放弃率。

#### 最小范围

- 条件来源：前置字段答案。
- 运算：equals、not equals、contains、is empty、is not empty。
- 动作：show field、hide field、jump to field/end。
- 一条规则只允许一个条件；V1.3 不提供嵌套 AND/OR 组。
- 不允许自定义代码、表达式、计算、外部调用或条件 Webhook。
- 编辑器只能选择稳定 field key，不按显示顺序保存跳转目标。
- 保存/发布前检测不存在的字段、向后循环和不可达 required 字段。

#### Product Gate

- 客户端导航与服务端提交验证使用同一规则解释器。
- 被隐藏或跳过的 required 字段不会阻止提交，也不会接受伪造答案。
- 修改/删除字段时能提示受影响规则，不能静默留下悬挂引用。
- 无规则表单的 schema、发布和提交行为完全不变。
- 至少覆盖单选、多选、文本和空值边界测试。

### 3.7 P1：安全 iframe Embed

#### 用户任务

网站所有者希望把已发布表单直接放在自己的网页中，而不是只跳转到外部链接。

#### 最小范围

- 新增专用 `/embed/{shareCode}` 运行页，不直接复用控制台或带导航的公开页。
- 每个表单默认关闭 Embed；创建者显式开启并配置允许域名。
- 标准 inline iframe；不做 popup、side tab、WordPress 插件或完整 JS SDK。
- 使用 CSP `frame-ancestors` 限制允许嵌入的父来源；不能只依赖前端检查。[MDN frame-ancestors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)
- iframe 不携带后台身份 Cookie，不暴露创建者数据。
- 如使用 `postMessage` 自动高度，只向精确 allowlisted origin 发送并校验来源，禁止 `*`。
- 按 form、origin、IP/匿名指纹设置提交和加载限流。
- 首版至少具备 honeypot、重复提交抑制和异常速率阻断；高风险后再评估 CAPTCHA。

#### Product Gate

- 非白名单来源无法加载；嵌套恶意祖先被 CSP 阻止。
- 伪造 Origin/Referer、跨站消息、Cookie 泄漏、点击劫持和暴力提交测试通过。
- Embed 与公开链接使用同一 schema 和提交 API，不产生两套数据。
- 限流降级不会阻断正常公开链接访问。
- Contact Form SEO 只有在真实域名 E2E 和滥用演练通过后才能新增 Embed 承诺。

### 3.8 P1：PDF 预览与单条回复 PDF 导出

#### 安全预览

- 只预览 scan status 为 clean 的 PDF。
- 优先渲染为受控页面图像或使用受限 PDF viewer；禁用脚本、外部资源和任意跳转。
- 原对象保持私有，预览使用短时授权。

#### 单条回复导出

- 从表单标题、字段 label、答案、提交时间生成新的标准回复 PDF。
- 不保留原 PDF 布局，不回填原文件，不包含电子签名。
- 文件附件只显示名称和安全下载引用，不默认嵌入内容。
- 导出操作必须授权并记录审计事件。

#### Product Gate

- 中文、西班牙语、长文本、多选、空值和分页输出无截断。
- PDF 不包含未经授权的私有下载 URL。
- 导出数据与单条 submission 一致，不串表单、不串用户。
- 生成失败不会影响原 submission 和现有 CSV 导出。

## 4. V1.4 Pilots

### 4.1 PDF-to-form

#### 最小边界

- 仅表单创建者可上传，复用 V1.3 安全 PDF 管道。
- 最大 10 MB、20 页；支持文本型 PDF，扫描 PDF 通过 OCR 后再解析。
- 提取标题、问题、选项、required 候选和字段类型建议。
- AI 输出候选 schema，必须进入人工确认页后才能创建表单。
- 每个字段显示来源页码/文本片段和置信提示。
- 只映射 GenForms 已支持字段类型。
- 文件在规定保留期后删除，失败任务可重试且有日志。

#### 不做

- 保留原 PDF 视觉布局。
- 自动回填原 PDF。
- 签名、付款、复杂表格、公式和法律有效性判断。
- 无人工确认直接发布。

#### Gate

- 20 份已脱敏测试 PDF 中，至少 90% 的可识别问题被提取；字段类型准确率至少 85%。
- 任何结果必须允许删除、修改、重新排序和取消。
- 无法安全扫描或解析时明确失败，不生成空白“成功”表单。

### 4.2 WhatsApp 单向提交通知

#### 最小边界

- 仅使用 Meta WhatsApp Cloud API 或经 Mike 确认的正式 BSP。
- 仅向表单所有者配置的团队号码发送一条提交提醒。
- 使用预审模板；消息包含表单名、时间和结果页链接，不包含完整敏感答案。
- Access Token、Phone Number ID 等凭证加密保存，API/UI/日志只显示掩码。
- 支持 Test Send、provider message id、发送日志、有限重试和失败原因。
- 接收并验证 Meta 状态回调，区分 accepted、delivered、failed。

#### 不做

- 接收或读取用户消息。
- 双向聊天、客服 Inbox、自动回复和会话分配。
- 自由文本营销、批量发送和联系人管理。
- 把公开表单分享功能称为原生通知集成。

#### Gate

- 完成 Meta Business/WABA、号码、模板和生产凭证配置。
- Test Send、真实提交、token 失效、模板拒绝、429、5xx、超时和回调验签测试通过。
- 重试不产生重复通知；凭证和完整号码不进入日志与埋点。
- 单独完成成本、opt-in、模板审批和消息保留政策复核后，才允许 SEO Architect。

Meta 官方文档在部分网络环境不可直接抓取；Build 前必须重新核对 Cloud API、模板消息、凭证和状态 Webhook 的最新官方规则。

## 5. 明确不做清单

- WhatsApp 双向机器人、客服收件箱、自动回复和会话历史。
- 完整 Workflow、审批、任务分派、条件外部动作和可视化编排器。
- 电子签名、合同签署和法律证明。
- Smart PDF：原布局保留、字段位置映射、自动回填原 PDF。
- 邮件 Campaign、Respondent 自动回复、Newsletter、邮件附件和复杂模板编辑器。
- CRM、ERP、LMS、Helpdesk 原生同步。
- 多模型自动路由、模型市场和按语言自动选择供应商。
- 任意脚本 Embed、Popup SDK、无来源限制 iframe。
- 全站一次性西语翻译或批量生成西语 SEO 页面。

## 6. 数据模型影响

最终字段名由技术设计确认，产品要求如下：

| 数据对象 | 建议变更 | 兼容策略 |
|---|---|---|
| `form_submissions` | 增加 `is_test`、`response_locale`、`submission_source` | 默认值保持现有真实提交语义。 |
| `form_localizations` | 新表：form、locale、title、description、schema translation、success copy、status、source version | `forms.schema_json` 继续作为默认语言主版本。 |
| `notification_settings` | 新表：form、channel、recipient、enabled、template config、verified status | 不把邮件/WhatsApp 凭证存入 artifact JSON。 |
| `notification_deliveries` | 新表：submission、channel、provider id、status、attempt、error code、timestamps | 不保存 API Key 和完整消息正文。 |
| `submission_files` | 新表：submission、storage key、detected MIME、size、hash、scan status、retention | 迁移期兼容现有 `storage_files_json`，新上传优先写新表。 |
| `form_import_jobs` | V1.4：PDF import source、status、extracted schema、error、expiry | 与普通 submission 文件分离。 |
| `form_embed_settings` | form、enabled、allowed origins、rate policy | 默认 disabled。 |
| `forms.schema_json` | P1 增加版本化 `logic` 数组 | 无 logic 时保持现有 runtime。 |
| `growth_events` | 增加激活、翻译、通知测试、Embed、PDF 与分享事件名 | metadata 严格白名单。 |

数据库迁移必须采用 expand -> dual-read/write -> backfill -> verify -> contract 的顺序，不允许直接破坏现有字段。

## 7. API 影响

| 能力 | 建议 API | 关键约束 |
|---|---|---|
| 测试提交 | `POST /api/forms/{id}/test-submission` | Owner-only；不计费；默认不外发。 |
| 删除测试提交 | `DELETE /api/forms/{id}/test-submission` | Owner-only；只允许删除 `is_test=true` 的记录。 |
| 可信结果查看 | `POST /api/forms/{id}/result-view` | Owner-only；核验 submission 所属表单后，由服务端判定首次激活。 |
| 结果回看 | `GET /api/forms/{id}/submissions/{submissionId}` | Owner authorization；测试标记。 |
| 多语言 | `GET/PATCH /api/forms/{id}/localizations/{locale}` | 版本检查，不能覆盖 source schema。 |
| AI 翻译 | `POST /api/forms/{id}/translations` | Structured output、字段 key 不变、人工确认。 |
| 邮件设置 | `GET/PATCH /api/forms/{id}/notifications/email` | 收件验证、脱敏输出。 |
| 邮件测试 | `POST /api/forms/{id}/notifications/email/test` | 固定安全 payload、限流、审计。 |
| 邮件状态回调 | `POST /api/integrations/email/webhook` | 验签、幂等、只更新 delivery。 |
| 文件上传 | 建议 presign/complete/scan-status 三段 API | Quarantine、大小/MIME/签名校验、私有对象。 |
| PDF 预览 | `GET /api/submission-files/{id}/preview` | Owner authorization、scan clean、短时访问。 |
| PDF 导出 | `POST /api/forms/{id}/submissions/{sid}/export-pdf` | 单条回复、审计、限流。 |
| 条件逻辑 | 复用表单 PATCH + `POST /logic/validate` | 服务端验证、禁止循环。 |
| Embed 设置 | `GET/PATCH /api/forms/{id}/embed` | Owner-only、origin allowlist。 |
| Embed Runtime | `GET /embed/{shareCode}` | CSP、无后台 Cookie、公开数据最小化。 |
| WhatsApp 分享 | 客户端生成分享 URL | 不需要服务端 API，不存联系人。 |
| PDF 导入 | V1.4 `POST/GET /api/form-imports/pdf` | Owner-only、异步任务、人工确认。 |
| WhatsApp 通知 | V1.4 settings/test/callback API | 凭证加密、模板、验签、日志和重试。 |

## 8. 文件与模块影响

以下是预计影响面，不是本轮开发清单：

| 模块 | 预计影响 |
|---|---|
| `Code/types/form.d.ts` | 本地化、logic、test submission、source 和文件状态类型。 |
| `Code/services/form.ts` / `form-runtime.ts` | 兼容新 schema、测试提交和 response locale。 |
| `Code/components/forms/form-generator.tsx` | Context、Action Rail、发布后下一步。 |
| `Code/app/[locale]/(workspace)/forms/**` | Publish、test submission、result detail、notification、translation、embed 设置。 |
| `Code/components/forms/form-runner.tsx` | 语言切换、logic 解释、response locale、embed runtime。 |
| `Code/services/submission-file.ts` / `lib/storage.ts` | 文件验证、quarantine、扫描、私有访问。 |
| `Code/services/skills/email-notification.ts` | 从 Mock 替换为生产 adapter；失败与 submission 解耦。 |
| `Code/services/workflow.ts` | 通知 delivery step，但不扩展为通用 Workflow。 |
| `Code/models/**` | localizations、notifications、deliveries、files、embed/import records。 |
| `Code/app/api/**` | 本地化、通知、文件、Embed、测试提交和导出 API。 |
| `Code/i18n/**` | 新增 `es` 运行时文案；不等于全站内容翻译。 |
| `Code/middleware.ts` / sitemap / metadata | 西语和 Embed 路由边界、noindex/canonical。 |
| `Code/data/install.sql` + migration files | 新表、索引、RLS/访问策略和兼容迁移。 |
| `Code/services/billing.ts` | 测试提交免费、PDF/AI translation/WhatsApp 的计费点。 |

## 9. 第三方与依赖影响

| 能力 | 建议依赖/服务 | 决策 |
|---|---|---|
| 邮件 | Resend API、verified sending subdomain、delivery webhooks | 待 Mike 确认供应商。 |
| AI 翻译 | 复用现有 AI SDK 和当前 provider abstraction | 不新增模型路由平台。 |
| 限流 | Cloudflare Rate Limiting + 服务端 Redis/持久限流二选一 | Embed 前必须选定生产方案。 |
| PDF 解析 | `pdfjs-dist` 或等价成熟解析器 | V1.4 PDF-to-form 才引入。 |
| PDF 生成 | `pdf-lib` 或服务端等价方案 | P1 单条回复导出前验证中文/西语字体。 |
| 恶意文件扫描 | ClamAV 隔离服务或受控扫描供应商 | 不允许只依赖浏览器 MIME。 |
| WhatsApp | Meta WhatsApp Cloud API 或正式 BSP | V1.4 决策；不使用非官方 Web 自动化。 |

## 10. 商业化建议

| 能力 | 免费范围 | 付费候选 |
|---|---|---|
| 首次成功闭环 | 全部免费 | 不设付费墙。 |
| 测试提交 | 免费且不计额度 | 不商业化。 |
| 创建者邮件 | 每表单一个创建者邮箱 | 自定义团队收件人、更多通知额度后续 Pro。 |
| 多语言 | Pilot 期间 source + 1 target language | 更多语言、批量翻译可进入 Pro。 |
| 基础条件逻辑 | 少量规则 | 更多规则或高级组合后续 Pro，但 V1.3 不做高级组合。 |
| Embed | 可给 Pilot 用户 | 正式可作为 Pro 能力，避免免费滥用成本。 |
| PDF 上传/预览 | 小文件、小额度 | 容量、保留期和导出可进入 Pro。 |
| PDF-to-form | 少量试用 Credits | 按页/任务消耗 Credits。 |
| WhatsApp 通知 | Test Send | 按消息成本或 Pro add-on，必须透明展示第三方费用。 |

商业化不能阻挡首次闭环；用户必须先证明表单能工作，再看到升级价值。

## 11. 防回归方案

1. 所有扩围能力默认 feature flag 关闭。
2. 数据模型只做向后兼容扩展；旧表单无新字段时走现有逻辑。
3. Email、WhatsApp、PDF import 采用独立 adapter，不修改通用 Webhook provider contract。
4. 通知失败不影响 submission 保存；PDF 导出失败不影响 CSV。
5. Test submission 不调用计费和外部发送代码，除非用户显式 Test Send。
6. 每阶段必须运行：
   - schema/type 单元测试。
   - create/publish/submit/billing/Webhook 回归测试。
   - API 鉴权与错误测试。
   - desktop/mobile E2E。
   - production build 和 release gate。
7. 每次只开放一个 Pilot cohort；观察错误率、完成率和支持问题后再扩大。
8. 任何迁移必须提供 dry-run、backfill、verify 和 rollback/disable 方案。

## 12. SEO 解锁规则

| 能力 | 可开启 Topic | 上线前条件 |
|---|---|---|
| 激活闭环 | 不单独建 Topic | 作为所有 SEO 页的产品承接底座。 |
| 创建者邮件通知 | `form email notifications`、`contact form email notification` 候选 | 生产发送、Test Send、日志、bounce/complaint Gate 通过后再做 SERP Validate。 |
| 多语言表单 | `multilingual form builder`、`Spanish form builder`、`translate form to Spanish` 候选 | `en/zh-Hans/es-419` 完整运行时 E2E；西语 SERP Validate；不得批量翻译。 |
| 条件逻辑 | `conditional logic form builder`、`branching form` 候选 | 编辑器、客户端/服务端解释一致、循环与隐藏 required Gate 通过。 |
| 安全 Embed | `embed form in website`、Contact Form Embed 子主题 | CSP、来源白名单、限流和真实外站 E2E 通过。 |
| 安全 PDF 上传 | `form with PDF upload` 候选 | 私有存储、扫描、预览、授权下载全部通过；先做 SERP Validate。 |
| 单条回复 PDF | 只能作为支持能力 | 不单独建 SEO Pillar。 |
| WhatsApp 分享链接 | 只能作为分享能力 | 不得建立 WhatsApp Integration Topic。 |
| PDF-to-form | `convert PDF to online form`、`AI PDF form generator` 候选 | V1.4 Pilot 达到识别质量 Gate，并完成独立 SERP Validate。 |
| WhatsApp 通知 | 窄技术 Post/Integration 候选 | Meta 生产 E2E、模板、凭证、日志、重试和合规 Gate 通过；不做 WhatsApp Form Builder 泛词。 |
| 多模型路由 | 不做 SEO Topic | 不属于当前用户主任务。 |

竞品拥有某项功能只能证明市场类别存在，不能替代 Google SERP Validate 或 GenForms Product Gate。

## 13. 分阶段路线图

### Stage 0：Baseline & Safety

- 统一 `activation_completed` 定义和归因过滤。
- 修复/隐藏公开可见的 Mock 邮件承诺。
- 收口现有 PDF 上传安全。
- 建立 feature flags 和回归基线。

### Stage 0.5：UX Prototype Gate

- 只设计五个状态：Context-loaded Create、Generated Draft、Publish Success、Test Runner、First Result。
- 完成桌面/移动低保真原型和 5 名非内部用户测试。
- 通过标准：4/5 理解场景、4/5 完成发布、4/5 正确理解测试提交、4/5 找到测试结果；闭环中位时间不超过 5 分钟。
- 未通过前不进入首次成功闭环开发。

### Stage 1：First Success

- Context -> Generate -> Publish -> Test -> Result Action Rail。
- 测试提交与结果详情。
- WhatsApp 链接分享作为发布动作。

### Stage 2：Reliable Notification

- 创建者邮件设置、Test Send、delivery logs、retry 和状态回调。
- 完成生产域名和供应商 Gate。

### Stage 3：Language Pilot

- `form_localizations`。
- `en/zh-Hans/es-419` AI 翻译与人工确认。
- 单链接多语言运行时。

### Stage 4：Adaptive & Distributed Forms

- 基础条件逻辑。
- 安全 Embed。
- PDF 预览和单条回复 PDF。

### Stage 5：V1.4 Pilots

- PDF-to-form。
- WhatsApp 单向通知。

不得以日期代替 Gate。只有前一阶段满足验收标准后，下一阶段才能进入 Build。

## 14. 验收指标

### 主指标

- `activation_completed / qualified_creation_entrants`
- P50 `time_to_first_draft`
- P50 `time_to_activation_completed`
- Publish success rate
- Test submission success rate
- First result view rate

### Pilot 目标

在至少 20 个排除 Mike/Admin/dev 的 qualified creation entrants 样本中观察：

- 至少 50% 得到可预览 draft。
- 至少 30% 发布。
- 至少 20% 完成测试提交或首条真实提交并查看结果。

这些是 Pilot 目标，不是当前基线，也不是对外承诺。样本不足时只报告人数和路径，不报告稳定百分比。

### Guardrails

- 现有 create/publish/submit/Webhook 失败率不得明显上升。
- Test submission 误触发外部通知次数为 0。
- 通知重复发送次数为 0。
- 未扫描文件可访问次数为 0。
- 跨表单/跨用户数据泄漏为 0。
- 旧表单无需迁移即可继续发布和提交。

## 15. 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| 同时开发过多能力，闭环继续为 0 | 高 | 严格串行 Stage Gate，Stage 1 未过不并行。 |
| GA4 噪声导致误判 | 高 | 排除 Admin/dev/internal，按 form/user 复现事件链。 |
| 邮件 Mock 被误认为真实 | 高 | Stage 0 先隐藏或标注，生产 adapter 过 Gate 后再开放。 |
| PDF 恶意文件与公开对象泄漏 | 高 | Quarantine、扫描、私有存储、签名访问、限流。 |
| Embed 放大垃圾提交与成本 | 高 | 默认关闭、origin allowlist、CSP、限流、honeypot。 |
| AI 翻译破坏 schema key | 高 | Structured diff、不可变 key/value、人工发布。 |
| 条件逻辑导致隐藏必填死锁 | 高 | 同一规则引擎、发布前静态验证、循环检测。 |
| WhatsApp 凭证与模板运营复杂 | 高 | 留在 V1.4，复用 Slack Gate 模式，独立成本/合规评审。 |
| PDF-to-form 被误解为 Smart PDF | 中 | UI 和 SEO 明确“不保留原布局、不回填原文件”。 |

## 16. 需要同步修改的协作规范

Mike 批准本 PRD 后，另开文档任务同步以下文件；本轮不直接修改：

1. `AGENTS.md`
   - 将当前 MVP 范围增加 V1.3 已批准能力。
   - 保持 Workflow、电子签名、Smart PDF 和 WhatsApp 双向能力为禁止项。
   - 增加文件上传、通知和 Embed 的安全 Gate。
2. `AI_EXECUTION_CHECKLIST.md`
   - 增加 feature flag、数据迁移、第三方外发、文件扫描和回归检查。
3. `COLLABORATION_SUPPLEMENT.md`
   - 增加“逐阶段 Gate，不并行扩围”的执行规则。
4. `ProjectDocs/README.md`
   - 增加 V1.3 导航和与冻结 PRD 的版本关系。
5. `ProjectDocs/API.md`、部署清单和用户手册
   - 在功能进入 Build 时分别补 API、环境变量、迁移、回调和手动验收步骤。

未经 Mike 确认，不得因为本 Draft 自动扩大代码开发范围。

## 17. Mike 最终决策项

- [ ] 批准 V1.3 串行路线和首次成功闭环定义。
- [ ] 批准 PDF 上传安全收口提升为 P0 Gate。
- [ ] 确认邮件首版只通知创建者/一个验证团队邮箱。
- [ ] 确认首个邮件供应商是否为 Resend。
- [ ] 确认多语言采用一个表单、一个链接、`en/zh-Hans/es-419` 三种内容版本。
- [ ] 确认 `es-419` 先做产品 Pilot，西语 SEO 继续 Hold，并设置 28 天转向 `ja-JP` 的复核 Gate。
- [ ] 确认 UX 负责人进入限定五个状态的低保真原型，不直接开发或全站改版。
- [ ] 确认 WhatsApp 分享仅为公开链接分发，不称原生集成。
- [ ] 确认 PDF-to-form 和 WhatsApp 通知保留在 V1.4 Pilot。
- [ ] 确认多模型 LLM 路由不进入 V1.3。
