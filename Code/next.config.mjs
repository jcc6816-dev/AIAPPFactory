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
    return [
      {
        source: "/use-cases/ai-event-registration-form-builder",
        destination: "/use-cases/event-registration-form-builder",
        permanent: true,
      },
      {
        source: "/en/use-cases/ai-event-registration-form-builder",
        destination: "/en/use-cases/event-registration-form-builder",
        permanent: true,
      },
      {
        source: "/zh/use-cases/ai-event-registration-form-builder",
        destination: "/zh/use-cases/event-registration-form-builder",
        permanent: true,
      },
      {
        source: "/solutions/lead-magnet-download-form",
        destination: "/use-cases/ai-lead-capture-form-builder",
        permanent: true,
      },
      {
        source: "/en/solutions/lead-magnet-download-form",
        destination: "/use-cases/ai-lead-capture-form-builder",
        permanent: true,
      },
      {
        source: "/zh/solutions/lead-magnet-download-form",
        destination: "/zh/use-cases/ai-lead-capture-form-builder",
        permanent: true,
      },
      {
        source: "/solutions/newsletter-signup-form-builder",
        destination: "/templates/newsletter-signup",
        permanent: true,
      },
      {
        source: "/en/solutions/newsletter-signup-form-builder",
        destination: "/templates/newsletter-signup",
        permanent: true,
      },
      {
        source: "/zh/solutions/newsletter-signup-form-builder",
        destination: "/zh/templates/newsletter-signup",
        permanent: true,
      },
      {
        source: "/solutions/community-application-form-template",
        destination: "/templates/community-application",
        permanent: true,
      },
      {
        source: "/en/solutions/community-application-form-template",
        destination: "/templates/community-application",
        permanent: true,
      },
      {
        source: "/zh/solutions/community-application-form-template",
        destination: "/zh/templates/community-application",
        permanent: true,
      },
      {
        source: "/templates/customer-story",
        destination: "/templates/customer-testimonial-form",
        permanent: true,
      },
      {
        source: "/en/templates/customer-story",
        destination: "/templates/customer-testimonial-form",
        permanent: true,
      },
      {
        source: "/zh/templates/customer-story",
        destination: "/zh/templates/customer-testimonial-form",
        permanent: true,
      },
      {
        source: "/solutions/customer-testimonial-collection-form",
        destination: "/templates/customer-testimonial-form",
        permanent: true,
      },
      {
        source: "/en/solutions/customer-testimonial-collection-form",
        destination: "/templates/customer-testimonial-form",
        permanent: true,
      },
      {
        source: "/zh/solutions/customer-testimonial-collection-form",
        destination: "/zh/templates/customer-testimonial-form",
        permanent: true,
      },
    ];
  },
  async headers() {
    // App Router serves both HTML documents and React Server Component payloads
    // from these routes. Some CDNs do not key their cache on the RSC `Vary`
    // headers, which can make a normal navigation receive raw `0:{...}` data.
    // Keep dynamic pages out of shared CDN cache until cache-key variation is
    // explicitly configured at the edge.
    const cacheControlHeader = {
      key: "Cache-Control",
      value: "private, no-store, max-age=0, must-revalidate",
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

    const pageHeaders = cachedPaths.map((path) => ({
      source: path,
      headers: [cacheControlHeader],
    }));

    // Local static asset long-term cache headers (30 days)
    const staticCacheHeader = {
      key: "Cache-Control",
      value: "public, max-age=2592000, must-revalidate",
    };

    const staticAssetPaths = [
      "/logo.png",
      "/logo-64.png",
      "/masks/circle.svg",
      "/imgs/:path*"
    ];

    const staticHeaders = staticAssetPaths.map((path) => ({
      source: path,
      headers: [staticCacheHeader],
    }));

    return [...pageHeaders, ...staticHeaders];
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
