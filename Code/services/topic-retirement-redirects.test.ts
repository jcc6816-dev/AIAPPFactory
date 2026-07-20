import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("validated topic retirement redirects", () => {
  const configSource = fs.readFileSync(
    path.join(process.cwd(), "next.config.mjs"),
    "utf8"
  );

  it("merges the retired lead magnet solution into the Lead Capture pillar", () => {
    expect(configSource).toContain('source: "/solutions/lead-magnet-download-form"');
    expect(configSource).toContain(
      'destination: "/use-cases/ai-lead-capture-form-builder"'
    );
  });

  it("redirects the retired newsletter solution to its template", () => {
    expect(configSource).toContain(
      'source: "/solutions/newsletter-signup-form-builder"'
    );
    expect(configSource).toContain(
      'destination: "/templates/newsletter-signup"'
    );
  });

  it("redirects all retired community solution routes to the localized template", () => {
    expect(configSource).toContain(
      'source: "/solutions/community-application-form-template"'
    );
    expect(configSource).toContain(
      'source: "/en/solutions/community-application-form-template"'
    );
    expect(configSource).toContain(
      'source: "/zh/solutions/community-application-form-template"'
    );
    expect(configSource).toContain(
      'destination: "/templates/community-application"'
    );
    expect(configSource).toContain(
      'destination: "/zh/templates/community-application"'
    );
  });

  it("consolidates customer testimonial ownership on the localized template", () => {
    expect(configSource).toContain('source: "/templates/customer-story"');
    expect(configSource).toContain(
      'source: "/solutions/customer-testimonial-collection-form"'
    );
    expect(configSource).toContain(
      'destination: "/templates/customer-testimonial-form"'
    );
    expect(configSource).toContain(
      'destination: "/zh/templates/customer-testimonial-form"'
    );
  });
});
