# AI-TASK-2026-006: Slack Incoming Webhook Product Gate

请产品经理与工程侧共同复核并关闭 Slack Incoming Webhook Notifications Topic 的产品 Gate。该任务不要求创建 SEO 页面。

## 当前已确认能力

- 设置页可选择 `slack_bot` provider，并填写 Slack Incoming Webhook URL。
- 发送 payload 为 `{ "text": plainTextSummary }`。
- 已有提交记录、Webhook delivery log、失败原因和手动 retry。
- 当前自动重试覆盖 HTTP 5xx 与网络异常。

## 当前明确不是

- Slack OAuth 或一键安装 Slack App。
- 自动发现/选择频道。
- 读取消息、交互按钮、双向对话或完整 Bot 生命周期。

## 必须完成的 Gate

1. 使用受控 Slack workspace 完成一次真实表单提交到 Incoming Webhook 的 E2E。
2. 验证成功、无效/撤销 URL、400、403、404、429、5xx 和网络超时。
3. 明确 429 `Retry-After` 的实现或暂不支持边界。
4. 增加明确的请求 timeout/abort 与最终失败状态。
5. 给出 Slack Incoming Webhook URL 的 at-rest 加密方案，并保证 UI、日志、错误和埋点中不输出完整 URL/token。
6. 决定是否增加安全的 test-send；若暂不增加，提供经过验证的“测试表单提交”路径。
7. 增加 provider selected、test sent、delivery success、delivery failed、manual retry 事件。
8. 将可能误导的公开 `Slack Bot` 文案统一改为 `Slack Incoming Webhook`，内部 enum 可暂时保留。

## 产品经理回传格式

请返回：

- `Gate result`: Pass / Partial / Fail
- `Real E2E`: 日期、结果、脱敏证据路径
- `Supported failures`: 已支持的状态和重试行为
- `Security`: URL 存储、日志脱敏、错误脱敏结论
- `Public name`: 最终对外名称
- `Remaining limitations`: 必须写入 SEO FAQ 的边界
- `Build recommendation`: 是否允许 SEO 进入 Architect

在 Gate Pass 前，不允许创建 Slack Use Case、Solution、Post 或 pSEO 页面。

