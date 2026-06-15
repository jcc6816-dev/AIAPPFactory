# 模板 FAQ JSON v2 事实核对与降级评估报告

为保障对外宣传或详情页渲染的内容与当前 MVP 物理版本完全一致，我对 [template-faq-localized-data.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json) 进行了全面的产品事实审查与修改。新版本已物理保存为 [template-faq-localized-data.v2.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json)。

---

## 1. 核心事实降级对照表

| 模板ID | 原描述 (v1) | 新描述 (v2) | 对应 MVP 物理事实与决策逻辑 | 事实状态标记 |
| --- | --- | --- | --- | --- |
| **`content-download`** | “success page with a direct download link” (在成功页直接下载) | “success page with a direct link to your hosted PDF file” (提供指向第三方托管资料的链接) | 现有模板的 `successCopy` 仅支持文字，不支持文件托管与直接下载按钮。改为**文本内嵌第三方盘链接**（或通过 Webhook 触发外部邮件发送）。 | `confirmed` (已确认) |
| **`event-registration`** | “limit seats” (限制参会名额) | “manually close the form from your console when seats are full” (手动关闭表单) | 目前 MVP 数据库 Schema 和 API `/api/forms/submit` 中，**没有对提交上限的硬性自动限制逻辑**。必须引导用户通过控制台监控并在满员后手动停用表单。 | `conservative` (保守) |
| **`job-application`** | 暗示了完整的 ATS 对接流程 | “routes files to your HR channels, databases, or existing ATS tools” (仅做收集和 Webhook 实时流转) | 避免让用户误解 GenForms 是一套开箱即用的 ATS 招聘系统。强调我们做的是**前端单题流收集和 Webhook 管道式实时流转**。 | `confirmed` (已确认) |
| **`lead-capture`** | “route captured leads directly to my CRM” (直连 CRM) | “map payloads to HubSpot / Salesforce via integration tools like Zapier” | 避免让用户误解我们已包含 HubSpot 等一键直连插件（目前没有）。强调需要**利用 Webhook 经由 Zapier/Make 等平台中继**实现 CRM 录入。 | `confirmed` (已确认) |

---

## 2. 细粒度 FAQ 字段分析与标记说明

在 [template-faq-localized-data.v2.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json) 中，我们为所有问答项挂载了 `factStatus` 元数据参数：

1.  `confirmed` (完全证实且在当前代码库中可用)：
    *   `content-download`：通过 Webhook 进行邮件推送，以及在线索表单中添加筛选字段以实现前置分流。
    *   `job-application`：支持附件上传收集（对应 Schema 的 `file` 字段类型）。
    *   `nps-survey`：利用单题流 (single-question flow) 减缓手机填写疲劳度，以及通过 optional email 获取回访授权。
    *   `lead-capture`：用一句话 prompt 生成表单结构、支持 generic webhook payload 传输。
2.  `conservative` (降级后的保守表述)：
    *   `event-registration`：名额限制改为由人工在后台监控和停用（不支持数据库自动防超发限额）。
    *   `content-download`：资料下发改为展示第三方托管链接或通过外部 webhook 中继邮件。

---

## 3. Mike 与 Codex 的集成意见
*   **Codex 恢复后**: 可安全采用新版 [template-faq-localized-data.v2.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.v2.json) 的内容灌入 `app/[locale]/(default)/templates/[templateId]/page.tsx` 中。文案事实无任何溢出，符合 PRD V1.1 的安全红线。
