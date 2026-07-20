"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import FirstSuccessActionRail from "@/components/forms/first-success-action-rail";
import FormRunner from "@/components/forms/form-runner";
import { Button } from "@/components/ui/button";
import type { FormRecord } from "@/types/form";

export default function TestRunnerExperience({ form }: { form: FormRecord }) {
  const locale = useLocale();
  const t = useTranslations("forms");
  const isZh = locale.toLowerCase().startsWith("zh");
  const [mobilePrimaryLabel, setMobilePrimaryLabel] = useState(t("next"));

  useEffect(() => {
    const syncPrimaryLabel = () => {
      const primary = document.querySelector<HTMLButtonElement>(
        '[data-test-primary="true"]'
      );
      const label = primary?.textContent?.trim();
      if (label) setMobilePrimaryLabel(label);
    };

    syncPrimaryLabel();
    const observer = new MutationObserver(syncPrimaryLabel);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  function handleRailPrimary() {
    const primary = document.querySelector<HTMLButtonElement>(
      '[data-test-primary="true"]'
    );
    primary?.click();
  }

  return (
    <div className="flex min-h-0 gap-5">
      <div className="min-w-0 flex-1 space-y-5 pb-20 md:pb-0">
        <section className="sticky top-0 z-30 rounded-2xl border border-amber-200 bg-amber-50/95 px-4 py-4 shadow-sm backdrop-blur sm:px-5">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
              <ShieldCheck className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-wide text-amber-800">
                {t("test_runner_title")}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {t("test_runner_description")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-amber-900">
                <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1">
                  {t("test_free_badge")}
                </span>
                <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1">
                  {t("test_saved_badge")}
                </span>
                <span className="rounded-full border border-amber-200 bg-white px-2.5 py-1">
                  {t("test_no_notifications_badge")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <FormRunner form={form} mode="test" />
      </div>
      <FirstSuccessActionRail
        state="testing"
        locale={locale}
        title={isZh ? "正在测试" : "Testing"}
        primaryLabel={t("test_submit")}
        onPrimary={handleRailPrimary}
        secondaryActions={[
          {
            label: isZh ? "退出测试" : "Exit test",
            href: `/${locale}/forms/${form.uuid}/publish`,
          },
        ]}
      />
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-12 shrink-0 rounded-xl px-4 text-xs font-black"
          >
            <a href={`/${locale}/forms/${form.uuid}/publish`}>
              {isZh ? "退出" : "Exit"}
            </a>
          </Button>
          <Button
            type="button"
            onClick={handleRailPrimary}
            className="h-12 min-w-0 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-black text-white hover:bg-blue-700"
          >
            {mobilePrimaryLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
