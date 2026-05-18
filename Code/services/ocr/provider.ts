import { readFile } from "node:fs/promises";

import { OcrProvider, OcrResultPayload, StoredFileAsset } from "@/types/form";
import { getIsoTimestr } from "@/lib/time";

interface OcrExecutionResult {
  provider: OcrProvider;
  status: "completed" | "failed";
  result: OcrResultPayload;
  errorMessage?: string;
}

type BaiduAccessTokenCache = {
  accessToken: string;
  expiresAt: number;
};

const baiduTokenCache: BaiduAccessTokenCache = {
  accessToken: "",
  expiresAt: 0,
};

function isImageAsset(asset: StoredFileAsset) {
  return (asset.mime_type || "").startsWith("image/");
}

function getAssetIdentifier(asset: StoredFileAsset) {
  return asset.file_name || asset.file_url || asset.file_path || "unknown-file";
}

async function readAssetAsBase64(asset: StoredFileAsset) {
  if (asset.file_path && asset.storage_provider === "local") {
    const buffer = await readFile(asset.file_path);
    return buffer.toString("base64");
  }

  if (asset.file_url) {
    const response = await fetch(asset.file_url);
    if (!response.ok) {
      throw new Error(`Failed to download asset: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer).toString("base64");
  }

  throw new Error("No readable file source found for OCR");
}

function getDefaultOcrProvider(): OcrProvider {
  const provider = (process.env.DEFAULT_OCR_PROVIDER || "").trim().toLowerCase();
  if (provider === "google") {
    return "google";
  }

  return "baidu";
}

export function resolveOcrProvider(preferred?: string): OcrProvider {
  const provider = (preferred || getDefaultOcrProvider()).trim().toLowerCase();
  if (provider === "google") {
    return "google";
  }

  if (provider === "baidu") {
    return "baidu";
  }

  return "mock";
}

export function isOcrProviderConfigured(provider: OcrProvider) {
  switch (provider) {
    case "baidu":
      return Boolean(
        process.env.BAIDU_OCR_API_KEY && process.env.BAIDU_OCR_SECRET_KEY
      );
    case "google":
      return Boolean(process.env.GOOGLE_VISION_API_KEY);
    default:
      return false;
  }
}

async function getBaiduAccessToken() {
  const now = Date.now();
  if (baiduTokenCache.accessToken && baiduTokenCache.expiresAt > now + 60_000) {
    return baiduTokenCache.accessToken;
  }

  const apiKey = process.env.BAIDU_OCR_API_KEY || "";
  const secretKey = process.env.BAIDU_OCR_SECRET_KEY || "";
  if (!apiKey || !secretKey) {
    throw new Error("Baidu OCR credentials are not configured");
  }

  const url = new URL("https://aip.baidubce.com/oauth/2.0/token");
  url.searchParams.set("grant_type", "client_credentials");
  url.searchParams.set("client_id", apiKey);
  url.searchParams.set("client_secret", secretKey);

  const response = await fetch(url.toString(), {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Baidu OCR token: ${response.status}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!data.access_token) {
    throw new Error(data.error_description || "Baidu OCR token missing");
  }

  baiduTokenCache.accessToken = data.access_token;
  baiduTokenCache.expiresAt = now + (data.expires_in || 2_592_000) * 1000;
  return data.access_token;
}

async function runBaiduOcr(asset: StoredFileAsset): Promise<OcrExecutionResult> {
  const token = await getBaiduAccessToken();
  const image = await readAssetAsBase64(asset);
  const body = new URLSearchParams();
  body.set("image", image);

  const response = await fetch(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    }
  );

  const data = (await response.json()) as {
    words_result?: Array<{ words?: string }>;
    error_msg?: string;
    error_code?: number;
  };

  if (!response.ok || data.error_code) {
    return {
      provider: "baidu",
      status: "failed",
      result: {
        raw_text: "",
        processed_at: getIsoTimestr(),
        processed_files: [getAssetIdentifier(asset)],
        provider_payload: data as Record<string, any>,
      },
      errorMessage:
        data.error_msg || `Baidu OCR request failed with status ${response.status}`,
    };
  }

  const rawText = (data.words_result || [])
    .map((item) => item.words || "")
    .filter(Boolean)
    .join("\n");

  return {
    provider: "baidu",
    status: "completed",
    result: {
      raw_text: rawText,
      summary: rawText.slice(0, 400),
      processed_at: getIsoTimestr(),
      processed_files: [getAssetIdentifier(asset)],
      provider_payload: data as Record<string, any>,
    },
  };
}

async function runGoogleOcr(asset: StoredFileAsset): Promise<OcrExecutionResult> {
  const apiKey = process.env.GOOGLE_VISION_API_KEY || "";
  if (!apiKey) {
    throw new Error("Google Vision API key is not configured");
  }

  const image = await readAssetAsBase64(asset);
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: image,
            },
            features: [
              {
                type: "DOCUMENT_TEXT_DETECTION",
              },
            ],
          },
        ],
      }),
    }
  );

  const data = (await response.json()) as {
    responses?: Array<{
      fullTextAnnotation?: { text?: string };
      error?: { message?: string };
    }>;
    error?: { message?: string };
  };

  const responsePayload = data.responses?.[0];
  const rawText = responsePayload?.fullTextAnnotation?.text || "";
  const errorMessage =
    data.error?.message || responsePayload?.error?.message || "";

  if (!response.ok || errorMessage) {
    return {
      provider: "google",
      status: "failed",
      result: {
        raw_text: "",
        processed_at: getIsoTimestr(),
        processed_files: [getAssetIdentifier(asset)],
        provider_payload: data as Record<string, any>,
      },
      errorMessage:
        errorMessage || `Google OCR request failed with status ${response.status}`,
    };
  }

  return {
    provider: "google",
    status: "completed",
    result: {
      raw_text: rawText,
      summary: rawText.slice(0, 400),
      processed_at: getIsoTimestr(),
      processed_files: [getAssetIdentifier(asset)],
      provider_payload: data as Record<string, any>,
    },
  };
}

function buildMockOcrResult(asset: StoredFileAsset): OcrExecutionResult {
  return {
    provider: "mock",
    status: "completed",
    result: {
      raw_text: "",
      summary: `Mock OCR reserved for ${getAssetIdentifier(asset)}.`,
      processed_at: getIsoTimestr(),
      processed_files: [getAssetIdentifier(asset)],
      provider_payload: {},
    },
  };
}

export async function runOcrForAsset(
  asset: StoredFileAsset,
  preferredProvider?: string
): Promise<OcrExecutionResult> {
  if (!isImageAsset(asset)) {
    return {
      provider: "mock",
      status: "failed",
      result: {
        raw_text: "",
        summary: "",
        processed_at: getIsoTimestr(),
        processed_files: [getAssetIdentifier(asset)],
        provider_payload: {},
      },
      errorMessage: "Current OCR integration only supports image files in this batch.",
    };
  }

  const provider = resolveOcrProvider(preferredProvider);
  if (!isOcrProviderConfigured(provider)) {
    return buildMockOcrResult(asset);
  }

  if (provider === "baidu") {
    return runBaiduOcr(asset);
  }

  if (provider === "google") {
    return runGoogleOcr(asset);
  }

  return buildMockOcrResult(asset);
}
