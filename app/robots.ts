import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Pages sans intérêt pour Google, ou privées.
      disallow: [
        "/admin",          // back-office
        "/blaise",         // Sanity Studio
        "/api/",           // routes techniques
        "/panier",
        "/checkout",
        "/mes-reservations",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
