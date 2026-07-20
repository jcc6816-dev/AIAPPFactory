import { NextRequest } from "next/server";
import { listGrowthEvents } from "@/models/growth-event";
import { buildFormsNewActivationMonitor } from "@/services/forms-new-activation-monitor";

export const runtime = "nodejs";

function verifyAuth(req: NextRequest): boolean {
  const monitorKey = process.env.HERMES_MONITOR_API_KEY;
  if (!monitorKey) return false;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.toLowerCase().startsWith("bearer ")) return false;

  return authHeader.substring(7).trim() === monitorKey;
}

function normalizeInteger(
  value: string | null,
  fallback: number,
  min: number,
  max: number
): number | null {
  if (!value) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
}

export async function GET(req: NextRequest) {
  if (!verifyAuth(req)) {
    return Response.json(
      { code: 401, message: "Unauthorized: Invalid or missing HERMES_MONITOR_API_KEY." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const hours = normalizeInteger(searchParams.get("hours"), 24, 1, 168);
  const limit = normalizeInteger(searchParams.get("limit"), 3000, 100, 5000);

  if (!hours || !limit) {
    return Response.json(
      { code: 400, message: "Invalid query. Use hours=1..168 and limit=100..5000." },
      { status: 400 }
    );
  }

  const events = await listGrowthEvents(limit);
  const monitor = buildFormsNewActivationMonitor(events, { hours });

  return Response.json({
    code: 0,
    message: "Forms-new activation monitor retrieved successfully.",
    data: monitor,
  });
}
