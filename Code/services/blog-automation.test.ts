import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createBlogDraftForAutomation,
  getSeoPostGateStatus,
  updateBlogDraftForAutomation,
} from "./blog-automation";

const blogMocks = vi.hoisted(() => ({
  findPostBySlugMock: vi.fn(),
  findPostByUuidMock: vi.fn(),
  insertPostMock: vi.fn(),
  updatePostMock: vi.fn(),
}));

vi.mock("@/models/post", () => ({
  PostStatus: {
    Created: "created",
    Deleted: "deleted",
    Online: "online",
    Offline: "offline",
  },
  findPostBySlug: blogMocks.findPostBySlugMock,
  findPostByUuid: blogMocks.findPostByUuidMock,
  insertPost: blogMocks.insertPostMock,
  updatePost: blogMocks.updatePostMock,
}));

vi.mock("@/lib/hash", () => ({
  getUuid: () => "post_uuid",
}));

vi.mock("@/lib/time", () => ({
  getIsoTimestr: () => "2026-06-03T00:00:00.000Z",
}));

function buildValidEnglishContent(title: string) {
  const paragraph = Array(70)
    .fill(
      "This workflow helps a team collect structured form data, explain the respondent intent, route submissions into the right process, and review results before changing the public form."
    )
    .join(" ");

  return `# ${title}

${paragraph}

## How to Build It

Start with the [webhook workflow](/use-cases/webhook-form-builder-retry-logs), then connect the fields to the [templates library](/templates) so the form has a clear product path.

## Try This Workflow

Create the form, publish a test link, submit realistic data, and confirm the next step before sharing it with users.`;
}

describe("blog automation service", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("creates a draft post for automation", async () => {
    blogMocks.findPostBySlugMock.mockResolvedValue(undefined);
    blogMocks.insertPostMock.mockResolvedValue(undefined);

    const post = await createBlogDraftForAutomation({
      title: "AI Forms for Lead Capture and Workflow Automation",
      slug: "ai-forms-lead-capture",
      locale: "en",
      description:
        "Learn how to use AI-generated forms to collect better leads and route submissions into a practical workflow.",
      content: buildValidEnglishContent(
        "AI Forms for Lead Capture and Workflow Automation"
      ),
    });

    expect(post.status).toBe("created");
    expect(post.author_name).toBe("GenForms.ai");
    expect(blogMocks.insertPostMock).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: "post_uuid",
        title: "AI Forms for Lead Capture and Workflow Automation",
        slug: "ai-forms-lead-capture",
        locale: "en",
      })
    );
  });

  it("rejects thin automation drafts before they become review workload", async () => {
    blogMocks.findPostBySlugMock.mockResolvedValue(undefined);

    await expect(
      createBlogDraftForAutomation({
        title: "Thin AI Form Article That Should Not Pass",
        slug: "thin-ai-form-article",
        locale: "en",
        description:
          "This description is long enough to pass the snippet check but the article body is still too thin.",
        content: "# Thin AI Form Article That Should Not Pass\n\nUse AI forms.",
      })
    ).rejects.toThrow("en content should contain at least 650 words");
    expect(blogMocks.insertPostMock).not.toHaveBeenCalled();
  });

  it("returns a readable SEO gate status for admin review", () => {
    const passed = getSeoPostGateStatus({
      title: "AI Forms for Lead Capture and Workflow Automation",
      slug: "ai-forms-lead-capture",
      locale: "en",
      description:
        "Learn how to use AI-generated forms to collect better leads and route submissions into a practical workflow.",
      content: buildValidEnglishContent(
        "AI Forms for Lead Capture and Workflow Automation"
      ),
    });

    const failed = getSeoPostGateStatus({
      title: "Thin AI Form Article That Should Not Pass",
      slug: "thin-ai-form-article",
      locale: "en",
      description:
        "This description is long enough to pass the snippet check but the article body is still too thin.",
      content: "# Thin AI Form Article That Should Not Pass\n\nUse AI forms.",
    });

    expect(passed).toEqual({
      passed: true,
      message: "Ready to publish",
    });
    expect(failed).toEqual({
      passed: false,
      message: "en content should contain at least 650 words",
    });
  });

  it("rejects duplicate slug and locale on create", async () => {
    blogMocks.findPostBySlugMock.mockResolvedValue({ uuid: "existing" });

    await expect(
      createBlogDraftForAutomation({
        title: "Duplicate",
        slug: "duplicate",
        locale: "en",
      })
    ).rejects.toThrow("post with same slug already exists");
    expect(blogMocks.insertPostMock).not.toHaveBeenCalled();
  });

  it("does not allow automation to publish posts online", async () => {
    await expect(
      createBlogDraftForAutomation({
        title: "Publish now",
        slug: "publish-now",
        locale: "en",
        status: "online",
      })
    ).rejects.toThrow("automation can only create or update draft/offline posts");
  });

  it("updates an existing draft post", async () => {
    blogMocks.findPostByUuidMock.mockResolvedValue({
      uuid: "post_1",
      title: "Old Automation Workflow Article for Forms",
      slug: "old-slug",
      locale: "en",
      status: "created",
      description:
        "Learn how to use automation-ready forms to collect structured data and move submissions into a workflow.",
      content: buildValidEnglishContent(
        "Old Automation Workflow Article for Forms"
      ),
    });
    blogMocks.updatePostMock.mockResolvedValue(undefined);

    const post = await updateBlogDraftForAutomation("post_1", {
      title: "New Automation Workflow Article for Forms",
      content: buildValidEnglishContent(
        "New Automation Workflow Article for Forms"
      ),
      status: "offline",
    });

    expect(post.title).toBe("New Automation Workflow Article for Forms");
    expect(post.status).toBe("offline");
    expect(blogMocks.updatePostMock).toHaveBeenCalledWith(
      "post_1",
      expect.objectContaining({
        title: "New Automation Workflow Article for Forms",
        status: "offline",
        updated_at: "2026-06-03T00:00:00.000Z",
      })
    );
  });

  it("rejects slug conflicts on update", async () => {
    blogMocks.findPostByUuidMock.mockResolvedValue({
      uuid: "post_1",
      slug: "old-slug",
      locale: "en",
    });
    blogMocks.findPostBySlugMock.mockResolvedValue({ uuid: "post_2" });

    await expect(
      updateBlogDraftForAutomation("post_1", {
        slug: "taken",
        locale: "en",
      })
    ).rejects.toThrow("post with same slug already exists");
    expect(blogMocks.updatePostMock).not.toHaveBeenCalled();
  });
});
