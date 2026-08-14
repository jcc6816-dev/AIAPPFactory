import { afterEach, describe, expect, it, vi } from "vitest";

import { getDevLoginRedirectUrl } from "./dev-login";

describe("getDevLoginRedirectUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("posts credentials with a CSRF token and returns the callback URL", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ csrfToken: "csrf_1" }), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ url: "/zh/forms/new" }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      getDevLoginRedirectUrl("qa@local.aifactory", "/zh/forms/new")
    ).resolves.toBe("/zh/forms/new");

    expect(fetchMock).toHaveBeenLastCalledWith(
      "/api/auth/callback/dev-login",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-Auth-Return-Redirect": "1" }),
      })
    );
  });

  it("reports an actionable error when the callback has no redirect URL", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ csrfToken: "csrf_1" }), { status: 200 })
        )
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: "CredentialsSignin" }), {
            status: 401,
          })
        )
    );

    await expect(
      getDevLoginRedirectUrl("qa@local.aifactory", "/zh/forms/new")
    ).rejects.toThrow("CredentialsSignin");
  });
});
