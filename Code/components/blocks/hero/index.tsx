"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Hero as HeroType } from "@/types/blocks/hero";

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

  const [prompt, setPrompt] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [activeTheme, setActiveTheme] = useState<ThemeKey>("minimal");

  if (hero.disabled) {
    return null;
  }

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("请输入表单生成提示词");
      return;
    }
    // Redirect to forms/new with prompt query
    router.push(`/${locale}/forms/new?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleOptionSelect = (optionName: string) => {
    setSelectedOption(optionName);
    setTimeout(() => {
      setCurrentSlide(1);
    }, 350);
  };

  const handleEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("请输入有效的邮箱地址");
      return;
    }
    setCurrentSlide(2);
  };

  const handleReset = () => {
    setCurrentSlide(0);
    setSelectedOption(null);
    setEmail("");
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
              ✨ AI Form SaaS V2.0
            </div>
            <h1 className="hero-title">
              懂你的表单，<br />一句话即刻生成。
            </h1>
            <p className="hero-desc">
              借鉴 Typeform 的丝滑交互设计，我们将填写转化率提升至极致。不再从零拖拽，让 AI 懂你的诉求，自动编排字段与推送链路。
            </p>

            <div className="generator-bar">
              <input
                type="text"
                className="generator-input"
                placeholder="例如：设计一个科技峰会的门票销售表单..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGenerate();
                  }
                }}
              />
              <button className="btn-create" onClick={handleGenerate}>
                生成表单 →
              </button>
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
                  {currentSlide < totalSlides - 1 ? `${currentSlide + 1} / ${totalSlides - 1}` : "DONE"}
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
                      <span style={{ color: currentStyles.text }}>01</span> → 主要业务诉求
                    </div>
                    <h3 className="slide-title" style={{ color: currentStyles.text }}>
                      您希望通过此 AI 场景生成器快速收集什么数据？
                    </h3>
                    <div className="mockup-options">
                      {[
                        { key: "A", text: "🚀 增长与潜客收集" },
                        { key: "B", text: "🎟️ 活动报名与订位" },
                        { key: "C", text: "📈 日常反馈与满意度" },
                      ].map((opt) => {
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

                  {/* Slide 2 */}
                  <form onSubmit={handleEmailSubmit} className="mockup-slide">
                    <div className="slide-num" style={{ color: currentStyles.muted }}>
                      <span style={{ color: currentStyles.text }}>02</span> → 邮箱认证
                    </div>
                    <h3 className="slide-title" style={{ color: currentStyles.text }}>
                      请留下您的工作邮箱以用来绑定测试沙箱：
                    </h3>
                    <div className="mockup-input-container">
                      <input
                        type="email"
                        className="mockup-text-input"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                          borderBottomColor: currentStyles.text,
                          color: currentStyles.text,
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn-next"
                      style={{
                        backgroundColor: currentStyles.btnBg,
                        color: currentStyles.btnText,
                        borderRadius: currentStyles.btnRadius,
                        border: activeTheme === "brutalism" ? "2px solid #000" : undefined,
                      }}
                    >
                      确认提交 ↵
                    </button>
                  </form>

                  {/* Slide 3 */}
                  <div className="mockup-slide">
                    <div className="success-icon">🎉</div>
                    <h3 className="success-title" style={{ color: currentStyles.text }}>
                      体验环境已准备完毕
                    </h3>
                    <p className="success-desc" style={{ color: currentStyles.muted }}>
                      AI 已自动为您定制了首个单题流测试节点，点击下方按钮开始自由体验。
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
                      onClick={handleReset}
                    >
                      重新开始 ↺
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
