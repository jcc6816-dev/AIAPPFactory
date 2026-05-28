"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLocale } from "next-intl";

export default function WebhookRetryButton({
  formId,
  logId,
}: {
  formId: string;
  logId: string;
}) {
  const router = useRouter();
  const locale = useLocale();
  const isZh = locale.toLowerCase().startsWith("zh");
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    startTransition(async () => {
      try {
        const response = await fetch(
          `/api/forms/${formId}/webhook-logs/${logId}/retry`,
          {
            method: "POST",
          }
        );
        const result = await response.json();
        if (result.code !== 0) {
          throw new Error(result.message || "retry webhook failed");
        }

        toast.success(isZh ? "Webhook 重试已完成" : "Webhook retry completed");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || (isZh ? "Webhook 重试失败" : "Webhook retry failed"));
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 rounded-lg px-3 text-xs font-bold"
      disabled={isPending}
      onClick={handleRetry}
    >
      {isPending ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
      )}
      {isZh ? "重试" : "Retry"}
    </Button>
  );
}
