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

export function getSubmissionStatusView(status?: string, isZh = true): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView(isZh ? "已完成" : "Completed", "success");
    case "failed":
      return buildStatusView(isZh ? "失败" : "Failed", "danger");
    case "queued":
      return buildStatusView(isZh ? "处理中" : "Processing", "warning");
    case "submitted":
      return buildStatusView(isZh ? "已提交" : "Submitted", "info");
    default:
      return buildStatusView(status || (isZh ? "待处理" : "Pending"), "muted");
  }
}

export function getOcrStatusView(status?: string, isZh = true): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView(isZh ? "识别完成" : "Parsed", "success");
    case "failed":
      return buildStatusView(isZh ? "识别失败" : "Failed", "danger");
    case "processing":
      return buildStatusView(isZh ? "识别中" : "Parsing", "warning");
    case "uploaded":
      return buildStatusView(isZh ? "已上传" : "Uploaded", "info");
    case "not_requested":
    case "":
    case undefined:
      return buildStatusView(isZh ? "未触发" : "Not Active", "muted");
    default:
      return buildStatusView(status, "warning");
  }
}

export function getWorkflowStatusView(status?: string, isZh = true): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView(isZh ? "流转完成" : "Completed", "success");
    case "failed":
      return buildStatusView(isZh ? "流转失败" : "Failed", "danger");
    case "processing":
      return buildStatusView(isZh ? "流转中" : "Processing", "warning");
    case "queued":
      return buildStatusView(isZh ? "排队中" : "Queued", "info");
    default:
      return buildStatusView(status || (isZh ? "未创建" : "Not Created"), "muted");
  }
}

export function getWebhookStatusView(status?: string, isZh = true): StatusView {
  switch (status) {
    case "completed":
      return buildStatusView(isZh ? "推送成功" : "Success", "success");
    case "failed":
      return buildStatusView(isZh ? "推送失败" : "Failed", "danger");
    case "processing":
      return buildStatusView(isZh ? "推送中" : "Processing", "warning");
    default:
      return buildStatusView(status || (isZh ? "未触发" : "Not Triggered"), "muted");
  }
}
