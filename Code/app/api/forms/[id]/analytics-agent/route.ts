import { respData, respErr, respJson } from "@/lib/resp";

import { answerFormAnalyticsAgentQuery } from "@/services/form-analytics-agent";
import { getFormByUuidForUser } from "@/services/form";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getUserUuid } from "@/services/user";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const { id } = await params;
    if (!id) {
      return respErr("form id is required");
    }

    const form = await getFormByUuidForUser(user_uuid, id);
    if (!form) {
      return respErr("form not found");
    }

    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query) {
      return respErr("query is required");
    }

    const metrics = await getFormDashboardMetrics([form]);

    return respData({
      answer: answerFormAnalyticsAgentQuery(query, metrics),
      metrics,
    });
  } catch (error: any) {
    console.log("analytics agent failed:", error);
    return respErr(error.message || "analytics agent failed");
  }
}
