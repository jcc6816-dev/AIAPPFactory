# GenForms 第一波内容激活执行包（2026-07-12）

## 本轮目标与边界

目标不是追求播放量，而是在 7 天内获得可归因的真实样本，验证：

`内容入口 -> 模板 -> 创建 -> 发布 -> 首次提交 -> 价格页/结账`

本轮只推一个明确场景：**活动报名（Event registration）**。不声称“AI 替代所有表单工具”、不承诺节省固定时间、不把免费版说成无限制，也不把 `$9/月` 写成限时优惠。

## 统一事实口径

- 从模板或一句提示词开始创建表单。
- 可发布为公开链接和二维码，再收集提交。
- 可配置 Webhook 推送与重试日志。
- 免费方案含 3 个已发布表单和 100 次起始提交额度。
- Pro 为 `$9/月` 或 `$90/年`；这是常规定价，不是 BetaList 专属码或终身权益。

## 渠道专用追踪链接

所有内容使用同一个场景、不同 `source`，不要在同一条内容中混用多个链接。

| 渠道 | 链接 |
| --- | --- |
| YouTube 长视频 | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_youtube_event&utm_source=youtube&utm_medium=video&utm_campaign=activation_sample_202607` |
| YouTube Shorts | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_youtube_short_event&utm_source=youtube&utm_medium=short&utm_campaign=activation_sample_202607` |
| TikTok | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_tiktok_event&utm_source=tiktok&utm_medium=short_video&utm_campaign=activation_sample_202607` |
| X | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_x_event&utm_source=x&utm_medium=social&utm_campaign=activation_sample_202607` |
| LinkedIn | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_linkedin_event&utm_source=linkedin&utm_medium=social&utm_campaign=activation_sample_202607` |
| 工具目录 | `https://genforms.ai/forms/new?template=event-registration&source=activation_sample_directory_event&utm_source=directory&utm_medium=listing&utm_campaign=activation_sample_202607` |

## A. YouTube 长视频（90–120 秒）

### 标题

`From Event Template to Shareable Registration Form | GenForms.ai Demo`

### 封面文字

主文案：`EVENT FORM → LIVE LINK`

角标：`Template • QR • Submissions`

### 分镜与口播

| 时间 | 画面 | 口播/字幕 |
| --- | --- | --- |
| 0–5 秒 | 模板详情页，聚焦 Event Registration | `Need an event registration form? Start with a prepared template — not a blank canvas.` |
| 5–18 秒 | 进入 `/forms/new`，展示模板上下文和预览 | `GenForms carries the event structure into the creation workspace, so you can see what is being prepared.` |
| 18–30 秒 | 点击 `Create this form`；如出现登录，录制真实回跳 | `When it looks right, create it. If sign-in is needed, the template context stays with you.` |
| 30–48 秒 | 创建后的编辑页：只调整一个字段或标题 | `Make the one change your event needs. Keep this part real and short.` |
| 48–67 秒 | 发布页，点击 `Publish now`，展示公开链接与 QR | `Publish to get a shareable link and QR code. That is the handoff from setup to real collection.` |
| 67–85 秒 | 用无敏感的测试提交；展示结果页 | `Send a test, then check the first submission in the results view.` |
| 85–105 秒 | 回到公开链接/二维码，屏幕文字 CTA | `Try the prepared event template. I am looking for honest feedback on where the flow feels unclear.` |

### YouTube 描述（可直接粘贴）

```text
Most event forms start from a blank page. This demo starts with a prepared Event Registration template, then follows the real path: create, publish, share a link or QR code, and view the first submission.

I am testing the early GenForms flow and want honest feedback: where would you hesitate, and does the “Create this form” step make sense?

Try the prepared event template:
https://genforms.ai/forms/new?template=event-registration&source=activation_sample_youtube_event&utm_source=youtube&utm_medium=video&utm_campaign=activation_sample_202607

GenForms.ai supports template/prompt-based form creation, public links and QR codes, submissions, and Webhook delivery with retry logs.
```

### 发布设置

- 分类：Science & Technology 或 Howto & Style。
- 语言：English。
- 置顶评论：只重复上述链接和一个问题：`At which step would you stop: template, sign-in, publish, or sharing?`
- 不把链接放在 Shorts 描述里作为唯一 CTA；Shorts 主要引导到频道主页或关联的长视频。

## B. 竖屏短视频（25–35 秒；YouTube Shorts / TikTok 共用）

### 画面与字幕

1. `0–3s`：`Need an event registration form?` + 模板缩略图。
2. `3–8s`：`Start from a prepared template.` + 点击模板。
3. `8–15s`：`See the fields before you create.` + `/forms/new` 预览。
4. `15–21s`：`Create it. Sign-in keeps the context.` + Create CTA / 登录回跳。
5. `21–28s`：`Publish → link + QR code.` + Publish 页。
6. `28–33s`：`Would this be clear for your next event?` + 频道主页/长视频 CTA。

