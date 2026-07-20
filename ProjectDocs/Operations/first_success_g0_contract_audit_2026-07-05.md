# First Success G0 合同冻结审计（2026-07-05）

## 1. 结论

**G0 判断：Pass。G1 已发布生产，9/10 新账户 E2E 与外部 Gate 验证待执行。**

当前实现不是从零开始。测试提交、真实存储、`is_test` 标记、免计费、免免费额度、默认不外发、结果页 Test 标识、Owner 鉴权和基础事件均已存在；生产数据库也已经具备 `is_test` 字段，并存在测试提交记录。

G0 没有重新设计或重写 First Success Loop。2026-07-05 已完成四个窄补口中的源码与自动化验证部分：

1. `activation_completed` 已改为可信服务端判定，客户端通用埋点接口拒绝可信状态事件。
2. 已补 Owner-only 测试提交删除，数据库删除条件强制 `is_test=true`。
3. 已冻结单数 API 路径并同步 PRD V1.3。
4. 已补紧急关闭开关、基础限流和发布清单；9/10 全新账户 E2E 仍待生产执行。

在生产发布、9/10 E2E 和外部 Pilot 证据完成前，不把 First Success Loop 标记为生产 Gate 全量通过，也不据此扩大 SEO 或功能范围。

## 2. 本次边界

### 本次完成

- 审核测试提交的数据、API、计费、外发、事件和生产迁移事实。
- 冻结 G0 合同与验收口径。
- 明确进入 G1 前的最小补口，不扩展产品范围。

### 本次不做

- 不新增邮件、多语言、条件逻辑、Embed、PDF 或 Workflow 能力。
- 不重做 First Success UI。
- 不改认证、计费和 Webhook 公共合同。
- 不修改生产数据，不执行数据库迁移。
- 不用内部或测试流量替代外部用户验证。

## 3. G0 冻结合同

### 3.1 测试提交合同

| 项目 | 冻结口径 |
|---|---|
| 权限 | 仅已登录的表单 Owner 可发送测试提交。 |
| 前置状态 | 表单必须已发布。 |
| 数据路径 | 使用真实表单校验与真实 `form_submissions` 存储。 |
| 标识 | 测试记录必须持久化为 `is_test=true`。 |
| 计费与额度 | 不扣 Credits，不计入免费方案真实提交额度。 |
| 外发与增值处理 | 默认不进入 Workflow、Webhook、OCR、邮件、WhatsApp、付费 AI Skill；这些能力只能通过各自显式 Test Send/Test Run 触发。 |
| 结果 | 成功后进入该条提交详情，显示 Test 标识与答案。 |
| 删除 | Owner 可删除测试记录；删除不能影响真实提交。当前未实现。 |
| 错误 | 未登录、非 Owner、未发布、缺少/非法答案、存储失败必须返回可识别错误。 |

### 3.2 激活合同

唯一激活定义：同一 `user_uuid + form_uuid` 在 24 小时内依次完成：

```text
form_created
-> form_published / publish_succeeded
-> test_submission_completed 或该表单第一条 public_form_submitted
-> first_result_viewed
-> activation_completed
```

冻结规则：

- `activation_completed` 只能由服务端根据持久化事实生成一次，客户端不得直接宣告激活完成。
- `first_result_viewed` 必须对应当前 Owner、当前表单和真实存在的 submission。
- 测试路径要求 submission 的 `is_test=true`；真实路径要求 `is_test=false`。
- 同一用户、同一表单的激活事件必须幂等。
- 事件 metadata 禁止保存答案、Prompt、邮箱、文件名和通知凭证。
- Admin、internal、dev 流量必须可排除。

### 3.3 API 合同

当前生产代码路径为：

```text
POST /api/forms/{id}/test-submission
```

PRD V1.3 表格写作：

```text
POST /api/forms/{id}/test-submissions
```

