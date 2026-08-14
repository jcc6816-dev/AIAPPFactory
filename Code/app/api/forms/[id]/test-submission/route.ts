import {
  respBadRequest,
  respData,
  respErr,
  respForbidden,
  respUnauthorized,
} from "@/lib/resp";

import { getUserUuid } from "@/services/user";
import { createGrowthEventSafely } from "@/models/growth-event";
import {
  deleteTestFormSubmission,
  getFormSubmissionByRequestId,
} from "@/models/form-submission";
import { parseSubmitRequest } from "@/services/form-submission-request";
import { submitForm } from "@/services/form-runtime";
import { getFormByUuidForUser, isFormPublished } from "@/services/form";
import {
  checkFirstSuccessRateLimit,
  isFirstSuccessLoopEnabled,
} from "@/services/first-success";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respUnauthorized();
    }
    if (!isFirstSuccessLoopEnabled()) {
      return respErr("first success loop is disabled");
    }

    const { id } = await params;
    if (!id) {
      return respBadRequest("form id is required");
    }

    const form = await getFormByUuidForUser(userUuid, id);
    if (!form) {
      return respForbidden("form not found");
    }
    if (!isFormPublished(form)) {
      return respBadRequest("form is not published");
    }
    if (!checkFirstSuccessRateLimit(userUuid, form.uuid)) {
      return respErr("too many test submissions; please try again later");
    }

    const requestId = (req.headers.get("Idempotency-Key") || "").trim().slice(0, 120);
    const replay = requestId
      ? await getFormSubmissionByRequestId(form.uuid, requestId)
      : undefined;
    if (replay) {
      return respData({ ...replay, replayed: true });
    }

    const payload = await parseSubmitRequest(req, form);
    if (!payload.answers || typeof payload.answers !== "object") {
      return respBadRequest("answers are required");
    }

    const submission = await submitForm(form, payload, {
      mode: "test",
      requestId: requestId || undefined,
    });
    // Analytics must never delay a creator from seeing a successfully saved
    // test response. The submission is already durable at this point.
    void Promise.resolve(createGrowthEventSafely({
      event_name: "test_submission_completed",
      visitor_id: "",
      user_uuid: userUuid,
      path: `/api/forms/${id}/test-submission`,
      form_uuid: form.uuid,
      share_code: form.share_code,
      source: "first_success_loop",
      metadata_json: {
        submission_uuid: submission.uuid,
      },
    })).catch((error) => {
      console.warn("test submission growth event failed:", error);
    });

    return respData({ ...submission, replayed: false });
  } catch (error: any) {
    console.log("test submission failed:", error);
    return respErr(error.message || "test submission failed");
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userUuid = await getUserUuid();
    if (!userUuid) {
      return respUnauthorized();
    }

    const { id } = await params;
    if (!id) {
      return respBadRequest("form id is required");
    }

    const form = await getFormByUuidForUser(userUuid, id);
    if (!form) {
      return respForbidden("form not found");
    }

    const body = await req.json();
    const submissionUuid = String(body?.submission_uuid || "").trim();
    if (!submissionUuid) {
      return respBadRequest("submission uuid is required");
    }

    const deleted = await deleteTestFormSubmission(form.uuid, submissionUuid);
    if (!deleted) {
      return respErr("test submission not found");
    }

    return respData({ deleted: true, submission_uuid: submissionUuid });
  } catch (error: any) {
    console.log("delete test submission failed:", error);
    return respErr(error.message || "delete test submission failed");
  }
}
