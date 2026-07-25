import crypto from "crypto";
import moment from "moment";

import { respData } from "@/lib/resp";
import { getUserEmail } from "@/services/user";

export const runtime = "nodejs";

const CACHE_TTL = 60 * 60 * 1000;
const TARGET_EVENTS = [
  "demo_start",
  "demo_complete",
  "template_use_click",
  "form_generate",
  "form_saved",
  "form_publish",
  "form_submit",
];

interface CacheEntry {
  data: Ga4SummaryPayload;
  timestamp: number;
}

interface Ga4MetricRow {
  key: string;
  sessions: number;
  activeUsers: number;
  newUsers?: number;
  eventCount: number;
}

interface Ga4EventRow {
  eventName: string;
  eventCount: number;
}

interface Ga4SummaryPayload {
  summary: {
    sessions: number;
    activeUsers: number;
    newUsers: number;
    eventCount: number;
  };
  funnel: Ga4EventRow[];
  sources: Ga4MetricRow[];
  landingPages: Ga4MetricRow[];
  devices: Ga4MetricRow[];
  countries: Ga4MetricRow[];
}

const cacheMap = new Map<string, CacheEntry>();

async function requireAdmin() {
  const email = await getUserEmail();
  const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());

  if (!email || !adminEmails?.includes(email)) {
    throw new Error("unauthorized");
  }
}

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
    return data.access_token as string;
  } else {
    const { privateKey, clientEmail } = credentials;
    if (!privateKey || !clientEmail) {
      throw { status: 400, message: "Missing Service Account credentials." };
    }

    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: "RS256",
      typ: "JWT",
    };
    const claimSet = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
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
    return data.access_token as string;
  }
}

function readServiceAccountKey() {
  let serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;

  if (!serviceAccountKey && base64Key) {
    serviceAccountKey = Buffer.from(base64Key, "base64").toString("utf-8");
  }

  if (!serviceAccountKey) {
    return null;
  }

  try {
    const parsed = JSON.parse(serviceAccountKey);
    if (!parsed.private_key || !parsed.client_email) {
      return null;
    }

    return {
      raw: serviceAccountKey,
      privateKey: parsed.private_key as string,
      clientEmail: parsed.client_email as string,
    };
  } catch {
    return null;
  }
}

async function runGa4Report({
  accessToken,
  propertyId,
  body,
}: {
  accessToken: string;
  propertyId: string;
  body: Record<string, unknown>;
}) {
  const response = await fetch(
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

  if (!response.ok) {
    throw { status: response.status };
  }

  return response.json();
}

function metricValue(row: any, index: number) {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function dimensionValue(row: any, index: number) {
  return String(row?.dimensionValues?.[index]?.value || "Unknown");
}

function mapMetricRows(report: any) {
  if (!Array.isArray(report?.rows)) {
    return [];
  }

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

export async function GET(req: Request) {
  let numOfDays = 28;

  try {
    try {
      await requireAdmin();
    } catch {
      return Response.json({ code: 403, message: "unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    numOfDays = Number(searchParams.get("numOfDays") || "28");
    if (![7, 28].includes(numOfDays)) {
      numOfDays = 28;
    }

    const oauthClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const oauthClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const oauthRefreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!propertyId) {
      return Response.json({
        code: 1,
        message: "GA4 property ID is not configured.",
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

    const credentials = readServiceAccountKey();

    let privateKey = "";
    let clientEmail = "";

    if (isOauthComplete) {
      authMode = "oauth";
      authFingerprint = crypto.createHash("sha256").update(oauthRefreshToken || "").digest("hex");
    } else {
      // Fallback to Service Account
      if (!credentials) {
        return Response.json({
          code: 1,
          message: "Neither Google OAuth nor Service Account credentials are configured.",
          numOfDays,
        });
      }
      privateKey = credentials.privateKey;
      clientEmail = credentials.clientEmail;
      authMode = "service_account";
      authFingerprint = crypto.createHash("sha256").update(credentials.raw).digest("hex");
    }

    const propertyFingerprint = crypto
      .createHash("sha256")
      .update(propertyId)
      .digest("hex");
    const cacheKey = `${authMode}_${authFingerprint}_${propertyFingerprint}_ga4_${numOfDays}`;
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
      console.error("GA4 Access Token Exchange Error (HTTP status):", httpStatus);
      return Response.json({
        code: 2,
        message: authMode === "oauth" ? "Failed to authenticate with Google OAuth." : "Failed to authenticate with Google Service Account.",
        status: httpStatus,
        numOfDays,
      });
    }

    const endDate = moment().subtract(1, "days").format("YYYY-MM-DD");
    const startDate = moment().subtract(numOfDays, "days").format("YYYY-MM-DD");
    const dateRanges = [{ startDate, endDate }];
    const sharedMetrics = [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "eventCount" },
    ];
    const acquisitionMetrics = [
      { name: "sessions" },
      { name: "activeUsers" },
    ];

    try {
      const [
        summaryRaw,
        eventsRaw,
        sourcesRaw,
        landingPagesRaw,
        devicesRaw,
        countriesRaw,
      ] = await Promise.all([
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            metrics: [
              { name: "sessions" },
              { name: "activeUsers" },
              { name: "newUsers" },
              { name: "eventCount" },
            ],
          },
        }),
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            dimensions: [{ name: "eventName" }],
            metrics: [{ name: "eventCount" }],
            dimensionFilter: {
              filter: {
                fieldName: "eventName",
                inListFilter: {
                  values: TARGET_EVENTS,
                },
              },
            },
            limit: 20,
          },
        }),
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            dimensions: [{ name: "sourceMedium" }],
            // GA4 Data API rejects sourceMedium + eventCount as an incompatible
            // dimension/metric pair. Acquisition only needs sessions/users here.
            metrics: acquisitionMetrics,
            limit: 20,
          },
        }),
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            dimensions: [{ name: "landingPagePlusQueryString" }],
            metrics: sharedMetrics,
            limit: 20,
          },
        }),
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            dimensions: [{ name: "deviceCategory" }],
            metrics: sharedMetrics,
            limit: 20,
          },
        }),
        runGa4Report({
          accessToken,
          propertyId,
          body: {
            dateRanges,
            dimensions: [{ name: "country" }],
            metrics: sharedMetrics,
            limit: 20,
          },
        }),
      ]);

      const summaryRow = summaryRaw?.rows?.[0];
      const payload: Ga4SummaryPayload = {
        summary: {
          sessions: metricValue(summaryRow, 0),
          activeUsers: metricValue(summaryRow, 1),
          newUsers: metricValue(summaryRow, 2),
          eventCount: metricValue(summaryRow, 3),
        },
        funnel: mapEventRows(eventsRaw),
        sources: mapMetricRows(sourcesRaw),
        landingPages: mapMetricRows(landingPagesRaw),
        devices: mapMetricRows(devicesRaw),
        countries: mapMetricRows(countriesRaw),
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
    } catch (ga4Err: any) {
      const httpStatus = ga4Err?.status || 500;
      console.error(`Google Analytics Data API error (HTTP ${httpStatus})`);

      return Response.json({
        code: 2,
        message: `Failed to fetch data from Google Analytics Data API (HTTP ${httpStatus})`,
        status: httpStatus,
        numOfDays,
      });
    }
  } catch (error: any) {
    return Response.json({
      code: 3,
      message: `Internal server error during GA4 integration: ${error?.message || "Unknown error"}`,
      numOfDays,
    });
  }
}
