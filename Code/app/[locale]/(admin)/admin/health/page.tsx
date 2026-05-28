import {
  getDeploymentHealthSections,
  summarizeDeploymentHealth,
} from "@/services/deployment-health";

export default async function AdminHealthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";
  const sections = getDeploymentHealthSections();
  const summary = summarizeDeploymentHealth(sections);

  return (
    <div className="w-full px-4 py-8 md:px-8">
      <div className="mb-8">
        <p className="text-[11px] font-extrabold uppercase tracking-widest text-brand-blue">
          {isZh ? "上线准备" : "Release Readiness"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {isZh ? "部署健康检查" : "Deployment Health"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isZh
            ? "检查生产关键配置是否就绪，同时不暴露任何密钥明文。"
            : "Validate production-critical configuration without exposing secret values."}
        </p>
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <SummaryCard label={isZh ? "检查项" : "Total Checks"} value={summary.total} />
        <SummaryCard label={isZh ? "通过" : "Pass"} value={summary.pass} tone="pass" />
        <SummaryCard label={isZh ? "预警" : "Warnings"} value={summary.warn} tone="warn" />
        <SummaryCard label={isZh ? "失败" : "Failures"} value={summary.fail} tone="fail" />
      </section>

      <div className="grid gap-6">
        {sections.map((section) => (
          <section
            key={section.key}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-base font-extrabold text-slate-950">
              {section.title}
            </h2>
            <div className="mt-4 divide-y divide-slate-100">
              {section.checks.map((check) => (
                <div
                  key={check.key}
                  className="grid gap-3 py-4 md:grid-cols-[160px_minmax(0,1fr)_minmax(180px,260px)] md:items-center"
                >
                  <StatusBadge status={check.status} />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {check.label}
                    </p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                      {check.description}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-slate-500 md:text-right">
                    {check.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "pass" | "warn" | "fail";
}) {
  const toneClass =
    tone === "pass"
      ? "text-emerald-600"
      : tone === "warn"
        ? "text-amber-600"
        : tone === "fail"
          ? "text-rose-600"
          : "text-slate-950";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "pass" | "warn" | "fail" }) {
  const className =
    status === "pass"
      ? "bg-emerald-50 text-emerald-700"
      : status === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-rose-50 text-rose-700";

  return (
    <span
      className={`inline-flex w-fit rounded-xl px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest ${className}`}
    >
      {status}
    </span>
  );
}
