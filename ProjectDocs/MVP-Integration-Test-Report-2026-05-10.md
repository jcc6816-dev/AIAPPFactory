# MVP 真实联调测试报告

更新时间：2026-05-10

## 1. 本轮目标

本轮测试的目标不是继续加功能，而是验证当前增强版 MVP 的真实业务链路是否已经可运行、可留痕、可对外推送。

本轮重点覆盖：

- 登录与用户初始化
- AI 生成表单与保存
- 分享页真实提交
- 文件真实上传
- 百度 OCR 真实识别
- DeepSeek 结构化整理
- OCR 自动回填
- Webhook 真实推送
- 全局与单表单指标更新

## 2. 测试环境

- 本地应用：`Code/`
- 本地地址：`http://localhost:3000`
- 数据库：Supabase
- OCR Provider：`baidu`
- LLM Provider：`deepseek`
- Webhook 接收器：本地 `127.0.0.1:4100/test-hook`

## 3. 已验证通过的链路

### 3.1 账户与基础数据

- `Development Sign In` 可正常登录
- 登录后可进入控制台
- 用户与 credits 基础链路可正常工作

### 3.2 表单创建与发布

- `forms/new` 可生成表单草稿
- 表单草稿可保存到 `forms`
- 表单详情页、分享链接、二维码可正常打开

### 3.3 分享提交与文件上传

- 分享页可真实提交
- `multipart/form-data` 文件上传成功
- 文件会真实写入本地上传目录
- `form_submissions`、`workflow_runs`、`webhook_logs` 会新增记录

### 3.4 OCR 与 DeepSeek

- 百度 OCR 可真实识别图片
- DeepSeek 可对 OCR 结果做结构化整理
- `ocr_result_json` 中会写入：
  - `summary`
  - `raw_text`
  - `structured_data`
  - `provider_payload`

### 3.5 Webhook 真实推送

- Webhook 已成功推送到本地接收器
- 推送内容包含：
  - `answers`
  - `files`
  - `storage_files`
  - `ocr.status`
  - `ocr.provider`
  - `ocr.result`
- `submission_status` 已修正为 `completed`

### 3.6 Dashboard 指标

- `Forms` 首页总览指标会更新
- 单表单详情页局部运营指标会更新

## 4. 真实发票联调结果

测试图片：
[微信图片_20260510100011_132_166.png](/Users/mike/Documents/AIFactory/TestFiles/微信图片_20260510100011_132_166.png)

测试表单：

- `form_uuid`: `form_xchcy1moz1kciu`
- `share_code`: `share_gzmiarmoz1kciu`

测试 submission：

- `submission_uuid`: `sub_2pjjdimoz4o57z`

本轮识别与结构化出的关键字段包括：

- `invoice_no`: `26112000000857609356`
- `invoice_date`: `2026年03月06日`
- `amount`: `335.42`
- `tax_amount`: `20.13`
- `total_amount`: `355.55`
- `purchaser`: `浙江保融科技股份有限公司`
- `payee`: `北京清城振华酒店有限公司`

当前结论：

- OCR 模板为 `invoice` 时，百度 OCR + DeepSeek 已经具备真实业务识别价值
- Webhook 中也已能携带上述结构化结果

## 5. 本轮修复的真实问题

### 5.1 必填图片字段误判未上传

问题：

- 即使用户上传了文件，必填图片字段仍会报 “is required”

结果：

- 已修复
- 文件上传字段现在会参与必填校验判断

### 5.2 Webhook 推送状态错误

问题：

- Webhook payload 中的 `submission_status` 之前是 `queued`

结果：

- 已修复
- 现在外部系统拿到的是 `completed`

### 5.3 文件字段被 OCR 自动回填污染

问题：

- `invoice_image` 这类上传字段曾被错误回填成发票号码

结果：

- 已修复
- `file / image / pdf` 字段现在不会参与 OCR 自动回填

### 5.4 开发态联调被 credits 卡住

问题：

- Supabase 环境下连续联调会因为 credits 不足被拦截

结果：

- 已修复
- 非 `production` 环境会自动补齐测试钱包到安全阈值

## 6. 当前仍然存在的边界

- UI 还不是最终定稿，尤其 `forms/new` 仍待后续专项重做
- Google Vision OCR 还没有完成真实联调，本轮只验证了百度
- 当前 OCR 主批次仍以图片文件为主，PDF 不在本轮真实 OCR 范围内
- 当前发票字段已经识别成功，但自动回填要真正体现业务价值，还需要更贴合具体表单字段设计

## 7. 结论

截至本轮，当前增强版 MVP 已经真实跑通这条核心链路：

`登录 -> AI 生成表单 -> 保存表单 -> 分享页提交 -> 文件上传 -> 百度 OCR -> DeepSeek 结构化 -> Webhook 推送 -> Dashboard 更新`

这说明当前系统已经从“功能开发态”进入“可真实联调验证”的阶段。

## 8. 2026-05-10 回归补测

本轮又补跑了一次真实回归，重点不是新增能力，而是确认现有链路在最近一轮改动后仍然稳定。

补测表单：

- `form_uuid`: `form_xchcy1moz1kciu`
- `share_code`: `share_gzmiarmoz1kciu`

补测 submission：

- `submission_uuid`: `sub_pfa27lmoztelhx`

补测结论：

- 本地真实提交再次成功
- 百度 OCR 继续返回 `completed`
- DeepSeek 结构化继续返回 `invoice` 文档结果
- 本地 webhook 接收器成功收到完整 payload
- `submission_status` 继续保持为 `completed`

本轮顺手修复：

- 控制台创建页保存跳转改为 locale-aware
- 提交记录页“打开分享页 / 返回表单”改为 locale-aware
- Webhook 日志页“返回表单”改为 locale-aware
- 控制台页登录回跳的 callbackUrl 改为 locale-aware
