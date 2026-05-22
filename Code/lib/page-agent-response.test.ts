import { describe, expect, it } from "vitest";

import {
  buildPageAgentResponse,
  inferPageAgentResponseKind,
  normalizePageAgentResponse,
} from "./page-agent-response";

describe("page-agent-response", () => {
  it("normalizes plain text into a structured agent response", () => {
    const response = normalizePageAgentResponse("当前共有 3 条提交。");

    expect(response.answer).toBe("当前共有 3 条提交。");
    expect(response.kind).toBe("summary");
    expect(response.actions).toEqual([]);
  });

  it("keeps explicit response metadata and actions", () => {
    const response = normalizePageAgentResponse({
      answer: "建议从发票收集模板开始。",
      kind: "suggestion",
      actions: [{ label: "使用模板", href: "/forms/new?template=invoice" }],
      meta: { source: "workspace-agent" },
    });

    expect(response.kind).toBe("suggestion");
    expect(response.actions[0]?.label).toBe("使用模板");
    expect(response.meta?.source).toBe("workspace-agent");
  });

  it("infers warning and suggestion kinds from page-agent language", () => {
    expect(inferPageAgentResponseKind("有没有异常", "Webhook 失败 1 次")).toBe(
      "warning"
    );
    expect(inferPageAgentResponseKind("下一步做什么", "建议打开模板")).toBe(
      "suggestion"
    );
  });

  it("builds a response with query-aware kind inference", () => {
    const response = buildPageAgentResponse("整体运行状态稳定。", {
      query: "健康情况",
    });

    expect(response.kind).toBe("success");
    expect(response.actions).toEqual([]);
  });
});
