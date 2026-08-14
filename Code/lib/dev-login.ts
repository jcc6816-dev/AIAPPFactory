/**
 * Complete the local-only credentials flow without relying on next-auth/react's
 * redirect promise. In development that promise can remain pending after the
 * server has already accepted the credentials, leaving a user in the sign-in UI.
 */
export async function getDevLoginRedirectUrl(
  email: string,
  callbackUrl: string
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), 10_000);

  try {
    const csrfResponse = await fetch("/api/auth/csrf", {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!csrfResponse.ok) {
      throw new Error("无法初始化开发登录，请重试。");
    }

    const { csrfToken } = await csrfResponse.json();
    if (!csrfToken) {
      throw new Error("开发登录令牌无效，请重试。");
    }

    const response = await fetch("/api/auth/callback/dev-login", {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        // Match next-auth/react: return a JSON redirect target instead of
        // following it as an HTML response inside fetch.
        "X-Auth-Return-Redirect": "1",
      },
      credentials: "same-origin",
      signal: controller.signal,
      body: new URLSearchParams({
        csrfToken,
        email,
        callbackUrl,
        json: "true",
      }),
    });
    const result = await response.json().catch(() => undefined);
    if (!response.ok || !result?.url) {
      throw new Error(result?.error || "开发登录未完成，请重试。");
    }

    return result.url;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("开发登录超时，请重试。");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
}
