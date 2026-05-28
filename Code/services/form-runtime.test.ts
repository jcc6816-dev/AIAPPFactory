import { describe, expect, it } from "vitest";

import { FormRecord } from "@/types/form";
import { submitForm, validateSubmissionAnswers } from "./form-runtime";

const testFormUuid = `form_test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const form: FormRecord = {
  uuid: testFormUuid,
  user_uuid: "user_test",
  title: "Test Form",
  description: "A form for tests",
  theme: "minimal",
  schema_json: {
    fields: [
      {
        key: "name",
        label: "Name",
        type: "text",
        required: true,
      },
      {
        key: "remark",
        label: "Remark",
        type: "textarea",
      },
    ],
  },
  status: "draft",
  share_code: "share_test",
};

describe("form-runtime", () => {
  it("validates required fields", () => {
    expect(() =>
      validateSubmissionAnswers(form, {
        name: "",
      })
    ).toThrow("Name is required");
  });

  it("accepts required image fields when an uploaded file is present", () => {
    const uploadForm: FormRecord = {
      ...form,
      schema_json: {
        fields: [
          {
            key: "invoice_image",
            label: "票据图片",
            type: "image",
            required: true,
          },
        ],
      },
    };

    expect(() =>
      validateSubmissionAnswers(
        uploadForm,
        {},
        {
          files: [
            {
              field_key: "invoice_image",
              file_name: "preview.png",
            },
          ],
        }
      )
    ).not.toThrow();
  });

  it("creates a submission record for valid answers", async () => {
    const submission = await submitForm(form, {
      answers: {
        name: "Alice",
        remark: "hello",
      },
      files: [],
    });

    expect(submission.form_uuid).toBe(form.uuid);
    expect(submission.answers_json.name).toBe("Alice");
    expect(submission.status).toBe("completed");
    expect(submission.workflow_run_uuid).toBeTruthy();
  });

  it("enforces submission limit for free users", async () => {
    const freeForm: FormRecord = {
      ...form,
      uuid: `form_free_limit_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      user_uuid: "user_free_limit",
    };

    process.env.DEV_FREE_SUBMISSION_LIMIT = "2";

    const sub1 = await submitForm(freeForm, { answers: { name: "Bob" } });
    const sub2 = await submitForm(freeForm, { answers: { name: "Charlie" } });

    expect(sub1.status).toBe("completed");
    expect(sub2.status).toBe("completed");

    await expect(
      submitForm(freeForm, { answers: { name: "David" } })
    ).rejects.toThrow("This form has reached the maximum submission limit");

    delete process.env.DEV_FREE_SUBMISSION_LIMIT;
  });
});
