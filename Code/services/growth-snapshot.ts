import crypto from "crypto";
import moment from "moment";
import { GrowthMetricSnapshotRecord } from "@/types/growth-metric-snapshot";
import { upsertGrowthMetricSnapshot, getGrowthMetricSnapshot } from "@/models/growth-metric-snapshot";

// Sleep utility for rate limiting
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Whitelisted URLs for PageSpeed
const PAGESPEED_WHITELIST = [
  "https://genforms.ai",
  "https://genforms.ai/",
  "https://genforms.ai/templates",
  "https://genforms.ai/posts/typeform-alternatives",
  "https://genforms.ai/forms/new"
];

// GA4 target events we track
const TARGET_EVENTS = [
  "demo_start",
  "demo_complete",
  "template_use_click",
  "form_generate",
  "form_publish",
  "form_submit"
];

/**
 * Sanitizes URLs to remove sensitive parameters (email, tokens, prompts, etc.)
 * Returns path and only safe whitelisted query parameters.
 */
export function sanitizeUrl(urlStr: string): string {
  if (!urlStr) return "";
  try {
    const hasProtocol = urlStr.startsWith("http://") || urlStr.startsWith("https://");
    const dummyBase = "https://genforms.ai";
    const urlObj = hasProtocol ? new URL(urlStr) : new URL(urlStr, dummyBase);

    // Keep only safe whitelisted query parameters
    const whitelistedKeys = ["locale", "page", "tab", "template", "source"];
    const searchKeys = Array.from(urlObj.searchParams.keys());
    for (const key of searchKeys) {
      const lowerKey = key.toLowerCase();
      const value = urlObj.searchParams.get(key) || "";

      // 1. By default, only save path (remove non-whitelisted query params)
      if (!whitelistedKeys.includes(lowerKey)) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 2. Filter out email (contains @ or .)
      if (value.includes("@") || value.includes(".")) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 3. Filter out token/key (sensitive key names or values that look like secrets/keys/tokens)
      const sensitivePatterns = ["token", "key", "secret", "auth", "session", "pass", "pwd", "jwt", "credential"];
      if (
        sensitivePatterns.some(pattern => lowerKey.includes(pattern)) ||
        sensitivePatterns.some(pattern => value.toLowerCase().includes(pattern))
      ) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 4. Filter out URL encoded content (contains %)
      if (value.includes("%")) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 5. Filter out prompt / long text (max 50 chars, alphanumeric, dashes, underscores)
      const isShortSlug = /^[a-zA-Z0-9_-]{1,50}$/.test(value);
      if (!isShortSlug) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 6. Explicit check for long text (>50 characters)
      if (value.length > 50) {
        urlObj.searchParams.delete(key);
        continue;
      }

      // 7. Filter out common AI/SQL prompt keywords
      const promptKeywords = ["select", "union", "insert", "delete", "update", "script", "prompt", "instruct", "system", "assistant", "user", "schema", "database", "table"];
      if (promptKeywords.some(keyword => value.toLowerCase().includes(keyword))) {
        urlObj.searchParams.delete(key);
        continue;
      }
    }

    const sanitizedPath = urlObj.pathname + urlObj.search;
    return hasProtocol ? urlObj.origin + sanitizedPath : sanitizedPath;
  } catch (err) {
    const questionMarkIndex = urlStr.indexOf("?");
    if (questionMarkIndex >= 0) {
      return urlStr.substring(0, questionMarkIndex);
    }
    return urlStr;
  }
}

/**
 * Deep sanitization of details JSON to ensure absolutely no PII gets stored.
 */
