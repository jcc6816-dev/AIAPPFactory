export type StatusTone = "success" | "warning" | "danger" | "muted" | "info";

export interface StatusView {
  label: string;
  tone: StatusTone;
  dotClassName: string;
  badgeClassName: string;
}

const toneStyles: Record<StatusTone, Pick<StatusView, "dotClassName" | "badgeClassName">> = {
  success: {
    dotClassName: "bg-emerald-500",
    badgeClassName: "border-emerald-200 bg-emerald-50 text-emerald-600",
  },
  warning: {
    dotClassName: "bg-amber-500",
    badgeClassName: "border-amber-200 bg-amber-50 text-amber-700",
  },
  danger: {
    dotClassName: "bg-red-500",
    badgeClassName: "border-red-200 bg-red-50 text-red-600",
  },
  muted: {
    dotClassName: "bg-slate-300",
    badgeClassName: "border-slate-200 bg-slate-50 text-slate-500",
  },
  info: {
    dotClassName: "bg-blue-500",
    badgeClassName: "border-blue-200 bg-blue-50 text-blue-600",
  },
};

function buildStatusView(label: string, tone: StatusTone): StatusView {
  return {
    label,
    tone,
    ...toneStyles[tone],
  };
}

export function getSubmissionStatusView(status?: string): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView("已完成", "success");
    case "failed":
      return buildStatusView("失败", "danger");
    case "queued":
      return buildStatusView("处理中", "warning");
    case "submitted":
      return buildStatusView("已提交", "info");
    default:
      return buildStatusView(status || "待处理", "muted");
  }
}

export function getOcrStatusView(status?: string): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView("识别完成", "success");
    case "failed":
      return buildStatusView("识别失败", "danger");
    case "processing":
      return buildStatusView("识别中", "warning");
    case "uploaded":
      return buildStatusView("已上传", "info");
    case "not_requested":
    case "":
    case undefined:
      return buildStatusView("未触发", "muted");
    default:
      return buildStatusView(status, "warning");
  }
}

export function getWorkflowStatusView(status?: string): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView("流转完成", "success");
    case "failed":
      return buildStatusView("流转失败", "danger");
    case "processing":
      return buildStatusView("流转中", "warning");
    case "queued":
      return buildStatusView("排队中", "info");
    default:
      return buildStatusView(status || "未创建", "muted");
  }
}

export function getWebhookStatusView(status?: string): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView("推送成功", "success");
    case "failed":
      return buildStatusView("推送失败", "danger");
    case "processing":
      return buildStatusView("推送中", "warning");
    default:
      return buildStatusView(status || "未触发", "muted");
  }
}
