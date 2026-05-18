"use client";

import { Badge } from "@/components/ui/badge";
import { FormRecord } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

export default function FormEditor({
  form,
  readonly = false,
}: {
  form: Pick<FormRecord, "title" | "description" | "theme" | "schema_json">;
  readonly?: boolean;
}) {
  const t = useTranslations("forms");
  const fieldCount = form.schema_json.fields.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="form-title">{t("title_label")}</Label>
          <Input
            id="form-title"
            value={form.title}
            readOnly={readonly}
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="form-theme">{t("theme_label")}</Label>
          <Input
            id="form-theme"
            value={form.theme}
            readOnly
            className="h-12 rounded-xl capitalize"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-description">{t("description_label")}</Label>
        <Textarea
          id="form-description"
          value={form.description || ""}
          readOnly={readonly}
          className="min-h-24 rounded-2xl"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold">{t("fields")}</h4>
          <Badge variant="outline">
            {t(fieldCount === 1 ? "field_count" : "field_count_other", {
              count: fieldCount,
            })}
          </Badge>
        </div>

        <div className="grid gap-3">
          {form.schema_json.fields.map((field) => (
            <div
              key={field.key}
              className="rounded-[1.3rem] border bg-background/60 p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{field.label}</p>
                <Badge variant="secondary">{field.type}</Badge>
                {field.required && <Badge>{t("required")}</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("key_label")}: {field.key}
              </p>
              {field.placeholder && (
                <p className="text-sm text-muted-foreground">
                  {t("placeholder_label")}: {field.placeholder}
                </p>
              )}
              {field.help_text && (
                <p className="text-sm text-muted-foreground">
                  {t("help_label")}: {field.help_text}
                </p>
              )}
              {field.options && field.options.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {field.options.map((option) => (
                    <Badge key={`${field.key}-${option.value}`} variant="outline">
                      {option.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="form-schema-json">{t("schema_json")}</Label>
        <Textarea
          id="form-schema-json"
          value={JSON.stringify(form.schema_json, null, 2)}
          readOnly
          className="min-h-72 rounded-2xl font-mono text-xs"
        />
      </div>
    </div>
  );
}
