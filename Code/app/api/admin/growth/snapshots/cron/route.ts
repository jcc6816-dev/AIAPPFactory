import { NextRequest } from "next/server";
import { getUserEmail } from "@/services/user";
import { runAllSnapshots } from "@/services/growth-snapshot";

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

    console.log(`Starting snapshot collection task. Force: ${force}`);
    const summary = await runAllSnapshots(force);

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
