# AI FormFactory 生产环境部署检查清单 (Deployment Checklist)

本指南旨在指导您将 **AI FormFactory (AI 表单生成与数据收集系统)** 从本地开发环境无缝迁移并部署至公网生产环境。整个系统采用 Serverless + PaaS 托管，具备高弹性与免运维特征。

---

## 📋 部署准备：基础设施账号一览

在正式开始前，请准备好以下第三方平台的账号：
1. **代码托管**: [GitHub](https://github.com)（用于将代码推送到私有仓库）
2. **应用托管**: [Vercel](https://vercel.com)（最适合 Next.js 15 单体应用的无服务器托管平台）
3. **云数据库**: [Supabase](https://supabase.com)（托管 PostgreSQL，提供高并发连接与 RESTful 数据 API）
4. **国际支付**: [Stripe](https://stripe.com)（测试模式 / 生产模式，处理卡支付、微信、支付宝及订阅生命周期）
5. **云存储**: AWS S3 或 [Cloudflare R2](https://cloudflare.com)（用于托管用户表单填报时上传的发票、收据等文件附件）
6. **AI 服务商**: OpenAI API / DeepSeek API 密钥
7. **OCR 服务商**: 百度智能云 OCR（国内备用，解析发票收据等）或 Google Cloud Vision API

---

## 🛠️ 第一步：Supabase 数据库初始化

系统采用统一的数据访问层，在检测到 Supabase 密钥配置后，会自动从本地 JSON 降级模式无缝切换到 PostgreSQL 云数据库。

1. 登录 [Supabase 控制台](https://database.supabase.com/)，创建一个新的 Project。
2. 进入新项目，点击左侧菜单的 **SQL Editor**。
3. 点击 **New query**，将项目代码库中的 [Code/data/install.sql](file:///Users/mike/Documents/AIFactory/Code/data/install.sql) 内容完整复制并粘贴进编辑器。
4. 点击 **Run** 执行 SQL。此操作将初始化包括 `users`、`orders`、`credits`、`forms`、`growth_events` 等在内的全部生产数据表。
5. 进入 **Project Settings -> API**，记录以下关键凭证：
   * **Project URL** (对应 `SUPABASE_URL`)
   * **anon/public Key** (对应 `SUPABASE_ANON_KEY`)
   * **service_role Key** (对应 `SUPABASE_SERVICE_ROLE_KEY`，用于后端管理绕过 RLS 鉴权)

---

## 💳 第二步：Stripe 支付与 Webhook 注册

要使 Pro 套餐订阅、续费自动延期、退订降级生效，必须配置好 Stripe 侧的产品价格和 Webhook 事件分发。

### 1. 配置 Stripe 产品价格 (Price ID)
1. 登录 [Stripe Dashboard](https://dashboard.stripe.com/)，进入测试或生产模式。
2. 在 **Product Catalog (产品目录)** 中创建您的套餐（例如 **AI FormFactory Pro 订阅**）。
3. 配置好计费周期（按月/按年）与价格。
4. 记录生成的 **Price ID**（格式如 `price_1Qxxxxx`），将其填写至您的后台订阅配置。

### 2. 配置 Stripe Webhook 事件接收
1. 进入 **Developers -> Webhooks** 页面。
2. 点击 **Add endpoint (添加终结点)**。
3. 在 **Endpoint URL (终结点 URL)** 中，填入您的生产环境 API 路径：
   `https://<您的 Vercel 生产域名>/api/stripe-notify`
4. 在 **Select events to listen to (监听事件)** 中，**必须且仅需**勾选以下三个核心事件：
   * `checkout.session.completed`（处理首次支付成功，录入订单）
   * `invoice.payment_succeeded`（处理自动续费扣款，顺延 Pro 权益期限）
   * `customer.subscription.deleted`（处理主动退订或扣款失败，自动降级至 Free）
5. 点击添加后，系统会展示该 Endpoint 的 **Signing Secret (签名密钥)**（格式如 `whsec_xxxxx`）。
6. 将该值记录为环境变量 `STRIPE_WEBHOOK_SECRET`，这是防止黑客伪造支付请求的唯一屏障。

### 3. 开通 Stripe 客户门户 (Customer Portal)
1. 在 Stripe 控制台搜索 **Customer Portal (客户门户)**。
2. 激活 Portal 页面，并配置允许用户自助操作的选项（如“允许取消订阅”、“允许更改信用卡”）。
3. 保存配置。由于代码已集成 Portal API，用户在控制台“我的订单”点击管理时将自动重定向至此处。

---

## 🗄️ 第三步：对象存储配置 (S3 / Cloudflare R2)

当用户通过表单上传附件（如表格 OCR、发票去重）时，文件会被安全地存储到云端，并对公网生成安全的临时签名访问链接。

1. 推荐在 Cloudflare 创建一个 **R2 Bucket**（提供免费 10GB 额度且无流出流量费）。
2. 在 R2 桶属性中，启用公网访问（CORS 规则需要允许来自您 Vercel 域名的 POST/GET 请求）。
3. 在 Cloudflare 账户设置中创建一个 **API Token**，赋予 R2 读写权限。
4. 记录以下 S3 兼容字段：
   * `STORAGE_ENDPOINT`（即 R2 的 `https://<account_id>.r2.cloudflarestorage.com`）
   * `STORAGE_ACCESS_KEY`（即 S3 Access Key ID）
   * `STORAGE_SECRET_KEY`（即 S3 Secret Access Key）
   * `STORAGE_BUCKET`（即您创建的桶名称）
   * `STORAGE_DOMAIN`（桶绑定的自定义域名或 Cloudflare 提供的公网子域名）

---

## 🚀 第四步：Vercel 托管与环境变量配置

1. 登录 [Vercel 控制台](https://vercel.com/)，点击 **Add New -> Project**。
2. 关联您的 GitHub 账号，导入存放本项目的仓库。
3. 在 **Build & Development Settings** 中，确保 `Root Directory` 设置为 `Code` 目录（如果仓库根目录不是 `Code`）。
4. 展开 **Environment Variables** 板块，将本地运行通过的配置依次粘贴进去。

### 生产环境环境变量一览表

| 环境变量名称 | 示例/默认值 | 推荐获取位置与说明 |
| :--- | :--- | :--- |
| **NEXT_PUBLIC_WEB_URL** | `https://yourdomain.com` | 您的公网生产域名（无需以 `/` 结尾） |
| **NEXT_PUBLIC_PROJECT_NAME** | `AI FormFactory` | 页面展示的系统全局产品名称 |
| **SUPABASE_URL** | `https://xxxx.supabase.co` | Supabase -> Project Settings -> API 中的 Project URL |
| **SUPABASE_ANON_KEY** | `eyJhbGci...` | Supabase 中的 public anon key |
| **SUPABASE_SERVICE_ROLE_KEY**| `eyJhbGci...` | Supabase 中的 service_role key (请保密) |
| **AUTH_SECRET** | `Zt3BXVudzzRq2...` | Session 加密密钥。可用 `openssl rand -base64 32` 生成 |
| **STRIPE_PUBLIC_KEY** | `pk_live_xxxx` | Stripe Dashboard -> API Keys 中的公钥 |
| **STRIPE_PRIVATE_KEY** | `sk_live_xxxx` | Stripe Dashboard -> API Keys 中的私钥 (请保密) |
| **STRIPE_WEBHOOK_SECRET** | `whsec_xxxx` | Stripe Webhook 注册 Endpoint 后生成的 Signing Secret |
| **NEXT_PUBLIC_PAY_SUCCESS_URL**| `${NEXT_PUBLIC_WEB_URL}/settings`| 支付成功后自动跳转的控制台设置/账单页 |
| **NEXT_PUBLIC_PAY_FAIL_URL** | `${NEXT_PUBLIC_WEB_URL}/pay-failed`| 支付失败跳转页 |
| **STORAGE_ENDPOINT** | `https://xxx.r2...` | S3 兼容的对象存储 Endpoint |
| **STORAGE_ACCESS_KEY** | `xxxx` | 对象存储 Access Key |
| **STORAGE_SECRET_KEY** | `xxxx` | 对象存储 Secret Key |
| **STORAGE_BUCKET** | `aiff-attachments` | 存储桶的名称 |
| **STORAGE_DOMAIN** | `https://cdn.xxx.com` | 桶对应的加速分发域名（用于读取已上传文件） |
| **OPENAI_API_KEY** | `sk-proj-xxxx` | OpenAI 官方 API Key (处理表单生成与 AI 技能) |
| **DEEPSEEK_API_KEY** | `sk-xxxx` | DeepSeek API Key (用作低成本技能处理或备用生成) |
| **DEFAULT_LLM_PROVIDER** | `openai` | 默认生成大模型，可选 `openai` 或 `deepseek` |
| **BAIDU_OCR_API_KEY** | `xxxx` | 百度云 OCR API Key (若开启 Baidu OCR) |
| **BAIDU_OCR_SECRET_KEY** | `xxxx` | 百度云 OCR Secret Key |
| **DEFAULT_OCR_PROVIDER** | `baidu` | 默认 OCR 解析引擎，可选 `baidu` 或 `google_vision` |

---

## 🔍 第五步：部署后冒烟测试指南 (Smoke Test)

部署完成后，在正式运营拉新前，请务必执行以下几项操作以验证系统健壮性：

1. **登录注册流冒烟**：
   * 注册一个新账户，确保没有报错，且用户数据能实时写入 Supabase 的 `users` 表。
2. **表单生成冒烟**：
   * 尝试使用一句话生成表单，校验大模型生成响应速度和字段规范性。
3. **Stripe 沙箱支付联动验证**：
   * 启用一个 Pro 技能，点击发布。当看到 Pro 锁定遮罩时点击升级。
   * 使用 Stripe 提供的测试卡号 `4242 4242 4242 4242` 完成模拟支付。
   * **校验**：支付成功返回后，控制台的阻断遮罩是否瞬间消失，分享链接是否展现；同时在 Supabase `orders` 表中，检查对应订单 status 是否变更为 `paid`。
4. **续费与退订模拟测试**：
   * 登录 Stripe 测试后台，找到刚才生成的 Subscription。
   * 点击 **Cancel Subscription (取消订阅)**。
   * **校验**：等待 2~3 秒，刷新您的 FormFactory 控制台。系统检测到 Webhook 通知后，应当即时在后台把用户的 Order 状态标记为 `expired`，发布页面重新弹起 Pro 遮罩，阻断非付费用户继续收集数据。这证明退订自动降级机制完全闭环。
5. **漏斗埋点完整度校验**：
   * 打开浏览器 Network 面板，访问发布页面。
   * 确保能看到发送至 `/api/growth/events` 的 `paywall_impression` 和 `paywall_clicked` 事件请求返回 `200 OK`，且数据真实落入 Supabase 的 `growth_events` 数据库表中。

祝您的 AI FormFactory 顺利起航，早日突破 10 万美元 ARR 目标！🚀
