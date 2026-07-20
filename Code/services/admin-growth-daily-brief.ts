import crypto from "crypto";
import { getClarityMetricCount } from "@/lib/clarity-metrics";
import moment from "moment";

// ===== 强内存缓存定义 =====
interface CacheEntry {
  data: any;
  timestamp: number;
}

const gscCacheMap = new Map<string, CacheEntry>();
const ga4CacheMap = new Map<string, CacheEntry>();
const clarityCacheMap = new Map<string, CacheEntry>();

const GSC_CACHE_TTL = 24 * 60 * 60 * 1000;   // 24h
const GA4_CACHE_TTL = 60 * 60 * 1000;        // 1h
const CLARITY_CACHE_TTL = 12 * 60 * 60 * 1000; // 12h

const TARGET_EVENTS = [
  "demo_start",
  "demo_complete",
  "template_use_click",
  "form_generate",
  "form_publish",
  "form_submit",
];

// ===== Google Access Token Helper =====
function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getGoogleAccessToken(
  authMode: "oauth" | "service_account",
  credentials: {
    privateKey?: string;
    clientEmail?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  },
  scope: string
): Promise<string> {
  if (authMode === "oauth") {
    const { clientId, clientSecret, refreshToken } = credentials;
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: clientId || "",
        client_secret: clientSecret || "",
        refresh_token: refreshToken || "",
      }),
    });

    if (!response.ok) {
      throw { status: response.status, message: "Failed to authenticate with Google OAuth." };
    }

    const data = await response.json();
    if (!data.access_token) {
      throw { status: 500, message: "No access token returned in OAuth response." };
    }
    return data.access_token;
  } else {
    const { privateKey, clientEmail } = credentials;
    if (!privateKey || !clientEmail) {
      throw { status: 400, message: "Missing Service Account credentials." };
    }

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claimSet = {
      iss: clientEmail,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const signatureInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(claimSet))}`;
    const formattedKey = privateKey.replace(/\\n/g, "\n");
    const signature = crypto
      .createSign("RSA-SHA256")
      .update(signatureInput)
      .sign(formattedKey);
    const jwt = `${signatureInput}.${base64Url(signature)}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      throw { status: response.status, message: "Google Service Account OAuth exchange failed." };
    }

    const data = await response.json();
    return data.access_token;
  }
}

// ===== GSC Data Fetcher & Mapper =====
function mapGscRows(gscData: any) {
  if (!gscData || !Array.isArray(gscData.rows)) return [];
  return gscData.rows.map((row: any) => ({
    key: Array.isArray(row.keys) ? row.keys[0] : "Unknown",
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    ctr: Number((row.ctr || 0) * 100),
    position: Number(row.position || 0),
  }));
}

