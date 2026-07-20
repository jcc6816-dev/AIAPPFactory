"use client";

import { Loader2, Save, Send } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { FormRecord, WebhookAuthMode, WebhookProvider } from "@/types/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function WebhookSettingsForm({
  form,
}: {
  form: Pick<
    FormRecord,
    | "uuid"
    | "webhook_enabled"
    | "webhook_url_configured"
    | "webhook_url_masked"
    | "webhook_provider"
    | "webhook_auth_mode"
    | "webhook_header_name"
  >;
}) {
  const t = useTranslations("forms");
  const [enabled, setEnabled] = useState(Boolean(form.webhook_enabled));
  const [url, setUrl] = useState("");
  const [urlChanged, setUrlChanged] = useState(false);
  const [urlConfigured, setUrlConfigured] = useState(
    Boolean(form.webhook_url_configured)
  );
  const [urlMasked, setUrlMasked] = useState(form.webhook_url_masked || "");
  const [provider, setProvider] = useState<WebhookProvider>(
    form.webhook_provider || "generic"
  );
  const [secret, setSecret] = useState("");
  const [authMode, setAuthMode] = useState(form.webhook_auth_mode || "none");
  const [keyword, setKeyword] = useState("");
  const [headerName, setHeaderName] = useState(
    form.webhook_header_name || "X-Webhook-Keyword"
  );
  const [isPending, startTransition] = useTransition();
  const [isTesting, startTestTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/forms/${form.uuid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            webhook_enabled: enabled,
            ...(urlChanged ? { webhook_url: url } : {}),
            webhook_provider: provider,
            webhook_secret: secret,
            webhook_auth_mode: authMode,
            webhook_keyword: keyword,
            webhook_header_name: headerName,
          }),
        });

        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || "save webhook failed");
        }

        setSecret("");
        setKeyword("");
        setUrl("");
        setUrlChanged(false);
        setUrlConfigured(Boolean(result.data?.webhook_url_configured));
        setUrlMasked(result.data?.webhook_url_masked || "");
        toast.success(t("webhook_settings_saved"));
      } catch (error: any) {
        toast.error(error.message || "save webhook failed");
      }
    });
  }

  function handleTestSend() {
    startTestTransition(async () => {
      try {
        const response = await fetch(`/api/forms/${form.uuid}/webhook-test`, {
          method: "POST",
        });
        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || "test send failed");
        }

        toast.success(t("webhook_test_sent"));
      } catch (error: any) {
        toast.error(error.message || t("webhook_test_failed"));
      }
    });
  }

  const showSecret =
    provider === "generic"
      ? authMode === "signature"
      : provider === "feishu_bot" || provider === "dingtalk_bot";
  const showKeyword =
    provider === "generic"
      ? ["query_keyword", "header_keyword", "body_keyword"].includes(authMode)
      : provider === "feishu_bot" || provider === "dingtalk_bot";
  const showHeaderName = provider === "generic" && authMode === "header_keyword";
  const providerDescriptionKey =
    provider === "feishu_bot"
      ? "webhook_provider_feishu_tip"
      : provider === "dingtalk_bot"
        ? "webhook_provider_dingtalk_tip"
        : provider === "wecom_bot"
          ? "webhook_provider_wecom_tip"
          : provider === "slack_bot"
            ? "webhook_provider_slack_tip"
            : "webhook_provider_generic_tip";

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t("webhook_badge")}
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{t("webhook_settings_title")}</h3>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {t("webhook_settings_description")}
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="webhook-url">{t("webhook_url_label")}</Label>
        <Input
          id="webhook-url"
          type="password"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setUrlChanged(true);
          }}
          placeholder={urlMasked || t("webhook_url_placeholder")}
        />
        <p className="text-xs text-muted-foreground">
          {urlConfigured
            ? t("webhook_url_configured")
            : t("webhook_url_not_configured")}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{t("webhook_provider_label")}</Label>
        <Select
          value={provider}
          onValueChange={(value) => {
            const nextProvider = value as WebhookProvider;
            setProvider(nextProvider);
            if (nextProvider === "wecom_bot" || nextProvider === "slack_bot") {
              setAuthMode("none");
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("webhook_provider_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="generic">{t("webhook_provider_generic")}</SelectItem>
            <SelectItem value="feishu_bot">
              {t("webhook_provider_feishu")}
            </SelectItem>
            <SelectItem value="dingtalk_bot">
              {t("webhook_provider_dingtalk")}
            </SelectItem>
            <SelectItem value="wecom_bot">
              {t("webhook_provider_wecom")}
            </SelectItem>
            <SelectItem value="slack_bot">
              {t("webhook_provider_slack")}
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs leading-6 text-muted-foreground">
          {t(providerDescriptionKey)}
        </p>
      </div>

      <div className="space-y-2">
        <Label>{t("webhook_auth_mode_label")}</Label>
        <Select
          value={authMode}
          onValueChange={(value) => setAuthMode(value as WebhookAuthMode)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("webhook_auth_mode_placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {provider === "generic" ? (
              <>
                <SelectItem value="none">{t("webhook_auth_mode_none")}</SelectItem>
                <SelectItem value="query_keyword">
                  {t("webhook_auth_mode_query_keyword")}
                </SelectItem>
                <SelectItem value="header_keyword">
                  {t("webhook_auth_mode_header_keyword")}
                </SelectItem>
                <SelectItem value="body_keyword">
                  {t("webhook_auth_mode_body_keyword")}
                </SelectItem>
                <SelectItem value="signature">
                  {t("webhook_auth_mode_signature")}
                </SelectItem>
              </>
            ) : provider === "wecom_bot" || provider === "slack_bot" ? (
              <SelectItem value="none">{t("webhook_auth_mode_none")}</SelectItem>
            ) : (
              <>
                <SelectItem value="none">{t("webhook_auth_mode_none")}</SelectItem>
                <SelectItem value="keyword">
                  {t("webhook_auth_mode_keyword")}
                </SelectItem>
                <SelectItem value="signature">
                  {t("webhook_auth_mode_signature")}
                </SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {showSecret && (
        <div className="space-y-2">
          <Label htmlFor="webhook-secret">{t("webhook_secret_label")}</Label>
          <Input
            id="webhook-secret"
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            placeholder={t("webhook_secret_placeholder")}
          />
          <p className="text-xs text-muted-foreground">
            {t("webhook_secret_tip")}
          </p>
        </div>
      )}

      {showKeyword && (
        <>
          <div className="space-y-2">
            <Label htmlFor="webhook-keyword">{t("webhook_keyword_label")}</Label>
            <Input
              id="webhook-keyword"
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={t("webhook_keyword_placeholder")}
            />
          </div>

          {showHeaderName && (
            <div className="space-y-2">
              <Label htmlFor="webhook-header-name">
                {t("webhook_header_name_label")}
              </Label>
              <Input
                id="webhook-header-name"
                value={headerName}
                onChange={(event) => setHeaderName(event.target.value)}
                placeholder={t("webhook_header_name_placeholder")}
              />
            </div>
          )}
        </>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        {provider === "slack_bot" && (
          <Button
            type="button"
            variant="outline"
            onClick={handleTestSend}
            disabled={
              isPending ||
              isTesting ||
              !enabled ||
              !urlConfigured ||
              urlChanged
            }
            className="rounded-xl"
          >
            {isTesting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {t("webhook_test_send")}
          </Button>
        )}
        <Button onClick={handleSave} disabled={isPending} className="rounded-xl">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            <>
              <Save className="size-4" />
              {t("save_webhook")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
