# MVP 验收清单

更新时间：2026-05-10

## 当前阶段定义

当前 `Code/` 已经不是纯前端演示，而是一套：

- 已接入 Supabase
- 已接通 ShipAny 用户/credits 基础链路
- 已跑通表单生成、分享提交、Webhook 推送
- 已具备移动端单题流分享页
- 已明确将 OCR 与 DeepSeek 纳入第一阶段范围，并已完成真实联调

的 **MVP 开发版**。

## 本轮已完成能力

### 账户与基础数据

- `Development Sign In` 可正常登录
- 登录后会自动写入 `users`
- 新用户会自动初始化 `credits`

### 表单能力

- 一句话 AI 生成表单草稿
- 保存表单草稿到 `forms`
- 表单列表页、详情页、新建页可用
- 分享链接可访问
- 详情页支持展示二维码

### 分享填写体验

- 分享页已改为移动端优先的单题流
- 支持 `上一题 / 下一题 / 提交`
- 提交成功后显示提交编号

### 提交与运行

- 分享页提交会写入 `form_submissions`
- 会同步创建 `workflow_runs`
- 当前 workflow 仍是固定骨架，但会真实留痕

### Webhook

- 表单详情页支持配置 Webhook
- 支持平台优先的配置方式
  - 通用 Webhook
  - 飞书机器人
  - 钉钉机器人
  - 企业微信机器人
- 支持关键词/签名等常见模式
- 推送日志写入 `webhook_logs`

### OCR 与 DeepSeek

- 图片上传后可进入真实 OCR
- 当前已接通百度 OCR
- OCR 结果会进入 DeepSeek 做结构化整理
- OCR 摘要、原文、结构化结果会写入 `form_submissions`
- 结构化结果可进入 Webhook payload

### 订阅限制

- 免费用户最多创建 `1` 个表单
- 限制在后端生效
- 列表页、新建页有升级提示
- 本地 `development` 环境为便于联调，默认放宽到 `100` 个表单

## 手动验收步骤

### 1. 登录

1. 打开 `http://localhost:3000/auth/signin`
2. 点击 `Development Sign In`
3. 进入控制台

验收标准：

- 登录成功
- `users` 表新增用户
- `credits` 表新增 `new_user` 记录

### 2. 创建表单

1. 打开 `http://localhost:3000/forms/new`
2. 输入一句话需求
3. 点击“生成草稿”
4. 点击“保存草稿”

验收标准：

- 页面跳转到表单详情页
- `forms` 表新增记录

### 3. 查看二维码与分享链接

1. 打开表单详情页
2. 检查是否出现分享二维码
3. 检查分享链接是否可复制/访问

验收标准：

- 二维码正常显示
- 分享页可打开

### 4. 分享页提交

1. 在手机或浏览器中打开分享页
2. 按单题流填写
3. 完成提交

验收标准：

- 页面显示提交成功
- `form_submissions` 新增记录
- `workflow_runs` 新增记录
- 如果上传图片，`ocr_status` 与 `ocr_result_json` 会更新

### 5. Webhook 推送

1. 在表单详情页配置 Webhook
2. 再提交一次分享页
3. 查看 `Webhook Logs`

验收标准：

- 推送成功或失败状态明确
- `webhook_logs` 新增记录
- 如果目标平台要求关键词/签名，配置后可通过
- payload 中可带 `ocr.result`

### 6. OCR 与 DeepSeek 联调

1. 选择 `invoice` 或 `receipt` 模板
2. 在分享页上传真实图片
3. 完成提交
4. 打开提交记录页

验收标准：

- `ocr_provider` 有真实值，例如 `baidu`
- `ocr_status = completed`
- `ocr_result_json.summary` 非空
- `ocr_result_json.structured_data` 可见

### 7. 免费版限制

1. 使用免费用户创建第一个表单
2. 再尝试创建第二个表单

验收标准：

- 第二次创建被后端拦截
- 页面有明确升级提示

说明：

- 上述限制是正式产品语义
- 当前本地开发环境为便于联调，默认不会按 `1` 个表单直接卡住

## 当前保留边界

以下能力当前仍然不是正式完成态：

- workflow 可视化编排
- Excel 真导出
- 审批流
- 多租户
- 正式 OAuth 登录
- 完整 RLS

## 建议下一步

建议下一轮优先做：

1. 整体测试报告与运行手册补齐
2. UI 页面专项重做
3. Google Vision OCR 真实联调
4. 部署与安全边界收口
