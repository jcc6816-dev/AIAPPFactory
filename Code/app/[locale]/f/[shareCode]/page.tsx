import { Badge } from "@/components/ui/badge";
import Empty from "@/components/blocks/empty";
import FormRunner from "@/components/forms/form-runner";
import { cn } from "@/lib/utils";
import { getFormByShareCode, isFormPublished } from "@/services/form";
import { getTranslations } from "next-intl/server";
import { FormTheme } from "@/types/form";

interface PageThemeSetting {
  page: string;
  haloOne: string;
  haloTwo: string;
  badge: string;
  metric: string;
  storyPanel: string;
  title: string;
  description: string;
  storyKey: string;
}

const pageThemes: Record<FormTheme, PageThemeSetting> = {
  minimal: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(255,247,237,1),rgba(250,250,249,1)_45%,rgba(245,245,244,1))] text-stone-900",
    haloOne: "bg-orange-200/45",
    haloTwo: "bg-amber-100/60",
    badge: "border-white/70 bg-white/80 text-stone-600",
    metric: "border-white/70 bg-white/72 text-stone-700",
    storyPanel: "border-white/70 bg-white/60 text-stone-700",
    title: "text-stone-950",
    description: "text-stone-600",
    storyKey: "share_theme_story_minimal",
  },
  business: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(239,246,255,1),rgba(248,250,252,1)_45%,rgba(226,232,240,1))] text-slate-900",
    haloOne: "bg-sky-200/50",
    haloTwo: "bg-indigo-100/60",
    badge: "border-white/70 bg-white/85 text-slate-600",
    metric: "border-white/70 bg-white/76 text-slate-700",
    storyPanel: "border-white/70 bg-white/66 text-slate-700",
    title: "text-slate-950",
    description: "text-slate-600",
    storyKey: "share_theme_story_business",
  },
  dark: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(30,41,59,1),rgba(15,23,42,1)_38%,rgba(2,6,23,1))] text-slate-100",
    haloOne: "bg-sky-500/12",
    haloTwo: "bg-indigo-500/12",
    badge: "border-white/10 bg-white/5 text-slate-300",
    metric: "border-white/10 bg-white/[0.06] text-slate-200",
    storyPanel: "border-white/10 bg-white/[0.04] text-slate-300",
    title: "text-white",
    description: "text-slate-300",
    storyKey: "share_theme_story_dark",
  },
  brutalism: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(254,240,138,1),rgba(252,211,77,1)_60%,rgba(245,158,11,1))] text-black",
    haloOne: "bg-transparent",
    haloTwo: "bg-transparent",
    badge: "border-[2px] border-black bg-emerald-300 text-black font-black uppercase",
    metric: "border-[2px] border-black bg-cyan-200 text-black font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)]",
    storyPanel: "border-[2px] border-black bg-white text-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]",
    title: "text-black font-black font-sans leading-none",
    description: "text-stone-900 font-bold",
    storyKey: "share_theme_story_minimal",
  },
  retro: {
    page:
      "bg-[#f4f1ea] bg-[radial-gradient(rgba(120,110,90,0.05)_1px,transparent_1px)] bg-[size:16px_16px] text-stone-900",
    haloOne: "bg-transparent",
    haloTwo: "bg-transparent",
    badge: "border-stone-300 bg-stone-100/50 text-stone-600 font-serif italic",
    metric: "border-stone-300 bg-[#faf8f4]/90 text-stone-700 font-serif shadow-sm",
    storyPanel: "border-stone-250 bg-[#faf8f4]/80 text-stone-650 font-serif shadow-sm",
    title: "text-stone-950 font-serif font-semibold tracking-tight",
    description: "text-stone-600 font-serif leading-relaxed",
    storyKey: "share_theme_story_minimal",
  },
  moss: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(244,246,244,1),rgba(232,237,231,1)_60%,rgba(216,226,214,1))] text-stone-900",
    haloOne: "bg-emerald-100/40",
    haloTwo: "bg-green-100/50",
    badge: "border-stone-300 bg-white/80 text-emerald-800",
    metric: "border-stone-300 bg-white/70 text-stone-700",
    storyPanel: "border-stone-300 bg-white/60 text-stone-700",
    title: "text-emerald-950 font-sans tracking-tight font-semibold",
    description: "text-stone-700 font-sans",
    storyKey: "share_theme_story_minimal",
  },
  sunset: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(255,245,245,1),rgba(254,215,215,1)_50%,rgba(249,168,212,1))] text-rose-950",
    haloOne: "bg-rose-200/40",
    haloTwo: "bg-fuchsia-200/30",
    badge: "border-rose-200 bg-white/80 text-rose-600 font-serif italic",
    metric: "border-rose-200 bg-white/70 text-rose-800 font-serif",
    storyPanel: "border-rose-100 bg-white/60 text-rose-800 font-serif",
    title: "text-rose-950 font-serif font-bold tracking-tight",
    description: "text-rose-900 font-serif leading-relaxed",
    storyKey: "share_theme_story_minimal",
  },
  neon: {
    page:
      "bg-[radial-gradient(circle_at_top,rgba(12,10,9,1),rgba(28,25,23,1)_50%,rgba(0,0,0,1))] text-zinc-100",
    haloOne: "bg-lime-500/12",
    haloTwo: "bg-emerald-500/10",
    badge: "border-lime-500/30 bg-lime-500/10 text-lime-400 font-mono",
    metric: "border-zinc-800 bg-zinc-900/60 text-zinc-300 font-mono",
    storyPanel: "border-zinc-800 bg-zinc-900/40 text-zinc-300 font-mono",
    title: "text-white font-mono font-bold tracking-tight",
    description: "text-zinc-400 font-mono leading-relaxed",
    storyKey: "share_theme_story_dark",
  },
};

