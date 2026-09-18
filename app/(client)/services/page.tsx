import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/queries";
import type { ServiceSummary } from "@/type/service";

const ACCENT = "#7A1220";

export default async function ServicesPage() {
  const { data } = await sanityFetch({ query: SERVICES_QUERY });
  const services = (data ?? []) as ServiceSummary[];

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="mb-10 mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7A1220]">
            Catalogue
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Nos services
          </h1>
        </div>

        <p className="text-sm text-neutral-600">
          {services.length} service{services.length > 1 ? "s" : ""} disponible
          {services.length > 1 ? "s" : ""}
        </p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-neutral-500">
          Aucun service disponible pour le moment.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const imageUrl =
              typeof service.image === "string"
                ? service.image
                : (service.image?.asset?.url ?? null);

            return (
              <Link
                key={service._id}
                href={`/services/${service.slug}`}
                className="group overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_rgba(122,18,32,0.14)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={service.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  {service.isPopular ? (
                    <span className="absolute left-4 top-4 z-10 rounded-full bg-[#7A1220] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                      Populaire
                    </span>
                  ) : null}
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                      {service.priceType === "from" ? "À partir" : "Prix fixe"}
                    </p>
                    <p className="text-sm font-semibold text-[#7A1220]">
                      {service.price.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-neutral-900 group-hover:text-[#7A1220]">
                      {service.name}
                    </h2>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
                    <span className="inline-flex items-center gap-2">
                      <Clock size={15} />
                      {service.durationMinutes} min
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold text-neutral-900">
                      Voir plus
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
