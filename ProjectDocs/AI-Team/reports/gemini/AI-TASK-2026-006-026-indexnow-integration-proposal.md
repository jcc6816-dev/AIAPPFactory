# IndexNow Integration Proposal for GenForms.ai

This document outlines the detailed design and implementation strategy for integrating **IndexNow** to automatically and manually submit optimized canonical URLs to search engines (Bing, Yandex, etc.) whenever content changes.

---

## 1. Environment & Ownership Verification

IndexNow requires a unique API key that matches a text file hosted at the root of the domain to verify domain ownership.

### A. Environment Variable Configuration
Add a secure environment variable to `.env` and `.env.local`:
```bash
INDEXNOW_KEY="a4b3d8c1e7f94025b96317c82e6d5e1a" # Example 32-character hexadecimal key
```
Add its placeholder in [Code/.env.example](file:///Users/mike/Documents/AIFactory/Code/.env.example) (Completed in this task).

### B. Ownership Verification Endpoint
To verify domain ownership, search engines will check `https://genforms.ai/{INDEXNOW_KEY}.txt`. We will create a dynamic route or a static rewrite. 

#### Recommended Dynamic Verification Route:
Create [Code/app/[key].txt/route.ts](file:///Users/mike/Documents/AIFactory/Code/app/%5Bkey%5D.txt/route.ts):
```typescript
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const configuredKey = process.env.INDEXNOW_KEY;

  if (!configuredKey || key !== configuredKey) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // Return the key itself as plain text as required by IndexNow
  return new NextResponse(configuredKey, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
```
*Note: This eliminates the need to hardcode a static file in the `public/` directory, letting us manage the key dynamically and rotate it easily via environment variables.*

---

## 2. Helper Service Layer (`Code/services/indexnow.ts`)

Create a core service at [Code/services/indexnow.ts](file:///Users/mike/Documents/AIFactory/Code/services/indexnow.ts) to handle filtering, canonical URL formatting, and HTTP POST submission.

```typescript
const HOST = "genforms.ai";
const BASE_URL = `https://${HOST}`;
const INDEXNOW_API_ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * Filter checks to ensure URLs are canonical and safe for indexing.
 * STRICTLY BLOCKS:
 * - workspace / edit pages (/forms/new, /forms/[id])
 * - admin console routes (/admin/*)
 * - query parameter variations (containing ?)
 * - dynamic shared links (/f/*)
 * - login, signup, checkouts, and system paths
 */
export function isSafeCanonicalUrl(urlStr: string): boolean {
  try {
    const url = new URL(urlStr);
    
    // 1. Host validation
    if (url.host !== HOST) return false;
    
    // 2. Query param & Hash check
    if (url.search || url.hash) return false;
    
    const pathname = url.pathname;
    
    // 3. Blacklist check
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
 * Submits a list of relative or absolute URLs to the IndexNow API.
 */
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; message: string }> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    return { success: false, message: "INDEXNOW_KEY is not configured in env" };
  }

  // Normalize all URLs to absolute canonical URLs and filter out unsafe paths
  const targetUrls = urls
    .map(url => (url.startsWith("http") ? url : `${BASE_URL}${url}`))
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
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 200) {
      return { success: true, message: `Successfully submitted ${targetUrls.length} URLs.` };
    } else {
      const text = await res.text();
      return { success: false, message: `IndexNow API error (${res.status}): ${text}` };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error during IndexNow submission",
    };
  }
}
```

---

## 3. Hook Triggers (Integration Points)

We will hook IndexNow notifications into three key administrative workflows:

### Hook A: Blog Post Publication Toggles
In [Code/app/[locale]/(admin)/admin/posts/page.tsx:setPostPublicationStatus](file:///Users/mike/Documents/AIFactory/Code/app/%5Blocale%5D/%28admin%29/admin/posts/page.tsx#L15-L53):
```typescript
  // Right after updatePost succeeds and status is set to Online
  if (status === PostStatus.Online && slug) {
    const targetUrl = locale === "en" ? `/posts/${slug}` : `/${locale}/posts/${slug}`;
    // Fire and forget or handle asynchronously
    submitToIndexNow([targetUrl]).catch(console.error);
  }
```

### Hook B: Automated Blog Writing & Publishing
In [Code/services/blog-automation.ts](file:///Users/mike/Documents/AIFactory/Code/services/blog-automation.ts):
When automated tasks successfully post or update online posts:
```typescript
  if (updatedPost.status === PostStatus.Online && updatedPost.slug) {
    const targetUrl = post.locale === "en" ? `/posts/${post.slug}` : `/${post.locale}/posts/${post.slug}`;
    submitToIndexNow([targetUrl]).catch(console.error);
  }
```

### Hook C: Manual Article Editor Save
In [Code/app/[locale]/(admin)/admin/posts/[uuid]/edit/page.tsx](file:///Users/mike/Documents/AIFactory/Code/app/%5Blocale%5D/%28admin%29/admin/posts/%5Buuid%5D/edit/page.tsx):
When a post status is updated/saved directly to Online status.

---

## 4. Admin Console Integration

To allow administrators (Mike) to manually submit all sitemap URLs or individual URLs, we can:

1. **Add a Trigger Interface in Search Console Tab**:
   In [Code/components/admin/search-console-tab.tsx](file:///Users/mike/Documents/AIFactory/Code/components/admin/search-console-tab.tsx), add an "IndexNow Panel" showing:
   - Configuration status (Key presence check).
   - "Submit Entire Sitemap" button (queries [sitemap.ts](file:///Users/mike/Documents/AIFactory/Code/app/sitemap.ts), filters URLs, and submits batch).
   - "Submit Custom URL" input box with single-url submit button.
   
2. **Add a Protected Admin Action API**:
   Create [Code/app/api/admin/indexnow/route.ts](file:///Users/mike/Documents/AIFactory/Code/app/api/admin/indexnow/route.ts) that handles POST requests from the admin interface (secured with NextAuth admin checks).
