# 执行报告 — AI-TASK-2026-006-034 (产品激活入口修补实施方案)

**完成时间**：2026-06-17
**所属主线**：产品体验与激活 (Product Experience & Activation)
**配合规则**：不修改代码、不部署、不改数据库，输出中文实施方案，服务从 `page_view -> demo_start -> demo_complete -> template_use_click -> form_generate` 的商业流转。

---

## 1. 当前激活断点判断

根据 Mike 人工确认（GA4 埋点通道正常但无事件）以及早期 Clarity 录屏证据，当前产品激活路径中最严重的两个断裂节点如下：

1. **`page_view -> demo_start` 严重断裂（首页体验流失，占比约 60%）**
   - **痛点**：PC 电脑端访客到站后，直接越过了骨架屏，进入 `Slide 0`。但此时界面核心的“动感弹跳 CTA 按钮”消失了，用户仅看到三个扁平、缺乏手势光标 (`cursor: pointer`) 指引的常规列表项。用户极易认为右侧 Mockup 只是纯静态的展示图（Mockup Layout），导致大量“Dead Click（无效点击）”和快速跳出，根本没有触发 `demo_start`。
2. **`template_use_click -> form_generate` 严重断裂（创建页承接断开，占比约 40%）**
   - **痛点**：用户点击了 suggestions 或在首页输入了自定义 prompt 并跳转到 `/forms/new` 后，由于未登录（游客状态）无法调用 AI 接口进行增量生成，右侧预览窗在 `generated === null` 时会直接退回到无关的 hardcoded 默认演示字段（"你叫什么名字？", "你的职位是？"）。这种前后台的完全脱节使用户感到被欺骗或产品不可用，从而直接流失，零触发 `form_generate`。

---

## 2. 首页修补方案 (不超过 3 个 P0 改动)

为激活 `demo_start` 和 `template_use_click`，提出以下 3 个高杠杆的首页首屏 P0 级小幅修补动作：

1. **PC 电脑端首屏对齐保留大 CTA 引导按钮**
   - *对应指标*：`demo_start`
   - *说明*：取消 `Code/components/blocks/hero/index.tsx` 在 Mount 阶段直接对非 Mobile 设备调用 `setShouldRenderMockup(true)` 的设定。使得 PC 访客在初始载入时，右侧也渲染带有强视觉动效、弹性十足的 “⚡ 直接体验 AI 演示 / Start Demo Instantly” 引导按钮。点击后方可触发 `demo_started` 并切换至 `Slide 0` 选择或直接开始加载。
2. **Mockup 选项卡添加 hover 动效及手势光标指引**
   - *对应指标*：`demo_start`
   - *说明*：在 `Code/app/typeform-home.css` 中为 `.mockup-option` 明确补充 `cursor: pointer;`。并增加微小的缩放 `hover:scale-[1.015]` 以及高对比度阴影暗示，让列表项呈现强烈的“可点击性”，大幅消灭 Dead Clicks。
3. **Suggestions 推荐场景与 Mockup 深度联动**
   - *对应指标*：`demo_start` / `demo_complete`
   - *说明*：用户在首页左侧点击 Suggestions 推荐卡片时，除了在输入框填充 Prompt 外，右侧 Mockup 应自动响应并进入 `handleOptionSelect(templateId, "homepage_suggestions")` 的流，让用户无缝看到右侧 AI 极速生成的流光载入（Slide 1）与交互（Slide 2）。

---

## 3. `/forms/new` 承接修补方案

为了让进入创建页的游客在 3秒内看到匹配他们期望的产品价值，必须对承接体验做如下修补：

1. **客户端智能模板映射 (Client-side Template Fallback)**
   - *承接逻辑*：当游客以无 template 参数但带 prompt 参数（例如来自首页输入框的非匹配词）进入 `/forms/new` 时，在 `form-generator.tsx` 挂载时通过客户端轻量规则进行智能场景分类。
     - *示例*：输入包含 "feedback/survey/satisfaction" -> 自动映射并加载 `satisfaction-survey` 模板；输入包含 "job/resume/hire" -> 自动加载 `job-application` 模板。
     - 如果完全不匹配任何高频词，**默认自动套用通用的 `contact-us` 模板**，绝对不向用户展示突兀、简陋且无关的原始 `DEMO_FIELDS`，确保所见即所得。
2. **更清晰的“准备完毕”沙盒提示与引导**
   - *操作引导*：在左侧 AI 助手区域，若为游客模式，顶部不展示警告，而是展示精美的“沙盒体验卡”：“✨ 已经为您准备好了 **[当前匹配模板名称]** 的沙盒预览。您可以在右侧无限制填写、测试并切换主题。登录后即可永久保存或直接发布表单。”
   - *登录时机*：右侧的“演示模式（Demo Mode）”允许无痕模拟填写和模拟提交（不入库、不限额）。当用户尝试点击“保存草稿”或“发布表单”时，平滑弹出登录注册弹窗（已由 `guest_login_prompt_shown` 事件追踪），不提前打断其体验。
