# GenForms.ai SEO 内容选题队列

> 版本：2026-06-03
> 用途：给博客内容 Agent、人工审核和增长运营共用的选题池。
> 原则：优先写“用户已经在找解决方案”的高意图文章，而不是泛泛介绍 AI。

## 1. 选题优先级

优先级判断：

- P0：竞品替代、Webhook、Google Forms/Typeform/Jotform 对比，商业意图强。
- P1：具体表单场景，例如 lead capture、event registration、waitlist、feedback。
- P2：运营方法论和模板清单，适合长期覆盖长尾词。
- P3：产品更新、案例、社区内容，适合辅助外链和品牌信任。

建议先完成前 12 篇，再根据 Google Search Console 查询词调整队列。

## 2. P0：高意图获客文章

| 优先级 | 语言 | 建议标题 | 建议 slug | 主关键词 | 目标入口 |
| --- | --- | --- | --- | --- | --- |
| P0 | en | Typeform Alternative with Webhooks: A Practical Guide for 2026 | typeform-alternative-with-webhooks | Typeform alternative with webhooks | `/use-cases/typeform-alternative-webhooks` |
| P0 | en | Google Forms vs Typeform vs GenForms: Which Form Builder Fits Your Workflow? | google-forms-vs-typeform-vs-genforms-workflow | Google Forms vs Typeform | `/use-cases/google-forms-alternative-ai` |
| P0 | en | Best AI Form Builders for Lead Capture and Automation | best-ai-form-builders-lead-capture-automation | AI form builder | `/use-cases/ai-lead-capture-form-builder` |
| P0 | en | How to Send Form Submissions to Feishu and DingTalk | send-form-submissions-feishu-dingtalk | Feishu form notification | `/use-cases/feishu-dingtalk-form-notifications` |
| P0 | en | Why Webhook Logs and Retries Matter for Form Automation | webhook-logs-retries-form-automation | webhook form builder | `/use-cases/webhook-form-builder-retry-logs` |
| P0 | zh | 带 Webhook 的 Typeform 替代方案怎么选 | typeform-alternative-webhook-zh | Typeform 替代 Webhook | `/zh/use-cases/typeform-alternative-webhooks` |

## 3. P1：具体场景教程

| 优先级 | 语言 | 建议标题 | 建议 slug | 主关键词 | 目标入口 |
| --- | --- | --- | --- | --- | --- |
| P1 | en | How to Create a High-Converting Lead Capture Form with AI | ai-lead-capture-form-guide | AI lead capture form | `/use-cases/ai-lead-capture-form-builder` |
| P1 | en | Event Registration Form Checklist for Marketing Teams | event-registration-form-checklist | event registration form | `/use-cases/ai-event-registration-form-builder` |
| P1 | en | How Indie Hackers Can Validate Demand with a Waitlist Form | waitlist-form-demand-validation | waitlist form builder | `/use-cases/waitlist-form-builder-indie-hackers` |
| P1 | en | Customer Feedback Form Examples That Stay Short and Useful | customer-feedback-form-examples | customer feedback form builder | `/use-cases/customer-feedback-form-builder` |
| P1 | en | What a Professional Website Contact Form Should Include | website-contact-form-checklist | website contact form | `/use-cases/contact-form-builder-for-websites` |
| P1 | en | How to Use QR Code Forms for Offline Data Collection | qr-code-forms-offline-data-collection | QR code form builder | `/use-cases/qr-code-form-builder` |
| P1 | en | How to Build a Job Application Form Before You Need an ATS | job-application-form-before-ats | job application form builder | `/solutions/job-application-form-builder` |
| P1 | en | Newsletter Signup Forms: What to Ask Beyond Email | newsletter-signup-form-fields | newsletter signup form builder | `/solutions/newsletter-signup-form-builder` |
| P1 | en | How to Collect Customer Testimonials Without Back-and-Forth Emails | customer-testimonial-form-guide | customer testimonial form | `/solutions/customer-testimonial-collection-form` |
| P1 | en | Portfolio Submission Form Checklist for Communities and Hiring Teams | portfolio-submission-form-checklist | portfolio submission form | `/solutions/portfolio-submission-form-template` |
| P1 | zh | 如何用 AI 创建线索收集表单 | ai-lead-capture-form-guide-zh | AI 线索收集表单 | `/zh/use-cases/ai-lead-capture-form-builder` |
| P1 | zh | 活动报名表单字段设计清单 | event-registration-form-checklist-zh | 活动报名表单 | `/zh/use-cases/ai-event-registration-form-builder` |

## 4. P2：模板与工作流长尾文章

| 优先级 | 语言 | 建议标题 | 建议 slug | 主关键词 | 目标入口 |
| --- | --- | --- | --- | --- | --- |
| P2 | en | 10 Form Templates Every Small SaaS Team Should Have | saas-form-templates | SaaS form templates | `/templates` |
| P2 | en | How to Turn a Form Submission into a Team Notification Workflow | form-submission-team-notification-workflow | form notification workflow | `/use-cases/feishu-dingtalk-form-notifications` |
| P2 | en | How to Build a Typeform-Like Single Question Flow | typeform-like-single-question-flow | Typeform-like form | `/use-cases/typeform-alternative-webhooks` |
| P2 | en | How to Collect Better Product Feedback Without Long Surveys | collect-product-feedback-without-long-surveys | product feedback form | `/use-cases/customer-feedback-form-builder` |
| P2 | en | How to Use Public Form Links and QR Codes for Events | public-form-links-qr-codes-events | QR code event form | `/use-cases/qr-code-form-builder` |
| P2 | zh | 小团队最需要的 10 类表单模板 | small-team-form-templates-zh | 表单模板 | `/zh/templates` |

## 5. P3：品牌与发布内容

| 优先级 | 语言 | 建议标题 | 建议 slug | 主关键词 | 目标入口 |
| --- | --- | --- | --- | --- | --- |
| P3 | en | Why We Are Building an AI-Native Form Builder | why-ai-native-form-builder | AI-native form builder | `/` |
| P3 | en | GenForms.ai Product Update: Templates, Webhooks, and Use Case Pages | product-update-templates-webhooks-use-cases | GenForms.ai update | `/posts` |
| P3 | zh | 我们为什么要做 AI 原生表单生成器 | why-ai-native-form-builder-zh | AI 表单生成器 | `/zh` |

## 6. 单篇文章 Brief 模板

内容 Agent 每次执行前复制这一段，补全后再写正文。

```yaml
title:
slug:
locale: en
priority: P0
primary_keyword:
secondary_keywords:
target_reader:
search_intent:
target_use_case_url:
target_template_url:
main_cta:
must_include:
  - 直接回答搜索问题
  - 推荐字段或实施步骤
  - 至少 2 个内部链接
  - 一个明确 CTA
avoid:
  - 泛泛讲 AI
  - 夸大未上线能力
  - 重复标题
  - 没有发布日期
```

## 7. 发布后记录

发布后建议记录：

```yaml
published_at:
url:
gsc_index_requested: true
primary_keyword:
target_use_case_url:
cta_url:
first_7_days:
  impressions:
  clicks:
  ctr:
  average_position:
  signup_events:
next_action:
```

## 8. 下一轮选题调整规则

每周根据 GSC 调整：

- 展示高、点击低：优先改标题和 description。
- 排名 8-20：补内部链接、增加 FAQ、强化开头答案。
- 排名 20 以后但有展示：扩写文章，增加更具体的步骤和模板链接。
- 完全无展示：检查关键词是否太偏、文章是否未索引、内部链接是否不足。
