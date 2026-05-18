# PRD V1.2 与现有 Code 工程对齐分析

本文档用于对齐当前 MVP 基线 [PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md) 与现有 [Code](/Users/mike/Documents/AIFactory/Code) 工程之间的关系。

更新时间：2026-05-08

## 结论摘要

当前 `Code/` 不是 V1.2 MVP 的现成实现，而是一套已经成型的 Next.js 15 单体 SaaS 模板工程。

它已经具备：

- 官网落地页、多语言、认证、支付、用户中心
- App Router + Route Handler 一体化开发方式
- Supabase 数据访问封装
- 通用控制台与后台 UI 骨架
- 基础 AI demo 接口

它尚未具备 V1.2 MVP 直接要求的核心闭环：

- AI 表单生成
- 表单运行时与单题流填写
- 表单发布与分享
- 表单提交存储
- Webhook 推送、重试与日志
- Skill 执行链路
- Workflow 执行链路
- 基于消耗的 Billing Core

因此，当前最准确的判断是：

`Code/` 可以作为“认证、支付、UI、基础工程能力”的底座，但还不是 V1.2 MVP 产品本身。

## V1.2 MVP 范围基线

根据 [PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)，当前阶段应优先围绕以下模块推进：

- AI Form System
- Form Runtime
- Workflow Engine
- Skill Runtime
- Webhook
- Billing Core
- AI Gateway

当前阶段不应扩展到以下方向：

- 多租户复杂治理
- AI Agent 自动规划全平台
- OpenClaw / MCP 兼容
- 技能市场
- 自定义复杂工作流编排
- 多 Agent 协作体系

## 当前 Code 工程现状

### 技术形态

- 架构：Next.js 15 单体全栈应用
- 路由：App Router + Route Handler
- 认证：NextAuth
- 数据访问：Supabase
- 国际化：next-intl
- 前端组件：Tailwind + shadcn/ui + Radix

### 当前页面与业务重心

基于 `Code/app/[locale]` 当前结构，可以确认现有业务重心主要是：

- 官网落地页
- 博客
- 登录页
- 支付成功页
- 用户控制台
  - 我的订单
  - 我的积分
  - 我的邀请
  - API Keys
- 简单管理后台
  - 用户
  - 订单
  - 帖子

这说明它当前的核心语义仍然是：

- `user`
- `order`
- `credit`
- `apikey`
- `affiliate`
- `post`

而不是 V1.2 MVP 更需要的：

- `form`
- `form_submission`
- `workflow`
- `workflow_run`
- `skill`
- `webhook`
- `usage_ledger`
- `credits_wallet`

## 按 MVP 模块逐项对齐

## AI Form System

### PRD 需要

- 一句话生成表单定义
- 输出结构化表单 schema
- 支持基础字段类型与校验
- 支持主题与品牌化配置

### 当前现状

- 有官网内容配置和多语言 JSON
- 没有表单 schema 生成模块
- 没有 `/api/forms/generate` 一类接口
- 没有表单编辑、预览、保存的数据模型

### 判断

- UI 组件基础可复用
- 业务能力基本缺失

## Form Runtime

### PRD 需要

- 面向终端用户的表单填写页
- 单题流或面向转化的填写体验
- 提交校验与存储
- 可分享链接与基础发布能力

### 当前现状

- 有现成页面框架和通用组件
- 没有表单运行时页面
- 没有提交 API
- 没有提交记录模型

### 判断

- 页面骨架可复用
- 运行时主链路缺失

## Workflow Engine

### PRD 需要

- 表单提交后触发固定工作流
- 串联 OCR、Webhook、导出等动作
- 保存执行结果与状态

### 当前现状

- 没有工作流定义模型
- 没有工作流执行器
- 没有执行日志或运行记录

### 判断

- 基本缺失

## Skill Runtime

### PRD 需要

- 至少支持 OCR Skill、Excel 导出、Webhook 推送
- 技能执行结果标准化
- 能与工作流串联

### 当前现状

- 有 AI demo API，可视为弱相关技术参考
- 没有 Skill 抽象层
- 没有技能注册、执行、日志体系

### 判断

- 只有很薄的 AI 调用基础
- 核心 Skill Runtime 未实现

## Webhook

### PRD 需要

- 表单提交后推送外部系统
- 失败重试
- 推送日志查询

### 当前现状

- 有 Stripe webhook 接收接口
- 没有平台级 outbound webhook 推送模块
- 没有 webhook 日志表与重试机制

### 判断

- 只具备“接收 Stripe 回调”的局部能力
- 不等于 PRD 所需的 webhook 子系统

