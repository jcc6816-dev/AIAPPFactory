import { describe, expect, it } from "vitest";

import {
  getOcrStatusView,
  getSubmissionStatusView,
  getWebhookStatusView,
  getWorkflowStatusView,
} from "./form-workflow-status";

describe("form-workflow-status", () => {
  it("maps submission statuses to readable labels", () => {
    expect(getSubmissionStatusView("completed")).toMatchObject({
      label: "已完成",
      tone: "success",
    });
    expect(getSubmissionStatusView("failed")).toMatchObject({
      label: "失败",
      tone: "danger",
    });
  });

  it("maps OCR statuses using the actual persisted values", () => {
    expect(getOcrStatusView("completed")).toMatchObject({
      label: "识别完成",
      tone: "success",
    });
    expect(getOcrStatusView("not_requested")).toMatchObject({
      label: "未触发",
      tone: "muted",
    });
  });

  it("maps workflow and webhook statuses consistently", () => {
    expect(getWorkflowStatusView("processing").label).toBe("流转中");
    expect(getWebhookStatusView("failed")).toMatchObject({
      label: "推送失败",
      tone: "danger",
    });
  });
});
