import { NextRequest } from "next/server";
import { getUserEmail } from "@/services/user";
import { runAllSnapshots, runHistoricalGoogleSnapshots } from "@/services/growth-snapshot";

export const runtime = "nodejs";

// Helper to verify admin credentials
async function isAdmin() {
  try {
    const email = await getUserEmail();
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((item) => item.trim());
    return !!(email && adminEmails?.includes(email));
  } catch {
    return false;
  }
}

// Verification handler for cron secret or admin session
async function verifyAuth(req: NextRequest): Promise<boolean> {
  // 1. Check Bearer Token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.GROWTH_CRON_SECRET;
  
  if (cronSecret && authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === cronSecret) {
      return true;
    }
  }

  // 2. Fallback to active admin session
  return await isAdmin();
}

export async function GET(req: NextRequest) {
  return handleTrigger(req);
}

export async function POST(req: NextRequest) {
  return handleTrigger(req);
}

async function handleTrigger(req: NextRequest) {
  try {
    // 1. Verify authentication
    const authenticated = await verifyAuth(req);
    if (!authenticated) {
      return Response.json(
        { code: 401, message: "Unauthorized: Invalid secret key or no admin session." },
        { status: 401 }
      );
    }

    // 2. Check cron secret configuration check
    const cronSecret = process.env.GROWTH_CRON_SECRET;
    if (!cronSecret) {
      return Response.json(
        { code: 500, message: "Configuration Error: GROWTH_CRON_SECRET is not configured in environment variables." },
        { status: 500 }
      );
    }

    // 3. Parse parameters
    const { searchParams } = new URL(req.url);
    const force = searchParams.get("force") === "true" || searchParams.get("force") === "1";
    const targetDate = normalizeDate(searchParams.get("date"));

    if (searchParams.get("date") && !targetDate) {
      return Response.json(
        { code: 400, message: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 }
      );
    }

    console.log(
      targetDate
        ? `Starting historical Google snapshot collection task. Date: ${targetDate}. Force: ${force}`
        : `Starting snapshot collection task. Force: ${force}`
    );
    const summary = targetDate
      ? await runHistoricalGoogleSnapshots(targetDate, force)
      : await runAllSnapshots(force);

    if (summary.success) {
      return Response.json({
        code: 0,
        message: "Snapshot collection completed successfully.",
        results: summary.results
      });
    } else {
      return Response.json({
        code: 2,
        message: "Snapshot collection completed with some errors.",
        results: summary.results,
        errors: summary.errors
      }, { status: 207 }); // Multi-Status / Partial Success
    }

  } catch (error: any) {
    console.error("Fatal error in snapshot cron handler:", error);
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
