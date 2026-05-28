import { describe, expect, it } from "vitest";

import enLanding from "@/i18n/pages/landing/en.json";
import zhLanding from "@/i18n/pages/landing/zh.json";

const forbiddenLongTermTerms = [
  "MCP",
  "AI 虚拟团队",
  "虚拟团队",
  "Skill 编排",
  "异常运维",
  "Enterprise scene platform PRD",
  "AI Virtual Team",
  "Semantic Integration",
];

describe("landing content", () => {
  it("keeps the homepage aligned with the AI FormFactory MVP path", () => {
    for (const landing of [zhLanding, enLanding]) {
      const text = JSON.stringify(landing);

      expect(text).toContain("AI FormFactory");
      expect(text).toContain("template");
      expect(text.toLowerCase()).toContain("webhook");
      expect(text.toLowerCase()).toContain("agent");
    }
  });

  it("does not promote long-term platform modules as current homepage promises", () => {
    const text = JSON.stringify([zhLanding, enLanding]);

    for (const term of forbiddenLongTermTerms) {
      expect(text).not.toContain(term);
    }
  });

  it("links showcased scenarios directly to template-based creation", () => {
    const allShowcaseItems = [...zhLanding.showcase.items, ...enLanding.showcase.items];

    expect(allShowcaseItems.length).toBeGreaterThan(0);
    expect(
      allShowcaseItems.every(
        (item) => typeof item.url === "string" && item.url.includes("/forms/new?template=")
      )
    ).toBe(true);
  });
});
