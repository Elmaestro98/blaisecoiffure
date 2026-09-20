import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, Sparkles } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { PRODUCT_CATEGORIES_QUERY, PRODUCTS_QUERY } from "@/sanity/queries";
import { ProductCard } from "@/components/ProductCard";
import type { Category } from "@/type/categoryType";
import type { ProductSummary } from "@/type/products";

const ACCENT = "#7A1220";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; brand?: string; sort?: string }>;
};

function buildCategoryUrl(
  slug: string,
  current: { q: string; brand: string; sort: string },
  overrides: { q?: string; brand?: string; sort?: string },
) {
  const params = new URLSearchParams();

  if (current.q) params.set("q", current.q);
  if (current.brand) params.set("brand", current.brand);
  if (current.sort && current.sort !== "featured")
    params.set("sort", current.sort);

  if (overrides.q !== undefined) {
    if (overrides.q) params.set("q", overrides.q);
    else params.delete("q");
  }

  if (overrides.brand !== undefined) {
    if (overrides.brand) params.set("brand", overrides.brand);
    else params.delete("brand");
  }

  if (overrides.sort !== undefined) {
    if (overrides.sort && overrides.sort !== "featured")
      params.set("sort", overrides.sort);
    else params.delete("sort");
  }

  const query = params.toString();
  return query ? `/categories/${slug}?${query}` : `/categories/${slug}`;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { q = "", brand = "", sort = "featured" } = await searchParams;

  const [{ data: categoriesData }, { data: productsData }] = await Promise.all([
    sanityFetch({ query: PRODUCT_CATEGORIES_QUERY }),
    sanityFetch({ query: PRODUCTS_QUERY }),
  ]);

  const categories = (categoriesData ?? []) as Category[];
  const category = categories.find((item) => item.slug === slug) ?? null;

  if (!category) {
    notFound();
  }

  const products = (productsData ?? []) as ProductSummary[];
  const categoryProducts = products.filter(
    (product) => product.category?.slug === slug,
  );

  const normalizedQuery = q.trim().toLowerCase();
  const normalizedBrand = brand.trim().toLowerCase();

  const visibleProducts = [...categoryProducts]
    .filter((product) => {
      const matchesSearch =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category?.title.toLowerCase().includes(normalizedQuery) ||
        product.brand?.name.toLowerCase().includes(normalizedQuery);

      const matchesBrand =
        !normalizedBrand ||
        product.brand?.name.toLowerCase() === normalizedBrand;

      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name, "fr");
        case "name-desc":
          return b.name.localeCompare(a.name, "fr");
        default:
          return (
            Number(b.isFeatured) - Number(a.isFeatured) ||
            a.name.localeCompare(b.name, "fr")
          );
      }
    });

  const brandOptions = [
    ...new Set(
      categoryProducts
        .map((product) => product.brand?.name)
        .filter((name): name is string => Boolean(name)),
    ),
  ].sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Toutes les catégories
      </Link>

      <section className="overflow-hidden rounded-[32px] border border-[#F2E6E3] bg-white shadow-[0_22px_60px_rgba(122,18,32,0.06)]">
        <div className="grid items-center gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9C8D89]">
              Collection {category.title}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-[#7A1220] sm:text-5xl">
              {category.title}
            </h1>
            {category.description ? (
              <p className="mt-4 max-w-xl text-base leading-7 text-[#756563]">
                {category.description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-[#756563]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#F7ECEB] px-3 py-1.5 font-medium text-[#7A1220]">
                <Sparkles className="h-4 w-4" />
                {visibleProducts.length} produit
                {visibleProducts.length > 1 ? "s" : ""}
              </span>
              <span className="rounded-full border border-[#E9D7D3] px-3 py-1.5">
                Qualité premium
              </span>
            </div>
          </div>

          <div className="relative h-[220px] bg-[#F7ECEB] lg:h-full">
            {category.image?.asset?.url ? (
              <Image
                src={category.image.asset.url}
                alt={category.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-[#F5E3E0] to-[#EFD8D6]" />
            )}
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-[28px] border border-[#F2E6E3] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <form
            action={`/categories/${slug}`}
            method="get"
            className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="brand" value={brand} />

            <label className="relative block w-full">
              <span className="sr-only">Rechercher un produit</span>
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Rechercher un produit..."
                className="w-full rounded-full border border-[#E9D7D3] bg-[#FDF7F6] px-4 py-3 text-sm text-[#24171A] outline-none transition focus:border-[#D4A4A8]"
              />
            </label>

            <select
              name="sort"
              defaultValue={sort}
              className="rounded-full border border-[#E9D7D3] bg-[#FDF7F6] px-4 py-3 text-sm text-[#24171A] outline-none transition focus:border-[#D4A4A8]"
            >
              <option value="featured">Trier par : recommandé</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
            </select>
          </form>

          <div className="flex items-center gap-2 text-sm text-[#756563]">
            <SlidersHorizontal className="h-4 w-4" />
            <span>
              {visibleProducts.length} résultat
              {visibleProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href={buildCategoryUrl(
              slug,
              { q, brand, sort },
              { brand: undefined },
            )}
            className={`rounded-full px-3 py-2 text-sm transition ${
              !brand ? "bg-[#7A1220] text-white" : "bg-[#F7ECEB] text-[#7A1220]"
            }`}
          >
            Toutes les marques
          </Link>

          {brandOptions.map((brandName) => (
            <Link
              key={brandName}
              href={buildCategoryUrl(
                slug,
                { q, brand, sort },
                { brand: brandName },
              )}
              className={`rounded-full px-3 py-2 text-sm transition ${
                normalizedBrand === brandName.toLowerCase()
                  ? "bg-[#7A1220] text-white"
                  : "bg-[#F7ECEB] text-[#7A1220]"
              }`}
            >
              {brandName}
            </Link>
          ))}
        </div>
      </section>

      {visibleProducts.length ? (
        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {visibleProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-2xl border border-[#E8D9D5] bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,33,29,0.09)]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      ) : (
        <section className="mt-10 rounded-[28px] border border-dashed border-[#D9B4B0] bg-[#FFF9F8] p-10 text-center">
          <h2 className="font-display text-3xl text-[#24171A]">
            Aucun produit trouvé
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#756563]">
            Essayez une autre recherche ou réinitialisez les filtres pour
            découvrir la bonne sélection.
          </p>
          <Link
            href={`/categories/${slug}`}
            className="mt-5 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white shadow-sm"
            style={{ backgroundColor: ACCENT }}
          >
            Réinitialiser les filtres
          </Link>
        </section>
      )}
    </main>
  );
}
