"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SiGithub, SiGmail, SiGoogle } from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { useAppContext } from "@/contexts/app";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackGrowthEvent } from "@/lib/growth";

export default function SignModal() {
  const t = useTranslations();
  const { showSignModal, setShowSignModal } = useAppContext();

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={showSignModal} onOpenChange={setShowSignModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("sign_modal.sign_in_title")}</DialogTitle>
            <DialogDescription>
              {t("sign_modal.sign_in_description")}
            </DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={showSignModal} onOpenChange={setShowSignModal}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t("sign_modal.sign_in_title")}</DrawerTitle>
          <DrawerDescription>
            {t("sign_modal.sign_in_description")}
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-4">
          <DrawerClose asChild>
            <Button variant="outline">{t("sign_modal.cancel_title")}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const isFormsNew = pathname.includes("/forms/new");
  const callbackUrl =
    searchParams.get("callbackUrl") ||
    (isFormsNew && typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/forms");
  const [devEmail, setDevEmail] = useState(
    process.env.NEXT_PUBLIC_AUTH_DEV_EMAIL || "dev@local.aifactory"
  );
  const isGoogleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === "true";
  const isGithubEnabled = process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === "true";
  const isDevEnabled = process.env.NEXT_PUBLIC_AUTH_DEV_ENABLED === "true";
  const hasAnyProvider = isGoogleEnabled || isGithubEnabled || isDevEnabled;

  function trackSignupStart(provider: string) {
    trackGrowthEvent("signup_started", {
      provider,
      callback_url: callbackUrl,
      entry_point: "signin_modal",
    });
  }

  return (
    <div className={cn("grid items-start gap-4", className)}>
      {/* <div className="grid gap-2">
        <Label htmlFor="email">{t("sign_modal.email_title")}</Label>
        <Input type="email" id="email" placeholder="xxx@xxx.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">{t("sign_modal.password_title")}</Label>
        <Input id="password" type="password" />
      </div>
      <Button type="submit" className="w-full flex items-center gap-2">
        <SiGmail className="w-4 h-4" />
        {t("sign_modal.email_sign_in")}
      </Button> */}

      {isGoogleEnabled && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => {
            trackSignupStart("google");
            signIn("google", { callbackUrl });
          }}
        >
          <SiGoogle className="w-4 h-4" />
          {t("sign_modal.google_sign_in")}
        </Button>
      )}

      {isGithubEnabled && (
        <Button
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => {
            trackSignupStart("github");
            signIn("github", { callbackUrl });
          }}
        >
          <SiGithub className="w-4 h-4" />
          {t("sign_modal.github_sign_in")}
        </Button>
      )}

      {isDevEnabled && (
        <div className="grid gap-3 rounded-lg border border-dashed p-4">
          <div className="grid gap-2">
            <Label htmlFor="dev-modal-email">{t("sign_modal.dev_email")}</Label>
            <Input
              id="dev-modal-email"
              type="email"
              value={devEmail}
              onChange={(event) => setDevEmail(event.target.value)}
              placeholder="dev@local.aifactory"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => {
              trackSignupStart("dev-login");
              signIn("dev-login", {
                email: devEmail,
                callbackUrl,
              });
            }}
          >
            {t("sign_modal.dev_sign_in")}
          </Button>
        </div>
      )}

      {!hasAnyProvider && (
        <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          {t("sign_modal.no_provider")}
        </div>
      )}
    </div>
  );
}
