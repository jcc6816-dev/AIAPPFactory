# Form Artifact 集成实施计划

## 目标

把当前“生成表单”的能力进一步整理成清晰、可控、可保存、可发布的 Form Artifact 生命周期。

本计划服务当前 MVP：AI 表单生成与数据收集系统。实施时不引入工作流编排、OCR、MCP、多租户、复杂审批和可视化拖拽编辑器。

## 一句话定义

Form Artifact 是 AI FormFactory 的核心创作对象：

```ts
FormArtifact = {
  schema,
  visualSettings,
  generationMetadata,
  versionHistory,
  publishState
}
```

## 当前已有基础

当前代码已经具备较好的基础：

- AI 生成表单 schema
- 模板库和模板详情页
- Theme / Visual FX / Visual Direction
- Phone/Desktop 预览
- Step Flow/Long Form 预览
- Demo Mode
- 表单保存、发布、分享、提交、Webhook、数据面板等 MVP 能力
- Playwright e2e 覆盖部分核心流程

因此下一步不是重做，而是把这些能力统一到 Form Artifact 生命周期里。

## 阶段一：明确 Form Artifact 数据结构

### 目标

让 schema、视觉配置、生成来源和发布状态有统一表达。

### 建议改动

在现有 `FormSchema` / `GeneratedFormDraft` 基础上，补强以下概念：

- `artifactId`：表单资产 ID，可沿用表单 uuid。
- `artifactVersion`：当前版本号，如 `1`、`2`。
- `sourcePrompt`：最初生成 prompt。
- `clarificationAnswers`：生成前的澄清问答。
- `visualDirection`：视觉方向。
- `themeVariant`：视觉效果。
- `preferredDevice`：默认设备预览。
- `layout`：`single` 或 `long`。
- `status`：`draft`、`published`、`archived`。

### 涉及文件

- `Code/types/form.d.ts`
- `Code/services/form-generator.ts`
- `Code/services/form.ts`
- `Code/app/api/forms/generate/route.ts`
- `Code/app/api/forms/route.ts`

### 验收标准

- AI 生成结果能完整保留视觉方向和视觉效果。
- 从模板创建表单后也能保留视觉配置。
- 保存后的表单再次打开，预览状态不丢失。

## 阶段二：建立轻量版本历史

### 目标

记录 Form Artifact 的关键变更，为回滚、审计和后续 AI 优化做准备。

### 建议事件类型

- `generated`
- `template_applied`
- `visual_changed`
- `schema_edited`
- `draft_saved`
- `published`
- `unpublished`

### 最小实现方式

MVP 阶段可以先做轻量表结构或 JSON 字段，不急着做复杂版本管理。

建议优先记录：

- 时间
- 操作类型
- 操作者
- prompt 或变更摘要
- 变更前后的关键字段快照

### 涉及文件

- `Code/services/form.ts`
- `Code/app/api/forms/[id]/route.ts`
- `Code/app/api/forms/[id]/publish-agent/route.ts`
- 后续数据库迁移文件或开发数据存储文件

### 验收标准

- 每次保存草稿产生一条可读历史。
- 每次发布产生一条发布历史。
- 历史记录不暴露敏感信息和 Webhook token。

## 阶段三：把创建页整理成 Artifact 创作工作台

### 目标

把创建页从“生成入口”升级为“Form Artifact 创作台”。

### 页面结构建议

左侧：

- Prompt 输入
- 澄清问答
- 模板推荐
- AI 生成过程

右侧：

- Artifact 预览
- Phone/Desktop
- Step Flow/Long Form
- Theme
- Direction
- Visual FX
- Demo Mode

底部或顶部操作区：

- Save Draft
- Publish
- Share Preview

### 涉及文件

- `Code/components/forms/form-generator.tsx`
- `Code/components/forms/form-creation-manager.tsx`
- `Code/components/forms/form-preview-panel.tsx`

### 验收标准

