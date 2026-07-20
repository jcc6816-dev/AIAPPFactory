import { listGrowthEvents } from "@/models/growth-event";
import { getForms } from "@/models/form";
import { buildFormPublishActivationMonitor } from "@/services/form-publish-activation-monitor";

export const runtime = "nodejs";

function verifyAuth(req: Request) {
  const key = process.env.HERMES_MONITOR_API_KEY;
  const header = req.headers.get("authorization");
  return Boolean(key && header?.toLowerCase().startsWith("bearer ") && header.slice(7).trim() === key);
}

function boundedInteger(value: string | null, fallback: number, min: number, max: number) {
  if (!value) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return parsed >= min && parsed <= max ? parsed : null;
}

export async function GET(req: Request) {
  if (!verifyAuth(req)) {
    return Response.json({ code: 401, message: "Unauthorized: Invalid or missing HERMES_MONITOR_API_KEY." }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const hours = boundedInteger(params.get("hours"), 24, 1, 168);
  const pendingAfterMinutes = boundedInteger(params.get("pending_after_minutes"), 30, 5, 1440);
  if (!hours || !pendingAfterMinutes) {
    return Response.json({ code: 400, message: "Invalid query." }, { status: 400 });
  }

  const [forms, events] = await Promise.all([getForms(1, 500), listGrowthEvents(5000)]);
  return Response.json({
    code: 0,
    message: "Form publish activation monitor retrieved successfully.",
    data: buildFormPublishActivationMonitor(forms, events, { hours, pendingAfterMinutes }),
  });
}
