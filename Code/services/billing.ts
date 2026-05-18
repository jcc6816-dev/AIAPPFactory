import {
  CreditsAmount,
  CreditsTransType,
  decreaseCredits,
  getUserCredits,
  increaseCredits,
} from "./credit";

import { FormRecord } from "@/types/form";
import { getOneYearLaterTimestr } from "@/lib/time";

export const DEV_INITIAL_FORM_CREDITS = 20;
export const DEV_MIN_FORM_CREDITS = 20;

function getDevCreditsFloor() {
  const customFloor = Number(process.env.DEV_MIN_FORM_CREDITS || "");
  if (Number.isFinite(customFloor) && customFloor > 0) {
    return customFloor;
  }

  return DEV_MIN_FORM_CREDITS;
}

export function hasEnoughCredits(leftCredits: number, cost: number) {
  return leftCredits >= cost;
}

export async function ensureDevCreditsWallet(user_uuid: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const credits = await getUserCredits(user_uuid);
  const leftCredits = credits.left_credits || 0;
  const targetCredits = getDevCreditsFloor();

  if (leftCredits >= targetCredits) {
    return;
  }

  await increaseCredits({
    user_uuid,
    trans_type: CreditsTransType.SystemAdd,
    credits: Math.max(targetCredits - leftCredits, 0),
    expired_at: getOneYearLaterTimestr(),
  });
}

export async function chargeFormSubmissionCredits(form: FormRecord) {
  await ensureDevCreditsWallet(form.user_uuid);

  const credits = await getUserCredits(form.user_uuid);
  const cost = CreditsAmount.FormSubmitCost;

  if (!hasEnoughCredits(credits.left_credits || 0, cost)) {
    throw new Error("insufficient credits");
  }

  await decreaseCredits({
    user_uuid: form.user_uuid,
    trans_type: CreditsTransType.FormSubmit,
    credits: cost,
  });

  return {
    cost,
    left_credits: Math.max((credits.left_credits || 0) - cost, 0),
  };
}
