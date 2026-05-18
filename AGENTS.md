# Repository Guidelines - AI 场景生成、运行、治理与集成平台

## Project Overview
本仓库当前承载的是一个“AI 驱动企业级碎片化场景生成、运行、治理与集成平台”项目。产品需求基线以 [ProjectDocs/Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt) 的 PRD V2.8 永久冻结版为准。

平台目标是为保险、金融、政企和集团内部数字化场景提供一套从场景生成、页面构建、Skill 编排、集成接入、发布治理到智能运维的全生命周期能力。

核心能力包括：

- AI Agent 半自动规划与场景生成
- GenUI 动态界面与低代码双向编辑
- Skill 原子能力编排与技能商店
- 多协议语义集成与 MCP 服务暴露
- 场景治理、灰度发布、版本回滚、多端分发
- OCR、图片去重、报表导出等图像智能链路
- 异常中心、知识库、自愈与 AI 运维闭环
- AI 虚拟团队支持需求分析、研发分析、改码、测试和发版协作

## Current Development Phase: MVP (AI Form Generator)

**重要说明**：虽然 PRD V2.8 定义了完整平台，但当前开发阶段 **仅实现 PRD V1.1 版本**（AI 表单生成与数据收集系统），以快速上线验证。

**MVP 范围**（必须严格遵循）：
- ✅ AI 生成表单（一句话 → JSON Schema）
- ✅ 单题流填写体验（类比 Typeform）
- ✅ 表单发布与分享（链接 + 二维码）
- ✅ 数据提交与存储
- ✅ Webhook 推送（含重试 + 日志）
- ✅ 基础数据面板（提交列表）
- ✅ 简单主题系统（3 套）
- ✅ 付费限制（基于 ShipAny 订阅）

**MVP 不做**：
- ❌ 工作流编排 / Skill 编排
- ❌ OCR 识别、图片去重、报表生成
- ❌ 审批流程（单人/会签）
- ❌ 多租户（采用单租户 + 每个客户独立部署）
- ❌ OpenClaw 兼容、MCP 服务
- ❌ AI 智能运维闭环、AI 虚拟团队
- ❌ 可视化拖拽编辑器

> 完整平台能力（PRD V2.8）作为长期路线图，当前代码提交不应引入上述排除模块的代码。

## Repository Status
- 当前仓库不再是空代码状态，`Code/` 目录下存在一套完整的 Next.js 15 单体应用。
- `ProjectDocs/Readme.txt` 仍然是产品需求基线，但 `Code/` 的实际实现语义更接近 AI SaaS 模板工程。
- 当前工作的重点不是初始化空工程，而是理解现有代码结构，并逐步将其与 PRD 目标平台能力对齐。

## Project Structure
- `README.md`：仓库级项目说明与当前状态概览
- `ProjectDocs/Readme.txt`：PRD V2.8 永久冻结版原文
- `ProjectDocs/README.md`：PRD 导航摘要、代码结构摘要与实施判断
- `Code/`：现有 Next.js 15 单体全栈工程
- `Code/app/`：页面与 API 路由入口
- `Code/auth/`：NextAuth 配置
- `Code/components/`：页面区块、控制台、后台和 UI 组件
- `Code/models/`：数据访问模型
- `Code/services/`：业务服务层
- `Code/i18n/`：多语言与落地页内容

## Source Of Truth
- 产品范围、角色职责、模块能力、边界约束、交付标准，以 `ProjectDocs/Readme.txt` 为唯一需求基线。
- 如果其他文档与 PRD 冲突，以 PRD 为准。
- 若后续新增架构文档、数据模型或接口文档，应明确标注其版本与适用范围。

## Naming & Domain Language
命名应优先贴合当前平台语义，避免沿用旧的“AI 算力网关”表达。

优先使用的业务语义包括：

- `scene`
- `genui`
- `skill`
- `agent`
- `template`
- `catalog`
- `integration`
- `approval`
- `exception`
- `knowledge-base`
- `tenant`
- `publish`
- `sandbox`
- `whitelist`
- `testcase`

如果涉及 OpenClaw 兼容、MCP 服务、AI 虚拟团队、知识积分等模块，命名需与 PRD 章节保持一致，避免产生第二套概念体系。

## Documentation Expectations
- 新增或修改文档时，先判断是否会与 `ProjectDocs/Readme.txt` 的冻结描述冲突。
- 不直接重写冻结版 PRD，优先通过新增摘要、导航、架构草案、拆解文档的方式补充说明。
- 文档要明确“现状”“目标”“边界”“下一步”，避免空泛口号。
- 任何技术方案文档都应说明与 PRD 哪些章节对应。
- 代码协作与 AI 执行细则，补充参考 [COLLABORATION_SUPPLEMENT.md](/Users/mike/Documents/AIFactory/COLLABORATION_SUPPLEMENT.md)。
- AI 每次开工前的短版自检清单，参考 [AI_EXECUTION_CHECKLIST.md](/Users/mike/Documents/AIFactory/AI_EXECUTION_CHECKLIST.md)。

## AI Collaboration Workflow (for Codex / Cursor / Claude)

与 AI 协作开发时，必须遵循 **“三步法”**，尤其是复杂或中等复杂度的功能：

