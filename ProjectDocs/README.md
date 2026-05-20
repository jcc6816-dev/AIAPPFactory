# ProjectDocs 文档导航

本目录当前有两层需求基线：

- 总体平台基线：[Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt)
- 当前 MVP 直接基线：[PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)

这份导航文档的目标不再只是摘要 PRD，也补充说明当前 `Code/` 目录下真实存在的工程结构，帮助团队同时看清：

- 目标产品是什么
- 现有代码底座是什么
- 二者之间的差距在哪里

## 文档现状

- 主文档：`Readme.txt`
- 版本：V2.8
- 日期：2026-05-01
- 状态：正式定稿、作为立项 / 开发 / 交付唯一依据

## 一句话概述

目标产品的总体方向是企业级 AI 场景平台；但当前真正需要优先落地的是 V1.2 MVP 和下一阶段市场验证主线，也就是围绕四个核心能力推进：

- 生成表单能力
- Agent 能力
- 工作流能力
- 模板能力

其他能力如认证、计费、OCR、Webhook、数据列表、统计、发布分享和审计日志，都是围绕这四个核心能力服务的辅助能力。

当前 `Code/` 目录则是一套已经存在的 Next.js 单体全栈模板，更偏向 AI SaaS 官网、认证、支付、控制台和内容管理底座。

它和 V1.2 MVP 的关系是：

- 能复用底座
- 还没进入 MVP 主链路实现

## PRD 核心能力摘要

### 1. 总体平台方向

- AI Agent 进行意图理解与方案规划
- 生成页面、表单与业务流程
- 支持沙箱预览与人工确认

### 2. MVP 第一阶段方向

- AI 表单系统
- Form Runtime
- Workflow Engine
- Skill Runtime
- Billing Core
- Webhook

### 3. 界面与编排

- GenUI 动态界面
- 低代码可视化编辑
- Skill 编排能力

### 4. 集成与开放

- 多协议接入
- 统一错误码
- MCP 服务暴露
- OpenClaw Skill 兼容

### 5. 治理与运维

- 版本、灰度、回滚、多环境迁移
- 异常中心、知识库与告警
- AI 虚拟团队协作与审计边界

## 当前代码框架速览

基于对 `Code/` 的结构阅读，当前工程不是空目录，而是一套完整的 Next.js 15 单体应用。

### 1. 应用入口

- `app/` 使用 App Router
- `app/[locale]/(default)/page.tsx` 是多语言落地页入口
- `app/api/` 提供服务端接口

### 2. 页面与组件层

- `components/blocks/`：落地页区块组件
- `components/console/`：控制台布局与插槽
- `components/dashboard/`：后台仪表盘布局与侧边栏
- `components/ui/`：shadcn/ui 基础组件

### 3. 认证与会话

- `auth/config.ts` 使用 NextAuth
- 支持 Google One Tap、Google、GitHub
- 登录后通过 `services/user.ts` 持久化用户信息

### 4. 多语言与内容

- `i18n/` 管理语言路由与消息
- `services/page.ts` 从 `i18n/pages/landing/*.json` 读取落地页内容

### 5. 数据与服务层

- `models/db.ts` 通过 Supabase Client 建立数据访问连接
- `services/` 封装用户、订单、积分、API Key、Affiliate 等业务逻辑

### 6. API 层

- `app/api/ping/route.ts` 等接口表明当前工程采用“Next.js 页面 + Route Handler”一体化模式
- 不是单独拆出的 Go/Node API 服务

## 现状判断

可以明确得出以下结论：

1. 仓库已经有实际代码，不再是“文档先行、代码待初始化”的状态。
2. `Code/` 当前是现成模板工程，适合作为技术底座或过渡实现。
3. 这套模板的业务语义仍偏 AI SaaS boilerplate，与 PRD 中的“场景平台 / Skill 编排 / 异常运维 / AI 虚拟团队”还没有完全对齐。
4. 后续工作重点不应是“新建空工程”，而应是“评估现有模板与目标平台的映射关系”。

## 推荐的下一步文档

建议补齐以下文档，优先解决“目标与现状之间的差距”：

1. 现有代码结构说明
   标明 `Code/` 各目录的职责与技术选型。
2. PRD 与代码映射表
   区分“已具备”“可复用”“需重构”“尚未实现”。
3. 技术架构设计
   说明是否继续沿用 Next.js 单体架构，哪些模块放在 Route Handler，哪些能力需要单独抽象。
4. 模块迭代计划
   以现有模板为起点拆解演进路径，而不是从零规划。

当前已补充：

- [PRD-Code-Alignment.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD-Code-Alignment.md)
  说明 V1.2 MVP PRD 与当前 `Code/` 工程之间的复用点、冲突点与缺失点。
- [MVP-Minimal-Loop-Implementation-Plan.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Minimal-Loop-Implementation-Plan.md)
  按 `AGENTS.md` 三步法整理 V1.2 MVP 最小闭环的实施路径、文件清单、数据模型、API、验证与风险。
- [MVP-First-Batch-Implementation-Checklist.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-First-Batch-Implementation-Checklist.md)
  将最小闭环计划进一步拆成首批代码任务包，明确第一轮要创建和修改的文件、顺序、验收点与测试范围。
