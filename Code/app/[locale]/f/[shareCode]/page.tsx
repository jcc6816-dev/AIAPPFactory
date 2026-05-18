import { Badge } from "@/components/ui/badge";
import Empty from "@/components/blocks/empty";
import FormRunner from "@/components/forms/form-runner";
import { cn } from "@/lib/utils";
import { getFormByShareCode } from "@/services/form";
import { getTranslations } from "next-intl/server";

const pageThemes = {
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
} as const;

export default async function ({
  params,
}: {
  params: Promise<{ shareCode: string }>;
}) {
  const t = await getTranslations("forms");
  const { shareCode } = await params;
  const form = await getFormByShareCode(shareCode);
  if (!form) {
    return <Empty message={t("not_found")} />;
  }
  const pageTheme = pageThemes[form.theme];

  return (
    <div className={cn("min-h-screen overflow-hidden", pageTheme.page)}>
      <div className="relative mx-auto max-w-[1200px] px-4 py-5 md:px-8 md:py-8">
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

        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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

          <div className="relative">
            <FormRunner form={form} isPublic={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
