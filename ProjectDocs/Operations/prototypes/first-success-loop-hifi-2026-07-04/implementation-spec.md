# GenForms First Success Loop 前端实施规范 (Implementation Spec)

## 1. 页面结构与组件复用关系

为了保证开发的高效性和产品体验的一致性，各状态共享同一套底层流式布局：

*   **`ContextBanner` 组件**：在 `Context-loaded` 状态高亮展示，在 `Generated Draft` 中退化为精简版，帮助用户了解当前 AI 处于什么上下文环境。
*   **`FormPreview` 容器**：复用于多个核心阶段。这是 GenForms.ai 的核心展示区，真实渲染 Event Registration 的各种输入控件（只读或可交互）。
*   **`ActionRail` (桌面端专属)**：固定在右侧的 280px 状态容器，统筹管理桌面端所有操作。包含状态机当前 Title、说明和可执行的 CTA 列表。
*   **`StickyBottomCTA` (移动端专属)**：移动端必须隐藏桌面级的 Sidebar 和 Action Rail。所有页面的主 CTA 必须置于底部悬浮栏中（带有顶部白色渐变遮罩），并占据 100% 宽度。

## 2. 各状态唯一主 CTA 与交互规范

前端实施时，必须确保每一种状态的视图中只存在**一个**使用 `btn-primary` 的主按钮，绝对不允许出现平级的蓝按钮：

| 产品状态 | 桌面端主 CTA / 移动端主 CTA |
| :--- | :--- |
| **Context-loaded** | `Generate this form` |
| **Generated Draft** | `Publish form` |
| **Publish Success** | `Send free test` |
| **Test Runner** | `Submit test response` |
| **First Result** | `Share public form` |
| **Empty Submissions** | `Send test submission` |

**特别注意**：
*   **Publish Success**：不再有团队邮箱发送入口和临时测试链接（Temporary test link）生成。
*   **移动端清理**：在移动视图下，彻底移除了底部全局导航（如 Forms/Analytics），保持页面的纯净，不展示任何不存在或无关的字段。

## 3. 桌面 (1440x900) 和移动端 (390x844) 差异

*   **视口与布局**：桌面端采用 `1440x900` 视口基准，左中右三栏结构（Sidebar + Workspace + ActionRail）；移动端采用 `390x844` 基准，全流式单列结构，没有多余的外壳或假地址栏。
*   **操作降级**：当次级操作过多时，桌面端可以纵向排列，移动端需将其整合进次级操作（如 `More Options`）。

## 4. 多语言适配与文本膨胀规则 (zh & es)

*   **自适应宽度**：所有按钮不应锁死宽度（除移动端 100% width 以外），应根据文字长度自适应。长文本（如西语 "Publicación exitosa" 或 "Enviar prueba gratuita"）必须允许换行或自适应扩展，不能被截断。
*   **字体栈回退**：UI 统一使用 `Inter`。CSS `font-family` 需指定中日韩回退：`'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`。
*   **URL Parameter 驱动**：使用 `?lang=zh` 或 `?lang=es` 进行国际化驱动测试，保证无刷新切换，不丢失上下文。

## 5. 动效建议 (150-250ms)

动画必须克制且具有极强的功能性指引意义，建议采用标准 CSS Transition 解决：
*   **Button Hover/Active**：`transition: background-color 150ms ease;`。
*   **状态淡入淡出**：不同核心状态之间的内容切换，采用跨度 200ms 的 Crossfade (`opacity`)，保持平滑。
*   **弹窗与悬浮菜单**：位移动画（如 Bottom Sheet 升起）应采用 `250ms cubic-bezier(0.16, 1, 0.3, 1)`。

## 6. 前端实施优先级划分

*   **P0 (Blocker 阻断性)**：
    *   移除所有的老旧虚构品牌（ContentHub 等），全站统一切换为 GenForms.ai。
    *   移除 Publish Success 中的虚假发邮件流程和临时链接，确保主 CTA 指向正确的内部 Test Runner。
    *   全套移动端 Sticky Bottom CTA 结构，移除无关全局 Bottom Nav。
*   **P1 (Critical 关键特性)**：
    *   实现桌面端统一的 `Action Rail` 状态机。
    *   支持动态的多语言文案替换架构（i18n）。
    *   真实的 Event Registration 字段只读/编辑渲染层。
*   **P2 (Enhancement 优化项)**：
    *   基于 150ms 规则的 Hover/Active 微动效。
    *   Empty Submissions 的空状态插画与引导交互。
