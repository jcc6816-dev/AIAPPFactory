"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";

function localizeHref(href: string, locale: string) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  if (href === "/") {
    return locale === "en" ? "/" : `/${locale}`;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  if (href.startsWith("/en/") || href.startsWith("/zh/")) {
    return href;
  }

  if (locale === "en") {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export default function SignUser({ user }: { user: User }) {
  const t = useTranslations();
  const locale = useLocale();
  const isZh = locale.toLowerCase().startsWith("zh");
  const avatarFallback = user.nickname?.trim()?.[0] || user.email?.trim()?.[0] || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          {user.avatar_url ? (
            <AvatarImage src={user.avatar_url} alt={user.nickname || user.email} />
          ) : null}
          <AvatarFallback>{avatarFallback.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuLabel className="text-center truncate">
          {user.nickname || user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex justify-center cursor-pointer" asChild>
          <Link href={localizeHref("/forms", locale)}>
            {isZh ? "进入工作台" : "Go to Console"}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-center cursor-pointer" asChild>
          <Link href={localizeHref("/settings", locale)}>
            {isZh ? "账户与订阅" : "Account & Billing"}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex justify-center cursor-pointer" asChild>
          <Link href={localizeHref("/my-orders", locale)}>
            {t("user.my_orders")}
          </Link>
        </DropdownMenuItem>

        {user.is_admin ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex justify-center cursor-pointer" asChild>
              <Link href={localizeHref("/admin/users", locale)} target="_blank">
                {t("user.admin_system")}
              </Link>
            </DropdownMenuItem>
          </>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex justify-center cursor-pointer"
          onClick={() => signOut()}
        >
          {t("user.sign_out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
