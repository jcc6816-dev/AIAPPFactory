import QRCode from "qrcode";
import { getTranslations } from "next-intl/server";

export default async function ShareQrCard({ shareUrl }: { shareUrl: string }) {
  const t = await getTranslations("forms");
  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    margin: 1,
    width: 220,
  });

  return (
    <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
        <img
          src={qrDataUrl}
          alt={t("qr_code_alt")}
          width={180}
          height={180}
          className="rounded-[1.4rem] border bg-white p-3 shadow-sm"
        />
        <div className="space-y-2">
          <div className="inline-flex rounded-full border bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t("share_fill_out")}
          </div>
          <h3 className="text-lg font-semibold tracking-tight">{t("qr_code_title")}</h3>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            {t("qr_code_description")}
          </p>
          <p className="break-all rounded-xl border bg-white/70 px-3 py-2 font-mono text-xs text-muted-foreground">
            {shareUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
