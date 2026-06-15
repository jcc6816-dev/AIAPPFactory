"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function MicrosoftClarity() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Now we are safely on client-side, we can perform a synchronous check of window.location.search
  const urlParams = new URLSearchParams(window.location.search);
  const sensitiveParams = [
    "prompt",
    "callbackurl",
    "email",
    "token",
    "code",
    "state",
    "answer",
    "answers",
    "clarification",
    "clarification_answers"
  ];
  let hasSensitiveQuery = false;
  urlParams.forEach((_, key) => {
    if (sensitiveParams.includes(key.toLowerCase())) {
      hasSensitiveQuery = true;
    }
  });

  // If we are not in production, don't run Clarity to save quota and avoid dev noise.
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) {
    return null;
  }

  let cleanPath = pathname.replace(/^\/(?:en|en-US|zh|zh-CN|zh-TW|zh-HK|zh-MO|ja|ko|ru|fr|de|ar|es|it)(?=\/|$)/, "") || "/";
  if (cleanPath !== "/" && cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const isExcludedPath =
    (cleanPath.startsWith("/forms/") && cleanPath !== "/forms/new") ||
    cleanPath === "/forms" ||
    cleanPath.startsWith("/f/") ||
    cleanPath === "/f" ||
    cleanPath.startsWith("/admin/") ||
    cleanPath === "/admin";

  const shouldExclude = isExcludedPath || hasSensitiveQuery;

  if (shouldExclude) {
    if (typeof (window as any).clarity === "function") {
      // Stop Clarity collection on excluded pages
      (window as any).clarity("stop");
    }
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  );
}
