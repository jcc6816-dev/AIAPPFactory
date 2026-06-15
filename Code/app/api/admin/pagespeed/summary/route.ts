import { getUserEmail } from "@/services/user";
import { respData } from "@/lib/resp";
import crypto from "crypto";
import { pageSpeedCache } from "./cache";

export const runtime = "nodejs";

// Whitelist of inspectable URLs for security
const WHITELIST_URLS = [
  "https://genforms.ai",
  "https://genforms.ai/",
  "https://genforms.ai/templates",
  "https://genforms.ai/posts/typeform-alternatives",
  "https://genforms.ai/forms/new"
];

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours TTL

// Administrator check helper
async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("unauthorized");
  }
}

export async function GET(req: Request) {
  try {
    // 1. Authenticate administrator
    try {
      await requireAdmin();
    } catch (e) {
      return Response.json({ code: 403, message: "unauthorized" }, { status: 403 });
    }

    // 2. Parse and validate query params
    const { searchParams } = new URL(req.url);
    const urlParam = searchParams.get("url") || "https://genforms.ai/";
    const strategyParam = searchParams.get("strategy") || "mobile";

    if (strategyParam !== "mobile" && strategyParam !== "desktop") {
      return Response.json({
        code: 1,
        message: "参数 strategy 错误，仅支持 mobile 或 desktop。"
      }, { status: 400 });
    }

    const normalizedUrl = urlParam.trim();
    if (!WHITELIST_URLS.includes(normalizedUrl)) {
      return Response.json({
        code: 1,
        message: "不在允许巡检范围内"
      }, { status: 400 });
    }

    // 3. Verify API Key configuration
    const apiKey = process.env.PAGESPEED_API_KEY;
    if (!apiKey) {
      return Response.json({
        code: 1,
        message: "Google PageSpeed API Key 未配置，请在环境变量中设置 PAGESPEED_API_KEY。"
      });
    }

    // 4. Check memory cache
    const keyFingerprint = crypto.createHash("sha256").update(apiKey).digest("hex");
    const cacheKey = `${keyFingerprint}_${strategyParam}_${normalizedUrl}`;
    const now = Date.now();
    const cachedEntry = pageSpeedCache.get(cacheKey);

    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL) {
      return respData({
        ...cachedEntry.data,
        fromCache: true,
        lastFetchedAt: new Date(cachedEntry.timestamp).toISOString()
      });
    }

    // 5. Fetch from Google PageSpeed API
    const googlePsiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      normalizedUrl
    )}&strategy=${strategyParam}&category=performance&category=accessibility&category=best-practices&category=seo&key=${apiKey}`;

    const response = await fetch(googlePsiUrl);
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`PageSpeed API response error: ${response.status} - ${errText}`);
      return Response.json({
        code: 2,
        message: `Google PageSpeed API 调用失败，请检查 API 配置或网络。 (HTTP ${response.status})`
      });
    }

    const json = await response.json();
    if (!json.lighthouseResult) {
      return Response.json({
        code: 2,
        message: "Google PageSpeed API 返回数据无效，未包含 Lighthouse 结果。"
      });
    }

    const lighthouseResult = json.lighthouseResult;
    const categories = lighthouseResult.categories || {};
    const audits = lighthouseResult.audits || {};

    // 6. Map scores
    const scores = {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100)
    };

    // 7. Map core metrics
    const metrics = {
      fcp: audits["first-contentful-paint"]?.displayValue || "0 s",
      lcp: audits["largest-contentful-paint"]?.displayValue || "0 s",
      tbt: audits["total-blocking-time"]?.displayValue || "0 ms",
      cls: audits["cumulative-layout-shift"]?.displayValue || "0",
      tti: audits["interactive"]?.displayValue || "0 s",
      speedIndex: audits["speed-index"]?.displayValue || "0 s"
    };

    // 8. Extract top 5 opportunities
    const opportunities: Array<{ id: string; title: string; displayValue: string }> = [];
    for (const [auditId, audit] of Object.entries(audits) as any[]) {
      if (audit.details && audit.details.type === "opportunity" && audit.details.overallSavingsMs > 0) {
        opportunities.push({
          id: auditId,
          title: audit.title,
          displayValue: audit.displayValue,
          // Used internally for sorting
          overallSavingsMs: audit.details.overallSavingsMs
        } as any);
      }
    }
    opportunities.sort((a: any, b: any) => b.overallSavingsMs - a.overallSavingsMs);
    const topOpportunities = opportunities.slice(0, 5).map((opp) => ({
      id: opp.id,
      title: opp.title,
      displayValue: opp.displayValue
    }));

    // 9. Extract diagnostics
    const diagnostics = {
      totalByteWeight: audits["total-byte-weight"]?.displayValue || "0 KiB",
      numRequests: audits["network-requests"]?.details?.items?.length || 0
    };

    const payload = {
      url: normalizedUrl,
      strategy: strategyParam as "mobile" | "desktop",
      scores,
      metrics,
      opportunities: topOpportunities,
      diagnostics
    };

    // 10. Update cache
    pageSpeedCache.set(cacheKey, {
      data: payload,
      timestamp: now
    });

    return respData({
      ...payload,
      fromCache: false,
      lastFetchedAt: new Date(now).toISOString()
    });

  } catch (error: any) {
    console.error("Internal error in PageSpeed summary route:", error);
    return Response.json({
      code: 3,
      message: `系统内部错误，无法获取 PageSpeed 数据: ${error.message || "Unknown error"}`
    });
  }
}
