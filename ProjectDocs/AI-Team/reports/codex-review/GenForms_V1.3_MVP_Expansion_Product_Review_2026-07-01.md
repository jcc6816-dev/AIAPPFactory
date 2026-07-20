# GenForms V1.3 MVP Expansion 产品评审结论

> 日期：2026-07-01  
> 状态：Draft，待 Mike 决策  
> 评审范围：首次成功闭环、多语言表单、邮件通知、基础逻辑、Embed、PDF、WhatsApp  
> 详细需求草案：[PRD-V1.3-MVP-Expansion.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.3-MVP-Expansion.md)

## Executive Summary

- **方向正确，但必须改为串行扩围。** V1.3 第一目标不是增加功能数量，而是让用户完成“场景/模板 -> 生成 -> 发布 -> 测试提交 -> 查看结果”。截至 2026-06-30，GA4 7 天记录 164 sessions、3 次模板点击、1 次生成、0 发布、0 提交；28 天有 29 次生成但仍无发布/提交事件。数据混有 Admin 与内部访问，不能计算可靠转化率，但足以证明闭环事件和路径需要优先收口。
- **生产级创建者邮件通知应保留 P0，并排在多语言之前。** 它直接解决“表单有人提交后，我如何及时知道”的核心任务，也是 Contact Form 竞品和 SERP 中反复出现的基础预期。当前 `email-notification.ts` 是 Mock，公开产品不得继续把它描述为已真实发送。
- **表单级多语言可以进入 P0，但只能作为第三阶段 Pilot。** 第一外语采用 `es-419` 产品 Pilot；`ja-JP` 保留第二顺位。首版不翻译全站，也不需要同步建设多模型 LLM 路由。`68 vs 64` 的研究评分只用于决定 Pilot 顺序，不代表市场规模结论。
- **PDF 与 WhatsApp 必须拆开判断。** 当前公开提交已能接收 PDF，但缺少足够的文件验证、隔离和扫描证据，因此 PDF 上传安全收口是 P0 安全债；预览和单条回复 PDF 导出是 P1。WhatsApp 分享链接可并入发布页小步上线，但 WhatsApp API 通知仍保留 V1.4 Pilot。

## 决策表

| 能力 | 原建议 | 产品决策 | 调整理由 |
|---|---|---|---|
| 首次成功闭环 | P0 | **P0-A，最先完成** | 当前最大断点在生成后到发布、测试提交和结果回看，不解决就无法判断其他功能价值。 |
| 生产级邮件提交通知 | P0 | **P0-B，提前于多语言** | 直接补齐提交后的结果感和运营信任；竞品基线明确；现有实现仅 Mock。 |
| 表单级多语言 + AI 翻译 | P0 | **P0-C，`es-419` 受控 Pilot** | SERP 对比中 `es-419` 以 68:64 小幅领先 `ja-JP`，执行门槛更低；先做产品语言，西语 SEO 继续 Hold。 |
| PDF 上传安全收口 | P1 | **提升为 P0 安全 Gate** | 当前上传代码直接信任文件名、MIME 和公开存储结果，缺少大小、魔数、隔离、扫描和私有访问闭环。 |
| WhatsApp 分享公开链接 | P1 | **并入 P0-A 发布/分享动作** | 只是已有公开链接的分发方式，成本低；不得称原生集成，也不应独立成为大功能。 |
| 基础条件逻辑 | P1 | **保留 P1，排在 Embed 前** | 是成熟表单工具的常见基线，但会改变运行时验证和单题流导航，需要独立 Gate。 |
| 安全 iframe Embed | P1 | **保留 P1，条件准入** | Contact Form SEO 价值高，但只有在限流、来源白名单、CSP、滥用防护和匿名提交边界完成后才能上线。 |
| PDF 预览与单条回复导出 | P1 | **保留 P1，分两项交付** | 预览依赖安全存储；导出只生成新的结构化回复 PDF，不回填原文件。 |
| PDF-to-form | V1.4 Pilot | **保留 V1.4 Pilot** | Fillout、Jotform 已验证需求，但解析质量、安全和人工确认成本较高，不应抢占 V1.3 闭环资源。 |
| WhatsApp 单向提交通知 | V1.4 Pilot | **保留 V1.4 Pilot，后于邮件** | 需要 Meta 凭证、模板、测试发送、状态回调、日志与重试，不能按普通 Webhook 小功能处理。 |
| 多模型 LLM 路由 | 未明确 | **不进入 V1.3** | 多语言是产品内容模型问题，不是模型供应商路由问题；先复用现有 provider abstraction。 |

## 关键证据

### 当前产品与数据

- 当前代码已支持模板/Prompt 创建、公开链接、二维码、提交、数据面板、CSV、Webhook 日志与重试。
- 目前仅配置 `en`、`zh` 两个站点 locale；表单内容没有独立的多语言版本模型。
- 邮件通知 Skill 会返回模拟成功文案，没有调用邮件供应商。
- 文件上传会直接读取文件并写入本地或对象存储，没有看到文件大小、魔数、恶意文件扫描、隔离区和私有签名下载的完整实现。
- GA4 最新 7 天漏斗仍未记录发布与公开提交；Clarity 审计也显示多数外部访问没有进入创建路径。由于 Admin、内部和未知流量混杂，本报告不把 0 事件解释为真实用户绝对无法发布，只将其视为闭环与埋点必须优先验证的信号。

