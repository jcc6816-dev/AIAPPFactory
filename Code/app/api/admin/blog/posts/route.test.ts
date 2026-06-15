import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const routeMocks = vi.hoisted(() => ({
  createBlogDraftForAutomationMock: vi.fn(),
}));

vi.mock("@/services/blog-automation", () => ({
  createBlogDraftForAutomation: routeMocks.createBlogDraftForAutomationMock,
}));

function request(body: unknown, token = "test_blog_key") {
  return new Request("http://test.local/api/admin/blog/posts", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

describe("blog automation create API", () => {
  const originalKey = process.env.BLOG_AUTOMATION_API_KEY;

  afterEach(() => {
    process.env.BLOG_AUTOMATION_API_KEY = originalKey;
    vi.clearAllMocks();
  });

  it("rejects requests without a configured token", async () => {
    delete process.env.BLOG_AUTOMATION_API_KEY;

    const res = await POST(request({ title: "Post" }));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("unauthorized");
    expect(routeMocks.createBlogDraftForAutomationMock).not.toHaveBeenCalled();
  });

  it("rejects requests with the wrong token", async () => {
    process.env.BLOG_AUTOMATION_API_KEY = "test_blog_key";

    const res = await POST(request({ title: "Post" }, "wrong"));
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("unauthorized");
    expect(routeMocks.createBlogDraftForAutomationMock).not.toHaveBeenCalled();
  });

  it("creates a draft post with a valid token", async () => {
    process.env.BLOG_AUTOMATION_API_KEY = "test_blog_key";
    routeMocks.createBlogDraftForAutomationMock.mockResolvedValue({
      uuid: "post_1",
      status: "created",
    });

    const res = await POST(
      request({
        title: "AI forms",
        slug: "ai-forms",
        locale: "en",
      })
    );
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.post.uuid).toBe("post_1");
    expect(routeMocks.createBlogDraftForAutomationMock).toHaveBeenCalledWith({
      title: "AI forms",
      slug: "ai-forms",
      locale: "en",
    });
  });
});
