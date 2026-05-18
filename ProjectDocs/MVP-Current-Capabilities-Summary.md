# MVP 当前能力总表

更新时间：2026-05-10

## 1. 当前阶段判断

当前系统已经不是“仅能展示页面”的原型，而是一个 **可真实联调、可落库、可推送、可观测** 的增强版 MVP 开发态。

当前主链路已具备真实验证意义。

## 2. 已完成能力

### 2.1 账户与基础能力

- `Development Sign In` 本地登录
- Supabase 数据库接入
- 用户初始化与基础 credits 链路
- 开发态联调上限放宽
  - 表单数限制放宽
  - 测试 credits 自动补齐

### 2.2 表单能力

- 一句话 AI 生成表单草稿
- 表单保存、列表、详情
- 表单分享链接
- 二维码分享
- 表单主题基础支持

### 2.3 分享填写体验

- 公开分享页
- 移动端单题流填写
- 提交成功反馈

### 2.4 提交与文件上传

- 真实表单提交
- `multipart/form-data` 文件上传
- 文件真实落盘
- `form_submissions` 落库

### 2.5 Webhook

- Webhook 配置
- 平台优先配置模式
  - 通用 Webhook
  - 飞书机器人
  - 钉钉机器人
  - 企业微信机器人
- 真实推送
- 重试与日志
- `submission_status=completed` 推送语义已修正

### 2.6 OCR 与 DeepSeek

- OCR provider 抽象
- 百度 OCR 已真实联调通过
- Google Vision OCR 代码已接入
- DeepSeek 结构化整理已真实联调通过
- OCR 模板：
  - `general_image`
  - `invoice`
  - `receipt`
  - `id_card`
- OCR 结果展示
- OCR 结果进入 Webhook payload

### 2.7 自动回填与业务增强

- OCR 结构化字段自动回填
- 按模板做字段别名映射
- 文件字段误回填问题已修复

### 2.8 Dashboard 与留痕

- `Forms` 首页全局指标
- 单表单详情页局部指标
- `workflow_runs` 留痕
- `webhook_logs` 留痕

## 3. 已真实验证通过的能力

以下已做过真实联调，而不只是代码存在：

- 登录
- 创建表单
- 分享提交
- 文件上传
- 百度 OCR
- DeepSeek 结构化
- Webhook 外部推送
- 真实发票图片识别
- `submission_status=completed`

## 4. 当前仍然不是最终完成态的部分

- `forms/new` 创建页 UI 与创作体验
- 控制台整体 UI 统一
- Google Vision OCR 真实联调
- PDF 真实 OCR
- 正式 OAuth 登录
- RLS 与生产安全收口
- workflow 可视化编排

## 5. 建议的下一阶段方向

### 方向 A：先收口可部署性

- 部署与环境收口
- 安全边界收口
- 正式登录方式确认
- Google Vision OCR 联调

### 方向 B：先收口产品体验

- `forms/new` 专项重做
- 控制台整体 UI 收口
- 主题系统精修

当前更推荐先走方向 A，等边界稳定后再做大规模 UI 精修。
