import { afterEach, describe, expect, it, vi } from "vitest";

import { PATCH } from "./route";

const routeMocks = vi.hoisted(() => ({
  updateBlogDraftForAutomationMock: vi.fn(),
}));

vi.mock("@/services/blog-automation", () => ({
  updateBlogDraftForAutomation: routeMocks.updateBlogDraftForAutomationMock,
}));

function request(body: unknown, token = "test_blog_key") {
  return new Request("http://test.local/api/admin/blog/posts/post_1", {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
}

describe("blog automation update API", () => {
  const originalKey = process.env.BLOG_AUTOMATION_API_KEY;

  afterEach(() => {
    process.env.BLOG_AUTOMATION_API_KEY = originalKey;
    vi.clearAllMocks();
  });

  it("rejects requests with the wrong token", async () => {
    process.env.BLOG_AUTOMATION_API_KEY = "test_blog_key";

    const res = await PATCH(request({ title: "Post" }, "wrong"), {
      params: Promise.resolve({ uuid: "post_1" }),
    });
    const json = await res.json();

    expect(json.code).toBe(-1);
    expect(json.message).toBe("unauthorized");
    expect(routeMocks.updateBlogDraftForAutomationMock).not.toHaveBeenCalled();
  });

  it("updates a draft post with a valid token", async () => {
    process.env.BLOG_AUTOMATION_API_KEY = "test_blog_key";
    routeMocks.updateBlogDraftForAutomationMock.mockResolvedValue({
      uuid: "post_1",
      title: "Updated",
    });

    const res = await PATCH(request({ title: "Updated" }), {
      params: Promise.resolve({ uuid: "post_1" }),
    });
    const json = await res.json();

    expect(json.code).toBe(0);
    expect(json.data.post.title).toBe("Updated");
    expect(routeMocks.updateBlogDraftForAutomationMock).toHaveBeenCalledWith(
      "post_1",
      { title: "Updated" }
    );
  });
});
