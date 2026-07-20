# Gemini 设计任务：GenForms First Success Loop 全套高保真界面

日期：2026-07-04  
负责人：Gemini 视觉 / UX 设计  
评审人：Mike、Codex  
任务类型：高保真产品界面设计，不开发代码

## 1. 任务背景

GenForms 当前已经实现首次成功闭环：

`场景/模板进入 -> 生成表单 -> 发布 -> 免费测试提交 -> 查看第一条结果`

现有版本解决了流程可用性，但视觉吸引力、产品品牌感、信息层级和结果感仍然不足。当前界面容易呈现为“功能很多的工程工作台”，而不是“用户第一次使用就能顺利完成任务的 AI 表单产品”。

本任务需要重新设计这一闭环的完整高保真界面。不要在现有页面上做换颜色、加阴影或局部美化；应在不改变产品范围和状态机的前提下，重新建立统一、可信、有吸引力且可落地的产品视觉系统。

## 2. 开工前必须阅读和查看

产品与流程基线：

1. `/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.3-MVP-Expansion.md`
2. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/first-success-loop-ux-2026-07-01/README.md`
3. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-lowfi-2026-07-01/prototype-spec.md`
4. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/form-creation-focus-phone-nav-2026-07-04/README.md`

现有视觉证据：

1. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/form-creation-focus-phone-nav-2026-07-04/after-desktop-focus-phone.png`
2. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/form-creation-focus-phone-nav-2026-07-04/after-mobile-focus-phone.png`
3. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/form-creation-focus-phone-nav-2026-07-04/after-saved-nav-final.png`
4. `/Users/mike/Documents/AIFactory/ProjectDocs/Operations/audits/form-creation-focus-phone-nav-2026-07-04/compare-new-desktop-same-viewport.png`
5. 低保真总览：`/Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-lowfi-2026-07-01/GenForms_First_Success_Loop_LowFi_All_Slides.png`

本地产品页面：

`http://localhost:3100/forms/new?template=event-registration`

先截取当前页面作为设计前证据。任何结论必须基于真实页面、截图和 PRD，不要凭空增加功能。

## 3. 产品边界

### 可以设计的能力

- AI 生成表单
- 继承模板和场景意图
- 真实表单预览
- 保存草稿
- 发布公开链接
- Copy、Open、QR、WhatsApp 公开链接分享
- 免费测试提交
- 测试结果保存并显示 `Test` 标识
- 提交结果详情
- 空数据面板引导发送测试提交

### 绝对不能暗示或设计

- Workflow 或 Skill 编排
- WhatsApp Bot、自动 WhatsApp 通知
- Smart PDF、文件上传、OCR
- 自动审批、CRM、项目管理
- 电子签名、支付、自动报价
- 大而全的拖拽表单编辑器
- 尚未实现的协作、评论、多人审批能力

WhatsApp 只能表示“把公开表单链接分享到 WhatsApp”，不能表现为原生集成。

## 4. 核心设计目标

1. 用户进入任何状态后，3 秒内知道“我现在在哪里”和“下一步做什么”。
2. 每个桌面端和移动端状态只能有一个视觉主 CTA。
3. 让真实表单结果成为视觉中心，而不是让导航、设置和装饰抢占注意力。
4. AI 感来自明确的上下文继承、生成反馈和智能建议，不使用泛滥的星光、渐变和未来科技装饰。
5. 发布后必须立即产生“已经得到一个可使用、可分享的表单”的结果感。
6. 测试提交必须让用户明确理解：免费、保存结果、不触发任何外部通知。
7. 第一条结果必须让用户感到闭环完成，并自然进入真实分享，而不是停在数据详情死路。

## 5. 视觉方向

请先制作 3 个小型方向板，每个方向只需要包含：色彩、字体、按钮、Context Banner、Action Rail 和一张 Generated Draft 关键帧。三个方向必须明显不同，但都符合 GenForms 产品边界。

随后由你自行选择并说明最推荐的一个方向，直接完成整套高保真图，不要停下来等待选择。

推荐方向应符合以下原则：

