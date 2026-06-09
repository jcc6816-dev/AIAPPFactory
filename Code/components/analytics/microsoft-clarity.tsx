"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

export default function MicrosoftClarity() {
  const pathname = usePathname();

  // If we are not in production, don't run Clarity to save quota and avoid dev noise.
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!clarityId) {
    return null;
  }

  // Paths that contain form editors, form creators, submissions, Lark/Webhook logs, and admin pages.
  // We want to avoid session recording here to protect user privacy.
  // Also we exclude public form fill-out pages (/f/...) to prevent collecting user submissions.
  const isExcludedPath =
    pathname.includes("/forms/new") ||
    pathname.includes("/forms/") ||
    pathname.includes("/f/") ||
    pathname.includes("/admin");

  useEffect(() => {
    if (typeof window !== "undefined" && typeof (window as any).clarity === "function") {
      if (isExcludedPath) {
        // Stop Clarity collection on excluded pages
        (window as any).clarity("stop");
      }
    }
  }, [pathname, isExcludedPath]);

  // If we are on an excluded path, we don't render the script at all.
  // Note: If the user navigated from a public page to a workspace page,
  // the script would already be loaded, so the useEffect stop() call handles pausing the recording.
  if (isExcludedPath) {
    return null;
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
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
