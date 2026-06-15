# 模板详情页 FAQ/CTA/内链文案包说明报告

本报告包含针对 5 个核心模板（`content-download`, `job-application`, `nps-survey`, `lead-capture`, `event-registration`）的专属中英文 FAQ 问答对、CTA 微文案及内链优化建议。
数据已同步写入本地 JSON 文件：[template-faq-localized-data.json](file:///Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/tmp/template-faq-localized-data.json)。

---

## 1. 模板优化详情清单

### 1.1 资料下载表单 (`content-download`)
*   **英文 CTA**: "Get Your Free Resource Instantly"
*   **中文 CTA**: "立即免费获取资料"
*   **关键字**: `AI lead magnet download`, `content lead capture form`, `PDF download form builder`
*   **FAQ (EN/ZH)**:
    *   *Q: How do users receive the downloaded PDF?* / *用户提交后如何获得下载文件？*
    *   *A: You can either direct users to a success page with a direct download link or trigger a webhook that emails the gated resource to them automatically.* / *你可以配置提交成功页直接显示下载链接，或通过 Webhook 触发自动化邮件将资料发送至用户邮箱。*
    *   *Q: Can I qualify leads before they download?* / *可以在下载前对线索进行筛选吗？*
    *   *A: Yes. By asking for team size or business goals during the single-question flow, you filter high-value accounts before handing off to sales.* / *可以。通过在单题流中设计团队规模或业务目标问题，可以在资料发放前快速筛选出高价值企业客户。*
*   **建议内链**:
    *   锚文本: `"AI Lead Magnet Download Form"`, 指向: `/solutions/lead-magnet-download-form`
    *   锚文本: `"Google Forms Alternative"`, 指向: `/solutions/google-forms-alternative-ai`

### 1.2 招聘申请表 (`job-application`)
*   **英文 CTA**: "Submit Application"
*   **中文 CTA**: "提交申请书"
*   **关键字**: `job application form`, `candidate resume upload`, `recruiting form builder`
*   **FAQ (EN/ZH)**:
    *   *Q: Does the form support resume file uploads?* / *表单支持简历文件上传吗？*
    *   *A: Yes. The recruiting template supports direct file uploads, allowing candidates to securely attach PDF or Word resumes.* / *支持。招聘申请模板内置文件上传字段，允许候选人安全地上传 PDF 或 Word 格式的简历。*
    *   *Q: Can I route applicant alerts to Feishu or DingTalk?* / *可以将新候选人通知推送到飞书或钉钉吗？*
    *   *A: Absolutely. You can configure webhook notifications to instantly ping your HR channel whenever a new candidate submits their profile.* / *可以。你可以配置 Webhook 群通知，在新候选人提交申请时，HR 频道会立即收到群播报。*
*   **建议内链**:
    *   锚文本: `"Feishu and DingTalk Notifications"`, 指向: `/solutions/feishu-dingtalk-form-notifications`
    *   锚文本: `"Website Inquiry intake"`, 指向: `/solutions/contact-form-builder-for-websites`

### 1.3 NPS 推荐度调查 (`nps-survey`)
*   **英文 CTA**: "Submit Score & Feedback"
*   **中文 CTA**: "提交评分与建议"
*   **关键字**: `NPS survey form`, `SaaS Net Promoter Score`, `customer loyalty survey`
*   **FAQ (EN/ZH)**:
    *   *Q: How does single-question flow improve NPS completion?* / *单题流如何提升 NPS 问卷的完成率？*
    *   *A: Presenting only one score selector at a time reduces completion fatigue, leading to higher response rates compared to standard surveys.* / *每次仅展示一个评分滑块或选择项能降低填答疲劳度，相较于冗长的传统问卷能大幅提升用户完成率。*
    *   *Q: Can we follow up with detractors or promoters?* / *我们可以跟进贬损者或推荐者吗？*
    *   *A: Yes. The template includes optional contact email and follow-up consent fields, letting your success team reach out to resolve issues or capture reviews.* / *可以。该模板包含可选的联系邮箱与回访授权字段，方便你的客户成功团队跟进解决问题或征集好评。*
*   **建议内链**:
    *   锚文本: `"Customer Feedback Form"`, 指向: `/solutions/customer-feedback-form-builder`
    *   锚文本: `"Typeform Alternatives"`, 指向: `/solutions/typeform-alternative-webhooks`

### 1.4 线索收集表 (`lead-capture`)
*   **英文 CTA**: "Request Early Access"
*   **中文 CTA**: "申请早期体验"
*   **关键字**: `AI lead capture form`, `SaaS lead generation form`, `conversational lead form`
*   **FAQ (EN/ZH)**:
    *   *Q: How does AI prompt-to-form generation work?* / *AI 一句话生成表单是如何工作的？*
    *   *A: You describe your product value and qualifying questions, and the AI generates the fields, labels, and copy in a clean Typeform-like schema.* / *你只需描述你的产品价值和线索筛选问题，AI 就会自动生成相应的字段、标签和文案，并组织成类 Typeform 的单题流。*
    *   *Q: Can I route captured leads directly to my CRM?* / *收集到的线索可以直接流转到 CRM 吗？*
    *   *A: Yes. Submissions are pushed via webhooks instantly. You can easily map these JSON payloads to HubSpot, Salesforce, or custom backends.* / *可以。所有提交都会通过 Webhook 实时推送，你可以轻松地将 JSON 数据对接至 HubSpot、Salesforce 或自建后台。*
*   **建议内链**:
    *   锚文本: `"SaaS Lead Capture Solutions"`, 指向: `/solutions/saas-lead-capture-form-builder`
    *   锚文本: `"Webhook Retry Logs"`, 指向: `/solutions/webhook-form-builder-retry-logs`

### 1.5 活动报名表 (`event-registration`)
*   **英文 CTA**: "Register for Event"
*   **中文 CTA**: "立即报名活动"
*   **关键字**: `event registration form`, `QR code event signup`, `meetup registration template`
*   **FAQ (EN/ZH)**:
    *   *Q: Can attendees scan a QR code to register?* / *参会者可以扫码报名吗？*
    *   *A: Yes. Once published, you can generate a QR code for posters or roll-ups, routing attendees instantly to a mobile-friendly signup flow.* / *可以。表单发布后可直接生成分享二维码，用于海报或展架，方便用户手机扫码即刻完成报名。*
    *   *Q: Can we limit seats or ticket categories?* / *我们可以限制参会名额或门票类别吗？*
    *   *A: Yes. You can define ticket radio options (e.g., General vs. VIP) in the schema, and monitor registrations in real-time from the dashboard.* / *可以。你可以在表单 Schema 中自定义不同的票种选项（如普通票与 VIP 票），并在控制台实时监控报名人数。*
*   **建议内链**:
    *   锚文本: `"Event QR Code Solutions"`, 指向: `/solutions/event-registration-form-with-qr-code`
    *   锚文本: `"Feishu DingTalk alerts"`, 指向: `/solutions/feishu-dingtalk-form-notifications`

---

## 2. 观察冷冻期规训说明 (Observation Freeze Plan)

根据 Google 抓取特性和指标共识，以下三个模板页：
1.  **Job Application** (`/templates/job-application`)
2.  **NPS Survey** (`/templates/nps-survey`)
3.  **Content Download** (`/templates/content-download`)

在上一次改动后，在 GSC 录得了冷启动曝光。在此次将 FAQ/CTA 的 JSON 数据集成到代码库并部署上线后，必须对此 3 个页面实施 **3-7 天的观察冷冻期**。除非发生重大技术 Bug 或渲染错误，否则在此期间**严禁对页面进行任何文字、内链、TDK 修改**。

---

## 3. Mike 与 Codex 下一步操作建议
*   **Mike 的工作**: 核对上述文案是否符合 MVP 产品实际功能。
*   **Codex 的工作**: 恢复后，直接通过修改 `app/[locale]/(default)/templates/[templateId]/page.tsx` 中 FAQ 组件的数据源，将 `template-faq-localized-data.json` 静态内容挂载并渲染在对应的模板页面中，实现零代码冗余的内容注入。
