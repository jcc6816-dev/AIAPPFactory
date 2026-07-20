import { respData, respErr } from "@/lib/resp";

import { findFormByShareCode, findFormByUuid } from "@/models/form";
import { createGrowthEventSafely } from "@/models/growth-event";
import { parseSubmitRequest } from "@/services/form-submission-request";
import { submitForm } from "@/services/form-runtime";
import { isFormPublished } from "@/services/form";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr("form id is required");
    }

    const form = (await findFormByUuid(id)) || (await findFormByShareCode(id));
    if (!form) {
      return respErr("form not found");
    }

    if (!isFormPublished(form)) {
      return respErr("form is not published");
    }

    const { answers, files, storage_files } = await parseSubmitRequest(req, form);
    if (!answers || typeof answers !== "object") {
      return respErr("answers are required");
    }

    const submission = await submitForm(form, {
      answers,
      files: Array.isArray(files) ? files : [],
      storage_files: Array.isArray(storage_files) ? storage_files : [],
    });
    await createGrowthEventSafely({
      event_name: "public_form_submitted",
      visitor_id: "",
      path: `/api/forms/${id}/submit`,
      form_uuid: form.uuid,
      share_code: form.share_code,
      source: "public_form",
      metadata_json: {
        submission_uuid: submission.uuid,
        fields: Object.keys(answers),
      },
    });

    return respData(submission);
  } catch (error: any) {
    console.log("submit form failed:", error);
    return respErr(error.message || "submit form failed");
  }
}
