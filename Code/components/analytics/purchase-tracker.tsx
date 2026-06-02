"use client";

import { useEffect } from "react";

import { trackGrowthEvent } from "@/lib/growth";

export default function PurchaseTracker({
  transactionId,
  value,
  currency,
}: {
  transactionId: string;
  value: number;
  currency: string;
}) {
  useEffect(() => {
    const storageKey = `genforms_purchase:${transactionId}`;
    if (window.sessionStorage.getItem(storageKey)) return;

    window.sessionStorage.setItem(storageKey, "1");
    trackGrowthEvent("purchase_completed", {
      transaction_id: transactionId,
      value,
      currency: currency.toUpperCase(),
    });
  }, [currency, transactionId, value]);

  return null;
}