export async function getGscSummaryMetrics(numOfDays: number) {
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const propertyUrl = process.env.GSC_PROPERTY_URL;

  if (!propertyUrl) {
    return { status: "not_configured" as const };
  }

  const oauthKeys = [oauthClientId, oauthClientSecret, oauthRefreshToken];
  const oauthPresentCount = oauthKeys.filter(Boolean).length;
  const isOauthComplete = oauthPresentCount === 3;
  const isOauthPartial = oauthPresentCount > 0 && oauthPresentCount < 3;

  if (isOauthPartial) {
    return { status: "error" as const, message: "Google OAuth variables are partially configured." };
  }

  let authMode: "oauth" | "service_account" = "oauth";
  let authFingerprint = "";

  let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!serviceAccountKey && base64Key) {
    try {
      serviceAccountKey = Buffer.from(base64Key, "base64").toString("utf-8");
    } catch (_) {}
  }

  let privateKey = "";
  let clientEmail = "";

  if (isOauthComplete) {
    authMode = "oauth";
    authFingerprint = crypto.createHash("sha256").update(oauthRefreshToken || "").digest("hex");
  } else {
    // Fallback to Service Account
    if (!serviceAccountKey) {
      return { status: "not_configured" as const };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(serviceAccountKey);
    } catch (_) {
      return { status: "error" as const, message: "Invalid JSON format for GSC credentials." };
    }

    privateKey = parsed.private_key;
    clientEmail = parsed.client_email;
    if (!privateKey || !clientEmail) {
      return { status: "not_configured" as const };
    }

    authMode = "service_account";
    authFingerprint = crypto.createHash("sha256").update(serviceAccountKey).digest("hex");
  }

  const propertyFingerprint = crypto.createHash("sha256").update(propertyUrl).digest("hex");
  const cacheKey = `${authMode}_${authFingerprint}_${propertyFingerprint}_gsc_${numOfDays}`;
  const now = Date.now();
  const cached = gscCacheMap.get(cacheKey);

  if (cached && now - cached.timestamp < GSC_CACHE_TTL) {
    return { status: "ready" as const, fromCache: true, data: cached.data };
  }

  let token = "";
  try {
    token = await getGoogleAccessToken(
      authMode,
      {
        privateKey,
        clientEmail,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
      },
      "https://www.googleapis.com/auth/webmasters.readonly"
    );
  } catch (err: any) {
    const httpStatus = err.status || 500;
    console.error("GSC Token Exchange Error in Daily Brief helper (HTTP status):", httpStatus);
    return {
      status: "error" as const,
      message: authMode === "oauth" ? "Failed to authenticate with Google OAuth." : "Failed to authenticate with Google Service Account.",
    };
  }

  try {
    const endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const startDate = moment().subtract(numOfDays, "days").format("YYYY-MM-DD");

    const [queriesRaw, pagesRaw] = await Promise.all(
      ["query", "page"].map(async (dim) => {
        const res = await fetch(
          `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              startDate,
              endDate,
              dimensions: [dim],
              rowLimit: 100,
            }),
          }
        );
        if (!res.ok) throw { status: res.status };
        return res.json();
      })
    );

    const summaryRes = await fetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDate, endDate, rowLimit: 1 }),
      }
    );
    if (!summaryRes.ok) throw { status: summaryRes.status };
    const summaryRaw = await summaryRes.json();

    const summaryRow = summaryRaw.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const payload = {
      summary: {
        clicks: Number(summaryRow.clicks || 0),
        impressions: Number(summaryRow.impressions || 0),
        ctr: Number((summaryRow.ctr || 0) * 100),
        position: Number(summaryRow.position || 0),
      },
      queries: mapGscRows(queriesRaw),
      pages: mapGscRows(pagesRaw),
    };

    gscCacheMap.set(cacheKey, { data: payload, timestamp: now });
    return { status: "ready" as const, fromCache: false, data: payload };

  } catch (err: any) {
    const httpStatus = err.status || 500;
    console.error("GSC fetching error in Daily Brief helper (HTTP status):", httpStatus);
    return {
      status: "error" as const,
      message: `Failed to fetch data from Google Search Console (HTTP ${httpStatus})`,
    };
  }
}

// ===== GA4 Data Fetcher & Mapper =====
function metricValue(row: any, index: number) {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function dimensionValue(row: any, index: number) {
  return String(row?.dimensionValues?.[index]?.value || "Unknown");
}

function mapMetricRows(report: any) {
  if (!Array.isArray(report?.rows)) return [];
  return report.rows.map((row: any) => ({
    key: dimensionValue(row, 0),
    sessions: metricValue(row, 0),
    activeUsers: metricValue(row, 1),
    eventCount: metricValue(row, 2),
  }));
}

function mapEventRows(report: any) {
  const counts = new Map<string, number>();
  for (const eventName of TARGET_EVENTS) {
    counts.set(eventName, 0);
  }

  if (Array.isArray(report?.rows)) {
    for (const row of report.rows) {
      const eventName = dimensionValue(row, 0);
      if (counts.has(eventName)) {
        counts.set(eventName, metricValue(row, 0));
      }
    }
  }

  return TARGET_EVENTS.map((eventName) => ({
    eventName,
    eventCount: counts.get(eventName) || 0,
  }));
}

async function runGa4Report(accessToken: string, propertyId: string, body: any) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw { status: res.status };
  return res.json();
}

export async function getGa4SummaryMetrics(numOfDays: number) {
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  const propertyId = process.env.GA4_PROPERTY_ID;

  if (!propertyId) {
    return { status: "not_configured" as const };
  }

  const oauthKeys = [oauthClientId, oauthClientSecret, oauthRefreshToken];
  const oauthPresentCount = oauthKeys.filter(Boolean).length;
  const isOauthComplete = oauthPresentCount === 3;
  const isOauthPartial = oauthPresentCount > 0 && oauthPresentCount < 3;

  if (isOauthPartial) {
    return { status: "error" as const, message: "Google OAuth variables are partially configured." };
  }

  let authMode: "oauth" | "service_account" = "oauth";
  let authFingerprint = "";

  let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!serviceAccountKey && base64Key) {
    try {
      serviceAccountKey = Buffer.from(base64Key, "base64").toString("utf-8");
    } catch (_) {}
  }

  let privateKey = "";
  let clientEmail = "";

  if (isOauthComplete) {
    authMode = "oauth";
    authFingerprint = crypto.createHash("sha256").update(oauthRefreshToken || "").digest("hex");
  } else {
    // Fallback to Service Account
    if (!serviceAccountKey) {
      return { status: "not_configured" as const };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(serviceAccountKey);
    } catch (_) {
      return { status: "error" as const, message: "Invalid JSON format for GA4 credentials." };
    }

    privateKey = parsed.private_key;
    clientEmail = parsed.client_email;
    if (!privateKey || !clientEmail) {
      return { status: "not_configured" as const };
    }

    authMode = "service_account";
    authFingerprint = crypto.createHash("sha256").update(serviceAccountKey).digest("hex");
  }

  const propertyFingerprint = crypto.createHash("sha256").update(propertyId).digest("hex");
  const cacheKey = `${authMode}_${authFingerprint}_${propertyFingerprint}_ga4_${numOfDays}`;
  const now = Date.now();
  const cached = ga4CacheMap.get(cacheKey);

  if (cached && now - cached.timestamp < GA4_CACHE_TTL) {
    return { status: "ready" as const, fromCache: true, data: cached.data };
  }

  let token = "";
  try {
    token = await getGoogleAccessToken(
      authMode,
      {
        privateKey,
        clientEmail,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
      },
      "https://www.googleapis.com/auth/analytics.readonly"
    );
  } catch (err: any) {
    const httpStatus = err.status || 500;
    console.error("GA4 Token Exchange Error in Daily Brief helper (HTTP status):", httpStatus);
    return {
      status: "error" as const,
      message: authMode === "oauth" ? "Failed to authenticate with Google OAuth." : "Failed to authenticate with Google Service Account.",
    };
  }

  try {
    const endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const startDate = moment().subtract(numOfDays, "days").format("YYYY-MM-DD");
    const dateRanges = [{ startDate, endDate }];
    const sharedMetrics = [{ name: "sessions" }, { name: "activeUsers" }, { name: "eventCount" }];

    const [summaryRaw, eventsRaw, landingPagesRaw] = await Promise.all([
      runGa4Report(token, propertyId, {
        dateRanges,
        metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "newUsers" }, { name: "eventCount" }],
      }),
      runGa4Report(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: TARGET_EVENTS },
          },
        },
      }),
      runGa4Report(token, propertyId, {
        dateRanges,
        dimensions: [{ name: "landingPagePlusQueryString" }],
        metrics: sharedMetrics,
        limit: 20,
      }),
    ]);

    const summaryRow = summaryRaw?.rows?.[0];
    const payload = {
      summary: {
        sessions: metricValue(summaryRow, 0),
        activeUsers: metricValue(summaryRow, 1),
        newUsers: metricValue(summaryRow, 2),
        eventCount: metricValue(summaryRow, 3),
      },
      funnel: mapEventRows(eventsRaw),
      landingPages: mapMetricRows(landingPagesRaw),
    };

    ga4CacheMap.set(cacheKey, { data: payload, timestamp: now });
    return { status: "ready" as const, fromCache: false, data: payload };

  } catch (err: any) {
    const httpStatus = err.status || 500;
    console.error("GA4 fetching error in Daily Brief helper (HTTP status):", httpStatus);
    return {
      status: "error" as const,
      message: `Failed to fetch data from Google Analytics (HTTP ${httpStatus})`,
    };
  }
}

// ===== Clarity Data Fetcher & Mapper =====
function cleanClarityData(rawData: any[], dimKey: string) {
  if (!Array.isArray(rawData)) return [];
  const tempMap = new Map<string, any>();

  const getDimValue = (record: any): string => {
    const aliases = ["URL", "Url", "url", "Device", "device", "Country/Region", "Country", "country", "key", "name"];
    for (const a of aliases) {
      if (record[a] !== undefined && record[a] !== null && String(record[a]).trim()) {
        return String(record[a]);
      }
    }
    return "Unknown";
  };

  const getNum = (val: any) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  for (const item of rawData) {
    const metricName = item.metricName || "";
    const infoArray = item.information;
    if (!Array.isArray(infoArray)) continue;

    for (const record of infoArray) {
      const key = getDimValue(record);
      if (!key) continue;

      if (!tempMap.has(key)) {
        tempMap.set(key, {
          key,
          sessions: 0,
          scrollDepth: 0,
          engagementTime: 0,
          deadClicks: 0,
          rageClicks: 0,
          quickBacks: 0,
          scriptErrors: 0,
        });
      }

      const entry = tempMap.get(key)!;
      const norm = metricName.toLowerCase().replace(/[\s-_]/g, "");

      if (norm === "traffic") {
        entry.sessions = getNum(record.totalSessionCount || record.sessionCount || record.sessions || record.count);
      } else if (norm === "rageclickcount" || norm === "rageclicks" || norm === "rageclick") {
        entry.rageClicks = getClarityMetricCount(record, ["rageClickCount"]);
      } else if (norm === "scripterrorcount" || norm === "scripterrors" || norm === "scripterror") {
        entry.scriptErrors = getClarityMetricCount(record, ["scriptErrorCount"]);
      }
    }
  }

  return Array.from(tempMap.values()).sort((a, b) => b.sessions - a.sessions);
}

export async function getClaritySummaryMetrics(numOfDays: number) {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    return { status: "not_configured" as const };
  }

  // Cap numOfDays to max 3 as required by MS Clarity Data Export API
  const actualNumOfDays = Math.min(numOfDays, 3);

  const fingerprint = crypto.createHash("sha256").update(token).digest("hex");
  const cacheKey = `${fingerprint}_${actualNumOfDays}`;
  const now = Date.now();
  const cached = clarityCacheMap.get(cacheKey);

  if (cached && now - cached.timestamp < CLARITY_CACHE_TTL) {
    return {
      status: "ready" as const,
      fromCache: true,
      actualNumOfDays,
      data: cached.data,
    };
  }

  try {
    const dim = "URL";
    const apiUrl = `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${actualNumOfDays}&dimension1=${encodeURIComponent(dim)}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw { status: response.status };
    }

    const rawData = await response.json();
    const cleaned = cleanClarityData(rawData, dim);

    const payload = { url: cleaned };
    clarityCacheMap.set(cacheKey, { data: payload, timestamp: now });

    return {
      status: "ready" as const,
      fromCache: false,
      actualNumOfDays,
      data: payload,
    };

  } catch (err: any) {
    console.error("Clarity fetching error in Daily Brief helper:", err);
    return {
      status: "error" as const,
      message: `Failed to fetch from Clarity API (HTTP ${err.status || 500})`,
    };
  }
}

// ===== Rules Action Generator =====
export function generateBriefActions(gsc: any, ga4: any, clarity: any, isZh: boolean) {
  const actions: any[] = [];
  const flaggedPages = new Set<string>();

  // 1. GSC 机会词
  if (gsc?.status === "ready" && gsc.data?.queries) {
    const queries = gsc.data.queries;
    const avgImpressions = queries.reduce((sum: number, q: any) => sum + q.impressions, 0) / (queries.length || 1);
    const opportunityQueries = queries.filter(
      (q: any) => q.position >= 11 && q.position <= 20 && q.impressions > avgImpressions
    );

    opportunityQueries.slice(0, 1).forEach((q: any) => {
      actions.push({
        id: `brief-opt-query-${q.key}`,
        priority: "P1",
        category: "seo",
        title: isZh ? `针对高潜力关键词 “${q.key}” 进行内容补充` : `Target high-potential keyword "${q.key}"`,
        reason: isZh ? "该关键词排名接近第一页且曝光高，具有较强的自然流量潜力。" : "Keyword ranks close to page 1 and has high impressions, showing organic traffic potential.",
        evidence: isZh
          ? `当前平均排名: ${q.position.toFixed(1)} · 曝光数: ${q.impressions.toLocaleString()}`
          : `Position: ${q.position.toFixed(1)} · Impressions: ${q.impressions.toLocaleString()}`,
        suggestedNextStep: isZh ? "建议优先优化此关键词对应的表单模板内容，或撰写针对性的主题博客。" : "Prioritize optimizing related form templates or writing dedicated blog content.",
        source: "gsc",
      });
    });
  }

  // 2. GSC 低 CTR
  if (gsc?.status === "ready" && gsc.data?.pages) {
    const pages = gsc.data.pages;
    const avgImpressions = pages.reduce((sum: number, p: any) => sum + p.impressions, 0) / (pages.length || 1);
    const avgCtr = gsc.data.summary.ctr;

    const lowCtrPages = pages.filter((p: any) => p.impressions > avgImpressions && p.ctr < avgCtr);
    lowCtrPages.slice(0, 1).forEach((p: any) => {
      let pathname = p.key;
      try {
        pathname = new URL(p.key).pathname;
      } catch (_) {}

      flaggedPages.add(p.key);

      actions.push({
        id: `brief-ctr-page-${p.key}`,
        priority: "P2",
        category: "seo",
        title: isZh ? `优化页面 [ ${pathname} ] 的元描述` : `Optimize Meta Description for [ ${pathname} ]`,
        reason: isZh ? "页面展现高但点击率低于全站平均水平，可能搜索引擎摘要缺乏吸引力。" : "Page has high impressions but lower CTR than site average, indicating search snippet may lack appeal.",
        evidence: isZh
          ? `页面 CTR: ${p.ctr.toFixed(2)}% (全站均值: ${avgCtr.toFixed(2)}%) · 曝光: ${p.impressions.toLocaleString()}`
          : `CTR: ${p.ctr.toFixed(2)}% (average: ${avgCtr.toFixed(2)}%) · Impressions: ${p.impressions.toLocaleString()}`,
        suggestedNextStep: isZh ? "建议检查并精细调整该页面的 Meta Title 与 Meta Description。" : "Inspect and optimize Meta Title and Meta Description for better snippet CTR.",
        source: "gsc",
      });
    });
  }

  // 3. GSC 曝光高但 GA4 着陆页访问极低 (GSC + GA4 联动)
  if (gsc?.status === "ready" && gsc.data?.pages && ga4?.status === "ready" && ga4.data?.landingPages) {
    const pages = gsc.data.pages;
    const avgImpressions = pages.reduce((sum: number, p: any) => sum + p.impressions, 0) / (pages.length || 1);
    const highImpPages = pages.filter((p: any) => p.impressions > avgImpressions);

    highImpPages.slice(0, 3).forEach((p: any) => {
      if (flaggedPages.has(p.key)) return;

      let pathname = p.key;
      try {
        pathname = new URL(p.key).pathname;
      } catch (_) {}

      const ga4Page = ga4.data.landingPages.find((lp: any) => {
        const lpPath = lp.key.split("?")[0];
        return lpPath === pathname || lpPath === pathname + "/" || pathname === lpPath + "/";
      });

      const sessions = ga4Page ? ga4Page.sessions : 0;
      if (p.clicks > 5 && sessions < 5) {
        flaggedPages.add(p.key);
        actions.push({
          id: `brief-gsc-ga4-${p.key}`,
          priority: "P0",
          category: "technical",
          title: isZh ? `检查页面 [ ${pathname} ] 的加载可用性与跳转状态` : `Verify page loading and redirects for [ ${pathname} ]`,
          reason: isZh ? "搜索引擎点击数与 GA4 真实捕获的会话数严重不符，可能存在跳转异常。" : "Search clicks and GA4 landing sessions do not match, suggesting potential redirect or loading issues.",
          evidence: isZh
            ? `搜索引擎点击: ${p.clicks} · GA4 记录会话: ${sessions}`
            : `Search Clicks: ${p.clicks} · GA4 Sessions: ${sessions}`,
          suggestedNextStep: isZh ? "建议检查该路径可用性，看是否存在错误的重定向或脚本加载阻塞。" : "Verify redirect configurations and check if client scripts are blocked.",
          source: "combined",
        });
      }
    });
  }

  // 4. GA4 漏斗激活规则 (sessions >= 20 门槛守护)
  if (ga4?.status === "ready" && ga4.data) {
    const sessions = ga4.data.summary.sessions;

    if (sessions >= 20) {
      const getCount = (name: string) => {
        return ga4.data.funnel?.find((f: any) => f.eventName === name)?.eventCount || 0;
      };

      const demoStart = getCount("demo_start");
      const demoComplete = getCount("demo_complete");
      const formGenerate = getCount("form_generate");
      const formPublish = getCount("form_publish");
      const formSubmit = getCount("form_submit");

      // GA4 sessions 足够但 demo_start 低
      const demoStartRate = demoStart / sessions;
      if (demoStartRate < 0.05) {
        actions.push({
          id: "brief-low-demo-start",
          priority: "P1",
          category: "activation",
          title: isZh ? "优化首页 Demo 体验的入口显眼度" : "Optimize homepage sandbox demo visibility",
          reason: isZh ? "首页访客会话数丰富，但游客触发免登录 Demo 体验的比例偏低。" : "Homepage traffic volume is high, but demo entry conversions remain low.",
          evidence: isZh
            ? `会话数: ${sessions} · 触发演示开始: ${demoStart} (${(demoStartRate * 100).toFixed(1)}%)`
            : `Sessions: ${sessions} · Demo Starts: ${demoStart} (${(demoStartRate * 100).toFixed(1)}%)`,
          suggestedNextStep: isZh ? "建议评估并强化首屏呼吁行动 (CTA) 按钮，增加演示外壳点击率。" : "Consider increasing visual weight of the homepage hero CTA button.",
          source: "ga4",
        });
      }

      // Demo 摩擦流失
      if (demoStart >= 5) {
        const demoCompleteRate = demoComplete / demoStart;
        if (demoCompleteRate < 0.40) {
          actions.push({
            id: "brief-low-demo-complete",
            priority: "P1",
            category: "experience",
            title: isZh ? "精简表单 Demo 步骤以减少完成流失" : "Inspect demo completion rates",
            reason: isZh ? "游客触发 Demo 开始但最终完成模拟提交率偏低，流程中可能存在摩擦。" : "Sandbox demo started but final submission conversions are low, suggesting UX friction.",
            evidence: isZh
              ? `演示开始: ${demoStart} · 演示完成: ${demoComplete} (${(demoCompleteRate * 100).toFixed(1)}%)`
              : `Demo Starts: ${demoStart} · Demo Completes: ${demoComplete} (${(demoCompleteRate * 100).toFixed(1)}%)`,
            suggestedNextStep: isZh ? "建议精简 Demo 题目个数，提供更直接清爽的实时交互反馈。" : "Simplify form fields in sandbox demo and provide instant feedback.",
            source: "ga4",
          });
        }
      }

      // 生成后发布率低
      if (formGenerate >= 3) {
        const publishRate = formPublish / formGenerate;
        if (publishRate < 0.50) {
          actions.push({
            id: "brief-low-publish",
            priority: "P0",
            category: "activation",
            title: isZh ? "检查表单生成后的发布流失与登录限制" : "Inspect conversion blockers after form generation",
            reason: isZh ? "AI 真实表单生成触发活跃，但最终点击发布率偏低，通常受登录弹窗拦截。" : "Forms successfully generated by AI but final publish rate is low, often blocked by auth/paywalls.",
            evidence: isZh
              ? `真实生成: ${formGenerate} · 表单发布: ${formPublish} (${(publishRate * 100).toFixed(1)}%)`
              : `Generated: ${formGenerate} · Published: ${formPublish} (${(publishRate * 100).toFixed(1)}%)`,
            suggestedNextStep: isZh ? "建议优化发布引导设计，优化账户注册弹出时机或放宽免费体验额度。" : "Revise onboarding path to adjust login requirement triggers and review limits.",
            source: "ga4",
          });
        }
      }

      // 发布后无公开提交数据
      if (formPublish >= 3) {
        const submitRate = formSubmit / formPublish;
        if (submitRate < 0.10) {
          actions.push({
            id: "brief-low-submit",
            priority: "P1",
            category: "activation",
            title: isZh ? "优化已发布表单落地页的加载与提交引导" : "Improve public form submit conversions",
            reason: isZh ? "表单虽已成功发布，但真实接收到的公开数据提交转化率偏低。" : "Forms successfully published but final public submissions remain low.",
            evidence: isZh
              ? `表单发布: ${formPublish} · 数据提交: ${formSubmit} (${(submitRate * 100).toFixed(1)}%)`
              : `Published: ${formPublish} · Submissions: ${formSubmit} (${(submitRate * 100).toFixed(1)}%)`,
            suggestedNextStep: isZh ? "建议优化公开分享页面的加载速度，并在预览区提示测试填写的引导说明。" : "Optimize load speeds of public share URLs and add testing guidance.",
            source: "ga4",
          });
        }
      }
    }
  }

  // 5. Clarity 愤怒点击和脚本错误建议
  if (clarity?.status === "ready" && clarity.data?.url) {
    const urls = clarity.data.url;

    // 愤怒点击大于 5 次
    const rageClickPage = urls.find((u: any) => u.rageClicks > 5);
    if (rageClickPage) {
      actions.push({
        id: `brief-clarity-rage-${rageClickPage.key}`,
        priority: "P0",
        category: "experience",
        title: isZh ? `检查页面 [ ${rageClickPage.key} ] 上的愤怒点击与布局阻碍` : `Check rage clicks and UX blocks on [ ${rageClickPage.key} ]`,
        reason: isZh ? "Clarity 检测到该页面累积了异常的愤怒点击，表明用户遇到了难以响应的交互死角。" : "Clarity recorded high rage clicks, suggesting unresponsive elements or layout blockers.",
        evidence: isZh
          ? `会话数: ${rageClickPage.sessions} · 愤怒点击数: ${rageClickPage.rageClicks}`
          : `Sessions: ${rageClickPage.sessions} · Rage Clicks: ${rageClickPage.rageClicks}`,
        suggestedNextStep: isZh ? "建议在不同移动设备视口上进行交互测试，确认按钮及表单组件没有发生排版遮挡。" : "Test this path on mobile viewports to verify form interaction fields.",
        source: "clarity",
      });
    }

    // 脚本错误大于 0 次
    const errorPage = urls.find((u: any) => u.scriptErrors > 0);
    if (errorPage) {
      actions.push({
        id: `brief-clarity-error-${errorPage.key}`,
        priority: "P0",
        category: "technical",
        title: isZh ? `排查页面 [ ${errorPage.key} ] 上的运行时 JavaScript 脚本报错` : `Resolve JavaScript runtime errors on [ ${errorPage.key} ]`,
        reason: isZh ? "监测到该页面存在未捕获的运行时异常报错，可能会直接阻碍表单的核心提交动作。" : "JavaScript errors were detected on this page, which can block form logic.",
        evidence: isZh
          ? `未捕获脚本异常数: ${errorPage.scriptErrors}`
          : `Uncaught Script Errors: ${errorPage.scriptErrors}`,
        suggestedNextStep: isZh ? "建议检查前端日志，定位特定机型或浏览器环境下的语法异常并修复。" : "Check exceptions reports to isolate and resolve browser script errors.",
        source: "clarity",
      });
    }
  }

  return actions;
}
