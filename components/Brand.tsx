"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Brand } from "@/type/brandType";

export function BrandMarquee({ brands }: { brands: Brand[] }) {
  // On duplique la liste pour créer une boucle continue sans "trou"
  const loopedBrands = [...brands, ...brands];

  return (
    <section className="overflow-hidden py-12">
      <h2 className="mb-8 text-center font-serif text-3xl">Top marques</h2>

      <div className="relative">
        {/* Fondus sur les bords pour un effet propre */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex w-max items-center gap-20"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 25,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {loopedBrands.map((brand, i) => (
            <div
              key={`${brand._id}-${i}`}
              className="relative h-20 w-48 flex-shrink-0 transition-transform duration-300 hover:scale-105"
            >
              {brand.logo?.asset?.url && (
                <Image
                  src={brand.logo.asset.url}
                  alt={brand.name}
                  fill
                  className="object-contain"
                  sizes="192px"
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
