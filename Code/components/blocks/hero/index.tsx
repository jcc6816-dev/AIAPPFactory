"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Hero as HeroType } from "@/types/blocks/hero";
import { trackGrowthEvent } from "@/lib/growth";

type ThemeKey = "minimal" | "business" | "dark" | "brutalism" | "retro";

const themeStyles: Record<ThemeKey, Record<string, string>> = {
  minimal: {
    bg: "#ffffff",
    text: "#191919",
    muted: "#7f7f7f",
    optionBg: "#ffffff",
    optionBorder: "1px solid rgba(0,0,0,0.1)",
    optionText: "#191919",
    optionSelectedBg: "rgba(0,0,0,0.02)",
    optionSelectedBorder: "1px solid #000000",
    btnBg: "#000000",
    btnText: "#ffffff",
    inputBorder: "1px solid rgba(0,0,0,0.15)",
    inputFocusBorder: "#000000",
    badgeBg: "#f1f0ea",
    badgeText: "#191919",
    radius: "12px",
    btnRadius: "8px",
    inputRadius: "0px", // border-bottom only
  },
  business: {
    bg: "#eff6ff",
    text: "#1e3a8a",
    muted: "#2563eb",
    optionBg: "#ffffff",
    optionBorder: "1px solid #bfdbfe",
    optionText: "#1e3a8a",
    optionSelectedBg: "#dbeafe",
    optionSelectedBorder: "1px solid #2563eb",
    btnBg: "#2563eb",
    btnText: "#ffffff",
    inputBorder: "1px solid #bfdbfe",
    inputFocusBorder: "#2563eb",
    badgeBg: "#dbeafe",
    badgeText: "#2563eb",
    radius: "12px",
    btnRadius: "8px",
    inputRadius: "0px",
  },
  dark: {
    bg: "#0f172a",
    text: "#f8fafc",
    muted: "#94a3b8",
    optionBg: "#1e293b",
    optionBorder: "1px solid rgba(255,255,255,0.1)",
    optionText: "#f8fafc",
    optionSelectedBg: "#334155",
    optionSelectedBorder: "1px solid #38bdf8",
    btnBg: "#38bdf8",
    btnText: "#0f172a",
    inputBorder: "1px solid rgba(255,255,255,0.2)",
    inputFocusBorder: "#38bdf8",
    badgeBg: "#1e293b",
    badgeText: "#38bdf8",
    radius: "12px",
    btnRadius: "8px",
    inputRadius: "0px",
  },
  brutalism: {
    bg: "#fde047",
    text: "#000000",
    muted: "#000000",
    optionBg: "#ffffff",
    optionBorder: "2px solid #000000",
    optionText: "#000000",
    optionSelectedBg: "#ff8a8a",
    optionSelectedBorder: "2px solid #000000",
    btnBg: "#000000",
    btnText: "#ffffff",
    inputBorder: "2px solid #000000",
    inputFocusBorder: "#000000",
    badgeBg: "#ffffff",
    badgeText: "#000000",
    radius: "0px",
    btnRadius: "0px",
    inputRadius: "0px",
  },
  retro: {
    bg: "#fef3c7",
    text: "#78350f",
    muted: "#b45309",
    optionBg: "#fffbeb",
    optionBorder: "1px solid #fde68a",
    optionText: "#78350f",
    optionSelectedBg: "#fcd34d",
    optionSelectedBorder: "1px solid #b45309",
    btnBg: "#b45309",
    btnText: "#ffffff",
    inputBorder: "1px solid #fde68a",
    inputFocusBorder: "#b45309",
    radius: "16px",
    btnRadius: "12px",
    inputRadius: "0px",
  },
};

