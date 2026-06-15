# GenForms.ai 博客内容 Agent 执行手册

> 版本：2026-06-03
> 适用范围：外部 Agent 通过 Blog Automation API 为 GenForms.ai 创建 SEO 博客草稿。
> 目标：让博客自动化从“能发文章”升级为“稳定产出可排名、可转化、可人工审核的增长内容”。

## 1. 核心原则

博客不是泛泛写产品介绍，而是围绕 GenForms.ai 的高意图搜索场景建立内容入口。

每篇文章必须服务至少一个明确目标：

- 吸引正在搜索表单工具、Typeform 替代品、Google Forms 替代品的用户。
- 吸引需要 Webhook、飞书、钉钉、Slack、CRM 自动化的用户。
- 吸引需要活动报名、线索收集、Waitlist、客户反馈、二维码表单的用户。
- 把读者引导到一个具体的模板页、用例页或创建表单动作。

不建议发布的内容：

- 与 AI 表单、表单自动化、数据收集、模板工作流无关的泛 AI 文章。
- 只堆关键词、没有可操作步骤的低质量 SEO 文章。
- 没有内部链接、没有 CTA、没有发布日期的孤立文章。
- 夸大尚未稳定上线的能力，例如把实验性 Skill 描述成正式企业能力。

## 2. Agent 工作流

外部 Agent 每次写文章时按下面流程执行：

1. 从 [seo_content_topic_queue.md](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md) 选择一个未发布或需要重写的选题。
2. 确认目标语言，优先英文；中文文章用于中文渠道或中文搜索词。
3. 确认目标用例页和模板页，至少准备 2 个内部链接。
4. 生成标题、slug、description、正文 Markdown。
5. 自检文章是否满足 SEO 和转化标准。
6. 调用 Blog Automation API 创建 `created` 草稿。
7. 把返回的 `uuid`、标题、slug、目标关键词、建议审核点记录给人工审核者。
8. 人工在 `/admin/posts` 审核后再发布为 `online`。

API 文档见 [blog_automation_api.md](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/blog_automation_api.md)。

## 3. 文章标准结构

推荐 Markdown 结构：

```markdown
# Title

Short opening paragraph that matches the search intent and names the practical outcome.

## Quick Answer

2-4 paragraphs or bullets that answer the search query directly.

## When This Workflow Matters

Explain who needs this and why basic forms are not enough.

## How to Build It with GenForms.ai

Step-by-step workflow:
1. Start from the relevant template or use-case page.
2. Generate or customize the form.
3. Publish and share.
4. Connect submissions, webhooks, or notifications when relevant.

## Recommended Form Fields

List useful fields for this scenario.

## Automation and Data Handoff

Explain webhook, notification, export, or submission dashboard usage.

## Common Mistakes

Mention practical pitfalls and how to avoid them.

## Try This Workflow

One CTA only, linking to the best use-case page or template.
```

## 4. SEO 必须项

每篇文章创建前必须满足：

- `title`：英文建议 45-65 字符，中文建议 18-32 个汉字。
- `slug`：小写英文、短横线连接，不带日期，不超过 70 字符。
- `description`：英文建议 120-155 字符，中文建议 60-90 个汉字。
- `locale`：英文为 `en`，中文为 `zh`。
- `content`：正文建议英文 900-1,500 词，中文 1,200-2,000 字。
- 第一段要自然包含主关键词，但不能机械堆叠。
- 至少包含 1 个用例页链接、1 个模板页链接、1 个相关文章或文章列表链接。
- 每篇文章只设置一个主 CTA。
- 避免重复 H1：正文第一行的 `# Title` 应与页面标题一致，页面模板不应再重复渲染标题。
- 发布后页面必须显示发布日期。

## 5. 内部链接规则

优先链接到这些高价值入口：

- `/use-cases/typeform-alternative-webhooks`
- `/use-cases/google-forms-alternative-ai`
- `/use-cases/ai-lead-capture-form-builder`
- `/use-cases/feishu-dingtalk-form-notifications`
- `/use-cases/webhook-form-builder-retry-logs`
- `/use-cases/ai-event-registration-form-builder`
- `/use-cases/waitlist-form-builder-indie-hackers`
- `/use-cases/customer-feedback-form-builder`
- `/use-cases/contact-form-builder-for-websites`
- `/use-cases/qr-code-form-builder`
- `/templates`
- `/posts`

链接使用自然语言，不要用“点击这里”。

示例：

```markdown
If you want a faster starting point, try the [AI lead capture form builder](/use-cases/ai-lead-capture-form-builder) workflow.
```

## 6. CTA 规则

每篇文章只使用一个主要 CTA，避免读者不知道下一步做什么。

CTA 选择逻辑：

- 对比型文章：引导到竞品替代用例页。
- 教程型文章：引导到最相关的用例页。
- 模板型文章：引导到模板列表或具体模板详情页。
- Webhook/自动化文章：引导到 Webhook 用例页。

推荐 CTA 文案：

- `Create this form workflow with GenForms.ai`
- `Start from the AI lead capture workflow`
- `Build a webhook-ready form`
- `Try the event registration form workflow`

## 7. 人工审核清单

草稿发布前人工检查：

- 标题没有重复渲染。
- 页面显示发布日期。
- description 不为空，且不是标题的简单重复。
- 正文没有把未上线功能说成已正式可用。
- 内部链接都能打开。
- CTA 指向明确。
- 没有真实密钥、客户数据、服务器地址或内部运维细节。
- 文章语气像产品专家，而不是广告软文。
- 英文文章没有中文残留，中文文章没有英文 UI 术语误用。

## 8. Agent 请求示例

```json
{
  "title": "How to Build a Webhook-Ready Lead Capture Form",
  "slug": "webhook-ready-lead-capture-form",
  "locale": "en",
  "status": "created",
  "description": "Learn how to build a lead capture form that collects qualified prospects and sends submissions into a webhook workflow.",
  "cover_url": "",
  "author_name": "GenForms.ai",
  "author_avatar_url": "",
  "content": "# How to Build a Webhook-Ready Lead Capture Form\n\nMarkdown content here..."
}
```

## 9. 每周执行节奏

建议每周固定节奏：

- 周一：看 Google Search Console，选择展示上升但点击低的词做文章或改标题。
- 周二：发布 1 篇英文高意图文章。
- 周三：补 1 篇中文场景文章或社区发布稿。
- 周四：优化 1 篇旧文章的内部链接、CTA 和 description。
- 周五：复盘本周文章的索引、展示、点击和注册事件。

最低产出节奏：

- 每周 2 篇文章，连续 8 周。
- 每周至少优化 1 个旧页面。
- 每篇文章发布后 24 小时内在 GSC 请求索引。

