import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Check, PackageX } from "lucide-react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { PRODUCT_BY_IDENTIFIER_QUERY } from "@/sanity/queries";
import type { ProductDetail } from "@/type/products";
import { AddToCartButton } from "@/components/AddToCartButton";

const ACCENT = "#7A1220";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getProduct(identifier: string) {
  return client.fetch<ProductDetail | null>(PRODUCT_BY_IDENTIFIER_QUERY, {
    identifier,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return {};

  return {
    title: `${product.name} | Blaise Coiffure`,
    description: product.description ?? `Découvrez le produit ${product.name}.`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const imageUrl =
    typeof product.image === "string"
      ? product.image
      : (product.image?.asset?.url ?? null);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <Link
        href="/#produits"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux produits
      </Link>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F8EFEC]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-8 sm:p-12"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400">
              <PackageX className="h-10 w-10" />
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium uppercase tracking-[0.16em] text-[#9C8D89]">
            {product.brand ? <span>{product.brand.name}</span> : null}
            {product.category ? (
              <>
                <span aria-hidden="true">/</span>
                <span>{product.category.title}</span>
              </>
            ) : null}
          </div>

          <h1 className="mt-4 font-display text-4xl leading-tight text-[#7A1220] sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-2xl font-semibold" style={{ color: ACCENT }}>
            {product.price.toLocaleString("fr-FR")} FCFA
          </p>

          {product.description ? (
            <p className="mt-6 max-w-xl leading-7 text-[#756563]">
              {product.description}
            </p>
          ) : null}

          <div className="mt-8 flex items-center gap-2 text-sm font-semibold">
            {product.stock > 0 ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">
                  En stock ({product.stock} disponible
                  {product.stock > 1 ? "s" : ""})
                </span>
              </>
            ) : (
              <>
                <PackageX className="h-4 w-4 text-[#8E2332]" />
                <span className="text-[#8E2332]">Rupture de stock</span>
              </>
            )}
          </div>

          <div className="mt-8 max-w-xs">
            <AddToCartButton product={product} />
          </div>

          <Link
            href="/#produits"
            className="mt-4 inline-flex text-sm font-semibold text-[#7A1220] hover:underline"
          >
            Voir les autres produits
          </Link>
        </div>
      </div>
    </main>
  );
}
