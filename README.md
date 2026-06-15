# Deeptoken / AI 场景生成与治理平台

这是一个面向企业碎片化业务场景的 AI 平台项目仓库。当前需求有两层基线：

- 总体平台基线：[ProjectDocs/Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt)
- 当前 MVP 基线：[ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)

当前仓库同时包含：

- 一套冻结版 PRD 与导航文档
- 一套已存在的 `Code/` 单体 Web 应用代码框架

## 当前判断

当前仓库已经不是“纯文档、无代码”的状态。

`Code/` 目录下存在一套完整的 Next.js 15 全栈模板工程，具备基础的：

- App Router 页面结构
- API Route 后端接口
- NextAuth 登录认证
- next-intl 多语言路由与文案
- Supabase 数据访问
- Landing Page / Console / Admin 相关 UI 结构
- Stripe、邀请码、积分、API Key 等 SaaS 模板能力

但这套代码目前更接近一个通用 AI SaaS / 官网控制台模板，还不是完全贴合当前 MVP 需要的：

AI Form + Skill + Workflow + Billing

闭环。

## 仓库结构

- `Code/`：现有 Web 单体工程代码
- `ProjectDocs/Readme.txt`：PRD V2.8 冻结版原文
- `ProjectDocs/README.md`：文档导航、代码结构摘要与实施判断
- `AGENTS.md`：仓库协作约定
- `CLAUDE.md`：项目定位与协作宪章

## Code 目录框架概览

`Code/` 当前采用 Next.js 单体架构，而不是拆分的前后端多仓结构。

关键目录如下：

- `app/`：App Router 页面与 API 路由入口
- `app/api/`：服务端接口，例如 `ping`、`checkout`、`get-user-info`
- `auth/`：NextAuth 配置与会话逻辑
- `components/`：页面区块、控制台、仪表盘与 shadcn/ui 基础组件
- `i18n/`：多语言路由、消息文件、落地页内容
- `models/`：数据访问模型，当前通过 Supabase Client 连接
- `services/`：业务服务层，封装用户、订单、积分、API Key、页面内容等逻辑
- `lib/`：通用工具，例如响应封装、时间、IP、存储与工具函数
- `public/`：静态资源
- `aisdk/`：AI SDK 与视频/图像能力相关封装

## 已识别的技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- next-auth
- next-intl
- Supabase
- Stripe
- shadcn/ui + Radix UI

## 当前阶段建议

当前最合理的工作方式不是“从零初始化 Web / Server / Admin”，而是：

1. 先基于 `Code/` 现有模板梳理真实模块边界。
2. 明确哪些能力是模板自带，哪些能力属于 V1.2 MVP 需求。
3. 优先围绕 AI 表单、Skill、Workflow、Billing 形成最小闭环。
4. 再决定是在现有 `Code/` 基础上演进，还是将其作为过渡模板逐步重构。
5. 文档更新时要同时写清楚：
   PRD 目标态是什么；
   当前代码现状是什么；
   二者之间的差距在哪里。

## 增长与商业化指导方针

当前 GenForms.ai 的后续优化，应围绕“持续流量 + 创建转化 + 发布使用 + 付费升级”的增长闭环推进。

核心指导文档：

- [GenForms.ai 持续增长与商业目标指导方针](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_growth_operating_guideline.md)
- [GenForms.ai 流量增长计划 v2.1](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_traffic_growth_plan.md)
- [GenForms.ai 产品体验与激活主线目标文档](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/genforms_product_experience_activation_plan.md)
- [Google SEO 质量与合规规则](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/google_seo_quality_rules.md)
- [低竞争高意图关键词清单](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/low_competition_keyword_map.md)
- [用户协作待办看板](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md)
- [博客内容 Agent 执行手册](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/blog_content_agent_playbook.md)
- [SEO 内容选题队列](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md)
- [GenForms.ai 发布治理规则](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/release_governance.md)

后续新增页面、文章、模板、导航、埋点和商业化能力时，优先判断其是否服务以下漏斗：

```text
搜索曝光 → 页面点击 → 点击创建 → 注册 → 创建表单 → 发布表单 → 收到提交 → 升级付费
```

不服务该漏斗的新增能力，除非属于稳定性、安全或生产故障修复，否则应暂缓。

## 生产发布治理

GenForms.ai 的生产发布必须遵守 [GenForms.ai 发布治理规则](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/release_governance.md)。

核心原则：

- 发布前必须运行 `Code/scripts/release-preflight.sh`。
- 发布后必须运行 `Code/scripts/verify-release-state.sh` 和 `Code/scripts/verify-production-seo.sh`。
- 不得上传本地 `.env.local` 覆盖生产环境。
- 不得直接用 PM2 启动 `server.js`，必须通过 `scripts/production-start-guard.js`。
- Gemini 如需发布，也必须遵守同一套门禁；门禁失败必须停止并报告。

同时，产品体验优化必须遵循：

```text
让客户容易发现价值 → 让客户容易体验价值 → 让客户快速爱上价值
```

SEO 与产品体验是并列主线：SEO 负责带来高意图用户，产品体验负责让用户在 30-60 秒内完成价值确认，并最终触发 `form_generate`、`form_publish`、`form_submit` 等关键事件。

## 每日首次开工经验复盘规则

每天第一次使用 AI 助手处理本项目时，AI 应先做一次轻量复盘：

1. 回顾昨天在 AIFactory / GenForms.ai 项目中完成的主要改动、踩过的问题、部署或验证结果。
2. 判断其中是否有可复用的方法、流程、检查清单、增长策略、部署经验或产品判断。
3. 如果有沉淀价值，应整理成简短经验，写入或建议写入 `/Users/mike/Documents/GenExperience/experience-library`。
4. 如果只是一次性问题、临时修复或无复用价值，可以不沉淀，但应在开工时说明“今天暂无需要写入 GenExperience 的经验”。
5. 该复盘不应阻塞紧急修复；遇到生产故障时，先处理故障，完成后再补经验沉淀。

## 运行说明

当前代码工程的主要运行方式位于 [Code/package.json](/Users/mike/Documents/AIFactory/Code/package.json)：

- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`
- 构建：`pnpm build`
- 生产启动：`pnpm start`

环境变量模板见 [Code/.env.example](/Users/mike/Documents/AIFactory/Code/.env.example)。

## 文档入口

- MVP PRD：[ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)
- 总体 PRD：[ProjectDocs/Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt)
- 文档导航：[ProjectDocs/README.md](/Users/mike/Documents/AIFactory/ProjectDocs/README.md)
- 代码说明：[Code/README.md](/Users/mike/Documents/AIFactory/Code/README.md)