### 字幕稿

```text
Need an event registration form?
Start from a prepared template.
See the fields before you create.
Create it — sign-in keeps the context.
Publish, then share a link or QR code.
Would this be clear for your next event?
```

### TikTok 文案

```text
Testing a smaller way to make an event registration form: template → create → publish → QR/link → submissions.

Where would you expect to get stuck?

Try the prepared template from the profile link.
```

个人简介链接使用 `activation_sample_tiktok_event`，不要在视频内展示带参数的长 URL。

## C. X 帖子（单帖）

```text
I’m testing one narrow question with GenForms.ai:

Can an event registration template get someone from “I need a form” to a shareable link/QR without starting from a blank canvas?

The real flow is:
template → create → publish → collect a submission

I’d value blunt feedback on where you would hesitate — especially around the create or publish step.

[tracked X link]
```

配图：使用视频封面，或 4 格流程图（Template / Create / Publish / Results）。不要用虚构数据、倒计时或“用户暴涨”类视觉。

## D. LinkedIn 帖子

```text
I’m building GenForms.ai around a very small product question:

When someone needs an event registration form, is a prepared template enough to get them to a useful published link — without a blank-page setup session?

The current flow is deliberately simple:
1. Open an Event Registration template
2. Review the prepared fields
3. Create the form
4. Publish it and share a link or QR code
5. Collect and review submissions

I’m looking for honest feedback, not generic signups. If you run events, meetups, classes, or communities: where would you expect to stop or need more confidence?

Try the flow here: [tracked LinkedIn link]
```

首条评论可补：`I will share what people find confusing once there are enough real sessions to learn from.`

## E. 工具目录资料（NavTools / Futurepedia / 同类目录）

### 一句话

`Create a publishable form from a prompt or template, then share it by link or QR code and collect submissions.`

### 150 字以内描述

`GenForms.ai helps teams start with a prompt or a prepared form template, review the fields, publish a public link or QR code, collect submissions, and send results to downstream tools through Webhooks.`

### 完整描述

```text
GenForms.ai is a form builder for teams that want to move from a real use case to a published collection flow without starting from a blank canvas. Begin with a prompt or a prepared template, review and adjust the fields, publish a public link or QR code, collect submissions, and use Webhook delivery with retry logs when an integration is needed.

Useful for event registration, lead capture, client intake, customer feedback, and internal collection workflows.
```

### 建议标签

`AI form builder`, `event registration`, `lead capture`, `QR code forms`, `webhooks`, `Typeform alternative`

### 目录截图清单

1. Event Registration 模板页。
2. `/forms/new` 的模板上下文与预览。
3. 发布成功后的链接与二维码。
4. 结果页的无敏感测试提交。

目录链接使用 `activation_sample_directory_event`。

## F. Antigravity 制作简报

### 交付物

1. 16:9 YouTube 封面 PNG，1280×720。
2. 9:16 短视频封面 PNG，1080×1920。
3. 4 格 X/LinkedIn 流程图 PNG，1600×900。
4. 90–120 秒横屏录屏剪辑，含英文硬字幕。
5. 25–35 秒竖屏剪辑，含英文硬字幕。

### 视觉指令

```text
Use real GenForms UI screenshots or screen recordings only. Clean SaaS product-demo style, white/light-blue interface, generous whitespace, readable English UI labels. Show a truthful four-step sequence: Event template, Create this form, Publish now with link/QR, Results/submissions. Avoid fake charts, invented customer logos, urgency badges, or claims of being faster/cheaper than named competitors. The primary visual should communicate “prepared template becomes a shareable real form”.
```

### 录屏操作要求

- 使用全新或干净的测试账号；不要录入真实姓名、邮箱、客户信息或真实二维码扫描结果。
- 登录步骤如出现，保留 1–2 秒并展示返回后的模板仍在，不能跳剪成“无需登录”。
- 发布动作必须使用已上线的 `Publish now`，不要只展示静态预览。
- 测试提交使用虚构资料，结果页只展示必要字段。
- 最终导出前由 Mike 观看一次，确认没有泄露账户、URL token、个人资料或不实承诺。

## G. 分工与发布顺序

| 角色 | 动作 |
| --- | --- |
| Antigravity | 按 F 完成录屏、封面、横竖版剪辑与 4 格流程图。 |
| Mike | 核对成片和文案事实；完成 NavTools 人机验证；在自己的 YouTube/X/LinkedIn/TikTok 账号最终发布。 |
| Codex | 维护追踪链接、核对产品事实、观察内容来源的创建/发布/价格漏斗。 |
| Hermes | 继续监控 `/forms/new` 与待发布断点；内容发布后按 `activation_sample_*` 汇总新会话。 |

发布顺序：先 YouTube 长视频，再在同一天发 X；短视频在 24–48 小时后复用；LinkedIn 在获得第一条真实反馈或评论后发布。每次只推动一个链接，发布后不要立即改产品页面。
