import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSummary } from "@/type/products";

export interface CartItem {
  product: ProductSummary;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: ProductSummary) => void;
  removeItem: (productId: string) => void;
  deleteCartProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => CartItem[];
  // cart drawer UI
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  //   // favorite
  favoriteProduct: ProductSummary[];
  addToFavorite: (product: ProductSummary) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],
      isCartOpen: false,
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id,
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          } else {
            return { items: [...state.items, { product, quantity: 1 }] };
          }
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.product._id === productId) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),
      deleteCartProduct: (productId) =>
        set((state) => ({
          items: state.items.filter(
            ({ product }) => product?._id !== productId,
          ),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                ({ product }) => product._id !== productId,
              ),
            };
          }
          return {
            items: state.items.map((item) =>
              item.product._id === productId ? { ...item, quantity } : item,
            ),
          };
        }),
      resetCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0,
        );
      },
      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          return total + price * item.quantity;
        }, 0);
      },
      getItemCount: (productId) => {
        const item = get().items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      addToFavorite: (product: ProductSummary) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id,
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id,
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },
      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item?._id !== productId,
          ),
        }));
      },
      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    {
      name: "cart-store",
      partialize: (state) => ({
        items: state.items,
        favoriteProduct: state.favoriteProduct,
      }),
    },
  ),
);

export default useStore;
