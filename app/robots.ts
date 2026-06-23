import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL in Vercel to the final production domain.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://oakcashbuyer.com")
  .replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
