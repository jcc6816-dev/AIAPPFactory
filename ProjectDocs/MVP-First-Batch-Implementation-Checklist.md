# V1.2 MVP 首批代码实施清单

本文档是 [MVP-Minimal-Loop-Implementation-Plan.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Minimal-Loop-Implementation-Plan.md) 的进一步拆解版本，用于把第一轮开发工作压缩成可直接执行的首批任务包。

更新时间：2026-05-08

## 0. 目标

首批实施不追求一次做完全部 MVP，而是先完成最小可跑骨架：

- 表单数据模型
- 表单 CRUD API
- AI 生成表单 API
- 控制台表单列表页
- 控制台 AI 生成表单页
- 分享表单页骨架

完成这一批后，系统至少应具备：

- 登录用户可以生成并保存一个表单草稿
- 控制台可以看到表单列表
- 可以进入表单详情页查看 schema
- 可以生成一个分享链接占位页

这一步还不要求：

- 真正提交表单
- 真正跑 Workflow
- 真正扣减 Credits
- 真正执行 OCR / Excel / Webhook

这些属于第二批及之后的工作。

## 1. 首批范围

## 1.1 本批必须完成

- 新增 `forms` 主表
- 新增表单类型定义
- 新增表单 model
- 新增表单 service
- 新增 AI 生成表单 service
- 新增 4 个核心 API
  - `POST /api/forms/generate`
  - `POST /api/forms`
  - `GET /api/forms`
  - `GET /api/forms/:id`
- 新增 3 个前台页面
  - 控制台表单列表
  - 控制台 AI 生成页
  - 控制台表单详情页
- 新增 2 个组件
  - `form-generator`
  - `form-editor`
- 调整控制台导航，加入 `Forms`

## 1.2 本批明确不做

- `form_submissions`
- `workflow_runs`
- `webhook_logs`
- `usage_ledger`
- 文件上传
- 分享页真实提交
- Webhook 测试
- 计费扣减

## 2. 实施顺序

## 2.1 第一步：数据结构与基础类型

### 需要修改 / 新增的文件

- [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
- [Code/types/form.ts](/Users/mike/Documents/AIFactory/Code/types/form.ts)
- [Code/models/form.ts](/Users/mike/Documents/AIFactory/Code/models/form.ts)

### 目标

先把“表单”作为新领域对象正式引入工程。

### 建议表结构

- `forms`
  - `id`
  - `uuid`
  - `user_uuid`
  - `title`
  - `description`
  - `theme`
  - `schema_json`
  - `status`
  - `share_code`
  - `created_at`
  - `updated_at`

### `Code/types/form.ts` 最少需要定义

- `FormTheme`
- `FormFieldType`
- `FormFieldSchema`
- `FormSchema`
- `FormRecord`
- `CreateFormPayload`
- `GenerateFormPayload`

### 验收点

- `forms` 表结构可表达 MVP 表单草稿
- TypeScript 类型足够支撑 API 与页面

## 2.2 第二步：模型与服务层

### 需要新增的文件

- [Code/services/form.ts](/Users/mike/Documents/AIFactory/Code/services/form.ts)
- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)

### 目标

把数据访问和业务逻辑从 Route Handler 中抽离，保持现有工程风格一致。

### `services/form.ts` 最少包含

- `createForm`
- `getFormByUuid`
- `listFormsByUser`
- `updateFormDraft`

### `services/form-generator.ts` 最少包含

- `generateFormSchemaFromPrompt`
- `normalizeGeneratedSchema`

### 生成策略建议

首批不要追求复杂推理。

可以采用：

- `prompt -> AI 返回 JSON`
- 再用本地 `zod` 校验并归一化
- 失败时回退到一个简单默认表单模板

### 验收点

- 不论 AI 返回质量如何，服务层都能输出合法 `FormSchema`
- `form.ts` 不直接依赖页面组件

## 2.3 第三步：首批 API

### 需要新增的文件

- [Code/app/api/forms/generate/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/generate/route.ts)
- [Code/app/api/forms/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/route.ts)
- [Code/app/api/forms/[id]/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/route.ts)

### API 范围

#### `POST /api/forms/generate`

- 输入：`prompt`, `theme`
- 输出：生成后的 `title`, `description`, `schema`

#### `POST /api/forms`

- 输入：表单标题、描述、主题、schema
- 输出：已保存表单记录

#### `GET /api/forms`

- 输出：当前登录用户的表单列表

#### `GET /api/forms/:id`

- 输出：单个表单详情

### 认证约束

- 控制台 API 默认要求登录
- 分享侧暂不接入到首批 API

### 验收点

