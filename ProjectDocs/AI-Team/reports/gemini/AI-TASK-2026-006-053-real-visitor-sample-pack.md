# U-053 真实目标访客获取执行包 (非 PH 式冷启动版)

**任务标识**：AI-TASK-2026-006-053  
**完成时间**：2026-06-18  
**所属主线**：主线 B — 产品激活  
**执行者**：Gemini  

---

## 1. 核心战略与免责声明

*   **定位**：**这不是一次 Product Hunt 式的正式商业发布，而是一次小流量的冷启动压力测试**。我们的核心目标是获得 20-50 个非 Mike、非 AI-Team 内部测试的真实用户交互样本，用于填充 Clarity 录屏和 GA4 漏斗数据，以优化产品的激活和转化体验。
*   **文案原则**：
    *   **诚实谦逊，不做夸大宣传**：文案只说 GenForms.ai 的当前已上线功能（表单生成、单题流预览、Webhook 重试日志等），避免堆砌“最好、极致、SaaS 神器”等虚词。
    *   **不承诺 AI 100% 准确**：大方承认 AI 生成结果偶尔可能存在字段冗余或不符预期，需要人工微调（这也正是我们提供自检日志和可视化后台的立足点）。
    *   **目标是样本，而非刷流量**：我们不需要大批量垃圾曝光，我们只寻求对表单、CRM 集成、自动化或 SaaS 感兴趣的真实开发者和运营人员。
    *   **全链路 UTM 追踪**：所有分发的链接必须严格携带 UTM 参数，以便在 GA4 和 Clarity 中进行精准隔离和转化漏斗诊断。

---

## 2. 创始人私发 10-20 个目标用户私信文案 (Founder Outreach)

*   **发送对象**：您熟识的独立开发者、SaaS 创始人、独立站长、技术运营人员或经常需要配置表单/集成的同行。
*   **私发渠道**：WeChat、LinkedIn Message、Slack DM、X DM 或 Email。

### 2.1 中文版 (Chinese Version)
> **建议标题 (如通过 Email)**: 碰到了 Typeform 限制？想请你体验一下我刚写的小工具
>
> 嗨 [对方名字]，
>
> 最近我在折腾一个叫做 **GenForms.ai** 的 AI 表单生成和自动化推送工具。
>
> 起因是发现很多传统的表单工具（比如 Typeform）价格太贵，且经常因为临时网络抖动出现 Webhook 静默失败丢单。所以我做了个工具，除了支持一句话生成表单和单题流交互，重点是把 **“Webhook 投递日志自检与指数退避自动重试 (4次)”** 做成了基础功能。
>
> 现在的 AI 生成可能还有些不完美（字段偶尔需要手动改下），目前是早期打磨阶段（非正式发布），我想听听你的真实吐槽和建议。
>
> 如果方便的话，可以用手机或电脑点开下面这个体验链接，顺便试试生成或配置一个 webhook，帮我录个真实的 Clarity 会话：
>
> 体验链接（中文版首选）：https://genforms.ai/zh?utm_source=manual_outreach&utm_medium=founder_dm_zh&utm_campaign=activation_sample_202606
>
> 非常感谢！期待你的毒舌反馈。

### 2.2 英文版 (English Version)
> **Suggested Subject (if via Email)**: Quick product feedback on GenForms.ai (AI Form with Webhook Retries)
>
> Hi [Name],
>
> I've been working on a lightweight, AI-native form builder called **GenForms.ai**, and I'd love to get your honest feedback.
>
> I built it because generic form builders are either overpriced or lack basic delivery retry features, making it easy to lose leads during network spikes. GenForms supports quick prompt-based generation and conversational flow previews, but it also features a built-in **"4-attempt automatic webhook retry (1s/5s/15s) and handoff log"** ledger.
>
> The AI-assisted generation might not be 100% accurate yet, but it's in early test mode. I want to see if the creation-to-webhook flow feels smooth.
>
> If you have 2 minutes, could you test the generation flow or load a template using the link below? It will help me capture a real session log to optimize our layout:
>
> Test Link (English): https://genforms.ai/?utm_source=manual_outreach&utm_medium=founder_dm_en&utm_campaign=activation_sample_202606
>
> Thank you so much for your time and feedback!

