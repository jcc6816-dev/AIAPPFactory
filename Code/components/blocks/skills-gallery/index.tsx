"use client";

import { useAppContext } from "@/contexts/app";
import { ArrowRight, CheckCircle2, FileBadge, ShieldAlert, Table2, Download, Mail, WandSparkles, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";

interface SkillsGalleryProps {
  locale: string;
}

export default function SkillsGallery({ locale }: SkillsGalleryProps) {
  const { user } = useAppContext();
  const router = useRouter();
  const isZh = (locale || "zh").toLowerCase().startsWith("zh");

  const copy = isZh
    ? {
        badge: "扩展技能中心",
        title: "开箱即用的 AI 自动化技能",
        description: "不仅仅是表单。借助 AI 与深度自动化流程，一键为您的收集场景赋能，实现防重、表格 OCR、合规性审计与数据推送。",
        cta: "立即使用 AI 体验",
        keyCapabilities: "主要能力项",
        pro: "Pro",
        free: "免费",
      }
    : {
        badge: "SKILL CENTER",
        title: "Out-of-the-Box AI & Automation Skills",
        description: "More than just forms. Empower your collection workflows with built-in AI deduplication, table parsing OCR, dynamic compliance check, and automated exports.",
        cta: "Try with AI Now",
        keyCapabilities: "Key Capabilities",
        pro: "Pro",
        free: "Free",
      };

  const skills = [
    {
      code: "deduplication",
      name: isZh ? "数据防重入与去重" : "Deduplication & Anti-fraud",
      desc: isZh
        ? "自动对上传文件计算 SHA256 哈希值，核对唯一业务字段，防止发票重复报销、数据多次录入。"
        : "Extract file hashes and match unique fields across records to block duplicated entries or fraud.",
      icon: ShieldAlert,
      tier: "Free",
      tierColor: "bg-slate-800 text-slate-300 border-slate-700",
      prompt: isZh
        ? "帮我做一个报销表单，并且开启图片去重技能"
        : "Create a reimbursement form with deduplication enabled",
      features: isZh
        ? ["图片物理哈希校验", "发票号/单据流水号唯一比对", "自动拦截熔断流程"]
        : ["Asset physical hash validation", "Business serial key uniqueness", "Automatic pipeline interception"],
      color: "from-blue-500/20 via-indigo-500/5 to-transparent",
      glowColor: "group-hover:bg-blue-500/10",
      iconColor: "text-blue-400 bg-blue-500/10",
    },
    {
      code: "table_ocr",
      name: isZh ? "多行表格 OCR 智能提取" : "Table OCR & Grid Parsing",
      desc: isZh
        ? "调用云端高精度表格解析 API，一键提取图片清单或单据中的多行多列网格数据，智能对齐并回填至子表格中。"
        : "Extract tabular matrix records from invoice/receipt images and automatically map them to dynamic form sub-tables.",
      icon: Table2,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "生成一个设备采购入库单，需要包含图片上传并自动识别表格明细"
        : "Generate a procurement receipt form with dynamic list image OCR parsing",
      features: isZh
        ? ["对接高精度表格识别", "LLM 智能表头语义对齐", "支持多行数据回填与人工校对"]
        : ["Premium cloud Table OCR engine", "LLM-driven header alignment", "Direct pre-fills & manual auditing"],
      color: "from-amber-500/20 via-yellow-500/5 to-transparent",
      glowColor: "group-hover:bg-amber-500/10",
      iconColor: "text-amber-400 bg-amber-500/10",
    },
    {
      code: "ai_pre_audit",
      name: isZh ? "AI 规则合规预审" : "AI Compliance Pre-audit",
      desc: isZh
        ? "配置企业规章提示词，AI 会在大额消费或敏感登记表单提交后进行合规性初审，自动指出超标或异常漏洞。"
        : "Evaluate submitted records against custom company policies using LLM reasoning to flag outliers instantly.",
      icon: FileBadge,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "帮我生成一个差旅出差审批表，需要开启 AI 规则预审限额"
        : "Create a business trip request form with automated AI compliance rules",
      features: isZh
        ? ["大模型自然语言政策输入", "超额/违规逻辑自动判定", "生成 AI 智审卡片警示"]
        : ["Natural language policy inputs", "Out-of-limit logic detection", "Automated AI audit logs"],
      color: "from-emerald-500/20 via-teal-500/5 to-transparent",
      glowColor: "group-hover:bg-emerald-500/10",
      iconColor: "text-emerald-400 bg-emerald-500/10",
    },
    {
      code: "report_export",
      name: isZh ? "报表导出与智能分析" : "Report Export & AI Analytics",
      desc: isZh
        ? "支持将收集到的表单数据以定制化的高颜值 PDF / Excel 模板导出，并在导出前由 AI 生成数据趋势总结与诊断报告。"
        : "Export captured data to customized premium PDF/Excel templates, with automatically generated trend summaries by LLM.",
      icon: Download,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "帮我做一个客户满意度调研表，并启用报表导出与智能分析技能"
        : "Create a customer satisfaction survey with report export and intelligence analysis skill enabled",
      features: isZh
        ? ["定制化 PDF/Excel 模版渲染", "AI 生成月度/季度趋势分析", "一键批量打包导出"]
        : ["Custom PDF/Excel templates", "LLM-driven trend summaries", "Bulk export & archive package"],
      color: "from-purple-500/20 via-pink-500/5 to-transparent",
      glowColor: "group-hover:bg-purple-500/10",
      iconColor: "text-purple-400 bg-purple-500/10",
    },
    {
      code: "email_notification",
      name: isZh ? "邮件通知与联动附件" : "Email Notification & Chaining",
      desc: isZh
        ? "支持在表单新提交时向表单发起人、自定义邮箱或填报者发送邮件，并可自动附带生成的智能报表附件。"
        : "Send automated emails on form submissions. Integrates with smart reports to automatically attach compiled Excel/PDF files.",
      icon: Mail,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "生成一个设备采购申请表，同时开启邮件通知并自动发送报表给 hr@company.com"
        : "Create a procurement request form with email notifications and automated report attachments sent to hr@company.com",
      features: isZh
        ? ["支持收件人路由匹配", "邮件正文动态模板渲染", "智能报表附件自动关联"]
        : ["Dynamic recipient matching", "Dynamic subject & body rendering", "Automated smart report attachment"],
      color: "from-cyan-500/20 via-blue-500/5 to-transparent",
      glowColor: "group-hover:bg-cyan-500/10",
      iconColor: "text-cyan-400 bg-cyan-500/10",
    },
    {
      code: "data_cleaning",
      name: isZh ? "AI 数据清洗" : "AI Data Cleaning",
      desc: isZh
        ? "自动对填报的空格、邮箱拼写、手机号码格式等常见脏数据进行清洗与规范化，提升后续数据质量。"
        : "Clean submitted values automatically. Trims whitespaces, standardizes email domains and formats phone numbers.",
      icon: WandSparkles,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "做一个活动报名表，启用数据清洗，自动把报名邮箱全部转为小写"
        : "Create an event registration form with AI data cleaning converting emails to lowercase",
      features: isZh
        ? ["姓名/文本前后空格自动裁剪", "电子邮件自动转小写规整", "手机号横线与无用分隔符清除"]
        : ["Trailing whitespace trimming", "Email casing standardizer", "Phone divider sanitization"],
      color: "from-pink-500/20 via-rose-500/5 to-transparent",
      glowColor: "group-hover:bg-pink-500/10",
      iconColor: "text-pink-400 bg-pink-500/10",
    },
    {
      code: "ai_insights",
      name: isZh ? "AI 摘要与洞察" : "AI Insights & Summary",
      desc: isZh
        ? "提交后由大语言模型自动提取核心信息、生成业务摘要、标记高金额风险，并智能提炼行动建议。"
        : "Leverage LLM logic to generate briefs, trigger high-value thresholds indicators, and draft actionable suggestions.",
      icon: BrainCircuit,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      prompt: isZh
        ? "做一个大额采购预算表，并且开启 AI 摘要与洞察，高金额报警线设为 5000 元"
        : "Create a procurement form with AI insights enabled, setting high value alert to $5000",
      features: isZh
        ? ["业务简报趋势摘要自动提取", "高值大额预警边界过滤", "生成下一步行动处置建议"]
        : ["Actionable summaries brief", "Out-of-limit warning markers", "Next action recommendations"],
      color: "from-amber-500/20 via-orange-500/5 to-transparent",
      glowColor: "group-hover:bg-amber-500/10",
      iconColor: "text-amber-400 bg-amber-500/10",
    },
  ];

  const handleAction = (promptText: string) => {
    const targetUrl = `/${locale}/forms/new?prompt=${encodeURIComponent(promptText)}`;

    if (!user) {
      window.location.href = `/${locale}/auth/signin?callbackUrl=${encodeURIComponent(targetUrl)}`;
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <section id="skills" className="border-b border-slate-900 bg-slate-950 px-6 py-20 text-white relative overflow-hidden">
      {/* Dynamic background glow spheres */}
      <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-black uppercase tracking-widest text-blue-400">
            {copy.badge}
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {copy.title}
          </h2>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-400">
            {copy.description}
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.code}
                className="group relative flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden"
              >
                {/* Visual Glassmorphism gradient fill */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-40 transition-opacity duration-300 -z-10`} />
                <div className={`absolute -right-12 -top-12 -z-10 h-32 w-32 rounded-full bg-transparent blur-2xl transition duration-500 ${skill.glowColor}`} />

                <div>
                  {/* Card Top / Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className={`p-4 rounded-2xl shrink-0 ${skill.iconColor}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-0.5 text-[10px] font-black uppercase tracking-wider ${skill.tierColor}`}
                    >
                      {skill.tier === "Pro" ? copy.pro : copy.free}
                    </span>
                  </div>

                  {/* Title and Desc */}
                  <h3 className="mt-6 text-xl font-black text-white group-hover:text-blue-300 transition duration-300">
                    {skill.name}
                  </h3>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-slate-400 min-h-[50px]">
                    {skill.desc}
                  </p>

                  {/* Key Capabilities */}
                  <div className="mt-6 border-t border-white/5 pt-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {copy.keyCapabilities}
                    </p>
                    <div className="mt-3 grid gap-2.5">
                      {skill.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs font-bold text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Call To Action Button */}
                <div className="mt-8 border-t border-white/5 pt-5">
                  <button
                    onClick={() => handleAction(skill.prompt)}
                    className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-slate-900 border border-white/10 hover:border-blue-500/50 px-4 text-xs font-black text-white hover:text-blue-300 hover:bg-slate-800 transition duration-300 gap-1.5"
                  >
                    <span>{copy.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
