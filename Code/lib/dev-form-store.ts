import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

import { FormRecord } from "@/types/form";

const DEV_FORMS_PATH = path.join(process.cwd(), "data", "dev-forms.json");

async function ensureStoreDir() {
  await mkdir(path.dirname(DEV_FORMS_PATH), { recursive: true });
}

export async function readDevForms(): Promise<FormRecord[]> {
  try {
    const content = await readFile(DEV_FORMS_PATH, "utf8");
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as FormRecord[];
  } catch {
    return [];
  }
}

export async function writeDevForms(forms: FormRecord[]) {
  await ensureStoreDir();
  await writeFile(DEV_FORMS_PATH, JSON.stringify(forms, null, 2), "utf8");
}
