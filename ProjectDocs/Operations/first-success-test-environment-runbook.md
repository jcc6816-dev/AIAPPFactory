# First Success Loop 测试环境运行手册

适用范围：First Success Loop（描述生成 → 预览发布 → 测试填写 → 首条 TEST 结果）候选版本。该环境绝不复用生产数据库、生产 Webhook 接收端或生产认证回调。

## 必备隔离

- 独立 `SUPABASE_URL` 与服务端密钥；先执行 `Code/data/migrations/2026-07-02-first-success-test-submission.sql` 和 `Code/data/migrations/2026-08-09-first-success-idempotency.sql`。
- 独立 `NEXT_PUBLIC_WEB_URL`、`AUTH_URL`、`NEXTAUTH_URL`，并只向 OAuth 提供方登记该测试环境回调地址。
- `FIRST_SUCCESS_LOOP_ENABLED=true`；保留改为 `false` 的紧急回退能力。
- Webhook 接收端必须是隔离捕获端。测试提交不得出现任何该端请求。
- 只使用普通测试账号 A（创建者）、B（非所有者）和一个无痕匿名会话；禁止使用 Mike、管理员或生产客户账号。

## 部署前记录

- 候选 Git SHA、构建时间、数据库迁移版本、部署 URL、回滚候选版本。
- 本次测试账号与表单均为测试专用，提示词和提交答案不得包含真实个人信息。

## 放行执行顺序

1. 无痕访问创建页，填写提示词，登录后确认原始意图仍在。
2. 创建者生成草稿，确认预览有真实字段；生成失败不得显示成功。
3. 发布后由无痕窗口核对公开页面字段、必填规则与预览一致；草稿链接不可访问。
4. 测试填写页先显示空状态；完成一次答卷后确认结果页出现带 `TEST` 标识的同一记录。
5. 用相同 `Idempotency-Key` 重发一次测试请求，确认只返回同一 `submission_uuid`，不会新增记录或增长事件。
6. 检查 TEST 提交：不扣额度、不触发 Webhook、Bot、邮件、OCR 或其他外部自动化。
7. 用账号 B 和匿名会话尝试读取 A 的结果与私有 API，必须拒绝。

## 回滚

先将 `FIRST_SUCCESS_LOOP_ENABLED=false` 停止新测试提交，再回退候选应用版本。不得为回滚删除已有测试或用户提交；数据库迁移仅增加字段与索引，保持向后兼容。
