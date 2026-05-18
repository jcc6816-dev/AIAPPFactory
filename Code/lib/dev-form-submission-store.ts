import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { FormSubmissionRecord } from "@/types/form";

const DEV_FORM_SUBMISSIONS_PATH = path.join(
  process.cwd(),
  "data",
  "dev-form-submissions.json"
);

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_FORM_SUBMISSIONS_PATH), { recursive: true });
}

export async function readDevFormSubmissions(): Promise<FormSubmissionRecord[]> {
  try {
    const content = await readFile(DEV_FORM_SUBMISSIONS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as FormSubmissionRecord[];
  } catch {
    return [];
  }
}

export async function writeDevFormSubmissions(
  submissions: FormSubmissionRecord[]
) {
  await ensureStoreDir();
  await writeFile(
    DEV_FORM_SUBMISSIONS_PATH,
    JSON.stringify(submissions, null, 2),
    "utf8"
  );
}
