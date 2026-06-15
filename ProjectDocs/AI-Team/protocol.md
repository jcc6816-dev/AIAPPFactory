# AI-Team 文件协作协议

> 版本：0.6
> 适用对象：Codex、Gemini，以及未来参与 GenForms.ai 的 AI Agent。
> 核心原则：目标先对齐，任务再执行；执行有报告，报告要复核；未经复核，不算完成。

## 1. 角色分工

### Codex

Codex 承担：

- 产品与工程大脑。
- 项目经理。
- 任务规划者。
- 范围控制者。
- 质量复核者。
- 最终验收闸门。

Codex 可以：

- 创建任务说明。
- 定义允许读取和修改的文件。
- 定义禁止触碰的文件和动作。
- 复核 Gemini 的报告、代码、测试和建议。
- 决定任务是通过、驳回，还是需要 Mike 决策。
- 在必要时执行代码实现、测试、部署和生产验证。

### Gemini

Gemini 承担：

- 执行者。
- 调研者。
- 内容初稿作者。
- 低风险审计助手。

Gemini 可以：

- 读取被分配的任务文件。
- 读取任务明确允许的上下文文件。
- 只在任务允许的范围内写入指定报告。
- 提出后续建议。
- 在明确允许的情况下，向 `tasks/backlog/` 写入 `PROPOSED` 候选任务卡片。
- 在任务明确授予 `CODE_READ_SCOPED` 时，只读查看指定代码文件。
- 在任务明确授予 `CONTENT_WRITE_SCOPED` 时，只修改指定内容或配置文件。
- 在任务明确授予 `SANDBOX_VERIFY` 时，只运行指定的低风险验证命令或只读脚本。
- 仅在任务明确授予 `DB_READ_SANITIZED` 时读取限定数据库内容。

Gemini 不可以：

- 部署生产环境。
- 提交 Git。
- 修改 secrets 或 `.env*`。
- 触碰 WorkBuddy。
- 修改支付、认证、账单、数据库迁移、生产脚本，除非未来高信任任务明确允许。
- 自己标记自己的任务通过。
- 自行把候选任务从 `PROPOSED` 改成 `ASSIGNED`。
- 自行执行尚未被 Mike 或 Codex 激活的候选任务。
- 在未获得明确授权时读取或修改 `Code/**`。
- 读取用户、订单、提交、Webhook、API Key、认证、账单或支付数据，除非未来高信任任务明确允许。

### Mike

Mike 承担：

- 业务目标最终确认人。
- 外部账号操作人。
- 重大产品和商业决策人。
- 新 Agent 权限批准人。
- Codex 无法及时复核时的紧急人工复核兜底人。

Mike 负责：

- 确认团队目标。
- 提供 GSC、GA4、外部目录、生产后台等需要人工账号访问的数据。
- 决定是否启动外部推广、价格调整、重大功能方向或新增 Agent。
- 每周可投入 10 小时以上时，优先处理高价值确认、外部账号动作、内容发布和关键复核，而不是低价值数据搬运。
- 在 Codex 因上下文或 token 限制无法及时复核紧急任务时，可以临时复核 Gemini 输出；但该机制只作为兜底，不应常态化。

### Mike 待办唯一事实源

Mike 的手动工作安排统一记录在：

```text
ProjectDocs/Operations/user_action_tracker.md
```

Codex 和 Gemini 给 Mike 安排工作时，必须更新或引用该文件。Mike 问“我还有哪些工作要做”时，任一 Agent 都必须先读取该文件，再回答。

不允许长期只在聊天、日报、执行报告或复核报告中安排 Mike 待办而不同步到该文件。

## 2. 语言规则

从协议 0.3 起，AI-Team 内所有面向团队协作的材料默认使用中文。

必须中文的内容：

- 任务说明。
- Gemini 执行报告。
- Codex 复核报告。
- 目标、周计划、决策、指标、风险文档。
- 给 Gemini 的任务指令。

允许保留英文的内容：

- 文件名。
- URL。
- 路由。
- 代码字段。
- 状态枚举，例如 `REPORT_ONLY`、`REVIEW_PASSED`。
- 产品名、事件名、表名、字段名。
- 必要的英文标题或关键词。

如果报告需要引用英文原文，应使用短引用，并用中文解释其含义和判断。

