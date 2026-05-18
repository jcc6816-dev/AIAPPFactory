📄 PRD：AI 表单生成系统 V1.1（最终整合版）


1️⃣ 产品定义


1.1 产品定位

AI 驱动的轻量级表单生成与数据收集工具，具备类 Typeform 的填写体验，并支持 Webhook 对接外部系统。


1.2 核心能力闭环

输入一句话
→ AI生成表单
→ 用户填写
→ 数据收集
→ Webhook推送

1.3 阶段目标

快速上线（2~3周）
可真实收集数据
可接入外部系统
可收费

2️⃣ 产品范围


✅ 包含

AI生成表单
单题流填写体验
表单发布与分享
数据收集与查看
Webhook集成
基础主题系统
简单付费限制

❌ 不包含

Workflow自动化
OCR识别
审批流
拖拽编辑器
多端复杂适配

3️⃣ 核心模块


🧩 模块1：AI表单生成


功能

用户输入一句话 → AI生成表单结构


输入示例

做一个报销表单，需要上传发票和填写金额

输出Schema

{
  "title": "报销申请",
  "description": "请填写报销信息",
  "theme": "default",
  "fields": [
    { "id": "name", "label": "姓名", "type": "text", "required": true },
    { "id": "amount", "label": "金额", "type": "number", "required": true },
    { "id": "invoice", "label": "上传发票", "type": "image", "required": true }
  ]
}

字段类型

text
number
textarea
image
select

限制

最大10个字段
无条件逻辑

🧩 模块2：表单填写（核心体验）


模式：单题流（One Question Per Screen）


页面结构

标题
描述

当前问题

输入框

下一步按钮

行为

一次只展示一个问题
点击下一步切换
最后提交

状态结构

currentStep: number
answers: Record<string, any>

动画

fade + slide
≤ 300ms

🧩 模块3：封面页


功能

填写前展示：

标题
描述
开始按钮
👉 提升转化率（强制有）


🧩 模块4：主题系统（简化）


内置3套主题


1️⃣ Default

白底黑字
极简

2️⃣ Brand

主色按钮
浅色背景

3️⃣ Dark

深色模式

🧩 模块5：表单发布


功能

发布后生成访问链接：

/form/{form_id}

要求

移动端优先
可匿名访问
SEO友好

🧩 模块6：数据提交与存储


提交流程

填写 → 提交 → 存储

数据表结构


forms

id
user_id
title
schema_json
theme
status
created_at

submissions

id
form_id
answers_json
created_at
ip
device

🧩 模块7：数据面板


功能

提交总数
列表查看
简单筛选

🧩 模块8：分享

链接复制
iframe嵌入

🧩 模块9：Webhook（V1.1新增核心）


功能

表单提交后 → 自动推送数据到外部系统


配置

webhook: {
  enabled: boolean
  url: string
  headers?: Record<string, string>
  retry_count: number
}

请求

POST {webhook_url}
Content-Type: application/json

Payload

{
  "event": "form.submitted",
  "form": { "id": "xxx", "title": "报销申请" },
  "submission": { "id": "xxx", "created_at": "..." },
  "answers": { "name": "张三", "amount": 100 },
  "meta": { "ip": "...", "device": "mobile" }
}

重试机制

最多3次
1s → 5s → 15s

安全

Authorization: Bearer {token}

日志表

webhook_logs {
  id
  form_id
  submission_id
  status
  response_code
  retry_count
}

🧩 模块10：表单管理


页面：我的表单

显示：

表单名称
提交数
状态

🧩 模块11：付费体系（ShipAny）


免费版

1个表单
50条提交

付费版

多表单
更多提交

4️⃣ API设计


生成表单

POST /api/forms/generate

获取表单

GET /api/forms/:id

提交表单

POST /api/forms/:id/submit

获取提交

GET /api/forms/:id/submissions

更新Webhook

PUT /api/forms/:id

5️⃣ 页面结构


1. AI生成页

输入 → 生成


2. 表单填写页

单题流UI


3. 成功页

提交成功提示


4. 数据面板

提交列表


5. 我的表单

管理


6️⃣ 非功能要求


性能

加载 ≤1s
切换 ≤300ms

可用性

成功率 ≥99%

兼容

PC + Mobile

7️⃣ 验收标准（上线必须满足）

✔ AI生成成功
✔ 表单可填写
✔ 数据存储成功
✔ Webhook成功触发
✔ 数据可查看
✔ 可分享访问
✔ 付费限制生效


8️⃣ 与你PRD V2.8关系

V1.1模块	V2.8映射
表单生成	AI Agent（简化）
UI	GenUI
Webhook	Skill雏形
数据	场景运行

🧠 最终产品定位（非常关键）

Typeform 做的是：收集数据

你现在做到的是：

👉 收集数据 + 输出数据（可接系统）