- 轻盈、清晰、可信、现代，偏成熟的国际 SaaS 产品工具。
- 以白色和浅灰工作区为主；GenForms 蓝作为主操作色；青绿仅用于成功和安全测试状态。
- 避免紫色大渐变、深蓝整页背景、米色、棕橙单色主题、发光球体和无意义装饰。
- 不要把每个区域都做成悬浮卡片；卡片只用于 Action Rail、重复内容和需要明确边界的状态块。
- 圆角克制，普通容器建议 6-8px；按钮和输入控件可依据现有设计系统略微调整。
- 使用 Lucide 或项目已有图标语言，不手绘图标，不使用 emoji。
- 标题有力量但不能营销化；这是产品工作区，不是官网 Hero。
- 保持足够留白，但不牺牲常用信息密度。
- 可以大胆改变页面结构和视觉重心，但不能改变五状态流程和产品事实。

## 6. 必须完成的 12 张高保真界面

统一使用以下示例场景：`Event Registration Form`。所有表单字段、链接、结果和状态必须真实、前后一致。

### 状态 1：Context-loaded `/forms/new`

桌面 1440 x 900、移动 390 x 844，各 1 张。

必须包含：

- 持久化 Context Banner：模板名、来源、场景意图、推荐字段、Change / Clear。
- 明确说明正在创建活动报名信息收集表。
- 真实字段预览，例如 Full name、Email、Attendance type、Organization、Dietary requirements、Consent。
- Prompt 可修改，但不能比真实预览更抢眼。
- 高级视觉设置默认折叠。
- 唯一主 CTA：`Generate this form`。

### 状态 2：Generated Draft

桌面、移动各 1 张。

必须包含：

- Context Banner 继续存在，但视觉权重降低。
- 真实表单预览是全页视觉中心。
- Phone / Desktop 预览切换清楚但克制。
- AI 修改、字段设置和视觉设置作为次级操作。
- 状态驱动 Action Rail 显示 `Draft ready`。
- 唯一主 CTA：`Publish form`。
- 移动端不能同时出现多排工具栏，次级操作进入 `More`。

### 状态 3：Publish Success

桌面、移动各 1 张。

必须包含：

- 清晰、可信但不过度庆祝的成功状态。
- 首屏优先显示公开链接。
- 同一操作组中显示 Copy、Open、QR、WhatsApp。
- QR 可展开查看，但不能压过公开链接。
- 明确提示表单已经可用、可以分享。
- 唯一主 CTA：`Send free test`。
- Readiness、历史、Webhook 和高级信息放在首屏以下或折叠区。

### 状态 4：Test Runner

桌面、移动各 1 张。

必须包含：

- 使用真实表单运行时，不制作假的简化表单。
- 持久化 Test Mode 提示，明确三件事：
  - Free, does not use credits
  - Saved to Results
  - No email, Webhook, WhatsApp, or external automation
- Test Mode 必须明显但不能像错误警告。
- 移动端表单字段单列，点击区域至少 44px。
- 唯一主 CTA：`Submit test response`。
- `Exit test` 为弱次级入口。

### 状态 5：First Result

桌面、移动各 1 张。

必须包含：

- 直接展示刚刚保存的第一条提交详情。
- 状态旁显示清晰的 `Test` 标识。
- 用户答案优先，技术元数据次要。
- 显示保存成功，不发送外部通知。
- 唯一主 CTA：`Share public form`。
- Copy link、Open form、View all results 为次级操作。

### Empty Submissions 变体

桌面、移动各 1 张。

必须包含：

- 清楚说明当前还没有提交。
- 不要先显示统计图、日志或设置。
- 唯一主 CTA：`Send test submission`。

总计必须交付 12 张完整界面，不得用局部组件代替完整页面。

## 7. 导航和布局规则

- 新建状态不要显示 `Design / Data / Analytics / Publish` 长期菜单。
- 表单保存后可以显示长期菜单，但不能与保存、发布按钮重叠。
- 流程进度不是第二套一级菜单，不要再制作 `Context / Generate / Publish / Test / Result` 五个可点击胶囊。
- 可以用轻量状态文字、细进度线或 Action Rail 表达当前阶段。
- 桌面端 Action Rail 可以位于右侧，但不得让主预览显得狭窄或偏移。
- 移动端 Action Rail 必须变为底部主操作区，并且不能遮挡内容。
- 次级操作优先收纳进 Sheet / More，不要在移动端横向滚动工具栏。

## 8. 多语言和响应式要求

完整 12 张界面使用英文 UI，同时额外完成两个文本膨胀验证帧：

1. 简体中文：移动端 Context-loaded。
2. 西班牙语：桌面端 Publish Success。