---

## 3. LinkedIn / X / 朋友圈创始人发帖文案 (Social Posts)

*   **定位**：以个人开发者或早期创始人的视角，恳求朋友圈和关注者“挑刺”和“测试体验”。

### 3.1 中文版 (Chinese Version)
> 折腾了一阵子，我做的新工具 **GenForms.ai** 进测试阶段了。
>
> 这是一个可以通过 Prompt 或模板一键生成表单、并预览单题流（类似 Typeform）的工具。因为我们经常需要把表单数据推送到飞书、钉钉或者自己的服务器，所以我把 **“Webhook 投递错误日志”和“自动重试机制”** 写进了底层，避免因为对方接口临时宕机而丢线索。
>
> 大方承认，目前 AI 生成结构偶有翻车，但基本功能完全可以跑通。这绝对不是什么“完美的终极神器”，只是个刚走出沙盒的小玩具，需要更多真实用户的交互数据来帮我揪出首屏卡顿和操作流失的问题。
>
> 欢迎各位体验并给我挑刺：
> 👉 https://genforms.ai/zh?utm_source=social&utm_medium=founder_post_zh&utm_campaign=activation_sample_202606
>
> 如果你的工作流正好需要把表单推送到飞书群机器人，也可以顺便测测这个方案链接：
> 👉 https://genforms.ai/use-cases/feishu-dingtalk-form-notifications?utm_source=social&utm_medium=founder_post_zh&utm_campaign=activation_sample_202606
>
> 期待你们的真实吐槽！

### 3.2 英文版 (English Version)
> I've just moved my new project, **GenForms.ai**, into early test mode.
>
> It is an AI-native form builder designed to turn prompts or templates into conversational, step-by-step form flows. To make data pipeline integrations more reliable, I built **detailed webhook delivery logs** and an **automatic retry safety net** into the core engine so that transient server glitches won't cause silent data loss.
>
> Admittedly, the AI generation isn't 100% accurate in every case, but it's functional. I'm not launching this on Product Hunt yet—instead, I need 20-50 real-user session recordings to identify where visitors get stuck or drop off.
>
> Please give it a try and share your critical feedback:
> 👉 https://genforms.ai/?utm_source=social&utm_medium=founder_post_en&utm_campaign=activation_sample_202606
>
> If you are looking to integrate forms with custom webhooks, feel free to test this use case directly:
> 👉 https://genforms.ai/use-cases/webhook-form-builder-retry-logs?utm_source=social&utm_medium=founder_post_en&utm_campaign=activation_sample_202606
>
> Any criticism is highly welcome!

---

## 4. 5 个低风险免费目录提交清单

为确保不与 Indie Hackers、BetaList 重复，且能带来小额精准的高意图开发者/SaaS 流量，本清单选用 5 个审核快且有免费提交入口的目录：

### 4.1 目录明细表

| 目录名称 | 提交入口 (Submit URL) | 推荐落地页 | 携带 UTM URL | 推荐提交分类 |
| :--- | :--- | :--- | :--- | :--- |
| **1. ListAi.cc** | `https://listai.cc/submit` | 英文首页 | `https://genforms.ai/?utm_source=listai&utm_medium=ai_directory&utm_campaign=early_external_discovery` | Productivity / Business / Automation |
| **2. AI Workbench** | `https://www.aiworkbench.tech/submit/` | 英文首页 | `https://genforms.ai/?utm_source=aiworkbench&utm_medium=ai_directory&utm_campaign=early_external_discovery` | Productivity / Business / Automation |
| **3. Fushion NoCode**| `https://fushion-eta.vercel.app/` (顶部 Submit Tool) | Typeform-Webhook 替代页 | `https://genforms.ai/use-cases/typeform-alternative-webhooks?utm_source=fushion&utm_medium=nocode_directory&utm_campaign=early_external_discovery` | AI / Automation / Marketing / Productivity |
| **4. NavTools AI** | `https://navtools.ai/submit` | SaaS 线索收集方案页 | `https://genforms.ai/solutions/saas-lead-capture-form-builder?utm_source=navtools&utm_medium=ai_directory&utm_campaign=early_external_discovery` | Business / Marketing / Productivity |
| **5. Future-pedia.com**| `https://www.future-pedia.com/submit-tool/` | 英文首页 | `https://genforms.ai/?utm_source=future_pedia&utm_medium=ai_directory&utm_campaign=early_external_discovery` | Business / Productivity / Marketing |