export function sanitizeDetailsJson(source: string, details: any): any {
  if (!details || typeof details !== "object") return details;

  try {
    const sanitized = JSON.parse(JSON.stringify(details));

    if (source === "gsc") {
      if (Array.isArray(sanitized.pages)) {
        sanitized.pages = sanitized.pages.map((row: any) => ({
          ...row,
          key: sanitizeUrl(row.key)
        }));
      }
    } else if (source === "ga4") {
      if (Array.isArray(sanitized.landingPages)) {
        sanitized.landingPages = sanitized.landingPages.map((row: any) => ({
          ...row,
          key: sanitizeUrl(row.key)
        }));
      }
    } else if (source === "clarity") {
      if (Array.isArray(sanitized.url)) {
        sanitized.url = sanitized.url.map((row: any) => ({
          ...row,
          key: sanitizeUrl(row.key)
        }));
      }
    }

    return sanitized;
  } catch {
    return details;
  }
}

/**
 * JWT / OAuth token helper for Google Services (GSC & GA4)
 */
async function getGoogleAccessToken(
  scope: string
): Promise<string> {
  const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID?.trim();
  const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim();
  const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim();

  const oauthKeys = [oauthClientId, oauthClientSecret, oauthRefreshToken];
  const oauthPresentCount = oauthKeys.filter(Boolean).length;
  const isOauthComplete = oauthPresentCount === 3;
  const isOauthPartial = oauthPresentCount > 0 && oauthPresentCount < 3;

  if (isOauthPartial) {
    throw new Error("Google OAuth variables are partially configured. Please configure all of: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN.");
  }

  if (isOauthComplete) {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: oauthClientId || "",
        client_secret: oauthClientSecret || "",
        refresh_token: oauthRefreshToken || "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google OAuth token exchange failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } else {
    // Fallback to Service Account
    let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    if (!serviceAccountKey && base64Key) {
      serviceAccountKey = Buffer.from(base64Key, "base64").toString("utf-8");
    }

    if (!serviceAccountKey) {
      throw new Error("Google credentials are not configured.");
    }

    const parsed = JSON.parse(serviceAccountKey);
    const privateKey = parsed.private_key;
    const clientEmail = parsed.client_email;

    if (!privateKey || !clientEmail) {
      throw new Error("Invalid Service Account key format.");
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

    const base64Encode = (obj: any) => {
      return Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const jwtHeader = base64Encode(header);
    const jwtClaim = base64Encode(claimSet);
    const signatureInput = `${jwtHeader}.${jwtClaim}`;

    const formattedKey = privateKey.replace(/\\n/g, "\n");
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(signatureInput);
    const signature = signer.sign(formattedKey, "base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    const jwt = `${jwtHeader}.${jwtClaim}.${signature}`;

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Service Account token exchange failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  }
}

/**
 * Fetch and upsert GSC snapshots
 */
export async function collectGscSnapshot(
  range: "1d" | "7d" | "28d",
  targetDateInput?: string
): Promise<GrowthMetricSnapshotRecord> {
  const propertyUrl = process.env.GSC_PROPERTY_URL;
  if (!propertyUrl) {
    throw new Error("GSC_PROPERTY_URL is not configured.");
  }

  const token = await getGoogleAccessToken("https://www.googleapis.com/auth/webmasters.readonly");
  const numOfDays = range === "28d" ? 28 : range === "7d" ? 7 : 1;

  // GSC has a 2-day delay
  const targetDate = targetDateInput ? moment(targetDateInput, "YYYY-MM-DD") : moment().subtract(2, "days");
  if (!targetDate.isValid()) {
    throw new Error("Invalid GSC snapshot target date.");
  }
  const snapshot_date = targetDate.format("YYYY-MM-DD");
  const endDate = targetDate.format("YYYY-MM-DD");
  const startDate = targetDate.clone().subtract(numOfDays - 1, "days").format("YYYY-MM-DD"); // range is [startDate, endDate] inclusive

  const dimensions = ["query", "page"];
  const [queriesRaw, pagesRaw] = await Promise.all(
    dimensions.map(async (dim) => {
      const response = await fetch(
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
      if (!response.ok) throw new Error(`GSC API dim ${dim} failed with status ${response.status}`);
      return response.json();
    })
  );

  const summaryResponse = await fetch(
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
        rowLimit: 1,
      }),
    }
  );

  if (!summaryResponse.ok) throw new Error(`GSC API summary failed with status ${summaryResponse.status}`);
  const summaryRaw = await summaryResponse.json();

  const summaryRow = summaryRaw.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const metrics_json = {
    clicks: Number(summaryRow.clicks || 0),
    impressions: Number(summaryRow.impressions || 0),
    ctr: Number((summaryRow.ctr || 0) * 100),
    position: Number(summaryRow.position || 0),
  };

  const mapRows = (raw: any) => {
    if (!raw || !Array.isArray(raw.rows)) return [];
    return raw.rows.map((row: any) => ({
      key: Array.isArray(row.keys) ? row.keys[0] : "Unknown",
      clicks: Number(row.clicks || 0),
      impressions: Number(row.impressions || 0),
      ctr: Number((row.ctr || 0) * 100),
      position: Number(row.position || 0),
    }));
  };

  const rawDetails = {
    queries: mapRows(queriesRaw),
    pages: mapRows(pagesRaw)
  };

  // PII sanitization
  const details_json = sanitizeDetailsJson("gsc", rawDetails);

  return await upsertGrowthMetricSnapshot({
    snapshot_date,
    source: "gsc",
    range,
    segment: "default",
    metrics_json,
    details_json,
    status: "success",
    error_message: ""
  });
}

/**
 * Fetch and upsert GA4 snapshots
 */
export async function collectGa4Snapshot(
  range: "1d" | "7d" | "28d",
  targetDateInput?: string
): Promise<GrowthMetricSnapshotRecord> {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    throw new Error("GA4_PROPERTY_ID is not configured.");
  }

  const token = await getGoogleAccessToken("https://www.googleapis.com/auth/analytics.readonly");
  const numOfDays = range === "28d" ? 28 : (range === "7d" ? 7 : 1);

  // GA4 yesterday data
  const targetDate = targetDateInput ? moment(targetDateInput, "YYYY-MM-DD") : moment().subtract(1, "days");
  if (!targetDate.isValid()) {
    throw new Error("Invalid GA4 snapshot target date.");
  }
  const snapshot_date = targetDate.format("YYYY-MM-DD");
  const endDate = targetDate.format("YYYY-MM-DD");
  const startDate = targetDate.clone().subtract(numOfDays - 1, "days").format("YYYY-MM-DD");
  const dateRanges = [{ startDate, endDate }];

  const runGa4Report = async (body: any) => {
    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(propertyId)}:runReport`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (!res.ok) throw new Error(`GA4 API runReport failed with status ${res.status}`);
    return res.json();
  };

  const metricValue = (row: any, index: number) => Number(row?.metricValues?.[index]?.value || 0);
  const dimensionValue = (row: any, index: number) => String(row?.dimensionValues?.[index]?.value || "Unknown");

  const [summaryRaw, eventsRaw, landingPagesRaw] = await Promise.all([
    runGa4Report({
      dateRanges,
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "newUsers" }, { name: "eventCount" }],
    }),
    runGa4Report({
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
    runGa4Report({
      dateRanges,
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "eventCount" }],
      limit: 20,
    })
  ]);

  const summaryRow = summaryRaw?.rows?.[0];
  const metrics_json = {
    sessions: metricValue(summaryRow, 0),
    activeUsers: metricValue(summaryRow, 1),
    newUsers: metricValue(summaryRow, 2),
    eventCount: metricValue(summaryRow, 3),
  };

  const counts = new Map<string, number>();
  for (const eventName of TARGET_EVENTS) counts.set(eventName, 0);
  if (Array.isArray(eventsRaw?.rows)) {
    for (const r of eventsRaw.rows) {
      const name = dimensionValue(r, 0);
      if (counts.has(name)) counts.set(name, metricValue(r, 0));
    }
  }
  const funnel = TARGET_EVENTS.map((eventName) => ({
    eventName,
    eventCount: counts.get(eventName) || 0,
  }));

  const mapMetricRows = (report: any) => {
    if (!Array.isArray(report?.rows)) return [];
    return report.rows.map((row: any) => ({
      key: dimensionValue(row, 0),
      sessions: metricValue(row, 0),
      activeUsers: metricValue(row, 1),
      eventCount: metricValue(row, 2),
    }));
  };

  const rawDetails = {
    funnel,
    landingPages: mapMetricRows(landingPagesRaw)
  };

  // PII sanitization
  const details_json = sanitizeDetailsJson("ga4", rawDetails);

  return await upsertGrowthMetricSnapshot({
    snapshot_date,
    source: "ga4",
    range,
    segment: "default",
    metrics_json,
    details_json,
    status: "success",
    error_message: ""
  });
}

/**
 * Fetch and upsert Clarity snapshots
 */
export async function collectClaritySnapshot(): Promise<GrowthMetricSnapshotRecord> {
  const token = process.env.CLARITY_API_TOKEN;
  if (!token) {
    throw new Error("CLARITY_API_TOKEN is not configured.");
  }

  // Clarity昨天的快照
  const targetDate = moment().subtract(1, "days");
  const snapshot_date = targetDate.format("YYYY-MM-DD");

  const apiUrl = `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1&dimension1=URL`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Clarity API failed with status ${response.status}`);
  }

  const rawData = await response.json();

  const cleanClarityData = (raw: any[]) => {
    if (!Array.isArray(raw)) return [];
    const tempMap = new Map<string, any>();
    const getDimValue = (record: any): string => {
      const aliases = ["URL", "Url", "url", "key", "name"];
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

    for (const item of raw) {
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
          entry.rageClicks = getNum(record.sessionsCount || record.rageClickCount || record.count);
        } else if (norm === "scripterrorcount" || norm === "scripterrors" || norm === "scripterror") {
          entry.scriptErrors = getNum(record.sessionsCount || record.scriptErrorCount || record.count);
        }
      }
    }

    return Array.from(tempMap.values()).sort((a, b) => b.sessions - a.sessions);
  };

  const urlData = cleanClarityData(rawData);

  // Summarize main metrics
  let totalSessions = 0;
  let totalRageClicks = 0;
  let totalScriptErrors = 0;
  for (const item of urlData) {
    totalSessions += item.sessions;
    totalRageClicks += item.rageClicks;
    totalScriptErrors += item.scriptErrors;
  }

  const metrics_json = {
    totalSessions,
    totalRageClicks,
    totalScriptErrors
  };

  const rawDetails = { url: urlData };
  const details_json = sanitizeDetailsJson("clarity", rawDetails);

  return await upsertGrowthMetricSnapshot({
    snapshot_date,
    source: "clarity",
    range: "1d",
    segment: "default",
    metrics_json,
    details_json,
    status: "success",
    error_message: ""
  });
}