export default async function ({
  params,
}: {
  params: Promise<{ locale: string; shareCode: string }>;
}) {
  const t = await getTranslations("forms");
  const { locale, shareCode } = await params;
  const form = await getFormByShareCode(shareCode);
  if (!form || !isFormPublished(form)) {
    return <Empty message={t("not_found")} />;
  }
  const pageTheme = pageThemes[form.theme];
  const themeVariant = form.schema_json.aspects?.themeVariant || "default";
  const isEffectActive = themeVariant === "gradient-flow" || themeVariant === "glass";

  return (
    <div 
      className={cn(
        "fp-root min-h-screen overflow-hidden", 
        isEffectActive ? "bg-transparent" : pageTheme.page
      )}
      data-theme={form.theme}
      data-variant={themeVariant}
    >
      <div className="relative mx-auto max-w-[1200px] px-4 py-5 md:px-8 md:py-8">
        {!isEffectActive && (
          <>
            <div
              className={cn(
                "pointer-events-none absolute right-[-5rem] top-10 size-44 rounded-full blur-3xl md:size-[300px]",
                pageTheme.haloOne
              )}
            />
            <div
              className={cn(
                "pointer-events-none absolute bottom-20 left-[-6rem] size-52 rounded-full blur-3xl md:size-[400px]",
                pageTheme.haloTwo
              )}
            />
          </>
        )}

        {/* 当表单配置了插画时，使用全宽布局让 Split 双栏充分展开 */}
        <div className={cn(
          "relative grid gap-8",
          form.schema_json.aspects?.welcomeImage
            ? "grid-cols-1"
            : "lg:grid-cols-[0.9fr_1.1fr] lg:items-start"
        )}>
          {/* 左侧品牌信息栏 — 仅在无插画时显示 */}
          {!form.schema_json.aspects?.welcomeImage && (
          <div className="hidden lg:block space-y-5 px-1 pt-2 md:px-2 lg:sticky lg:top-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn("capitalize", pageTheme.badge)}>{form.theme}</Badge>
              <Badge variant="outline" className={cn(pageTheme.badge)}>
                {t("share_fill_out")}
              </Badge>
            </div>

            <div className="space-y-4">
              <p className={cn("text-[11px] font-semibold uppercase tracking-[0.28em]", pageTheme.description)}>
                {t("share_brand_kicker")}
              </p>
              <h1
                className={cn(
                  "max-w-2xl text-4xl font-semibold leading-[1.04] tracking-tight md:text-5xl lg:text-6xl",
                  pageTheme.title
                )}
              >
                {form.title}
              </h1>
              <p
                className={cn(
                  "max-w-xl text-base leading-8 md:text-lg",
                  pageTheme.description
                )}
              >
                {form.description || t("share_description_fallback")}
              </p>
            </div>

            <div className={cn("rounded-2xl border px-4 py-3 text-sm shadow-sm backdrop-blur-sm", pageTheme.metric)}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {t("share_stat_estimate_label")}
                  </p>
                  <p className="mt-1 font-semibold">{t("share_stat_estimate_value")}</p>
                </div>
                <div className="h-6 w-px bg-current/10" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {t("share_stat_access_label")}
                  </p>
                  <p className="mt-1 font-semibold">{t("share_stat_access_value")}</p>
                </div>
                <div className="h-6 w-px bg-current/10" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {t("share_stat_device_label")}
                  </p>
                  <p className="mt-1 font-semibold">{t("share_stat_device_value")}</p>
                </div>
              </div>
            </div>

            <div className={cn("rounded-[1.6rem] border p-5 shadow-sm backdrop-blur-sm", pageTheme.storyPanel)}>
              <p className="text-[11px] uppercase tracking-[0.24em] opacity-70">
                {t("share_story_label")}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-7">
                {t(pageTheme.storyKey)}
              </p>
            </div>

            <div className="hidden lg:block">
              <div className="space-y-3">
                <div className={cn("inline-flex rounded-full border px-4 py-2 text-sm", pageTheme.badge)}>
                  {t("share_mobile_first_badge")}
                </div>
                <p className={cn("max-w-md text-sm leading-7", pageTheme.description)}>
                  {t("share_premium_hint")}
                </p>
              </div>
            </div>
          </div>
          )}

          <div className="relative">
            <FormRunner form={form} isPublic={true} />
          </div>
        </div>

        {/* Viral Growth Badge */}
        <div className="mt-12 flex justify-center pb-6">
          <a
            href={locale === "zh" ? "/zh?utm_source=viral_badge" : "/?utm_source=viral_badge"}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all hover:scale-105 hover:shadow-md",
              form.theme === "dark" || form.theme === "neon"
                ? "border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white"
                : form.theme === "brutalism"
                ? "border-[2px] border-black bg-emerald-300 text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:bg-emerald-250"
                : form.theme === "retro"
                ? "border-stone-300 bg-[#faf8f4]/90 text-stone-600 font-serif"
                : "border-slate-200 bg-white/90 text-slate-600 hover:border-slate-300 hover:text-slate-900"
            )}
          >
            <img src="/logo.png" alt="GenForms.ai" className="size-4 object-contain" />
            <span>
              {locale === "zh"
                ? "由 GenForms.ai 驱动 - 免费制作高颜值表单"
                : "Powered by GenForms.ai - Create yours free"}
            </span>
          </a>
        </div>

      </div>
    </div>
  );
}
