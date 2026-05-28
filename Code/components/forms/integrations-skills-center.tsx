"use client";

import { useState, useTransition } from "react";
import { 
  ShieldCheck, 
  Camera, 
  TableProperties, 
  FileCheck, 
  ArrowRight, 
  Sparkles, 
  X, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Link as LinkIcon,
  Mail,
  WandSparkles,
  ChartNoAxesColumnIncreasing
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormRecord } from "@/types/form";
import OcrSettingsForm from "./ocr-settings-form";
import WebhookSettingsForm from "./webhook-settings-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IntegrationsSkillsCenterProps {
  form: FormRecord;
  isPaidUser: boolean;
  locale: string;
}

export default function IntegrationsSkillsCenter({
  form,
  isPaidUser,
  locale
}: IntegrationsSkillsCenterProps) {
  const t = useTranslations("forms");
  const isZh = locale.toLowerCase().startsWith("zh");

  // Local states for expand/collapse configurations
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState<{ name: string; desc: string } | null>(null);
  const [isSavingSkill, startSkillSaveTransition] = useTransition();

  const persistedSkillSettings = form.generation_meta_json?.artifact?.skillSettings || {};
  const [deduplicationEnabled, setDeduplicationEnabled] = useState(
    Boolean(persistedSkillSettings.deduplication?.enabled)
  );
  const [tableOcrEnabled, setTableOcrEnabled] = useState(
    Boolean(persistedSkillSettings.table_ocr?.enabled)
  );
  const [aiAuditEnabled, setAiAuditEnabled] = useState(
    Boolean(persistedSkillSettings.ai_pre_audit?.enabled)
  );
  const [reportExportEnabled, setReportExportEnabled] = useState(
    Boolean(persistedSkillSettings.report_export?.enabled)
  );
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState(
    Boolean(persistedSkillSettings.email_notification?.enabled)
  );
  const [dataCleaningEnabled, setDataCleaningEnabled] = useState(
    Boolean(persistedSkillSettings.data_cleaning?.enabled)
  );
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(
    Boolean(persistedSkillSettings.ai_insights?.enabled)
  );

  const [deduplicationConfig, setDeduplicationConfig] = useState(
    persistedSkillSettings.deduplication?.config || {}
  );
  const [tableOcrConfig, setTableOcrConfig] = useState(
    persistedSkillSettings.table_ocr?.config || {}
  );
  const [aiAuditConfig, setAiAuditConfig] = useState(
    persistedSkillSettings.ai_pre_audit?.config || {}
  );
  const [reportExportConfig, setReportExportConfig] = useState(
    persistedSkillSettings.report_export?.config || {}
  );
  const [emailNotificationConfig, setEmailNotificationConfig] = useState(
    persistedSkillSettings.email_notification?.config || {}
  );
  const [dataCleaningConfig, setDataCleaningConfig] = useState(
    persistedSkillSettings.data_cleaning?.config || {}
  );
  const [aiInsightsConfig, setAiInsightsConfig] = useState(
    persistedSkillSettings.ai_insights?.config || {}
  );

  function saveSkillSetting(
    code: "deduplication" | "table_ocr" | "ai_pre_audit" | "report_export" | "email_notification" | "data_cleaning" | "ai_insights",
    enabled: boolean,
    setterEnabled: (value: boolean) => void,
    config?: Record<string, any>,
    setterConfig?: (val: any) => void
  ) {
    startSkillSaveTransition(async () => {
      try {
        const response = await fetch(`/api/forms/${form.uuid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill_settings: {
              [code]: { enabled, config },
            },
          }),
        });

        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || "save skill settings failed");
        }

        setterEnabled(enabled);
        if (config && setterConfig) {
          setterConfig(config);
        }
        toast.success(isZh ? "技能配置已保存" : "Skill setting saved");
      } catch (error: any) {
        toast.error(error.message || "save skill settings failed");
      }
    });
  }

  const skills = [
    {
      code: "deduplication",
      name: isZh ? "数据防重与重复拦截" : "Deduplication Guard",
      desc: isZh ? "提交后自动检查重复文件名、重复关键字段和疑似重复内容，异常时熔断后续推送" : "Check duplicated filenames, unique fields and suspicious repeated payloads before later delivery steps",
      icon: ShieldCheck,
      badge: "Free",
      badgeColor: "bg-slate-100 text-slate-700",
      tier: "free",
      hasForm: true,
      enabled: deduplicationEnabled,
      renderForm: () => (
        <DeduplicationSettingsForm
          form={form}
          isZh={isZh}
          persisted={persistedSkillSettings.deduplication}
          isSaving={isSavingSkill}
          onSave={(enabled, config) =>
            saveSkillSetting("deduplication", enabled, setDeduplicationEnabled, config, setDeduplicationConfig)
          }
        />
      )
    },
    {
      code: "data_cleaning",
      name: isZh ? "AI 数据清洗" : "AI Data Cleaning",
      desc: isZh ? "自动统一邮箱、手机号、空格和大小写，减少脏数据进入后续统计与推送" : "Normalize email, phone, whitespace and casing before analytics and downstream automation",
      icon: WandSparkles,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: dataCleaningEnabled,
      renderForm: () => (
        <DataCleaningSettingsForm
          isZh={isZh}
          persisted={persistedSkillSettings.data_cleaning}
          isSaving={isSavingSkill}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "AI 数据清洗" : "AI Data Cleaning",
                isZh ? "自动清洗填报数据，统一手机号、邮箱和文本格式，减少人工整理成本。" : "Automatically clean submitted data and reduce manual normalization work."
              );
            } else {
              saveSkillSetting("data_cleaning", enabled, setDataCleaningEnabled, config, setDataCleaningConfig);
            }
          }}
        />
      )
    },
    {
      code: "webhook",
      name: isZh ? "Webhook 实时推送" : "Webhook Data Push",
      desc: isZh ? "表单提交后，实时将数据以 JSON 格式推送至第三方系统" : "Push submission payloads to external systems in real time",
      icon: LinkIcon,
      badge: "Free",
      badgeColor: "bg-slate-100 text-slate-700",
      tier: "free",
      hasForm: true,
      renderForm: () => (
        <WebhookSettingsForm
          form={{
            uuid: form.uuid,
            webhook_enabled: form.webhook_enabled,
            webhook_url: form.webhook_url,
            webhook_provider: form.webhook_provider,
            webhook_auth_mode: form.webhook_auth_mode,
            webhook_header_name: form.webhook_header_name,
          }}
        />
      )
    },
    {
      code: "ocr_single",
      name: isZh ? "单据/卡证 OCR 识别" : "Single Document OCR",
      desc: isZh ? "上传发票、收据或身份证，自动提取文本并填入表单中" : "Upload invoices, receipts or ID cards to auto-extract and fill fields",
      icon: Camera,
      badge: "Free",
      badgeColor: "bg-slate-100 text-slate-700",
      tier: "free",
      hasForm: true,
      renderForm: () => (
        <OcrSettingsForm
          form={{
            uuid: form.uuid,
            ocr_template: form.ocr_template,
          }}
        />
      )
    },
    {
      code: "table_ocr",
      name: isZh ? "表格图片 OCR 智能提取" : "Table OCR Extraction",
      desc: isZh ? "自动从物资清单、明细表格图片中解析多行数据，回填子表格" : "Extract multi-row tabular grid data from images and fill sub-tables",
      icon: TableProperties,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: tableOcrEnabled,
      renderForm: () => (
        <TableOcrSettingsForm
          form={form}
          isZh={isZh}
          persisted={persistedSkillSettings.table_ocr}
          isSaving={isSavingSkill}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "表格图片 OCR 智能提取" : "Table OCR Extraction",
                isZh ? "自动识别上传的明细表格、物资清单等图片，精准转换并格式化为子表格数据存入数据库。" : "Analyze uploaded table or asset list images, convert and automatically structure them into fillable data grid entries."
              );
            } else {
              saveSkillSetting("table_ocr", enabled, setTableOcrEnabled, config, setTableOcrConfig);
            }
          }}
        />
      )
    },
    {
      code: "ai_audit",
      name: isZh ? "AI 规则合规预审" : "AI Compliance Pre-audit",
      desc: isZh ? "大模型根据企业报销或合规条款对提交的数据自动进行合规性初审" : "LLM pre-audits data submissions against customizable compliance terms",
      icon: FileCheck,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: aiAuditEnabled,
      renderForm: () => (
        <AiPreAuditSettingsForm
          isZh={isZh}
          persisted={persistedSkillSettings.ai_pre_audit}
          isSaving={isSavingSkill}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "AI 规则合规预审" : "AI Compliance Pre-audit",
                isZh ? "利用大模型分析提交的数据并依据企业制度（如限额、项目期内）进行合规性检测，标记疑似违规项。" : "Configure LLM prompts to scan submitted data against company rules, flagging suspect entries automatically."
              );
            } else {
              saveSkillSetting("ai_pre_audit", enabled, setAiAuditEnabled, config, setAiAuditConfig);
            }
          }}
        />
      )
    },
    {
      code: "report_export",
      name: isZh ? "智能报表导出" : "Smart Report Export",
      desc: isZh ? "提交数据后生成结构化导出任务，后续可扩展为 PDF / Excel 下载与 AI 摘要" : "Create structured export steps after submissions, ready for PDF/Excel rendering and AI summaries",
      icon: FileCheck,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: reportExportEnabled,
      renderForm: () => (
        <ReportExportSettingsForm
          isZh={isZh}
          persisted={persistedSkillSettings.report_export}
          isSaving={isSavingSkill}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "智能报表导出" : "Smart Report Export",
                isZh ? "把收集数据转成结构化导出任务，后续可升级为高颜值 PDF / Excel 报表和 AI 数据摘要。" : "Turn submission data into structured export tasks, later extendable to polished PDF/Excel reports and AI summaries."
              );
            } else {
              saveSkillSetting("report_export", enabled, setReportExportEnabled, config, setReportExportConfig);
            }
          }}
        />
      )
    },
    {
      code: "ai_insights",
      name: isZh ? "AI 摘要与洞察" : "AI Summary & Insights",
      desc: isZh ? "对每次提交生成摘要、风险提示和下一步建议，沉淀到数据中心用于运营分析" : "Generate submission summaries, risk hints and next actions for operations analytics",
      icon: ChartNoAxesColumnIncreasing,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: aiInsightsEnabled,
      renderForm: () => (
        <AiInsightsSettingsForm
          isZh={isZh}
          persisted={persistedSkillSettings.ai_insights}
          isSaving={isSavingSkill}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "AI 摘要与洞察" : "AI Summary & Insights",
                isZh ? "自动生成提交摘要、风险提示和下一步建议，让数据中心更像智能运营助手。" : "Generate summaries, risks and next actions so the data center feels like an operations assistant."
              );
            } else {
              saveSkillSetting("ai_insights", enabled, setAiInsightsEnabled, config, setAiInsightsConfig);
            }
          }}
        />
      )
    },
    {
      code: "email_notification",
      name: isZh ? "邮件通知与联动附件" : "Email Notification & Chaining",
      desc: isZh ? "提交数据后自动发送邮件通知，支持自定义内容模板，并可联动自动附带生成的智能报表附件" : "Send automated emails on form submissions. Custom subjects & bodies, plus report files attachments integrations.",
      icon: Mail,
      badge: "Pro",
      badgeColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm font-extrabold",
      tier: "pro",
      hasForm: true,
      enabled: emailNotificationEnabled,
      renderForm: () => (
        <EmailNotificationSettingsForm
          isZh={isZh}
          persisted={persistedSkillSettings.email_notification}
          isSaving={isSavingSkill}
          isReportSkillEnabled={reportExportEnabled}
          onSave={(enabled, config) => {
            if (!isPaidUser && enabled) {
              triggerUpgradeModal(
                isZh ? "邮件通知与联动附件" : "Email Notification & Chaining",
                isZh ? "配置表单提交通知和填报人自动回执，联动附带智能报表附件，全自动触达客户或管理层。" : "Configure form alerts and automated receipts with attached reports to reach customers or managers."
              );
            } else {
              saveSkillSetting("email_notification", enabled, setEmailNotificationEnabled, config, setEmailNotificationConfig);
            }
          }}
        />
      )
    }
  ];

  function triggerUpgradeModal(name: string, desc: string) {
    setUpgradeTarget({ name, desc });
    setShowUpgradeModal(true);
  }

  return (
    <div className="space-y-6">
      {/* Skill List Container */}
      <div className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-950 flex items-center gap-2">
            <Sparkles className="size-5 text-brand-blue" />
            {isZh ? "扩展技能与集成中心" : "Integrations & Skills Center"}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isZh 
              ? "为您的表单装配自动化数据过滤、图像智能识别以及第三方系统集成同步能力。" 
              : "Equip your form with automated data filtering, intelligent image parsing, and webhook integrations."}
          </p>
        </div>

        <div className="grid gap-4">
          {skills.map((skill) => {
            const isExpanded = expandedSkill === skill.code;
            const hasAccess = skill.tier === "free" || isPaidUser;

            return (
              <div 
                key={skill.code}
                className={`rounded-2xl border transition-all duration-300 ${
                  isExpanded 
                    ? "border-brand-blue bg-slate-50/50 shadow-sm" 
                    : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/30"
                }`}
              >
                {/* Skill Header */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`p-3 rounded-2xl shrink-0 ${
                      isExpanded ? "bg-brand-blue/10 text-brand-blue" : "bg-slate-100 text-slate-500"
                    }`}>
                      <skill.icon className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-extrabold text-slate-950">{skill.name}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${skill.badgeColor}`}>
                          {skill.badge}
                        </span>
                        {!hasAccess && (
                          <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                            {isZh ? "需升级解锁" : "Upgrade to Unlock"}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed max-w-xl">
                        {skill.desc}
                      </p>
                    </div>
                  </div>

                  {/* Skill Control */}
                  <div className="flex items-center gap-3 shrink-0 sm:self-center self-end">
                    {skill.hasForm ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedSkill(isExpanded ? null : skill.code)}
                        className="rounded-xl font-bold text-xs gap-1 h-9 px-4"
                      >
                        {isZh ? "配置" : "Configure"}
                        {isExpanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-3">
                        {skill.enabled && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            {isZh ? "已启用" : "Enabled"}
                          </span>
                        )}
                        <Switch 
                          checked={skill.enabled || false} 
                          onCheckedChange={(skill as any).onToggle}
                          disabled={isSavingSkill}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Settings Forms */}
                {skill.hasForm && isExpanded && skill.renderForm && (
                  <div className="border-t border-slate-100 p-4 sm:p-6 bg-white rounded-b-2xl">
                    {skill.renderForm()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Upgrade Modal (Glassmorphism design) */}
      {showUpgradeModal && upgradeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => setShowUpgradeModal(false)}
          />
          
          {/* Content Wrapper */}
          <div className="relative w-full max-w-md overflow-hidden rounded-[2.2rem] border border-white/20 bg-white/80 p-6 md:p-8 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Glowing Aurora background effect inside modal */}
            <div className="absolute -left-12 -top-12 -z-10 h-36 w-36 rounded-full bg-brand-blue/30 blur-2xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 -z-10 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-slate-100/80 hover:text-slate-700 transition"
            >
              <X className="size-5" />
            </button>

            {/* Header info */}
            <div className="text-center space-y-3 mt-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100/80 text-amber-600 shadow-inner">
                <Sparkles className="size-6 animate-pulse" />
              </div>
              <p className="text-[11px] font-black text-amber-600 uppercase tracking-widest">
                {isZh ? "专业版专属功能" : "PRO FEATURE LOCKED"}
              </p>
              <h3 className="text-xl font-black text-slate-950">
                {isZh ? "升级至专业版以解锁" : "Upgrade to Pro to Unlock"}
              </h3>
              <div className="py-2 px-4 rounded-2xl bg-slate-50 border border-slate-100 text-left">
                <h4 className="text-xs font-black text-slate-900">{upgradeTarget.name}</h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 font-medium">{upgradeTarget.desc}</p>
              </div>
            </div>

            {/* Benefits list */}
            <div className="mt-6 space-y-3 text-xs font-bold text-slate-600">
              <p className="text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                {isZh ? "升级可享全套特权" : "Pro Features Include"}
              </p>
              <div className="grid gap-2.5">
                {[
                  isZh ? "解锁多行表格 OCR 与单据识别" : "Unlock Multi-row Table OCR and receipts extraction",
                  isZh ? "无限制发布场景表单与收集名额" : "Unlimited published forms & data storage limits",
                  isZh ? "高级 AI 自定义去重与异常预审" : "Advanced AI duplicate detection & pre-audit tools",
                  isZh ? "配置 Webhook 推送与完整的错误日志记录" : "Full access to Webhook delivery retry logs",
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="rounded-full bg-emerald-100 p-0.5 text-emerald-700 shrink-0">
                      <Check className="size-3" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Checkout Link */}
            <div className="mt-8 flex flex-col gap-3">
              <div className="text-center">
                <span className="text-3xl font-black text-slate-950">$19</span>
                <span className="text-xs font-semibold text-slate-400"> / {isZh ? "月" : "month"}</span>
              </div>
              <Button 
                onClick={() => {
                  setShowUpgradeModal(false);
                  window.location.href = `/${locale}/#pricing`;
                }}
                className="w-full h-11 rounded-2xl bg-slate-950 font-black text-white hover:bg-brand-blue flex items-center justify-center gap-2 tracking-wide shadow-md transition-all duration-300"
              >
                {isZh ? "立即升级，释放 AI 算力" : "Upgrade to Pro"}
                <ArrowRight className="size-4" />
              </Button>
              <p className="text-center text-[10px] text-slate-400 font-medium">
                {isZh ? "支持 Stripe 安全支付，可随时取消订阅" : "Secure payment via Stripe. Cancel subscription anytime."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// Custom Form Skill Configuration Sub-Forms
// ==========================================

interface DeduplicationSettingsFormProps {
  form: FormRecord;
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function DeduplicationSettingsForm({
  form,
  isZh,
  persisted,
  isSaving,
  onSave,
}: DeduplicationSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [uniqueField, setUniqueField] = useState(persisted?.config?.unique_field || "all");
  const [checkFiles, setCheckFiles] = useState(persisted?.config?.check_files !== false);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "数据防重规则" : "Deduplication Rules"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "启用后对填报字段和附件执行查重校验" : "Enable duplicate prevention checks for responses & attachments"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "唯一排重字段" : "Unique Check Field"}</Label>
          <Select value={uniqueField} onValueChange={setUniqueField} disabled={isSaving || !enabled}>
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isZh ? "所有文本字段 (All fields)" : "All fields"}</SelectItem>
              {form.schema_json.fields.map((f) => (
                <SelectItem key={f.key} value={f.key}>
                  {f.label} ({f.key})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <div className="flex items-center justify-between h-9 rounded-xl border border-slate-200 px-3 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-700">{isZh ? "查重附件哈希" : "Check File Hashes"}</span>
            <Switch checked={checkFiles} onCheckedChange={setCheckFiles} disabled={isSaving || !enabled} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, { unique_field: uniqueField, check_files: checkFiles })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface TableOcrSettingsFormProps {
  form: FormRecord;
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function TableOcrSettingsForm({
  form,
  isZh,
  persisted,
  isSaving,
  onSave,
}: TableOcrSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [targetField, setTargetField] = useState(persisted?.config?.target_field || "");

  const targetableFields = form.schema_json.fields;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "表格图片 OCR 回填配置" : "Table OCR Destination"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "解析图片中的明细表格数据并自动回填" : "Extract multi-row tables from files and populate target fields"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <Label className="text-xs font-bold text-slate-700">{isZh ? "回填目标字段" : "Extracted Target Field"}</Label>
        <Select value={targetField} onValueChange={setTargetField} disabled={isSaving || !enabled}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder={isZh ? "选择回填字段..." : "Select a field..."} />
          </SelectTrigger>
          <SelectContent>
            {targetableFields.map((f) => (
              <SelectItem key={f.key} value={f.key}>
                {f.label} ({f.key})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, { target_field: targetField })}
          disabled={isSaving || (enabled && !targetField)}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface AiPreAuditSettingsFormProps {
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function AiPreAuditSettingsForm({
  isZh,
  persisted,
  isSaving,
  onSave,
}: AiPreAuditSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [maxAmount, setMaxAmount] = useState(persisted?.config?.max_amount || 5000);
  const [policyRules, setPolicyRules] = useState(persisted?.config?.policy_rules || "");

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "AI 合规初审配置" : "AI Compliance Rules"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "配置大模型对单据金额和合规要求的判定指南" : "Configure AI validation parameters for budget & guidelines"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "最高金额阀值" : "Max Amount Limit"}</Label>
          <Input 
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value))}
            disabled={isSaving || !enabled}
            className="h-9 text-xs rounded-xl"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "自定义审计合规要求" : "Policy Guidelines Instructions"}</Label>
          <Input 
            value={policyRules}
            onChange={(e) => setPolicyRules(e.target.value)}
            disabled={isSaving || !enabled}
            placeholder={isZh ? "例如：采购事由不得为空，禁止出现个人私用" : "e.g. Purchase justification required, avoid private use keywords"}
            className="h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, { max_amount: maxAmount, policy_rules: policyRules })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface ReportExportSettingsFormProps {
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function ReportExportSettingsForm({
  isZh,
  persisted,
  isSaving,
  onSave,
}: ReportExportSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [fileFormat, setFileFormat] = useState(persisted?.config?.file_format || "excel");
  const [layoutMode, setLayoutMode] = useState(persisted?.config?.layout_mode || "flat");
  const [sortBy, setSortBy] = useState(persisted?.config?.sort_by || "desc");
  const [groupByFields, setGroupByFields] = useState(persisted?.config?.group_by_fields || "");

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "报表自动导出配置" : "Report Export Layout"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "设置数据归档导出的默认格式与排版" : "Configure file formats and layouts for automated exports"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "默认导出格式" : "File Export Format"}</Label>
          <Select value={fileFormat} onValueChange={setFileFormat} disabled={isSaving || !enabled}>
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="excel">Excel (.xlsx)</SelectItem>
              <SelectItem value="csv">CSV (.csv)</SelectItem>
              <SelectItem value="pdf">PDF Report (.pdf)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "布局汇总排版" : "Layout Mode"}</Label>
          <Select 
            value={layoutMode} 
            onValueChange={(val) => {
              setLayoutMode(val);
              if (val !== "grouped") {
                setGroupByFields("");
              }
            }} 
            disabled={isSaving || !enabled}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flat">{isZh ? "扁平列表明细" : "Flat list details"}</SelectItem>
              <SelectItem value="grouped">{isZh ? "按自定义字段分组汇总" : "Grouped by custom fields"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "排序方式" : "Sort By"}</Label>
          <Select value={sortBy} onValueChange={setSortBy} disabled={isSaving || !enabled}>
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">{isZh ? "按自定义字段值降序 (Z-A)" : "Descending (Z-A)"}</SelectItem>
              <SelectItem value="asc">{isZh ? "按自定义字段值升序 (A-Z)" : "Ascending (A-Z)"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {layoutMode === "grouped" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <Label className="text-xs font-bold text-slate-700">{isZh ? "数据排版分组字段" : "Group By Fields"}</Label>
            <Input 
              value={groupByFields}
              onChange={(e) => setGroupByFields(e.target.value)}
              disabled={isSaving || !enabled}
              placeholder={isZh ? "例: department, city (逗号分隔多个字段)" : "e.g. department, city (comma separated)"}
              className="h-9 text-xs rounded-xl"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, { 
            file_format: fileFormat, 
            layout_mode: layoutMode,
            sort_by: sortBy,
            group_by_fields: groupByFields 
          })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface DataCleaningSettingsFormProps {
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function DataCleaningSettingsForm({
  isZh,
  persisted,
  isSaving,
  onSave,
}: DataCleaningSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [trimWhitespace, setTrimWhitespace] = useState(persisted?.config?.trim_whitespace !== false);
  const [normalizeEmail, setNormalizeEmail] = useState(persisted?.config?.normalize_email !== false);
  const [normalizePhone, setNormalizePhone] = useState(persisted?.config?.normalize_phone !== false);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "AI 数据清洗规则" : "AI Data Cleaning Rules"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "提交后自动清理常见脏数据，提升后续统计与自动化质量" : "Clean common dirty values after submission for better analytics and automation"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: isZh ? "去除多余空格" : "Trim whitespace",
            checked: trimWhitespace,
            onChange: setTrimWhitespace,
          },
          {
            label: isZh ? "邮箱转小写" : "Lowercase email",
            checked: normalizeEmail,
            onChange: setNormalizeEmail,
          },
          {
            label: isZh ? "手机号去空格横线" : "Clean phone",
            checked: normalizePhone,
            onChange: setNormalizePhone,
          },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-2">
            <span className="text-xs font-bold text-slate-700">{item.label}</span>
            <Switch
              checked={item.checked}
              onCheckedChange={item.onChange}
              disabled={isSaving || !enabled}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, {
            trim_whitespace: trimWhitespace,
            normalize_email: normalizeEmail,
            normalize_phone: normalizePhone,
          })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface AiInsightsSettingsFormProps {
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function AiInsightsSettingsForm({
  isZh,
  persisted,
  isSaving,
  onSave,
}: AiInsightsSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [summaryStyle, setSummaryStyle] = useState(persisted?.config?.summary_style || "business");
  const [highValueThreshold, setHighValueThreshold] = useState(persisted?.config?.high_value_threshold || 5000);
  const [includeNextActions, setIncludeNextActions] = useState(persisted?.config?.include_next_actions !== false);

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "AI 摘要洞察配置" : "AI Insight Settings"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "对提交数据生成业务摘要、风险提示和下一步动作建议" : "Generate summaries, risk hints and recommended next actions"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "摘要风格" : "Summary Style"}</Label>
          <Select value={summaryStyle} onValueChange={setSummaryStyle} disabled={isSaving || !enabled}>
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business">{isZh ? "业务简报" : "Business brief"}</SelectItem>
              <SelectItem value="sales">{isZh ? "销售线索" : "Sales lead"}</SelectItem>
              <SelectItem value="risk">{isZh ? "风险巡检" : "Risk review"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "高金额阈值" : "High-value threshold"}</Label>
          <Input 
            type="number"
            value={highValueThreshold}
            onChange={(e) => setHighValueThreshold(Number(e.target.value))}
            disabled={isSaving || !enabled}
            className="h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-end">
          <div className="flex h-9 w-full items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-3">
            <span className="text-xs font-bold text-slate-700">{isZh ? "生成行动建议" : "Next actions"}</span>
            <Switch
              checked={includeNextActions}
              onCheckedChange={setIncludeNextActions}
              disabled={isSaving || !enabled}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, {
            summary_style: summaryStyle,
            high_value_threshold: highValueThreshold,
            include_next_actions: includeNextActions,
          })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}

interface EmailNotificationSettingsFormProps {
  isZh: boolean;
  persisted: any;
  isSaving: boolean;
  isReportSkillEnabled: boolean;
  onSave: (enabled: boolean, config: any) => void;
}

function EmailNotificationSettingsForm({
  isZh,
  persisted,
  isSaving,
  isReportSkillEnabled,
  onSave,
}: EmailNotificationSettingsFormProps) {
  const [enabled, setEnabled] = useState(Boolean(persisted?.enabled));
  const [recipientType, setRecipientType] = useState(persisted?.config?.recipient_type || "creator");
  const [customRecipient, setCustomRecipient] = useState(persisted?.config?.custom_recipient || "");
  const [subject, setSubject] = useState(persisted?.config?.subject || (isZh ? "【系统通知】您收到了新的表单填报" : "[Notification] New submission received"));
  const [bodyTemplate, setBodyTemplate] = useState(persisted?.config?.body_template || (isZh ? "您好，您关注的表单已收到新数据，请前往后台查看。" : "Hello, new submission has been captured."));
  const [attachReport, setAttachReport] = useState(Boolean(persisted?.config?.attach_report));

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            {isZh ? "邮件通知发送配置" : "Email Notification Settings"}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isZh ? "设置填报成功后的邮件发送规则与内容模板" : "Configure automated email rules and message templates"}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} disabled={isSaving} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "收件人策略" : "Recipient Strategy"}</Label>
          <Select value={recipientType} onValueChange={setRecipientType} disabled={isSaving || !enabled}>
            <SelectTrigger className="h-9 text-xs rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="creator">{isZh ? "表单发起人" : "Form Owner"}</SelectItem>
              <SelectItem value="fields">{isZh ? "自动匹配填报邮箱" : "Auto Responder Field"}</SelectItem>
              <SelectItem value="custom">{isZh ? "自定义特定收件人" : "Custom Email Address"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {recipientType === "custom" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <Label className="text-xs font-bold text-slate-700">{isZh ? "收件人邮箱地址" : "Recipient Email"}</Label>
            <Input 
              value={customRecipient}
              onChange={(e) => setCustomRecipient(e.target.value)}
              disabled={isSaving || !enabled}
              placeholder="e.g. boss@company.com"
              className="h-9 text-xs rounded-xl"
            />
          </div>
        )}

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "邮件通知主题" : "Email Subject"}</Label>
          <Input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isSaving || !enabled}
            className="h-9 text-xs rounded-xl"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-bold text-slate-700">{isZh ? "邮件内容模板" : "Email Body Template"}</Label>
          <textarea
            value={bodyTemplate}
            onChange={(e) => setBodyTemplate(e.target.value)}
            disabled={isSaving || !enabled}
            rows={3}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-brand-blue font-mono"
          />
        </div>

        <div className="flex items-center justify-between h-11 rounded-xl border border-slate-100 px-4 bg-slate-50/50 sm:col-span-2">
          <div className="flex flex-col">
            <span className={`text-xs font-bold ${!isReportSkillEnabled && enabled ? "text-slate-400" : "text-slate-700"}`}>
              {isZh ? "自动附带导出的报表文件" : "Attach Auto-generated Report"}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {isZh ? "需在上方同时开启「智能报表导出」技能" : "Requires Smart Report Export skill enabled above"}
            </span>
          </div>
          <Switch 
            checked={attachReport && isReportSkillEnabled} 
            onCheckedChange={setAttachReport} 
            disabled={isSaving || !enabled || !isReportSkillEnabled} 
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button 
          size="sm"
          onClick={() => onSave(enabled, { 
            recipient_type: recipientType, 
            custom_recipient: customRecipient,
            subject,
            body_template: bodyTemplate,
            attach_report: attachReport && isReportSkillEnabled
          })}
          disabled={isSaving}
          className="rounded-xl h-8 text-xs font-bold px-4"
        >
          {isSaving ? (isZh ? "保存中..." : "Saving...") : (isZh ? "保存配置" : "Save Configuration")}
        </Button>
      </div>
    </div>
  );
}
