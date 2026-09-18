"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/ProductCard";
import type { ProductSummary } from "@/type/products";

export type ProductCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

type ProductCatalogProps = {
  products: ProductSummary[];
  categories: ProductCategory[];
  initialSearchQuery?: string;
};

export function ProductCatalog({
  products,
  categories,
  initialSearchQuery = "",
}: ProductCatalogProps) {
  const productsPerPage = 8;
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = initialSearchQuery.trim().toLocaleLowerCase("fr-FR");
  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "all" || product.category?.slug === activeCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLocaleLowerCase("fr-FR").includes(searchQuery) ||
        product.category?.title
          .toLocaleLowerCase("fr-FR")
          .includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, products, searchQuery]);
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);
  const totalPages = Math.ceil(visibleProducts.length / productsPerPage);
  const paginatedProducts = visibleProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );
  const activeCategoryData = categories.find(
    (category) => category.slug === activeCategory,
  );

  if (!products.length) return null;

  return (
    <section id="produits" className="border-t border-[#E8D9D5] py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="mt-3 font-display text-4xl leading-tight text-[#7A1220] sm:text-5xl">
              Les essentiels qui prolongent votre soin.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#756563] sm:text-base">
              Découvrez notre sélection de produits choisis pour prendre soin de
              vous, au salon comme à la maison.
            </p>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-4 border-b border-[#E8D9D5] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex items-center gap-2 overflow-x-auto pb-1"
            role="tablist"
            aria-label="Catégories de produits"
          >
            <SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-[#9C8D89]" />
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === "all"}
              onClick={() => {
                setActiveCategory("all");
                setCurrentPage(1);
              }}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                activeCategory === "all"
                  ? "bg-[#8E2332] text-white shadow-sm"
                  : "bg-white text-[#756563] hover:bg-[#F4E2E5] hover:text-[#8E2332]",
              )}
            >
              Tous les produits
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                role="tab"
                aria-selected={activeCategory === category.slug}
                onClick={() => {
                  setActiveCategory(category.slug);
                  setCurrentPage(1);
                }}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-bold transition",
                  activeCategory === category.slug
                    ? "bg-[#8E2332] text-white shadow-sm"
                    : "bg-white text-[#756563] hover:bg-[#F4E2E5] hover:text-[#8E2332]",
                )}
              >
                {category.title}
              </button>
            ))}
          </div>
          <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-[#9C8D89]">
            {visibleProducts.length} résultat
            {visibleProducts.length > 1 ? "s" : ""}
          </span>
        </div>

        {activeCategoryData?.description ? (
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#756563]">
            {activeCategoryData.description}
          </p>
        ) : null}

        {initialSearchQuery ? (
          <p className="mt-3 text-sm font-semibold text-[#8E2332]">
            Résultats pour « {initialSearchQuery} »
          </p>
        ) : null}

        {visibleProducts.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <div
                key={product._id}
                className="rounded-2xl border border-[#E8D9D5] bg-white p-4 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(75,33,29,0.09)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[#CDA9A5] bg-white px-6 py-12 text-center">
            <p className="font-display text-2xl text-[#24171A]">
              Cette catégorie arrive bientôt.
            </p>
            <p className="mt-2 text-sm text-[#756563]">
              Découvrez nos autres produits en attendant.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setCurrentPage(1);
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#8E2332] hover:underline"
            >
              Voir toute la boutique <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {totalPages > 1 ? (
          <nav
            className="mt-8 flex items-center justify-center gap-3"
            aria-label="Pagination des produits"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              aria-label="Page précédente"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D9D5] text-[#8E2332] transition hover:bg-[#F4E2E5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm font-semibold text-[#756563]">
              Page {currentPage} sur {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
              aria-label="Page suivante"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E8D9D5] text-[#8E2332] transition hover:bg-[#F4E2E5] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  );
}
