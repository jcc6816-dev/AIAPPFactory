# First Success G1 发布清单（2026-07-05）

## 发布结论

源码、全量自动化测试、TypeScript、生产构建和生产发布均已通过。当前状态为 **Deployed / Product Gate Partial**：单账户生产闭环与真实提交回归通过；删除 UI、CSV、已配置 Webhook、9/10 新账户和外部 Pilot 证据待补。

## 变更范围

- 可信激活：结果查看由 Owner-only 服务端接口核验并写入事件。
- 测试删除：只允许删除当前 Owner 表单下 `is_test=true` 的提交。
- 防伪造：客户端通用埋点不能写入服务端业务事实事件。
- 安全开关：`FIRST_SUCCESS_LOOP_ENABLED=false` 停止新测试提交与可信结果事件。
- 基础限流：同一 Owner + form 每 10 分钟最多 10 次测试提交。

无数据库结构变更，无新增第三方依赖，不修改计费或 Webhook 公共合同。

## 发布前配置

生产环境显式配置：

```text
FIRST_SUCCESS_LOOP_ENABLED=true
```

确认 `form_submissions.is_test` 可查询；本轮无需再执行迁移。

## 自动化证据

```text
npx tsc --noEmit                 PASS
npm test                         83 files / 400 tests PASS
npm run build                    PASS
```

## 生产人工 Gate

1. 新账号创建并发布表单。
2. 发送测试提交，确认结果显示 Test。
3. 确认 Credits 与免费真实提交额度不变。
4. 确认没有 Webhook、OCR、邮件或其他外发。
5. 删除测试提交，确认真实提交不受影响。
6. 发送一条真实公开提交，验证 Webhook、CSV 和订阅限制没有回归。
7. 在增长事件中按 `user_uuid + form_uuid` 复现完整可信链。
8. 桌面和移动完成 10 组新账号/新表单 E2E，至少 9 组成功。

## 观察项

- 测试提交 API 错误率。
- `first_result_viewed` 到 `activation_completed` 的判定结果。
- 重复事件数量应为 0。
- 测试提交是否误进入计费、额度或外发链路。
- 限流命中情况；当前是单实例内存限流，不作为分布式强安全边界。

## 回滚

1. 将 `FIRST_SUCCESS_LOOP_ENABLED=false` 并重新发布。
2. 保留 `is_test` 字段和已有记录，不做破坏性数据库回滚。
3. 关闭后仍允许 Owner 删除已有测试提交。
4. 若只发生可信事件统计异常，停止读取新增激活事件，不回退到客户端直接写完成事件。
5. 核验真实提交、Webhook、CSV 与计费保持可用。

## 未完成项

- 测试提交删除的生产 UI/API 完整回路复测。
- CSV 生产下载与已配置 Webhook 真实发送回归。
- 9/10 新账户 E2E。
- 至少 20 个外部合格进入者的 Pilot 证据。
- 测试提交附件删除后的对象存储清理；当前删除数据库记录，不应把该接口当作文件生命周期清理机制。

## 生产发布记录

执行时间：2026-07-05（Asia/Shanghai）

- 发布方式：受控脏发布，`RELEASE_ALLOW_DIRTY=1 ./scripts/deploy-pm2.sh 43.98.193.104`。
- 生产环境：已备份 `.env.local`，并显式配置 `FIRST_SUCCESS_LOOP_ENABLED=true`；部署脚本未上传本地环境文件。
- PM2：`aiform-factory` online，启动守护通过。
- 源站 `/api/auth/session`：HTTP 200。
- 公网 `/api/auth/session` 与首页：HTTP 200。
- 新增 `result-view` 与 `test-submission` 路由已存在于生产构建。
- 未登录访问可信结果 API 与测试删除 API：均返回 `code=-2 / no auth`。
- `verify-production-seo.sh https://genforms.ai`：通过。
- `verify-release-state.sh https://genforms.ai`：更新已过期的 workspace 文案断言后通过；页面源站与公网均为 HTTP 200。

## Product Gate 追加记录（2026-07-06）

- 生产 AI 创建与发布：通过。
- 测试提交：`is_test=true`，Credits 9 -> 9，Workflow 0，Webhook log 0。
- 可信激活链：完整生成至 `activation_completed`。
- 真实公开提交：`is_test=false`，Credits 9 -> 8，Workflow completed。
- 合成测试记录已清理；真实提交保留为回归证据。
- 详细证据见 `ProjectDocs/Operations/first_success_product_gate_2026-07-06.md`。
