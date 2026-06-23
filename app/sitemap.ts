import type { MetadataRoute } from "next";
import { locations } from "../lib/locations";

// Set NEXT_PUBLIC_SITE_URL in Vercel to the final production domain.
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://oakcashbuyer.com")
  .replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...locations.map((location) => ({
      url: `${siteUrl}/sell/${location.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
