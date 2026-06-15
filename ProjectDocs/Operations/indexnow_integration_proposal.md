# IndexNow Integration Proposal for GenForms.ai

> **来源**：本文档由 Gemini 在 AI-TASK-2026-006-026 执行阶段生成，经 Codex 复核后整理至共享目录。  
> **版本**：v1.1（含 Codex 复核硬约束更新）  
> **状态**：已通过设计阶段审核，待进入代码实现阶段  
> **原始路径**：`ProjectDocs/AI-Team/reports/gemini/AI-TASK-2026-006-026-indexnow-integration-proposal.md`

---

## 背景

IndexNow 是 Bing、Yandex 等搜索引擎支持的主动索引通知协议。每当 GenForms.ai 发布/更新博客文章，主动调用 IndexNow API 可大幅缩短 Bing 抓取延迟（从数天→数小时）。

---

## Codex 复核硬约束（必须遵守）

> [!IMPORTANT]
> 以下约束由 Codex 在复核中强制要求，实现时不得绕过。

### 禁止提交的 URL（黑名单）
- `/forms/new`
- `/admin` 及其所有子路径
- `/f/*`（表单分享链接）
- auth / login / billing / payment / dashboard / workspace 页面
- 任何含 `?` query 参数的 URL
- 任何含 `#` hash 的 URL

### 故障处理约束
- IndexNow 失败**不得阻断**博客发布流程
- 失败只记录日志或后台静默提示，不向用户抛出错误

### 验证文件路由约束
- `/{key}.txt` 在 key 不匹配时**必须返回 404**，不暴露更多信息（如不匹配 key 的内容或 500 错误）

### 后台手动提交 UI 约束
- 按钮文案必须明确写 **"Bing / IndexNow 提交"**
- 不要混入 GSC（Google Search Console）的语义框架

### 测试约束（Vitest，必须覆盖）
1. `INDEXNOW_KEY` 缺失时的行为
2. URL 被黑名单拒绝的情况
3. URL 被允许通过的情况
4. 第三方 IndexNow API 调用失败时的脱敏处理
5. key 验证文件正确返回 key 内容
6. key 不匹配时返回 404

---

## 1. 环境变量配置

在 `.env.local` 和 `.env.example` 中添加：

```bash
# IndexNow 提交密钥（生成方式：openssl rand -hex 16）
# 对应验证文件路由：/{INDEXNOW_KEY}.txt
INDEXNOW_KEY=""
```

> ✅ 已在 AI-TASK-2026-006-026 中完成 `.env.example` 的占位符添加。

---

## 2. 域名所有权验证路由

**文件**：`Code/app/[key].txt/route.ts`

```typescript
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const configuredKey = process.env.INDEXNOW_KEY;

  // key 不匹配或未配置，严格返回 404，不暴露额外信息
  if (!configuredKey || key !== configuredKey) {
    return new NextResponse("Not Found", { status: 404 });
  }

  return new NextResponse(configuredKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
```

**优点**：key 通过环境变量管理，无需在 `public/` 目录放静态文件，支持轮换 key。

---

## 3. 服务层（核心过滤 + 提交逻辑）

**文件**：`Code/services/indexnow.ts`

```typescript
const HOST = "genforms.ai";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * URL 安全性过滤：只允许公开 canonical URL 被提交。
 * 严格拒绝：管理后台、表单编辑、分享链接、支付、auth、带参数的 URL。
 */
export function isSafeCanonicalUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);

    // 1. 必须是本站域名
    if (url.host !== HOST) return false;

    // 2. 不允许带 query 或 hash
    if (url.search || url.hash) return false;

    const pathname = url.pathname;

    // 3. 黑名单检查
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/forms") ||
      pathname.startsWith("/f/") ||
      pathname.startsWith("/pay-") ||
      pathname.includes("/auth/") ||
      pathname === "/settings" ||
      pathname === "/my-credits" ||
      pathname === "/my-orders" ||
      pathname === "/my-invites"
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * 提交 URL 列表到 IndexNow API。
 * 失败只记录日志，不向调用方抛出异常，不阻断主业务流程。
 */
export async function submitToIndexNow(
  urls: string[]
): Promise<{ success: boolean; message: string }> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.warn("[IndexNow] INDEXNOW_KEY is not configured in env");
    return { success: false, message: "INDEXNOW_KEY is not configured in env" };
  }

  // 归一化为绝对 URL 并过滤
  const targetUrls = urls
    .map((url) => (url.startsWith("http") ? url : `${BASE_URL}${url}`))
    .filter(isSafeCanonicalUrl);

  if (targetUrls.length === 0) {
    return { success: false, message: "No safe canonical URLs found to submit" };
  }

  try {
    const payload = {
      host: HOST,
      key: key,
      keyLocation: `${BASE_URL}/${key}.txt`,
      urlList: targetUrls,
    };

    const res = await fetch(INDEXNOW_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.status === 200) {
      console.info(`[IndexNow] Submitted ${targetUrls.length} URLs successfully.`);
      return { success: true, message: `Successfully submitted ${targetUrls.length} URLs.` };
    } else {
      // 脱敏：不在日志中打印完整响应体，只打印状态码
      console.warn(`[IndexNow] API returned status ${res.status}`);
      return { success: false, message: `IndexNow API error (${res.status})` };
    }
  } catch (error) {
    // 脱敏：只记录 message，不打印完整 stack 到生产日志
    const msg = error instanceof Error ? error.message : "Network error";
    console.warn(`[IndexNow] Submission failed: ${msg}`);
    return { success: false, message: msg };
  }
}
```

