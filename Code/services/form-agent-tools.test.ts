import { describe, expect, it } from "vitest";
import type { FormSchema } from "@/types/form";

import {
  buildFormAgentDoneMessage,
  buildFormAgentProgressMessage,
  buildFormAgentSummaryMessage,
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

  it("summarizes field type, required, guidance, and option changes", () => {
    const nextSchema: FormSchema = {
      layout: "single",
      fields: [
        {
          key: "name",
          label: "怎么称呼你？",
          type: "text",
          required: false,
          placeholder: "请输入你的姓名",
        },
        {
          key: "email",
          label: "你的邮箱是？",
          type: "text",
          required: true,
        },
        {
          key: "channel",
          label: "你从哪里了解我们？",
          type: "radio",
          options: [
            { label: "朋友推荐", value: "friend" },
            { label: "社交媒体", value: "social" },
          ],
        },
      ],
    };
    const previous: FormSchema = {
      layout: "single",
      fields: [
        { key: "name", label: "怎么称呼你？", type: "text", required: true },
        { key: "email", label: "你的邮箱是？", type: "email", required: true },
        {
          key: "channel",
          label: "你从哪里了解我们？",
          type: "radio",
          options: [{ label: "朋友推荐", value: "friend" }],
        },
      ],
    };

    const changes = summarizeFormSchemaChanges(previous, nextSchema);

    expect(changes).toContain("调整字段类型：你的邮箱是？：email → text。");
    expect(changes).toContain("调整必填规则：怎么称呼你？：必填 → 选填。");
    expect(changes).toContain("调整填写引导：怎么称呼你？。");
    expect(changes).toContain("调整选项配置：你从哪里了解我们？。");
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

  it("builds check-only agent messages when schema is unchanged", () => {
    const changes = ["字段结构没有明显变化，可能主要调整了标题、描述、主题或字段细节。"];

    expect(
      buildFormAgentProgressMessage({
        isRevision: true,
        fieldCount: 9,
        changes,
      })
    ).toContain("未发现需要自动改动");
    expect(buildFormAgentSummaryMessage(true, changes)).toBe("已生成本次检查摘要。");
    expect(
      buildFormAgentDoneMessage({
        isRevision: true,
        changes,
        warnings: ["当前字段超过 8 个，移动端填写可能偏长。"],
      })
    ).toContain("草稿未自动改动");
  });
});
