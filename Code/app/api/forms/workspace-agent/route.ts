import { respData, respErr, respJson } from "@/lib/resp";

import {
  answerWorkspaceAgentQuery,
  buildWorkspaceAgentResponses,
} from "@/services/workspace-agent";
import { getFormCreationAllowance, listFormsByUser } from "@/services/form";
import { getFormDashboardMetrics } from "@/services/form-dashboard";
import { getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query) {
      return respErr("query is required");
    }

    const forms = await listFormsByUser(user_uuid);
    const [allowance, metrics] = await Promise.all([
      getFormCreationAllowance(user_uuid),
      getFormDashboardMetrics(forms),
    ]);
    const responses = buildWorkspaceAgentResponses(
      forms,
      metrics,
      allowance.canCreate
    );

    return respData({
      answer: answerWorkspaceAgentQuery(query, responses),
      metrics,
      form_count: forms.length,
      can_create: allowance.canCreate,
    });
  } catch (error: any) {
    console.log("workspace agent failed:", error);
    return respErr(error.message || "workspace agent failed");
  }
}
