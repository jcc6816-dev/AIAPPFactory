# GenForms.ai 2026-06-12 优化工作计划

> 日期：2026-06-12  
> 主线：产品体验激活 + SEO 稳定增长  
> 原则：先验证今天上线的首屏与创建页改动，再继续推进高价值页面，不做大批量低质量新增页面。

## 1. 明日目标

明天的目标不是“多做几个零散功能”，而是确认新首页首屏是否真正改善游客进入漏斗的概率，并继续围绕已经有展示的页面做低风险、高收益优化。

核心目标：

- 首页首屏更清爽后，确认 `Login`、主 CTA、Suggestions 和 Mockup 在常见桌面视口都可见。
- 验证游客从首页建议场景进入 `/forms/new` 后，是否能看到匹配模板和更有冲击力的预览。
- 复盘 GSC 与 GA4 最新 24 小时数据，判断 SEO 方向是否继续健康。
- 复盘 Clarity 录屏和热力图，优先找出首页、`/forms/new` 的真实流失点。
- 只对已有展示或高意图页面做小步优化，不大规模新增内容。

## 2. 优先级安排

### P0：生产体验验收

负责人：Codex 主导，Mike 配合截图或口头反馈，Gemini 可做只读核验。

任务：

1. 检查生产首页英文和中文版本：
   - `https://genforms.ai/`
   - `https://genforms.ai/zh`
2. 确认顶部菜单不再挤压 `Login`。
3. 确认 `Console / 工作台` 和 `View Delivery Path / 查看落地路径` 不再出现在公开首页导航。
4. 确认 `AI Form SaaS V2.0` 徽标已移除。
5. 在常见桌面视口确认 Suggestions 能进入首屏或至少明显露出。
6. 点击首页 Suggestions，确认右侧 Mockup 原地进入 demo，而不是直接跳转。
7. 点击 `Customize this form / 开始自定义表单`，确认进入 `/forms/new` 后带有 `template` 和 `prompt` 参数。

验收标准：

- 首页导航不遮挡登录入口。
- 首屏没有无意义版本徽标。
- 用户无需输入也能看到 demo 价值。
- `/forms/new` 不再出现顶部未登录横幅挤压预览。

### P0：数据复盘

负责人：Codex 分析，Mike 提供导出文件或截图。

需要 Mike 明天提供：

- GSC 最近 24 小时或最近 7 天数据截图/导出。
- GA4 最近 24 小时事件数据，重点看：
  - `demo_start`
  - `demo_complete`
  - `template_use_click`
  - `form_generate`
  - `form_publish`
  - `form_submit`
- Clarity 首页与 `/forms/new` 最新录屏或热力图摘要。

判断重点：

- 曝光是否继续增长。
- 是否开始出现首页 demo 事件。
- 是否有用户进入 `/forms/new` 后快速退出。
- 是否有真实用户从 SEO 页面进入后点击 CTA。

### P1：`/forms/new` 游客激活体验优化

负责人：Gemini 可先做只读审计与方案，Codex 复核后决定是否改代码。

候选优化：

1. PC 端默认展示 Desktop 预览，移动端默认展示 Phone 预览。
2. 当 URL 带 `template=event-registration` 时，预览内容必须明显对应“活动/门票/峰会”，不能像通用演示表单。
3. 游客模式下左侧按钮文案要避免“点击生成后才发现要登录”的挫败感，可改成更诚实的：
   - “登录后生成自定义版本”
   - “先体验当前模板”
4. 右侧预览区增加轻量提示：这是可交互沙盒，保存/发布时再登录。

边界：

- 不改 Auth。
- 不改数据库 schema。
- 不改支付。
- 不调用真实 AI 生成。

### P1：已有高潜页面小步优化

负责人：Gemini 做内容/内链审计，Codex 决定是否落地。

优先页面：

- `/posts/typeform-alternatives`
- `/posts/feishu-dingtalk-webhook-notification`
- `/solutions/lead-magnet-download-form`
- `/templates/content-download`
- `/templates/job-application`
- `/templates/nps-survey`

优化方向：

- 不频繁改标题和正文主体。
- 只补强首屏 CTA、内部链接、相关模板入口、FAQ 和对比摘要。
- 每次改动后记录原因，避免对已索引页面反复大改。

### P2：外部发现信号

负责人：Mike 或 Workbuddy 执行，Codex/Gemini 提供文案。

明天不强推大规模外部提交。

只有在首页与 `/forms/new` 验收稳定后，才继续执行低风险目录提交或社区评论。

## 3. Gemini 明日任务建议

Gemini 明天可以优先做这些工作：

1. 只读审计生产首页与 `/forms/new` 最新体验，输出中文验收报告。
2. 基于 Clarity/GSC/GA4 数据，判断首页 demo 是否提升漏斗前置行为。
3. 审计 `/forms/new` 游客体验，提出小修清单，不直接改 Auth、DB、支付。
4. 审计高潜页面的 CTA 与内链，不建议大改已索引正文。
5. 如果提出代码改动，必须标明：
   - 漏斗节点
   - 数据证据
   - 修改文件
   - 风险等级
   - 验证方式

## 4. Codex 明日任务建议

Codex 明天优先做：

1. 复核 Gemini 的体验审计与代码建议。
2. 对 P0/P1 小修直接实现并部署。
3. 分析 Mike 提供的新 GSC、GA4、Clarity 数据。
4. 更新产品体验计划与 Mike 待办看板。
5. 严格控制 SEO 页面改动节奏，避免为“看起来忙”而制造低质量页面。

## 5. Mike 明日配合事项

Mike 明天优先做三件事：

1. 清 Cloudflare 首页缓存后，用真实电脑访问英文/中文首页，确认导航和首屏 Suggestions 是否改善。
2. 导出或截图 GSC、GA4、Clarity 最新数据。
3. 如果发现真实访客录屏中有明显卡点，标出时间点和页面路径。

## 6. 明日结束标准

明天结束时，至少要形成以下结果：

- 首页首屏生产体验明确通过或列出具体缺陷。
- `/forms/new` 游客体验有一份明确改进清单。
- 最新 GSC/GA4/Clarity 数据完成一次复盘。
- 至少完成 1-2 个高价值、低风险的产品体验或 SEO 转化优化。
- 所有需要 Mike 做的事项同步进 `user_action_tracker.md`。
