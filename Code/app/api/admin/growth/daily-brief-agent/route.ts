import { NextRequest } from "next/server";
import { getLatestSnapshot } from "@/models/growth-metric-snapshot";

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

    // 2. Retrieve Latest Snapshots
    const [
      gsc28d, gsc7d,
      ga41d, ga47d, ga428d,
      clarity1d,
      pagespeedMobileHomepage, pagespeedDesktopHomepage
    ] = await Promise.all([
      getLatestSnapshot("gsc", "28d"),
      getLatestSnapshot("gsc", "7d"),
      getLatestSnapshot("ga4", "1d"),
      getLatestSnapshot("ga4", "7d"),
      getLatestSnapshot("ga4", "28d"),
      getLatestSnapshot("clarity", "1d"),
      getLatestSnapshot("pagespeed", "mobile", "https://genforms.ai/"),
      getLatestSnapshot("pagespeed", "desktop", "https://genforms.ai/")
    ]);

    // 3. Assemble Response JSON
    const dailyBrief = {
      snapshot_metadata: {
        generated_at: new Date().toISOString(),
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
