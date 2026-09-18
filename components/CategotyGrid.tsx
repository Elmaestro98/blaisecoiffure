import { client } from "@/sanity/lib/client";
import { PRODUCT_CATEGORIES_WITH_PRODUCTS_QUERY } from "@/sanity/queries";
import { CategoryCard } from "./CategoryCard";
import { Category } from "@/type/categoryType";

export async function CategoryGrid() {
  const categories = await client.fetch<Category[]>(
    PRODUCT_CATEGORIES_WITH_PRODUCTS_QUERY,
  );

  return (
    <section className="mx-auto  max-w-6xl px-4 py-12">
      <h2 className="mt-3 font-display mb-1.5 text-4xl leading-tight text-[#7A1220] sm:text-5xl">
        Explorer nos gammes
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category._id} category={category} />
        ))}
      </div>
    </section>
  );
}
