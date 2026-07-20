import { afterEach, describe, expect, it, vi } from "vitest";

import type { GrowthEventRecord } from "@/types/growth-event";

const modelMocks = vi.hoisted(() => ({
  createGrowthEventSafely: vi.fn(),
  listGrowthEventsByFormUuid: vi.fn(),
}));

vi.mock("@/models/growth-event", () => modelMocks);

import {
  checkFirstSuccessRateLimit,
  hasFirstSuccessActivationSequence,
  recordTrustedFirstResultView,
  resetFirstSuccessRateLimitsForTests,
} from "./first-success";

const submission = {
  uuid: "sub_test_1",
  form_uuid: "form_1",
  form_title: "Intake",
  form_share_code: "share_1",
  answers_json: {},
  files_json: [],
  is_test: true,
  status: "completed",
};

function event(
  eventName: string,
  minute: number,
  options: Partial<GrowthEventRecord> = {}
): GrowthEventRecord {
  return {
    uuid: `event_${eventName}_${minute}`,
    event_name: eventName,
    visitor_id: "",
    user_uuid: "user_1",
    form_uuid: "form_1",
    metadata_json: {},
    created_at: new Date(Date.UTC(2026, 6, 5, 0, minute)).toISOString(),
    ...options,
  };
}

function completedSequence() {
  return [
    event("form_created", 0),
    event("form_published", 1),
    event("test_submission_completed", 2, {
      metadata_json: { submission_uuid: "sub_test_1" },
    }),
    event("first_result_viewed", 3, {
      metadata_json: { submission_uuid: "sub_test_1", is_test: true },
    }),
  ];
}

describe("trusted first success service", () => {
  afterEach(() => {
    vi.clearAllMocks();
    resetFirstSuccessRateLimitsForTests();
  });

  it("accepts the ordered same-user same-form test sequence", () => {
    expect(
      hasFirstSuccessActivationSequence(
        completedSequence(),
        "user_1",
        submission
      )
    ).toBe(true);
  });

  it("rejects a mismatched submission or an out-of-order chain", () => {
    const wrongSubmission = completedSequence().map((item) =>
      item.event_name === "test_submission_completed"
        ? { ...item, metadata_json: { submission_uuid: "sub_other" } }
        : item
    );
    expect(
      hasFirstSuccessActivationSequence(
        wrongSubmission,
        "user_1",
        submission
      )
    ).toBe(false);

    const outOfOrder = completedSequence();
    outOfOrder[1] = event("form_published", 4);
    expect(
      hasFirstSuccessActivationSequence(outOfOrder, "user_1", submission)
    ).toBe(false);
  });

  it("records the trusted result and activation once", async () => {
    const beforeView = completedSequence().slice(0, 3);
    modelMocks.listGrowthEventsByFormUuid
      .mockResolvedValueOnce(beforeView)
      .mockResolvedValueOnce(completedSequence());
    modelMocks.createGrowthEventSafely.mockResolvedValue({});

    const result = await recordTrustedFirstResultView({
      userUuid: "user_1",
      formUuid: "form_1",
      shareCode: "share_1",
      submission,
    });

    expect(result).toEqual({
      firstResultRecorded: true,
      activationCompleted: true,
      activationRecorded: true,
    });
    expect(modelMocks.createGrowthEventSafely).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ event_name: "first_result_viewed" })
    );
    expect(modelMocks.createGrowthEventSafely).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ event_name: "activation_completed" })
    );
  });

  it("does not duplicate result or activation events", async () => {
    modelMocks.listGrowthEventsByFormUuid.mockResolvedValue([
      ...completedSequence(),
      event("activation_completed", 4, {
        metadata_json: { submission_uuid: "sub_test_1" },
      }),
    ]);

    const result = await recordTrustedFirstResultView({
      userUuid: "user_1",
      formUuid: "form_1",
      shareCode: "share_1",
      submission,
    });

    expect(result.activationCompleted).toBe(true);
    expect(result.activationRecorded).toBe(false);
    expect(modelMocks.createGrowthEventSafely).not.toHaveBeenCalled();
  });

  it("limits one owner and form to ten test submissions per window", () => {
    for (let index = 0; index < 10; index += 1) {
      expect(checkFirstSuccessRateLimit("user_1", "form_1", 1000 + index)).toBe(
        true
      );
    }
    expect(checkFirstSuccessRateLimit("user_1", "form_1", 2000)).toBe(false);
    expect(
      checkFirstSuccessRateLimit("user_1", "form_1", 10 * 60 * 1000 + 2000)
    ).toBe(true);
  });
});