- [Database-Setup.md](/Users/mike/Documents/AIFactory/ProjectDocs/Database-Setup.md)
  说明当前本地演示何时不需要数据库，以及什么时候应该切到 Supabase 并执行哪份 SQL。
- [MVP-Acceptance-Checklist.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Acceptance-Checklist.md)
  汇总当前开发版已经完成的能力、手动验收步骤、验收标准和当前保留边界。
- [Database-Migrations-Manual.md](/Users/mike/Documents/AIFactory/ProjectDocs/Database-Migrations-Manual.md)
  汇总从早期版本升级到当前 MVP 数据结构时，需要手动补执行的增量 SQL。
- [MVP-Integration-Test-Report-2026-05-10.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Integration-Test-Report-2026-05-10.md)
  记录当前增强版 MVP 的真实联调结果，包括百度 OCR、DeepSeek、Webhook、自动回填和已修复的问题。
- [MVP-Runbook.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Runbook.md)
  说明本地运行、环境变量、联调顺序、测试素材和当前适用边界，方便后续重复验证与交接。
- [MVP-Current-Capabilities-Summary.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Current-Capabilities-Summary.md)
  汇总当前增强版 MVP 已完成能力、已真实验证能力、未定稿能力以及后续更适合的推进方向。
- [Deployment-Architecture-Recommendation.md](/Users/mike/Documents/AIFactory/ProjectDocs/Deployment-Architecture-Recommendation.md)
  给出当前阶段推荐的部署架构组合，说明为什么更适合 `Vercel + Supabase + R2`。
- [Deployment-Checklist-Vercel-Supabase-R2.md](/Users/mike/Documents/AIFactory/ProjectDocs/Deployment-Checklist-Vercel-Supabase-R2.md)
  汇总部署前、部署时、部署后的检查项，方便后面真正上线或搭测试环境。
- [MVP-Next-Phase-Roadmap.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Next-Phase-Roadmap.md)
  说明为什么当前不适合继续无限抠单页细节，并给出剩余 MVP、信息架构冻结与后续 UI 精修的建议顺序。
- [MVP-Complete-Feature-Checklist.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Complete-Feature-Checklist.md)
  汇总当前第一阶段 MVP 的完整功能边界，并明确将 OCR 与 DeepSeek 大模型接入纳入第一阶段范围。
- [MVP-OCR-DeepSeek-Technical-Breakdown.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-OCR-DeepSeek-Technical-Breakdown.md)
  从模型抽象、文件上传、OCR 服务、数据库字段和 API 视角，拆解把 OCR 与 DeepSeek 纳入第一阶段后需要补的技术能力。
- [MVP-OCR-DeepSeek-Implementation-Order.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-OCR-DeepSeek-Implementation-Order.md)
  将 OCR 与 DeepSeek 的开发拆成 5 批执行顺序，明确哪些必须先做、哪些随后做，以及对应文件改动范围。
- [MVP-Form-Generation-Enhancement-Checklist.md](/Users/mike/Documents/AIFactory/ProjectDocs/MVP-Form-Generation-Enhancement-Checklist.md)
  收口部署前要补强的表单生成体验范围，仅包含重新生成、Prompt 微调、智能 Fallback、轻量字段编辑与预览统一，不扩展到版本系统和高级参数控制。
- [Page-Agent-Pattern.md](/Users/mike/Documents/AIFactory/ProjectDocs/Page-Agent-Pattern.md)
  固化“页面级 Agent 模式”的产品与技术设计，明确统一 Agent 外壳、页面上下文、页面专属工具、事件流、风险确认机制和分阶段落地路线。
- [PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-Next-Stage-Template-Agent-Data-Platform.md)
  作为下一阶段产品需求草案，明确从“从 0 Prompt 生成”调整为“模板降低起点、Agent 辅助修改、数据处理闭环证明价值”的市场验证路线。
- [Universal-Template-Catalog-V1.md](/Users/mike/Documents/AIFactory/ProjectDocs/Universal-Template-Catalog-V1.md)
  定义首批面向互联网/终端用户的通用增长模板清单，企业行业模板暂不凭空设计，待线下调研后单独沉淀。

## 阅读建议

- 看 MVP 范围：优先读 [PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)
- 看总体平台目标：再读 [Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt) 第 2、3、4、6、20 章
- 看现有代码入口：优先看 [Code/package.json](/Users/mike/Documents/AIFactory/Code/package.json)、[Code/app/[locale]/(default)/page.tsx](/Users/mike/Documents/AIFactory/Code/app/[locale]/(default)/page.tsx)、[Code/auth/config.ts](/Users/mike/Documents/AIFactory/Code/auth/config.ts)、[Code/models/db.ts](/Users/mike/Documents/AIFactory/Code/models/db.ts)
- 看内容与页面组织：优先看 [Code/components](/Users/mike/Documents/AIFactory/Code/components)、[Code/i18n](/Users/mike/Documents/AIFactory/Code/i18n)、[Code/services/page.ts](/Users/mike/Documents/AIFactory/Code/services/page.ts)

## 说明

这份导航文档不替代 PRD，也不替代 `Code/README.md`。

- 产品范围、边界、交付标准，以 [Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt) 为准。
- 当前代码如何组织、能跑什么、有哪些模板能力，以 `Code/` 目录实际内容为准。