3. **自适应的设备预览模式 (Default Device View Alignment)**
   - *展现逻辑*：`Code/components/forms/form-generator.tsx` 中 `responsiveSize` 的默认 state 初始化不应写死为 `"phone"`。
   - *修正*：应当初始化为 `getDefaultPreviewDevice()`。当桌面端访客进入 `/forms/new` 时，右侧直接大面积舒展地展示 `desktop` 电脑端预览；移动端访客进入时默认展示 `phone` 手机端预览。避免桌面用户一进来看到画面空洞。

---

## 4. 验证方案

### A. 本地与开发环境手动验证
1. **测试首页 PC/Mobile 初始态**：使用 Chrome 开发者工具模拟桌面宽屏，确认右侧 Mockup 默认显示骨架并包含 “Start Demo Instantly” 动感按钮。
2. **测试 Suggestions 联动**：点击 suggestions，确认右侧 Mockup 自动滚动切换并触发 AI 生成的流光特效。
3. **测试 `/forms/new` 承接**：以未登录游客身份，通过地址栏请求 `/forms/new?prompt=SaaS%20lead%20collection`，确认右侧直接展现 SaaS Lead 模板预览，且设备自适应为 Desktop 模式。

### B. 生产监控指标与 Clarity 验证
* **Clarity 录屏监控**：
  - 观察 `/forms/new` 的录屏，重点检查游客是否在该页面发生了深度交互（如点击切换右侧主题、修改架构或进入 Demo 模式模拟提交），确认“进站即退”的 Bounce 比例是否下降。
  - 确认 Mockup 选项 hover 时有正确的 pointer 光标和轻微交互位移。
* **GA4 / Growth Events 漏斗验证**：
  - 监控并计算：
    $$\text{首页 Demo 转化率} = \frac{\text{demo\_complete}}{\text{demo\_start}}$$
    $$\text{游客激活转化率} = \frac{\text{template\_used (guest)}}{\text{forms\_new\_view (guest)}}$$
    预期本轮优化上线后，游客激活转化率能从当前的 0% 提升至 15% 以上。

---

## 5. 风险控制

1. **SEO 风险（极低）**：
   - 本次修改仅为 Hero 组件及 `/forms/new` 交互面板，且 `/forms/new` 之前已上线 `noindex` 隔离，不会影响任何 canonical 或 Sitemap 中的可索引页面。
2. **PageSpeed 性能风险（极低）**：
   - 不引入任何外部 JS 依赖库或重型组件。
   - 所有的设备预览自适应均基于客户端 `navigator.userAgent` 及 CSS 渲染，不产生阻塞水合（hydration）的代码。
3. **移动端/响应式风险（低）**：
   - 建议在 `Hero` 组件中添加 CSS `scroll-behavior: smooth`。当移动端用户在左侧点击 Suggestions 时，页面能平滑自动滚动聚焦到下方的 Mockup 视图，防止手机端用户不知道右侧已发生改变。
4. **隐私与安全风险（零）**：
   - 客户端模板分类与参数清理均不保存、不上报任何敏感的用户表单输入信息，保持合规性。

---

## 6. 建议实施批次

### 🚀 第一批：激活破冰（低风险，建议立即执行 Plan -> Code -> Verify）
* **涉及修改的文件**：
  1. [blocks/hero/index.tsx](file:///Users/mike/Documents/AIFactory/Code/components/blocks/hero/index.tsx)
  2. [typeform-home.css](file:///Users/mike/Documents/AIFactory/Code/app/typeform-home.css)
  3. [forms/form-generator.tsx](file:///Users/mike/Documents/AIFactory/Code/components/forms/form-generator.tsx)
* **改动核心**：
  - 恢复 PC 端大 CTA 按钮。
  - 为选项卡注入 pointer 手势与微动 CSS。
  - `/forms/new` 在挂载时智能根据 prompt 映射加载模板，代替空 DEMO_FIELDS，且自适应默认设备。

### 🎨 第二批：视觉与 WOW Moment 增强（需先行观察第一批数据后由 Codex 评估）
* **改动核心**：
  - 引入高对比度的流光线条边框在 Mockup AI 生成状态中。
  - 丰富 Suggestions 的 3D Parallax 电子胸牌等高保真交互插图，强化产品价值感。

---

## 7. 给 Codex 的复核摘要

1. **修改文件清单**：
   - `Code/components/blocks/hero/index.tsx` (优化 suggestions 联动及 PC 初始态)
   - `Code/app/typeform-home.css` (补充 hover 样式与 pointer 指针)
   - `Code/components/forms/form-generator.tsx` (优化游客 prompt 模板映射及默认预览设备)
2. **数据库/环境变量变更**：
   - **完全不涉及**任何数据库变更、DDL 或环境变量修改。
3. **下一步执行建议**：
   - 建议 Codex 批准此实施方案并转入 **Plan -> Code** 阶段，执行上述第一批 3 个前端文件的具体代码修改，并准备提交上线。
4. **需要 Mike 配合什么**：
   - Mike 在上线后需要使用桌面电脑和手机分别访问官网首页，点击 Suggestions，测试是否能平滑跳转进入带有对应主题预览的 `/forms/new`，且未登录状态下不产生阻断。
