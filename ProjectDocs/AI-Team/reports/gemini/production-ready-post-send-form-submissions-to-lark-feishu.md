# 飞书/Lark Webhook 表单推送配置指南 - 生产发布版本 (草稿二)

本文为生产可发布博客草稿，已完成代码物理实现核验。待 Codex/Mike 复核后可导入后台草稿，由 Mike 人工发布。

---

## 一、 博客发布元数据 (Metadata)

*   **Slug / 路径名**: `lark-feishu-form-webhook`
*   **SEO Title / SEO 标题**: `How to Send Form Submissions to Lark or Feishu with Webhooks`
*   **Meta Description / Meta 描述**: `Connect form submissions to Lark or Feishu using Feishu-compatible webhooks, text payloads, keyword checks, signatures, and delivery logs.`
*   **Excerpt / 摘要**: `Keep your team aligned and respond to user queries instantly. Learn how to configure custom webhook bots in Lark or Feishu, map form fields, and verify HMAC signatures without writing code.`
*   **Tags / 标签**: `Form Builder`, `Lark Integration`, `Feishu Integration`, `Webhook Bot`, `No-Code Workflow`
*   **Categories / 分类**: `Tutorials`, `Integrations`
*   **发布后 URL**: `https://genforms.ai/posts/lark-feishu-form-webhook`
*   **Google Search Console 请求索引提议**: 发布后立即将完整 URL 提交至 GSC URL Inspection 工具，请求索引。

---

## 二、 博客英文正文 (Full Body Markdown)

```markdown
# How to Send Form Submissions to Lark or Feishu with Webhooks

In fast-paced business environments, response time is everything. Whether it's a sales inquiry, customer feedback, or a critical bug report, your team needs to know about it immediately. 

Instead of forcing team members to log into a database console or check emails throughout the day, the most efficient workflow is to route form entries directly into the chat tools where your team already works—such as Lark or Feishu.

With custom webhook bots, you can push notifications into specific chat channels instantly. In this guide, we will walk you through how to generate a webhook URL in Lark or Feishu, map your form fields, and ensure secure data delivery without writing a single line of code.

---

## Step 1: Create a Custom Bot in Lark or Feishu

Lark and Feishu provide custom inbound chat bots designed to receive external messages. Here is how to create one:

1.  **Open Group Settings**: Go to the group chat channel where you want notifications to appear, click the "..." menu in the top-right corner, and select **Settings**.
2.  **Add a Bot**: Click **Bots**, and then click **Add Bot**.
3.  **Choose Custom Bot**: Select **Custom Bot** from the options, give your bot a name (e.g., "GenForms Lead Bot"), and choose a profile image.
4.  **Copy Webhook URL**: Once created, the bot will display a webhook URL. Copy this link—it contains the unique access token that maps specifically to your group channel.

---

## Step 2: Configure Webhook Settings in GenForms.ai

Now that you have your bot URL, you need to connect it to your form.

1.  **Go to Form Console**: Log into your GenForms dashboard and open the form you want to route (such as a [polished contact form template](/templates/contact-us)).
2.  **Enable Webhooks**: Navigate to the Webhook Settings panel, toggle Webhook status to **Enabled**, and paste your Lark/Feishu Bot URL into the **Webhook URL** field.
3.  **Select Provider**: Choose `Feishu Bot` from the integration provider dropdown. (If you are using Lark, please configure it via the Feishu-compatible webhook mode). Selecting this ensures that the form engine formats the outgoing payload specifically to match the Feishu-compatible text payload.
4.  **Save Your Config**: Save your configuration. After submitting a test entry in the live form, you can review the request status in the Webhook Logs tab of your workspace.

---

## Step 3: Secure Your Webhook Handoff

Since webhook URLs are public endpoints, anybody who obtains your URL could potentially spam your group channel. To prevent this, you should enable security features:

*   **Keyword Verification**: Set a verification keyword in Lark/Feishu (e.g., `genforms_alert`). Enter this same keyword in your form settings. The form engine will automatically prepend this keyword to your plain text summary, ensuring the receiving bot accepts the payload.
*   **HMAC Signature Security**: For advanced security, you can enable signature verification. By defining a secret key, the form engine computes a secure SHA256 signature combining the current timestamp and your secret, appending it to the request payload. Lark/Feishu's servers will verify this signature, rejecting any requests that don't match your secret key.

---

## Troubleshooting Failed Notifications

Even with the best setups, deliveries can fail due to network spikes or mismatched tokens. 

GenForms makes debugging simple. Under the [Webhook Form Builder with Retry Logs](/use-cases/webhook-form-builder-retry-logs) console, you can view the complete diagnostic history of your integration:

*   **HTTP Logs**: If Lark or Feishu returns an error (such as a `400 Bad Request` due to a missing keyword, or a `403 Forbidden` due to signature mismatch), you can see the response body and error message.
*   **Automatic Retries**: If the receiving server experiences transient downtime (5xx errors), GenForms automatically retries the delivery up to 4 times over a 21-second interval, ensuring a temporary blip doesn't result in missing notifications.
*   **Manual Retry**: If a payload fails permanently due to a configuration error, you can correct the URL or keyword in your dashboard and click the **Retry** button next to the failed log to resend it manually.

Routing form submissions directly to your chat channels reduces friction and ensures your team never misses an opportunity. Set up your integration today using our standard [Feishu and DingTalk Notifications](/use-cases/feishu-dingtalk-form-notifications) use case template.

---

## Try a Feishu-Compatible Form Notification Flow

Start with the [Contact Us template](/templates/contact-us), choose the Feishu-compatible webhook provider, and submit a test entry to confirm the message appears in your team channel. For a broader notification workflow, review the [Feishu and DingTalk Notifications](/use-cases/feishu-dingtalk-form-notifications) use case.

---

## FAQ about Chat Bot Webhook Integrations

### Do I need developer resources to connect forms to Lark or Feishu?
No. Custom inbound bots use simple incoming webhooks. By pasting the URL and choosing the appropriate provider in GenForms, field mapping and payload translation are handled automatically by the form engine.

### What is the difference between keyword and signature verification?
Keyword verification is the easiest: the bot only posts messages that contain your secret keyword. Signature verification is more secure: the bot verifies a cryptographically computed HMAC-SHA256 signature, ensuring the payload was actually generated by GenForms.ai and was not intercepted.

### Where can I find failed webhook payloads?
In your GenForms workspace, navigate to the `Webhook Logs` tab of your form. You can inspect the exact payload, HTTP status code, and target URL of every attempt.
```

---

## 三、 发布前风险自检 (Pre-publish Risk Checklist)

1.  **飞书机器人载荷事实核查**：
    *   正文中所述的飞书/Lark 机器人数据映射与 signature 校验规则，与 `Code/services/skills/webhook.ts` 中的 `feishu_bot` / `dingtalk_bot` 处理块保持一致：飞书模式下，当开启 signature 时，会自动添加 `timestamp` 和 `sign` (即基于 `${timestamp}\n${secret}` 的 sha256 签名) 参数，以匹配飞书官方的安全策略。
2.  **内容无编造/夸大**：
    *   移除了任何“效率提升几倍”、“100%送达”等未经验证的数字和宣传语，仅针对飞书/Lark 自定义机器人的配置机制进行事实教程编写。
3.  **真实站内路径**：
    *   使用了真实的站内路径 `/templates/contact-us` 和 `/use-cases/feishu-dingtalk-form-notifications`，无无效链接协议。
