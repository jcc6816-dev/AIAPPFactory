"use client";

import { useState } from "react";
import Link from "next/link";
import { getHomepageSceneTemplates, type SceneTemplate } from "@/services/form-templates";

type ThemeKey = "minimal" | "business" | "dark" | "brutalism" | "retro";

interface TemplateVisualPreviewProps {
  template: SceneTemplate;
  activeTheme?: ThemeKey;
  fieldsLabel?: string;
  locale?: string;
}

export function TemplateVisualPreview({ template, activeTheme = "minimal", fieldsLabel, locale }: TemplateVisualPreviewProps) {
  const isZh = locale?.toLowerCase().startsWith("zh");
  const hoverOverlay = (
    <div className="card-hover-overlay">
      <div className="hover-icon-circle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L3.5 14h6.5l-1.5 8 8.5-12h-6.5L12 2z" />
        </svg>
      </div>
      <div className="hover-title">
        {isZh ? "查看模板详情" : "Explore Template"}
      </div>
      <div className="hover-subtitle">
        {isZh ? "查看适用场景与字段大纲" : "Explore fields & webhook workflows"}
      </div>
    </div>
  );

  switch (template.id) {
    case "lead-capture":
      return (
        <div className="card-visual-area" id="visual-lead-capture" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div>
                <h3 className="preview-card-title">{isZh ? "获取早期访问" : "Get Early Access"}</h3>
                <p className="preview-card-subtitle">{isZh ? "加入沙盒计划并领取 $100 额度" : "Join early access & claim $100 credits"}</p>
              </div>
              <span style={{ fontSize: "6.5px", background: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)", color: "#fff", padding: "2px 5px", borderRadius: "100px", fontWeight: "900", transform: "scale(0.85)", whiteSpace: "nowrap" }}>
                ★ $100
              </span>
            </div>

            <div className="preview-card-input-group" style={{ marginTop: "4px" }}>
              <span className="preview-card-label">{isZh ? "姓名" : "Name"}</span>
              <div className="preview-card-input">Mike Chen</div>
            </div>

            <div className="preview-card-input-group">
              <span className="preview-card-label">{isZh ? "邮箱地址" : "Email Address"}</span>
              <div className="preview-card-input">mike.chen@gmail.com</div>
            </div>

            <button className="preview-card-button" style={{ marginTop: "4px" }}>
              {isZh ? "立即加入沙盒" : "Join Sandbox"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "event-registration":
      return (
        <div className="card-visual-area" id="visual-event-reg" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div>
              <h3 className="preview-card-title">{isZh ? "确认入场信息" : "Confirm Admission"}</h3>
              <p className="preview-card-subtitle">{isZh ? "AI 全球峰会 2026 VIP 门票" : "AI Global Summit 2026 VIP Pass"}</p>
            </div>

            <div className="preview-card-input-group" style={{ gap: "4px", marginTop: "4px" }}>
              <span className="preview-card-label">{isZh ? "选择票种" : "Select Pass Type"}</span>
              <div className="preview-option-pill active">
                <span>🎟️ VIP Ticket - AI Summit</span>
                <span style={{ fontSize: "7px" }}>✓</span>
              </div>
              <div className="preview-option-pill">
                <span>💬 General Admission</span>
                <span style={{ fontSize: "7px", opacity: 0 }}>✓</span>
              </div>
            </div>

            <button className="preview-card-button" style={{ marginTop: "4px" }}>
              {isZh ? "锁定入场席位" : "Register Seat"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "satisfaction-survey":
      return (
        <div className="card-visual-area" id="visual-satisfaction" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div>
              <h3 className="preview-card-title">{isZh ? "客户体验调研" : "Customer Survey"}</h3>
              <p className="preview-card-subtitle">{isZh ? "您的反馈对我们非常重要" : "Your feedback makes us better"}</p>
            </div>

            <div className="preview-card-input-group" style={{ gap: "4px", marginTop: "4px" }}>
              <span className="preview-card-label">{isZh ? "总体体验评分" : "Overall Experience"}</span>
              <div className="preview-stars-row">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>

            <div className="preview-card-input-group">
              <span className="preview-card-label">{isZh ? "您的建议" : "Suggestions"}</span>
              <div className="preview-card-input" style={{ height: "32px", alignItems: "flex-start", paddingTop: "5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {isZh ? "系统运行非常顺畅，极力推荐！" : "Extremely smooth, love the GenUI integration!"}
              </div>
            </div>

            <button className="preview-card-button">
              {isZh ? "提交反馈" : "Submit Feedback"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "product-recommendation":
      return (
        <div className="card-visual-area" id="visual-product-rec" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <div>
                <h3 className="preview-card-title">{isZh ? "个性化推荐方案" : "Personalized Match"}</h3>
                <p className="preview-card-subtitle">{isZh ? "智能分析您最匹配的服务" : "Smart recommendation result"}</p>
              </div>
              <span style={{ fontSize: "6.5px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10b981", padding: "1.5px 4.5px", borderRadius: "4px", fontWeight: "800", transform: "scale(0.85)", whiteSpace: "nowrap" }}>
                98% Match
              </span>
            </div>

            <div className="preview-card-input-group" style={{ gap: "4px", marginTop: "4px" }}>
              <span className="preview-card-label">{isZh ? "推荐订阅方案" : "Recommended Subscription"}</span>
              <div className="preview-option-pill active" style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontWeight: 700 }}>⚡ Cloud Starter</span>
                <span>$49/mo</span>
              </div>
            </div>

            <button className="preview-card-button" style={{ background: "#10b981", color: "#0f172a", border: "none" }}>
              {isZh ? "确认订阅方案" : "Confirm Subscription"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "booking-consultation":
      return (
        <div className="card-visual-area" id="visual-consultation" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div>
              <h3 className="preview-card-title">{isZh ? "预约顾问咨询" : "Book Consultation"}</h3>
              <p className="preview-card-subtitle">{isZh ? "选择您的预约日期与时间段" : "Choose preferred date and time slot"}</p>
            </div>

            <div className="preview-card-input-group" style={{ gap: "3px" }}>
              <span className="preview-card-label">{isZh ? "选择日期" : "Select Date"}</span>
              <div className="preview-calendar-days">
                <span className="preview-calendar-day">22</span>
                <span className="preview-calendar-day">23</span>
                <span className="preview-calendar-day active">24</span>
                <span className="preview-calendar-day">25</span>
              </div>
            </div>

            <div className="preview-card-input-group">
              <span className="preview-card-label">{isZh ? "选择时间" : "Available Time"}</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <div className="preview-option-pill active" style={{ flex: 1, padding: "4px 6px", justifyContent: "center" }}>10:00 AM</div>
                <div className="preview-option-pill" style={{ flex: 1, padding: "4px 6px", justifyContent: "center" }}>02:30 PM</div>
              </div>
            </div>

            <button className="preview-card-button" style={{ marginTop: "2px" }}>
              {isZh ? "立即预约" : "Confirm Booking"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "invoice-receipt-collection":
      return (
        <div className="card-visual-area" id="visual-ocr-invoice" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 className="preview-card-title">{isZh ? "智能发票报销" : "Invoice OCR"}</h3>
                <p className="preview-card-subtitle">{isZh ? "扫描发票并智能解析提取" : "Extract metadata from invoice files"}</p>
              </div>
            </div>

            <div className="preview-card-input-group" style={{ gap: "4px" }}>
              <span className="preview-card-label">{isZh ? "提取状态" : "Extraction Status"}</span>
              <div className="preview-option-pill active" style={{ borderColor: "rgba(16, 185, 129, 0.2)", background: "rgba(16,185,129,0.05)" }}>
                <span style={{ color: "#10b981", fontWeight: "bold" }}>✓ INV-2026-042 Ready</span>
              </div>
            </div>

            <div className="preview-card-input-group" style={{ gap: "3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7px", opacity: 0.8 }}>
                <span>{isZh ? "发票总额" : "Total Amount"}:</span>
                <span style={{ fontWeight: 800 }}>$1,280.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "7px", opacity: 0.8 }}>
                <span>{isZh ? "税额" : "Tax"}:</span>
                <span style={{ fontWeight: 800 }}>$76.80</span>
              </div>
            </div>

            <button className="preview-card-button">
              {isZh ? "一键归档报销" : "Process Reimbursement"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "beta-feedback":
      return (
        <div className="card-visual-area" id="visual-beta-bug" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div>
              <h3 className="preview-card-title">{isZh ? "异常中心与自愈" : "Bug & Self-Healing"}</h3>
              <p className="preview-card-subtitle">{isZh ? "异常监控与智能故障自愈" : "Real-time logs & automatic fixing"}</p>
            </div>

            <div className="preview-terminal">
              <div className="preview-terminal-header">
                <span className="preview-terminal-dot" style={{ background: "#ef4444" }}></span>
                <span className="preview-terminal-dot" style={{ background: "#eab308" }}></span>
                <span className="preview-terminal-dot" style={{ background: "#22c55e" }}></span>
              </div>
              <div className="preview-terminal-line red">&gt; GET /api/auth/sandbox 500</div>
              <div className="preview-terminal-line red">&gt; Error: Token invalid signature</div>
              <div className="preview-terminal-line green">&gt; [AI Healing] Re-routed traffic ✓</div>
            </div>

            <button className="preview-card-button" style={{ background: "#ef4444", color: "#ffffff", border: "none" }}>
              {isZh ? "立即处理告警" : "Acknowledge Bug"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "waitlist":
      return (
        <div className="card-visual-area" id="visual-waitlist" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>
          
          <div className="preview-floating-card" data-theme={activeTheme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 className="preview-card-title">{isZh ? "预约排队候补" : "Join the Waitlist"}</h3>
                <p className="preview-card-subtitle">{isZh ? "提前加入候补获得测试邀请" : "Reserve your spot in early waitlist"}</p>
              </div>
            </div>

            <div className="preview-card-input-group" style={{ marginTop: "4px" }}>
              <span className="preview-card-label">{isZh ? "邮箱地址" : "Email Address"}</span>
              <div className="preview-card-input">enter your email...</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "7px", opacity: 0.7, padding: "0 2px" }}>
              <span>🚀 12.4k joined</span>
              <span style={{ fontWeight: 800 }}>Est. Wait: 2 days</span>
            </div>

            <button className="preview-card-button">
              {isZh ? "预约席位" : "Reserve Spot"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    case "contact-us":
      return (
        <div className="card-visual-area" id="visual-contact-us" data-theme={activeTheme}>
          <div className="visual-grid-bg"></div>

          <div className="preview-floating-card" data-theme={activeTheme}>
            <div>
              <h3 className="preview-card-title">{isZh ? "联系我们" : "Contact Us"}</h3>
              <p className="preview-card-subtitle">{isZh ? "让我们了解你的需求，随时回复" : "Tell us what you need — we'll get back to you"}</p>
            </div>

            <div className="preview-card-input-group" style={{ marginTop: "2px" }}>
              <span className="preview-card-label">{isZh ? "姓名" : "Name"}</span>
              <div className="preview-card-input">Sarah Kim</div>
            </div>

            <div className="preview-card-input-group">
              <span className="preview-card-label">{isZh ? "咨询内容" : "Your Message"}</span>
              <div className="preview-card-input" style={{ height: "36px", alignItems: "flex-start", paddingTop: "5px", overflow: "hidden", fontSize: "8px", lineHeight: 1.4, opacity: 0.85 }}>
                {isZh ? "我想了解企业版的集成方案..." : "I'd like to explore your enterprise plan..."}
              </div>
            </div>

            <div style={{ display: "flex", gap: "5px" }}>
              <div className="preview-option-pill" style={{ flex: 1, justifyContent: "center", fontSize: "7.5px" }}>💼 {isZh ? "企业合作" : "Business"}</div>
              <div className="preview-option-pill active" style={{ flex: 1, justifyContent: "center", fontSize: "7.5px" }}>🤝 {isZh ? "产品咨询" : "Product"}</div>
            </div>

            <button className="preview-card-button" style={{ marginTop: "2px" }}>
              {isZh ? "发送消息" : "Send Message"}
            </button>
          </div>

          {hoverOverlay}
        </div>
      );

    default:
      return null;
  }
}

export default function TemplateStarter({ locale }: { locale: string }) {
  const [activeThemes, setActiveThemes] = useState<Record<string, ThemeKey>>({
    "lead-capture": "business",
    "event-registration": "minimal",
    "satisfaction-survey": "retro",
    "product-recommendation": "brutalism",
    "booking-consultation": "business",
    "invoice-receipt-collection": "dark",
    "beta-feedback": "dark",
    "waitlist": "minimal",
    "contact-us": "minimal",
  });

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const templates = getHomepageSceneTemplates();
  const isZh = locale.toLowerCase().startsWith("zh");

  const copy = isZh
    ? {
        badge: "Runnable Templates",
        title: "丰富的高频可运行场景模板",
        description: "我们剔除了无意义的繁琐文案与占位说明。点击直接体验，支持动态自由切换 5 套预设核心主题。"
      }
    : {
        badge: "Runnable Templates",
        title: "Runnable Scenario Templates",
        description: "No blank-slate cold starts. Preview high-fidelity interactive templates and dynamically toggle between 5 themes."
      };

  const categoryOptions = [
    { key: "all", label: isZh ? "全部" : "All" },
    { key: "lead-capture", label: isZh ? "增长获客" : "Lead Capture" },
    { key: "registration", label: isZh ? "活动报名" : "Registration" },
    { key: "feedback", label: isZh ? "客户反馈" : "Feedback" },
    { key: "booking", label: isZh ? "预约服务" : "Booking" },
    { key: "invoice", label: isZh ? "发票财务" : "Invoice" },
  ];

  const filteredTemplates = templates.filter((template) => {
    if (selectedCategory === "all") {
      return true;
    }
    const cat = template.category;
    let mappedKey = "";
    if (cat === "增长获客" || cat === "互动转化" || cat === "官网咨询" || cat === "内容转化" || cat === "品牌增长") {
      mappedKey = "lead-capture";
    } else if (cat === "活动运营" || cat === "教育培训" || cat === "社群运营" || cat === "招聘申请" || cat === "作品征集") {
      mappedKey = "registration";
    } else if (cat === "客户体验" || cat === "产品反馈" || cat === "活动复盘" || cat === "用户研究") {
      mappedKey = "feedback";
    } else if (cat === "预约服务") {
      mappedKey = "booking";
    } else if (cat === "文件收集" || cat === "资料审核") {
      mappedKey = "invoice";
    }
    return mappedKey === selectedCategory;
  });

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-header">
          <span className="gallery-badge">{copy.badge}</span>
          <h2 className="gallery-title">{copy.title}</h2>
          <p className="gallery-desc">{copy.description}</p>
        </div>

        <div className="filter-tabs">
          {categoryOptions.map((c) => (
            <button
              key={c.key}
              className={`filter-tab ${selectedCategory === c.key ? "active" : ""}`}
              onClick={() => setSelectedCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="templates-grid">
          {filteredTemplates.map((template) => {
            const currentTheme = activeThemes[template.id] || "minimal";

            return (
              <div
                key={template.id}
                className="template-card"
                id={`card-${template.id}`}
              >
                {/* 视觉缩略图，点击可跳转 */}
                <Link href={`/${locale}/templates/${template.id}`} className="block-link">
                  <TemplateVisualPreview template={template} activeTheme={currentTheme} locale={locale} />
                </Link>

                {/* 文字说明与主题圆点 */}
                <div className="card-info-area">
                  <Link href={`/${locale}/templates/${template.id}`} className="card-title">
                    {isZh ? template.name : (template.nameEn || template.name)}
                  </Link>
                  <div className="color-dots" onClick={(e) => e.stopPropagation()}>
                    {(["minimal", "business", "dark", "brutalism", "retro"] as ThemeKey[]).map((theme) => (
                      <span
                        key={theme}
                        className={`color-dot dot-${theme} ${currentTheme === theme ? "active" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveThemes((prev) => ({
                            ...prev,
                            [template.id]: theme,
                          }));
                        }}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
