# 部署检查清单（Vercel + Supabase + R2）

更新时间：2026-05-22

## 1. 目标

本清单用于把当前增强版 MVP 部署成一个可对外访问、可真实上传、可 OCR、可 Webhook 的运行版本。

推荐部署组合：

- 应用：Vercel
- 数据库：Supabase
- 存储：Cloudflare R2

## 2. 发布前必须确认

### 2.1 数据库

- 已创建 Supabase 项目
- 已执行 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)
- 已补执行 [Database-Migrations-Manual.md](/Users/mike/Documents/AIFactory/ProjectDocs/Database-Migrations-Manual.md) 中的增量 SQL

### 2.2 存储

- 已创建 R2 bucket
- 已准备 S3 兼容访问参数

### 2.3 OCR / LLM

- 已准备百度 OCR Key
- 已准备 DeepSeek API Key
- 如果要测 Google，再准备 Google Vision API Key

## 3. Vercel 环境变量

至少需要配置：

### 3.1 数据库

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3.2 登录

- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`
- `AUTH_GITHUB_SECRET`

说明：

- 本地 `Development Sign In` 仅用于开发态
- 对外部署时应优先准备正式登录方式

### 3.3 应用地址

- `NEXT_PUBLIC_WEB_URL`
- `NEXT_PUBLIC_PROJECT_NAME`

应配置为正式域名，例如：

- `https://your-app.vercel.app`
- 或绑定后的正式域名

### 3.4 存储

- `STORAGE_ENDPOINT`
- `STORAGE_REGION`
- `STORAGE_ACCESS_KEY`
- `STORAGE_SECRET_KEY`
- `STORAGE_BUCKET`
- `STORAGE_DOMAIN`

### 3.5 OCR / LLM

- `DEFAULT_LLM_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEFAULT_OCR_PROVIDER`
- `BAIDU_OCR_API_KEY`
- `BAIDU_OCR_SECRET_KEY`
- `GOOGLE_VISION_API_KEY`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_MODEL`
- `OCR_LLM_MAX_CHARS`
- `OCR_LLM_MIN_CHARS`

说明：

- 表单生成可使用 OpenAI 或 DeepSeek，具体由 `DEFAULT_LLM_PROVIDER` 控制。
- OCR 后结构化当前主要使用 DeepSeek，因此演示环境建议至少配置 `DEEPSEEK_API_KEY`。
- 若暂不测试 Google OCR，可先留空 `GOOGLE_VISION_API_KEY`。

## 4. 部署后必须验证

### 4.1 基础访问

- 首页可打开
- 登录页可打开
- 控制台可进入

### 4.2 表单主链路

- 可创建表单
- 可打开分享页
- 可提交表单

### 4.3 上传与 OCR

- 图片上传成功
- 文件进入对象存储
- OCR 成功
- DeepSeek 结构化成功

### 4.4 Webhook

- Webhook 能真实推送
- 日志中状态可见
- `submission_status` 为 `completed`

### 4.5 页面 Agent

- 工作台 Agent 能返回场景与运行概览
- 生成页 Agent 能增量新增字段
- 生成页 Agent 对“检查表单是否太长”只做只读检查，不自动改草稿
- 数据页 Agent 能总结最近提交与异常情况

## 5. 当前不建议直接上生产的点

以下部分在真正生产前建议继续收口：

- `forms/new` 的最终 UI
- 正式 OAuth 登录体验
- RLS 与权限策略
- 安全日志与密钥审计

## 6. 当前最适合的部署定位

当前更适合：

- 演示环境
- 客户试用环境
- 内部验收环境

还不建议直接定义为“最终生产长期稳定版”。
