"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackGrowthEvent } from "@/lib/growth";

export default function GrowthTracker() {
  const pathname = usePathname();
  const enteredAtRef = useRef(Date.now());

  useEffect(() => {
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
