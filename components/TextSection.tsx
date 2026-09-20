import Link from "next/link";
import { TextSectionProps } from "@/type/textType";

const ACCENT = "#7A1220";

export function TextSection({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
}: TextSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        {eyebrow ? (
          <p
            className="text-sm font-semibold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            {eyebrow}
          </p>
        ) : null}

        <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
          {title}
        </h2>

        <p className="mt-4 leading-relaxed text-neutral-600">{description}</p>

        {ctaLabel && ctaHref ? (
          <Link
            href={ctaHref}
            className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
