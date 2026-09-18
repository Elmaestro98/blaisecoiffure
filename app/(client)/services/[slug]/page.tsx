import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import {
  RELATED_SERVICES_QUERY,
  SERVICE_BY_SLUG_QUERY,
} from "@/sanity/queries";
import type { ServiceDetail, ServiceSummary } from "@/type/service";

const ACCENT = "#7A1220";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getService(slug: string) {
  return client.fetch<ServiceDetail | null>(SERVICE_BY_SLUG_QUERY, { slug });
}

async function getRelatedServices(categoryId: string, slug: string) {
  return client.fetch<ServiceSummary[]>(RELATED_SERVICES_QUERY, {
    categoryId,
    slug,
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};

  return {
    title: `${service.name} — Blaise Coiffure`,
    description:
      service.description ??
      `Découvrez le service ${service.name} chez Blaise Coiffure.`,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const related = service.categoryId
    ? await getRelatedServices(service.categoryId, slug)
    : [];

  const serviceImageUrl =
    typeof service.image === "string"
      ? service.image
      : (service.image?.asset?.url ?? null);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16 mt-9 ">
      <Link
        href="/services"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft size={16} />
        Tous les services
      </Link>

      <div className="grid gap-8 sm:grid-cols-2 ">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          {serviceImageUrl ? (
            <Image
              src={serviceImageUrl}
              alt={service.name}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : null}
        </div>

        <div className="flex flex-col">
          {service.category ? (
            <span className="text-sm font-medium uppercase tracking-wide text-neutral-400">
              {service.category.title}
            </span>
          ) : null}

          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            {service.name}
          </h1>

          {service.isPopular ? (
            <span
              className="mt-3 inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Service populaire
            </span>
          ) : null}

          {service.description ? (
            <p className="mt-4 leading-relaxed text-neutral-600">
              {service.description}
            </p>
          ) : null}

          <div className="mt-6 flex items-center gap-6">
            <div>
              <p className="text-xs text-neutral-400">Prix</p>
              <p className="text-xl font-semibold" style={{ color: ACCENT }}>
                {service.priceType === "from" ? "À partir de " : ""}
                {service.price.toLocaleString("fr-FR")} FCFA
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">Durée</p>
              <p className="flex items-center gap-1 text-xl font-semibold text-neutral-900">
                <Clock size={18} />
                {service.durationMinutes} min
              </p>
            </div>
          </div>

          <Link
            href={`/reservation?service=${service.slug}`}
            className="mt-8 inline-flex w-fit items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            Réserver ce service
          </Link>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold text-neutral-900">
            Autres services similaires
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((item) => {
              const itemImageUrl =
                typeof item.image === "string"
                  ? item.image
                  : (item.image?.asset?.url ?? null);

              return (
                <Link
                  key={item._id}
                  href={`/services/${item.slug}`}
                  className="group relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  {itemImageUrl ? (
                    <Image
                      src={itemImageUrl}
                      alt={item.name}
                      fill
                      sizes="25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-neutral-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold text-white">
                    {item.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
