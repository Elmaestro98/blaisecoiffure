"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import useStore from "@/store";

export default function CartPage() {
  const items = useStore((state) => state.items);
  const addItem = useStore((state) => state.addItem);
  const removeItem = useStore((state) => state.removeItem);
  const deleteCartProduct = useStore((state) => state.deleteCartProduct);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <Link
        href="/#produits"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Continuer mes achats
      </Link>

      <h1 className="font-display text-4xl text-[#7A1220] sm:text-5xl">
        Mon panier
      </h1>

      {!items.length ? (
        <div className="mt-10 rounded-2xl border border-dashed border-[#CDA9A5] bg-[#FFF9F7] px-6 py-12 text-center">
          <p className="font-display text-2xl text-[#24171A]">
            Votre panier est vide.
          </p>
          <Link
            href="/#produits"
            className="mt-5 inline-flex rounded-full bg-[#7A1220] px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            {items.map(({ product, quantity }) => {
              const imageUrl =
                typeof product.image === "string"
                  ? product.image
                  : (product.image?.asset?.url ?? null);

              return (
                <article
                  key={product._id}
                  className="flex gap-4 rounded-2xl border border-[#E8D9D5] bg-white p-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F8EFEC]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-contain p-2"
                      />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-[#24171A]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-[#7A1220]">
                      {product.price.toLocaleString("fr-FR")} FCFA
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeItem(product._id)}
                        aria-label={`Retirer une unité de ${product.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[#E8D9D5] text-[#7A1220] hover:bg-[#F4E2E5]"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => addItem(product)}
                        disabled={quantity >= product.stock}
                        aria-label={`Ajouter une unité de ${product.name}`}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[#E8D9D5] text-[#7A1220] hover:bg-[#F4E2E5] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCartProduct(product._id)}
                    aria-label={`Supprimer ${product.name} du panier`}
                    className="self-start text-[#9C8D89] transition hover:text-[#B8283A]"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </article>
              );
            })}
          </div>

          <aside className="h-fit rounded-2xl bg-[#FFF9F7] p-6">
            <h2 className="font-display text-2xl text-[#7A1220]">Résumé</h2>
            <div className="mt-5 flex items-center justify-between border-t border-[#E8D9D5] pt-4 font-semibold text-[#24171A]">
              <span>Total</span>
              <span>{total.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <Link
              className="mt-6 w-full rounded-full bg-[#7A1220] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              href="/checkout"
            >
              Passer la commande
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}