**第一步：计划（Plan）**
- AI 必须先输出详细的开发计划，包括：
  - 需要修改/新增的文件清单及作用
  - 数据库变更（如有）
  - API 设计（请求/响应结构）
  - 第三方依赖（是否需要新包）
  - 重试/容错策略
- 人类确认计划后，才能进入第二步。

**第二步：代码实现（Code）**
- 列出所有需要创建或修改的文件清单（含路径）
- 逐个文件生成完整代码
- 代码必须包含必要的注释（说明关键逻辑）

**第三步：验证与风险（Verify）**
- 提供单元测试代码（使用 Jest / Vitest）
- 提供手动测试步骤（如何构造成功/失败场景）
- 分析潜在风险（如性能、安全、副作用）及应对建议

**简单功能**（仅修改 1-2 个文件，无复杂逻辑）可跳过“计划”步骤，但必须保留“验证与风险”。

## Build / Test Guidance
当前实际可用的主工程位于 `Code/`，常用命令见 [Code/package.json](/Users/mike/Documents/AIFactory/Code/package.json)：

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm start`

补充约定：

- 默认以 `Code/` 为主工程根目录，不再假设存在独立的 `Code/Web`、`Code/Server`、`Code/Admin` 三端子工程。
- 如果后续新增独立服务或子应用，需要在仓库文档中明确其职责、运行方式和与 `Code/` 的关系。
- `Code/.env.example` 是当前环境变量配置入口，新增变量时需同步更新。

## Testing Requirements (MVP)

- 单元测试框架：Jest 或 Vitest（与现有 Code/ 工程一致）
- 每个新增 API 必须至少包含：
  - 正常请求的测试
  - 参数缺失/错误的测试
  - 依赖外部服务（如 OpenAI、Webhook）失败的 mock 测试
- 前端组件测试可选，但核心单题流组件应包含快照测试或交互测试
- AI 生成代码时，应**同步生成对应的测试文件**（`.test.ts` 或 `.spec.tsx`）
- 手动测试步骤需在 PRD 或文档中记录，便于验收

## Coding Style & Architecture Direction
当仓库进入实现阶段时，遵循以下方向：

- 前端：组件化、配置驱动、可扩展，优先服务 GenUI、低代码与多端渲染场景
- 服务端：按领域拆分模块，隔离 AI 中枢、编排执行、治理管控、异常中心与开放接口
- 管理后台：以租户、运营、审核、告警、知识库、AI 虚拟团队监控为核心视角
- 跨模块能力如权限、审计、错误码、版本管理、白名单控制需统一抽象，避免散落实现

## Security & Compliance
- 不要提交密钥、令牌、数据库连接串或第三方服务配置。
- 涉及租户数据、个人信息、知识库案例、异常日志时，文档和代码都应考虑脱敏。
- 高风险能力如本地命令执行、文件系统写入、跨环境迁移、白名单变更、自动改码等，必须保留人工确认和审计思路。
- 任何与 OpenClaw Skill 导入导出有关的实现，都要预留格式校验与安全扫描位置。

### Environment Variables & Secrets
- 所有 API 密钥、数据库连接串、第三方服务凭证必须通过 `.env.local` 或 `.env` 注入。
- 示例文件 `.env.example` 需保持最新，但**不得包含真实密钥**。
- AI 生成的代码中，严禁硬编码密钥。若需要调用 OpenAI、AWS 等服务，必须从 `process.env` 读取。
- Webhook 配置中的 `Authorization` token 应加密存储，日志中禁止明文输出。

## Commit & Change Guidance
- 使用 Conventional Commits，例如 `docs:`, `feat:`, `refactor:`, `fix:`
- 文档类变更应清楚说明更新了哪部分基线、现状判断或代码结构说明
- 修改 `Code/` 时，先确认是“模板能力”还是“目标平台能力”，避免在命名和模块职责上继续混淆

## Recommended Next Docs
建议优先补齐以下文档：

1. `Code/` 现有结构说明
2. PRD 与现有代码映射表
3. 技术架构设计
4. 模块拆解与迭代计划
5. 核心数据模型设计
- **MVP 需求文档**：`ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md`（简化版，明确 Webhook、单题流等）
- **API 接口文档**：`ProjectDocs/API.md`（列出 `/api/forms/generate`、`/api/forms/:id/submit` 等）
- **部署检查清单**：`docs/DEPLOYMENT_CHECKLIST.md`（环境变量、数据库迁移、Webhook 测试）
- **用户手册**：`docs/USER_GUIDE.md`（如何使用 AI 生成表单、配置 Webhook）

## ShipAny Integration Constraints

当前 `Code/` 基于 ShipAny 脚手架（AI SaaS 模板），已提供：
- 用户认证（NextAuth）
- 订阅付费（Stripe / Paddle）
- 数据库基础连接（Prisma）

**开发约束**：
- 优先复用 ShipAny 已有的认证中间件，不再造轮子。
- 付费限制（免费用户最多 1 个表单）应通过后端校验 ShipAny 返回的订阅状态实现。
- 若需修改 ShipAny 核心文件（如 `auth/` 目录），必须先提计划并说明影响。
