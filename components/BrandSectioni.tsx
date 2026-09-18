import { client } from "@/sanity/lib/client";
import { BRANDS_QUERY } from "@/sanity/queries";
import { BrandMarquee } from "./Brand";
import { Brand } from "@/type/brandType";

export async function BrandSection() {
  const brands = await client.fetch<Brand[]>(BRANDS_QUERY);

  if (!brands.length) return null;

  return <BrandMarquee brands={brands} />;
}
