import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_CATEGORIES_QUERY } from "@/sanity/queries";
import type { Category } from "@/type/categoryType";
import Container from "@/components/Container";

export default async function CategoriesPage() {
  const { data } = await sanityFetch({ query: PRODUCT_CATEGORIES_QUERY });
  const categories = (data ?? []) as Category[];

  return (
    <Container>
      <section className="py-12 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C8D89]">
            Boutique
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[#7A1220] sm:text-5xl">
            Explorer nos catégories
          </h1>
          <p className="mt-4 text-base leading-7 text-[#756563]">
            Trouvez facilement les produits qui correspondent à votre routine
            beauté, cheveux, soins et cosmétique.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group relative block overflow-hidden rounded-[28px] border border-[#F2E6E3] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {category.image?.asset?.url ? (
                  <Image
                    src={category.image.asset.url}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-[#F4E2E5]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C8D89]">
                  Collection
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#24171A]">
                  {category.title}
                </h2>
                {category.description ? (
                  <p className="mt-2 text-sm leading-6 text-[#756563]">
                    {category.description}
                  </p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
