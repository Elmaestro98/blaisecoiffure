import Image from "next/image";
import Link from "next/link";
import { Category } from "@/type/categoryType";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl"
    >
      {category.image?.asset?.url && (
        <Image
          src={category.image.asset.url}
          alt={category.title}
          fill
          placeholder="blur"
          blurDataURL={category.image.asset.metadata.lqip}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}

      {/* Overlay léger pour lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Pill du titre, centré en bas */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-white/20 px-6 py-2 font-serif text-lg text-white backdrop-blur-sm">
          {category.title}
        </span>
      </div>
    </Link>
  );
}
