"use client";

import { Loader2, Save } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { FormRecord, OcrTemplate } from "@/types/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function OcrSettingsForm({
  form,
}: {
  form: Pick<FormRecord, "uuid" | "ocr_template">;
}) {
  const t = useTranslations("forms");
  const [ocrTemplate, setOcrTemplate] = useState<OcrTemplate>(
    form.ocr_template || "general_image"
  );
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/forms/${form.uuid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ocr_template: ocrTemplate,
          }),
        });

        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || "save OCR settings failed");
        }

        toast.success(t("ocr_settings_saved"));
      } catch (error: any) {
        toast.error(error.message || "save OCR settings failed");
      }
    });
  }

  const descriptionKey =
    ocrTemplate === "invoice"
      ? "ocr_template_invoice_tip"
      : ocrTemplate === "receipt"
        ? "ocr_template_receipt_tip"
        : ocrTemplate === "id_card"
          ? "ocr_template_id_card_tip"
          : "ocr_template_general_image_tip";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          {t("ocr_badge")}
        </div>
        <h3 className="text-lg font-semibold tracking-tight">
          {t("ocr_settings_title")}
        </h3>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          {t("ocr_settings_description")}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{t("ocr_template_label")}</Label>
        <Select
          value={ocrTemplate}
          onValueChange={(value) => setOcrTemplate(value as OcrTemplate)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("ocr_template_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general_image">
              {t("ocr_template_general_image")}
            </SelectItem>
            <SelectItem value="invoice">{t("ocr_template_invoice")}</SelectItem>
            <SelectItem value="receipt">{t("ocr_template_receipt")}</SelectItem>
            <SelectItem value="id_card">{t("ocr_template_id_card")}</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs leading-6 text-muted-foreground">
          {t(descriptionKey)}
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isPending} className="rounded-xl">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {t("save_ocr_settings")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
