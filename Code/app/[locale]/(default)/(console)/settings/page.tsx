import { redirect } from "next/navigation";
import Link from "next/link";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Icon from "@/components/icon";
import { getFormCreationAllowance } from "@/services/form";
import { getBillingPlanSummary } from "@/services/billing";
import { buildSettingsAgentResponses } from "@/services/settings-agent";
import { getUserInfo, getUserUuid } from "@/services/user";

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale.toLowerCase().startsWith("zh");
  const userInfo = await getUserInfo();
  const user_uuid = await getUserUuid();
  const callbackUrl = `/${locale}/settings`;

  if (!userInfo?.email || !user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const [allowance, billing] = await Promise.all([
    getFormCreationAllowance(user_uuid),
    getBillingPlanSummary(user_uuid, userInfo.email),
  ]);
  const settingsAgentResponses = buildSettingsAgentResponses(
    {
      uuid: user_uuid,
      email: userInfo.email,
      nickname: userInfo.nickname || "",
    },
    allowance
  );

  return (
    <AgentWorkspace
      agentTitle={isZh ? "AI 账户管家" : "AI Account Manager"}
      agentDescription={isZh ? "这里用于管理账户、套餐额度与团队协作。MVP 阶段先展示当前账户和基础用量。" : "Here you can manage your account, subscription limits, and team collaboration. The MVP phase displays your current account and basic usage."}
      inputPlaceholder={isZh ? "例如：我现在还能创建几个场景？" : "e.g. How many more scenes can I create?"}
      examples={[
        {
          label: isZh ? "查询套餐余量" : "Check subscription usage",
          icon: "RiBankCardLine",
          response: settingsAgentResponses.allowance,
        },
        {
          label: isZh ? "查看 API 密钥" : "View API keys",
          icon: "RiKey2Line",
          response: settingsAgentResponses.apiKeys,
        },
        {
          label: isZh ? "邀请团队成员" : "Invite team members",
          icon: "RiTeamLine",
          response: settingsAgentResponses.team,
        },
      ]}
      staticResponses={[
        {
          keywords: isZh ? ["套餐", "余量", "额度", "还能", "创建", "场景", "表单"] : ["subscription", "allowance", "limit", "create", "scene", "form"],
          response: settingsAgentResponses.allowance,
        },
        {
          keywords: isZh ? ["api", "key", "密钥", "token"] : ["api", "key", "token"],
          response: settingsAgentResponses.apiKeys,
        },
        {
          keywords: isZh ? ["团队", "成员", "邀请", "协作", "权限", "角色"] : ["team", "member", "invite", "collaborate", "permission", "role"],
          response: settingsAgentResponses.team,
        },
        {
          keywords: isZh ? ["账户", "账号", "用户", "邮箱", "个人"] : ["account", "user", "email", "personal"],
          response: settingsAgentResponses.account,
        },
      ]}
      defaultResponse={settingsAgentResponses.defaultResponse}
      agentEndpoint="/api/forms/settings-agent"
    >
      <div className="p-6 space-y-6">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold text-brand-blue uppercase tracking-widest">Settings</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {isZh ? "账户与组织设置 / Settings" : "Account & Organization Settings"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {isZh ? "管理个人账户、订阅额度和团队协作入口。" : "Manage personal account, subscription allowances, and team collaboration."}
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Profile Section */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <Icon name="RiUserSmileLine" className="h-6 w-6 text-brand-blue" />
              {isZh ? "个人基本信息" : "Personal Information"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "姓名" : "Name"}</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-bold text-slate-900 outline-none transition-colors focus:border-brand-blue focus:bg-white"
                  defaultValue={userInfo.nickname || "Mike Admin"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "电子邮箱" : "Email Address"}</label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-bold text-slate-500 outline-none"
                  defaultValue={userInfo.email}
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-3 text-lg font-extrabold text-slate-900">
                <Icon name="RiVipDiamondLine" className="h-6 w-6 text-brand-blue" />
                {isZh ? "当前订阅计划: " : "Current Plan: "} <span className="text-brand-blue">{billing.planName}</span>
              </h2>
              <Link
                href={billing.isPaidUser ? `/${locale}/my-orders` : `/${locale}/#pricing`}
                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
              >
                {billing.isPaidUser ? (isZh ? "管理订阅" : "Manage Subscription") : (isZh ? "升级计划" : "Upgrade Plan")}
              </Link>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {isZh ? "套餐状态" : "Plan Status"}
                </p>
                <p className="mt-2 text-sm font-extrabold text-slate-950">
                  {billing.statusLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {isZh ? "有效期" : "Validity"}
                </p>
                <p className="mt-2 text-sm font-extrabold text-slate-950">
                  {billing.renewalLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Credits
                </p>
                <p className="mt-2 text-sm font-extrabold text-slate-950">
                  {billing.leftCredits}
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <span className="text-slate-700">{isZh ? "AI 场景创建额度" : "AI Scene Creation Allowance"}</span>
                  <span className="text-slate-900">{allowance.isPaidUser ? (isZh ? "不限量" : "Unlimited") : `${allowance.currentFormCount} / ${allowance.maxForms || 1}`}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-brand-blue transition-all duration-500" 
                    style={{ width: allowance.isPaidUser ? "100%" : `${Math.min((allowance.currentFormCount / (allowance.maxForms || 1)) * 100, 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <span className="text-slate-700">{isZh ? "剩余提交 Credits" : "Remaining Submission Credits"}</span>
                  <span className="text-slate-900">{billing.leftCredits}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-amber-500 transition-all duration-500" 
                    style={{ width: `${Math.min((billing.leftCredits / 1000) * 100, 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {isZh ? "当前权益" : "Current Benefits"}
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {billing.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <Icon name="RiTeamLine" className="h-6 w-6 text-brand-blue" />
              {isZh ? "团队成员管理" : "Team Member Management"}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left">
                <thead>
                  <tr>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "成员名称" : "Name"}</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "角色" : "Role"}</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "最后活跃" : "Last Active"}</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">{isZh ? "状态" : "Status"}</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light-blue text-[11px] font-black text-brand-blue">
                          {(userInfo.nickname?.[0] || userInfo.email?.[0] || "M").toUpperCase()}
                        </div>
                        <span className="text-slate-900">{userInfo.nickname || "Mike Admin"} {isZh ? "(你)" : "(You)"}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600">{isZh ? "超级管理员" : "Super Admin"}</span>
                    </td>
                    <td className="py-4 text-slate-500">{isZh ? "刚刚" : "Just now"}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {isZh ? "在线" : "Online"}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-100 text-[11px] font-black text-fuchsia-600">
                          L
                        </div>
                        <span className="text-slate-900">Linda Analyst</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">{isZh ? "数据分析师" : "Data Analyst"}</span>
                    </td>
                    <td className="py-4 text-slate-500">{isZh ? "2 小时前" : "2 hours ago"}</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        {isZh ? "离线" : "Offline"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </AgentWorkspace>
  );
}
