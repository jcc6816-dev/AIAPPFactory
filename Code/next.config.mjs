import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import mdx from "@next/mdx";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin();

const withMDX = mdx({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [];
  },
  async headers() {
    const cacheControlHeader = {
      key: "Cache-Control",
      value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=59",
    };

    const cachedPaths = [
      "/",
      "/zh",
      "/en",
      "/templates",
      "/zh/templates",
      "/en/templates",
      "/templates/:path*",
      "/zh/templates/:path*",
      "/en/templates/:path*",
      "/skills-catalog",
      "/zh/skills-catalog",
      "/en/skills-catalog",
      "/skills-catalog/:path*",
      "/zh/skills-catalog/:path*",
      "/en/skills-catalog/:path*",
      "/posts",
      "/zh/posts",
      "/en/posts",
      "/posts/:path*",
      "/zh/posts/:path*",
      "/en/posts/:path*",
      "/privacy-policy",
      "/terms-of-service",
    ];

    return cachedPaths.map((path) => ({
      source: path,
      headers: [cacheControlHeader],
    }));
  },
};

// Make sure experimental mdx flag is enabled
const configWithMDX = {
  ...nextConfig,
  experimental: {
    mdxRs: true,
  },
};

export default withBundleAnalyzer(withNextIntl(withMDX(configWithMDX)));
