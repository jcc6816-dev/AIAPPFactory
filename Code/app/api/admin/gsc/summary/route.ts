import { getUserEmail } from "@/services/user";
import { respData } from "@/lib/resp";
import crypto from "crypto";
import moment from "moment";

export const runtime = "nodejs";

// ===== 强内存缓存设计 =====
interface CacheEntry {
  data: {
    summary: {
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    };
    queries: any[];
    pages: any[];
    countries: any[];
    devices: any[];
  };
  timestamp: number;
}

const cacheMap = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 小时缓存

// ===== 鉴权中间件 =====
async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("unauthorized");
  }
}

// ===== Google JWT / OAuth 认证生成器 =====
async function getGoogleAccessToken(
  authMode: "oauth" | "service_account",
  credentials: {
    privateKey?: string;
    clientEmail?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
  }
): Promise<string> {
  if (authMode === "oauth") {
    const { clientId, clientSecret, refreshToken } = credentials;
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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

    const header = {
      alg: "RS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const claimSet = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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

// ===== GSC 数据行清洗器 =====
function mapGscRows(gscData: any) {
  if (!gscData || !Array.isArray(gscData.rows)) return [];
  return gscData.rows.map((row: any) => ({
    key: Array.isArray(row.keys) ? row.keys[0] : "Unknown",
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    ctr: Number((row.ctr || 0) * 100), // GSC CTR 转换成百分比
    position: Number(row.position || 0),
  }));
}

export async function GET(req: Request) {
  let numOfDays = 28;
  try {
    // 1. 严格的管理员鉴权
    try {
      await requireAdmin();
    } catch (e) {
      return Response.json({ code: 403, message: "unauthorized" }, { status: 403 });
    }

    // 2. 解析 query 参数
    const { searchParams } = new URL(req.url);
    numOfDays = Number(searchParams.get("numOfDays") || "28");
    if (![7, 28].includes(numOfDays)) {
      numOfDays = 28;
    }

    // 3. 读取凭证并进行认证模式分流
    const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    const propertyUrl = process.env.GSC_PROPERTY_URL;

    if (!propertyUrl) {
      return Response.json({
        code: 1,
        message: "Google Service Account credentials or GSC property URL is not configured.",
        numOfDays,
      });
    }

    const oauthKeys = [oauthClientId, oauthClientSecret, oauthRefreshToken];
    const oauthPresentCount = oauthKeys.filter(Boolean).length;
    const isOauthComplete = oauthPresentCount === 3;
    const isOauthPartial = oauthPresentCount > 0 && oauthPresentCount < 3;

    if (isOauthPartial) {
      return Response.json({
        code: 1,
        message: "Google OAuth variables are partially configured. Please configure all of: GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN.",
        numOfDays,
      });
    }

    let authMode: "oauth" | "service_account" = "oauth";
    let authFingerprint = "";

    let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
    if (!serviceAccountKey && base64Key) {
      try {
        serviceAccountKey = Buffer.from(base64Key, "base64").toString("utf-8");
      } catch (err) {
        console.error("Failed to decode GOOGLE_SERVICE_ACCOUNT_KEY_BASE64:", err);
      }
    }

    let privateKey = "";
    let clientEmail = "";

    if (isOauthComplete) {
      authMode = "oauth";
      authFingerprint = crypto.createHash("sha256").update(oauthRefreshToken || "").digest("hex");
    } else {
      // Fallback to Service Account
      if (!serviceAccountKey) {
        return Response.json({
          code: 1,
          message: "Google Service Account credentials or GSC property URL is not configured.",
          numOfDays,
        });
      }

      let parsedCredentials: any;
      try {
        parsedCredentials = JSON.parse(serviceAccountKey);
      } catch (err) {
        return Response.json({
          code: 1,
          message: "Google Service Account key is not a valid JSON string.",
          numOfDays,
        });
      }

      privateKey = parsedCredentials.private_key;
      clientEmail = parsedCredentials.client_email;
      if (!privateKey || !clientEmail) {
        return Response.json({
          code: 1,
          message: "Google Service Account key JSON is missing private_key or client_email.",
          numOfDays,
        });
      }

      authMode = "service_account";
      authFingerprint = crypto.createHash("sha256").update(serviceAccountKey).digest("hex");
    }

    // 4. 检查 24 小时本地内存缓存 (缓存 key 中包含 authMode 和证书指纹)
    const propertyFingerprint = crypto
      .createHash("sha256")
      .update(propertyUrl)
      .digest("hex");
    const cacheKey = `${authMode}_${authFingerprint}_${propertyFingerprint}_gsc_${numOfDays}`;
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

    // 5. 生成 Google Access Token
    let accessToken = "";
    try {
      accessToken = await getGoogleAccessToken(authMode, {
        privateKey,
        clientEmail,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
      });
    } catch (err: any) {
      const httpStatus = err.status || 500;
      console.error("GSC Access Token Exchange Error (HTTP status):", httpStatus);
      return Response.json({
        code: 2,
        message: authMode === "oauth" ? "Failed to authenticate with Google OAuth." : "Failed to authenticate with Google Service Account.",
        status: httpStatus,
        numOfDays,
      });
    }

    // 6. 确定日期范围（endDate 使用昨天）
    const endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const startDate = moment().subtract(numOfDays, "days").format("YYYY-MM-DD");

    // 7. 多维度并发数据拉取
    const dimensions = ["query", "page", "country", "device"];
    
    try {
      const [queriesRaw, pagesRaw, countriesRaw, devicesRaw] = await Promise.all(
        dimensions.map(async (dim) => {
          const response = await fetch(
            `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${accessToken}`,
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
          if (!response.ok) {
            throw { status: response.status, text: await response.text() };
          }
          return response.json();
        })
      );

      // 拉取全站总览指标 (无 dimensions)
      const summaryResponse = await fetch(
        `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
            rowLimit: 1,
          }),
        }
      );

      if (!summaryResponse.ok) {
        throw { status: summaryResponse.status, text: await summaryResponse.text() };
      }
      const summaryRaw = await summaryResponse.json();

      const summaryRow = summaryRaw.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
      const summary = {
        clicks: Number(summaryRow.clicks || 0),
        impressions: Number(summaryRow.impressions || 0),
        ctr: Number((summaryRow.ctr || 0) * 100),
        position: Number(summaryRow.position || 0),
      };

      const payload = {
        summary,
        queries: mapGscRows(queriesRaw),
        pages: mapGscRows(pagesRaw),
        countries: mapGscRows(countriesRaw),
        devices: mapGscRows(devicesRaw),
      };

      // 成功拉取，同步缓存
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

    } catch (gscErr: any) {
      const httpStatus = gscErr.status || 500;
      console.error(`Google Search Console API error (HTTP ${httpStatus})`);

      return Response.json({
        code: 2,
        message: `Failed to fetch data from Google Search Console (HTTP ${httpStatus})`,
        status: httpStatus,
        numOfDays,
      });
    }

  } catch (error: any) {
    return Response.json({
      code: 3,
      message: `Internal server error during GSC integration: ${error.message || "Unknown error"}`,
      numOfDays,
    });
  }
}
