import type { ProductSummary } from "@/type/products";
import { ProductCard } from "@/components/ProductCard";

type ProductGridProps = {
  products: ProductSummary[];
  onAddToCart?: (product: ProductSummary) => void;
};

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (!products.length) return null;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
