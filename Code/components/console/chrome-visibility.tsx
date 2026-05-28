"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

const consolePrefixes = [
  "/forms",
  "/my-orders",
  "/my-credits",
  "/my-invites",
  "/api-keys",
  "/settings",
  "/support",
  "/skills",
];

export default function ChromeVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/(zh|en)(?=\/)/, "");
  const isConsolePath = consolePrefixes.some(
    (prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
  );

  if (isConsolePath) {
    return null;
  }

  return <>{children}</>;
}
