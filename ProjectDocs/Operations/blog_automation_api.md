# Blog Automation API

GenForms.ai supports a scoped API key for external agents that create and update blog drafts without using browser login.

配套执行规范：

- [博客内容 Agent 执行手册](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/blog_content_agent_playbook.md)
- [SEO 内容选题队列](/Users/mike/Documents/AIFactory/ProjectDocs/Operations/seo_content_topic_queue.md)

## Environment

Set this on production:

```env
BLOG_AUTOMATION_API_KEY="gf_blog_your_random_secret"
```

Use a long random value. This key only authorizes blog draft automation.

## Create A Draft

```http
POST https://genforms.ai/api/admin/blog/posts
Authorization: Bearer gf_blog_your_random_secret
Content-Type: application/json
```

```json
{
  "title": "How AI Forms Improve Lead Capture",
  "slug": "ai-forms-lead-capture",
  "locale": "en",
  "status": "created",
  "description": "A practical guide to using AI-generated forms for better lead capture.",
  "cover_url": "https://example.com/cover.png",
  "author_name": "GenForms.ai",
  "author_avatar_url": "",
  "content": "# How AI Forms Improve Lead Capture\n\nMarkdown content here."
}
```

Allowed `status` values are `created` and `offline`. The API rejects `online` so an agent cannot publish directly without human review.

## Update A Draft

```http
PATCH https://genforms.ai/api/admin/blog/posts/{uuid}
Authorization: Bearer gf_blog_your_random_secret
Content-Type: application/json
```

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "content": "Updated Markdown content."
}
```

## Agent Configuration

- Base URL: `https://genforms.ai`
- Create endpoint: `/api/admin/blog/posts`
- Update endpoint: `/api/admin/blog/posts/{uuid}`
- Header: `Authorization: Bearer <BLOG_AUTOMATION_API_KEY>`
- Content type: `application/json`
- Draft status: always use `created`; human review publishes from `/admin/posts`.

Recommended flow:

1. Agent selects a topic from the SEO topic queue.
2. Agent generates title, slug, description, locale, and Markdown.
3. Agent checks internal links, CTA, and keyword intent.
4. Agent calls create endpoint with `status: "created"`.
5. Human reviews the draft in `/admin/posts`.
6. Human checks the `SEO Gate` column in `/admin/posts`; only `Pass` posts can be published.
7. Human changes status to `online` in the admin UI.

## Validation Rules

- `title`, `slug`, and `locale` are required on create.
- `locale` must be one of the configured site locales.
- `slug + locale` must be unique.
- Automation cannot set `status: "online"`.
- The key cannot access users, orders, forms, submissions, or billing data.
- Drafts must pass the Google SEO quality gate before they are accepted:
  - `slug` uses lowercase words separated by hyphens and is no longer than 70 characters.
  - English titles should be 35-90 characters; Chinese titles should be 12-40 characters.
  - English descriptions should be 80-180 characters; Chinese descriptions should be 40-120 characters.
  - Markdown content must contain exactly one H1, and the H1 must match the title.
  - English content must contain at least 650 words; Chinese content must contain at least 700 Chinese characters.
  - Content must include at least two internal product links to `/use-cases`, `/solutions`, `/templates`, or `/posts`.
  - Content must include one clear CTA section, such as `## Try This Workflow`.
  - Content must not include generic AI assistant wording such as `as an AI`.
- The same quality gate is enforced when an admin manually publishes a post as `online`; incomplete drafts can be saved, but they cannot be published until they pass the SEO checks.
- The admin post list shows a visible `SEO Gate` status. `Needs work` posts display the first failed rule and keep the Publish button disabled, while `Pass` posts can be published after human review.

## SEO Draft Checklist

Before calling the API, the agent should confirm:

- Title is unique and matches one clear search intent.
- Slug is lowercase, short, and keyword-readable.
- Description is written for search snippets, not copied from the title.
- Markdown body contains exactly one H1.
- Body includes at least one use-case page link and one template or posts link.
- Body has one visible CTA, not several competing CTAs.
- No secrets, internal server addresses, or private operational notes are included.
