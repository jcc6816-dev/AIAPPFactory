"use client";

import Icon from "@/components/icon";
import Link from "next/link";
import { NavItem } from "@/types/blocks/base";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function ({
  className,
  items,
  ...props
}: {
  className?: string;
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex items-center gap-1 rounded-2xl bg-slate-100 p-1 border border-slate-200/50",
        className
      )}
      {...props}
    >
      {items.map((item, index) => {
        const isActive =
          Boolean(item.is_active) ||
          pathname === item.url ||
          pathname.endsWith(item.url || "") ||
          pathname.includes(`${item.url}/`);

        return (
          <Link
            key={index}
            href={item.url || ""}
            className={cn(
              "inline-flex h-9 items-center justify-center rounded-xl px-5 text-[13px] font-bold transition-all",
              isActive
                ? "bg-white text-brand-blue shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
