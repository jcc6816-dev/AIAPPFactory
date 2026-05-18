# Code 工程说明

`Code/` 是当前仓库内实际存在的主工程目录，采用 Next.js 15 单体全栈架构。

这套代码最初明显来源于通用 AI SaaS 模板，当前已经具备官网、认证、支付、控制台、多语言、Supabase 数据访问等基础能力。它可以作为后续演进的技术底座，但不等同于当前 MVP 目标形态。

## 当前技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- next-auth
- next-intl
- Supabase
- Stripe
- shadcn/ui + Radix UI

## 目录结构

- `app/`：App Router 页面与 Route Handler API
- `auth/`：认证配置、会话封装
- `components/`：落地页、控制台、后台与基础 UI 组件
- `i18n/`：多语言路由、消息与页面文案
- `models/`：数据访问模型
- `services/`：业务服务层
- `lib/`：通用工具函数
- `public/`：静态资源
- `aisdk/`：AI SDK 相关能力封装

## 已识别的现有能力

- 多语言落地页
- 登录认证
- 用户信息持久化
- 订单、积分、API Key、Affiliate 等 SaaS 模板模块
- Route Handler 风格接口
- 基于 Supabase 的数据访问

## 与目标平台的关系

根据当前更直接的 MVP 文档 [ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)，第一阶段目标核心围绕：

- AI 表单系统
- Form Runtime
- Workflow Engine
- Skill Runtime
- Billing Core
- Webhook

而当前 `Code/` 更像“通用 AI SaaS 模板工程”。因此后续开发应始终区分：

1. 当前模板已经具备的底层能力
2. 当前 MVP 真正需要补齐的业务能力

## 本地运行

1. 安装依赖

```bash
pnpm install
```

2. 配置环境变量

```bash
cp .env.example .env.local
```

3. 启动开发环境

```bash
pnpm dev
```

4. 构建生产包

```bash
pnpm build
pnpm start
```

## 额外说明

- 当前工程默认以 `Code/` 作为主工作目录。
- 如需理解当前 MVP 目标，请优先阅读 [ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md](/Users/mike/Documents/AIFactory/ProjectDocs/PRD/PRD-V1.2-AI-AgentFactory.md)。
- 如需理解总体平台方向，再阅读仓库根目录的 [ProjectDocs/Readme.txt](/Users/mike/Documents/AIFactory/ProjectDocs/Readme.txt)。
- 如需理解仓库现状与代码框架判断，请同时阅读 [README.md](/Users/mike/Documents/AIFactory/README.md) 与 [ProjectDocs/README.md](/Users/mike/Documents/AIFactory/ProjectDocs/README.md)。
