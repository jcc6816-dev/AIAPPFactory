# G2 Activation Diagnosis：断点地图与优先修复建议（2026-07-06）

## 结论

本轮 G2 不支持继续把问题泛化为“SEO 页面不好”或“全站需要重设计”。更准确的结论是：

**当前最严重、最值得优先修复的断点在 `/forms/new` 模板承接之后、创建成功之前。**

已有证据显示，至少有真实用户能够从入口进入模板生成页，并触发模板上下文加载和预览就绪；但外部用户没有继续完成创建。也就是说，问题不是“用户完全找不到产品入口”，而是进入 `/forms/new` 后没有被足够明确地带到第一个成功动作。

本轮建议只修一个主因：

> 把 `/forms/new?template=...` 的模板到达态改成一个清晰的 first-action rail：告诉用户“这个表单已经准备好”，给出唯一主按钮“使用此模板创建表单 / Create this form”，并明确登录后会保留当前模板上下文。

这不是页面大改，而是一次激活断点修复。SEO 页面、模板页、博客页本轮继续 Hold。

## 目标与边界

### 本轮目标

- 建立 G2 Activation Diagnosis 的断点地图。
- 判断每个断点是通过、不通过，还是证据不足。
- 给出一个优先修复建议。

### 本轮不做

- 不改页面。
- 不改 SEO 页面。
- 不扩展新功能。
- 不把 Clarity 汇总指标直接当成 UX 结论。
- 不用内部 E2E 成功样本冒充外部用户转化。

## 数据源与可信度

| 数据源 | 范围 | 用途 | 可信度判断 |
| --- | --- | --- | --- |
| Growth Events | 近 7 天，原始 634 条事件 | 路径、来源、页面动作、产品事件 | 可用；需过滤内部、Codex、部署检查、后台与测试噪声 |
| Growth Events 保守过滤口径 | 近 7 天，231 条非内部/非测试事件 | 本轮断点地图主证据 | 中高；宁可少算，不把内部验证当用户 |
| `/api/admin/growth/forms-new-activation-monitor` | 168 小时 | `/forms/new` 专项漏斗 | 可用；但部分新事件 2026-07-06 才上线，7 天零值不能直接解释为用户没有点击 |
| Microsoft Clarity API | 近 3 天实时聚合 + 近 7 天快照 | 物理卡点、Dead Click、页面存在性 | 只能辅助；录屏级证据本轮未完成，历史 rage/script 汇总不作为结论依据 |
| 受控生产 E2E | 2026-07-06 | 证明主链路可跑通 | 只能证明系统可用，不能证明真实用户会转化 |

## 数据口径

### 为什么不用原始 634 条事件直接判断

原始事件中混入了后台访问、Codex 产品 Gate、部署检查、内部验证、开发/测试来源等噪声。若直接使用，会把我们自己的验证行为算成用户行为，从而误判“生成、发布、提交已经有人完成”。

本轮采用保守过滤口径，排除以下类型：

- `is_dev`、`is_internal`、`is_test` 等显式标记；
- `codex`、`internal`、`deploy_check`、`e2e` 等来源或路径；
- `/admin` 后台路径；
- localhost、IP 直连等明显非公开用户路径。

过滤后剩余 231 条事件，作为断点地图主口径。

### 过滤后的 7 天事件概览

| 事件 | 数量 | 解释 |
| --- | ---: | --- |
| `page_view` | 77 | 公开页面访问仍存在，但不能等同于有效高意图用户 |
| `page_leave` | 75 | 可辅助判断退出点 |
| `landing_viewed` | 43 | 首页/落地页被看到 |
| `template_viewed` | 10 | 有少量模板页访问 |
| `forms_new_view` | 2 | 保守口径下，真实进入 `/forms/new` 的样本很少 |
| `template_context_loaded` | 2 | 进入 `/forms/new` 后模板上下文可以加载 |
| `workspace_preview_ready` | 3 | 预览可以就绪，模板承接不是主断点 |
| `form_created` | 3 | 多数无法可靠归因为外部自然用户，不能当成真实转化通过 |
| `form_published` | 1 | 同上，需要谨慎解释 |

## `/forms/new` 漏斗证据

168 小时专项 monitor 返回：

| 指标 | 数量 | 解释 |
| --- | ---: | --- |
| raw events | 1000 | monitor 查询窗口内原始事件 |
| scoped events | 26 | 与 `/forms/new` 专项事件相关 |
| qualified sessions | 5 | 合格 session 很少，样本处于冷启动状态 |
| `forms_new_view` | 3 | 有用户到达 `/forms/new` |
| `template_context_loaded` | 2 | 模板上下文加载成功 |
| `workspace_preview_ready` | 4 | 工作区预览就绪 |
| `forms_new_primary_action_viewed` | 0 | 新增埋点上线时间太短，不能当作 7 天结论 |
| `forms_new_primary_action_clicked` | 0 | 同上 |
| `guest_login_intent_started` | 0 | 同上 |
| `guest_login_intent_returned` | 0 | 同上 |
| `form_created` | 3 | 包含受控验证和归因不完整样本，不能直接视为外部转化 |

