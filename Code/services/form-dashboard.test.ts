import { afterEach, describe, expect, it, vi } from "vitest";

import { getFormDashboardMetrics } from "./form-dashboard";

const runtimeMocks = vi.hoisted(() => ({
  listFormSubmissionsMock: vi.fn(),
}));

const webhookMocks = vi.hoisted(() => ({
  getWebhookLogsByFormUuidMock: vi.fn(),
}));

vi.mock("./form-runtime", () => ({
  listFormSubmissions: runtimeMocks.listFormSubmissionsMock,
}));

vi.mock("@/models/webhook-log", () => ({
  getWebhookLogsByFormUuid: webhookMocks.getWebhookLogsByFormUuidMock,
}));

describe("form dashboard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates OCR and webhook metrics across forms", async () => {
    runtimeMocks.listFormSubmissionsMock
      .mockResolvedValueOnce([
        {
          status: "completed",
          ocr_status: "completed",
          ocr_result_json: {
            structured_data: {
              auto_filled_fields: {
                amount: 128,
              },
            },
          },
        },
        {
          status: "failed",
          ocr_status: "failed",
          ocr_result_json: {},
        },
      ])
      .mockResolvedValueOnce([]);

    webhookMocks.getWebhookLogsByFormUuidMock
      .mockResolvedValueOnce([
        { status: "completed" },
        { status: "failed" },
      ])
      .mockResolvedValueOnce([]);

    const metrics = await getFormDashboardMetrics([
      { uuid: "form_1" } as any,
      { uuid: "form_2" } as any,
    ]);

    expect(metrics.totalSubmissions).toBe(2);
    expect(metrics.ocrCompletedCount).toBe(1);
    expect(metrics.ocrFailedCount).toBe(1);
    expect(metrics.autoFilledSubmissionCount).toBe(1);
    expect(metrics.webhookCompletedCount).toBe(1);
    expect(metrics.webhookFailedCount).toBe(1);
  });
});
