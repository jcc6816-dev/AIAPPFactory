#!/usr/bin/env node

/**
 * Read-only sitemap health check for a candidate or production GenForms site.
 *
 * It intentionally follows only URLs declared by the target site's sitemap
 * and fails closed when a sitemap URL is not HTTP 200. This makes server
 * migration regressions visible before they silently remove indexed pages.
 *
 * Usage: node scripts/monitor-sitemap-health.mjs [https://genforms.ai]
 */
const baseUrl = new URL(process.argv[2] || "https://genforms.ai");
const sitemapUrl = new URL("/sitemap.xml", baseUrl);
const concurrency = 8;

function fail(message) {
  console.error(`FAIL  ${message}`);
  process.exitCode = 1;
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    return await fetch(url, { redirect: "follow", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") {
    throw new Error("Target must use HTTPS, except an explicit localhost candidate environment.");
  }

  const sitemapResponse = await fetchWithTimeout(sitemapUrl);
  if (!sitemapResponse.ok) {
    throw new Error(`sitemap returned HTTP ${sitemapResponse.status}`);
  }

  const sitemapXml = await sitemapResponse.text();
  const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (urls.length === 0) {
    throw new Error("sitemap contains no <loc> entries");
  }

  const invalidOrigin = urls.find((value) => new URL(value).origin !== baseUrl.origin);
  if (invalidOrigin) {
    throw new Error(`sitemap contains an unexpected origin: ${invalidOrigin}`);
  }

  const failures = [];
  let cursor = 0;
  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      const url = urls[index];
      try {
        const response = await fetchWithTimeout(url);
        if (response.status !== 200) {
          failures.push({ url, status: response.status });
        }
      } catch (error) {
        failures.push({ url, status: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  console.log(`Checked ${urls.length} sitemap URLs from ${sitemapUrl.href}`);
  if (failures.length > 0) {
    failures.forEach(({ url, status }) => fail(`${status} ${url}`));
    return;
  }
  console.log("PASS  every sitemap URL returned HTTP 200");
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