### 4.2 目录提交注意事项与防踩坑指南

1.  **核对免费通道**：在提交页面填写资料时，如遇要求强制付费（例如 $49~$99 的加急处理费），**直接选择免费/标准模式（Standard/Free Listing）**。如果必须付费才能提交，则跳过该站点，换下一个。我们当前阶段不购买任何加急位。
2.  **公司邮箱优先**：很多 AI 目录在审核免费提交时，会拦截 Gmail/Outlook 邮箱，填写联系邮箱时请优先使用 GenForms.ai 的官方域名邮箱。
3.  **不夸大其词**：Short Description 限制在 80~100 字符内，直接描述核心定位（如“AI-native form builder with conversational flows and webhook retry logs”），不要使用“ultimate”、“No.1”等容易被目录审核员反感并拒绝收录的夸大用词。
4.  **保存截图和确认信**：提交成功后，记录下页面提示的 `Confirmation ID` 或者是收到的确认邮件，便于后续跟进。

---

## 5. 有效性判定标准 (3-5 天观察期)

完成上述动作后，我们需要在 **3 - 5 天** 的观察窗口期内，监测以下指标来评估冷启动的成效：

### 5.1 Clarity 质量指标
*   **非 Mike 会话数**：Clarity 后台录制的非 Mike 本地 IP 真实用户录屏数达到 **20-50 个**。
*   **会话平均时长**：排除掉 0 秒或低于 3 秒的无效跳转（可能为拦截器或小部分爬虫），真实访客在 `/` 和 `/forms/new` 的停留时长超过 **15 秒**。
*   **交互录像有效性**：至少有 5-10 个录像显示用户有“鼠标划过 Suggestions、在 Prompt 输入框停留输入、或在表单预览端滑动”的动作。

### 5.2 GA4 事件指标
*   拆分流量来源维度，检查 `utm_campaign=activation_sample_202606` 和 `early_external_discovery` 的指标：
    1.  `demo_start`：真实用户是否点击了 Suggestions 或 Demo 按钮（验证首屏改版对真实用户的激活率）。
    2.  `template_use_click` 或 `workspace_preview_ready`：访客是否顺利加载了演示模板并看到预览（验证 `/forms/new` 承接页是否有阻碍）。
    3.  `form_generate` / `form_publish`：是否有真实访客尝试生成和发布。

如果 3-5 天内，Clarity 的录屏依然不足 10 个，或者 GA4 没有任何非内部 `demo_start` 触发，说明触达渠道的转化率过低，我们需要在看板中讨论并更换更垂直的独立开发者社群或定向私信。

---

## 6. 给 Codex 的复核摘要

1.  **已完成任务**：
    *   根据 U-053 和 `directory_submission_pack.md`，输出了一套完全聚焦于**真实体验样本收集**的中英文私信文案、中英文创始人贴文案。
    *   精选了 5 个与 Indie Hackers、BetaList 不冲突且提供免费收录通道的低风险 AI/No-code 目录。
    *   为每个分发渠道设计了带 UTM 追踪参数（`activation_sample_202606`）的绝对链接，并规定了 T+3 至 T+5 天后的有效性数据评估指标（Clarity/GA4）。
2.  **未做任务（安全红线）**：
    *   **没有修改任何代码，没有改写数据库，没有部署生产，没有发布文章**。
3.  **Mike 下一步需要做的事**：
    *   Mike 从私发文案中挑选 10-20 个关系好的目标用户进行私信发送。
    *   在 LinkedIn、X 或朋友圈中选用对应语言的创始人发帖文案。
    *   按本执行包第四节列表，每天抽出 5-10 分钟在 1-2 个目录中提交带 UTM 链接的 GenForms 资料，等待免费收录。
    *   在 [user_action_tracker.md](file:///Users/mike/Documents/AIFactory/ProjectDocs/Operations/user_action_tracker.md) 中确认此任务进度。