要求：

- 中文、日文使用系统 CJK 字体回退；英文和西班牙语使用 Inter 或兼容无衬线字体。
- 按钮根据内容扩展，不使用容易截断的固定宽度。
- 标签优先换行，不使用负字距和过度缩小字体。
- 200% 伪本地化文本下，主 CTA、Context Banner、Action Rail 和分享操作不能重叠。
- 语言切换不能造成状态、Prompt 或测试答案丢失；高保真图需通过注释说明这一点。

## 9. 必须补充的组件与规范页

除页面图外，再提供一张组件与视觉规范画板，至少包含：

- 颜色 Token
- 字体层级
- 8px 基础间距系统
- Primary / Secondary / Tertiary / Destructive 按钮
- Context Banner 的桌面与移动形态
- Action Rail 的五种状态
- Test Mode Banner
- Success、Test、Saved、Suppressed 状态标签
- 输入框、字段组、切换器、More Sheet
- QR、Copy、Open、WhatsApp 分享操作
- 空状态
- Focus、Hover、Pressed、Disabled、Loading 状态

同时标注主要组件尺寸、间距、圆角、字体和响应式变化，不需要输出 CSS 代码。

## 10. 交付格式

交付目录：

`/Users/mike/Documents/AIFactory/ProjectDocs/Operations/prototypes/first-success-loop-hifi-2026-07-04/`

必须包含：

- `01-context-loaded-desktop.png`
- `02-context-loaded-mobile.png`
- `03-generated-draft-desktop.png`
- `04-generated-draft-mobile.png`
- `05-publish-success-desktop.png`
- `06-publish-success-mobile.png`
- `07-test-runner-desktop.png`
- `08-test-runner-mobile.png`
- `09-first-result-desktop.png`
- `10-first-result-mobile.png`
- `11-empty-submissions-desktop.png`
- `12-empty-submissions-mobile.png`
- `13-context-loaded-mobile-zh.png`
- `14-publish-success-desktop-es.png`
- `15-component-and-token-sheet.png`
- `all-screens-overview.png`
- 可编辑源文件或源文件链接
- `design-rationale.md`
- `implementation-spec.md`

`design-rationale.md` 必须用中文说明：

- 三个方向的差异
- 为什么选择最终方向
- 相比当前页面解决了什么
- 哪些设计是为了转化，哪些是为了降低学习成本
- 哪些地方刻意没有增加功能

`implementation-spec.md` 必须用中文说明：

- 页面结构与组件复用关系
- 各状态唯一主 CTA
- 桌面和移动端差异
- 多语言适配规则
- 动效建议，限定为 150-250ms 的状态反馈，不要大面积炫技动画
- 前端实施优先级：P0 / P1 / P2

## 11. 质量门槛

交付前逐项自检：

1. 12 张主界面是否全部完成。
2. 每张是否只有一个主 CTA。
3. 五个状态是否像同一个产品，而不是五套独立概念图。
4. 是否一眼看出真实 Event Registration 表单，而不是通用 Dashboard。
5. Phone 预览是否完整且内部可滚动。
6. 桌面导航、保存和发布是否没有重叠。
7. 移动端是否没有横向滚动工具栏。
8. Publish Success 是否先看到公开链接和免费测试。
9. Test Runner 是否清楚表达免费、保存、不外发。
10. First Result 是否清楚显示 `Test` 标识和真实答案。
11. 中文和西班牙语是否没有截断、重叠或字体异常。
12. 是否没有暗示任何未实现能力。

不接受以下交付：

- 只交付一张首页或一张 Dashboard。
- 只输出线框图、文字描述或 UI 灵感板。
- 用大面积渐变、玻璃拟态和装饰性插画掩盖信息层级问题。
- 没有桌面与移动配对。
- 页面内容前后不一致。
- 设计无法对应现有产品状态和真实能力。

## 12. 最终汇报格式

Gemini 完成后，请按以下结构汇报：

1. 总体设计判断
2. 三个视觉方向与推荐选择
3. 15 张画板和总览图路径
4. 五个状态的主 CTA 对照表
5. 与当前页面相比的关键改进
6. 尚存风险与需要 Mike 确认的事项
7. 是否建议进入 Codex 前端实现评审

在 Mike 选择并确认最终视觉方向前，不得修改 `Code/`，不得直接开发。
