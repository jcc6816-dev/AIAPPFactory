import { afterEach, describe, expect, it } from "vitest";
import { rm } from "node:fs/promises";
import path from "node:path";

import { FormRecord } from "@/types/form";
import { persistSubmissionFiles } from "./submission-file";

const form: FormRecord = {
  uuid: "form_upload_test",
  user_uuid: "user_test",
  title: "Upload Test",
  description: "Upload Test",
  theme: "minimal",
  schema_json: {
    fields: [],
  },
  status: "draft",
  share_code: "share_upload_test",
};

describe("submission-file", () => {
  afterEach(async () => {
    await rm(path.join(process.cwd(), "data", "uploads", form.uuid), {
      recursive: true,
      force: true,
    });
  });

  it("persists uploaded files to the local fallback storage", async () => {
    const file = new File(["hello world"], "receipt.txt", {
      type: "text/plain",
    });

    const result = await persistSubmissionFiles(form, [
      {
        field_key: "receipt",
        file,
      },
    ]);

    expect(result.files).toHaveLength(1);
    expect(result.files[0].file_name).toBe("receipt.txt");
    expect(result.storageFiles).toHaveLength(1);
    expect(result.storageFiles[0].storage_provider).toBe("local");
    expect(result.storageFiles[0].file_path).toContain("data/uploads/form_upload_test");
  });
});
