import { respData, respErr, respJson } from "@/lib/resp";
import { buildPageAgentResponse } from "@/lib/page-agent-response";

import {
  answerSettingsAgentQuery,
  buildSettingsAgentResponses,
} from "@/services/settings-agent";
import { getFormCreationAllowance } from "@/services/form";
import { getUserInfo, getUserUuid } from "@/services/user";

export async function POST(req: Request) {
  try {
    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respJson(-2, "no auth");
    }

    const userInfo = await getUserInfo();
    if (!userInfo?.email) {
      return respJson(-2, "no auth");
    }

    const body = await req.json();
    const query = typeof body.query === "string" ? body.query.trim() : "";
    if (!query) {
      return respErr("query is required");
    }

    const allowance = await getFormCreationAllowance(user_uuid);
    const responses = buildSettingsAgentResponses(
      {
        uuid: user_uuid,
        email: userInfo.email,
        nickname: userInfo.nickname || "",
      },
      allowance
    );
    const answer = answerSettingsAgentQuery(query, responses);
    const agent_response = buildPageAgentResponse(answer, {
      query,
      meta: {
        source: "settings-agent",
      },
    });

    return respData({
      answer,
      agent_response,
      allowance,
    });
  } catch (error: any) {
    console.log("settings agent failed:", error);
    return respErr(error.message || "settings agent failed");
  }
}
