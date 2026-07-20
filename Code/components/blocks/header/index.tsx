"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Header as HeaderType } from "@/types/blocks/header";
import Icon from "@/components/icon";
import Link from "next/link";
import LocaleToggle from "@/components/locale/toggle";
import { Menu } from "lucide-react";
import SignToggle from "@/components/sign/toggle";
import ThemeToggle from "@/components/theme/toggle";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useState } from "react";

function localizeHref(href: string, locale: string) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  if (href === "/privacy-policy" || href === "/terms-of-service") {
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

function jumpToHashTarget(hash: string, offset = 96) {
  const targetElement = document.getElementById(hash.slice(1));
  if (!targetElement) {
    return;
  }

  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, targetElement.getBoundingClientRect().top + window.scrollY - offset);
  window.setTimeout(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  }, 80);
}

export default function Header({ header }: { header: HeaderType }) {
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    target?: string
  ) => {
    if (!href || target === "_blank" || typeof window === "undefined") {
      setMobileMenuOpen(false);
      return;
    }

    const url = new URL(href, window.location.origin);
    const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
    const targetPath = url.pathname.replace(/\/$/, "") || "/";

    if (url.hash && url.origin === window.location.origin && targetPath === currentPath) {
      event.preventDefault();
      setMobileMenuOpen(false);

      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      [220, 520, 900].forEach((delay) => {
        window.setTimeout(() => {
          jumpToHashTarget(url.hash);
        }, delay);
      });
      return;
    }

    setMobileMenuOpen(false);
  };

  if (header.disabled) {
    return null;
  }

  return (
    <section className="py-3">
      <div className="md:max-w-7xl mx-auto px-4">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            <a
              href={localizeHref(header.brand?.url || "", locale)}
              className="flex items-center gap-2"
            >
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src.replace("/logo.png", "/logo-64.png")}
                  alt={header.brand.logo.alt || header.brand.title}
                  width={32}
                  height={32}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl text-primary font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {header.nav?.items?.map((item, i) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <NavigationMenuItem
                          key={i}
                          className="text-muted-foreground"
                        >
                          <NavigationMenuTrigger>
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0 mr-2"
                              />
                            )}
                            <span>{item.title}</span>
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <ul className="w-80 p-3">
                              <NavigationMenuLink>
                                {item.children.map((iitem, ii) => (
                                  <li key={ii}>
                                    <a
                                      className={cn(
                                        "flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      )}
                                      href={localizeHref(iitem.url || "", locale)}
                                      target={iitem.target}
                                      onClick={(event) =>
                                        handleMobileLinkClick(
                                          event,
                                          localizeHref(iitem.url || "", locale),
                                          iitem.target
                                        )
                                      }
                                    >
                                      {iitem.icon && (
                                        <Icon
                                          name={iitem.icon}
                                          className="size-5 shrink-0"
                                        />
                                      )}
                                      <div>
                                        <div className="text-sm font-semibold">
                                          {iitem.title}
                                        </div>
                                        <p className="text-sm leading-snug text-muted-foreground">
                                          {iitem.description}
                                        </p>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </NavigationMenuLink>
                            </ul>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    return (
                      <NavigationMenuItem key={i}>
                        <a
                          className={cn(
                            "text-muted-foreground",
                            navigationMenuTriggerStyle,
                            buttonVariants({
                              variant: "ghost",
                            })
                          )}
                          href={localizeHref(item.url || "", locale)}
                          target={item.target}
                          onClick={(event) =>
                            handleMobileLinkClick(
                              event,
                              localizeHref(item.url || "", locale),
                              item.target
                            )
                          }
                        >
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0 mr-0"
                            />
                          )}
                          {item.title}
                        </a>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="shrink-0 flex gap-2 items-center">
            {header.show_locale && <LocaleToggle />}
            {header.show_theme && <ThemeToggle />}

            {header.buttons?.map((item, i) => {
              return (
                <Button key={i} variant={item.variant} asChild>
                  <Link
                    href={localizeHref(item.url || "", locale)}
                    target={item.target || ""}
                    onClick={(event) =>
                      handleMobileLinkClick(
                        event,
                        localizeHref(item.url || "", locale),
                        item.target
                      )
                    }
                    className="flex items-center gap-1"
                  >
                    {item.title}
                    {item.icon && (
                      <Icon name={item.icon} className="size-4 shrink-0" />
                    )}
                  </Link>
                </Button>
              );
            })}
            {header.show_sign && <SignToggle />}
          </div>
        </nav>

        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {header.brand?.logo?.src && (
                <img
                  src={header.brand.logo.src.replace("/logo.png", "/logo-64.png")}
                  alt={header.brand.logo.alt || header.brand.title}
                  width={32}
                  height={32}
                  className="w-8"
                />
              )}
              {header.brand?.title && (
                <span className="text-xl font-bold">
                  {header.brand?.title || ""}
                </span>
              )}
            </div>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="default" size="icon" aria-label={locale === "zh" ? "打开菜单" : "Open menu"}>
                  <Menu className="size-2" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      {header.brand?.logo?.src && (
                        <img
                          src={header.brand.logo.src.replace("/logo.png", "/logo-64.png")}
                          alt={header.brand.logo.alt || header.brand.title}
                          width={32}
                          height={32}
                          className="w-8"
                        />
                      )}
                      {header.brand?.title && (
                        <span className="text-xl font-bold">
                          {header.brand?.title || ""}
                        </span>
                      )}
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mb-8 mt-8 flex flex-col gap-4">
                  <Accordion type="single" collapsible className="w-full">
                    {header.nav?.items?.map((item, i) => {
                      if (item.children && item.children.length > 0) {
                        return (
                          <AccordionItem
                            key={i}
                            value={item.title || ""}
                            className="border-b-0"
                          >
                            <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline text-left">
                              {item.title}
                            </AccordionTrigger>
                            <AccordionContent className="mt-2">
                              {item.children.map((iitem, ii) => (
                                <a
                                  key={ii}
                                  className={cn(
                                    "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  )}
                                  href={localizeHref(iitem.url || "", locale)}
                                  target={iitem.target}
                                  onClick={(event) =>
                                    handleMobileLinkClick(
                                      event,
                                      localizeHref(iitem.url || "", locale),
                                      iitem.target
                                    )
                                  }
                                >
                                  {iitem.icon && (
                                    <Icon
                                      name={iitem.icon}
                                      className="size-4 shrink-0"
                                    />
                                  )}
                                  <div>
                                    <div className="text-sm font-semibold">
                                      {iitem.title}
                                    </div>
                                    <p className="text-sm leading-snug text-muted-foreground">
                                      {iitem.description}
                                    </p>
                                  </div>
                                </a>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      }
                      return (
                        <a
                          key={i}
                          href={localizeHref(item.url || "", locale)}
                          target={item.target}
                          onClick={(event) =>
                            handleMobileLinkClick(
                              event,
                              localizeHref(item.url || "", locale),
                              item.target
                            )
                          }
                          className="font-semibold my-4 flex items-center gap-2"
                        >
                          {item.title}
                          {item.icon && (
                            <Icon
                              name={item.icon}
                              className="size-4 shrink-0"
                            />
                          )}
                        </a>
                      );
                    })}
                  </Accordion>
                </div>
                <div className="flex-1"></div>
                <div className="border-t pt-4">
                  <div className="mt-2 flex flex-col gap-3">
                    {header.buttons?.map((item, i) => {
                      return (
                        <Button key={i} variant={item.variant} asChild>
                          <Link
                            href={localizeHref(item.url || "", locale)}
                            target={item.target || ""}
                            onClick={(event) =>
                              handleMobileLinkClick(
                                event,
                                localizeHref(item.url || "", locale),
                                item.target
                              )
                            }
                            className="flex items-center gap-1"
                          >
                            {item.title}
                            {item.icon && (
                              <Icon
                                name={item.icon}
                                className="size-4 shrink-0"
                              />
                            )}
                          </Link>
                        </Button>
                      );
                    })}

                    {header.show_sign && <SignToggle />}
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    {header.show_locale && <LocaleToggle />}
                    <div className="flex-1"></div>

                    {header.show_theme && <ThemeToggle />}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
}
