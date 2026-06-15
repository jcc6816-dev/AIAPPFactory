import { NextRequest } from "next/server";
import {
  getGrowthMetricSnapshot,
  getLatestSnapshot,
  listGrowthMetricSnapshotsByDateRange,
} from "@/models/growth-metric-snapshot";

export const runtime = "nodejs";

// Verification handler for daily brief agent api key
function verifyAuth(req: NextRequest): boolean {
  const briefKey = process.env.GROWTH_DAILY_BRIEF_API_KEY;
  if (!briefKey) return false;

  // 1. Check Bearer Token
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === briefKey) {
      return true;
    }
  }

  return false;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Authentication
    const authenticated = verifyAuth(req);
    if (!authenticated) {
      return Response.json(
        { code: 401, message: "Unauthorized: Invalid or missing GROWTH_DAILY_BRIEF_API_KEY." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const date = normalizeDate(searchParams.get("date"));
    const from = normalizeDate(searchParams.get("from"));
    const to = normalizeDate(searchParams.get("to"));
    const source = normalizeSource(searchParams.get("source"));
    const range = normalizeRange(searchParams.get("range"));
    const limit = normalizeLimit(searchParams.get("limit"));

    if ((searchParams.get("date") && !date) || (searchParams.get("from") && !from) || (searchParams.get("to") && !to)) {
      return Response.json(
        { code: 400, message: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    if ((from && !to) || (!from && to)) {
      return Response.json(
        { code: 400, message: "Both from and to are required for range queries." },
        { status: 400 }
      );
    }

    if (from && to) {
      const snapshots = await listGrowthMetricSnapshotsByDateRange({
        from,
        to,
        source,
        range,
        limit,
      });

      return Response.json({
        code: 0,
        message: "Growth metric snapshot history retrieved successfully.",
        data: {
          snapshot_metadata: {
            generated_at: new Date().toISOString(),
            mode: "range",
            from,
            to,
            source: source || "all",
            range: range || "all",
            count: snapshots.length,
          },
          snapshots: snapshots.map(formatSnapshotRecord),
        },
      });
    }

    // 2. Retrieve requested-date or latest snapshots
    const getSnapshot = date
      ? (source: string, range: string, segment = "default") =>
          getGrowthMetricSnapshot(date, source, range, segment)
      : getLatestSnapshot;

    const [
      gsc28d, gsc7d,
      ga41d, ga47d, ga428d,
      clarity1d,
      pagespeedMobileHomepage, pagespeedDesktopHomepage
    ] = await Promise.all([
      getSnapshot("gsc", "28d"),
      getSnapshot("gsc", "7d"),
      getSnapshot("ga4", "1d"),
      getSnapshot("ga4", "7d"),
      getSnapshot("ga4", "28d"),
      getSnapshot("clarity", "1d"),
      getSnapshot("pagespeed", "mobile", "https://genforms.ai/"),
      getSnapshot("pagespeed", "desktop", "https://genforms.ai/")
    ]);

    // 3. Assemble Response JSON
    const dailyBrief = {
      snapshot_metadata: {
        generated_at: new Date().toISOString(),
        mode: date ? "date" : "latest",
        date: date || null,
      },
      gsc: {
        gsc_28d: gsc28d ? {
          snapshot_date: gsc28d.snapshot_date,
          fetched_at: gsc28d.fetched_at,
          metrics: gsc28d.metrics_json,
          top_queries: gsc28d.details_json?.queries?.slice(0, 10) || []
        } : null,
        gsc_7d: gsc7d ? {
          snapshot_date: gsc7d.snapshot_date,
          fetched_at: gsc7d.fetched_at,
          metrics: gsc7d.metrics_json,
          top_queries: gsc7d.details_json?.queries?.slice(0, 5) || []
        } : null,
      },
      ga4: {
        ga4_1d: ga41d ? {
          snapshot_date: ga41d.snapshot_date,
          fetched_at: ga41d.fetched_at,
          metrics: ga41d.metrics_json,
          funnel: ga41d.details_json?.funnel || []
        } : null,
        ga4_7d: ga47d ? {
          snapshot_date: ga47d.snapshot_date,
          metrics: ga47d.metrics_json,
        } : null,
        ga4_28d: ga428d ? {
          snapshot_date: ga428d.snapshot_date,
          metrics: ga428d.metrics_json,
        } : null,
      },
      clarity: clarity1d ? {
        snapshot_date: clarity1d.snapshot_date,
        fetched_at: clarity1d.fetched_at,
        metrics: clarity1d.metrics_json,
        top_urls: clarity1d.details_json?.url?.slice(0, 10) || []
      } : null,
      pagespeed_homepage: {
        mobile: pagespeedMobileHomepage ? {
          snapshot_date: pagespeedMobileHomepage.snapshot_date,
          tested_at: pagespeedMobileHomepage.details_json?.tested_at,
          scores: pagespeedMobileHomepage.metrics_json?.scores,
          metrics: pagespeedMobileHomepage.metrics_json?.metrics,
          opportunities: pagespeedMobileHomepage.details_json?.opportunities
        } : null,
        desktop: pagespeedDesktopHomepage ? {
          snapshot_date: pagespeedDesktopHomepage.snapshot_date,
          tested_at: pagespeedDesktopHomepage.details_json?.tested_at,
          scores: pagespeedDesktopHomepage.metrics_json?.scores,
          metrics: pagespeedDesktopHomepage.metrics_json?.metrics,
          opportunities: pagespeedDesktopHomepage.details_json?.opportunities
        } : null,
      }
    };

    return Response.json({
      code: 0,
      message: "Daily brief metrics snapshot retrieved successfully.",
      data: dailyBrief
    });

  } catch (error: any) {
    console.error("Error generating daily brief data:", error);
    return Response.json(
      { code: 3, message: `Internal server error: ${error.message || String(error)}` },
      { status: 500 }
    );
  }
}

function normalizeDate(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function normalizeSource(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().toLowerCase();
  return ["gsc", "ga4", "clarity", "pagespeed"].includes(trimmed) ? trimmed : undefined;
}

function normalizeRange(value: string | null): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim().toLowerCase();
  return /^[a-z0-9_-]{1,32}$/.test(trimmed) ? trimmed : undefined;
}

function normalizeLimit(value: string | null): number {
  if (!value) return 200;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 200;
  return Math.min(Math.max(Math.floor(parsed), 1), 1000);
}

function formatSnapshotRecord(record: any) {
  return {
    snapshot_date: record.snapshot_date,
    source: record.source,
    range: record.range,
    segment: record.segment,
    status: record.status,
    fetched_at: record.fetched_at,
    metrics: record.metrics_json,
    details: record.details_json,
    error_message: record.status === "failed" ? record.error_message : "",
  };
}
