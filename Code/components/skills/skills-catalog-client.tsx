"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  Table2, 
  FileBadge, 
  Download, 
  CheckCircle2, 
  ArrowUpRight, 
  Play, 
  Terminal, 
  Sparkles, 
  Check, 
  X,
  Loader2,
  ArrowLeft,
  Mail,
  WandSparkles,
  BrainCircuit
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface SkillsCatalogClientProps {
  locale: string;
  skillId?: string;
}

export default function SkillsCatalogClient({ locale, skillId }: SkillsCatalogClientProps) {
  const isZh = (locale || "zh").toLowerCase().startsWith("zh");
  
  // Configuration states for sandbox
  const [dedupField, setDedupField] = useState("phone");
  const [dedupCheckFiles, setDedupCheckFiles] = useState(true);

  const [ocrTarget, setOcrTarget] = useState("expenses");

  const [auditMaxAmount, setAuditMaxAmount] = useState(3000);
  const [auditRules, setAuditRules] = useState(isZh ? "禁止私人以及非公务性酒水报销，事由不得为空" : "No alcoholic beverages or private expense items allowed.");

  const [exportFormat, setExportFormat] = useState("excel");
  const [exportLayout, setExportLayout] = useState("grouped");
  const [exportSortBy, setExportSortBy] = useState("desc");
  const [exportGroupBy, setExportGroupBy] = useState("");

  const [emailRecipientType, setEmailRecipientType] = useState("creator");
  const [emailCustomRecipient, setEmailCustomRecipient] = useState("admin@company.com");
  const [emailSubject, setEmailSubject] = useState(isZh ? "【系统通知】您收到了新的表单填报" : "[Notification] New submission received");
  const [emailBodyTemplate, setEmailBodyTemplate] = useState(isZh ? "您好，您关注的表单已收到新数据，请前往后台查看。" : "Hello, new submission has been captured.");
  const [emailAttachReport, setEmailAttachReport] = useState(true);

  const [cleanTrimWhitespace, setCleanTrimWhitespace] = useState(true);
  const [cleanNormalizeEmail, setCleanNormalizeEmail] = useState(true);
  const [cleanNormalizePhone, setCleanNormalizePhone] = useState(true);

  const [insightsStyle, setInsightsStyle] = useState("business");
  const [insightsThreshold, setInsightsThreshold] = useState(5000);
  const [insightsNextActions, setInsightsNextActions] = useState(true);

  // Simulation execution states
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Refs for programmatic console scrolling
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  const skills = [
    {
      code: "deduplication",
      name: isZh ? "数据防重入与去重" : "Deduplication Guard",
      desc: isZh 
        ? "自动对上传文件计算 SHA256 哈希值比对，并在填报数据中核对唯一业务字段，防止发票重复报销、数据多次录入。" 
        : "Extract file hashes and match unique fields across records to block duplicated entries or fraud.",
      icon: ShieldAlert,
      tier: "Free",
      tierColor: "bg-slate-100 text-slate-700 border-slate-200",
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
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      aiPrompt: isZh 
        ? "生成一个设备采购入库单，需要包含图片上传并自动识别表格明细" 
        : "Generate a procurement receipt form with table OCR parsing",
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
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
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
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      aiPrompt: isZh 
        ? "帮我做一个客户满意度调研表，并启用报表导出与智能分析技能" 
        : "Create a customer satisfaction survey with report export and intelligence analysis skill enabled",
      features: isZh 
        ? ["定制化 PDF/Excel 模版渲染", "AI 生成月度/季度趋势分析", "一键批量打包导出"] 
        : ["Custom PDF/Excel templates", "LLM-driven trend summaries", "Bulk export & archive package"]
    },
    {
      code: "email_notification",
      name: isZh ? "邮件通知与联动附件" : "Email Notification & Chaining",
      desc: isZh 
        ? "支持在表单新提交时向表单发起人、自定义邮箱或填报者发送邮件，并可与智能报表技能配合，在邮件中自动打包发送生成的 Excel/PDF 附件。" 
        : "Send automated emails on form submissions. Integrates with smart reports to automatically attach compiled Excel/PDF files.",
      icon: Mail,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      aiPrompt: isZh 
        ? "生成一个设备采购申请表，同时开启邮件通知并自动发送报表给 hr@company.com" 
        : "Create a procurement request form with email notifications and automated report attachments sent to hr@company.com",
      features: isZh 
        ? ["支持收件人路由匹配", "邮件正文动态模板渲染", "智能报表附件自动关联"] 
        : ["Dynamic recipient matching", "Dynamic subject & body rendering", "Automated smart report attachment"]
    },
    {
      code: "data_cleaning",
      name: isZh ? "AI 数据清洗" : "AI Data Cleaning",
      desc: isZh 
        ? "自动对填报的空格、邮箱拼写、手机号码格式等常见脏数据进行清洗与规范化，提升后续统计与对接质量。" 
        : "Clean submitted values automatically. Trims whitespaces, standardizes email domains and formats phone numbers.",
      icon: WandSparkles,
      tier: "Pro",
      tierColor: "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold shadow-sm border-transparent",
      aiPrompt: isZh 
        ? "做一个活动报名表，启用数据清洗，自动把报名邮箱全部转为小写" 
        : "Create an event registration form with AI data cleaning converting emails to lowercase",
      features: isZh 
        ? ["姓名/文本前后空格自动裁剪", "电子邮件自动转小写规整", "手机号横线与无用分隔符清除"] 
        : ["Trailing whitespace trimming", "Email casing standardizer", "Phone divider sanitization"]
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
      aiPrompt: isZh 
        ? "做一个大额采购预算表，并且开启 AI 摘要与洞察，高金额报警线设为 5000 元" 
        : "Create a procurement form with AI insights enabled, setting high value alert to $5000",
      features: isZh 
        ? ["业务简报趋势摘要自动提取", "高值大额预警边界过滤", "生成下一步行动处置建议"] 
        : ["Actionable summaries brief", "Out-of-limit warning markers", "Next action recommendations"]
    }
  ];

  const currentSkill = skillId ? skills.find(s => s.code === skillId) : null;

  // Scroll terminal logs to bottom programmatically inside container only
  useEffect(() => {
    if (isSimulating && consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [simulationLogs, isSimulating]);

  // Run Simulated Workflow Pipeline
  const runSimulation = () => {
    const activeSkill = currentSkill;
    if (!activeSkill) return;
    setIsSimulating(true);
    setSimulationLogs([]);

    const logSteps: string[] = [];

    if (activeSkill.code === "deduplication") {
      const fieldLabel = dedupField === "phone" ? (isZh ? "手机号码" : "Phone") : dedupField === "email" ? (isZh ? "电子邮箱" : "Email") : (isZh ? "所有文本" : "All Fields");
      logSteps.push(
        isZh ? "🚀 [系统] 捕获到用户表单提交请求..." : "🚀 [System] Capturing user form submission request...",
        isZh ? "🔍 [去重引擎] 正在检查文件哈希与特定业务字段..." : "🔍 [Deduplication Engine] Checking physical file hashes and unique fields...",
        isZh ? `📌 [配置读取] 当前规则配置：排重字段 = "${fieldLabel}"，去重附件 = ${dedupCheckFiles ? "开启" : "关闭"}` : `📌 [Config Loaded] Current settings: Unique Field = "${fieldLabel}", Check File Hashes = ${dedupCheckFiles ? "ON" : "OFF"}`
      );

      if (dedupCheckFiles) {
        logSteps.push(
          isZh ? "📁 [附件比对] 计算文件 'invoice_9082.pdf' 的 SHA256 哈希值..." : "📁 [Attachment Hash] Computing SHA256 of 'invoice_9082.pdf'...",
          isZh ? "⚠️ [去重拦截] 发现冲突！哈希值 '3fa81b89cc...' 已存在于历史数据库记录中。" : "⚠️ [Intercepted] Conflict found! File hash '3fa81b89cc...' already exists in submission history.",
          isZh ? "🛑 [系统] 拦截数据成功！自动终止推送，流程熔断 [STATUS: DEDUPLICATION_BLOCKED]" : "🛑 [System] Submission blocked! Workflow pipeline intercepted [STATUS: DEDUPLICATION_BLOCKED]"
        );
      } else {
        logSteps.push(
          isZh ? `🔑 [唯一性校验] 检查字段 "${fieldLabel}" 是否重复...` : `🔑 [Uniqueness Check] Verifying if field "${fieldLabel}" already exists...`,
          isZh ? `⚠️ [去重拦截] 检测到相同的 "${fieldLabel}" 数据在以往记录中已填报。` : `⚠️ [Intercepted] Duplicate value detected in previous records for field "${fieldLabel}".`,
          isZh ? "🛑 [系统] 拦截数据成功！流程终止 [STATUS: DEDUPLICATION_BLOCKED]" : "🛑 [System] Submission blocked! Workflow pipeline intercepted [STATUS: DEDUPLICATION_BLOCKED]"
        );
      }
    } else if (activeSkill.code === "table_ocr") {
      const fieldLabel = ocrTarget === "expenses" ? (isZh ? "差旅报销明细表" : "Travel Expenses Table") : ocrTarget === "products" ? (isZh ? "商品采购清单" : "Products list") : (isZh ? "设备网格" : "Equipments grid");
      logSteps.push(
        isZh ? "🚀 [系统] 监听到用户上传了表格附件 'bill_grid_scan.png'..." : "🚀 [System] Captured image attachment 'bill_grid_scan.png'...",
        isZh ? `📌 [配置读取] 目标回填字段 = "${fieldLabel}"` : `📌 [Config Loaded] Extracted target field = "${fieldLabel}"`,
        isZh ? "⚡ [OCR 解析] 正在向云端 OCR 服务发送表格网格分割请求..." : "⚡ [OCR Engine] Sending grid segmentation request to Cloud Table OCR...",
        isZh ? "🤖 [LLM 语义识别] 对齐表头：'Item' -> '品名', 'Price' -> '单价', 'Qty' -> '数量'" : "🤖 [LLM Alignment] Mapping table columns: 'Item' -> 'Name', 'Price' -> 'Price', 'Qty' -> 'Quantity'",
        isZh ? "📝 [数据提取] 识别出 3 行明细项目，准备回填：" : "📝 [Data Parsed] Extracted 3 data rows, pre-filling target grid:",
        isZh ? "  ↳ 明细1: MacBook Pro M3 | 数量: 1 | 单价: 16,999 元" : "  ↳ Row 1: MacBook Pro M3 | Qty: 1 | Price: $2,499",
        isZh ? "  ↳ 明细2: 显示器 27寸 | 数量: 2 | 单价: 1,899 元" : "  ↳ Row 2: 27-inch Monitor | Qty: 2 | Price: $299",
        isZh ? "  ↳ 明细3: 人体工学办公椅 | 数量: 1 | 单价: 999 元" : "  ↳ Row 3: Ergonomic Chair | Qty: 1 | Price: $149",
        isZh ? `✅ [系统] 数据成功映射并回填到子表格 "${fieldLabel}" 中。` : `✅ [System] Grid records successfully mapped & backfilled into sub-table "${fieldLabel}".`
      );
    } else if (activeSkill.code === "ai_pre_audit") {
      logSteps.push(
        isZh ? "🚀 [系统] 用户表单已提交。已检测到启用了 AI 智审代理..." : "🚀 [System] Submission captured. AI Compliance Pre-audit Agent activated...",
        isZh ? `📌 [配置读取] 金额限额 = ${auditMaxAmount} 元，自定义规则 = "${auditRules}"` : `📌 [Config Loaded] Max budget limit = $${auditMaxAmount}, Policy prompt = "${auditRules}"`,
        isZh ? "🧠 [AI 规则扫描] 大模型正在审阅填报数据... 提交人: '李经理' | 申报金额: 4,500 元" : "🧠 [AI Compliance Scan] LLM analyzing data... Applicant: 'Manager Li' | Requested Amount: $4,500"
      );

      const excessAmount = 4500 > auditMaxAmount;
      if (excessAmount) {
        logSteps.push(
          isZh ? `❌ [AI 规则不合规] 申报金额 4,500 元超出了设定的最高限额 ${auditMaxAmount} 元！` : `❌ [Audit Violation] Requested amount $4,500 exceeds the maximum limit of $${auditMaxAmount}!`
        );
      } else {
        logSteps.push(
          isZh ? `✅ [AI 限额合规] 申报金额 4,500 元未超出设定的最高限额 ${auditMaxAmount} 元。` : `✅ [Audit Budget Passed] Requested amount $4,500 is within the allowed limit of $${auditMaxAmount}.`
        );
      }

      const hasKeywords = /酒水|聚餐|私人/i.test(auditRules);
      if (hasKeywords) {
        logSteps.push(
          isZh ? "⚠️ [AI 语义漏洞] 发现警告：填报附带事由中提到了 '团建聚餐与特定赠品酒水'，与审计规则冲突！" : "⚠️ [Audit Warning] Semantic warning: Submission justification mentioned 'Team dinner with alcohol beverages', which violates custom policy rules.",
          isZh ? "📝 [系统] AI 已自动在表单后台生成「异常核对卡片」，标记状态为 [AUDIT_WARNING]" : "📝 [System] AI Audit logs compiled. Form marked in exception center as [AUDIT_WARNING]"
        );
      } else {
        logSteps.push(
          isZh ? "✅ [AI 语义合规] 没有匹配到违规政策指示词，初审通过。" : "✅ [Audit Policy Passed] No policy violations detected in justification text.",
          isZh ? "📝 [系统] 智审流水线执行完毕，审批通过 [STATUS: AUDIT_PASSED]" : "📝 [System] Pre-audit completed. Form approved [STATUS: AUDIT_PASSED]"
        );
      }
    } else if (activeSkill.code === "report_export") {
      const sortLabel = exportSortBy === "asc" ? (isZh ? "按自定义字段值升序 (A-Z)" : "ascending (A-Z)") : (isZh ? "按自定义字段值降序 (Z-A)" : "descending (Z-A)");
      const groupLabel = exportLayout === "grouped" ? (exportGroupBy || (isZh ? "未设定分组字段" : "No fields set")) : (isZh ? "明细扁平列表模式" : "Flat Detail Mode");
      logSteps.push(
        isZh ? "🚀 [系统] 触发了表单定时自动汇总与分析流程..." : "🚀 [System] Triggering scheduled data summary and analytics workflow...",
        isZh ? `📌 [配置读取] 默认格式 = ${exportFormat.toUpperCase()}，排版模式 = ${exportLayout === "grouped" ? "按自定义字段分组汇总" : "扁平列表明细"}` : `📌 [Config Loaded] Export format = ${exportFormat.toUpperCase()}, Layout mode = ${exportLayout === "grouped" ? "Grouped summaries" : "Flat details"}`,
        isZh ? `📌 [高级配置] 排序规则 = ${sortLabel}，分组依赖字段 = "${groupLabel}"` : `📌 [Advanced Settings] Sorting = ${sortLabel}, Group fields = "${groupLabel}"`,
        isZh ? "📊 [数据归档] 正在读取满意度填报数据并按所设字段排序整理..." : "📊 [Data Compilation] Fetching records and sorting by custom fields...",
        exportLayout === "grouped" 
          ? (isZh ? `🗂️ [分组处理] 正在基于自定义字段 "${groupLabel}" 拆分子模块网格布局...` : `🗂️ [Grouping] Splitting dashboard layouts based on custom fields "${groupLabel}"...`)
          : (isZh ? "🗂️ [明细整理] 开启扁平单表，跳过子模块分组..." : "🗂️ [Detailing] Preparing flat database rows, skipping grouping..."),
        isZh ? "🤖 [AI 数据分析] 启动趋势分析 Agent，根据处理后数据生成全局摘要报告..." : "🤖 [AI Analytics] Spawning LLM diagnostic agent to analyze structured trend...",
        isZh ? "📝 [AI 摘要生成] 'NPS 推荐指数表现优良，其中指定分组的数据离散度已记录...'" : "📝 [AI Summary] 'NPS score performs stable, with discrete group indicators compiled...'",
        isZh ? `📥 [导出成功] 文件生成成功！已为您打包归档 download_${Date.now()}.${exportFormat === "pdf" ? "pdf" : "xlsx"}` : `📥 [Export Complete] Document compiled! File packaged as download_${Date.now()}.${exportFormat === "pdf" ? "pdf" : "xlsx"}`
      );
    } else if (activeSkill.code === "email_notification") {
      const typeLabel = emailRecipientType === "creator" 
        ? (isZh ? "表单发起人邮箱" : "Form Owner Email") 
        : emailRecipientType === "fields" 
          ? (isZh ? "自动匹配填报邮箱" : "Responder Email Field") 
          : (isZh ? `自定义收件人邮箱 (${emailCustomRecipient})` : `Custom Address (${emailCustomRecipient})`);

      logSteps.push(
        isZh ? "🚀 [邮件通知] 监听到新的表单提交事件，开始投递流程..." : "🚀 [Email] Form submission captured, dispatching notifications...",
        isZh ? `📌 [配置读取] 收件人策略 = "${typeLabel}"，邮件主题 = "${emailSubject}"` : `📌 [Config Loaded] Recipient = "${typeLabel}", Subject = "${emailSubject}"`,
        isZh ? "📝 [模板解析] 正在渲染邮件正文插值数据..." : "📝 [Template Engine] Rendering email body with context variables..."
      );

      if (emailAttachReport) {
        logSteps.push(
          isZh ? "🔍 [智能关联检测] 发现表单已开启「数据报表自动导出」技能，开始抓取附件..." : "🔍 [Attachment Scanner] Smart report export enabled. Fetching reports...",
          isZh ? "📎 [附件载入] 自动装载已编译文件 'report_dashboard.xlsx' 并挂载为附件..." : "📎 [Attachment Linked] Packing compiled 'report_dashboard.xlsx' as email attachment...",
          isZh ? `📧 [网络投递] 正在通过 SMTP 安全网关投递邮件至 ${emailRecipientType === "custom" ? emailCustomRecipient : "creator@example.com"}...` : `📧 [Delivery] Dispatching message payload via SMTP secure connection to ${emailRecipientType === "custom" ? emailCustomRecipient : "creator@example.com"}...`,
          isZh ? "✅ [发送成功] 投递成功！已连同导出的报表附件一并发送至目标邮箱。 [STATUS: EMAIL_SENT_WITH_ATTACHMENT]" : "✅ [Delivery Complete] Message successfully sent with attachments! [STATUS: EMAIL_SENT_WITH_ATTACHMENT]"
        );
      } else {
        logSteps.push(
          isZh ? `📧 [网络投递] 正在投递纯文本邮件通知至 ${emailRecipientType === "custom" ? emailCustomRecipient : "creator@example.com"}...` : `📧 [Delivery] Dispatching flat text message via SMTP to ${emailRecipientType === "custom" ? emailCustomRecipient : "creator@example.com"}...`,
          isZh ? "✅ [发送成功] 投递成功！通知邮件已送达。 [STATUS: EMAIL_SENT]" : "✅ [Delivery Complete] Message successfully delivered. [STATUS: EMAIL_SENT]"
        );
      }
    } else if (activeSkill.code === "data_cleaning") {
      logSteps.push(
        isZh ? "🚀 [AI清洗] 捕获到表单提交，准备运行数据规范化链路..." : "🚀 [AI Cleaning] Captured form submission payload, executing rules...",
        isZh ? `📌 [配置读取] 去除空格 = ${cleanTrimWhitespace ? "开启" : "关闭"} | 邮箱规范 = ${cleanNormalizeEmail ? "开启" : "关闭"} | 手机规整 = ${cleanNormalizePhone ? "开启" : "关闭"}` : `📌 [Config Loaded] Trim space = ${cleanTrimWhitespace ? "ON" : "OFF"} | Lowercase email = ${cleanNormalizeEmail ? "ON" : "OFF"} | Clean phone = ${cleanNormalizePhone ? "ON" : "OFF"}`,
        isZh ? "🧹 [输入处理] 正在对各输入值进行物理清洗..." : "🧹 [Sanitization] Processing fields payloads against active rules..."
      );
      
      if (cleanTrimWhitespace) {
        logSteps.push(
          isZh ? "  ↳ [空格过滤] 原始: \" 张 三   \" ➔ 清洗后: \"张 三\"" : "  ↳ [Trim Space] \" John Doe   \" ➔ \"John Doe\""
        );
      }
      if (cleanNormalizeEmail) {
        logSteps.push(
          isZh ? "  ↳ [邮箱规范] 原始: \"ALICE@Domain.Com\" ➔ 清洗后: \"alice@domain.com\"" : "  ↳ [Email Normalizer] \"ALICE@Domain.Com\" ➔ \"alice@domain.com\""
        );
      }
      if (cleanNormalizePhone) {
        logSteps.push(
          isZh ? "  ↳ [手机规整] 原始: \"138 - 1234 - 5678\" ➔ 清洗后: \"13812345678\"" : "  ↳ [Phone Clean] \"138 - 1234 - 5678\" ➔ \"13812345678\""
        );
      }

      logSteps.push(
        isZh ? "✅ [清洗完毕] 数据规格已完全统一，已更新 answers_json 记录。 [STATUS: CLEANING_COMPLETE]" : "✅ [Sanitization Passed] Payloads standardized and written back. [STATUS: CLEANING_COMPLETE]"
      );
    } else if (activeSkill.code === "ai_insights") {
      const styleLabel = insightsStyle === "business" 
        ? (isZh ? "业务简报" : "Business Brief") 
        : insightsStyle === "sales" 
          ? (isZh ? "销售线索" : "Sales Lead") 
          : (isZh ? "风险巡检" : "Risk Review");

      logSteps.push(
        isZh ? "🚀 [AI洞察] 监听到提交数据，激活 LLM 上下文趋势分析器..." : "🚀 [AI Insights] Submission captured. Spawning LLM analysis agent...",
        isZh ? `📌 [配置读取] 摘要风格 = "${styleLabel}"，高金额阈值 = ${insightsThreshold} 元，附带建议 = ${insightsNextActions ? "开启" : "关闭"}` : `📌 [Config Loaded] Summary Style = "${styleLabel}", Alert Threshold = $${insightsThreshold}, Action items = ${insightsNextActions ? "ON" : "OFF"}`,
        isZh ? "🧠 [模型计算] LLM 正在审阅申报细节... 申报总额: 15,000 元" : "🧠 [LLM reasoning] Analyzing payload... Declared total amount: $15,000"
      );

      if (15000 > insightsThreshold) {
        logSteps.push(
          isZh ? `⚠️ [阈值警报] 金额 15,000 元已超过高值监控线 ${insightsThreshold} 元！标记警报为 [HIGH_VALUE_ALERT]` : `⚠️ [High Value Alert] Declared $15,000 exceeds threshold limit of $${insightsThreshold}! Flagged [HIGH_VALUE_ALERT]`
        );
      }

      logSteps.push(
        isZh ? `📊 [摘要生成] 生成风格 = "${styleLabel}" 摘要：'项目申报金额偏高，主要项目涵盖硬件与软件采购。'` : `📊 [Summary Compiled] Mode = "${styleLabel}" brief: 'Procurement cost scale is relatively high, covering hardware/software setups.'`
      );

      if (insightsNextActions) {
        logSteps.push(
          isZh ? "💡 [建议生成] 下一步建议：'建议预算审查员在 24 小时内介入做合规尽职核算。'" : "💡 [Next Actions] AI recommendation: 'Recommend budget officer intervene and double check vendor quotations.'"
        );
      }

      logSteps.push(
        isZh ? "✅ [推理完成] 摘要、风险与建议已挂载至表单详细记录中。 [STATUS: INSIGHTS_GENERATED]" : "✅ [Analysis Complete] Insights reports written back. [STATUS: INSIGHTS_GENERATED]"
      );
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < logSteps.length) {
        setSimulationLogs(prev => [...prev, logSteps[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 450);
  };

  const getAppliedSkillConfig = () => {
    if (!currentSkill) return "{}";
    if (currentSkill.code === "deduplication") {
      return JSON.stringify({ unique_field: dedupField, check_files: dedupCheckFiles });
    } else if (currentSkill.code === "table_ocr") {
      return JSON.stringify({ target_field: ocrTarget });
    } else if (currentSkill.code === "ai_pre_audit") {
      return JSON.stringify({ max_amount: auditMaxAmount, policy_rules: auditRules });
    } else if (currentSkill.code === "report_export") {
      return JSON.stringify({ 
        file_format: exportFormat, 
        layout_mode: exportLayout,
        sort_by: exportSortBy,
        group_by_fields: exportLayout === "grouped" ? exportGroupBy : ""
      });
    } else if (currentSkill.code === "email_notification") {
      return JSON.stringify({
        recipient_type: emailRecipientType,
        custom_recipient: emailCustomRecipient,
        subject: emailSubject,
        body_template: emailBodyTemplate,
        attach_report: emailAttachReport
      });
    } else if (currentSkill.code === "data_cleaning") {
      return JSON.stringify({
        trim_whitespace: cleanTrimWhitespace,
        normalize_email: cleanNormalizeEmail,
        normalize_phone: cleanNormalizePhone
      });
    } else if (currentSkill.code === "ai_insights") {
      return JSON.stringify({
        summary_style: insightsStyle,
        high_value_threshold: insightsThreshold,
        include_next_actions: insightsNextActions
      });
    }
    return "{}";
  };

  // If skillId is passed, render the dedicated detailed landing page
  if (skillId) {
    if (!currentSkill) {
      return (
        <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
          <p>{isZh ? "未找到该技能详情" : "Skill details not found."}</p>
          <Link href={`/${locale}/skills-catalog`} className="mt-4 text-xs font-bold text-blue-400 underline">
            {isZh ? "返回技能仓库" : "Back to Skill Catalog"}
          </Link>
        </div>
      );
    }

    const Icon = currentSkill.icon;

    return (
      <div className="w-full min-h-screen bg-slate-950 text-white pb-20 pt-28">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          
          {/* Breadcrumb / Back Link */}
          <Link 
            href={`/${locale}/skills-catalog`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            {isZh ? "返回技能仓库" : "Back to Skills Catalog"}
          </Link>

          {/* Skill Title Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12 border-b border-slate-900 pb-8">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                  <Icon className="size-7" />
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${currentSkill.tierColor}`}>
                  {currentSkill.tier}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {currentSkill.name}
              </h1>
              
              <p className="text-base text-slate-400 leading-relaxed max-w-3xl">
                {currentSkill.desc}
              </p>
            </div>

            <div className="lg:col-span-4 bg-slate-900/40 border border-slate-900 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                {isZh ? "主要能力与特色" : "Key Capabilities"}
              </h3>
              <div className="space-y-3">
                {currentSkill.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Full-page Configuration Sandbox Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Config Panel */}
            <div className="lg:col-span-5 bg-slate-900/30 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-blue-400 flex items-center gap-2">
                  <Sparkles className="size-4" />
                  {isZh ? "参数配置沙盒" : "Parameters Sandbox"}
                </h3>

                {/* Deduplication Forms */}
                {currentSkill.code === "deduplication" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "唯一性业务排重字段" : "Unique Check Field"}</Label>
                      <Select value={dedupField} onValueChange={setDedupField}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="phone">{isZh ? "手机号码 (Phone)" : "Phone"}</SelectItem>
                          <SelectItem value="email">{isZh ? "电子邮箱 (Email)" : "Email"}</SelectItem>
                          <SelectItem value="serial">{isZh ? "发票号/单据流水号 (Serial Key)" : "Serial Key"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <span className="text-xs font-bold text-slate-300">{isZh ? "物理附件哈希防重校验" : "Check File Hashes"}</span>
                      <Switch checked={dedupCheckFiles} onCheckedChange={setDedupCheckFiles} />
                    </div>
                  </div>
                )}

                {/* Table OCR Forms */}
                {currentSkill.code === "table_ocr" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "自动回填目标子表格" : "Target Form Grid Field"}</Label>
                      <Select value={ocrTarget} onValueChange={setOcrTarget}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-855 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="expenses">{isZh ? "差旅报销明细表" : "Travel Expenses Table"}</SelectItem>
                          <SelectItem value="products">{isZh ? "物资设备明细单" : "Products list"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {isZh ? "💡 解析上传的采购明细、物资清单图片，对齐列语义并批量导入表单子表中。" : "💡 Cloud parsing will extract tabular data grids and map columns to populate this sub-table."}
                    </p>
                  </div>
                )}

                {/* AI Pre-audit Forms */}
                {currentSkill.code === "ai_pre_audit" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "最高金额限制 (元)" : "Max Budget Limit (CNY)"}</Label>
                      <Input 
                        type="number"
                        value={auditMaxAmount}
                        onChange={(e) => setAuditMaxAmount(Number(e.target.value))}
                        className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "自定义审计合规规则指南" : "Policy Guidelines Instructions"}</Label>
                      <Input 
                        value={auditRules}
                        onChange={(e) => setAuditRules(e.target.value)}
                        placeholder={isZh ? "例如：采购事由不得为空，禁止出现个人私用" : "e.g. Justification required, no personal use items."}
                        className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                      />
                    </div>
                  </div>
                )}

                {/* Report Export Forms */}
                {currentSkill.code === "report_export" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "默认归档导出文件格式" : "File Export Format"}</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                          <SelectItem value="csv">CSV (.csv)</SelectItem>
                          <SelectItem value="pdf">PDF Report (.pdf)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "汇总排版渲染模式" : "Layout Summary Mode"}</Label>
                      <Select 
                        value={exportLayout} 
                        onValueChange={(val) => {
                          setExportLayout(val);
                          if (val !== "grouped") {
                            setExportGroupBy("");
                          }
                        }}
                      >
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="flat">{isZh ? "扁平列表明细" : "Flat details list"}</SelectItem>
                          <SelectItem value="grouped">{isZh ? "按自定义字段分组汇总" : "Grouped summaries by custom fields"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "排序方式" : "Sort By"}</Label>
                      <Select value={exportSortBy} onValueChange={setExportSortBy}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="desc">{isZh ? "按自定义字段值降序 (Z-A)" : "Descending (Z-A)"}</SelectItem>
                          <SelectItem value="asc">{isZh ? "按自定义字段值升序 (A-Z)" : "Ascending (A-Z)"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {exportLayout === "grouped" && (
                      <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Label className="text-xs font-bold text-slate-300">{isZh ? "排版分组依赖字段 (Key)" : "Group By Field Keys"}</Label>
                        <Input 
                          value={exportGroupBy}
                          onChange={(e) => setExportGroupBy(e.target.value)}
                          placeholder={isZh ? "例: department, region (逗号分隔)" : "e.g. department, region"}
                          className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Email Notification Forms */}
                {currentSkill.code === "email_notification" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "收件人策略" : "Recipient Strategy"}</Label>
                      <Select value={emailRecipientType} onValueChange={setEmailRecipientType}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="creator">{isZh ? "表单发起人 (Form Owner)" : "Form Owner"}</SelectItem>
                          <SelectItem value="fields">{isZh ? "自动匹配填报邮箱 (Responder)" : "Auto Responder Field"}</SelectItem>
                          <SelectItem value="custom">{isZh ? "自定义特定收件人 (Custom Email)" : "Custom Email Address"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {emailRecipientType === "custom" && (
                      <div className="space-y-2 animate-in fade-in duration-200">
                        <Label className="text-xs font-bold text-slate-300">{isZh ? "收件人邮箱地址" : "Recipient Address"}</Label>
                        <Input 
                          value={emailCustomRecipient}
                          onChange={(e) => setEmailCustomRecipient(e.target.value)}
                          placeholder="e.g. boss@company.com"
                          className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "邮件通知主题" : "Email Subject"}</Label>
                      <Input 
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "邮件内容模板" : "Email Body Template"}</Label>
                      <textarea
                        value={emailBodyTemplate}
                        onChange={(e) => setEmailBodyTemplate(e.target.value)}
                        rows={3}
                        className="w-full text-xs p-3 rounded-xl border border-slate-850 bg-slate-950 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>

                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{isZh ? "自动附带导出的报表文件" : "Attach Auto-generated Report"}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{isZh ? "需同时启用「智能报表导出」技能" : "Requires Smart Report Export enabled"}</span>
                      </div>
                      <Switch checked={emailAttachReport} onCheckedChange={setEmailAttachReport} />
                    </div>
                  </div>
                )}

                {/* Data Cleaning Forms */}
                {currentSkill.code === "data_cleaning" && (
                  <div className="space-y-5 pt-1">
                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <span className="text-xs font-bold text-slate-300">{isZh ? "自动去除前后空格" : "Trim Whitespace"}</span>
                      <Switch checked={cleanTrimWhitespace} onCheckedChange={setCleanTrimWhitespace} />
                    </div>
                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <span className="text-xs font-bold text-slate-300">{isZh ? "电子邮件小写规整" : "Lowercase Email Addresses"}</span>
                      <Switch checked={cleanNormalizeEmail} onCheckedChange={setCleanNormalizeEmail} />
                    </div>
                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <span className="text-xs font-bold text-slate-300">{isZh ? "手机号码格式去横杠/空格" : "Clean Phone Formats"}</span>
                      <Switch checked={cleanNormalizePhone} onCheckedChange={setCleanNormalizePhone} />
                    </div>
                  </div>
                )}

                {/* AI Insights Forms */}
                {currentSkill.code === "ai_insights" && (
                  <div className="space-y-5 pt-1">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "摘要风格" : "Summary Style"}</Label>
                      <Select value={insightsStyle} onValueChange={setInsightsStyle}>
                        <SelectTrigger className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-slate-800 bg-slate-950 text-white">
                          <SelectItem value="business">{isZh ? "业务简报 (Business)" : "Business brief"}</SelectItem>
                          <SelectItem value="sales">{isZh ? "销售线索 (Sales)" : "Sales lead"}</SelectItem>
                          <SelectItem value="risk">{isZh ? "风险巡检 (Risk)" : "Risk review"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-300">{isZh ? "高金额阈值设定" : "High-value Threshold"}</Label>
                      <Input 
                        type="number"
                        value={insightsThreshold}
                        onChange={(e) => setInsightsThreshold(Number(e.target.value))}
                        className="h-10 text-xs rounded-xl border-slate-850 bg-slate-950 text-slate-200"
                      />
                    </div>

                    <div className="flex items-center justify-between h-11 rounded-xl border border-slate-850 px-4 bg-slate-950/50">
                      <span className="text-xs font-bold text-slate-300">{isZh ? "智能分析生成行动建议" : "Generate Recommended Actions"}</span>
                      <Switch checked={insightsNextActions} onCheckedChange={setInsightsNextActions} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-6 border-t border-slate-900">
                <Button 
                  onClick={() => {
                    const promptText = currentSkill.aiPrompt;
                    const configString = getAppliedSkillConfig();
                    window.location.href = `/${locale}/forms/new?prompt=${encodeURIComponent(promptText)}&skill=${currentSkill.code}&skill_config=${encodeURIComponent(configString)}`;
                  }}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-650 to-purple-650 font-extrabold text-sm text-white hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="size-4" />
                  {isZh ? "套用此配置并生成表单" : "Apply Config & Generate Form"}
                </Button>
              </div>
            </div>

            {/* Right Column: Execution Terminal Simulation */}
            <div className="lg:col-span-7 bg-black rounded-[2rem] border border-slate-900 p-6 flex flex-col justify-between font-mono text-xs overflow-hidden relative min-h-[460px]">
              <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-bold text-slate-600 tracking-wider">
                <Terminal className="size-3.5" />
                SIMULATOR CONSOLE
              </div>

              {/* Console stdout view */}
              <div 
                ref={consoleContainerRef}
                className="flex-1 overflow-y-auto space-y-3.5 max-h-[380px] pr-2 select-text scrollbar-thin scrollbar-thumb-slate-800 pt-4"
              >
                {simulationLogs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center py-20">
                    <Play className="size-10 text-slate-800 animate-pulse mb-3" />
                    <p className="font-semibold text-slate-500">{isZh ? "等待触发仿真..." : "Waiting for simulation trigger..."}</p>
                    <p className="text-[11px] text-slate-700 mt-2 max-w-sm">
                      {isZh ? "调整左侧配置后，点击右下角「启动仿真运行」按钮即可启动虚拟流水线测试。" : "Adjust settings on the left and click 'Run Simulation' to observe output."}
                    </p>
                  </div>
                ) : (
                  <>
                    {simulationLogs.map((log, idx) => {
                      let color = "text-slate-300";
                      if (log.includes("❌") || log.includes("🛑") || log.includes("⚠️")) {
                        color = "text-amber-400";
                      } else if (log.includes("🚀") || log.includes("✅")) {
                        color = "text-emerald-400 font-bold";
                      } else if (log.includes("📌")) {
                        color = "text-blue-400";
                      }
                      return (
                        <div key={idx} className={`leading-relaxed break-all ${color}`}>
                          {log}
                        </div>
                      );
                    })}
                    {isSimulating && (
                      <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                        <Loader2 className="size-3 animate-spin text-blue-500" />
                        <span>Executing pipeline step...</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Console controller footer */}
              <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="size-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{isZh ? "仿真引擎已就绪" : "Sim-engine Ready"}</span>
                </div>
                
                <Button
                  disabled={isSimulating}
                  onClick={runSimulation}
                  className="h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs border border-slate-850 gap-2 px-5"
                >
                  <Play className="size-3.5 text-emerald-400" />
                  {isSimulating ? (isZh ? "模拟运行中..." : "Running...") : (isZh ? "启动仿真运行" : "Run Simulation")}
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // If no skillId, render the list catalog index page
  return (
    <div className="w-full min-h-screen bg-slate-50 py-16">
      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-slate-900">
        
        {/* Header Block */}
        <div className="rounded-[1.6rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <p className="text-[11px] font-black text-brand-blue uppercase tracking-widest">{isZh ? "技能中心" : "Skill Catalog"}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
            {isZh ? "AI 智能技能仓库" : "AI Smart Skill Catalog"}
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500 max-w-3xl leading-relaxed">
            {isZh 
              ? "欢迎来到扩展技能中心。这里汇总了平台所有的 AI 与自动化运行技能。点击技能卡片可打开配置沙盒，体验一键仿真调试，满意后直接套用生成表单场景。" 
              : "Welcome to the Skill Catalog. Click any skill card to configure settings, try the live interactive simulation sandbox, and deploy it to your form scene with one click."}
          </p>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div 
                key={skill.code}
                className="flex flex-col justify-between rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-brand-blue/30 transition-all duration-300 relative group overflow-hidden cursor-pointer"
              >
                {/* Decorative background glow */}
                <div className="absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full bg-slate-50 blur-xl group-hover:bg-brand-blue/5 transition duration-300" />

                <div>
                  {/* Header item */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3.5 rounded-2xl bg-brand-blue/5 text-brand-blue shrink-0">
                      <Icon className="size-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {isZh ? "包含交互沙盒" : "Sandbox Included"}
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${skill.tierColor}`}>
                        {skill.tier}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="mt-5 text-lg font-extrabold text-slate-950 group-hover:text-brand-blue transition-colors">{skill.name}</h3>
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

                <div className="mt-8 border-t border-slate-100 pt-4">
                  <Link
                    href={`/${locale}/skills-catalog/${skill.code}`}
                    className="w-full inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-xs font-black text-white hover:bg-brand-blue gap-1 transition-all"
                  >
                    {isZh ? "配置并仿真运行" : "Configure & Simulate"}
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
