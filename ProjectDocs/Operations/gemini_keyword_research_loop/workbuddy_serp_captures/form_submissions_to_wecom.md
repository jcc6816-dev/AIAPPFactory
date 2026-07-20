# Topic: form submissions to WeCom

## Evidence status

`Captured / Codex reviewed`

- Capture date: 2026-06-30
- Method: Mike manual Chrome Incognito capture
- Locale evidence: English Google UI; Los Angeles, California shown as IP-derived location
- Coverage: 3 full-page screenshots, no CAPTCHA

## Queries captured

| # | Query | Evidence file |
|---|---|---|
| 1 | `send form submissions to WeCom` | `screenshots/form_submissions_to_wecom_q1_send_form_submissions_to_wecom.png` |
| 2 | `WeCom webhook form` | `screenshots/form_submissions_to_wecom_q2_wecom_webhook_form.png` |
| 3 | `form submission notification WeChat Work` | `screenshots/form_submissions_to_wecom_q3_form_submission_notification_wechat_work.png` |

## Screenshot-grounded SERP reading

### Query 1: `send form submissions to WeCom`

Visible features: AI Overview, People also ask and related searches.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | GenForms.ai | Feishu and DingTalk Form Notifications \| GenForms.ai |
| 2 | Zoho | WeCom Integration in Instant Messaging |
| 3 | Apple App Store | WeCom – App Store |
| 4 | J.P. Morgan | WeCom Usage Guide |
| 5 | Weixin Developers | WeCom \| Weixin public doc |
| 6 | Intercom Community | Create new inbox message for web-site for every ... |
| 7 | Zapier | Form Submission Alerts |
| 8 | J.P. Morgan | J.P. Morgan WeCom Usage Guide |
| 9 | GitHub | jackwener/OpenCLI: Make Any Website into CLI & Use ... |

The last four results are partially or wholly off-intent; Google explicitly marks some as missing `WeCom`.

### Query 2: `WeCom webhook form`

Visible features: AI Overview. The SERP is almost entirely technical bot/webhook documentation and tools.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | Bika.ai | WeCom Group Robot Webhook Guide \| Send Messages ... |
| 2 | GitHub | walkthunder/action-wecom-webhook |
| 3 | Tencent Cloud | WeCom Robot Management |
| 4 | Alibaba Cloud | Create and manage a WeCom chatbot |
| 5 | MCP Market | WeCom Bot: Send Messages to WeChat Work via Webhook |
| 6 | LobeHub | WeCom Bot MCP Server |
| 7 | LangBot | WeCom Intelligent Bot – LangBot Documentation |
| 8 | Dify Marketplace | WeCom SmartSheet Plugin |
| 9 | Beszel | WeCom |

### Query 3: `form submission notification WeChat Work`

Visible features: AI Overview, People also ask and related searches. Results are noisy and mostly about general WeChat notifications, publishing systems or peer-review communication.

| Visible organic order | Source | Visible title |
|---:|---|---|
| 1 | Silverchair | Charlesworth Announces its WeChat Author Notification ... |
| 2 | Aries Systems | Communicate with Authors in China via the Charlesworth ... |
| 3 | Knowledge Futures | Utilising WeChat to improve peer review communication in ... |
| 4 | YouTube | How to Turn On WeChat Notifications 2026 ... |
| 5 | Medium | How to send template message for WeChat Mini-program? |
| 6 | Flozic | Google Forms WeChat Integration – Flozic |
| 7 | Reddit | I don't get WeChat notifications |
| 8 | Weixin | New features of V3.0 |
| 9 | WeChat Help Center | I'm not getting notifications when I receive new messages |

## Codex intent and ownership decision

Only the WeCom-specific webhook query has stable technical intent. The broader WeChat Work notification wording is noisy and does not form a clean SEO cluster. For the most product-relevant query, the existing GenForms page is already the first visible organic result.

Current owner:

- `/use-cases/feishu-dingtalk-form-notifications`

GenForms supports WeCom through the documented Incoming Webhook/group-bot path; it must not be described as native WeCom OAuth, a first-party app or a workflow platform.

Decision: `Existing asset / Merge / Observe`.

Do not create a dedicated WeCom landing page. Protect the ranking owner and revisit only if GSC confirms meaningful WeCom impressions or a CTR/content gap.
