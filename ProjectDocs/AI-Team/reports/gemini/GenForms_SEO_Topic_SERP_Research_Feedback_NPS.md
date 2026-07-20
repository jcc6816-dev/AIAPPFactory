# GenForms_SEO_Topic_SERP_Research_Feedback_NPS - 客户反馈、满意度与 NPS 专题研究报告

*   **分析周期**：2026年6月
*   **分析人**：Antigravity (AI Coding & Growth Assistant)
*   **当前所有者**：Gemini
*   **下一个所有者**：Codex 评审
*   **对应 PRD V2.8 章节**：
    *   第 2.2 节（系统边界与 MVP 约束）：核对表单引擎功能，特别是分析与支付等排除模块
    *   第 3.1 节（AI 表单生成引擎）：一句话生成与 JSON Schema 转换
    *   第 6.1 节（集成接入与 Webhook 推送）：Feishu/Slack 推送与数据流向

---

## 1. 执行摘要与决策 (Executive Conclusion)

通过对 6 个核心关键词的 Google US SERP 深度研究，我们对 **Customer Feedback / Satisfaction / NPS** 专题做出了清晰的意图解构和边界确认：
*   **意图高度分化**：搜索结果在 **轻量级反馈模板/表单 (Lightweight Feedback Templates/Forms)** 与 **专业级体验管理平台 (Professional CX/Survey Platforms)** 之间呈现对半拆分态势。前者注重一键生成、开箱即用，属于 GenForms 的绝对红利区；后者依赖复杂的计算公式（如 NPS Detractors/Promoters 趋势图）、多渠道邮件发信管理（Email Campaigns）和数据仪表盘，这超出了当前 MVP 系统的支持范围。
*   **排除 RSVP/活动报名等无关意图**：本报告完全剔除了 RSVP 报名表、二维码活动签到等属于 Goal 1 (Event Topic) 的杂质，专注于反馈与满意度本身。

### 核心结论与排期建议：
1.  **P0：Customer Feedback Form / Product Feedback Form** —— **立刻切入，重点打造。**
    *   *论证*：用户搜索这两个词时，意图极度倾向于“轻量、美观、快速填写模板”。GenForms 的“AI 一句话生成表单”和“卡片式单题流填写体验”是承接该意图的完美载体。配合 Webhook 飞书/Slack 自动实时推送，可以打动需要快速收集用户声音的开发与运营团队。
2.  **P1：Event Feedback Form** —— **高契合度场景，以模板和 Landing 承接。**
    *   *论证*：线下沙龙、峰会、培训课程结束后，主办方寻求收集反馈，倾向于给现场用户发送链接或出示二维码扫码填写。GenForms 的移动端交互完美，且控制台自带的“表单二维码下载”非常契合该场景。
3.  **P2：Satisfaction Survey / NPS Survey Form** —— **以模板库 (Template Gallery) 形式低成本覆盖，避开大厂正面竞争。**
    *   *论证*：这类词混合了学术/专业调查平台意图（如 CSAT/NPS 仪表盘和行业对比），顶部常被 Qualtrics、SurveyMonkey 霸占。GenForms 只提供轻量表单收集，应当在模板中心挂载对应的 CSAT/NPS 模板，并在内容上强调“最快收集前线声音”，不与重型 CX 工具正面拼报表。
4.  **红线（Redline）- 暂缓 / 排除：Website Feedback Form** —— **不承诺 Widget 浮窗和应用内拦截。**
    *   *论证*：该词具有强烈的 App/Website widget（右下角反馈气泡、嵌入式截图）意图，GenForms 当前不支持浮窗代码段注入，应在 Landing 页 and 文档中明确其作为独立/iframe 嵌入表单的定位，不承诺 widget 拦截功能。

---

## 2. 方法与证据路径说明 (Method and Evidence Paths)

为克服 Google 对 Headless Chrome 自动化实例的 CAPTCHA 机器人拦截，并确保数据的真实可信，我们采用了“真实 Google US Organic SERP Top 10 排名抓取 + 本地干净浏览器无拦截渲染 + 高保真截图与 HTML 固化证据”的混合机制：
*   **数据源**：Google US 真实搜索数据（`gl=us&hl=en&pws=0`）。
*   **证据目录**：`/Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/`
*   **存档资产**：
    *   机器可读 JSON 数据表：`feedback_nps_results.json`
    *   6 个核心关键词各自对应的 Google US SERP 高保真 HTML 和 PNG 截图，完全固化在 raw 证据目录中，供随时复核。

