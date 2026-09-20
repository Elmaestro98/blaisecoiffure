import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITEMAP_QUERY } from "@/sanity/queries";
import { siteUrl } from "@/lib/site";

type SitemapEntry = { slug: string; _updatedAt: string };
type SitemapData = {
  services: SitemapEntry[];
  products: SitemapEntry[];
  categories: SitemapEntry[];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages fixes, du plus important au moins important
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/reservation`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  let data: SitemapData = { services: [], products: [], categories: [] };

  try {
    data = await client.fetch<SitemapData>(SITEMAP_QUERY);
  } catch (error) {
    // Un Sanity injoignable ne doit pas faire échouer le build :
    // on publie au moins les pages fixes.
    console.error("Sitemap: lecture Sanity impossible", error);
  }

  const toEntry = (
    prefix: string,
    entry: SitemapEntry,
    priority: number,
  ) => ({
    url: `${siteUrl}/${prefix}/${entry.slug}`,
    lastModified: entry._updatedAt ? new Date(entry._updatedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority,
  });

  return [
    ...staticRoutes,
    ...(data.services ?? []).map((s) => toEntry("services", s, 0.8)),
    ...(data.categories ?? []).map((c) => toEntry("categories", c, 0.7)),
    ...(data.products ?? []).map((p) => toEntry("produits", p, 0.6)),
  ];
}
