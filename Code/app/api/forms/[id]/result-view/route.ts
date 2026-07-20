import { respData, respErr, respJson } from "@/lib/resp";
import { getFormSubmissionByUuid } from "@/models/form-submission";
import {
  isFirstSuccessLoopEnabled,
  recordTrustedFirstResultView,
} from "@/services/first-success";
import { getFormByUuidForUser } from "@/services/form";
import { getUserUuid } from "@/services/user";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respJson(-2, "no auth");
    }
    if (!isFirstSuccessLoopEnabled()) {
      return respData({
        first_result_recorded: false,
        activation_completed: false,
        disabled: true,
      });
    }

    const { id } = await params;
    const form = await getFormByUuidForUser(userUuid, id);
    if (!form) {
      return respErr("form not found");
    }

    const body = await req.json();
    const submissionUuid = String(body?.submission_uuid || "").trim();
    if (!submissionUuid) {
      return respErr("submission uuid is required");
    }

    const submission = await getFormSubmissionByUuid(submissionUuid);
    if (!submission || submission.form_uuid !== form.uuid) {
      return respErr("submission not found");
    }

    const result = await recordTrustedFirstResultView({
      userUuid,
      formUuid: form.uuid,
      shareCode: form.share_code,
      submission,
    });

    return respData({
      first_result_recorded: result.firstResultRecorded,
      activation_completed: result.activationCompleted,
      activation_recorded: result.activationRecorded,
    });
  } catch (error: any) {
    console.log("record trusted result view failed:", error);
    return respErr(error.message || "record result view failed");
  }
}