## Billing Core

### PRD 需要

- 用户订阅与套餐
- Credits 钱包
- Skill / Workflow 消耗扣减
- 用量流水

### 当前现状

- 已有 Stripe、订单、积分相关页面和模型
- 已有用户控制台中的付费能力
- 还没有按 Skill / Workflow 粒度计费
- 还没有 `usage_ledger`、`credits_wallet` 语义

### 判断

- 这一块是现有代码里最有复用价值的部分之一
- 但命名与计费模型仍需重构到 MVP 语义

## AI Gateway

### PRD 需要

- 统一管理模型调用
- 控制成本、配额、容错与结果输出

### 当前现状

- 已有 AI demo API 和部分 SDK 依赖
- 没有统一网关层
- 没有用量统计、失败回退、模型路由

### 判断

- 有技术起点
- 没有形成平台能力

## 数据层对齐判断

### 当前已存在的数据库表

来自 [Code/data/install.sql](/Users/mike/Documents/AIFactory/Code/data/install.sql)：

- `users`
- `orders`
- `apikeys`
- `credits`
- `posts`
- `affiliates`

### V1.2 MVP 更直接需要的核心实体

- `forms`
- `form_submissions`
- `workflows`
- `workflow_runs`
- `skills`
- `usage_ledger`
- `credits_wallet`
- `webhook_logs`

### 判断

当前数据层只有“用户、订单、积分”这一类支撑信息存在一定复用价值，MVP 业务主模型基本还未落地。

## API 层对齐判断

### 当前 API

当前 `app/api/` 主要提供：

- 认证回调
- Stripe 结算与回调
- 获取用户信息
- 邀请码相关接口
- AI demo 文本/图片生成

### V1.2 MVP 应新增的核心 API

- `/api/forms/generate`
- `/api/forms`
- `/api/forms/:id`
- `/api/forms/:id/submit`
- `/api/forms/:id/share`
- `/api/webhooks/test`
- `/api/workflows/:id/run`
- `/api/submissions`

### 判断

当前 API 组织方式可复用，但 MVP 主 API 需要新建。

## 页面层对齐判断

### 当前可复用

- 落地页区块组件体系
- 登录、主题、多语言切换
- 控制台 / 后台布局框架
- 表格、表单、弹窗、Tabs 等通用 UI 组件

### 当前偏模板

- 订单页
- 积分页
- 邀请页
- API Key 页
- 博客页
- 支付成功页

### V1.2 MVP 需要的新页面

- AI 表单生成页
- 表单编辑 / 预览页
- 表单发布页
- 表单分享落地页
- 单题流填写页
- 提交记录列表页
- Webhook 日志页
- 用量 / 计费页

### 判断

当前 UI 基础设施可复用，但大部分业务页面仍需新建。

## 可复用 / 需重构 / 缺失清单

## 可复用

- Next.js 单体全栈底座
- App Router + Route Handler 模式
- 认证与会话获取逻辑
- 多语言能力
- 页面区块组件体系
- 通用 UI 组件
- Supabase 访问封装
- Stripe 接入基础
- 用户基础表与用户服务

## 需重构

- 控制台导航语义
- 数据模型命名体系
- 积分体系到 Credits Wallet / Usage Ledger 的映射
- AI demo API 的定位
- 首页与控制台文案口径

## 明显缺失

- AI 表单生成主流程
- Form Runtime
- Workflow Engine
- Skill Runtime
- 平台级 Webhook 子系统
- MVP 业务数据模型
- 用量消耗流水

## 对齐建议

建议按以下顺序推进，而不是继续围绕模板零散改动：

1. 先定 MVP 数据模型
   优先定义 `forms`、`form_submissions`、`workflows`、`workflow_runs`、`skills`、`webhook_logs`、`usage_ledger`。
2. 先做最小业务闭环
   跑通：
   AI 生成表单 -> 发布分享 -> 用户填写 -> 提交存储 -> 触发固定 workflow -> 扣减 credits -> 记录 webhook 日志。
3. 先重排控制台信息架构
   把导航从“订单、积分、邀请、API Key”转向“表单、提交、工作流、Webhook、计费”。
4. 最后再决定基础设施是否迁移
   包括是否保持 Supabase 访问方式，还是切到 PRD 建议的 Prisma + PostgreSQL 方案。

## 推荐下一份文档

如果继续推进，最值得马上补的文档是：

1. MVP 核心数据模型草案
2. MVP API 接口文档
3. MVP 页面信息架构
4. 第一阶段最小闭环实施方案