关键判断：

1. `/forms/new` 不是完全打不开，也不是模板上下文完全失效。
2. 模板承接到预览就绪这段基本可用。
3. 新增 CTA 和 guest login intent 事件尚未积累足够外部样本，登录断点暂不能下结论。
4. 当前最有价值的真实证据集中在“预览就绪后没有创建”。

## 关键 session 证据

### Session A：Google.hk 进入，模板承接成功，但未创建

- 来源：`google.com.hk`
- 路径：`/zh` → `/zh/forms/new?template=event-registration`
- 关键事件：
  - `forms_new_view`
  - `template_context_loaded`
  - `workspace_preview_ready`
  - 再次 `workspace_preview_ready`
  - 约 5 分钟后离开
- 未出现：
  - `ai_generate_submitted`
  - `form_created`
  - `form_published`

判断：入口不是主断点，模板承接不是主断点；用户在 `/forms/new` 停留了足够久，却没有跨过创建动作。这是本轮最强的外部断点证据。

### Session B：解决方案页进入，预览就绪后快速离开

- 路径：`/zh/forms/new?template=lead-capture&source=solution_real-estate-inquiry-form-template`
- 关键事件：
  - `workspace_preview_ready`
  - `page_view`
  - `forms_new_view`
  - `activation_started`
  - `template_context_loaded`
  - 约 3.6 秒后 `page_leave`
- 未出现：
  - `ai_generate_submitted`
  - `form_created`

判断：模板可以带入，但用户在首屏没有形成继续动作。可能是不知道下一步、没有看到明确主按钮、对“是否已生成/是否可用”缺少确定感，或登录/保存预期不清楚。

### Session C：受控 E2E 可以跑通，但不能证明外部用户通过

受控生产验证已完成：

- 创建表单；
- 发布表单；
- 打开提交页；
- 完成测试提交。

判断：这证明主链路不是物理瘫痪，但不能覆盖真实用户在 `/forms/new` 的理解和行动问题。

## Clarity 证据

本轮可用 Clarity 证据主要是聚合指标，不是完整录屏审计。

### 可采用的 Clarity 信号

- 近 3 天聚合显示：
  - PC：5 sessions，1 个 Dead Click；
  - Tablet：3 sessions，2 个 Dead Click；
  - BetaList UTM 首页：2 sessions，2 个 Dead Click；
  - `/zh/forms/new?source=codex_product_gate_20260706...`：1 session，0 Dead Click。
- 2026-07-05 快照：
  - totalSessions：7；
  - totalRageClicks：0；
  - totalScriptErrors：0。

### 不采用为结论的 Clarity 信号

历史快照中曾出现“session 数 = rage click 数 = script error 数”的异常形态。此前已经确认 `sessionsCount` 与 `subTotal` 语义容易被误读，因此本轮不再用旧 rage/script 汇总断言页面有严重物理 Bug。

### Clarity 结论

Clarity 当前没有证明 `/forms/new` 存在崩溃、404、严重脚本错误或大面积 Rage Click。它能支持的是：真实录屏仍值得继续看，但本轮已经有足够事件证据先定位到 `/forms/new` 的 first action 断点。

## 断点地图

| 断点 | 状态 | 证据 | 判断 |
| --- | --- | --- | --- |
| 入口断点：公开页面是否把用户带向产品 | 部分不通过 | 过滤后 77 个 page_view，仅 2 个 `forms_new_view`；但存在 Google.hk 用户从 `/zh` 进入 `/forms/new` | 入口有弱点，但不是本轮最强证据。后续可优化 CTA，但不应先大改 SEO 页面 |
| `/forms/new` 理解/行动断点 | 不通过 | Google.hk session 到达模板页、预览就绪、停留约 5 分钟后离开；另一个 lead-capture session 预览就绪后 3.6 秒离开 | 本轮 P0/P1 断点。用户看到或等待到了某种结果，但没有被带到“创建这个表单” |
| 模板承接断点 | 通过 | `template_context_loaded` 2 次，`workspace_preview_ready` 3-4 次；event-registration 与 lead-capture 均可承接 | 模板参数和预览链路基本可用，不是优先修复对象 |
| AI 生成断点 | 证据不足 | 外部样本几乎没有 `ai_generate_submitted`；内部样本可生成 | 不能判断生成质量或等待焦虑是否是主因。需要更多 post-G1 样本 |
| 登录断点 | 证据不足 | guest login intent 相关埋点为 0，但这些事件 2026-07-06 才上线 | 不能把 7 天零值解释为登录没问题或登录有问题 |
| 首次成功断点：创建 → 发布 → 提交 | 外部证据不足，内部通过 | 受控 E2E 通过；外部用户未确认完成创建发布提交 | 系统能力可用，但真实用户首次成功尚未被证明 |

## 最大卡点

最大卡点不是“页面没人看”，也不是“模板带不过来”。