### 竞品与市场基线

- Tally、Fillout 等成熟工具把条件逻辑、Embed、文件上传和邮件通知作为常规表单能力；这说明它们更适合作为“信任底座”，而不是 GenForms 的长期差异化。[Tally features](https://tally.so/help/features)、[Fillout logic](https://www.fillout.com/help/logic)、[Fillout sharing and embed](https://www.fillout.com/help/distribute)
- Fillout 已提供多语言表单和 AI/PDF 导入，Jotform 也有 Smart PDF Form 路径，说明 PDF-to-form 是竞品验证过的需求，但同时存在识别错误、人工调整和范围膨胀风险。[Fillout multilingual forms](https://www.fillout.com/help/make-a-form-in-any-language)、[Fillout AI form import](https://www.fillout.com/help/ai-forms)、[Jotform Smart PDF](https://www.jotform.com/answers/25876791-smart-pdf-how-to-integrate-pdf-to-form)
- Contact Form SERP 研究持续出现 Embed、邮件通知、查看回复和反垃圾预期。因此邮件与安全 Embed 能解锁新的承接能力，但必须等 Product Gate 通过后才能修改公开承诺。

## 推荐路线

1. **V1.3 Foundation：激活闭环 + 测量 + PDF 上传安全债。**
2. **V1.3 Notifications：生产级创建者邮件通知。**
3. **V1.3 Language Pilot：英文/中文/西班牙语表单与 AI 翻译。**
4. **V1.3 Adaptive Forms：基础显示、隐藏、跳题。**
5. **V1.3 Distribution：安全 Embed、WhatsApp 链接分享、PDF 预览/回复导出。**
6. **V1.4 Pilots：PDF-to-form、WhatsApp 单向通知。**

每一阶段必须独立通过 Product Gate。前一阶段没有证明不会破坏创建、发布、提交、Webhook 与付费链路时，不并行开放下一阶段。

## UX Gate

- **允许进入低保真 UX 原型。** 原型仅覆盖 Context-loaded Create、Generated Draft、Publish Success、Test Runner、First Result 五个状态。
- 当前不允许直接开发，因为“测试提交”仍需先形成统一产品合同。
- 测试提交必须真实入库并标记 `is_test=true`，不计额度或 Credits，默认抑制邮件、Webhook、WhatsApp 以及其他付费/外部自动化；通知能力通过独立 Test Send 验证。
- 移动端每个状态只保留一个主 CTA；状态变化必须有持久文字与 `aria-live`，不能只依赖 Toast。

## 多语言决策边界

- `es-419 product pilot`：Go with gates。
- `es-419 SEO pages`：Hold，等待完整产品 Gate、母语 QA 和目标国家 SERP 复核。
- `ja-JP`：Hold，保留第二顺位；若西语 Pilot 28 天没有合格激活信号，重新进入第一候选。
- 数据模型从第一天使用 BCP 47 locale：`en`、`zh-Hans`、`es-419`、`ja-JP`，不使用难以扩展的模糊 `zh/es`。

## 暂不进入

- WhatsApp 双向机器人、客服收件箱、会话管理和自动回复。
- 完整 Workflow、审批、任务分派和可视化编排。
- 电子签名、合同与法律同意流程。
- 保留原 PDF 布局、字段映射和自动回填原文件的 Smart PDF 系统。
- Respondent 邮件、营销邮件、邮件 Campaign、附件邮件和条件邮件路由。
- 多模型智能路由、自动供应商切换和模型成本优化平台。
- 不受来源限制的通用 iframe、Popup SDK 和任意脚本注入。

## 需要 Mike 确认

1. 是否批准将 PDF 上传安全收口从 P1 提升为 V1.3 Foundation 的发布前 Gate。
2. 邮件首版是否只发给表单创建者，以及是否采用 Resend 作为首个生产供应商。
3. 多语言首版是否采用“一个表单、一个公开链接、可切换语言”，并以 `es-419` 作为第一外语 Pilot。
4. 是否批准西语 SEO 继续 Hold，并以 28 天合格激活结果决定继续西语或转向 `ja-JP`。
5. WhatsApp 分享是否接受“仅分享公开链接”的定义，并明确不展示 Integration/Bot 状态。
6. PDF-to-form 和 WhatsApp 通知是否确认留在 V1.4，不与 V1.3 并行开发。

## 结论可信度

**Share with caveats。** 产品能力和代码边界证据较强；竞品基线清晰；激活数据方向一致但样本少、混有内部/Admin 流量，不能用于精确估算商业提升或发布时间。V1.3 应先完善归因和 `activation_completed` 定义，再用外部合格样本判断效果。
