"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const ACCENT = "#7A1220";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
};

type GallerySectionProps = {
  eyebrow?: string;
  title: string;
  items: GalleryItem[];
};

export function GallerySection({
  eyebrow = "Notre travail",
  title,
  items,
}: GallerySectionProps) {
  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(items.map((item) => item.category)))],
    [items],
  );

  const [activeCategory, setActiveCategory] = useState("Tous");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(
    () =>
      activeCategory === "Tous"
        ? items
        : items.filter((item) => item.category === activeCategory),
    [items, activeCategory],
  );

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const showPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + filteredItems.length) % filteredItems.length,
    );
  };

  const showNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  // Fermer avec Échap, naviguer avec les flèches du clavier
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="galerie" className="scroll-mt-24 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <p className="text-sm text-black  font-semibold uppercase tracking-wide">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-[#7A1220] sm:text-3xl">
            {title}
          </h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const isActive = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className="rounded-full px-4 py-2 text-sm font-medium transition"
                style={
                  isActive
                    ? { backgroundColor: ACCENT, color: "#fff" }
                    : { backgroundColor: "#F5F5F5", color: "#404040" }
                }
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 [scrollbar-color:#7A1220_#F5F5F5] [scrollbar-width:thin]">
          {filteredItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openLightbox(index)}
              className="group relative aspect-square min-w-[78vw] snap-start overflow-hidden rounded-xl sm:min-w-[31%] lg:min-w-[24%]"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Fermer"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            aria-label="Image précédente"
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronLeft size={20} />
          </button>

          <div
            className="relative h-[80vh] w-full max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Image suivante"
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