export default function Hero({ hero }: { hero: HeroType }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "zh";
  const isZh = locale.toLowerCase().startsWith("zh");

  const t = {
    badge: isZh ? "✨ AI Form SaaS V2.0" : "✨ AI Form SaaS V2.0",
    placeholder: isZh ? "例如：设计一个科技峰会的门票销售表单..." : "e.g., Design a ticket sales form for a tech summit...",
    btnCreate: isZh ? "生成表单 →" : "Generate Form →",
    alertPrompt: isZh ? "请输入表单生成提示词" : "Please enter a form generation prompt",
    slide1Num: isZh ? "主要业务诉求" : "Goal Description",
    slide1Title: isZh ? "您希望通过此 AI 场景生成器快速收集什么数据？" : "What kind of data do you want to collect with this AI generator?",
    options: [
      { key: "A", text: isZh ? "🚀 增长与潜客收集" : "🚀 Growth & Lead Capture" },
      { key: "B", text: isZh ? "🎟️ 活动报名与订位" : "🎟️ Event Registration & Booking" },
      { key: "C", text: isZh ? "📈 日常反馈与满意度" : "📈 Feedback & Satisfaction" },
    ],
    successTitle: isZh ? "体验环境已准备完毕" : "Sandbox Environment Ready",
    successDesc: isZh ? "AI 已自动为您定制了首个单题流测试节点，点击下方按钮开始自由体验。" : "AI has customized your first single-step test form. Click below to start exploring.",
    btnReset: isZh ? "重新开始 ↺" : "Start Over ↺",
    btnCustomize: isZh ? "开始自定义表单 →" : "Customize this form →",
    progressDone: isZh ? "已完成" : "DONE",
  };

  const [prompt, setPrompt] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("minimal");

  useEffect(() => {
    if (currentSlide !== 1) return;

    const t1 = setTimeout(() => {
      setLoadingStep(1);
    }, 1000);

    const t2 = setTimeout(() => {
      setLoadingStep(2);
    }, 1800);

    const t3 = setTimeout(() => {
      trackGrowthEvent("demo_completed", {
        option: selectedOption || undefined,
        entry_point: "homepage_hero_mockup",
      });
      setCurrentSlide(2);
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentSlide, selectedOption]);

  if (hero.disabled) {
    return null;
  }

  const handleGenerate = () => {
    let finalPrompt = prompt.trim();
    if (!finalPrompt) {
      finalPrompt = isZh
        ? "设计一个科技峰会的门票销售表单"
        : "Design a ticket sales form for a tech summit";
    }
    trackGrowthEvent("ai_generate_submitted", {
      source: "homepage_prompt",
      entry_point: "homepage_hero",
      cta_text: t.btnCreate,
      prompt_length: finalPrompt.length,
      is_default_prompt: !prompt.trim(),
    });
    // Redirect to forms/new with prompt query
    router.push(`/${locale}/forms/new?prompt=${encodeURIComponent(finalPrompt)}`);
  };

  const suggestions = isZh
    ? [
        { text: "🎟️ 科技峰会门票", prompt: "设计一个科技峰会的门票销售表单" },
        { text: "🚀 SaaS 潜客收集", prompt: "设计一个 SaaS 产品的潜客信息收集表单" },
        { text: "📈 客户满意度调查", prompt: "设计一个针对已购用户的满意度调研问卷" },
      ]
    : [
        { text: "🎟️ Event Booking", prompt: "Design a ticket sales form for a tech summit" },
        { text: "🚀 SaaS Lead Capture", prompt: "Design a SaaS product lead collection form" },
        { text: "📈 Customer Feedback", prompt: "Design a customer feedback and satisfaction survey" },
      ];

  const handleOptionSelect = (optionName: string) => {
    setSelectedOption(optionName);
    trackGrowthEvent("demo_started", {
      option: optionName,
      entry_point: "homepage_hero_mockup",
    });
    setTimeout(() => {
      setCurrentSlide(1);
      setLoadingStep(0);
    }, 350);
  };

  const handleReset = () => {
    setCurrentSlide(0);
    setSelectedOption(null);
    setLoadingStep(0);
  };

  const totalSlides = 3;
  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
  const currentStyles = themeStyles[activeTheme];

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column */}
          <div className="hero-content">
            <div className="hero-badge">
              {t.badge}
            </div>
            <h1 
              className="hero-title"
              dangerouslySetInnerHTML={{ 
                __html: hero.title || (isZh ? "懂你的表单，<br />一句话即刻生成。" : "Generate publishable data-collection scenarios with AI and templates") 
              }} 
            />
            <p 
              className="hero-desc"
              dangerouslySetInnerHTML={{ 
                __html: hero.description || (isZh ? "借鉴 Typeform 的丝滑交互设计，我们将填写转化率提升至极致。不再从零拖拽，让 AI 懂你的诉求，自动编排字段与推送链路。" : "GenForms.ai helps teams start from one prompt or a proven template...")
              }} 
            />

            <div className="generator-bar">
              <input
                type="text"
                className="generator-input"
                placeholder={t.placeholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerate();
                  }
                }}
              />
              <button className="btn-create" onClick={handleGenerate}>
                {t.btnCreate}
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px] text-slate-500">
              <span className="font-semibold text-slate-400">{isZh ? "推荐场景：" : "Suggestions:"}</span>
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => {
                    setPrompt(s.prompt);
                    trackGrowthEvent("ai_generate_submitted", {
                      source: "homepage_suggestions",
                      entry_point: "homepage_hero",
                      cta_text: s.text,
                      prompt_length: s.prompt.length,
                    });
                    router.push(`/${locale}/forms/new?prompt=${encodeURIComponent(s.prompt)}`);
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition text-slate-600 font-medium cursor-pointer"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Mockup */}
          <div className="mockup-container">
            <div 
              className="typeform-mockup" 
              style={{ 
                backgroundColor: currentStyles.bg,
                borderColor: activeTheme === "brutalism" ? "#000" : undefined,
                borderWidth: activeTheme === "brutalism" ? "2px" : undefined,
              }}
            >
              <div 
                className="mockup-header" 
                style={{ 
                  backgroundColor: currentStyles.bg,
                  borderBottomColor: activeTheme === "brutalism" ? "#000" : undefined,
                  borderBottomWidth: activeTheme === "brutalism" ? "2px" : undefined,
                }}
              >
                <div className="mockup-dots">
                  <span className="mockup-dot red"></span>
                  <span className="mockup-dot yellow"></span>
                  <span className="mockup-dot green"></span>
                </div>
                <span className="mockup-indicator" style={{ color: currentStyles.muted }}>
                  {currentSlide < totalSlides - 1 ? `${currentSlide + 1} / ${totalSlides - 1}` : t.progressDone}
                </span>
              </div>

              <div className="mockup-slider">
                <div
                  className="mockup-slides"
                  style={{
                    transform: `translateY(-${currentSlide * 100}%)`,
                    transition: "transform 0.6s cubic-bezier(0.85, 0, 0.15, 1)",
                  }}
                >
                  {/* Slide 1 */}
                  <div className="mockup-slide">
                    <div className="slide-num" style={{ color: currentStyles.muted }}>
                      <span style={{ color: currentStyles.text }}>01</span> → {t.slide1Num}
                    </div>
                    <h3 className="slide-title" style={{ color: currentStyles.text }}>
                      {t.slide1Title}
                    </h3>
                    <div className="mockup-options">
                      {t.options.map((opt) => {
                        const isSelected = selectedOption === opt.text;
                        return (
                          <div
                            key={opt.key}
                            className={`mockup-option ${isSelected ? "selected" : ""}`}
                            style={{
                              backgroundColor: isSelected ? currentStyles.optionSelectedBg : currentStyles.optionBg,
                              border: isSelected ? currentStyles.optionSelectedBorder : currentStyles.optionBorder,
                              borderRadius: currentStyles.radius,
                              color: currentStyles.text,
                            }}
                            onClick={() => handleOptionSelect(opt.text)}
                          >
                            <span>{opt.text}</span>
                            <span 
                              className="option-key"
                              style={{
                                backgroundColor: isSelected ? currentStyles.text : "#ffffff",
                                color: isSelected ? currentStyles.bg : currentStyles.muted,
                                borderColor: isSelected ? currentStyles.text : "rgba(0,0,0,0.15)",
                                borderRadius: activeTheme === "brutalism" ? "0px" : "4px",
                              }}
                            >
                              {opt.key}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slide 2: Simulated AI Generation Process */}
                  <div className="mockup-slide flex flex-col justify-center items-center p-8 text-center">
                    <div className="slide-num mb-4" style={{ color: currentStyles.muted }}>
                      <span style={{ color: currentStyles.text }}>02</span> → {isZh ? "AI 极速生成中" : "AI Generating"}
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                      {/* Loading spinner */}
                      <div className="relative size-10 flex items-center justify-center">
                        <span className="absolute size-full rounded-full border-4 border-slate-200 opacity-20"></span>
                        <span 
                          className="absolute size-full rounded-full border-4 border-transparent border-t-blue-600 animate-spin"
                          style={{ borderTopColor: currentStyles.btnBg }}
                        ></span>
                      </div>

                      <div className="space-y-3">
                        <p className={`text-xs font-bold transition-all duration-300 ${loadingStep >= 0 ? "opacity-100 scale-100" : "opacity-30 scale-95"}`} style={{ color: currentStyles.text }}>
                          {isZh ? "⚡ AI 正在设计表单字段..." : "⚡ AI is generating fields..."}
                        </p>
                        <p className={`text-xs font-bold transition-all duration-300 ${loadingStep >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ color: currentStyles.text }}>
                          {isZh ? "🎨 视觉主题与响应式预览就绪..." : "🎨 Preview is ready..."}
                        </p>
                        <p className={`text-xs font-bold transition-all duration-300 ${loadingStep >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} style={{ color: currentStyles.text }}>
                          {isZh ? "🚀 部署通道与 Webhook 模拟准备完毕..." : "🚀 Publish simulation ready..."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide 3 */}
                  <div className="mockup-slide">
                    <div className="success-icon">🎉</div>
                    <h3 className="success-title" style={{ color: currentStyles.text }}>
                      {t.successTitle}
                    </h3>
                    <p className="success-desc" style={{ color: currentStyles.muted }}>
                      {t.successDesc}
                    </p>
                    <button
                      className="btn-next"
                      style={{
                        marginTop: "24px",
                        width: "100%",
                        justifyContent: "center",
                        backgroundColor: currentStyles.btnBg,
                        color: currentStyles.btnText,
                        borderRadius: currentStyles.btnRadius,
                        border: activeTheme === "brutalism" ? "2px solid #000" : undefined,
                      }}
                      onClick={() => {
                        trackGrowthEvent("ai_generate_submitted", {
                          source: "homepage_demo_completed",
                          entry_point: "homepage_hero_mockup",
                          cta_text: t.btnCustomize,
                          prompt: selectedOption,
                        });
                        router.push(`/${locale}/forms/new?prompt=${encodeURIComponent(selectedOption || "")}`);
                      }}
                    >
                      {t.btnCustomize}
                    </button>
                    <button
                      className="btn-reset-secondary"
                      style={{
                        marginTop: "16px",
                        width: "100%",
                        textAlign: "center",
                        background: "none",
                        border: "none",
                        color: currentStyles.muted,
                        fontSize: "14px",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={handleReset}
                    >
                      {t.btnReset}
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress fill */}
              <div 
                className="mockup-progress" 
                style={{ 
                  backgroundColor: activeTheme === "brutalism" ? "rgba(0,0,0,0.1)" : undefined,
                  borderTop: activeTheme === "brutalism" ? "2px solid #000" : undefined 
                }}
              >
                <div
                  className="mockup-progress-fill"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: currentStyles.btnBg,
                    transition: "width 0.6s cubic-bezier(0.85, 0, 0.15, 1)",
                  }}
                ></div>
              </div>
            </div>

            {/* Theme dot switcher in the bottom right context */}
            <div className="absolute -bottom-10 right-4 flex items-center gap-1.5 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 shadow-sm">
              <span className="text-[10px] font-semibold text-gray-500 mr-1">THEME</span>
              {(["minimal", "business", "dark", "brutalism", "retro"] as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTheme(t)}
                  className={`color-dot dot-${t} ${activeTheme === t ? "active" : ""}`}
                  style={{ width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" }}
                  title={t}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
