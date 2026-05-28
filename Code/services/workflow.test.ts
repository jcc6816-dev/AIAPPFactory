import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { FormRecord, FormSubmissionRecord } from "@/types/form";
import {
  createWorkflowRunForSubmission,
  executeMockWorkflowRun,
} from "./workflow";

const form: FormRecord = {
  uuid: "form_test",
  user_uuid: "user_test",
  title: "Test Form",
  description: "A form for tests",
  theme: "minimal",
  schema_json: {
    fields: [],
  },
  status: "draft",
  share_code: "share_test",
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

describe("workflow", () => {
  const originalEnv = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  beforeEach(() => {
    process.env.SUPABASE_URL = "";
    process.env.SUPABASE_ANON_KEY = "";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "";
  });

  afterEach(() => {
    process.env.SUPABASE_URL = originalEnv.SUPABASE_URL;
    process.env.SUPABASE_ANON_KEY = originalEnv.SUPABASE_ANON_KEY;
    process.env.SUPABASE_SERVICE_ROLE_KEY = originalEnv.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("creates a queued workflow skeleton with only enabled skill steps", async () => {
    const workflowRun = await createWorkflowRunForSubmission(form, submission);

    expect(workflowRun.status).toBe("queued");
    expect(workflowRun.form_submission_uuid).toBe(submission.uuid);
    expect(workflowRun.steps_json).toHaveLength(1);
    expect(workflowRun.steps_json[0].status).toBe("completed");
  });

  it("executes the workflow skeleton into a completed mock result", async () => {
    const formWithSkills: FormRecord = {
      ...form,
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
            deduplication: { enabled: true, tier: "free" },
            report_export: { enabled: true, tier: "pro" },
          },
        },
      },
    };
    const workflowRun = await createWorkflowRunForSubmission(formWithSkills, submission);
    const completedRun = await executeMockWorkflowRun(
      formWithSkills,
      submission,
      workflowRun
    );

    expect(completedRun.status).toBe("completed");
    expect(completedRun.steps_json.every((step) => step.status === "completed"))
      .toBe(true);
    expect(completedRun.steps_json.every((step) => typeof step.durationMs === "number")).toBe(true);
    expect(completedRun.steps_json[1].detail).toContain("Deduplication Passed");
    expect(completedRun.steps_json[2].detail).toContain("Report Generator Succeeded");
  });
});