/**
 * Fetch and upsert PageSpeed snapshots
 */
export async function collectPageSpeedSnapshot(url: string, strategy: "mobile" | "desktop"): Promise<GrowthMetricSnapshotRecord> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    throw new Error("PAGESPEED_API_KEY is not configured.");
  }

  if (!PAGESPEED_WHITELIST.includes(url)) {
    throw new Error(`URL ${url} is not whitelisted for PageSpeed PSI.`);
  }

  const targetDate = moment();
  const snapshot_date = targetDate.format("YYYY-MM-DD");

  const googlePsiUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&key=${apiKey}`;

  const response = await fetch(googlePsiUrl);
  if (!response.ok) {
    throw new Error(`PageSpeed API failed with status ${response.status}`);
  }

  const json = await response.json();
  const lighthouseResult = json.lighthouseResult;
  if (!lighthouseResult) {
    throw new Error("PageSpeed response missing lighthouseResult.");
  }

  const categories = lighthouseResult.categories || {};
  const audits = lighthouseResult.audits || {};

  const scores = {
    performance: Math.round((categories.performance?.score || 0) * 100),
    accessibility: Math.round((categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
    seo: Math.round((categories.seo?.score || 0) * 100)
  };

  const metrics = {
    fcp: audits["first-contentful-paint"]?.displayValue || "0 s",
    lcp: audits["largest-contentful-paint"]?.displayValue || "0 s",
    tbt: audits["total-blocking-time"]?.displayValue || "0 ms",
    cls: audits["cumulative-layout-shift"]?.displayValue || "0",
    tti: audits["interactive"]?.displayValue || "0 s",
    speedIndex: audits["speed-index"]?.displayValue || "0 s"
  };

  const opportunities: Array<{ id: string; title: string; displayValue: string; overallSavingsMs: number }> = [];
  for (const [auditId, audit] of Object.entries(audits) as any[]) {
    if (audit.details && audit.details.type === "opportunity" && audit.details.overallSavingsMs > 0) {
      opportunities.push({
        id: auditId,
        title: audit.title,
        displayValue: audit.displayValue,
        overallSavingsMs: audit.details.overallSavingsMs
      });
    }
  }
  opportunities.sort((a, b) => b.overallSavingsMs - a.overallSavingsMs);
  const topOpportunities = opportunities.slice(0, 5).map((opp) => ({
    id: opp.id,
    title: opp.title,
    displayValue: opp.displayValue
  }));

  const diagnostics = {
    totalByteWeight: audits["total-byte-weight"]?.displayValue || "0 KiB",
    numRequests: audits["network-requests"]?.details?.items?.length || 0
  };

  const metrics_json = {
    scores,
    metrics
  };

  const details_json = {
    opportunities: topOpportunities,
    diagnostics,
    tested_at: targetDate.toISOString()
  };

  return await upsertGrowthMetricSnapshot({
    snapshot_date,
    source: "pagespeed",
    range: strategy,
    segment: url, // segment tracks which URL this PageSpeed run corresponds to
    metrics_json,
    details_json,
    status: "success",
    error_message: ""
  });
}

/**
 * Main wrapper function to trigger all snapshot collections.
 * Loops through targets sequentially with retry policies and sleep timers to prevent API quota issues.
 */
export async function runAllSnapshots(force = false): Promise<{
  success: boolean;
  results: Array<{ source: string; range: string; segment: string; status: "success" | "skipped" | "failed" }>;
  errors: string[];
}> {
  const results: any[] = [];
  const errors: string[] = [];

  const checkAndCollect = async (
    source: string,
    range: string,
    segment: string,
    collectFn: () => Promise<any>
  ) => {
    // Dates calculation
    let targetDateStr = moment().subtract(1, "days").format("YYYY-MM-DD");
    if (source === "gsc") {
      targetDateStr = moment().subtract(2, "days").format("YYYY-MM-DD");
    } else if (source === "pagespeed") {
      targetDateStr = moment().format("YYYY-MM-DD");
    }

    try {
      if (!force) {
        const existing = await getGrowthMetricSnapshot(targetDateStr, source, range, segment);
        if (existing && existing.status === "success") {
          results.push({ source, range, segment, status: "skipped" });
          return;
        }
      }

      await collectFn();
      results.push({ source, range, segment, status: "success" });
    } catch (err: any) {
      console.error(`Snapshot collection failed for ${source}:${range}:${segment}:`, err);
      errors.push(`${source}:${range}:${segment} -> ${err.message || String(err)}`);

      // Write failure snapshot to database
      try {
        await upsertGrowthMetricSnapshot({
          snapshot_date: targetDateStr,
          source,
          range,
          segment,
          metrics_json: {},
          details_json: {},
          status: "failed",
          error_message: err.message || String(err)
        });
      } catch (dbErr) {
        console.error("Failed to write error status to DB:", dbErr);
      }

      results.push({ source, range, segment, status: "failed" });
    }
  };

  // 1. Collect GSC snapshots (7d, 28d)
  await checkAndCollect("gsc", "1d", "default", () => collectGscSnapshot("1d"));
  await sleep(1000);
  await checkAndCollect("gsc", "7d", "default", () => collectGscSnapshot("7d"));
  await sleep(1000);
  await checkAndCollect("gsc", "28d", "default", () => collectGscSnapshot("28d"));
  await sleep(1000);

  // 2. Collect GA4 snapshots (1d, 7d, 28d)
  await checkAndCollect("ga4", "1d", "default", () => collectGa4Snapshot("1d"));
  await sleep(1000);
  await checkAndCollect("ga4", "7d", "default", () => collectGa4Snapshot("7d"));
  await sleep(1000);
  await checkAndCollect("ga4", "28d", "default", () => collectGa4Snapshot("28d"));
  await sleep(1000);

  // 3. Collect Clarity snapshot (1d)
  await checkAndCollect("clarity", "1d", "default", () => collectClaritySnapshot());
  await sleep(1000);

  // 4. Collect PageSpeed snapshots (whitelisted URLs, mobile & desktop)
  for (const url of PAGESPEED_WHITELIST) {
    await checkAndCollect("pagespeed", "mobile", url, () => collectPageSpeedSnapshot(url, "mobile"));
    await sleep(3000); // 3-second sleep as required for PageSpeed API protection
    await checkAndCollect("pagespeed", "desktop", url, () => collectPageSpeedSnapshot(url, "desktop"));
    await sleep(3000);
  }

  return {
    success: errors.length === 0,
    results,
    errors
  };
}

export async function runHistoricalGoogleSnapshots(
  targetDate: string,
  force = false
): Promise<{
  success: boolean;
  results: Array<{ source: string; range: string; segment: string; status: "success" | "skipped" | "failed" }>;
  errors: string[];
}> {
  const parsed = moment(targetDate, "YYYY-MM-DD", true);
  if (!parsed.isValid()) {
    throw new Error("Invalid target date. Use YYYY-MM-DD.");
  }

  const today = moment().startOf("day");
  if (parsed.isAfter(today)) {
    throw new Error("Target date cannot be in the future.");
  }

  const results: Array<{ source: string; range: string; segment: string; status: "success" | "skipped" | "failed" }> = [];
  const errors: string[] = [];
  const targetDateStr = parsed.format("YYYY-MM-DD");

  const checkAndCollect = async (
    source: "gsc" | "ga4",
    range: "1d" | "7d" | "28d",
    collectFn: () => Promise<any>
  ) => {
    try {
      if (!force) {
        const existing = await getGrowthMetricSnapshot(targetDateStr, source, range, "default");
        if (existing && existing.status === "success") {
          results.push({ source, range, segment: "default", status: "skipped" });
          return;
        }
      }

      await collectFn();
      results.push({ source, range, segment: "default", status: "success" });
    } catch (err: any) {
      console.error(`Historical snapshot collection failed for ${source}:${range}:${targetDateStr}:`, err);
      const message = err.message || String(err);
      errors.push(`${source}:${range}:${targetDateStr} -> ${message}`);

      try {
        await upsertGrowthMetricSnapshot({
          snapshot_date: targetDateStr,
          source,
          range,
          segment: "default",
          metrics_json: {},
          details_json: {},
          status: "failed",
          error_message: message,
        });
      } catch (dbErr) {
        console.error("Failed to write historical error status to DB:", dbErr);
      }

      results.push({ source, range, segment: "default", status: "failed" });
    }
  };

  await checkAndCollect("gsc", "1d", () => collectGscSnapshot("1d", targetDateStr));
  await sleep(1000);
  await checkAndCollect("gsc", "7d", () => collectGscSnapshot("7d", targetDateStr));
  await sleep(1000);
  await checkAndCollect("gsc", "28d", () => collectGscSnapshot("28d", targetDateStr));
  await sleep(1000);
  await checkAndCollect("ga4", "1d", () => collectGa4Snapshot("1d", targetDateStr));
  await sleep(1000);
  await checkAndCollect("ga4", "7d", () => collectGa4Snapshot("7d", targetDateStr));
  await sleep(1000);
  await checkAndCollect("ga4", "28d", () => collectGa4Snapshot("28d", targetDateStr));

  return {
    success: errors.length === 0,
    results,
    errors,
  };
}
