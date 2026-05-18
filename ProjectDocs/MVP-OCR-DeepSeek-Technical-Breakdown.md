# MVP OCR + DeepSeek 技术拆解

更新时间：2026-05-09

## 目的

这份文档用于把“将 OCR 识别与 DeepSeek 大模型接入纳入第一阶段 MVP”进一步拆成可开发的技术设计。

它回答的是：

- 需要新增哪些能力层
- 会影响哪些现有文件
- 数据库需要增加什么字段
- API 会怎样变化
- 哪些部分优先做，哪些可以后做

## 总体设计原则

这次新增两项能力：

1. OCR 识别
2. DeepSeek 大模型接入

但它们不应该直接硬塞进现有代码，而应遵循两个原则：

### 1. OCR 独立成服务层

不要把 OCR 逻辑散落在：

- API Route
- `form-runtime`
- `workflow`

更合理的是抽象为：

- `OCR Provider`
- `OCR Service`
- `OCR Result Persistence`

### 2. DeepSeek 通过模型提供方抽象接入

不要把现有表单生成器从 `OpenAI` 直接改成 `DeepSeek` 硬编码。

更合理的是抽象为：

- `LLM Provider Adapter`
  - `OpenAI`
  - `DeepSeek`

后续表单生成、OCR 结果结构化都走统一出口。

## 当前代码里的切入点

### 1. 表单生成

当前入口在：

- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)

当前现状：

- 已经使用 `generateText`
- 当前 provider 直接绑定 `@ai-sdk/openai`
- 缺少统一 provider 抽象

### 2. 提交流程

当前入口在：

- [Code/services/form-runtime.ts](/Users/mike/Documents/AIFactory/Code/services/form-runtime.ts)

当前现状：

- 提交时只做校验、扣费、写入 submission、触发 workflow skeleton
- 没有文件上传后续处理
- 没有 OCR 状态与 OCR 结果

### 3. 数据表

当前表结构在：

- [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)

当前现状：

- `forms`
- `form_submissions`
- `workflow_runs`
- `webhook_logs`

已经存在，但没有单独的 OCR 结果表，也没有模型 provider 配置。

## 建议新增的数据结构

### A. `forms` 表

建议新增：

- `llm_provider VARCHAR(50) NOT NULL DEFAULT 'openai'`
- `llm_model VARCHAR(100) NOT NULL DEFAULT ''`

作用：

- 指定当前表单生成默认使用哪个模型提供方
- 为后续模型切换留出口

### B. `form_submissions` 表

建议新增：

- `ocr_status VARCHAR(50) NOT NULL DEFAULT 'pending'`
- `ocr_result_json JSONB NOT NULL DEFAULT '{}'::jsonb`
- `ocr_error_message TEXT NOT NULL DEFAULT ''`

作用：

- 让提交记录能直接反映 OCR 状态
- 保存 OCR 结构化结果

### C. 可选新表：`ocr_runs`

如果想把 OCR 做得更清楚，建议新增：

- `ocr_runs`
  - `uuid`
  - `submission_uuid`
  - `provider`
  - `status`
  - `input_files_json`
  - `raw_result_json`
  - `structured_result_json`
  - `error_message`
  - `created_at`
  - `finished_at`

第一阶段如果想控制复杂度，也可以先不单独建表，而先挂在 `form_submissions` 上。

建议：

- 第一阶段先走 `form_submissions` 挂 OCR 状态和结果
- 第二阶段再决定是否独立出 `ocr_runs`

## 建议新增的服务层

### 1. 模型提供方抽象

建议新增：

- `Code/services/llm/provider.ts`
- `Code/services/llm/openai-provider.ts`
- `Code/services/llm/deepseek-provider.ts`

职责：

- 统一暴露文本生成方法
- 隔离 OpenAI / DeepSeek 差异

建议接口形态：

```ts
interface LlmProvider {
  generateJson<T>(params: {
    prompt: string;
    schema?: unknown;
    model?: string;
  }): Promise<T>;
}
```

### 2. OCR 服务

建议新增：

