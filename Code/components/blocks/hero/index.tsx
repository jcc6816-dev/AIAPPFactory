"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Hero as HeroType } from "@/types/blocks/hero";
import { trackGrowthEvent } from "@/lib/growth";

type ThemeKey = "minimal" | "business" | "dark" | "brutalism" | "retro";

const themeStyles: Record<ThemeKey, Record<string, string>> = {
  minimal: {
    bg: "#ffffff",
    text: "#191919",
    muted: "#595959", // Increased contrast from #7f7f7f to > 7:1
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
    muted: "#1d4ed8", // Increased contrast from #2563eb on #eff6ff to > 6:1
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
    muted: "#cbd5e1", // Increased contrast from #94a3b8 on #0f172a to > 9:1
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
    muted: "#92400e", // Increased contrast from #b45309 on #fef3c7 to > 6:1
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
  const locale = (params?.locale as string) || "en";
  const isZh = locale.toLowerCase().startsWith("zh");

  const t = {
    placeholder: isZh ? "例如：设计一个科技峰会的门票销售表单..." : "e.g., Design a ticket sales form for a tech summit...",
    btnCreate: isZh ? "生成表单 →" : "Generate Form →",
    alertPrompt: isZh ? "请输入表单生成提示词" : "Please enter a form generation prompt",
    slide1Num: isZh ? "主要业务诉求" : "Goal Description",
    slide1Title: isZh ? "您希望通过此 AI 场景生成器快速收集什么数据？" : "What kind of data do you want to collect with this AI generator?",
    options: [
      { key: "A", id: "lead-capture", text: isZh ? "🚀 SaaS 潜客收集" : "🚀 SaaS Lead Capture" },
      { key: "B", id: "event-registration", text: isZh ? "🎟️ 科技峰会门票" : "🎟️ Event Booking" },
      { key: "C", id: "satisfaction-survey", text: isZh ? "📈 客户满意度调查" : "📈 Customer Feedback" },
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
  const [demoSelectedValue, setDemoSelectedValue] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("minimal");
  const demoCompletedRef = useRef(false);

  const [shouldRenderMockup, setShouldRenderMockup] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setShouldRenderMockup(true);
      return;
    }

    const renderMockup = () => setShouldRenderMockup(true);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(renderMockup, { timeout: 2000 });
    } else {
      timer = setTimeout(renderMockup, 1200);
    }

    return () => {
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedOption) {
      if (selectedOption === "lead-capture") {
        setActiveTheme("dark");
      } else if (selectedOption === "event-registration") {
        setActiveTheme("business");
      } else if (selectedOption === "satisfaction-survey") {
        setActiveTheme("retro");
      }
    }
  }, [selectedOption]);

  useEffect(() => {
    if (currentSlide !== 1) return;

    const t1 = setTimeout(() => {
      setLoadingStep(1);
    }, 1000);

    const t2 = setTimeout(() => {
      setLoadingStep(2);
    }, 1800);

    const t3 = setTimeout(() => {
      setCurrentSlide(2);
    }, 2600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentSlide]);

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

    // 轻量 prompt-to-template 映射
    const getTemplateFromPrompt = (inputPrompt: string): string | null => {
      const lower = inputPrompt.toLowerCase();
      if (/科技峰会|门票|活动|报名|event|ticket|booking/i.test(lower)) {
        return "event-registration";
      }
      if (/saas|潜客|线索|lead|capture/i.test(lower)) {
        return "lead-capture";
      }
      if (/满意度|反馈|调研|survey|feedback|satisfaction/i.test(lower)) {
        return "satisfaction-survey";
      }
      return null;
    };

    const mappedTemplate = getTemplateFromPrompt(finalPrompt);

    // 埋点规范纠偏：点击生成跳转时绝对不记录为 ai_generate_submitted / form_generate
    // 统一以 template_used 记录到 template_use_click 漏斗节点
    if (mappedTemplate) {
      trackGrowthEvent("template_used", {
        template_id: mappedTemplate,
        source: "homepage_prompt_mapped",
        entry_point: "homepage_prompt",
        prompt_length: finalPrompt.length,
      });
      router.push(`/${locale}/forms/new?template=${mappedTemplate}&prompt=${encodeURIComponent(finalPrompt)}`);
    } else {
      router.push(`/${locale}/forms/new?prompt=${encodeURIComponent(finalPrompt)}`);
    }
  };

  const suggestions = isZh
    ? [
        { text: "🎟️ 科技峰会门票", prompt: "设计一个科技峰会的门票销售表单", templateId: "event-registration" },
        { text: "🚀 SaaS 潜客收集", prompt: "设计一个 SaaS 产品的潜客信息收集表单", templateId: "lead-capture" },
        { text: "📈 客户满意度调查", prompt: "设计一个针对已购用户的满意度调研问卷", templateId: "satisfaction-survey" },
      ]
    : [
        { text: "🎟️ Event Booking", prompt: "Design a ticket sales form for a tech summit", templateId: "event-registration" },
        { text: "🚀 SaaS Lead Capture", prompt: "Design a SaaS product lead collection form", templateId: "lead-capture" },
        { text: "📈 Customer Feedback", prompt: "Design a customer feedback and satisfaction survey", templateId: "satisfaction-survey" },
      ];

  const handleOptionSelect = (templateId: string, entryPoint: "homepage_suggestions" | "homepage_hero_mockup" = "homepage_hero_mockup") => {
    setSelectedOption(templateId);
    setDemoSelectedValue(null);
    demoCompletedRef.current = false;
    const matchedSuggestion = suggestions.find((s) => s.templateId === templateId);
    if (matchedSuggestion) {
      setPrompt(matchedSuggestion.prompt);
    }
    trackGrowthEvent("demo_started", {
      option: templateId,
      entry_point: entryPoint,
    });
    setShouldRenderMockup(true);
    setTimeout(() => {
      setCurrentSlide(1);
      setLoadingStep(0);
    }, 350);
  };

  const handleDemoValueSelect = (val: string) => {
    setDemoSelectedValue(val);
    setTimeout(() => {
      handleDemoSubmit(val);
    }, 600);
  };

  const handleDemoSubmit = (val?: string) => {
    if (demoCompletedRef.current) return;
    demoCompletedRef.current = true;
    trackGrowthEvent("demo_completed", {
      option: selectedOption || undefined,
      entry_point: "homepage_hero_mockup",
      answer_value: val || demoSelectedValue || undefined,
    });
    setCurrentSlide(3);
  };

  const handleReset = () => {
    setCurrentSlide(0);
    setSelectedOption(null);
    setDemoSelectedValue(null);
    demoCompletedRef.current = false;
    setLoadingStep(0);
  };

  const totalSlides = 4;
  const progressPercent = ((currentSlide + 1) / totalSlides) * 100;
  const currentStyles = themeStyles[activeTheme];

  const demoSchemas = {
    "event-registration": {
      label: isZh ? "您最感兴趣的峰会议题是？" : "Which session are you most excited about?",
      options: [
        { label: isZh ? "🤖 AI 智能体应用实践" : "🤖 AI Agent Applications", value: "ai" },
        { label: isZh ? "🎨 GenUI 动态界面渲染" : "🎨 GenUI Dynamic Rendering", value: "genui" },
        { label: isZh ? "📊 企业全生命周期场景治理" : "📊 Scenario Governance", value: "governance" },
      ],
    },
    "lead-capture": {
      label: isZh ? "您计划构建什么类型的 AI 场景？" : "What kind of scenario do you plan to build?",
      options: [
        { label: isZh ? "🚀 智能销售线索收集" : "🚀 Smart Lead Capture Form", value: "lead" },
        { label: isZh ? "📅 自动化会议/沙龙订位" : "📅 Automated Booking Flow", value: "booking" },
        { label: isZh ? "📋 OCR 图像去重与报表流程" : "📋 OCR & Reporting Workflow", value: "ocr" },
      ],
    },
    "satisfaction-survey": {
      label: isZh ? "您对 GenForms.ai 的整体评价是？" : "How would you rate GenForms.ai?",
      options: [
        { label: isZh ? "😄 非常满意，会向朋友推荐" : "😄 Excellent, would recommend", value: "5" },
        { label: isZh ? "😐 还可以，基本满足期待" : "😐 Neutral, meets expectations", value: "3" },
        { label: isZh ? "😔 不太满意，需要继续优化" : "😔 Dissatisfied, needs work", value: "1" },
      ],
    }
  };

  const currentDemoSchema = selectedOption ? demoSchemas[selectedOption as keyof typeof demoSchemas] : null;

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column */}
          <div className="hero-content">
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
            
            <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs text-slate-600">
              <span className="font-bold text-slate-700 mr-1">{isZh ? "推荐场景：" : "Suggestions:"}</span>
              {suggestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => {
                    setPrompt(s.prompt);
                    setShouldRenderMockup(true);
                    handleOptionSelect(s.templateId, "homepage_suggestions");
                    // 移动端平滑滚动
                    const container = document.querySelector(".mockup-container");
                    if (container) {
                      container.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-slate-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-600/10 hover:-translate-y-0.5 text-xs font-bold cursor-pointer animate-fade-in"
                >
                  {s.text}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Mockup */}
          <div className="mockup-container">
            {!shouldRenderMockup ? (
              <div 
                className="typeform-mockup skeleton-mockup"
                style={{ 
                  backgroundColor: currentStyles.bg,
                  borderColor: activeTheme === "brutalism" ? "#000" : undefined,
                  borderWidth: activeTheme === "brutalism" ? "2px" : undefined,
                  cursor: "pointer"
                }}
                onClick={() => setShouldRenderMockup(true)}
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
                    1 / 3
                  </span>
                </div>

                <div className="mockup-slide flex-1 flex flex-col justify-between">
                  <div>
                    <div className="slide-num" style={{ color: currentStyles.muted }}>
                      <span style={{ color: currentStyles.text }}>01</span> → {t.slide1Num}
                    </div>
                    <div className="slide-title text-lg lg:text-xl" style={{ color: currentStyles.text, marginBottom: "16px" }}>
                      {t.slide1Title}
                    </div>
                    <div className="mockup-options">
                      {t.options.map((opt) => (
                        <div
                          key={opt.key}
                          className="mockup-option"
                          style={{
                            backgroundColor: currentStyles.optionBg,
                            border: currentStyles.optionBorder,
                            borderRadius: currentStyles.radius,
                            color: currentStyles.text,
                            padding: "10px 14px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent double trigger
                            setShouldRenderMockup(true);
                            handleOptionSelect(opt.id, "homepage_hero_mockup");
                          }}
                        >
                          <span>{opt.text}</span>
                          <span 
                            className="option-key"
                            style={{
                              backgroundColor: "#ffffff",
                              color: currentStyles.muted,
                              borderColor: "rgba(0,0,0,0.15)",
                              borderRadius: activeTheme === "brutalism" ? "0px" : "4px",
                            }}
                          >
                            {opt.key}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col items-center">
                    <button
                      className="w-full py-2.5 px-4 font-bold text-xs shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 animate-bounce animate-duration-1000"
                      style={{
                        backgroundColor: currentStyles.btnBg,
                        color: currentStyles.btnText,
                        borderRadius: currentStyles.btnRadius || "8px",
                        border: activeTheme === "brutalism" ? "2px solid #000" : "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        const templateId = selectedOption || "event-registration";
                        handleOptionSelect(templateId, "homepage_hero_mockup");
                      }}
                    >
                      <span>⚡ {isZh ? "直接体验 AI 演示" : "Start Demo Instantly"}</span>
                    </button>
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
                      width: "25%",
                      backgroundColor: currentStyles.btnBg,
                    }}
                  ></div>
                </div>
              </div>
            ) : (
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
                    {/* Slide 0 */}
                    <div className="mockup-slide">
                      <div className="slide-num" style={{ color: currentStyles.muted }}>
                        <span style={{ color: currentStyles.text }}>01</span> → {t.slide1Num}
                      </div>
                      <div className="slide-title" style={{ color: currentStyles.text }}>
                        {t.slide1Title}
                      </div>
                      <div className="mockup-options">
                        {t.options.map((opt) => {
                          const isSelected = selectedOption === opt.id;
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
                              onClick={() => handleOptionSelect(opt.id, "homepage_hero_mockup")}
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

                      <div className="mt-4 flex flex-col items-center">
                        <button
                          className="w-full py-2.5 px-4 font-bold text-xs shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 animate-bounce animate-duration-1000"
                          style={{
                            backgroundColor: currentStyles.btnBg,
                            color: currentStyles.btnText,
                            borderRadius: currentStyles.btnRadius || "8px",
                            border: activeTheme === "brutalism" ? "2px solid #000" : "none",
                          }}
                          onClick={() => {
                            const templateId = selectedOption || "event-registration";
                            handleOptionSelect(templateId, "homepage_hero_mockup");
                          }}
                        >
                          <span>⚡ {isZh ? "直接体验 AI 演示" : "Start Demo Instantly"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Slide 1: Simulated AI Generation Process */}
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

                    {/* Slide 2: High-Fidelity Form Preview */}
                    <div className="mockup-slide flex flex-col justify-between p-6 text-left">
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-center mb-3">
                          <span 
                            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                            style={{ backgroundColor: currentStyles.badgeBg, color: currentStyles.badgeText }}
                          >
                            {isZh ? "高保真表单预览" : "FORM PREVIEW"}
                          </span>
                          <span className="text-[10px] font-bold" style={{ color: currentStyles.muted }}>
                            1 / 1
                          </span>
                        </div>

                        <div className="text-sm font-bold mb-4 leading-snug" style={{ color: currentStyles.text }}>
                          <span className="mr-1.5" style={{ color: currentStyles.muted }}>1 →</span>
                          {currentDemoSchema?.label}
                          <span className="text-red-500 ml-0.5 font-normal">*</span>
                        </div>

                        <div className="space-y-2.5">
                          {currentDemoSchema?.options.map((opt) => {
                            const isValSelected = demoSelectedValue === opt.value;
                            return (
                              <button
                                key={opt.value}
                                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold border flex items-center justify-between transition-all duration-300 shadow-sm cursor-pointer hover:translate-x-0.5 active:scale-[0.98]"
                                style={{
                                  backgroundColor: isValSelected ? currentStyles.optionSelectedBg : currentStyles.optionBg,
                                  borderColor: isValSelected ? currentStyles.optionSelectedBorder : currentStyles.optionBorder,
                                  borderRadius: currentStyles.radius,
                                  color: currentStyles.text,
                                }}
                                onClick={() => handleDemoValueSelect(opt.value)}
                              >
                                <span>{opt.label}</span>
                                <span 
                                  className="flex items-center justify-center text-[10px] size-5 font-bold uppercase transition-all"
                                  style={{
                                    backgroundColor: isValSelected ? currentStyles.text : "transparent",
                                    color: isValSelected ? currentStyles.bg : currentStyles.muted,
                                    border: isValSelected ? "none" : `1px solid ${currentStyles.muted}44`,
                                    borderRadius: activeTheme === "brutalism" ? "0px" : "4px",
                                  }}
                                >
                                  {isValSelected ? "✓" : ""}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="pt-3 border-t mt-4 flex items-center justify-between" style={{ borderColor: `${currentStyles.muted}20` }}>
                        <span className="text-[10px]" style={{ color: currentStyles.muted }}>
                          {isZh ? "💡 选择一个选项自动进入下一步" : "💡 Choose an option to proceed"}
                        </span>
                        {demoSelectedValue && (
                          <button
                            className="px-4 py-2 text-xs font-bold transition-all flex items-center gap-1 shadow cursor-pointer active:scale-95 animate-fade-in"
                            style={{
                              backgroundColor: currentStyles.btnBg,
                              color: currentStyles.btnText,
                              borderRadius: currentStyles.btnRadius,
                              border: activeTheme === "brutalism" ? "2px solid #000" : undefined,
                            }}
                            onClick={() => handleDemoSubmit()}
                          >
                            {isZh ? "确定提交 ⚡" : "Submit ⚡"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Slide 3 */}
                    <div className="mockup-slide">
                      <div className="success-icon">🎉</div>
                      <div className="success-title" style={{ color: currentStyles.text }}>
                        {t.successTitle}
                      </div>
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
                          trackGrowthEvent("template_used", {
                            template_id: selectedOption || undefined,
                            source: "homepage_demo_completed",
                            entry_point: "homepage_hero_mockup",
                          });
                          router.push(`/${locale}/forms/new?template=${selectedOption}&prompt=${encodeURIComponent(prompt || "")}`);
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
            )}

            {/* Theme dot switcher in the bottom right context */}
            <div className="absolute -bottom-10 right-4 flex items-center gap-0.5 bg-white/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/5 shadow-sm">
              <span className="text-[10px] font-semibold text-slate-600 mr-1 select-none">THEME</span>
              {(["minimal", "business", "dark", "brutalism", "retro"] as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setShouldRenderMockup(true);
                    setActiveTheme(t);
                  }}
                  className="theme-dot-btn flex items-center justify-center w-8 h-8 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                  aria-label={isZh ? `切换至 ${t} 主题` : `Switch to ${t} theme`}
                  title={t}
                >
                  <span
                    className={`color-dot dot-${t} ${activeTheme === t ? "active" : ""}`}
                    style={{ width: "12px", height: "12px", borderRadius: "50%", display: "inline-block" }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
