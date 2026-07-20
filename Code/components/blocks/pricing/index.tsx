"use client";

import { Check, Loader } from "lucide-react";
import { PricingItem, Pricing as PricingType } from "@/types/blocks/pricing";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/icon";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useAppContext } from "@/contexts/app";
import { useLocale } from "next-intl";
import { trackGrowthEvent } from "@/lib/growth";

export default function Pricing({ pricing }: { pricing: PricingType }) {
  if (pricing.disabled) {
    return null;
  }

  const { user, setShowSignModal } = useAppContext();
  const locale = useLocale();

  const [group, setGroup] = useState(pricing.groups?.[0]?.name);
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const hasTrackedPricingView = useRef(false);

  const handleCheckout = async (item: PricingItem) => {
    try {
      if (!user) {
        trackGrowthEvent("signup_started", {
          entry_point: "pricing",
          product_id: item.product_id,
          product_name: item.product_name,
          interval: item.interval,
        });
        setShowSignModal(true);
        return;
      }

      const params = {
        product_id: item.product_id,
        locale,
      };

      setIsLoading(true);
      setProductId(item.product_id);
      trackGrowthEvent("checkout_started", {
        product_id: item.product_id,
        product_name: item.product_name,
        amount: item.amount,
        value: Number(item.amount || 0) / 100,
        currency: item.currency,
        interval: item.interval,
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (response.status === 401) {
        setIsLoading(false);
        setProductId(null);

        setShowSignModal(true);
        return;
      }

      const { code, message, data } = await response.json();
      if (code !== 0) {
        toast.error(message);
        return;
      }

      const { public_key, session_id } = data;

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(public_key);
      if (!stripe) {
        toast.error("checkout failed");
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session_id,
      });

      if (result.error) {
        toast.error(result.error.message);
      }
    } catch (e) {
      console.log("checkout failed: ", e);

      toast.error("checkout failed");
    } finally {
      setIsLoading(false);
      setProductId(null);
    }
  };

  useEffect(() => {
    if (pricing.items) {
      setGroup(pricing.items[0].group);
      setProductId(pricing.items[0].product_id);
      setIsLoading(false);
    }
  }, [pricing.items]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || hasTrackedPricingView.current || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || hasTrackedPricingView.current) {
          return;
        }
        hasTrackedPricingView.current = true;
        trackGrowthEvent("pricing_viewed", { pricing_group: group || "" });
        observer.disconnect();
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [group]);

  useEffect(() => {
    if (!pricing.name || typeof window === "undefined") {
      return;
    }

    const alignPricingAnchor = () => {
      if (window.location.hash !== `#${pricing.name}`) {
        return;
      }

      [120, 420, 840].forEach((delay) => {
        window.setTimeout(() => {
          if (!sectionRef.current) {
            return;
          }

          const root = document.documentElement;
          const previousScrollBehavior = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          window.scrollTo(
            0,
            sectionRef.current.getBoundingClientRect().top + window.scrollY - 96
          );
          window.setTimeout(() => {
            root.style.scrollBehavior = previousScrollBehavior;
          }, 80);
        }, delay);
      });
    };

    alignPricingAnchor();
    window.addEventListener("hashchange", alignPricingAnchor);

    return () => {
      window.removeEventListener("hashchange", alignPricingAnchor);
    };
  }, [pricing.name]);

  return (
    <section ref={sectionRef} id={pricing.name} className="scroll-mt-24 py-8 lg:py-10">
      <div className="container">
        <div className="mx-auto mb-6 max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-semibold lg:text-4xl">
            {pricing.title}
          </h2>
          <p className="text-muted-foreground">
            {pricing.description}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {pricing.groups && pricing.groups.length > 0 && (
            <div className="flex h-11 mb-6 items-center rounded-md bg-muted p-1 text-base">
              <RadioGroup
                value={group}
                className={`h-full grid-cols-${pricing.groups.length}`}
                onValueChange={(value) => {
                  setGroup(value);
                  trackGrowthEvent("pricing_plan_selected", { pricing_group: value });
                }}
              >
                {pricing.groups.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className='h-full rounded-md transition-all has-[button[data-state="checked"]]:bg-white'
                    >
                      <RadioGroupItem
                        value={item.name || ""}
                        id={item.name}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={item.name}
                        className="flex h-full cursor-pointer items-center justify-center px-6 font-semibold text-muted-foreground peer-data-[state=checked]:text-primary"
                      >
                        {item.title}
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 ml-1 text-primary-foreground"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}
          <div
            className={`md:min-w-96 mt-0 grid items-stretch gap-5 md:grid-cols-${
              pricing.items?.filter(
                (item) => !item.group || item.group === group
              )?.length
            }`}
          >
            {pricing.items?.map((item, index) => {
              if (item.group && item.group !== group) {
                return null;
              }

              return (
                <div
                  key={index}
                  role={item.button?.url ? "link" : undefined}
                  tabIndex={item.button?.url ? 0 : undefined}
                  onClick={() => {
                    if (item.button?.url) {
                      window.location.href = item.button.url;
                    }
                  }}
                  onKeyDown={(event) => {
                    if (item.button?.url && (event.key === "Enter" || event.key === " ")) {
                      event.preventDefault();
                      window.location.href = item.button.url;
                    }
                  }}
                  className={`rounded-lg p-5 transition-colors ${
                    item.is_featured
                      ? "border-primary border-2 bg-card text-card-foreground"
                      : "border-muted border"
                  } ${item.button?.url ? "cursor-pointer hover:border-primary hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" : ""}`}
                >
                  <div className="flex h-full flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        {item.title && (
                          <h3 className="text-xl font-semibold">
                            {item.title}
                          </h3>
                        )}
                        <div className="flex-1"></div>
                        {item.label && (
                          <Badge
                            variant="outline"
                            className="border-primary bg-primary px-1.5 text-primary-foreground"
                          >
                            {item.label}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-end gap-2 mb-3">
                        {item.original_price && (
                          <span className="text-xl text-muted-foreground font-semibold line-through">
                            {item.original_price}
                          </span>
                        )}
                        {item.price && (
                          <span className="text-4xl font-semibold">
                            {item.price}
                          </span>
                        )}
                        {item.unit && (
                          <span className="block font-semibold">
                            {item.unit}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                      <div
                        className="mt-4 flex flex-col gap-2"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {item.button?.url && (
                          <Button
                            className="w-full flex items-center justify-center gap-2 font-semibold"
                            variant={item.button.variant || "outline"}
                            asChild
                          >
                            <Link
                              href={item.button.url}
                              target={item.button.target || "_self"}
                            >
                              {item.button.title}
                              {item.button.icon && (
                                <Icon name={item.button.icon} className="size-4" />
                              )}
                            </Link>
                          </Button>
                        )}
                        {item.button && !item.button.url && (
                          <Button
                            className="w-full flex items-center justify-center gap-2 font-semibold text-white hover:text-white"
                            disabled={isLoading}
                            onClick={() => {
                              if (isLoading) {
                                return;
                              }
                              handleCheckout(item);
                            }}
                          >
                            {(!isLoading ||
                              (isLoading && productId !== item.product_id)) && (
                              <span>{item.button.title}</span>
                            )}

                            {isLoading && productId === item.product_id && (
                              <span>{item.button.title}</span>
                            )}
                            {isLoading && productId === item.product_id && (
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {item.button.icon && (
                              <Icon name={item.button.icon} className="size-4" />
                            )}
                          </Button>
                        )}
                      </div>
                      {item.features_title && (
                        <p className="mb-2.5 mt-4 font-semibold">
                          {item.features_title}
                        </p>
                      )}
                      {item.features && (
                        <ul className="flex flex-col gap-2.5">
                          {item.features.map((feature, fi) => {
                            return (
                              <li className="flex gap-2" key={`feature-${fi}`}>
                                <Check className="mt-1 size-4 shrink-0" />
                                {feature}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      {item.tip && (
                        <p className="text-muted-foreground text-sm mt-2">
                          {item.tip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
