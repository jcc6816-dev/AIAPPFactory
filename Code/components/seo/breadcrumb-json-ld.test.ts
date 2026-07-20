import { describe, expect, it } from "vitest";

import { buildBreadcrumbListJsonLd } from "./breadcrumb-json-ld";

describe("buildBreadcrumbListJsonLd", () => {
  it("uses item @id objects for Google breadcrumb parsing", () => {
    const data = buildBreadcrumbListJsonLd([
      { name: "Solutions", url: "https://genforms.ai/solutions" },
      {
        name: "Web Design Client Intake Form Template",
        url: "https://genforms.ai/solutions/web-design-client-intake-form-template",
      },
    ]);

    expect(data).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Solutions",
          item: {
            "@id": "https://genforms.ai/solutions",
            name: "Solutions",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Web Design Client Intake Form Template",
          item: {
            "@id":
              "https://genforms.ai/solutions/web-design-client-intake-form-template",
            name: "Web Design Client Intake Form Template",
          },
        },
      ],
    });
  });
});