## 3. 权限级别

### `FAST_TRACK`

轻量快速通道，仅适用于极低风险、可一眼验证的小修小补。

适用场景：

- 修正文档错别字。
- 修正文档里明显错误的路径、日期、状态或编号。
- 修正页面文案中的单个拼写错误或标点错误。
- 补充遗漏但无争议的内部链接或 sitemap URL，且不涉及代码逻辑变化。
- 调整 AI-Team 文档格式，不改变目标、权限和执行边界。

不适用场景：

- 任何生产部署。
- 任何 Git 提交。
- 任何认证、支付、账单、数据库、Webhook、安全相关变更。
- 任何 SEO title、description、canonical、结构化数据、正文内容的大幅调整。
- 已索引且处于观察冻结期的页面修改。
- 需要测试、构建、浏览器验证或用户确认才能判断对错的任务。

执行规则：

1. `FAST_TRACK` 必须由 Codex 明确授权。
2. Gemini 可以直接修改任务允许的极少数文件。
3. 仍然必须输出一份简短中文报告，说明改了什么、为什么低风险、是否需要后续复核。
4. Codex 可以用简短复核记录代替完整复核报告。
5. 如果执行中发现范围扩大，必须立即退出 `FAST_TRACK`，改走标准任务流程。

### `REPORT_ONLY`

默认权限级别。

Gemini 只能读取任务允许的文件，并写入指定执行报告。

禁止：

- 修改 `Code/**`。
- 修改生产脚本。
- 修改 `.env*`。
- 执行部署。
- 提交 Git。
- 访问数据库。

### `DB_READ_SANITIZED`

仅当任务明确授权时可用。

任务说明必须写明：

- 权限级别：`DB_READ_SANITIZED`。
- 允许的数据来源。
- 允许读取的表。
- 允许读取的字段。
- 允许使用的过滤条件。
- 禁止读取的数据类别。
- 报告中必须说明查询来源和读取范围。

默认允许场景：

- 审计 `posts` 表中的博客草稿。

默认禁止类别：

- users。
- orders。
- credits。
- billing。
- auth / account / session 数据。
- form submissions。
- webhook logs。
- webhook secrets / tokens。
- API keys。
- invite / referral 中包含个人信息的数据。
- 任务未明确列出的任何表或字段。

`DB_READ_SANITIZED` 规则：

1. 不得打印或复制 secrets、tokens、connection strings、cookies 或完整 `.env*` 内容。
2. 优先使用现有只读方法或后台界面。
3. 如需临时脚本，只能放在 `ProjectDocs/AI-Team/tmp/`，除非任务另有明确允许。
4. 不得在 `Code/**` 下创建临时脚本。
5. 不得把数据库结果写入代码文件。
6. 报告必须列出数据来源、读取表、读取字段、过滤条件，并确认没有输出 secrets。
7. 如果任务需要更高权限，Gemini 必须停止并请求 Mike/Codex 提供脱敏上下文。

### `CODE_READ_SCOPED`

代码只读权限，用于减少内容、SEO、配置和产品审计中的盲猜。

适用场景：

- 博客草稿需要核验某个产品能力是否真实存在。
- 模板页、用例页、solution 页审计需要查看对应静态配置。
- 埋点、FAQ、内链、CTA 审计需要理解现有字段名或组件输入。
- 检查某个脚本、测试或服务是否已经存在。

规则：

1. 任务必须逐条列出允许读取的具体代码文件，禁止使用泛目录授权，例如不得写 `Code/**`。
2. Gemini 只能读取文件，不得修改文件。
3. 报告必须列出读取的代码文件和基于代码得出的事实判断。
4. 如需读取额外代码，Gemini 必须在报告中写 `[REQUEST_READ: /absolute/path]`，等待 Mike 或 Codex 批准。
5. 默认禁止读取 `.env*`、认证、支付、账单、数据库迁移、生产部署脚本、secrets、tokens、cookies 和用户隐私数据相关文件。
6. 读取代码不等于可以引用所有实现细节对外宣传；对外内容只能写当前真实、稳定、用户可感知的能力。

### `CONTENT_WRITE_SCOPED`

内容或非核心配置写权限，用于让执行 Agent 直接交付低风险内容资产。

适用场景：

