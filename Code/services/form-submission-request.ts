import { FormRecord, SubmitFormPayload } from "@/types/form";

import { persistSubmissionFiles } from "./submission-file";

export async function parseSubmitRequest(
  req: Request,
  form: FormRecord
): Promise<SubmitFormPayload> {
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

    const persisted = await persistSubmissionFiles(form, uploadEntries);
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
