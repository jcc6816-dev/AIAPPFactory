# SEO Delegation Prompts

> 创建日期：2026-06-25
> 用途：给产品经理、Gemini / 外部研究助手分配 SEO Topic 拓展和 SERP 研究任务。
> 关联：`seo_workplan_assignment_2026-06-25.md`、`seo_topic_universe.md`。

## 1. 给产品经理的提示词

请你从产品定位和产品承接角度，基于竞品公开模板、分类、用例和创建路径，帮 GenForms.ai 拓展下一批 SEO Topic 候选。

背景：

GenForms 当前已经进入主线的 SEO Topic 包括：

- Contact Form
- Webhook Form
- Typeform Alternative
- QR Code Form
- Lead Capture

但我们判断 GenForms 的主题不应只有这些。后续 Topic 必须经过市场验证，不要闭门造车。

请你重点查看这些竞品：

- Jotform templates
- Typeform templates
- Tally templates
- Fillout templates
- POWR / AidaForm / 123FormBuilder / Formcarry / Zoho 的相关页面

请不要只看首页，而是重点看：

- 模板分类
- 热门模板
- 用例页
- Alternatives / comparison 页
- 集成/工作流页
- CTA 到创建路径的方式

请输出 10-20 个 Topic 候选，每个候选按下面格式整理：

| Topic | 竞品证据 | 用户主任务 | GenForms 当前承接 | 产品缺口 | 建议 SEO 页面类型 | 产品优先级 |
|---|---|---|---|---|---|---|

请特别注意产品事实边界：

- 当前可以明确写：AI 生成、公开链接、二维码、提交数据面板、CSV 导出、Webhook 配置/日志/重试、Feishu/DingTalk/WeCom/Slack Bot 推送路径。
- 不要直接承诺：iframe/HTML embed、生产级邮件通知、spam protection、CRM 原生同步、unlimited free、支付/订单/票务能力。

你只需要从产品侧判断：

1. 这个 Topic 是否是竞品验证过的真实市场需求。
2. GenForms 当前是否真实能承接用户主任务。
3. 哪些能力可以明确写，哪些只能写成高级路径/后续路径，哪些不能写。
4. 这个 Topic 是否值得进入产品路线图。

你不需要判断 Google SERP 排名、CTR、title/meta 或是否马上上线页面，这些由 Codex 后续负责。

## 2. 给 Gemini / 外部研究助手的提示词：Event Registration / QR Event Form

请你对 GenForms.ai 下一批 SEO Topic 做 Google US SERP 搜索意图研究。

本次只研究一个 Topic：

`Event Registration Form / QR Event Form`

请覆盖这些关键词，不要只查一个词：

- event registration form
- event registration form builder
- online event registration form
- QR code event registration form
- event signup form
- event registration form template

研究要求：

1. 使用美国区 Google SERP 样本。
2. 保存原始 SERP URL、截图或 HTML 证据。
3. 提取 Top 10 传统自然搜索结果，不要只给 AI Overview 或广告。
4. 每个结果记录：
   - rank
   - title
   - URL
   - snippet
   - domain
   - page type：product landing / template / blog / support doc / marketplace / comparison
   - 搜索意图解释
5. 分析 Google 对这些关键词的理解：
   - 用户是想马上创建表单？
   - 想找模板？
   - 想找活动报名系统？
   - 是否包含 QR code / check-in / ticket / payment 意图？
6. 分析竞品如何把搜索意图转化到创建路径：
   - CTA 文案
   - 模板入口
   - 首屏信息
   - 是否强调 free / no-code / embed / payment / check-in / QR
7. 给出 GenForms 可切入点和不能承诺的边界。

GenForms 当前真实能力边界：

- 支持 AI 生成表单。
- 支持公开分享链接。
- 支持二维码分享。
- 支持提交数据面板。
- 支持 CSV 导出。
- 支持 Webhook 配置、日志、重试，以及 Feishu/DingTalk/WeCom/Slack Bot 推送路径。
- 不要假设已经支持票务、支付、座位、签到系统、离线 App、生产级邮件通知、spam protection、CRM 原生同步、unlimited free。

最终输出：

1. SERP Top 10 原始表。
2. Search Intent 判断。
3. 竞品承接模式总结。
4. GenForms 可以借鉴的优势。
5. GenForms 可以撕开的切入点。
6. 不建议承诺的能力。
7. 建议页面类型：Use Case / Template / Post / pSEO / 暂缓。
8. 是否建议进入 Brief，以及理由。

## 3. 给 Gemini / 外部研究助手的提示词：Customer Feedback / Satisfaction / NPS

> Goal 2 正式任务包见：`ProjectDocs/Operations/seo_goal_2_feedback_nps_validate.md`。  
> 当前状态：Pending Gemini SERP Research。Gemini 完成后，Codex 将按该文档的验收清单复核，不直接进入 Build。

请你对 GenForms.ai 下一批 SEO Topic 做 Google US SERP 搜索意图研究。

本次只研究一个 Topic：

`Customer Feedback / Satisfaction / NPS`

请覆盖这些关键词：

- customer feedback form
- customer feedback form template
- customer satisfaction survey
- customer satisfaction survey template
- NPS survey form
- NPS survey template
- feedback form builder

研究要求：

1. 使用美国区 Google SERP 样本。
2. 保存原始 SERP URL、截图或 HTML 证据。
3. 提取 Top 10 传统自然搜索结果，不要只给 AI Overview 或广告。
4. 每个结果记录：
   - rank
   - title
   - URL
   - snippet
   - domain
   - page type：product landing / template / blog / support doc / marketplace / comparison
   - 搜索意图解释
5. 分析 Google 对这些关键词的理解：
   - 用户是想马上创建反馈表？
   - 想找模板？
   - 想学 NPS / CSAT 方法？
   - 想找 survey platform？
6. 分析竞品如何承接：
   - CTA 文案
   - 模板入口
   - 首屏信息
   - 是否强调 free、template、survey logic、analytics、reporting、integrations
7. 给出 GenForms 可切入点和不能承诺的边界。

GenForms 当前真实能力边界：

- 支持 AI 生成表单。
- 支持公开分享链接。
- 支持二维码分享。
- 支持提交数据面板。
- 支持 CSV 导出。
- 支持 Webhook 配置、日志、重试，以及 Feishu/DingTalk/WeCom/Slack Bot 推送路径。
- 当前不应承诺复杂 survey analytics、专业 NPS benchmark、CRM 原生同步、生产级邮件通知、spam protection、unlimited free。

最终输出：

1. SERP Top 10 原始表。
2. Search Intent 判断。
3. 竞品承接模式总结。
4. GenForms 可以借鉴的优势。
5. GenForms 可以撕开的切入点。
6. 不建议承诺的能力。
7. 建议页面类型：Use Case / Template / Post / pSEO / 暂缓。
8. 是否建议进入 Brief，以及理由。
