import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/models/form-submission", () => ({
  updateFormSubmissionByUuid: vi.fn(async (_uuid: string, payload: Record<string, any>) => ({
    uuid: "sub_test",
    ...payload,
  })),
}));

vi.mock("../ocr/provider", () => ({
  runOcrForAsset: vi.fn(),
}));

vi.mock("../ocr/structurer", () => ({
  structureOcrResultWithLlm: vi.fn(),
}));

import { applyStructuredDataToAnswers, runMockOcrSkill } from "./ocr";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { runOcrForAsset } from "../ocr/provider";
import { structureOcrResultWithLlm } from "../ocr/structurer";

const form: FormRecord = {
  uuid: "form_ocr_test",
  user_uuid: "user_test",
  title: "OCR Test Form",
  description: "",
  theme: "minimal",
  schema_json: {
    fields: [
      {
        key: "invoice_no",
        label: "发票号码",
        type: "text",
      },
      {
        key: "amount",
        label: "金额",
        type: "number",
      },
      {
        key: "remark",
        label: "备注",
        type: "textarea",
      },
    ],
  },
  status: "draft",
  share_code: "share_ocr_test",
};

describe("ocr auto fill", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fills empty answers from structured OCR fields", () => {
    const result = applyStructuredDataToAnswers(
      form,
      {
        invoice_no: "",
        amount: "",
        remark: "manual",
      },
      {
        fields: {
          发票号码: "INV-123",
          amount: "288.5",
          remark: "ignored",
        },
      }
    );

    expect(result.answers.invoice_no).toBe("INV-123");
    expect(result.answers.amount).toBe(288.5);
    expect(result.answers.remark).toBe("manual");
    expect(result.autoFilledFields.invoice_no).toBe("INV-123");
  });

  it("matches invoice aliases when the structured field name differs", () => {
    const result = applyStructuredDataToAnswers(
      {
        ...form,
        ocr_template: "invoice",
      },
      {
        invoice_no: "",
        amount: "",
        remark: "",
      },
      {
        fields: {
          invoice_number: "INV-998",
          total_amount: "399.8",
        },
      }
    );

    expect(result.answers.invoice_no).toBe("INV-998");
    expect(result.answers.amount).toBe(399.8);
  });

  it("matches receipt aliases for merchant and payment fields", () => {
    const receiptForm: FormRecord = {
      ...form,
      ocr_template: "receipt",
      schema_json: {
        fields: [
          {
            key: "merchant_name",
            label: "商户名称",
            type: "text",
          },
          {
            key: "payment_method",
            label: "支付方式",
            type: "text",
          },
        ],
      },
    };

    const result = applyStructuredDataToAnswers(
      receiptForm,
      {
        merchant_name: "",
        payment_method: "",
      },
      {
        fields: {
          store_name: "全家便利店",
          payment_method: "微信支付",
        },
      }
    );

    expect(result.answers.merchant_name).toBe("全家便利店");
    expect(result.answers.payment_method).toBe("微信支付");
  });

  it("does not auto-fill file-like fields with OCR text values", () => {
    const uploadForm: FormRecord = {
      ...form,
      ocr_template: "invoice",
      schema_json: {
        fields: [
          {
            key: "invoice_image",
            label: "发票图片",
            type: "image",
          },
          {
            key: "invoice_no",
            label: "发票号码",
            type: "text",
          },
        ],
      },
    };

    const result = applyStructuredDataToAnswers(
      uploadForm,
      {
        invoice_image: "",
        invoice_no: "",
      },
      {
        fields: {
          invoice_no: "26112000000857609356",
        },
      }
    );

    expect(result.answers.invoice_image).toBe("");
    expect(result.answers.invoice_no).toBe("26112000000857609356");
    expect(result.autoFilledFields.invoice_image).toBeUndefined();
  });

  it("does not call LLM structuring for mock OCR results", async () => {
    vi.mocked(runOcrForAsset).mockResolvedValue({
      provider: "mock",
      status: "completed",
      result: {
        raw_text: "invoice amount 100",
        summary: "mock result",
        structured_data: {},
        provider_payload: {},
        processed_files: ["invoice.png"],
      },
    });

    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: form.uuid,
      form_title: form.title,
      form_share_code: form.share_code,
      answers_json: {
        invoice_no: "",
        amount: "",
        remark: "",
      },
      files_json: [
        {
          field_key: "invoice_image",
          file_name: "invoice.png",
          file_type: "image/png",
        },
      ],
      storage_files_json: [
        {
          field_key: "invoice_image",
          file_name: "invoice.png",
          file_path: "/tmp/invoice.png",
          mime_type: "image/png",
          storage_provider: "local",
        },
      ],
      status: "queued",
      ocr_status: "uploaded",
      ocr_provider: "",
      ocr_result_json: {},
      ocr_error_message: "",
    };

    const result = await runMockOcrSkill(form, submission);

    expect(structureOcrResultWithLlm).not.toHaveBeenCalled();
    expect(result.status).toBe("completed");
  });
});
