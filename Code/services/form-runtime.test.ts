import { describe, expect, it } from "vitest";

import { FormRecord } from "@/types/form";
import { submitForm, validateSubmissionAnswers } from "./form-runtime";

const form: FormRecord = {
  uuid: "form_test",
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
});