- `Code/services/ocr/index.ts`
- `Code/services/ocr/provider.ts`
- `Code/services/ocr/mock-provider.ts`
- `Code/services/ocr/deepseek-ocr-formatter.ts`

职责：

- 接收文件元数据或后续文件 URL
- 调用 OCR 提供方
- 输出：
  - 原始 OCR 结果
  - 结构化 OCR 结果

### 3. 文件处理层

建议新增：

- `Code/services/upload.ts`
  或
- `Code/lib/storage.ts` 的明确表单文件入口封装

职责：

- 把分享页上传的文件真正落存储
- 返回可用于 OCR 的文件 URL / object key

当前第一阶段要注意：

现有提交流程只记录文件名和元数据，还没有真实上传存储链路。

所以要做 OCR，必须先补：

- 文件实际存储
- 文件地址可用

## API 设计建议

### 1. 保持现有接口不拆

继续保留：

- `POST /api/forms/generate`
- `POST /api/forms/:id/submit`

但扩展它们的内部逻辑。

### 2. `POST /api/forms/generate`

建议请求增加可选字段：

```json
{
  "prompt": "生成一个票据识别表单",
  "theme": "business",
  "provider": "deepseek",
  "model": "deepseek-chat"
}
```

### 3. `POST /api/forms/:id/submit`

保持当前接口结构：

```json
{
  "answers": {},
  "files": []
}
```

但服务端改成：

1. 写 submission
2. 若包含可 OCR 文件字段
3. 执行 OCR
4. 更新 submission 中的 `ocr_status / ocr_result_json`
5. Webhook payload 可包含 OCR 结果

### 4. 可选新增接口

建议新增：

- `GET /api/forms/:id/submissions/:submissionId/ocr`

用于详情页或日志页单独查看 OCR 结果。

第一阶段如果不想扩 API，也可以直接在 submissions 列表页里带出 OCR 状态。

## DeepSeek 接入建议

### 建议方式

第一阶段不要写成“只接 DeepSeek”。

建议写成：

- `DEFAULT_LLM_PROVIDER=deepseek`
- 同时保留 `openai`

这样更稳。

### 环境变量建议

建议新增：

- `DEFAULT_LLM_PROVIDER=deepseek`
- `DEEPSEEK_API_KEY=`
- `DEEPSEEK_BASE_URL=`
- `DEEPSEEK_MODEL=deepseek-chat`

如果 OCR 结构化也走模型：

- `DEEPSEEK_OCR_STRUCT_MODEL=deepseek-chat`

## OCR 在第一阶段的建议边界

建议第一阶段 OCR 只做：

### 做

- 发票 / 票据图片 OCR
- PDF 文本提取
- 基于大模型做简单结构化
- 提交记录中展示 OCR 状态

### 不做

- 多页复杂文档工作流
- 高级表格识别
- 图片去重
- 报表自动生成
- OCR 可视化规则编排

## 风险与应对

### 1. 文件上传链路当前不完整

风险：

- 目前只是记录元数据，没有真实文件可供 OCR

应对：

- OCR 开工前先补真实上传存储

### 2. DeepSeek / OpenAI 接入方式未来可能变化

风险：

- 如果直接硬编码，后续替换成本高

应对：

- 必须先做 provider abstraction

### 3. OCR 结果不稳定

风险：

- OCR 识别成功率和结构化质量不稳定

应对：

- 保存 `raw_result_json`
- `structured_result_json`
- 失败信息

避免只能看到最终失败，没有中间信息

## 推荐实施顺序

建议按这个顺序开发：

1. 模型提供方抽象层
2. DeepSeek provider 接入
3. 表单生成切到 provider abstraction
4. 文件真实上传存储
5. OCR 服务层
6. 提交流程接 OCR
7. OCR 状态与结果展示
8. Webhook payload 扩展 OCR 结果

## 一句话总结

把 `OCR + DeepSeek` 纳入第一阶段后，真正要做的不是“在现有代码里塞两个点功能”，而是：

**补齐模型抽象、文件存储、OCR 服务和提交结果扩展，让它们成为可持续演进的 MVP 基础能力。**
