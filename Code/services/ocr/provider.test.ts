import { beforeEach, describe, expect, it, vi } from "vitest";

import { StoredFileAsset } from "@/types/form";
import { resolveOcrProvider, runOcrForAsset } from "./provider";

const imageAsset: StoredFileAsset = {
  field_key: "invoice",
  file_name: "invoice.png",
  file_url: "https://example.com/invoice.png",
  mime_type: "image/png",
  storage_provider: "s3",
};

describe.sequential("ocr provider", () => {
  beforeEach(() => {
    process.env.DEFAULT_OCR_PROVIDER = "baidu";
    process.env.BAIDU_OCR_API_KEY = "";
    process.env.BAIDU_OCR_SECRET_KEY = "";
    process.env.GOOGLE_VISION_API_KEY = "";
  });

  it("resolves the default OCR provider from env", () => {
    process.env.DEFAULT_OCR_PROVIDER = "google";
    expect(resolveOcrProvider()).toBe("google");
  });

  it("falls back to mock OCR when provider credentials are missing", async () => {
    const result = await runOcrForAsset(imageAsset, "baidu");

    expect(result.provider).toBe("mock");
    expect(result.status).toBe("completed");
  });

  it("returns a clear failure for unsupported non-image assets", async () => {
    const result = await runOcrForAsset({
      ...imageAsset,
      file_name: "invoice.pdf",
      mime_type: "application/pdf",
    });

    expect(result.status).toBe("failed");
    expect(result.errorMessage).toContain("only supports image files");
  });

  it("calls Google OCR when configured", async () => {
    process.env.GOOGLE_VISION_API_KEY = "test-key";
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(new Blob(["fake-image"]), { status: 200 })
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            responses: [
              {
                fullTextAnnotation: {
                  text: "Invoice 123",
                },
              },
            ],
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      );

    const result = await runOcrForAsset(imageAsset, "google");

    expect(result.provider).toBe("google");
    expect(result.status).toBe("completed");
    expect(result.result.raw_text).toContain("Invoice 123");
    fetchMock.mockRestore();
  });
});
