import { redirect } from "next/navigation";

import AgentWorkspace from "@/components/agentfactory/agent-workspace";
import Icon from "@/components/icon";
import { getFormCreationAllowance } from "@/services/form";
import { getUserInfo, getUserUuid } from "@/services/user";

export default async function ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const userInfo = await getUserInfo();
  const user_uuid = await getUserUuid();
  const callbackUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/settings`;

  if (!userInfo?.email || !user_uuid) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const allowance = await getFormCreationAllowance(user_uuid);

  return (
    <AgentWorkspace
      agentTitle="AI 账户管家"
      agentDescription="这里用于管理账户、套餐额度与团队协作。MVP 阶段先展示当前账户和基础用量。"
      inputPlaceholder="例如：我现在还能创建几个场景？"
      examples={[
        { label: "查询套餐余量", icon: "RiBankCardLine" },
        { label: "查看 API 密钥", icon: "RiKey2Line" },
        { label: "邀请团队成员", icon: "RiTeamLine" },
      ]}
    >
      <div className="p-6 space-y-6">
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-extrabold text-brand-blue uppercase tracking-widest">Settings</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            账户与组织设置 / Settings
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            管理个人账户、订阅额度和团队协作入口。
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Profile Section */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <Icon name="RiUserSmileLine" className="h-6 w-6 text-brand-blue" />
              个人基本信息
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">姓名</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-bold text-slate-900 outline-none transition-colors focus:border-brand-blue focus:bg-white"
                  defaultValue={userInfo.nickname || "Mike Admin"}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">电子邮箱</label>
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
                当前订阅计划: <span className="text-brand-blue">{allowance.isPaidUser ? "专业版 (Pro)" : "免费版 (Free)"}</span>
              </h2>
              <button className="rounded-xl bg-emerald-500 px-5 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-emerald-600 shadow-md shadow-emerald-500/20">
                {allowance.isPaidUser ? "管理订阅" : "升级计划"}
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[13px] font-bold">
                  <span className="text-slate-700">AI 场景创建额度</span>
                  <span className="text-slate-900">{allowance.isPaidUser ? "不限量" : `${allowance.currentFormCount} / ${allowance.maxForms || 1}`}</span>
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
                  <span className="text-slate-700">提交数据额度</span>
                  <span className="text-slate-900">1,240 / 10,000</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div 
                    className="h-full rounded-full bg-amber-500 transition-all duration-500" 
                    style={{ width: "12.4%" }} 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="mb-6 flex items-center gap-3 text-lg font-extrabold text-slate-900">
              <Icon name="RiTeamLine" className="h-6 w-6 text-brand-blue" />
              团队成员管理
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left">
                <thead>
                  <tr>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">成员名称</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">角色</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">最后活跃</th>
                    <th className="border-b-2 border-slate-100 pb-3 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">状态</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] font-bold text-slate-700">
                  <tr className="border-b border-slate-50 transition-colors hover:bg-slate-50/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light-blue text-[11px] font-black text-brand-blue">
                          {(userInfo.nickname?.[0] || userInfo.email?.[0] || "M").toUpperCase()}
                        </div>
                        <span className="text-slate-900">{userInfo.nickname || "Mike Admin"} (你)</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[10px] font-extrabold text-indigo-600">超级管理员</span>
                    </td>
                    <td className="py-4 text-slate-500">刚刚</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        在线
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
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-500">数据分析师</span>
                    </td>
                    <td className="py-4 text-slate-500">2 小时前</td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                        离线
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
