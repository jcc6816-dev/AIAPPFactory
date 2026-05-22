# MVP 运行与联调手册

更新时间：2026-05-22

## 1. 适用范围

本手册用于当前增强版 MVP 的本地运行、环境准备和联调复现。

适用对象：

- 本地开发
- 功能回归测试
- OCR / DeepSeek / Webhook 联调

## 2. 运行前置

主工程目录：

- [Code](/Users/mike/Documents/AIFactory/Code)

启动命令：

```bash
cd /Users/mike/Documents/AIFactory/Code
npm install
npm run dev
```

默认地址：

- `http://localhost:3000`
- 中文入口：`http://localhost:3000/zh`

## 3. 核心环境变量

配置文件：

- [Code/.env.local](/Users/mike/Documents/AIFactory/Code/.env.local)
- 参考示例：[Code/.env.example](/Users/mike/Documents/AIFactory/Code/.env.example)

### 3.1 数据库

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 3.2 本地开发登录

- `AUTH_DEV_ENABLED="true"`
- `NEXT_PUBLIC_AUTH_DEV_ENABLED="true"`
- `AUTH_DEV_EMAIL`
- `NEXT_PUBLIC_AUTH_DEV_EMAIL`

### 3.3 OCR 与 DeepSeek

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

### 3.4 开发态测试限制

- `DEV_FREE_FORM_LIMIT`
- `DEV_MIN_FORM_CREDITS`

## 4. 数据库准备

新环境：

1. 先执行 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)

旧环境升级：

1. 参照 [Database-Migrations-Manual.md](/Users/mike/Documents/AIFactory/ProjectDocs/Database-Migrations-Manual.md)
2. 补执行增量 SQL
3. 重启本地服务

## 5. 本地登录方式

登录页：

- `http://localhost:3000/zh/auth/signin`

本地联调建议使用：

- `Development Sign In`

说明：

- 首次登录会自动写入 `users`
- 开发态会自动初始化或补齐测试 credits

## 6. 推荐联调顺序

### 6.1 创建表单

1. 打开 `http://localhost:3000/zh/forms/new`
2. 输入一句话需求
3. 生成草稿
4. 保存草稿

### 6.2 配置 OCR 模板

1. 进入表单详情页
2. 选择 OCR 模板
   - `general_image`
   - `invoice`
   - `receipt`
   - `id_card`

### 6.3 配置 Webhook

1. 在表单详情页打开 `Webhook Delivery`
2. 选择目标平台
3. 填写 URL 与必要鉴权信息

### 6.4 提交真实表单

1. 打开公开分享页
2. 填写基础字段
3. 上传图片
4. 提交

### 6.5 查看结果

重点查看：

- 提交记录页
- Webhook 日志页
- 表单详情页指标卡

### 6.6 页面 Agent 冒烟测试

工作台：

1. 打开 `http://localhost:3000/zh/forms`
2. 在左侧 Agent 输入 `总结工作台`
3. 期望返回场景数量、提交数量、OCR / Webhook 成功率等摘要

生成页：

1. 打开 `http://localhost:3000/zh/forms/new`
2. 先从模板或一句话生成一个草稿
3. 输入 `加一个发票上传字段`
4. 期望右侧草稿新增上传字段
5. 输入 `把电话字段改成邮箱`
6. 期望电话字段被替换为邮箱字段
7. 输入 `帮我检查这个表单是否太长`
8. 期望只返回检查和提醒，不擅自修改草稿

数据页：

1. 打开某个表单的提交列表页
2. 在左侧 Agent 输入 `总结最近提交情况`
3. 期望返回提交、字段缺失、OCR 失败和 Webhook 失败的规则摘要

## 7. 当前推荐测试素材

真实发票图片：

- [微信图片_20260510100011_132_166.png](/Users/mike/Documents/AIFactory/TestFiles/微信图片_20260510100011_132_166.png)

说明：

- 这张图已完成过真实联调
- 当前可用于发票 OCR 模板回归测试

## 8. 已确认可用的真实链路

当前已确认可跑通：

`分享页提交 -> 文件上传 -> 百度 OCR -> DeepSeek 结构化 -> Webhook 推送`

补充说明：

- 控制台 `forms / forms/[id] / forms/[id]/submissions / forms/[id]/webhook-logs` 已统一修正为 locale-aware 路径
- 创建页保存后会跳回当前 locale 下的表单详情页

## 9. 当前边界

- Google Vision OCR 代码已接入，但尚未完成本轮真实联调
- PDF 上传已支持，但本轮不做真实 OCR 解析
- UI 仍处于可运行中间态，不作为最终定稿
