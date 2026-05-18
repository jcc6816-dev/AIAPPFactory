import { LanguageModelV1 } from "ai";
import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";

import { LlmProvider } from "@/types/form";

export const SUPPORTED_LLM_PROVIDERS: LlmProvider[] = ["openai", "deepseek"];

export type ResolvedLlmProviderConfig = {
  provider: LlmProvider;
  model: string;
  isConfigured: boolean;
};

function normalizeProvider(value?: string | null): LlmProvider | undefined {
  if (value === "deepseek" || value === "openai") {
    return value;
  }

  return undefined;
}

export function getDefaultLlmProvider(): LlmProvider {
  return normalizeProvider(process.env.DEFAULT_LLM_PROVIDER) || "openai";
}

export function getDefaultModelForProvider(provider: LlmProvider) {
  if (provider === "deepseek") {
    return process.env.DEEPSEEK_MODEL || "deepseek-chat";
  }

  return process.env.OPENAI_MODEL || "gpt-4o-mini";
}

export function isProviderConfigured(provider: LlmProvider) {
  if (provider === "deepseek") {
    return Boolean(process.env.DEEPSEEK_API_KEY);
  }

  return Boolean(process.env.OPENAI_API_KEY);
}

export function resolveLlmProviderConfig(input?: {
  provider?: string;
  model?: string;
}): ResolvedLlmProviderConfig {
  const requestedProvider = normalizeProvider(input?.provider);
  const provider = requestedProvider || getDefaultLlmProvider();
  const model = input?.model?.trim() || getDefaultModelForProvider(provider);

  return {
    provider,
    model,
    isConfigured: isProviderConfigured(provider),
  };
}

export function getLanguageModel(config: ResolvedLlmProviderConfig): LanguageModelV1 {
  if (config.provider === "deepseek") {
    return deepseek(config.model);
  }

  return openai(config.model);
}
