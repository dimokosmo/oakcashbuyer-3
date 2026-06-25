import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL in Vercel to the final production domain.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
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
