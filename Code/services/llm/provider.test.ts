import { afterAll, beforeEach, describe, expect, it } from "vitest";

import {
  getDefaultLlmProvider,
  getDefaultModelForProvider,
  isProviderConfigured,
  resolveLlmProviderConfig,
} from "./provider";

describe.sequential("llm provider", () => {
  const originalEnv = {
    DEFAULT_LLM_PROVIDER: process.env.DEFAULT_LLM_PROVIDER,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
  };

  beforeEach(() => {
    process.env.DEFAULT_LLM_PROVIDER = "";
    process.env.OPENAI_API_KEY = "";
    process.env.OPENAI_MODEL = "gpt-4o-mini";
    process.env.DEEPSEEK_API_KEY = "";
    process.env.DEEPSEEK_MODEL = "deepseek-chat";
  });

  it("falls back to openai when no default provider is configured", () => {
    expect(getDefaultLlmProvider()).toBe("openai");
  });

  it("resolves deepseek provider and model from env", () => {
    process.env.DEFAULT_LLM_PROVIDER = "deepseek";
    process.env.DEEPSEEK_API_KEY = "test-key";
    process.env.DEEPSEEK_MODEL = "deepseek-reasoner";

    const config = resolveLlmProviderConfig();

    expect(config.provider).toBe("deepseek");
    expect(config.model).toBe("deepseek-reasoner");
    expect(config.isConfigured).toBe(true);
  });

  it("allows explicit provider and model override", () => {
    const config = resolveLlmProviderConfig({
      provider: "deepseek",
      model: "deepseek-chat",
    });

    expect(config.provider).toBe("deepseek");
    expect(config.model).toBe("deepseek-chat");
  });

  it("detects provider configuration based on the matching api key", () => {
    expect(isProviderConfigured("openai")).toBe(false);
    expect(isProviderConfigured("deepseek")).toBe(false);

    process.env.OPENAI_API_KEY = "openai-key";
    process.env.DEEPSEEK_API_KEY = "deepseek-key";

    expect(isProviderConfigured("openai")).toBe(true);
    expect(isProviderConfigured("deepseek")).toBe(true);
  });

  it("returns the correct default model for each provider", () => {
    process.env.OPENAI_MODEL = "gpt-4.1-mini";
    process.env.DEEPSEEK_MODEL = "deepseek-chat";

    expect(getDefaultModelForProvider("openai")).toBe("gpt-4.1-mini");
    expect(getDefaultModelForProvider("deepseek")).toBe("deepseek-chat");
  });

  afterAll(() => {
    process.env.DEFAULT_LLM_PROVIDER = originalEnv.DEFAULT_LLM_PROVIDER;
    process.env.OPENAI_API_KEY = originalEnv.OPENAI_API_KEY;
    process.env.OPENAI_MODEL = originalEnv.OPENAI_MODEL;
    process.env.DEEPSEEK_API_KEY = originalEnv.DEEPSEEK_API_KEY;
    process.env.DEEPSEEK_MODEL = originalEnv.DEEPSEEK_MODEL;
  });
});
