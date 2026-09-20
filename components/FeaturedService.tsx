"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ServiceSummary } from "../type/service";

const ACCENT = "#7A1220";

export function FeaturedServices({ services }: { services: ServiceSummary[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const frameId = requestAnimationFrame(updateButtons);
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    return () => {
      cancelAnimationFrame(frameId);
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!services.length) return null;

  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-8 text-center text-xl font-bold text-neutral-900 sm:mb-10 sm:text-3xl">
          Découvrez nos <span style={{ color: ACCENT }}>services phares</span>
        </h2>

        <div className="relative">
          {/* Flèches : masquées sur mobile (swipe), dans le carrousel dès sm, à l'extérieur dès xl */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!canPrev}
            aria-label="Service précédent"
            className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:flex xl:-left-5"
            style={{ backgroundColor: ACCENT }}
          >
            <ChevronLeft size={18} />
          </button>

          <div ref={emblaRef} className="overflow-hidden">
            {/* Espacement via padding des slides (-ml-4 / pl-4) : c'est ce qu'Embla calcule correctement */}
            <div className="-ml-4 flex touch-pan-y">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="min-w-0 flex-[0_0_78%] pl-4 sm:flex-[0_0_45%] lg:flex-[0_0_25%]"
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!canNext}
            aria-label="Service suivant"
            className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:flex xl:-right-5"
            style={{ backgroundColor: ACCENT }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: ServiceSummary }) {
  const imageUrl =
    typeof service.image === "string"
      ? service.image
      : (service.image?.asset?.url ?? null);

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-200" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <p
          className="line-clamp-2 text-base font-semibold sm:text-lg"
          style={{ color: service.isPopular ? ACCENT : "#fff" }}
        >
          {service.name}
        </p>
        <p className="mt-1 text-xs text-white/80">
          {service.priceType === "from" ? "À partir de " : ""}
          {service.price.toLocaleString("fr-FR")} FCFA ·{" "}
          {service.durationMinutes} min
        </p>
      </div>
    </Link>
  );
}

export default FeaturedServices;
