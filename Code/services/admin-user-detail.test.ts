import { describe, expect, it } from "vitest";

import { buildAdminUserDetail } from "./admin-user-detail";
import { FormRecord, FormSubmissionRecord, WebhookLogRecord } from "@/types/form";
import { GrowthEventRecord } from "@/types/growth-event";

describe("admin user detail", () => {
  it("summarizes one user's forms, submissions, webhook failures, orders, and events", () => {
    const detail = buildAdminUserDetail({
      user: {
        uuid: "user_1",
        email: "maker@example.com",
        nickname: "Maker",
        avatar_url: "",
      },
      forms: [
        {
          uuid: "form_1",
          user_uuid: "user_1",
          title: "Lead Form",
          theme: "business",
          status: "published",
          share_code: "share_1",
          schema_json: { fields: [] },
        },
      ] as FormRecord[],
      submissions: [
        {
          uuid: "sub_1",
          form_uuid: "form_1",
          form_title: "Lead Form",
          form_share_code: "share_1",
          answers_json: {},
          files_json: [],
          status: "submitted",
        },
        {
          uuid: "sub_2",
          form_uuid: "other_form",
          form_title: "Other",
          form_share_code: "other",
          answers_json: {},
          files_json: [],
          status: "submitted",
        },
      ] as FormSubmissionRecord[],
      webhookLogs: [
        {
          uuid: "log_1",
          form_uuid: "form_1",
          submission_uuid: "sub_1",
          target_url: "https://example.com",
          request_body_json: {},
          response_status: 500,
          attempt_count: 1,
          status: "failed",
          error_message: "failed",
        },
      ] as WebhookLogRecord[],
      orders: [
        {
          order_no: "order_1",
          created_at: "2026-05-01T00:00:00.000Z",
          user_uuid: "user_1",
          user_email: "maker@example.com",
          amount: 1900,
          interval: "month",
          expired_at: "2026-06-01T00:00:00.000Z",
          status: "paid",
          credits: 100,
          currency: "USD",
        },
      ],
      events: [
        {
          uuid: "evt_1",
          event_name: "form_created",
          visitor_id: "visitor_1",
          user_uuid: "user_1",
        },
      ] as GrowthEventRecord[],
    });

    expect(detail.totals).toMatchObject({
      forms: 1,
      publishedForms: 1,
      submissions: 1,
      webhookFailures: 1,
      paidOrders: 1,
      revenueCents: 1900,
      growthEvents: 1,
    });
  });
});