---

## 4. 集成触发点

### Hook A：博客文章发布切换
**文件**：`Code/app/[locale]/(admin)/admin/posts/page.tsx`

在 `updatePost` 成功且状态变为 Online 后（fire-and-forget，不阻断）：
```typescript
if (status === PostStatus.Online && slug) {
  const targetUrl = locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`;
  submitToIndexNow([targetUrl]).catch((e) => console.warn("[IndexNow] Hook A failed:", e.message));
}
```

### Hook B：自动化博客发布服务
**文件**：`Code/services/blog-automation.ts`
```typescript
if (updatedPost.status === PostStatus.Online && updatedPost.slug) {
  const targetUrl = post.locale === "en"
    ? `/posts/${post.slug}`
    : `/${post.locale}/posts/${post.slug}`;
  submitToIndexNow([targetUrl]).catch((e) => console.warn("[IndexNow] Hook B failed:", e.message));
}
```

### Hook C：管理员文章编辑器直接发布
**文件**：`Code/app/[locale]/(admin)/admin/posts/[uuid]/edit/page.tsx`

在状态保存为 Online 时触发，逻辑同 Hook A。

---

## 5. 后台手动提交入口

**文件**：`Code/components/admin/search-console-tab.tsx`（新增 IndexNow 面板）

UI 要素（文案约束）：
- 面板标题：**"Bing / IndexNow 提交"**（不用 "Search Console 提交" 等混淆说法）
- 显示：Key 配置状态（是否已设置）
- 按钮："提交全部 Sitemap URL 到 Bing"
- 输入框 + 按钮："提交单个 URL 到 Bing / IndexNow"

**API 路由**：`Code/app/api/admin/indexnow/route.ts`（NextAuth admin 校验保护）

---

## 6. 需要新建/修改的文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `Code/app/[key].txt/route.ts` | 新建 | 域名验证路由 |
| `Code/services/indexnow.ts` | 新建 | 过滤 + 提交服务层 |
| `Code/app/api/admin/indexnow/route.ts` | 新建 | 后台手动提交 API |
| `Code/components/admin/search-console-tab.tsx` | 修改 | 新增 IndexNow 面板 |
| `Code/app/[locale]/(admin)/admin/posts/page.tsx` | 修改 | Hook A：发布切换触发 |
| `Code/services/blog-automation.ts` | 修改 | Hook B：自动化发布触发 |
| `Code/tests/indexnow.test.ts` | 新建 | Vitest 单元测试 |

---

## 7. Vitest 测试覆盖要求

**文件**：`Code/tests/indexnow.test.ts`

必须覆盖场景：
1. ✅ `INDEXNOW_KEY` 缺失 → 返回 `{ success: false }`，不抛出异常
2. ✅ URL 被黑名单拒绝（如 `/admin`, `/forms/new`, `/f/xxx`, 带 `?` 的 URL）
3. ✅ URL 被允许通过（如 `/posts/my-article`）
4. ✅ IndexNow API 返回非 200 → 脱敏处理，只返回状态码
5. ✅ 验证路由：key 匹配 → 返回 200 + key 内容
6. ✅ 验证路由：key 不匹配 → 返回 404

---

## 8. 风险与注意事项

| 风险 | 缓解措施 |
|------|----------|
| IndexNow API 不稳定 | fire-and-forget，catch 只记录日志 |
| key 泄露 | 通过 env 管理，不 hardcode，不在日志明文输出 |
| 误提交内部 URL | `isSafeCanonicalUrl` 黑名单过滤 |
| 黑名单不完整 | 单元测试覆盖每个黑名单规则 |
| 后台 UI 混淆为 GSC | 文案强制写明 "Bing / IndexNow" |
