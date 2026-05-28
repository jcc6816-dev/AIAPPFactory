import { respData, respErr } from "@/lib/resp";

import { findFormByShareCode, findFormByUuid } from "@/models/form";
import { createGrowthEventSafely } from "@/models/growth-event";
import { submitForm } from "@/services/form-runtime";
import { isFormPublished } from "@/services/form";
import { persistSubmissionFiles } from "@/services/submission-file";

async function parseSubmitRequest(req: Request, form: Awaited<ReturnType<typeof findFormByUuid>>) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const answersValue = formData.get("answers");
    if (typeof answersValue !== "string") {
      throw new Error("answers are required");
    }

    const answers = JSON.parse(answersValue);
    const uploadEntries: Array<{ field_key: string; file: File }> = [];

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("file:") || !(value instanceof File) || value.size <= 0) {
        continue;
      }

      uploadEntries.push({
        field_key: key.slice(5),
        file: value,
      });
    }

    const persisted = form
      ? await persistSubmissionFiles(form, uploadEntries)
      : { files: [], storageFiles: [] };

    return {
      answers,
      files: persisted.files,
      storage_files: persisted.storageFiles,
    };
  }

  const { answers, files, storage_files } = await req.json();
  return {
    answers,
    files: Array.isArray(files) ? files : [],
    storage_files: Array.isArray(storage_files) ? storage_files : [],
  };
}

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
