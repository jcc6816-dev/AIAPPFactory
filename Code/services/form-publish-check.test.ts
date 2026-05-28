import { describe, expect, it } from "vitest";

import {
  assertFormReadyToPublish,
  validateFormSchemaForPublish,
} from "./form-publish-check";

describe("form publish check", () => {
  it("passes a complete runnable form", () => {
    const result = validateFormSchemaForPublish({
      title: "Lead capture",
      schema: {
        layout: "single",
        fields: [
          {
            key: "name",
            label: "What should we call you?",
            type: "text",
            required: true,
          },
          {
            key: "interest",
            label: "What are you interested in?",
            type: "select",
            options: [
              {
                label: "Product demo",
                value: "demo",
              },
            ],
          },
        ],
      },
    });

    expect(result.ready).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("blocks missing title, empty fields, and incomplete choice options", () => {
    const result = validateFormSchemaForPublish({
      title: "  ",
      schema: {
        fields: [
          {
            key: "interest",
            label: "Interest",
            type: "radio",
            required: true,
          },
        ],
      },
    });

    expect(result.ready).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual([
      "title_required",
      "choice_options_required",
    ]);
  });

  it("throws a business-readable message before publishing invalid forms", () => {
    expect(() =>
      assertFormReadyToPublish({
        title: "Webhook form",
        webhookEnabled: true,
        webhookUrl: "",
        schema: {
          fields: [
            {
              key: "name",
              label: "Name",
              type: "text",
            },
          ],
        },
      })
    ).toThrow("发布前检查未通过：已启用 Webhook，但还没有配置目标地址。");
  });
});
