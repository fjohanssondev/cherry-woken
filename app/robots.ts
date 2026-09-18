import type { MetadataRoute } from "next";

import { shouldIndex, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Previews (dev branch, PRs) should not be crawled or indexed.
  if (!shouldIndex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
