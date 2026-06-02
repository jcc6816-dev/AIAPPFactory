"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { trackGrowthEvent } from "@/lib/growth";

const STORAGE_KEY = "genforms_auth_conversion_event";

export default function AuthConversionTracker() {
  const { data: session } = useSession();
  const authEvent = session?.auth_conversion_event;

  useEffect(() => {
    if (!authEvent || window.localStorage.getItem(STORAGE_KEY) === authEvent.id) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, authEvent.id);
    trackGrowthEvent(authEvent.type === "sign_up" ? "user_signed_up" : "user_signed_in");
  }, [authEvent]);

  return null;
}