G0 建议冻结当前已实现的单数路径为 MVP 规范路径，避免无收益改路由；后续若需要兼容复数路径，只允许增加兼容别名，不删除或静默改变现有路径。相关 PRD/API 文档应统一为该口径。

### 3.4 数据合同

`form_submissions.is_test`：

- 类型：`boolean not null default false`。
- 旧数据保持 `false`，不改变真实提交语义。
- 查询、额度、增长归因必须显式区分 test / non-test。
- 索引：`(form_uuid, is_test, created_at desc)`。

### 3.5 发布与回滚合同

- 上线前执行迁移 verify：生产查询 `is_test` 字段成功。
- First Success UI/可信激活补口应受独立 Feature Flag 或等价紧急关闭开关控制。
- 回滚优先关闭入口和新事件生成，不删除 `is_test` 字段，不破坏已存记录。
- 发布清单记录版本、迁移状态、测试结果、生产探针、回滚负责人和观察窗口。
- 任何生产错误不得回退到“测试提交参与计费或默认外发”。

## 4. 审计证据

| 检查项 | 证据 | 判断 |
|---|---|---|
| Schema | `Code/data/install.sql` 与 `Code/data/migrations/2026-07-02-first-success-test-submission.sql` 定义 `is_test` 与索引。 | Pass |
| 生产数据库 | 2026-07-05 只读探针可查询 `form_submissions.is_test`，并统计到 1 条测试提交。 | Pass |
| Owner 鉴权 | 测试 API 使用登录用户和 `getFormByUuidForUser`。 | Pass |
| 已发布限制 | 测试 API 调用 `isFormPublished`。 | Pass |
| 真实存储 | test mode 调用 `insertFormSubmission`，写入 `is_test=true`。 | Pass |
| 免计费/免额度 | test mode 在 Credits、额度统计、计费代码之前直接返回；真实额度统计排除 `is_test`。 | Pass |
| 默认不外发 | test mode 在 Workflow/Webhook/OCR 链路前直接返回。 | Pass |
| 结果识别 | 提交后带 submission UUID 返回结果页，列表/详情显示 Test 标识。 | Pass |
| 生产路由 | 未登录访问 `/forms/{id}/test` 返回 307 到登录页，Owner 门禁存在。 | Pass |
| 单元/API 测试 | 4 个测试文件、16 项测试于 2026-07-05 全部通过。 | Pass |
| 敏感数据事件 | growth API 删除 prompt/answer/answers/title/description 等字段。 | Partial：仍是通用 metadata 过滤，不是事件级白名单。 |
| 可信激活 | Owner-only `result-view` 服务端核验 form/submission 与 24 小时事件顺序；通用客户端事件 API 拒绝可信状态事件。 | Pass（源码） |
| 测试记录删除 | Owner-only DELETE；模型删除条件包含 form UUID、submission UUID、`is_test=true`。 | Pass（源码） |
| API 文档一致性 | 代码与 PRD V1.3 已统一为单数 `/test-submission`。 | Pass |
| 限流/防滥用 | 测试提交按 Owner + form 执行 10 次/10 分钟的实例级基础限流。 | Pass（基础） |
| Feature Flag/回滚开关 | `FIRST_SUCCESS_LOOP_ENABLED=false` 可停止新测试提交与可信事件写入；删除仍可用。 | Pass（源码） |
| 9/10 新账户 E2E | 未找到完整桌面/移动生产证据。 | Pending |
| 真实提交/Webhook/CSV/订阅回归 | 全量 Vitest 83 个文件、400 项测试通过；生产人工回归仍待发布窗口执行。 | Conditional Pass |

## 5. 本轮验证记录

执行：

```bash
cd Code
npm test -- \
  'app/api/forms/[id]/test-submission/route.test.ts' \
  'services/form-runtime-test-mode.test.ts' \
  'app/api/growth/events/route.test.ts' \
  'services/first-success-loop-localization.test.ts'
```

结果：

```text
Test Files  4 passed (4)
Tests       16 passed (16)
```

