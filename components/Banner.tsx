"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Play } from "lucide-react";
import { P1, P2, P3, P4 } from "@/Image/banner";

const slides = [
  {
    image: P1,
    eyebrow: "L expertise Blaise",
    title: "Révélez votre style.",
    description:
      "Coupes, soins et conseils personnalisés pour une allure qui vous ressemble.",
    category: "Coupe Homme",
  },
  {
    image: P4,
    eyebrow: "L expertise Blaise",
    title: "Révélez votre style.",
    description:
      "Coupes, soins et conseils personnalisés pour une allure qui vous ressemble.",
    category: "Coupe Femme",
  },
  {
    image: P2,
    eyebrow: "Le geste précision",
    title: "Une couleur qui vous ressemble.",
    description:
      "Des nuances travaillées avec soin pour illuminer votre visage et votre quotidien.",
    category: "Coloration",
  },

  {
    image: P3,
    eyebrow: "Le geste précision",
    title: "Pour tout type de peau.",
    description:
      "Des nuances travaillées avec soin pour illuminer votre visage et votre quotidien.",
    category: "Soin Visage",
  },
];

const categories = ["Coupe Homme", "Coloration", "Soin Visage"];

export function Banner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // parallax léger de la photo au scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const changeSlide = (nextSlide: number, nextDirection: number) => {
    setDirection(nextDirection);
    setActiveSlide((nextSlide + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      changeSlide(activeSlide + 1, 1);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [activeSlide, isPaused]);

  const slide = slides[activeSlide];

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex min-h-[600px] w-full flex-col overflow-hidden rounded-2xl bg-[#1A0A0D] sm:min-h-[640px] sm:rounded-3xl lg:min-h-[680px]"
    >
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={`${slide.title} - Blaise Coiffure`}
              fill
              priority={activeSlide === 0}
              quality={90}
              sizes="(max-width: 768px) 100vw, 1280px"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Mobile : dégradé vertical (le texte occupe toute la largeur) */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,10,13,.55)_0%,rgba(26,10,13,.78)_55%,rgba(26,10,13,.96)_100%)] sm:hidden" />
      {/* Tablette / desktop : dégradé horizontal (texte à gauche) */}
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(26,10,13,.96)_0%,rgba(26,10,13,.78)_38%,rgba(122,18,32,.28)_72%,rgba(26,10,13,.16)_100%)] sm:block" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0A0D]/70 via-transparent to-[#1A0A0D]/20" />

      <div className="relative z-10 flex flex-1 flex-col justify-between gap-10 p-5 pt-24 sm:p-10 sm:pt-32 lg:p-14 lg:pt-36">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSlide}
              custom={direction}
              initial={{ opacity: 0, x: direction * 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -36 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F1C8C8] sm:mb-4 sm:text-xs sm:tracking-[0.24em]">
                {slide.eyebrow}
              </p>
              <h2 className="max-w-2xl break-words text-4xl font-bold leading-[0.98] text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/75 sm:mt-6 sm:text-base">
                {slide.description}
              </p>
              <Link
                href="/reservation"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1A0A0D] transition hover:bg-[#F1C8C8] sm:mt-8 sm:w-auto"
              >
                <CalendarDays className="h-4 w-4" />
                Réserver un rendez-vous
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5">
          {/* Défilement horizontal sur mobile, retour à la ligne à partir de sm */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium backdrop-blur transition ${
                  cat === slide.category
                    ? "border-white bg-white text-[#1A0A0D]"
                    : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-white sm:gap-3">
              <span className="text-sm font-semibold">0{activeSlide + 1}</span>
              <div className="h-px w-12 bg-white/30 sm:w-32" />
              <span className="text-sm text-white/50">0{slides.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Slide précédent"
                onClick={() => changeSlide(activeSlide - 1, -1)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-[#1A0A0D]"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Slide suivant"
                onClick={() => changeSlide(activeSlide + 1, 1)}
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#1A0A0D] transition hover:bg-[#F1C8C8]"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Visible seulement quand il y a la place (évite le chevauchement avec le texte) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="absolute right-10 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 text-white lg:flex"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur">
            <Play className="h-5 w-5 fill-current" />
          </span>
          <span className="text-xs">Galerie</span>
        </motion.button>
      </div>
    </section>
  );
}

export default Banner;
