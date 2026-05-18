AI 应用服务商店平台 V1.2

产品需求文档（PRD）

AI 应用服务商店平台 V1.2（完整版・统一架构版）

0. 文档信息

项目	内容
文档名称	AI 应用服务商店平台 PRD
文档版本	V1.2
当前状态	可开发版本
更新时间	2026-05-07
所属体系	PRDV2.8 子系统
核心定位	AI Workflow Consumption Platform
第一入口	AI 表单系统
基础平台	ShipAny
适用角色	产品 / AI开发 / 前后端 / 运营 / 商业化
1. 产品定位（重新定义）

1.1 产品本质（非常关键）

本平台：

❌ 不是单纯表单系统
❌ 不是普通 AI 工具站
❌ 不是 Skill 商店

✅ 本质是：

AI 数据处理与自动化消费平台
(AI Workflow Consumption Platform)
平台允许用户：

创建数据入口（表单 / 上传 / API）

使用 AI 能力处理数据（Skill）

通过 Workflow 自动流转

基于 Consumption（消耗）计费

1.2 核心商业逻辑

用户视角

“我上传数据”
→
“系统自动帮我处理”
平台视角

数据进入
→ Skill执行
→ Workflow流转
→ Billing Core计费
1.3 第一阶段核心定位

当前阶段：

👉 AI 表单驱动的数据处理平台

表单：

是流量入口

是数据入口

是事件入口

Skill：

是数据处理能力

是商业化核心

是自动化能力

Workflow：

是连接所有能力的运行时

Billing Core：

是平台核心基础设施

2. 产品目标

第一阶段目标（MVP）

核心目标：

打造：

AI 表单 + Skill + Workflow + Billing
闭环。

用户可以：

1️⃣ 创建 AI 表单

类似：

Typeform

Jotform

Paperform

体验。

2️⃣ 用户提交数据

包括：

文本

图片

PDF

文件

3️⃣ 系统自动执行 Skill

例如：

OCR

数据整理

AI 提取

导出 Excel

Webhook

4️⃣ 自动进入 Workflow

例如：

提交
→ OCR
→ 分类
→ 导出
→ 推送外部系统
5️⃣ Billing Core 自动扣除 Credits

完成平台商业闭环。

3. 平台整体架构

3.1 总体架构

ShipAny（基础SaaS）
    ↓
AI 应用服务商店
    ↓
Form System（入口）
    ↓
Workflow Engine（流程）
    ↓
Skill Runtime（能力执行）
    ↓
Billing Core（计费）
3.2 模块组成

模块	作用
ShipAny	用户、支付、订阅、SEO
Form Builder	表单生成
Form Runtime	表单运行
Workflow Engine	自动化流程
Skill Runtime	Skill执行
Billing Core	Credits计费
Event Bus	事件系统
Automation Engine	自动化
Integration Hub	Webhook/API
AI Gateway	AI模型统一出口
4. 第一阶段核心模块

4.1 AI 表单系统（核心入口）

目标

对标：

Typeform

Jotform

Paperform

功能

表单生成

支持：

AI 一句话生成

可视化编辑

模板生成

拖拽编辑

字段类型

支持：

文本

多行文本

数字

单选

多选

日期

图片上传

PDF 上传

文件上传

表单主题系统（重要）

支持：

极简主题

商务主题

深色主题

品牌主题

响应式

支持：

PC

Mobile

平板

表单体验

重点：

丝滑
顺畅
动画自然
移动端优秀
4.2 Form Runtime（表单运行时）

核心能力

提交事件

onSubmit
文件上传

支持：

OSS/S3

断点续传

大文件

提交数据存储

保存：

form_submission

upload_file

metadata

Submission Viewer

支持：

数据查看

搜索

导出

4.3 Workflow Engine（重点）

第一阶段必须具备：

Workflow Trigger

支持：

事件	说明
Form Submitted	表单提交
File Uploaded	文件上传
Schedule	定时任务
Webhook Received	外部Webhook
Workflow Action

支持：

Action	类型
OCR	AI
Extract Fields	AI
Export Excel	Processing
Send Email	Integration
Webhook Push	Integration
Save To DB	System
Workflow 模式

V1：

固定流程。

例如：

表单提交
→ OCR
→ 导出Excel
4.4 Skill Runtime（能力层）

Skill 定义

Skill 是：

可执行的数据处理能力
第一阶段 Skill

AI Skill

Skill	功能
OCR	发票识别
AI Extract	字段提取
AI Summary	摘要
Processing Skill

Skill	功能
Excel Export	导出
CSV Export	导出
Image Dedup	去重
Integration Skill

Skill	功能
Webhook	外部推送
Google Sheets	同步
Email	邮件
4.5 Webhook 系统（重要）

Webhook 是平台级公共能力

不是某个应用能力。

作用

允许：

平台事件
→ 推送外部系统
第一阶段支持：

事件	推送
表单提交	Webhook
OCR完成	Webhook
Workflow完成	Webhook
Webhook 配置

支持：

URL

Secret

Retry

Status

4.6 Billing Core（平台核心）

核心定位

统一 Consumption 系统
第一阶段采用：

👉 Credits 模式

Credits 模型

用户拥有：

credits_balance
Skill 消耗：

Skill	Credits
OCR	5
PDF解析	10
AI提取	3
Webhook	1
Billing Core 子模块

模块	作用
Credits Wallet	用户余额
Usage Ledger	消耗记录
Quota Check	执行检查
Refund Engine	失败退款
Pricing Rules	Skill定价
Subscription Mapping	套餐映射
4.7 AI Gateway（重要）

作用

统一：

OpenAI

Claude

Gemini

DeepSeek

调用。

能力

支持：

fallback

model routing

token tracking

cost tracking

5. 商业化模型

第一阶段采用：

👉 Hybrid Model

5.1 免费层

项目	限制
Forms	3
Submissions	100/月
Credits	50/月
5.2 订阅层

| 套餐 | 价格 | Credits |
|---|---|
| Starter | $9 | 500 |
| Pro | $29 | 2000 |
| Business | $79 | 10000 |

5.3 超额计费

$0.02 / Credits Unit
6. 技术架构

前端

技术	说明
Next.js 15	主框架
Tailwind	UI
shadcn/ui	组件
Framer Motion	动画
后端

技术	说明
Next.js API	API
Prisma	ORM
PostgreSQL	DB
Redis	Queue
AI

技术	说明
OpenAI SDK	AI
LangChain（后期）	Agent
OCR Service	OCR
文件系统

技术	说明
OSS/S3	文件
CDN	分发
7. 数据模型（第一阶段）

核心表

users

ShipAny 用户。

forms

表单。

form_submissions

提交记录。

workflows

流程。

workflow_runs

执行记录。

skills

Skill定义。

usage_ledger

消耗账本。

credits_wallet

Credits余额。

webhook_logs

Webhook日志。

8. 第一阶段上线范围（必须收敛）

必做

1️⃣ AI 表单生成

2️⃣ 表单提交

3️⃣ OCR Skill

4️⃣ Excel 导出

5️⃣ Webhook

6️⃣ Credits Billing

7️⃣ Stripe 套餐同步

不做（后期）

❌ 多租户复杂隔离

❌ AI Agent

❌ OpenClaw

❌ Marketplace

❌ 自定义 Workflow

❌ 多步骤 Agent

❌ MCP

9. 演进路线

V1

表单 + Skill + Credits
V2

Workflow Automation
V3

应用商店
V4

OpenClaw兼容
V5

AI Agent Platform
10. 最终产品战略（重要）

你不是：

表单工具
而是：

AI Workflow Consumption Platform
只是：

第一入口恰好是表单