- 写入已批准的 Markdown 博客草稿。
- 写入静态 SEO 内容配置。
- 写入模板 FAQ、内链建议、CTA 文案等非核心配置。
- 写入 AI-Team 文档、报告、候选任务卡片。

规则：

1. 任务必须列出允许修改的具体文件或具体目录。
2. 只允许修改内容、文案、Markdown、JSON 配置或 AI-Team 文档。
3. 不允许修改业务逻辑、API、数据库、认证、支付、账单、生产部署脚本或测试基础设施。
4. 不允许提交 Git、不允许部署。
5. 修改后必须输出中文执行报告，并列出每个修改文件。
6. 内容写入后仍需 Codex 或 Mike 复核，才能发布到生产或进入 Git 提交。

### `SANDBOX_VERIFY`

低风险验证权限，用于运行只读检查或生成报告。

适用场景：

- 运行已存在的 SEO 验证脚本。
- 运行只读链接检查脚本。
- 运行不会写生产数据的静态检查。
- 在 `ProjectDocs/AI-Team/tmp/` 编写临时只读脚本，用于检查报告中的链接、slug 或结构化数据。

规则：

1. 任务必须列出允许运行的命令或脚本。
2. 临时脚本只能放在 `ProjectDocs/AI-Team/tmp/`。
3. 不得访问 secrets、数据库、外部账号、用户数据或生产后台。
4. 不得执行部署、提交 Git、安装依赖、删除文件或修改生产配置。
5. 输出必须写入报告，不得把验证结果写入业务代码。
6. 如果验证需要网络、浏览器、生产服务器、数据库或额外权限，必须停止并请求 Mike 或 Codex 批准。

### `ADMIN_DRAFT_WRITE`

后台草稿写入权限，用于让执行 Agent 将已经通过内容复核的博客、SEO 文章或资源内容写入 GenForms 后台草稿，减少 Mike 的机械复制工作。

适用场景：

- 博客内容已经通过 Codex 复核，结论为 `PASSED_READY_FOR_MIKE`、`PASSED_DRAFT_OR_DELAYED_PUBLISH` 或 Mike 明确口头批准。
- 文章只需要进入后台草稿箱，等待 Mike 人工点击发布。
- 后台写入动作不涉及生产发布、部署、Git 提交或敏感数据读取。

允许动作：

- 创建新的后台博客草稿。
- 更新自己本次创建的草稿。
- 写入 slug、title、description、excerpt、tags、category、locale、body、canonical path 等内容字段。
- 在执行报告中记录草稿 slug、后台路径、预期公网 URL 和待 Mike 发布动作。

禁止动作：

1. 禁止直接发布文章。
2. 禁止把草稿状态改成 published。
3. 禁止修改已发布文章，除非任务明确列出文章 UUID/slug 且 Codex 或 Mike 批准。
4. 禁止删除文章。
5. 禁止读取或输出 secrets、API key、cookies、session、用户、订单、支付、提交数据。
6. 禁止修改代码、部署、提交 Git。
7. 禁止批量写入低质量、未复核或同质化内容。

执行规则：

1. 任务必须明确写 `permission_level: ADMIN_DRAFT_WRITE`。
2. 任务必须列出允许写入的文章 slug。
3. 任务必须引用已经通过复核的内容 payload 文件。
4. Gemini 写入后台后，必须把对应 Mike 发布动作同步到 `ProjectDocs/Operations/user_action_tracker.md`，或在无权限时写入“建议更新 Mike 待办看板”。
5. Mike 点击发布前，仍需在后台预览标题、正文、发布日期、内链和 SEO 字段。
6. 如果后台 API 或数据库写入需要密钥，应由 Mike/Codex 提供受限接口或临时安全方式，不允许 Gemini 自行读取 `.env*`。

## 4. 任务状态

```text
PROPOSED -> DRAFT -> ASSIGNED -> IN_PROGRESS -> SUBMITTED -> REVIEW_PASSED -> READY_TO_COMMIT
                                          -> REVIEW_REJECTED
                                          -> NEEDS_HUMAN_INPUT
```

状态含义：

