"use client";

import { ShieldCheck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import FormRunner from "@/components/forms/form-runner";
import type { FormRecord } from "@/types/form";

export default function TestRunnerExperience({ form }: { form: FormRecord }) {
  const t = useTranslations("forms");
  const locale = useLocale();
  const isZh = locale.startsWith("zh");
  return (
    <div className="min-h-0">
      <div className="min-w-0 space-y-5">
        <section className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium leading-5 text-blue-800 sm:px-4">
          <ShieldCheck className="size-4 shrink-0 text-blue-600" />
          <span>
            {isZh
              ? `${t("test_runner_title")}：提交将保存为 TEST，不扣额度，也不会发送外部通知。`
              : `${t("test_runner_title")}: submissions are saved as TEST, use no quota, and send no external notifications.`}
          </span>
        </section>

        <FormRunner form={form} mode="test" />
      </div>
    </div>
  );
}
