# MVP 表单生成体验补强待办清单

更新时间：2026-05-10

## 1. 目标

这份清单用于收口“部署前先补强表单生成体验”的范围，只覆盖当前最值得做、且不会把 MVP 做重的能力。

本轮确认纳入的范围只有 5 项：

1. 重新生成
2. 微调 Prompt 后重新生成
3. 智能 Fallback
4. 轻量字段编辑
5. 预览体验继续统一

不在本轮范围内的能力，统一后置。

## 2. 本轮必须做

### 2.1 重新生成

目标：

- 用户在当前 Prompt 不变的前提下，可以直接再次调用 AI 重新生成表单草稿
- 不需要手动清空后重新输入

最小要求：

- 生成完成后，保留 `重新生成` 按钮
- 重新生成沿用当前：
  - `prompt`
  - `theme`
  - `provider`
  - `model`
- 新结果覆盖当前草稿

本轮不做：

- 历史版本持久化
- 多版本对比
- regenerationCount 数据统计

### 2.2 微调 Prompt 后重新生成

目标：

- 用户在看到第一版生成结果后，可以微调 Prompt，再重新生成

最小要求：

- 生成后不锁死 Prompt 输入框
- 用户修改 Prompt 后可再次点 `生成`
- 新结果覆盖当前草稿

本轮不做：

- Prompt diff 对比
- Prompt 模板库

### 2.3 智能 Fallback

目标：

- 当 LLM 不可用、超时、解析失败时，不再总是返回同一套固定字段
- Fallback 至少要根据 Prompt 的关键词给出更贴近场景的结果

最小要求：

- 根据关键词判断场景：
  - 报名 / 预约 / 登记
  - 反馈 / 调查 / 问卷
  - 发票 / 报销 / 票据
  - 通用收集
- 不同场景返回不同字段组合
- 仍然保留当前：
  - 标题推断
  - theme 透传
  - provider / model 元数据

本轮不做：

- 完整行业模板库
- 复杂语义分类器

### 2.4 轻量字段编辑

目标：

- 生成后，用户可以在不进入复杂编辑器的前提下，对字段做必要调整

本轮允许的编辑能力：

- 修改字段标题
- 修改字段占位文案
- 修改字段帮助文案
- 切换必填 / 非必填
- 删除字段
- 字段上移 / 下移
- 单选 / 多选 / 下拉字段的选项编辑

本轮不做：

- 拖拽排序
- 任意复杂字段配置面板
- 高级验证规则编辑
- 完整可视化低代码编辑器
- 自由复制字段

### 2.5 预览体验继续统一

目标：

- 创建页中的预览，继续向真实公开分享页靠近
- 保持“所见即所得”的方向，而不是退回字段列表式预览

最小要求：

- 生成页预览继续复用单题流逻辑
- 字段切换与预览题目切换保持一致
- 预览中的按钮、进度、问题呈现与公开页尽量统一

本轮不做：

- 单独重写第二套预览 runtime
- 复杂动画系统

## 3. 本轮明确不做

以下能力虽然有价值，但本轮不纳入：

- 生成历史
- 多版本对比
- 完整版本管理
- 高级 LLM 参数控制（如直接暴露 temperature、max_tokens）
- 生成成功率后台
- 数据库级生成日志系统

原因：

- 会显著扩大范围
- 会延迟部署准备
- 不符合当前“先补强核心体验，再部署”的目标

## 4. 建议实施顺序

建议按下面顺序推进：

### 第一批

1. 重新生成
2. 微调 Prompt 后重新生成
3. 智能 Fallback

原因：

- 改动集中在生成链路
- 不影响数据库结构
- 用户感知提升最快

### 第二批

4. 轻量字段编辑

原因：

- 会影响创建页状态管理和预览联动
- 适合在生成链路稳定后接入

### 第三批

5. 预览体验继续统一

原因：

- 更偏体验收口
- 放在前两批之后更稳

## 5. 预计涉及文件

### 生成链路

- [Code/services/form-generator.ts](/Users/mike/Documents/AIFactory/Code/services/form-generator.ts)
- [Code/app/api/forms/generate/route.ts](/Users/mike/Documents/AIFactory/Code/app/api/forms/generate/route.ts)
- [Code/components/forms/form-generator.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx)

### 预览与编辑

- [Code/components/forms/form-preview-panel.tsx](/Users/mike/Documents/AIFactory/Code/components/forms/form-preview-panel.tsx)
- [Code/types/form.d.ts](/Users/mike/Documents/AIFactory/Code/types/form.d.ts)

### 文案

- [Code/i18n/messages/zh.json](/Users/mike/Documents/AIFactory/Code/i18n/messages/zh.json)
- [Code/i18n/messages/en.json](/Users/mike/Documents/AIFactory/Code/i18n/messages/en.json)

## 6. 验证要求

每批完成后至少验证：

### 自动化验证

- `npm test`
- `tsc --noEmit`

### 手动验证

1. 输入 Prompt 并生成
2. 点击 `重新生成`
3. 修改 Prompt 后再次生成
4. 模拟 LLM 失败，确认智能 Fallback 生效
5. 修改字段内容并确认预览同步变化
6. 保存表单并确认数据正常落库

## 7. 一句话策略

这轮不是做“完整表单编辑器”，也不是做“生成历史系统”，而是：

**把 AI 表单生成从“一次性结果”提升为“可重新生成、可轻量调整、可更稳定落地”的部署前增强版。**
