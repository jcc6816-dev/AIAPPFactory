import type { FormRecord } from "@/types/form";
import type { FormDashboardMetrics } from "./form-dashboard";
import { getHomepageSceneTemplates } from "./form-templates";

export interface WorkspaceAgentResponses {
  overview: string;
  anomalies: string;
  nextActions: string;
  creation: string;
  defaultResponse: string;
}

function percentage(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

function getRecentForms(forms: FormRecord[]) {
  return [...forms]
    .sort((a, b) => {
      const left = a.updated_at || a.created_at || "";
      const right = b.updated_at || b.created_at || "";
      return right.localeCompare(left);
    })
    .slice(0, 3);
}

export function buildWorkspaceAgentResponses(
  forms: FormRecord[],
  metrics: FormDashboardMetrics,
  canCreate: boolean
): WorkspaceAgentResponses {
  const webhookTotal =
    metrics.webhookCompletedCount + metrics.webhookFailedCount;
  const ocrTotal = metrics.ocrCompletedCount + metrics.ocrFailedCount;
  const webhookRate = percentage(metrics.webhookCompletedCount, webhookTotal);
  const ocrRate = percentage(metrics.ocrCompletedCount, ocrTotal);
  const recentForms = getRecentForms(forms);
  const recommendedTemplates = getHomepageSceneTemplates().slice(0, 4);
  const recommendedTemplateText = recommendedTemplates
    .map((template) => `「${template.name}」`)
    .join("、");
  const recentFormText =
    recentForms.length > 0
      ? recentForms
          .map((form) => `「${form.title}」${form.schema_json.fields.length} 个字段`)
          .join("，")
      : "暂无场景";

  const anomalyItems: string[] = [];
  if (metrics.failedSubmissions > 0) {
    anomalyItems.push(`${metrics.failedSubmissions} 条失败提交`);
  }
  if (metrics.ocrFailedCount > 0) {
    anomalyItems.push(`${metrics.ocrFailedCount} 条 OCR 失败`);
  }
  if (metrics.webhookFailedCount > 0) {
    anomalyItems.push(`${metrics.webhookFailedCount} 条 Webhook 失败`);
  }

  const actionItems: string[] = [];
  if (forms.length === 0) {
    actionItems.push(`先从右侧推荐模板创建一个可演示场景，例如 ${recommendedTemplateText}。`);
  }
  if (metrics.totalSubmissions === 0 && forms.length > 0) {
    actionItems.push("选择一个场景，打开分享页提交一条测试数据。");
  }
  if (metrics.webhookFailedCount > 0) {
    actionItems.push("进入发布页或 Webhook 日志页，修复失败配置并重试。");
  }
  if (metrics.ocrFailedCount > 0) {
    actionItems.push("进入数据页查看 OCR 失败记录，检查图片质量和模板配置。");
  }
  if (!canCreate) {
    actionItems.push("当前创建额度已满，继续测试前需要清理旧场景或升级额度。");
  }
  if (actionItems.length === 0) {
    actionItems.push("当前工作台状态稳定，可以继续完善模板、Agent 或演示脚本。");
  }

  return {
    overview: [
      `当前共有 ${forms.length} 个场景，累计 ${metrics.totalSubmissions} 条提交。`,
      `OCR 成功率 ${ocrRate}%，Webhook 成功率 ${webhookRate}%。`,
      `最近场景：${recentFormText}。`,
    ].join("\n"),
    anomalies:
      anomalyItems.length > 0
        ? `当前需要关注：${anomalyItems.join("，")}。建议优先进入对应场景的数据页、分析页或发布页定位原因。`
        : "当前没有检测到失败提交、OCR 失败或 Webhook 失败，整体运行状态稳定。",
    nextActions: `建议下一步：${actionItems.join(" ")}`,
    creation: canCreate
      ? `当前可以继续创建新场景。建议优先从右侧推荐模板开始，例如 ${recommendedTemplateText}，再用 Agent 做少量字段调整，这样比完全从 0 输入 Prompt 更稳定。`
      : "当前创建额度已满。若只是测试，可以先复用已有场景；若要继续创建，需要调整额度或升级套餐。",
    defaultResponse:
      "这一版工作台 Agent 先支持场景概览、异常提醒、下一步建议和创建额度说明，不接大模型，也不消耗 Token。",
  };
}

export function answerWorkspaceAgentQuery(
  query: string,
  responses: WorkspaceAgentResponses
) {
  const normalized = query.toLowerCase();

  if (
    ["异常", "失败", "告警", "问题", "健康"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.anomalies;
  }

  if (
    ["下一步", "建议", "继续", "后面"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.nextActions;
  }

  if (
    ["创建", "新建", "额度", "模板"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.creation;
  }

  if (
    ["概览", "总结", "工作台", "场景", "数据", "提交"].some((keyword) =>
      normalized.includes(keyword)
    )
  ) {
    return responses.overview;
  }

  return responses.defaultResponse;
}
