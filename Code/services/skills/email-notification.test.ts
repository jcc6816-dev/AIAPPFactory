import { describe, expect, it } from "vitest";
import { FormRecord, FormSubmissionRecord } from "@/types/form";
import { WorkflowRunRecord } from "@/types/workflow";
import { runMockEmailNotificationSkill } from "./email-notification";

describe("Email Notification Skill", () => {
  it("sends standard email when attachment is not requested", async () => {
    const form: FormRecord = {
      uuid: "form_test",
      user_uuid: "user_test",
      title: "Test Form",
      theme: "minimal",
      schema_json: { fields: [] },
      status: "draft",
      share_code: "share_test",
      generation_meta_json: {
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
          skillSettings: {
            email_notification: {
              enabled: true,
              config: {
                recipient_type: "custom",
                custom_recipient: "test@example.com",
                subject: "New Submission",
                body_template: "Hello World",
                attach_report: false,
              },
            },
          },
        },
      },
    };

    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [],
      status: "submitted",
    };

    const result = await runMockEmailNotificationSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("Email Send Succeeded");
    expect(result.detail).toContain("test@example.com");
    expect(result.detail).toContain("EMAIL_SENT");
    expect(result.detail).not.toContain("EMAIL_SENT_WITH_ATTACHMENT");
  });

  it("extracts recipient from responder answers when strategy is fields", async () => {
    const form: FormRecord = {
      uuid: "form_test",
      user_uuid: "user_test",
      title: "Test Form",
      theme: "minimal",
      schema_json: { fields: [] },
      status: "draft",
      share_code: "share_test",
      generation_meta_json: {
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
          skillSettings: {
            email_notification: {
              enabled: true,
              config: {
                recipient_type: "fields",
                subject: "Receipt",
                body_template: "Hello Responder",
                attach_report: false,
              },
            },
          },
        },
      },
    };

    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {
        name: "Alice",
        user_email: "alice@domain.com",
      },
      files_json: [],
      status: "submitted",
    };

    const result = await runMockEmailNotificationSkill(form, submission);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("alice@domain.com");
    expect(result.detail).toContain("EMAIL_SENT");
  });

  it("chains report file as attachment when report_export step is completed", async () => {
    const form: FormRecord = {
      uuid: "form_test",
      user_uuid: "user_test",
      title: "Test Form",
      theme: "minimal",
      schema_json: { fields: [] },
      status: "draft",
      share_code: "share_test",
      generation_meta_json: {
        artifact: {
          kind: "form",
          artifactVersion: 1,
          status: "draft",
          visualSettings: {
            theme: "minimal",
            layout: "single",
            themeVariant: "default",
            preferredDevice: "phone",
          },
          skillSettings: {
            email_notification: {
              enabled: true,
              config: {
                recipient_type: "creator",
                subject: "Report Chained Alert",
                body_template: "See attached",
                attach_report: true,
              },
            },
          },
        },
      },
    };

    const submission: FormSubmissionRecord = {
      uuid: "sub_test",
      form_uuid: "form_test",
      form_title: "Test Form",
      form_share_code: "share_test",
      answers_json: {},
      files_json: [],
      status: "submitted",
    };

    const workflowRun: WorkflowRunRecord = {
      uuid: "run_test",
      form_uuid: "form_test",
      form_submission_uuid: "sub_test",
      status: "processing",
      steps_json: [
        {
          code: "report_export",
          title: "Report Export",
          status: "completed",
          detail: "Report Succeeded",
        },
      ],
      created_at: "2026-05-28T00:00:00Z",
    };

    const result = await runMockEmailNotificationSkill(form, submission, workflowRun);
    expect(result.status).toBe("completed");
    expect(result.detail).toContain("EMAIL_SENT_WITH_ATTACHMENT");
    expect(result.detail).toContain("report_dashboard.xlsx");
  });
});
