# MVP OCR + DeepSeek 开发顺序清单

更新时间：2026-05-09

## 目标

这份文档用于把 `OCR + DeepSeek` 相关开发真正拆成首批可执行顺序。

它不是泛泛路线图，而是回答：

- 第一轮先改哪些文件
- 哪些是前置依赖
- 哪些能并行
- 哪些必须后做

## 总体顺序

建议分 5 批完成。

---

## 第一批：模型抽象层

### 目标

先把 AI 表单生成从“写死 OpenAI”切到“可切换 provider”。

### 需要新增/修改

新增：

- `Code/services/llm/provider.ts`
- `Code/services/llm/openai-provider.ts`
- `Code/services/llm/deepseek-provider.ts`

修改：

- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)
- [Code/.env.example](/Users/mike/Documents/AIFactory/Code/.env.example)

### 输出结果

- 表单生成支持 `OpenAI / DeepSeek`
- provider 可配置

### 验收

- OpenAI 可继续生成
- 切到 DeepSeek 后也可生成
- 无 key 时 fallback 仍可用

---

## 第二批：数据库与数据模型扩展

### 目标

为 OCR 和 provider 配置补齐数据结构。

### 需要修改

- [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
- [Code/types/form.d.ts](/Users/mike/Documents/AIFactory/Code/types/form.d.ts)
- 表单与提交相关 model 文件

### 建议新增字段

`forms`

- `llm_provider`
- `llm_model`

`form_submissions`

- `ocr_status`
- `ocr_result_json`
- `ocr_error_message`

### 输出结果

- 新表单和提交记录可承载 OCR/LLM 信息

### 验收

- SQL 可执行
- Type 与 model 层无报错

---

## 第三批：文件真实上传链路

### 目标

让文件字段不再只记录元数据，而能被 OCR 真正使用。

### 需要新增/修改

建议涉及：

- `Code/lib/storage.ts`
- 新增表单文件上传服务
- [Code/services/form-runtime.ts](/Users/mike/Documents/AIFactory/Code/services/form-runtime.ts)
- 提交接口 route

### 输出结果

- 分享页文件上传可落真实存储
- 返回文件 URL / object key
- 提交记录中可追踪上传结果

### 验收

- 上传图片/PDF后，后台能拿到可访问文件信息

---

## 第四批：OCR 服务层接入

### 目标

完成 OCR 调用链与结果存储。

### 需要新增/修改

新增：

- `Code/services/ocr/index.ts`
- `Code/services/ocr/provider.ts`
- `Code/services/ocr/mock-provider.ts`
- `Code/services/ocr/formatter.ts`

修改：

- [Code/services/form-runtime.ts](/Users/mike/Documents/AIFactory/Code/services/form-runtime.ts)
- 提交相关类型与 model

### 输出结果

- 有 OCR 文件时，提交后自动执行 OCR
- `ocr_status`
- `ocr_result_json`
- `ocr_error_message`

能写回 submission

### 验收

- 成功场景：OCR 状态为 `completed`
- 失败场景：OCR 状态为 `failed`
- 数据库中能看到原始 / 结构化结果

---

## 第五批：页面展示与 Webhook 扩展

### 目标

让用户能看到 OCR 结果，并把 OCR 结果带进 Webhook。

### 需要新增/修改

页面：

- `Code/app/[locale]/(default)/(console)/forms/[id]/submissions/page.tsx`
- 必要时新增 OCR 详情查看区

服务：

- [Code/services/skills/webhook.ts](/Users/mike/Documents/AIFactory/Code/services/skills/webhook.ts)

文案：

- `Code/i18n/messages/zh.json`
- `Code/i18n/messages/en.json`

文档：

- [ProjectDocs/API.md](/Users/mike/Documents/AIFactory/ProjectDocs/API.md)

### 输出结果

- 提交记录页可看到 OCR 状态
- 必要时可查看 OCR 结果摘要
- Webhook payload 可带 OCR 结构化结果

### 验收

- 提交后前台/后台可见 OCR 状态
- Webhook 接收端能收到 OCR 结果字段

## 建议优先级

### 必须先做

1. 模型抽象层
2. 数据库扩展
3. 文件真实上传

### 然后做

4. OCR 服务层
5. 页面展示与 Webhook 扩展

## 不建议现在混进来的事情

在做这五批时，不建议顺便做：

- Workflow 可视化编排
- 更多 Skill 平台化
- OCR 复杂规则引擎
- 页面大规模视觉重做

原因：

- 容易把第一阶段主链路做散
- 也不利于排查 OCR / LLM 接入问题

## 推荐测试策略

### 单元测试

需要补：

- provider abstraction 测试
- DeepSeek provider mock 测试
- OCR 成功/失败测试
- 文件上传成功/失败测试
- 表单提交包含 OCR 的集成测试

### 手动测试

建议至少测 4 条链路：

1. OpenAI 生成表单
2. DeepSeek 生成表单
3. 上传票据并 OCR 成功
4. OCR 失败但表单提交仍有日志留痕

## 一句话建议

如果真正要开始做，最稳的开工方式不是直接冲 OCR 页面，而是：

**先抽模型层，再补文件上传，再接 OCR。**
