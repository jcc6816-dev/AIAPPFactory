import { ShieldAlert, Table2, FileBadge, ArrowUpRight, CheckCircle2, Download } from "lucide-react";
import Link from "next/link";

export default async function SkillsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = (locale || "zh").toLowerCase().startsWith("zh");

  const skills = [
    {
      code: "deduplication",
      name: isZh ? "数据防重入与去重" : "Deduplication & Anti-fraud",
      desc: isZh 
        ? "自动对上传文件计算 SHA256 哈希值比对，并在填报数据中核对唯一业务字段，防止发票重复报销、数据多次录入。" 
        : "Extract file hashes and match unique fields across records to block duplicated entries or fraud.",
      icon: ShieldAlert,
      tier: "Free",
      tierColor: "bg-slate-100 text-slate-700",
      aiPrompt: isZh 
        ? "帮我做一个报销表单，并且开启图片去重技能" 
        : "Create a reimbursement form with deduplication enabled",
      features: isZh 
        ? ["图片物理哈希校验", "发票号/单据流水号唯一比对", "自动拦截熔断流程"] 
        : ["Asset physical hash validation", "Business serial key uniqueness", "Automatic pipeline interception"]
    },
    {
      code: "table_ocr",
      name: isZh ? "多行表格 OCR 智能提取" : "Table OCR & Grid Parsing",
      desc: isZh 
        ? "调用云端高精度表格解析 API，一键提取图片清单或单据中的多行多列网格数据，智能对齐并回填至表单的子表格中。" 
        : "Extract tabular matrix records from invoice/receipt images and automatically map them to dynamic form sub-tables.",
      icon: Table2,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm",
      aiPrompt: isZh 
        ? "生成一个设备采购入库单，需要包含图片上传并自动识别表格明细" 
        : "Generate a procurement receipt form with dynamic list image OCR parsing",
      features: isZh 
        ? ["对接高精度表格识别", "LLM 智能表头语义对齐", "支持多行数据回填与人工校对"] 
        : ["Premium cloud Table OCR engine", "LLM-driven header alignment", "Direct pre-fills & manual auditing"]
    },
    {
      code: "ai_pre_audit",
      name: isZh ? "AI 规则合规预审" : "AI Compliance Pre-audit",
      desc: isZh 
        ? "配置企业规章提示词，AI 会在大额消费或敏感登记表单提交后进行合规性初审，自动指出超标或异常漏洞。" 
        : "Evaluate submitted records against custom company policies using LLM reasoning to flag outliers instantly.",
      icon: FileBadge,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm",
      aiPrompt: isZh 
        ? "帮我生成一个差旅出差审批表，需要开启 AI 规则预审限额" 
        : "Create a business trip request form with automated AI compliance rules",
      features: isZh 
        ? ["大模型自然语言政策输入", "超额/违规逻辑自动判定", "生成 AI 智审卡片警示"] 
        : ["Natural language policy inputs", "Out-of-limit logic detection", "Automated AI audit logs"]
    },
    {
      code: "report_export",
      name: isZh ? "报表导出与智能分析" : "Report Export & AI Analytics",
      desc: isZh 
        ? "支持将收集到的表单数据以定制化的高颜值 PDF / Excel 模板导出，并在导出前由 AI 生成数据趋势总结与诊断报告。" 
        : "Export captured data to customized premium PDF/Excel templates, with automatically generated trend summaries by LLM.",
      icon: Download,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm",
      aiPrompt: isZh 
        ? "帮我做一个客户满意度调研表，并启用报表导出与智能分析技能" 
        : "Create a customer satisfaction survey with report export and intelligence analysis skill enabled",
      features: isZh 
        ? ["定制化 PDF/Excel 模版渲染", "AI 生成月度/季度趋势分析", "一键批量打包导出"] 
        : ["Custom PDF/Excel templates", "LLM-driven trend summaries", "Bulk export & archive package"]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto min-h-0 w-full bg-slate-50">
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-900">
        {/* Title Header */}
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
          <p className="text-[11px] font-black text-brand-blue uppercase tracking-widest">Skill Dictionary</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {isZh ? "AI 智能技能仓库" : "AI Smart Skill Catalog"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-3xl">
            {isZh 
              ? "欢迎来到扩展技能中心。这里汇总了平台所有的 AI 与自动化流转技能。选择您感兴趣的技能，可直接召唤 AI 生成并关联好该技能的专属场景表单。" 
              : "Welcome to the Skill Catalog. Explore our ready-to-use AI and automation capabilities. You can summon the AI Generator to automatically map and build form workflows containing these skills."}
          </p>
        </div>

        {/* Grid of skills */}
        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div 
                key={skill.code}
                className="flex flex-col justify-between rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
              >
                {/* Decorative background glow */}
                <div className="absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full bg-slate-50 blur-xl group-hover:bg-brand-blue/5 transition duration-300" />

                <div>
                  {/* Header item */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3.5 rounded-2xl bg-brand-blue/5 text-brand-blue shrink-0">
                      <Icon className="size-6" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${skill.tierColor}`}>
                      {skill.tier}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mt-5 text-lg font-extrabold text-slate-950">{skill.name}</h3>
                  <p className="mt-2 text-xs font-semibold text-slate-500 leading-relaxed min-h-[50px]">
                    {skill.desc}
                  </p>

                  {/* List of Features */}
                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {isZh ? "主要能力项" : "Key Capabilities"}
                    </p>
                    <div className="grid gap-2">
                      {skill.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Button: One-click template generation using this skill */}
                <div className="mt-8 border-t border-slate-100 pt-4">
                  <Link
                    href={`/${locale}/forms/new?prompt=${encodeURIComponent(skill.aiPrompt)}`}
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-black text-white transition hover:bg-brand-blue gap-1"
                  >
                    {isZh ? "套用此技能创建表单" : "Use This Skill"}
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