生产只读验证：

- `https://genforms.ai/`：HTTP 200。
- 未登录访问测试路由：HTTP 307，跳转登录并保留 callback URL。
- Supabase schema probe：`is_test` 可查询。
- 测试提交数量：1。
- growth events 合同字段可查询。

## 6. G1 最小补口计划

### G1-A：可信激活（P0）

- 新增服务端 activation evaluator，按 `user_uuid + form_uuid + submission_uuid` 验证持久化事实和 24 小时事件顺序。
- 由服务端幂等写入 `activation_completed`。
- 客户端只报告“结果被打开”的意图；不能直接发送 `activation_completed`。
- 为伪造 `from=test`、错误 submission、非 Owner、非 test submission、重复请求和超时链补测试。

### G1-B：测试提交删除（P0）

- 增加 Owner-only 删除接口，只允许删除 `is_test=true` 的记录。
- 真实提交必须拒绝通过该接口删除。
- 结果页提供克制的删除操作与确认提示。
- 覆盖 Owner、非 Owner、真实提交、记录不存在和成功删除测试。

### G1-C：发布安全（P0）

- 增加独立开关或等价 kill switch。
- 增加测试提交 API 基础限流，按 Owner + form 约束。
- 形成 release manifest 与回滚步骤。

### G1-D：Gate 验证（P0）

- 运行 create/publish/public submit/billing/Webhook/CSV 回归。
- 完成 10 组全新账户/全新表单 E2E，桌面和移动合计至少 9 组闭环成功。
- 外部 Pilot 统计与内部/Admin/dev 流量分离；不足 20 个外部合格进入者时标记 `Evidence Insufficient`。

## 7. 进入 G1 的文件影响预估

具体文件需在 G1 计划确认时以当前代码复核，预计最小影响为：

- `Code/app/api/growth/events/route.ts`：禁止客户端直接写入可信完成事件，收紧 metadata。
- `Code/services/`：新增或局部加入 activation evaluator。
- `Code/models/growth-event.ts`：查询/幂等写入所需的最小能力。
- `Code/app/api/forms/[id]/test-submission/**`：补删除或建立测试提交专用删除路由。
- `Code/models/form-submission.ts`：Owner 校验后的 test-only 删除能力。
- `Code/components/forms/form-submissions-client.tsx`：移除客户端直接宣告激活，增加测试记录删除入口。
- 对应 `.test.ts` / `.spec.tsx`：覆盖成功、鉴权、伪造、重复、失败与回归路径。

不新增第三方依赖。若限流不能复用现有基础设施，先采用最小服务端约束方案，不为 G0/G1 引入新的平台级限流系统。

## 8. 决策

G0 与 G1 源码补口及生产技术发布已经完成，当前动作转为 `Product Gate`：执行 9/10 新账户 E2E 和真实提交/Webhook/CSV 生产回归，然后进入外部 Pilot。其余扩围继续冻结。

## 9. G1 实施记录（2026-07-05）

- 新增可信结果查看 API：`POST /api/forms/{id}/result-view`。
- 新增服务端 24 小时激活序列判定与应用层幂等写入。
- 通用客户端增长事件 API 不再接受 `form_created`、`form_published`、`public_form_submitted`、`test_submission_completed`、`first_result_viewed`、`activation_completed` 等服务端事实事件。
- 创建表单时若直接发布，服务端同步生成可信 `form_published`。
- 新增 `DELETE /api/forms/{id}/test-submission`，只删除测试记录。
- 新增测试提交基础限流和 `FIRST_SUCCESS_LOOP_ENABLED` 紧急关闭开关。
- 定向测试：6 个文件、31 项通过。
- 全量测试：83 个文件、400 项通过。
- TypeScript：`npx tsc --noEmit` 通过。
- 生产构建：`npm run build` 通过。
- 生产发布：PM2 online，源站与公网认证 200，新 API 鉴权探针通过，release-state 与 SEO Gate 通过。