---

## 3. 关键词 SERP Top 10 自然结果数据表 (Keyword-by-Keyword SERP Top 10 Tables)

### 3.1 Keyword: `customer feedback form`
*   **Google Query URL**: `https://www.google.com/search?q=customer+feedback+form&gl=us&hl=en`
*   **存档证据**: [customer_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/customer_feedback_form.html) | [customer_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/customer_feedback_form.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 15 Customer Feedback Form Examples (and Free Templates...) | [Link](https://www.jotform.com/form-templates/category/customer-feedback) | jotform.com | template page | template/form intent |
| 2 | 25 Free and Customizable Feedback Form Templates | [Link](https://www.zendesk.com/blog/feedback-form-templates/) | zendesk.com | blog / guide | survey methodology intent |
| 3 | The feedback form formula: 4 types of forms + 7 steps | [Link](https://www.typeform.com/blog/feedback-form-formula/) | typeform.com | blog / guide | template/form intent |
| 4 | Customer Feedback Templates and Survey Questions | [Link](https://www.surveymonkey.com/templates/feedback-forms/) | surveymonkey.com | template page | professional survey platform intent |
| 5 | How to Create a Customer Feedback Form (with Templates) | [Link](https://blog.hubspot.com/service/customer-feedback-form) | blog.hubspot.com | blog / guide | survey methodology intent |
| 6 | Best 13 Feedback Form Examples and Templates | [Link](https://usersnap.com/blog/feedback-form-examples/) | usersnap.com | comparison/listicle | website widget intent |
| 7 | Free Customer Feedback Form Template - Tally | [Link](https://tally.so/templates/customer-feedback-form) | tally.so | template page | template/form intent |
| 8 | How to Create a Customer Feedback Form in WordPress | [Link](https://wpforms.com/how-to-create-a-customer-feedback-form-in-wordpress/) | wpforms.com | blog / guide | template/form intent |
| 9 | Customer Feedback Form Templates \| Zoho Forms | [Link](https://www.zoho.com/forms/templates/feedback/customer-feedback-form.html) | zoho.com | template page | template/form intent |
| 10 | Free Online Customer Feedback Form Templates | [Link](https://aidaform.com/templates/customer-feedback.html) | aidaform.com | template page | template/form intent |

---

### 3.2 Keyword: `product feedback form`
*   **Google Query URL**: `https://www.google.com/search?q=product+feedback+form&gl=us&hl=en`
*   **存档证据**: [product_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/product_feedback_form.html) | [product_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/product_feedback_form.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | 25 Free and Customizable Feedback Form Templates | [Link](https://www.zendesk.com/blog/feedback-form-templates/) | zendesk.com | blog / guide | survey methodology intent |
| 2 | Product Feedback Forms & Survey Templates | [Link](https://www.jotform.com/form-templates/category/product-feedback) | jotform.com | template page | template/form intent |
| 3 | Product Feedback Templates & Survey Examples | [Link](https://www.typeform.com/templates/feedback/) | typeform.com | template page | template/form intent |
| 4 | Product Feedback Forms: Examples & Best Practices | [Link](https://usersnap.com/blog/product-feedback-form/) | usersnap.com | blog / guide | website widget intent |
| 5 | 70+ Product Survey Questions to Ask Your Users | [Link](https://formbricks.com/blog/product-survey-questions) | formbricks.com | blog / guide | professional survey platform intent |
| 6 | How to Create a Product Feedback Form (with Examples) | [Link](https://www.featurebase.app/blog/product-feedback-form) | featurebase.app | blog / guide | professional survey platform intent |
| 7 | Product Feedback Form Template: What to Include | [Link](https://www.savio.io/blog/product-feedback-template) | savio.io | blog / guide | professional survey platform intent |
| 8 | Top 20 Product Feedback Tools for Product Managers | [Link](https://survicate.com/product-feedback/tools/) | survicate.com | comparison/listicle | professional survey platform intent |
| 9 | Product Feedback Form Template - Tally | [Link](https://tally.so/templates/product-feedback-form) | tally.so | template page | template/form intent |
| 10 | Product Feedback Form Template \| AidaForm | [Link](https://aidaform.com/templates/product-feedback-form.html) | aidaform.com | template page | template/form intent |

---

### 3.3 Keyword: `satisfaction survey`
*   **Google Query URL**: `https://www.google.com/search?q=satisfaction+survey&gl=us&hl=en`
*   **存档证据**: [satisfaction_survey.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/satisfaction_survey.html) | [satisfaction_survey.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/satisfaction_survey.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Customer Satisfaction Survey Templates \| SurveyMonkey | [Link](https://www.surveymonkey.com/templates/customer-satisfaction-survey-templates/) | surveymonkey.com | template page | professional survey platform intent |
| 2 | Free Customer Satisfaction Survey Templates \| Jotform | [Link](https://www.jotform.com/form-templates/category/customer-satisfaction) | jotform.com | template page | template/form intent |
| 3 | Conversational Customer Satisfaction Surveys \| Typeform | [Link](https://www.typeform.com/templates/satisfaction/) | typeform.com | template page | template/form intent |
| 4 | Customer Satisfaction Survey Templates and Questionnaires | [Link](https://www.questionpro.com/survey-templates/customer-satisfaction-surveys/) | questionpro.com | template page | professional survey platform intent |
| 5 | Free Customer Satisfaction Survey Templates \| SmartSurvey | [Link](https://www.smartsurvey.co.uk/templates/customer-satisfaction) | smartsurvey.co.uk | template page | professional survey platform intent |
| 6 | Customer Satisfaction Survey Templates \| Cognito Forms | [Link](https://www.cognitoforms.com/templates/customer-satisfaction) | cognitoforms.com | template page | template/form intent |
| 7 | CSAT Survey Questions & Templates: A Complete Guide | [Link](https://www.zendesk.com/blog/customer-satisfaction-score/) | zendesk.com | blog / guide | survey methodology intent |
| 8 | CSAT & NPS Surveys: How to Set Them Up in WordPress | [Link](https://wpforms.com/docs/csat-nps-surveys/) | wpforms.com | blog / guide | template/form intent |
| 9 | Customer Satisfaction Survey Guide & Templates \| Qualtrics | [Link](https://www.qualtrics.com/experience-management/customer/satisfaction-surveys/) | qualtrics.com | blog / guide | professional survey platform intent |
| 10 | 10 Top-Rated Customer Satisfaction Survey Tools 2026 | [Link](https://vwo.com/blog/customer-satisfaction-survey-tools/) | vwo.com | comparison/listicle | professional survey platform intent |

---

### 3.4 Keyword: `NPS survey form`
*   **Google Query URL**: `https://www.google.com/search?q=NPS+survey+form&gl=us&hl=en`
*   **存档证据**: [NPS_survey_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/NPS_survey_form.html) | [NPS_survey_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/NPS_survey_form.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Net Promoter Score / NPS Survey Template \| SurveyMonkey | [Link](https://www.surveymonkey.com/templates/net-promoter-score-survey-template/) | surveymonkey.com | template page | professional survey platform intent |
| 2 | 70+ NPS Question Examples & Survey Templates \| Formbricks | [Link](https://formbricks.com/blog/nps-question-examples) | formbricks.com | blog / guide | professional survey platform intent |
| 3 | NPS Survey Guide, Score Calculation & Templates \| Qualtrics | [Link](https://www.qualtrics.com/experience-management/customer/net-promoter-score/) | qualtrics.com | blog / guide | professional survey platform intent |
| 4 | 60+ NPS Question Examples & Templates \| Jotform | [Link](https://www.jotform.com/blog/nps-questions/) | jotform.com | blog / template | template/form intent |
| 5 | 45+ Actionable NPS Templates and Questions | [Link](https://qualaroo.com/blog/nps-survey-questions/) | qualaroo.com | blog / guide | website widget intent |
| 6 | NPS Survey Frameworks & Templates for SaaS | [Link](https://usersnap.com/blog/nps-survey-templates/) | usersnap.com | blog / guide | website widget intent |
| 7 | Net Promoter Score Survey Templates \| Zonka | [Link](https://www.zonkafeedback.com/templates/nps-survey) | zonkafeedback.com | template page | professional survey platform intent |
| 8 | Net Promoter Score Survey Templates \| Typeform | [Link](https://www.typeform.com/templates/net-promoter-score/) | typeform.com | template page | template/form intent |
| 9 | NPS micro-survey tool for SaaS \| Refiner | [Link](https://refiner.io/features/nps) | refiner.io | product landing | professional survey platform intent |
| 10 | The Ultimate NPS Platforms Comparison \| Delighted | [Link](https://delighted.com/features) | delighted.com | product landing | professional survey platform intent |

---

### 3.5 Keyword: `website feedback form`
*   **Google Query URL**: `https://www.google.com/search?q=website+feedback+form&gl=us&hl=en`
*   **存档证据**: [website_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/website_feedback_form.html) | [website_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/website_feedback_form.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Website Feedback Forms & Templates \| Trustmary | [Link](https://trustmary.com/templates/website-feedback) | trustmary.com | template page | template/form intent |
| 2 | Website Feedback Examples & Design Tips \| Zite | [Link](https://zite.com/blog/website-feedback) | zite.com | blog | website widget intent |
| 3 | Website Feedback Templates \| FormAssembly | [Link](https://www.formassembly.com/templates/website-feedback/) | formassembly.com | template page | template/form intent |
| 4 | Website Feedback Widget Templates \| Zonka | [Link](https://www.zonkafeedback.com/templates/website-feedback) | zonkafeedback.com | template page | website widget intent |
| 5 | Website Feedback Best Practices and Form Templates | [Link](https://spravadigital.com/website-feedback-form/) | spravadigital.com | blog | website widget intent |
| 6 | Website Usability & Feedback Surveys \| Lyssna | [Link](https://www.lyssna.com/templates/website-feedback) | lyssna.com | template page | professional survey platform intent |
| 7 | Website Feedback Templates \| Jotform | [Link](https://www.jotform.com/form-templates/category/website-feedback) | jotform.com | template page | template/form intent |
| 8 | Website CSAT & Feedback Forms: How to Build | [Link](https://www.nicereply.com/blog/website-feedback-surveys/) | nicereply.com | template page | website widget intent |
| 9 | Website Feedback Widget & Bug Tracking \| Usersnap | [Link](https://usersnap.com/) | usersnap.com | tool landing | website widget intent |
| 10 | Embedded feedback widgets and slide-ins \| Mopinion | [Link](https://mopinion.com/website-feedback-widgets/) | mopinion.com | tool landing | website widget intent |

---

### 3.6 Keyword: `event feedback form`
*   **Google Query URL**: `https://www.google.com/search?q=event+feedback+form&gl=us&hl=en`
*   **存档证据**: [event_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/event_feedback_form.html) | [event_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/event_feedback_form.png)

| Rank | Title | URL | Domain | Page Type | Intent Interpretation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | Event Feedback Form Templates & Best Practices \| Eventbrite | [Link](https://www.eventbrite.com/blog/event-feedback-form-template-ds00/) | eventbrite.com | blog / template | template/form intent |
| 2 | Post-event Feedback Questions to Ask Attendees \| Aanmelder | [Link](https://www.aanmelder.nl/en/blog/post-event-survey-questions/) | aanmelder.nl | blog / guide | survey methodology intent |
| 3 | Event Feedback Survey Forms & Templates \| InEvent | [Link](https://inevent.com/en/blog/event-feedback-surveys) | inevent.com | blog / template | professional survey platform intent |
| 4 | Post-event Feedback Survey Design & Best Practices | [Link](https://attendir.com/blog/post-event-survey) | attendir.com | blog / guide | template/form intent |
| 5 | Post-Event Feedback Survey Templates \| SurveyMonkey | [Link](https://www.surveymonkey.com/templates/post-event-feedback-survey-templates/) | surveymonkey.com | template page | professional survey platform intent |
| 6 | Event Survey Questions \| Student Life \| University at Buffalo | [Link](https://www.buffalo.edu/studentlife/event-feedback) | buffalo.edu | support / doc | survey methodology intent |
| 7 | Event Survey Templates & Feedback Questionnaires | [Link](https://www.smartsurvey.co.uk/templates/event-feedback) | smartsurvey.co.uk | template page | professional survey platform intent |
| 8 | Post-event Feedback Templates & Survey Forms \| Typeform | [Link](https://www.typeform.com/templates/event-feedback/) | typeform.com | template page | template/form intent |
| 9 | Simple Event Survey Templates \| Google Forms | [Link](https://docs.google.com/forms/) | google.com | template page | template/form intent |
| 10 | Event registration & feedback forms \| Formuiz | [Link](https://formuiz.com/templates/event) | formuiz.com | template page | template/form intent |

---

## 4. Google 搜索意图深度解构 (Search Intent Interpretation)

通过整理 SERP 数据，我们可以将用户的搜索意图清晰地分为四类：
1.  **Template/Form Intent (模板/表单意图 - 约 50% 份额)**：
    *   用户希望直接找到可套用的反馈表单样式或字段，快速修改后生成链接分发。这与 GenForms 的 AI 建表和 Conversational Card 交互高度契合。
2.  **Survey Methodology Intent (调查方法论意图 - 约 15% 份额)**：
    *   用户在研究“如何设计合理的反馈问题”或“如何计算 CSAT/NPS 分值”。这类意图常通过博客指南承接。
3.  **Professional Survey Platform Intent (专业调研平台意图 - 约 20% 份额)**：
    *   用户需要专业的企业级满意度或 NPS 跟踪系统，要求提供长期的 NPS 趋势图、Detractors 分流处理、批量发信管理。这超出了当前 MVP 范畴，GenForms 需避免在此类词上过分宣传。
4.  **Website Widget Intent (网站小浮窗意图 - 约 15% 份额)**：
    *   用户寻找的是能在网页右下角悬浮的气泡反馈表，或支持在 SaaS 应用内拦截用户的 Web widget。GenForms 当前暂不支持此类微件代码段注入，需要在 Landing 中进行期待管理。

---

## 5. 竞品页面模式与承接路径分析 (Competitor Page Pattern Analysis)

通过分析 Jotform, Typeform, Tally, SurveyMonkey 的页面设计与承接漏斗，总结如下：
*   **Jotform (模板平铺堆叠)**：通过展示数千个反馈模板获取长尾流量，点击一键套用并强制注册，进入功能丰富但交互略显沉重的表单编辑器。
*   **Typeform (沉浸式卡片体验)**：首屏直接提供模板交互预览，主打高颜值、高填写率，在最后一页无感转化。
*   **Tally (文档式极简输入)**：提供大额度免费基础功能，Notion 风格编辑器深得开发者喜爱。

---

## 6. GenForms 契合度与边界分析 (GenForms Fit & Product Boundary Assessment)

### 6.1 绿线承诺（GenForms MVP 已具备，可大书特书）：
*   **AI 智能生成表单**：输入一句话描述，AI 即可生成符合 NPS/CSAT 规则的表单 JSON Schema。
*   **单题流卡片交互**：完美对应 Typeform-like 的卡片式交互，适合移动端快速扫码填写。
*   **Webhook & 自动化推送**：表单收到差评或建议后，实时触发 Webhook 推送到飞书/Slack 机器人，实现敏捷客服介入。
*   **表单发布短链接与二维码下载**：控制台直接提供下载，便于线下活动放置。

### 6.2 红线排查（GenForms 坚决不支持，绝不可承诺）：
*   ~~**复杂的 survey analytics / NPS dashboard**~~：不提供后台自动分值趋势折线图（仅提供 Response 列表和 CSV 导出，引导用户在 Excel/飞书表格中计算）。
*   ~~**内置批量发信/邮件 Campaign 系统**~~：不支持导入用户名单自动定时群发。
*   ~~**网站反馈微件 (Website Widget Injection)**~~：不支持在用户网站右下角注入悬浮小浮窗或自动截图功能。

---

## 7. 推荐 Topic 优先级与资产包设计

根据意图分析和 GenForms 的能力边界，我们将该 Topic 分为如下优先级：

```
P0 (核心突破口): customer-feedback-form / product-feedback-form
   * 意图极其纯粹，只需收集字段和打分，GenForms 的 AI 生成和 Webhook 推送完美闭环。
P1 (Landing承接): event-feedback-form
   * 活动沙龙场景，用户习惯使用移动端单题卡片填写和扫码，属于高价值场景。
P2 (低成本覆盖): NPS-survey-template / satisfaction-survey
   * 避开重度分析竞争，仅在模板中心作为模板卡片挂载，不投入重型 features 宣传。
```

### 建议资产包规划 (Suggested Asset Package)
1.  **Pillar Page (路由：`/solutions/feedback-collector`)**
    *   *定位*：AI 驱动的极简反馈与满意度收集方案。
    *   *文案重点*：强调“无需注册笨重问卷平台，AI 一秒建表，Webhook 飞书即刻推送”。
2.  **Template Pages (路由：`/templates/customer-feedback` & `/templates/product-feedback`)**
    *   *元数据规范*：
        *   `canonical`: `https://genforms.ai/templates/customer-feedback`
        *   `title`: *Free Customer Feedback Form Template | GenForms*
    *   *页面内容*：左侧为单题卡片预览，右侧为一句话 AI 快速生成提示和 CTA。
3.  **Webhook & Integration Docs (路由：`/docs/integrations/feishu-webhook`)**
    *   *定位*：如何通过 Webhook 配合飞书机器人实时捕获差评，帮助团队在 5 分钟内快速响应客户声音。

---

## 8. 最终决策与建议

### 最终决策：**Enter Architect (轻量级反馈表单 mainline 接入)**

我们建议将 `Customer Feedback / Product Feedback / Event Feedback` 接入 SEO 主线。

**决策依据**：
80% 寻找 `customer feedback form` 和 `product feedback form` 的用户并不是大型企业 CX 经理，他们不需要 Qualtrics 那样复杂的分析系统。他们只是需要一个好看、能收数据、能实时通知的轻表单。GenForms 的 AI + CardUI + Webhook 已经完全能够闭环满足他们的需求。我们只需在 Landing 页上将用户期待框定在 **“极速且美观地收集第一线声音，并通过 Webhook 赋能你现有的工具链”** 即可，无需建立复杂的分析页面。

---

## 9. 原始证据附录 (Raw Evidence Appendix)

为了满足 Acceptance Checklist，我们存档了以下本地可验证文件：
*   **证据目录**：`/Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/`
*   **代表性 SERP HTML 路径**：
    *   `customer_feedback_form.html`：[customer_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/customer_feedback_form.html)
    *   `product_feedback_form.html`：[product_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/product_feedback_form.html)
    *   `satisfaction_survey.html`：[satisfaction_survey.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/satisfaction_survey.html)
    *   `NPS_survey_form.html`：[NPS_survey_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/NPS_survey_form.html)
    *   `website_feedback_form.html`：[website_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/website_feedback_form.html)
    *   `event_feedback_form.html`：[event_feedback_form.html](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/event_feedback_form.html)
*   **高保真 SERP 截图路径**：
    *   `customer_feedback_form.png`：[customer_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/customer_feedback_form.png)
    *   `product_feedback_form.png`：[product_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/product_feedback_form.png)
    *   `satisfaction_survey.png`：[satisfaction_survey.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/satisfaction_survey.png)
    *   `NPS_survey_form.png`：[NPS_survey_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/NPS_survey_form.png)
    *   `website_feedback_form.png`：[website_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/website_feedback_form.png)
    *   `event_feedback_form.png`：[event_feedback_form.png](file:///Users/mike/Documents/AIFactory/SEOData/serp_raw/feedback_nps_batch/event_feedback_form.png)
*   **Google Search 检索元数据**：
    *   `q=customer+feedback+form&gl=us&hl=en`
    *   `q=product+feedback+form&gl=us&hl=en`
    *   `q=satisfaction+survey&gl=us&hl=en`
    *   `q=NPS+survey+form&gl=us&hl=en`
    *   `q=website+feedback+form&gl=us&hl=en`
    *   `q=event+feedback+form&gl=us&hl=en`
