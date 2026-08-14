const GUEST_LOGIN_PROMPT_KEY = "aiff_guest_login_prompt";
const DEFAULT_MAX_AGE_MS = 30 * 60 * 1000;

type GuestLoginPromptState = {
  prompt?: unknown;
  stored_at?: unknown;
};

/**
 * 活动描述可能含业务信息：只保存于当前标签，登录回跳读取一次后立即删除。
 */
export function getResumableGuestLoginPrompt(
  state: GuestLoginPromptState | undefined,
  now = Date.now(),
  maxAgeMs = DEFAULT_MAX_AGE_MS
) {
  const prompt = typeof state?.prompt === "string" ? state.prompt.trim() : "";
  const storedAt = typeof state?.stored_at === "number" ? state.stored_at : 0;
  const age = now - storedAt;

  if (!prompt || storedAt <= 0 || age < 0 || age > maxAgeMs) return undefined;
  return prompt;
}

export function rememberGuestLoginPrompt(prompt: string) {
  if (typeof window === "undefined" || !prompt.trim()) return;
  try {
    window.sessionStorage.setItem(
      GUEST_LOGIN_PROMPT_KEY,
      JSON.stringify({ prompt: prompt.trim(), stored_at: Date.now() })
    );
  } catch {
    // 存储不可用不应阻断登录。
  }
}

export function consumeGuestLoginPrompt() {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.sessionStorage.getItem(GUEST_LOGIN_PROMPT_KEY);
    window.sessionStorage.removeItem(GUEST_LOGIN_PROMPT_KEY);
    return raw ? getResumableGuestLoginPrompt(JSON.parse(raw)) : undefined;
  } catch {
    try {
      window.sessionStorage.removeItem(GUEST_LOGIN_PROMPT_KEY);
    } catch {}
    return undefined;
  }
}
