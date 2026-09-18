"use client";

import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import type { ProductSummary } from "@/type/products";

const ACCENT = "#7A1220";

type ProductCardProps = {
  product: ProductSummary;
  onAddToCart?: (product: ProductSummary) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inStock = product.stock > 0;
  const imageUrl =
    typeof product.image === "string"
      ? product.image
      : (product.image?.asset?.url ?? null);

  const handleAddToCart = () => {
    if (!inStock) return;
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      toast.success(`${product.name} ajouté au panier`);
    }
  };

  return (
    <div className="flex flex-col items-center text-center">
      <Link
        href={`/produits/${product.slug}`}
        className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-white"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
            className="object-contain p-6"
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </Link>

      <Link
        href={`/produits/${product.slug}`}
        className="mt-4 text-sm font-medium text-neutral-900 hover:underline"
      >
        {product.name}
      </Link>

      <p className="mt-2 text-lg font-semibold" style={{ color: ACCENT }}>
        {product.price.toLocaleString("fr-FR")} CFA
      </p>

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!inStock}
        className="mt-4 w-full max-w-[220px] rounded-full py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: ACCENT }}
      >
        {inStock ? "Ajouter au panier" : "Rupture de stock"}
      </button>
    </div>
  );
}
