"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGrowthEvent } from "@/lib/growth";

function getStoredId(key: string, prefix: string) {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(key);
  if (existing) return existing;

  const next = `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  window.localStorage.setItem(key, next);
  return next;
}

export default function GrowthTracker() {
  const pathname = usePathname();
  const enteredAtRef = useRef(Date.now());

  useEffect(() => {
    // Initialize visitor and session IDs in localStorage
    getStoredId("aiff_visitor_id", "visitor");
    getStoredId("aiff_session_id", "session");

    enteredAtRef.current = Date.now();
    trackGrowthEvent("page_view");

    const handlePageHide = () => {
      trackGrowthEvent("page_leave", {
        duration_ms: Date.now() - enteredAtRef.current,
      });
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => {
      handlePageHide();
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [pathname]);

  return null;
}
