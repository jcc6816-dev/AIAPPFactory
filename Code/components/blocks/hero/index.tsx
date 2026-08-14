"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { trackGrowthEvent } from "@/lib/growth";
import type { Hero as HeroType } from "@/types/blocks/hero";

type StarterTemplate = {
  id: "event-registration" | "lead-capture" | "satisfaction-survey";
  label: string;
  prompt: string;
};

/**
 * The homepage only introduces the real first-success path. It deliberately
 * avoids a second, simulated creation flow: every action opens the same form
 * creation canvas that users will use to generate, adjust, publish and test.
 */
export default function Hero({ hero }: { hero: HeroType }) {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isZh = locale.toLowerCase().startsWith("zh");
  const [prompt, setPrompt] = useState("");

  if (hero.disabled) {
    return null;
  }

  const copy = isZh
    ? {
        placeholder: "例如：设计一个科技峰会活动报名表...",
        inputLabel: "描述你想收集的信息",
        title: "一句话生成可发布表单",
        description: "输入需求或选择模板，生成适合手机填写的表单；发布前可调整字段和外观。",
        primary: "免费生成我的表单",
        primaryTemplate: "从活动报名模板开始",
        secondary: "查看全部模板 →",
        previewEyebrow: "活动报名示例",
        previewTitle: "2026 科技峰会报名",
        previewDescription: "单题流填写体验，适合活动报名与信息收集。",
        previewQuestion: "怎么称呼你？",
        previewPlaceholder: "请输入姓名",
        previewAction: "下一题",
        startersLabel: "从模板开始：",
      }
    : {
        placeholder: "e.g. Design an event signup form for a tech summit...",
        inputLabel: "Describe what you want to collect",
        title: "Generate a form in one sentence, then publish it",
        description: "Describe your need or choose a template to create a mobile-friendly form. Refine its fields and appearance before publishing.",
        primary: "Generate my form for free",
        primaryTemplate: "Start with the event signup template",
        secondary: "View all templates →",
        previewEyebrow: "Event signup example",
        previewTitle: "2026 Technology Summit",
        previewDescription: "A focused, single-question experience for event registration.",
        previewQuestion: "What is your name?",
        previewPlaceholder: "Enter your name",
        previewAction: "Continue",
        startersLabel: "Start from a template:",
      };

  const starters: StarterTemplate[] = isZh
    ? [
        { id: "event-registration", label: "活动报名", prompt: "设计一个科技峰会活动报名表" },
        { id: "lead-capture", label: "收集潜客", prompt: "设计一个 SaaS 产品的潜客信息收集表单" },
        { id: "satisfaction-survey", label: "满意度反馈", prompt: "设计一个针对已购用户的满意度调研问卷" },
      ]
    : [
        { id: "event-registration", label: "Event signup", prompt: "Design an event signup form for a tech summit" },
        { id: "lead-capture", label: "Lead capture", prompt: "Design a SaaS product lead capture form" },
        { id: "satisfaction-survey", label: "Customer feedback", prompt: "Design a customer satisfaction survey" },
      ];

  function startCreation(nextPrompt: string, templateId?: StarterTemplate["id"], source = "homepage_prompt") {
    const normalizedPrompt = nextPrompt.trim();
    const search = new URLSearchParams({
      prompt: normalizedPrompt,
      autogenerate: "1",
    });

    if (templateId) {
      search.set("template", templateId);
      trackGrowthEvent("template_used", {
        template_id: templateId,
        source,
        entry_point: "homepage",
        prompt_length: normalizedPrompt.length,
      });
    }

    router.push(`/${locale}/forms/new?${search.toString()}`);
  }

  const handleGenerate = () => {
    const fallback = starters[0];
    const hasCustomPrompt = Boolean(prompt.trim());
    const value = prompt.trim() || fallback.prompt;
    const templateId = !hasCustomPrompt
      ? fallback.id
      : /活动|报名|峰会|event|signup|registration|rsvp|workshop|webinar/i.test(value)
        ? "event-registration"
        : /潜客|线索|saas|lead|capture/i.test(value)
          ? "lead-capture"
          : /满意度|反馈|调研|survey|feedback|satisfaction/i.test(value)
            ? "satisfaction-survey"
            : undefined;
    startCreation(value, templateId, "homepage_prompt");
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <h1 className="hero-title">{hero.title || copy.title}</h1>
            <p className="hero-desc">{hero.description || copy.description}</p>

            <div className="hero-generator">
              <label className="generator-label" htmlFor="hero-form-prompt">
                {copy.inputLabel}
              </label>
              <div className="generator-bar">
                <input
                  id="hero-form-prompt"
                  type="text"
                  className="generator-input"
                  aria-label={copy.inputLabel}
                  placeholder={copy.placeholder}
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleGenerate();
                  }}
                />
              </div>
              <button className="btn-create generator-submit" type="button" onClick={handleGenerate}>
                {prompt.trim() ? copy.primary : copy.primaryTemplate}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold text-slate-500">{copy.startersLabel}</span>
              {starters.map((starter) => (
                <button
                  key={starter.id}
                  type="button"
                  onClick={() => startCreation(starter.prompt, starter.id, "homepage_starter")}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
                >
                  {starter.label}
                </button>
              ))}
              <Link
                href={`/${locale}/templates`}
                className="px-2 py-2 text-xs font-bold text-brand-blue underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
              >
                {copy.secondary}
              </Link>
            </div>
          </div>

          <div className="mockup-container">
            <div
              aria-hidden="true"
              className="w-full max-w-[420px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_32px_72px_-28px_rgba(15,23,42,0.22)]"
            >
              <div className="h-3 bg-brand-blue" />
              <div className="border-b border-slate-100 bg-slate-50 px-7 py-5">
                <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-blue">{copy.previewEyebrow}</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{copy.previewTitle}</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{copy.previewDescription}</p>
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between text-xs font-black text-slate-400">
                  <span>{isZh ? "第 1 题" : "Question 1"}</span>
                  <span>{isZh ? "1 / 4" : "1 / 4"}</span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-1/4 rounded-full bg-brand-blue" />
                </div>
                <label className="mt-7 block text-base font-black text-slate-950">
                  {copy.previewQuestion} <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-400">
                  {copy.previewPlaceholder}
                </div>
                <div className="mt-5 rounded-xl bg-brand-blue px-4 py-3.5 text-center text-sm font-black text-white">
                  {copy.previewAction}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
