import { describe, expect, it } from "vitest";
import type { FormSchema } from "@/types/form";

import {
  summarizeFormSchemaChanges,
  validateFormSchemaForAgent,
} from "./form-agent-tools";

const previousSchema: FormSchema = {
  layout: "single",
  fields: [
    { key: "name", label: "怎么称呼你？", type: "text", required: true },
    { key: "email", label: "你的邮箱是？", type: "email", required: true },
  ],
};

describe("form-agent-tools", () => {
  it("summarizes added and removed fields", () => {
    const nextSchema: FormSchema = {
      layout: "single",
      fields: [
        { key: "name", label: "怎么称呼你？", type: "text", required: true },
        { key: "phone", label: "你的手机号是？", type: "text", required: true },
      ],
    };

    const changes = summarizeFormSchemaChanges(previousSchema, nextSchema);

    expect(changes).toContain("新增字段：你的手机号是？。");
    expect(changes).toContain("移除字段：你的邮箱是？。");
  });

  it("returns creation summary when there is no previous schema", () => {
    const changes = summarizeFormSchemaChanges(null, previousSchema);

    expect(changes).toEqual(["创建了 2 个字段的表单草稿。"]);
  });

  it("validates long schemas and choice fields without options", () => {
    const schema: FormSchema = {
      fields: [
        { key: "f1", label: "字段 1", type: "text" },
        { key: "f2", label: "字段 2", type: "text" },
        { key: "f3", label: "字段 3", type: "text" },
        { key: "f4", label: "字段 4", type: "text" },
        { key: "f5", label: "字段 5", type: "text" },
        { key: "f6", label: "字段 6", type: "text" },
        { key: "f7", label: "字段 7", type: "text" },
        { key: "f8", label: "字段 8", type: "text" },
        { key: "f9", label: "字段 9", type: "radio" },
      ],
    };

    const warnings = validateFormSchemaForAgent(schema);

    expect(warnings).toContain("当前字段超过 8 个，移动端填写可能偏长。");
    expect(warnings).toContain("存在选择类字段但没有选项，需要补充选项后再发布。");
  });
});
