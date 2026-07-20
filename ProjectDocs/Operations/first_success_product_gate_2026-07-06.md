# First Success Product Gate 生产验收（2026-07-06）

## 结论

**Product Gate：Partial Pass。**

生产技术闭环已由一个真实登录账户完成：AI 生成 -> 发布 -> 测试提交 -> 查看首条结果 -> 可信激活。测试提交没有扣费、没有 Workflow、没有 Webhook；真实公开提交正常扣除 1 Credit 并完成 Workflow。

本轮不是“全新账户”样本，因此不能计入 9/10 新账户 Gate。测试提交删除按钮已显示，但 Chrome 控制在确认弹窗阶段中断，删除 API 的生产 UI E2E 仍待复测。合成测试记录随后按相同 test-only 数据条件安全清理。

## 生产样本

| 项目 | 值 |
|---|---|
| Form UUID | `form_adgbizmr8hv1de` |
| Share code | `share_qjk8admr8hv1de` |
| 测试 submission | `sub_krmbj6mr8hwrcv`（已清理） |
| 真实 submission | `sub_2oy3h8mr8i1kgf` |
| 真实 workflow | `run_fgllzrmr8i1kxh` |
| Webhook 配置 | 关闭 |
| 测试来源 | `codex_product_gate_20260706` |

所有填写内容均为合成测试数据，不包含真实客户信息。

## 验收证据

### 1. 创建与发布

- 使用生产登录态进入 `/zh/forms/new`。
- AI 根据受控 Prompt 生成 4 个必填字段：姓名、工作邮箱、公司、反馈。
- 发布成功并进入 `/zh/forms/{id}/publish`。
- 发布页展示公开链接、QR、发送免费测试和查看结果入口。
- 数据库状态为 `published`。
- 服务端事件存在：`form_created`、`form_published`。

判断：**Pass**。

### 2. 测试提交与可信激活

测试前：

- Valid Credits：9。
- Submission：0。
- Workflow：0。
- Webhook log：0。

测试后：

- Valid Credits：仍为 9。
- Submission：1，`is_test=true`，`status=completed`。
- Workflow：0。
- Webhook log：0。
- 结果页显示 Test 状态与“删除测试提交”按钮。
- 服务端事件顺序：

```text
form_created
-> form_published
-> test_submission_started
-> test_submission_completed
-> first_result_viewed
-> activation_completed
```

每个完成事件均关联同一 form；提交、查看与激活事件关联同一 test submission UUID。

判断：**Pass**。

### 3. 测试提交删除

- 删除按钮在生产结果页可见。
- 点击后确认弹窗正常出现。
- Chrome 控制连接在确认弹窗阶段超时；数据库确认请求未完成，未误报成功。
- 合成测试记录随后用 `form_uuid + submission_uuid + is_test=true` 条件清理，清理后剩余 0 条。
- 自动化测试已覆盖 Owner-only、真实记录拒绝删除和成功删除。

判断：**Partial**。生产 UI/API 完整回路仍需在浏览器连接稳定时复测。

### 4. 真实公开提交回归

- 通过生产公开提交 API 写入一条合成真实记录。
- 返回 `is_test=false`、`status=completed`。
- Valid Credits：9 -> 8，符合真实提交扣费合同。
- 创建 Workflow，状态 `completed`。
- 生成 `public_form_submitted` 事件。
- 表单未配置 Webhook，Webhook log 保持 0，未发生外部发送。

判断：**Pass（无 Webhook 表单）**。

### 5. CSV 与 Webhook 回归

- 全量自动化回归和生产构建已通过。
- 本轮 Chrome 连接在删除确认弹窗后不可继续复用，未完成登录态 CSV 下载。
- 本表单没有 Webhook 配置，不能证明“已配置 Webhook 的真实发送”生产回归。

判断：**Pending**。不得用本轮 0 条 Webhook log 代替已配置 Webhook 的成功证据。

## Gate 状态

| Gate | 状态 |
|---|---|
| 技术发布、鉴权、路由 | Pass |
| 单账户创建/发布/测试/结果/激活 | Pass |
| 测试不扣费、不外发、无 Workflow | Pass |
| 真实提交与 Workflow | Pass |
| 测试删除生产 UI/API | Partial |
| CSV 生产下载 | Pending |
| 已配置 Webhook 生产回归 | Pending |
| 9/10 全新账户 E2E | 0/10；本轮已有账户不计入 |
| 20 个外部合格进入者 | Evidence Insufficient |

## 下一步

1. 浏览器连接稳定后，只复测测试记录删除和 CSV 下载，不重复创建产品范围。
2. 使用专门的受控 Webhook 测试目标完成一次真实提交回归；不能向真实运营群误发测试消息。
3. 招募 10 个全新账户执行桌面/移动 E2E，至少 9 个完成闭环；内部重复操作不得计数。
4. 满 20 个外部合格进入者后，再评估发布率与结果查看率；不足时保持 `Evidence Insufficient`。
