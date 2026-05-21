import type { User } from "@/types/user";

interface FormCreationAllowance {
  isPaidUser: boolean;
  maxForms: number | null;
  currentFormCount: number;
  canCreate: boolean;
}

export interface SettingsAgentResponses {
  allowance: string;
  apiKeys: string;
  team: string;
  account: string;
  defaultResponse: string;
}

function describePlan(allowance: FormCreationAllowance) {
  return allowance.isPaidUser ? "专业版" : "免费版";
}

function describeRemainingForms(allowance: FormCreationAllowance) {
  if (allowance.isPaidUser || allowance.maxForms === null) {
    return "当前场景创建额度不限量";
  }

  const remaining = Math.max(allowance.maxForms - allowance.currentFormCount, 0);
  return `当前还能创建 ${remaining} 个场景（已用 ${allowance.currentFormCount} / ${allowance.maxForms}）`;
}

export function buildSettingsAgentResponses(
  user: Pick<User, "email" | "nickname" | "uuid">,
  allowance: FormCreationAllowance
): SettingsAgentResponses {
  const plan = describePlan(allowance);
  const remainingForms = describeRemainingForms(allowance);

  return {
    allowance: [
      `当前账户：${user.email}`,
      `当前套餐：${plan}`,
      remainingForms,
      allowance.canCreate
        ? "你现在可以继续创建新场景。"
        : "当前免费额度已用完，建议升级套餐或清理测试表单后再创建。",
    ].join("\n"),
    apiKeys:
      "API 密钥入口在顶部/侧边导航的 API Keys 页面。MVP 阶段建议只在服务端保存和调用密钥，不要把 OpenAI、DeepSeek、OCR 或 Webhook 密钥写入前端代码。",
    team:
      "团队协作在 MVP 阶段先作为设置页展示入口，当前还没有完整的成员邀请、角色权限和审计流程。正式开放前，建议先明确管理员、编辑者、只读成员三类角色。",
    account: [
      `当前登录用户：${user.nickname || user.email}`,
      `邮箱：${user.email}`,
      `用户 UUID：${user.uuid || "未读取到"}`,
      `套餐状态：${plan}`,
    ].join("\n"),
    defaultResponse:
      "这一版设置页 Agent 先支持套餐余量、API 密钥位置、团队协作边界和账户信息说明，不会修改账户、创建密钥或邀请成员。",
  };
}

export function answerSettingsAgentQuery(
  query: string,
  responses: SettingsAgentResponses
) {
  const normalized = query.toLowerCase();

  if (["套餐", "余量", "额度", "还能", "创建", "场景", "表单"].some((keyword) => normalized.includes(keyword))) {
    return responses.allowance;
  }

  if (["api", "key", "密钥", "token"].some((keyword) => normalized.includes(keyword))) {
    return responses.apiKeys;
  }

  if (["团队", "成员", "邀请", "协作", "权限", "角色"].some((keyword) => normalized.includes(keyword))) {
    return responses.team;
  }

  if (["账户", "账号", "用户", "邮箱", "个人"].some((keyword) => normalized.includes(keyword))) {
    return responses.account;
  }

  return responses.defaultResponse;
}
