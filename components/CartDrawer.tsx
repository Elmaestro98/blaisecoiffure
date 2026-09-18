"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/store";

const ACCENT = "#7A1220";

export function CartDrawer() {
  const isCartOpen = useStore((state) => state.isCartOpen);
  const closeCart = useStore((state) => state.closeCart);
  const items = useStore((state) => state.items);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const deleteCartProduct = useStore((state) => state.deleteCartProduct);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Panneau */}
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <h2 className="text-base font-bold tracking-wide">
                PANIER {itemCount > 0 && `(${itemCount})`}
              </h2>
              <button
                onClick={closeCart}
                aria-label="Fermer"
                className="rounded-full p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenu */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag size={40} className="text-neutral-300" />
                <p className="text-sm text-neutral-500">
                  Votre panier est vide
                </p>
                <button
                  onClick={closeCart}
                  className="mt-2 text-sm font-semibold underline"
                  style={{ color: ACCENT }}
                >
                  Continuer les achats
                </button>
              </div>
            ) : (
              <>
                {/* Liste des articles */}
                <div className="flex-1 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="group flex gap-4 border-b border-neutral-100 py-5 last:border-none"
                      >
                        <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-50">
                          {item.product.image && (
                            <Image
                              src={
                                typeof item.product.image === "string"
                                  ? item.product.image
                                  : (item.product.image.asset?.url ?? "")
                              }
                              alt={item.product.name}
                              fill
                              className="object-contain p-1"
                            />
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">
                              {item.product.name}
                            </p>
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.product.price.toLocaleString("fr-FR")} CFA
                            </p>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex h-8 items-center gap-3 rounded-full border border-neutral-200 px-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity - 1,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100"
                                aria-label="Diminuer"
                              >
                                <Minus size={12} />
                              </button>
                              <motion.span
                                key={item.quantity}
                                initial={{ scale: 1.25 }}
                                animate={{ scale: 1 }}
                                className="w-4 text-center text-xs font-medium"
                              >
                                {item.quantity}
                              </motion.span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product._id,
                                    item.quantity + 1,
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100"
                                aria-label="Augmenter"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                deleteCartProduct(item.product._id)
                              }
                              aria-label="Supprimer l'article"
                              className="text-neutral-300 opacity-0 transition hover:text-neutral-900 group-hover:opacity-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Totaux + actions */}
                <div className="border-t border-neutral-100 px-6 py-5">
                  <div className="mb-1 flex justify-between text-sm text-neutral-500">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString("fr-FR")} CFA</span>
                  </div>
                  <div className="mb-5 flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{subtotal.toLocaleString("fr-FR")} CFA</span>
                  </div>

                  <button
                    className="mb-3 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                    style={{ backgroundColor: ACCENT }}
                  >
                    VALIDER LA COMMANDE
                  </button>

                  <Link
                    href="/panier"
                    onClick={closeCart}
                    className="mb-4 block w-full rounded-full border-2 py-3.5 text-center text-sm font-semibold transition hover:bg-neutral-50"
                    style={{ borderColor: ACCENT, color: ACCENT }}
                  >
                    VOIR LE PANIER
                  </Link>

                  <button
                    onClick={closeCart}
                    className="w-full text-center text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
                  >
                    Continuer les achats
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