- 未生成表单前也可选择视觉偏好。
- 生成后偏好写入 schema。
- 保存草稿后重新打开不丢失。
- Demo Mode 与真实预览一致。

## 阶段四：模板详情页变成 Artifact 预览转化页

### 目标

让模板详情页不仅展示模板，还能让游客体验 Form Artifact 的可控性，从而提升注册和使用意愿。

### 建议能力

- Phone/Desktop
- Step Flow/Long Form
- Theme
- Direction
- Visual FX
- Use This Template

### 已完成方向

当前已经把 Theme / Direction / Visual FX 加入模板详情页预览区，并改为紧凑下拉布局。

### 后续增强

- 记录游客在模板详情页选择的视觉方向。
- 点击 Use This Template 时，把选择带入创建页。
- 为每个模板页面生成更明确的 SEO metadata。

### 涉及文件

- `Code/components/templates/interactive-detail-preview.tsx`
- `Code/app/[locale]/(default)/templates/[templateId]/page.tsx`
- `Code/services/form-templates.ts`

### 验收标准

- 详情页预览控制不换行、不遮挡。
- Use This Template 能带入当前视觉选择。
- 模板详情页首屏能清楚表达模板价值。

## 阶段五：发布前检查

### 目标

让用户从创作态进入发布态时，有一个清晰、可信的检查流程。

### 建议检查项

- 表单标题是否为空
- 是否至少有一个字段
- required 字段是否有 label
- select/radio 是否有 options
- Webhook 是否配置正确
- 当前发布版本是否与草稿一致

### 涉及文件

- `Code/components/forms/form-edit-manager.tsx`
- `Code/app/[locale]/(workspace)/forms/[id]/publish/page.tsx`
- `Code/services/form-runtime.ts`

### 验收标准

- 发布前能发现明显错误。
- 错误提示用业务语言，不暴露技术细节。
- 发布成功后能立即打开分享链接。

## 阶段六：测试与回归

### 单元测试

重点覆盖：

- schema normalize
- 视觉配置持久化
- 表单运行时校验
- Webhook 敏感信息脱敏

### E2E 测试

重点覆盖：

- 创建页：输入 prompt -> 澄清 -> 生成 -> 切换视觉 -> 保存
- 模板详情页：切换设备/流模式/主题/视觉效果 -> Use This Template
- 发布流程：保存草稿 -> 发布 -> 打开分享页 -> 提交
- Webhook：成功、失败、重试日志

### 涉及文件

- `Code/services/*.test.ts`
- `Code/tests/e2e/*.spec.ts`
- `Code/playwright.config.ts`

### 验收标准

- 核心单元测试通过。
- 关键 e2e 流程通过。
- 构建通过。

## 推荐实施顺序

1. 固化 Form Artifact 类型和字段。
2. 完成创建页视觉偏好持久化。
3. 完成模板详情页选择带入创建页。
4. 增加轻量版本历史。
5. 增加发布前检查。
6. 补齐 e2e 流程。

## 风险与控制

### 风险一：过度平台化

不要把当前 MVP 做成通用 Artifact 平台。当前只服务表单资产。

### 风险二：schema 变复杂

新增字段要优先放在现有 `aspects` 或明确的 metadata 区域，避免破坏提交和渲染逻辑。

### 风险三：AI 输出不稳定

所有 AI 生成结果都必须经过 normalize 和 enum 校验。

### 风险四：预览和发布不一致

预览组件和发布页应尽量复用同一套运行时渲染逻辑。

## MVP 成功标准

当用户能完成以下闭环时，Form Artifact 模式就算在 MVP 中落地：

1. 用一句话生成表单。
2. 回答必要澄清问题。
3. 在预览区调整设备、流模式、主题、视觉方向和视觉效果。
4. 保存草稿。
5. 发布表单。
6. 分享链接或二维码。
7. 收集提交数据。
8. 后续能查看和理解这个表单的生成/修改历史。

这就是 AI FormFactory 的核心资产闭环。
