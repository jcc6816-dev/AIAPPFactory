import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

describe("course and community page architecture", () => {
  const solutionPageSource = fs.readFileSync(
    path.join(process.cwd(), "app/[locale]/(default)/solutions/[slug]/page.tsx"),
    "utf8"
  );
  const templatePageSource = fs.readFileSync(
    path.join(process.cwd(), "app/[locale]/(default)/templates/[templateId]/page.tsx"),
    "utf8"
  );

  it("gives Course a field-first path and only the intended related use cases", () => {
    expect(solutionPageSource).toContain(
      'const isCourseRegistration = page.slug === "course-registration-form-builder"'
    );
    expect(solutionPageSource).toContain('"event-registration-form-builder"');
    expect(solutionPageSource).toContain('"qr-code-form-builder"');
    expect(solutionPageSource).toContain('"webhook-form-builder-retry-logs"');
    expect(solutionPageSource).toContain('"Preview registration fields"');
    expect(solutionPageSource).toContain("!isCourseRegistration && (");
  });

  it("keeps Community template-only with visible FAQ and dedicated metadata", () => {
    expect(templatePageSource).toContain('"community-application": {');
    expect(templatePageSource).toContain("Community Application Form Template | GenForms");
    expect(templatePageSource).toContain("Are community applications approved automatically?");
    expect(templatePageSource).toContain('"community-application"');
  });
});
