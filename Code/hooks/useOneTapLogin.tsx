"use client";

import googleOneTap from "google-one-tap";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function (showSignModal: boolean) {
  const { data: session, status } = useSession();

  const isEnabled =
    process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === "true" &&
    !!process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;

  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isSignInPage = pathname.includes("/login") || pathname.includes("/signin");
  const shouldTrigger = isEnabled && (showSignModal || isSignInPage);

  const oneTapLogin = async function () {
    const options = {
      client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
      auto_select: false,
      cancel_on_tap_outside: false,
      context: "signin",
    };

    googleOneTap(options, (response: any) => {
      console.log("onetap login ok", response);
      handleLogin(response.credential);
    });
  };

  const handleLogin = async function (credentials: string) {
    const res = await signIn("google-one-tap", {
      credential: credentials,
      redirect: false,
    });
    console.log("signIn ok", res);
  };

  useEffect(() => {
    if (status === "unauthenticated" && shouldTrigger) {
      oneTapLogin();

      const intervalId = setInterval(() => {
        oneTapLogin();
      }, 3000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [status, shouldTrigger]);

  return <></>;
}
