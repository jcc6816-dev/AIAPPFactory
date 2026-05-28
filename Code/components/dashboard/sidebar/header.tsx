"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

import { Brand as BrandType } from "@/types/blocks/base";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useLocale } from "next-intl";

function localizeHref(href: string, locale: string) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  if (href.startsWith(`/${locale}/`) || href === `/${locale}`) {
    return href;
  }

  if (href.startsWith("/en/") || href.startsWith("/zh/")) {
    return href;
  }

  return href.startsWith("/") ? `/${locale}${href}` : href;
}

export default function ({ brand }: { brand: BrandType }) {
  const locale = useLocale();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <Link
            href={localizeHref(brand?.url || "javascript:void(0)", locale)}
            className="flex items-center gap-1 py-2"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
              <img
                src={brand?.logo?.src}
                alt={brand?.logo?.alt || brand?.title}
                className="size-6"
              />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
              <span className="truncate font-medium">{brand?.title}</span>
            </div>
            {/* {open && <SidebarTrigger />} */}
          </Link>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
