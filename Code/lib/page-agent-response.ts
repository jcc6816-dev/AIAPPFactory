export type PageAgentResponseKind =
  | "summary"
  | "warning"
  | "suggestion"
  | "success"
  | "default";

export interface PageAgentAction {
  label: string;
  href?: string;
  prompt?: string;
  variant?: "primary" | "secondary";
}

export interface PageAgentResponse {
  answer: string;
  kind: PageAgentResponseKind;
  actions: PageAgentAction[];
  meta?: Record<string, unknown>;
}

export type PageAgentResponseInput =
  | string
  | Partial<PageAgentResponse>
  | null
  | undefined;

export function inferPageAgentResponseKind(
  query: string,
  answer: string
): PageAgentResponseKind {
  const text = `${query} ${answer}`.toLowerCase();

  if (["异常", "失败", "告警", "问题", "error", "failed"].some((keyword) => text.includes(keyword))) {
    return "warning";
  }

  if (["下一步", "建议", "继续", "推荐", "模板"].some((keyword) => text.includes(keyword))) {
    return "suggestion";
  }

  if (["成功", "稳定", "正常", "完成"].some((keyword) => text.includes(keyword))) {
    return "success";
  }

  if (["总结", "概览", "统计", "数据", "提交"].some((keyword) => text.includes(keyword))) {
    return "summary";
  }

  return "default";
}

export function normalizePageAgentResponse(
  input: PageAgentResponseInput,
  fallbackAnswer = "Agent 暂时无法处理这个请求，请稍后再试。"
): PageAgentResponse {
  if (typeof input === "string") {
    return {
      answer: input || fallbackAnswer,
      kind: inferPageAgentResponseKind("", input),
      actions: [],
    };
  }

  const answer = input?.answer || fallbackAnswer;

  return {
    answer,
    kind: input?.kind || inferPageAgentResponseKind("", answer),
    actions: input?.actions || [],
    meta: input?.meta,
  };
}

export function buildPageAgentResponse(
  answer: string,
  options?: {
    query?: string;
    kind?: PageAgentResponseKind;
    actions?: PageAgentAction[];
    meta?: Record<string, unknown>;
  }
): PageAgentResponse {
  return {
    answer,
    kind:
      options?.kind ||
      inferPageAgentResponseKind(options?.query || "", answer),
    actions: options?.actions || [],
    meta: options?.meta,
  };
}