**最大卡点是：用户到达 `/forms/new` 后，没有获得足够明确、低风险、可立即执行的下一步。**

在用户心里，这里可能有几个不确定：

- 这个表单是不是已经生成好了？
- 我现在该点哪里？
- 点了以后会不会丢失当前模板？
- 是否必须注册？
- 注册后会不会回到刚才的表单？
- 这个页面最终能不能发布成链接/二维码并收到提交？

这些不确定都发生在首次成功之前，因此会直接压低激活。

## 优先修复建议

### 建议修复项

在 `/forms/new?template=...` 的模板到达态增加或强化一个首屏 first-action rail。

核心目标：让用户在 3 秒内明白：

1. 表单已经准备好；
2. 现在只需要点击一个主按钮；
3. 登录不会丢失当前模板；
4. 下一步会得到可发布链接、二维码和提交数据。

### 建议文案

中文：

- 标题：`你的活动报名表已经准备好`
- 说明：`可以先直接创建表单，之后再调整字段、主题和发布设置。`
- 主按钮：`使用此模板创建表单`
- 次按钮：`先编辑字段`
- 登录提示：`需要登录后保存和发布；登录后会回到当前表单。`
- 成功预期：`创建后可获得分享链接、二维码，并在数据面板查看提交。`

英文：

- Title: `Your event registration form is ready`
- Body: `Create it first, then adjust fields, theme, and publishing settings.`
- Primary CTA: `Create this form`
- Secondary CTA: `Edit fields first`
- Login note: `Sign in is required to save and publish. We’ll bring you back to this form after sign-in.`
- Success expectation: `You’ll get a share link, QR code, and a submissions dashboard.`

### 交互要求

- 模板到达且 `workspace_preview_ready` 后，主按钮必须在首屏可见。
- 移动端也必须在首屏或 sticky 底部可见。
- 点击主按钮时：
  - 如果未登录，记录 `forms_new_primary_action_clicked` 和 `guest_login_intent_started`；
  - 登录回来后记录 `guest_login_intent_returned`；
  - 上下文必须保留 template、source、prompt 或 draft state。
- 如果已登录，点击后应直接创建或进入明确的创建流程。
- 不要新增复杂编辑器，不要引入工作流、Skill、OCR、审批等 MVP 之外能力。

## 验收标准

### 事件验收

上线后 48 小时内，Hermes monitor 应持续观察：

- `forms_new_view`
- `workspace_preview_ready`
- `forms_new_primary_action_viewed`
- `forms_new_primary_action_clicked`
- `guest_login_intent_started`
- `guest_login_intent_returned`
- `form_created`

判断规则：

| 结果 | 解释 | 下一步 |
| --- | --- | --- |
| `forms_new_view > 0` 但 `forms_new_primary_action_viewed = 0` | CTA 可能不可见、埋点失效或渲染条件错误 | 立即修 instrumentation/visibility |
| `forms_new_primary_action_viewed > 0` 但 click 为 0 | 文案/位置/信任仍不足 | 改主按钮和首屏说明 |
| click 有了但 login start/return 断 | 登录保留上下文失败或登录预期不清楚 | 修登录回跳和上下文恢复 |
| login return 有了但 form_created 断 | 创建动作或生成等待仍有问题 | 再诊断生成/创建 |
| form_created 有了但 publish/submit 断 | 下一轮进入首次成功断点 | 修发布与测试提交引导 |

### 人工/录屏验收

Clarity 或 Antigravity GUI 只需抽查以下样本，不需要 Mike 大量手工操作：

- 访问 `/forms/new?template=...` 的非内部 session；
- 点击主 CTA 但未创建的 session；
- 登录前后回跳 session；
- BetaList 首页 Dead Click session。

每条只记录退出点和物理 Bug，不抄录隐私内容。

## 分工建议

| 角色 | 下一步职责 |
| --- | --- |
| AI 总管 / Codex | 如果确认修复，负责实现 first-action rail、埋点校验、测试与部署 |
| Hermes Agent | 继续 7×24 监控 `/forms/new` 激活漏斗；仅在 Iterate/告警时推送飞书 |
| Antigravity GUI / Mike | 仅在 Clarity 录屏需要登录态、人机验证或浏览器人工判断时介入 |
| UX Session | 根据本报告输出首屏 action rail 的中文/英文文案和移动端布局建议 |
| 产品 Session | 决定“直接创建”还是“先编辑字段”为主路径，并维护 Pass / Iterate / Stop |
| SEO Session | 暂不大改页面；继续观察搜索意图和页面入口质量 |

## 决策

建议进入下一步：

**执行 `/forms/new` first-action rail 修复。**

不建议现在做：

- 大范围 SEO 页面改写；
- 全站首页重设计；
- 新增复杂模板编辑器；
- 直接优化登录系统；
- 根据 Clarity 历史 rage/script 汇总做 Hotfix。

原因很简单：当前证据最清楚地指向“模板承接后，用户不知道/不愿跨过第一个创建动作”。先修这个点，成本最低，离首次成功最近，也最容易用 Hermes monitor 验证。