- `PROPOSED`：候选任务，仅代表发现了可能值得做的工作；不能执行。
- `DRAFT`：Codex 正在准备任务。
- `ASSIGNED`：Gemini 可以开始。
- `IN_PROGRESS`：Gemini 已开始。
- `SUBMITTED`：Gemini 已写入报告。
- `REVIEW_PASSED`：Codex 复核通过。
- `READY_TO_COMMIT`：Codex 确认可以纳入提交。
- `REVIEW_REJECTED`：Codex 发现问题，需要返工。
- `NEEDS_HUMAN_INPUT`：需要 Mike 决策或补充外部数据。

## 4.1 Backlog 候选任务规则

为提高团队吞吐，Gemini 可以在执行报告中发现系统 Gap，并在获得任务授权或 Mike 明确要求时生成候选任务卡片。

候选任务位置：

```text
ProjectDocs/AI-Team/tasks/backlog/
```

候选任务模板：

```text
ProjectDocs/AI-Team/templates/proposed-task-card.md
```

候选任务规则：

1. 候选任务状态必须是 `PROPOSED`。
2. 候选任务 ID 必须使用临时编号，例如 `PROPOSED-2026-006-001`，不得占用正式 `AI-TASK` 编号。
3. Gemini 可以提出任务，但不能激活任务。
4. Gemini 不能执行自己刚提出但未激活的候选任务。
5. 候选任务必须写明建议读取范围、建议修改范围、禁止触碰范围、风险等级和激活条件。
6. Mike 或 Codex 审阅后，才能把候选任务复制或改写为 `tasks/active/AI-TASK-...md` 并标记 `ASSIGNED`。
7. Codex token 受限时，Mike 可以临时激活低风险 `REPORT_ONLY`、文档型、内容审计型任务，但不得激活高风险代码、部署、数据库、认证、支付、secrets、账单或生产脚本任务。
8. Mike 临时激活或复核任务后，应在任务或决策记录中留下说明；Codex 恢复后补充复核或确认记录。
9. 候选任务数量不是目标，候选任务必须服务当前 `ACTIVE` 目标和周计划。

## 5. 任务说明 必填项

每个任务说明必须包含：

- task_id。
- status。
- assignee。
- reviewer。
- priority。
- permission_level。
- code_modification_allowed。
- goal。
- context。
- files_to_read。
- allowed_files_to_modify。
- forbidden_files。
- execution_steps。
- validation_requirements。
- report_path。
- acceptance_criteria。
- dependencies，如有。
- observation_pages，如有。

`FAST_TRACK` 任务可以使用简化任务说明，但仍必须包含：

- task_id。
- permission_level: FAST_TRACK。
- 允许修改的文件。
- 禁止触碰的文件和动作。
- 预期修改内容。
- 简短报告路径。

如果 `code_modification_allowed: false`，任务正文必须明确写出：

```text
禁止修改代码。禁止部署。禁止提交 Git。
```

如果任务授予 `CODE_READ_SCOPED`，任务正文必须明确写出：

```text
允许只读查看下列代码文件，不允许修改代码；如需读取额外代码，必须使用 [REQUEST_READ: path] 申请。
```

如果任务授予 `CONTENT_WRITE_SCOPED`，任务正文必须明确写出：

```text
只允许修改下列内容或配置文件；禁止修改业务逻辑、认证、支付、数据库、生产脚本；禁止部署和提交 Git。
```

如果任务授予 `SANDBOX_VERIFY`，任务正文必须明确写出：

```text
只允许运行下列验证命令或只读脚本；禁止访问 secrets、数据库、外部账号和生产后台；禁止部署和提交 Git。
```

如果任务授予 `ADMIN_DRAFT_WRITE`，任务正文必须明确写出：

```text
只允许将已通过复核的内容写入后台草稿；禁止发布、禁止修改已发布文章、禁止删除文章、禁止读取 secrets 或用户/订单/支付/提交数据；发布必须由 Mike 人工完成。
```

## 6. Gemini 执行报告必填项

Gemini 的执行报告必须使用中文，并包含：

- 任务 ID。
- 执行状态。
- 读取的文件。
- 修改的文件。
- 数据库读取情况。
- 实际完成的工作。
- 执行的命令。
- 验证结果。
- 风险与不确定点。
- 后续建议。

`修改的文件` 必须列出：

- 本次执行报告自身路径。
- 任务允许范围内创建或修改的任何文件。
- `ProjectDocs/AI-Team/tmp/` 下创建的任何临时脚本。

