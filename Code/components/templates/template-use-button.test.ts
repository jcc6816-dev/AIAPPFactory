import { describe, expect, it } from "vitest";

import { buildTemplateHref } from "./template-use-url";

describe("buildTemplateHref", () => {
  it("passes SEO creation context into the form workspace URL", () => {
    const href = buildTemplateHref(
      "en",
      "contact-us",
      undefined,
      {
        source: "usecase_contact-form-builder-for-websites",
        intent: "contact_form",
        mode: "typeform_style",
      },
      "Create a website contact form with inquiry type and message fields."
    );

    const url = new URL(`https://genforms.ai${href}`);

    expect(url.pathname).toBe("/forms/new");
    expect(url.searchParams.get("template")).toBe("contact-us");
    expect(url.searchParams.get("source")).toBe("usecase_contact-form-builder-for-websites");
    expect(url.searchParams.get("intent")).toBe("contact_form");
    expect(url.searchParams.get("mode")).toBe("typeform_style");
    expect(url.searchParams.get("prompt")).toBe(
      "Create a website contact form with inquiry type and message fields."
    );
  });

  it("keeps localized workspace paths for Chinese pages", () => {
    const href = buildTemplateHref("zh", "event-registration", undefined, {
      source: "usecase_qr-code-form-builder",
      intent: "qr_form",
    });

    expect(href).toBe(
      "/zh/forms/new?template=event-registration&source=usecase_qr-code-form-builder&intent=qr_form"
    );
  });

  it("passes the event registration intent from the SEO pillar into creation", () => {
    const href = buildTemplateHref(
      "en",
      "event-registration",
      undefined,
      {
        source: "usecase_event-registration-form-builder",
        intent: "event_registration",
      },
      "Create an event registration form for a workshop with QR sharing."
    );

    const url = new URL(`https://genforms.ai${href}`);

    expect(url.pathname).toBe("/forms/new");
    expect(url.searchParams.get("template")).toBe("event-registration");
    expect(url.searchParams.get("source")).toBe("usecase_event-registration-form-builder");
    expect(url.searchParams.get("intent")).toBe("event_registration");
    expect(url.searchParams.get("prompt")).toBe(
      "Create an event registration form for a workshop with QR sharing."
    );
  });

  it("can request immediate generation for an explicit template CTA", () => {
    const href = buildTemplateHref(
      "en",
      "event-registration",
      undefined,
      undefined,
      "Design an event signup form for a tech summit.",
      true
    );

    const url = new URL(`https://genforms.ai${href}`);
    expect(url.searchParams.get("autogenerate")).toBe("1");
    expect(url.searchParams.get("prompt")).toContain("event signup form");
  });

  it("passes customer feedback context and prompt into creation", () => {
    const href = buildTemplateHref(
      "en",
      "satisfaction-survey",
      {
        theme: "sunset",
        visualDirection: "warm-feedback",
        themeVariant: "glass",
        preferredDevice: "phone",
      },
      {
        source: "usecase_customer-feedback-form-builder",
        intent: "customer_feedback",
      },
      "Create a customer feedback form with a rating and improvement ideas."
    );

    const url = new URL(`https://genforms.ai${href}`);

    expect(url.pathname).toBe("/forms/new");
    expect(url.searchParams.get("template")).toBe("satisfaction-survey");
    expect(url.searchParams.get("source")).toBe(
      "usecase_customer-feedback-form-builder"
    );
    expect(url.searchParams.get("intent")).toBe("customer_feedback");
    expect(url.searchParams.get("theme")).toBe("sunset");
    expect(url.searchParams.get("visualDirection")).toBe("warm-feedback");
    expect(url.searchParams.get("themeVariant")).toBe("glass");
    expect(url.searchParams.get("device")).toBe("phone");
    expect(url.searchParams.get("prompt")).toContain(
      "customer feedback form"
    );
  });
});
