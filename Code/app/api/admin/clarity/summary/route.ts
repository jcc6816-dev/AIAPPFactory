import { getUserEmail } from "@/services/user";
import { respData } from "@/lib/resp";
import crypto from "crypto";
import {
  getClarityMetricCount,
  getClarityNumber,
} from "@/lib/clarity-metrics";

// ===== 强内存缓存设计 =====
interface CacheEntry {
  data: {
    url: any[];
    device: any[];
    countryRegion: any[];
  };
  timestamp: number;
}

const cacheMap = new Map<string, CacheEntry>();
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 小时缓存

// ===== 鉴权中间件 =====
async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("unauthorized");
  }
}

// ===== 维度数据兼容清洗器 =====
function cleanClarityData(rawData: any[], dimKey: string) {
  if (!Array.isArray(rawData)) return [];

  const tempMap = new Map<string, {
    key: string;
    sessions: number;
    scrollDepth: number;
    engagementTime: number;
    deadClicks: number;
    rageClicks: number;
    quickBacks: number;
    scriptErrors: number;
  }>();

  // Helper to retrieve dimension value from a record
  const getDimValue = (record: any): string => {
    const dimensionAliases: Record<string, string[]> = {
      URL: ["URL", "Url", "url", "dimensionValue", "dimension1", "dimension", "key", "name"],
      Device: ["Device", "device", "dimensionValue", "dimension1", "dimension", "key", "name"],
      "Country/Region": [
        "Country/Region",
        "Country",
        "country",
        "countryRegion",
        "CountryRegion",
        "Region",
        "region",
        "dimensionValue",
        "dimension1",
        "dimension",
        "key",
        "name",
      ],
    };

    for (const alias of dimensionAliases[dimKey] || [dimKey]) {
      if (record[alias] !== undefined && record[alias] !== null && String(record[alias]).trim()) {
        return String(record[alias]);
      }
    }

    // Last-resort fallback for unexpected future Clarity response shapes.
    const knownMetricKeys = [
      "totalSessionCount", "totalBotSessionCount", "sessionCount", "sessionsCount", "sessions", "count",
      "averageScrollDepth", "scrollDepth", "averageEngagementTime", "engagementTime", "duration", "value",
      "deadClickCount", "rageClickCount", "quickbackClick", "scriptErrorCount",
      "sessionsWithMetricPercentage", "sessionsWithoutMetricPercentage", "pagesViews", "subTotal",
    ];
    for (const key of Object.keys(record)) {
      if (!knownMetricKeys.includes(key)) {
        return String(record[key]);
      }
    }
    return "Unknown";
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

      // Match metric name (case-insensitive and ignoring spaces/hyphens for maximum resilience)
      const normalizedMetricName = metricName.toLowerCase().replace(/[\s-_]/g, "");

      if (normalizedMetricName === "traffic") {
        entry.sessions = getClarityNumber(record.totalSessionCount ?? record.sessionCount ?? record.sessionsCount ?? record.sessions ?? record.count);
      } else if (normalizedMetricName === "scrolldepth" || normalizedMetricName === "averagescrolldepth") {
        entry.scrollDepth = getClarityNumber(record.averageScrollDepth ?? record.scrollDepth ?? record.value);
      } else if (normalizedMetricName === "engagementtime" || normalizedMetricName === "averageengagementtime") {
        entry.engagementTime = getClarityNumber(record.averageEngagementTime ?? record.engagementTime ?? record.duration ?? record.value);
      } else if (normalizedMetricName === "deadclickcount" || normalizedMetricName === "deadclicks" || normalizedMetricName === "deadclick") {
        entry.deadClicks = getClarityMetricCount(record, ["deadClickCount"]);
      } else if (normalizedMetricName === "rageclickcount" || normalizedMetricName === "rageclicks" || normalizedMetricName === "rageclick") {
        entry.rageClicks = getClarityMetricCount(record, ["rageClickCount"]);
      } else if (normalizedMetricName === "quickbackclick" || normalizedMetricName === "quickbacks" || normalizedMetricName === "quickback") {
        entry.quickBacks = getClarityMetricCount(record, ["quickbackClick"]);
      } else if (normalizedMetricName === "scripterrorcount" || normalizedMetricName === "scripterrors" || normalizedMetricName === "scripterror") {
        entry.scriptErrors = getClarityMetricCount(record, ["scriptErrorCount"]);
      }
    }
  }

  return Array.from(tempMap.values()).sort((a, b) => b.sessions - a.sessions);
}

export async function GET(req: Request) {
  let numOfDays = 1;
  try {
    // 1. 严格的管理员鉴权
    try {
      await requireAdmin();
    } catch (e) {
      return Response.json({ code: 403, message: "unauthorized" }, { status: 403 });
    }

    // 2. 解析 query 参数
    const { searchParams } = new URL(req.url);
    numOfDays = Number(searchParams.get("numOfDays") || "1");
    if (![1, 2, 3].includes(numOfDays)) {
      numOfDays = 1;
    }

    // 3. 读取服务器环境变量中的 Token (严禁暴露给前端)
    // 必须首先校验 Token 缺失，不使用缓存
    const token = process.env.CLARITY_API_TOKEN;
    if (!token) {
      return Response.json({
        code: 1,
        message: "Clarity API token (CLARITY_API_TOKEN) is not configured in environment variables.",
        numOfDays,
      });
    }

    // 4. 检查 12 小时本地内存缓存 (使用 token fingerprint 标识缓存 key)
    const fingerprint = crypto.createHash("sha256").update(token).digest("hex");
    const cacheKey = `${fingerprint}_${numOfDays}`;
    const now = Date.now();
    const cachedEntry = cacheMap.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL) {
      return respData({
        ...cachedEntry.data,
        fromCache: true,
        lastFetchedAt: new Date(cachedEntry.timestamp).toISOString(),
        numOfDays,
      });
    }

    // 5. 对接微软数据导出 API (URL, Device, Country/Region)
    const dimensions = ["URL", "Device", "Country/Region"];
    const results: Record<string, any[]> = {
      url: [],
      device: [],
      countryRegion: [],
    };

    for (const dim of dimensions) {
      const apiUrl = `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=${numOfDays}&dimension1=${encodeURIComponent(dim)}`;
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // 捕获 API 错误，并在服务器控制台记录，防止向客户端暴露敏感错误细节
        let errText = "";
        try {
          errText = await response.text();
        } catch (_) {}
        console.error(`Clarity API responded with error (HTTP ${response.status}): ${errText}`);

        return Response.json({
          code: 2,
          message: `Failed to fetch data from Clarity API (HTTP ${response.status})`,
          status: response.status,
          numOfDays,
        });
      }

      const rawData = await response.json();
      const cleaned = cleanClarityData(rawData, dim);

      if (dim === "URL") results.url = cleaned;
      else if (dim === "Device") results.device = cleaned;
      else if (dim === "Country/Region") results.countryRegion = cleaned;
    }

    // 6. 成功拉取，同步缓存
    const payload = {
      url: results.url,
      device: results.device,
      countryRegion: results.countryRegion,
    };

    cacheMap.set(cacheKey, {
      data: payload,
      timestamp: now,
    });

    return respData({
      ...payload,
      fromCache: false,
      lastFetchedAt: new Date(now).toISOString(),
      numOfDays,
    });

  } catch (error: any) {
    return Response.json({
      code: 3,
      message: `Internal server error during Clarity integration: ${error.message || "Unknown error"}`,
      numOfDays,
    });
  }
}