只有在任务完全没有写入任何文件时，才可以写 `none`。

## 7. Codex 复核报告必填项

Codex 的复核报告必须使用中文，并包含：

- 任务 ID。
- 复核结论：通过、驳回、需要人工输入。
- 范围检查。
- 质量检查。
- 验证检查。
- 问题归因。
- 能力提升建议。
- 发现的问题。
- 需要返工的内容。
- 最终状态。

问题归因必须参考：

```text
ProjectDocs/AI-Team/operations/gemini-output-quality-diagnostics.md
```

Codex 不应把所有问题都笼统归为“Gemini 质量差”。复核时应区分：

- 权限不足。
- 上下文不同步。
- 知识过期或外部规则未知。
- 推理 / 判断错误。
- 任务验收不清。
- 输出格式不适合执行。

如果问题来自权限或上下文，Codex 应优先改进任务输入；如果问题来自判断或格式，Codex 应明确返工标准。

## 8. 安全规则

1. 不得在任务文件或报告中写入 secrets。
2. 不得要求执行 Agent 打印生产 secrets。
3. 不得写入 API key、OAuth token、SSH token、cookies 或数据库连接串。
4. 不允许两个 Agent 同时修改同一个文件。
5. 未经试点证明可靠前，不给 Gemini 分配高风险代码任务。
6. 未经 Codex 复核，不允许发布或部署执行 Agent 的产出。
7. SEO 和内容任务必须遵守 `ProjectDocs/Operations/google_seo_quality_rules.md`。
8. 需要数据库内容时必须使用 `DB_READ_SANITIZED`，不得口头授权绕过。
9. Mike 临时复核不能绕过生产安全规则；涉及部署、支付、认证、数据库、secrets 的任务仍需 Codex 后续补充复核。
10. 放宽 Gemini 权限时优先放宽 `CODE_READ_SCOPED`，谨慎试点 `CONTENT_WRITE_SCOPED`，高风险代码写入仍不开放。
11. `ADMIN_DRAFT_WRITE` 只允许写入后台草稿，不属于生产发布权限；任何发布动作仍必须由 Mike 人工确认。

## 9. SEO 观察冻结规则

对已索引、接近第一页或刚刚优化过的页面，任务说明 应写入 `observation_pages`。

观察页规则：

- 不频繁修改 title、description、正文、FAQ 和 canonical。
- 小改后至少观察 3-7 天。
- 除非发现生产 bug 或 SEO 技术错误，否则不要连续多次改同一个页面。
- 报告中如果建议修改观察页，必须说明为什么值得打破观察期。

## 10. 任务依赖规则

如果任务依赖其他任务，应在 说明 中写：

```text
dependencies:
- AI-TASK-xxxx
```

Gemini 在执行前应检查依赖任务是否已经 `REVIEW_PASSED`。

如果依赖任务未通过，Gemini 应停止并在报告中说明阻塞，不应自行跳过依赖。

## 11. 给 Gemini 的标准交接话术

```text
请先读取 /Users/mike/Documents/AIFactory/ProjectDocs/AI-Team/GEMINI_START_HERE.md。
然后读取指定任务文件。
请用中文执行并输出中文报告。
只能执行任务文件允许的范围。
如果任务包含 DB_READ_SANITIZED，只能读取任务允许的表、字段和过滤条件，禁止读取用户、订单、提交、Webhook、密钥等数据。
执行报告必须写到任务文件指定的 report_path。
不要提交、不要部署、不要输出 secrets。
```

## 12. 数据中继能力原则

长期看，Mike 不应一直承担 GSC 和 GA4 数据搬运工作。团队可以规划一个只读、脱敏、受限的数据中继能力，但在实现前必须满足：

- 只读。
- 只输出聚合数据，不输出用户级数据。
- 不暴露 OAuth token、API key、cookies 或账号凭证。
- 只允许读取已批准的数据源，例如 GSC 查询词/页面汇总、GA4 事件汇总。
- 所有访问有日志。
- 只能服务 Data Agent 或 Codex 的分析任务。
- 首版必须先以本地脚本或只读服务验证，不直接开放给所有 Agent。

该能力在未完成安全设计和 Mike 批准前，不得实施。
