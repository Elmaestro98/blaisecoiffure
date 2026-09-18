"use client";

import toast from "react-hot-toast";
import type { ProductSummary } from "@/type/products";
import useStore from "@/store";

const ACCENT = "#7A1220";

type AddToCartButtonProps = {
  product: ProductSummary;
  onAddToCart?: (product: ProductSummary) => void;
};

export function AddToCartButton({
  product,
  onAddToCart,
}: AddToCartButtonProps) {
  const addItem = useStore((state) => state.addItem);
  const openCart = useStore((state) => state.openCart);
  const quantity = useStore(
    (state) =>
      state.items.find((item) => item.product._id === product._id)?.quantity ??
      0,
  );
  const inStock = product.stock > 0;
  const canAdd = inStock && quantity < product.stock;

  const handleAddToCart = () => {
    if (!canAdd) return;

    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product);
      toast.success(`${product.name} ajouté au panier`);
      openCart();
    }
  };

  const label = !inStock
    ? "Rupture de stock"
    : quantity > 0
      ? `Dans le panier (${quantity})`
      : "Ajouter au panier";

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={!canAdd}
      className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      style={{ backgroundColor: ACCENT }}
    >
      {label}
    </button>
  );
}
