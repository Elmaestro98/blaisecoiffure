import Image from "next/image";
import Link from "next/link";
import { AboutSectionProps } from "@/type/aboutSectionType";

const ACCENT = "#7A1220";

type Stat = {
  value: string;
  label: string;
};

const defaultStats: Stat[] = [
  { value: "+20", label: "ans d'expérience" },
  { value: "+10000", label: "clients satisfaits" },
  { value: "15", label: "stylistes experts" },
];

export function AboutSection({
  imageSrc,
  eyebrow = "À propos",
  title,
  description,
  stats = defaultStats,
  ctaLabel,
  ctaHref,
  reverse = false,
}: AboutSectionProps) {
  const imageUrl =
    typeof imageSrc === "string" ? imageSrc : (imageSrc?.asset?.url ?? null);

  return (
    <section id="apropos" className="scroll-mt-24 py-16 sm:py-20">
      <div
        className={`mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-2 sm:items-center ${
          reverse ? "sm:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl shadow-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="text-center sm:text-left">
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            {eyebrow}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
            {title}
          </h2>

          <p className="mt-4 leading-relaxed text-neutral-600">{description}</p>

          {stats.length > 0 ? (
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-neutral-200 pt-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold" style={{ color: ACCENT }}>
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          ) : null}

          {ctaLabel && ctaHref ? (
            <Link
              href={ctaHref}
              className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