- Postman / curl 可完成生成、保存、读取列表、读取详情
- 未登录访问能返回明确错误
- 参数错误时返回明确错误

## 2.4 第四步：控制台页面

### 需要新增的页面

- [Code/app/[locale]/(default)/(console)/forms/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/page.tsx)
- [Code/app/[locale]/(default)/(console)/forms/new/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/new/page.tsx)
- [Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx)

### 需要新增的组件

- [Code/components/forms/form-generator.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx)
- [Code/components/forms/form-editor.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-editor.tsx)

### 需要修改的现有文件

- [Code/components/console/sidebar/nav.tsx](/Users/mike/Documents/AIFactory/Code/components/console/sidebar/nav.tsx)

### 页面职责

#### `forms/page.tsx`

- 展示当前用户所有表单
- 支持跳转到新建页和详情页

#### `forms/new/page.tsx`

- 输入一句话需求
- 调用 `/api/forms/generate`
- 预览 schema
- 保存成表单草稿

#### `forms/[id]/page.tsx`

- 展示表单基础信息
- 展示 schema JSON 或基础字段预览
- 生成分享链接占位信息

### 验收点

- 控制台侧边栏出现 `Forms`
- 可以在浏览器中完整走通“生成 -> 保存 -> 列表可见 -> 详情可见”

## 2.5 第五步：分享页骨架

### 需要新增的文件

- [Code/app/[locale]/f/[shareCode]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/f/[shareCode]/page.tsx)

### 目标

先提供一个可访问的分享页骨架，不在本批接入真正提交能力。

### 页面至少展示

- 表单标题
- 表单描述
- 字段列表预览
- “提交能力将在下一批接入”的占位提示

### 验收点

- 发布后的 `share_code` 可拼出真实页面地址
- 用户访问链接不会 404

## 3. 文件级任务清单

## 3.1 新增文件

- [Code/types/form.ts](/Users/mike/Documents/AIFactory/Code/types/form.ts)
- [Code/models/form.ts](/Users/mike/Documents/AIFactory/Code/models/form.ts)
- [Code/services/form.ts](/Users/mike/Documents/AIFactory/Code/services/form.ts)
- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)
- [Code/app/api/forms/generate/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/generate/route.ts)
- [Code/app/api/forms/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/route.ts)
- [Code/app/api/forms/[id]/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/[id]/route.ts)
- [Code/app/[locale]/(default)/(console)/forms/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/page.tsx)
- [Code/app/[locale]/(default)/(console)/forms/new/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/new/page.tsx)
- [Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/(console)/forms/[id]/page.tsx)
- [Code/app/[locale]/f/[shareCode]/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/f/[shareCode]/page.tsx)
- [Code/components/forms/form-generator.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx)
- [Code/components/forms/form-editor.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-editor.tsx)

## 3.2 修改文件

- [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
- [Code/components/console/sidebar/nav.tsx](/Users/mike/Documents/AIFactory/Code/components/console/sidebar/nav.tsx)
- [ProjectDocs/API.md](/Users/mike/Documents/AIFactory/ProjectDocs/API.md)

## 4. 首批测试要求

## API 测试

- `POST /api/forms/generate`
  - 正常返回 schema
  - 空 prompt 返回校验错误
  - AI 调用失败时走默认模板或错误兜底
- `POST /api/forms`
  - 正常保存
  - schema 非法时报错
- `GET /api/forms`
  - 登录用户能看到自己的列表
  - 未登录返回 401
- `GET /api/forms/:id`
  - 记录存在时返回详情
  - 非本人数据不可读

## 页面手测

1. 登录控制台。
2. 进入 `Forms`。
3. 点击新建。
4. 输入一句话需求并生成。
5. 保存表单草稿。
6. 返回列表检查是否出现新记录。
7. 进入详情页检查 schema 是否正确展示。
8. 打开分享页链接检查是否可访问。

## 5. 首批风险

- 风险：当前工程还没有现成的 `forms` 导航语义。
  应对：首批只在 console 侧加入最小导航入口，不同时改 admin 信息架构。

- 风险：AI 生成表单结果可能不稳定。
  应对：首批把成功标准降到“能生成可编辑草稿”，不要求一步到位可直接发布。

- 风险：现有数据层是 Supabase 直连，不是规范 ORM。
  应对：先让 `models/form.ts` 成为统一访问入口，后续再决定是否迁移。

## 6. 首批完成标准

满足以下条件即可认为首批开发完成：

- 控制台出现 `Forms` 入口
- 用户能通过一句话生成一个表单草稿
- 草稿可以保存到数据库
- 列表页能显示已创建表单
- 详情页能展示 schema
- 分享页骨架可访问
