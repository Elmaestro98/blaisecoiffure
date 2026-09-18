import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { SERVICES_QUERY } from "@/sanity/queries";
import BookingWizard from "@/components/BookingWizard";
import type { ServiceSummary } from "@/type/service";

export default async function ReservationPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const { data } = await sanityFetch({ query: SERVICES_QUERY });
  const services = (data ?? []) as ServiceSummary[];

  if (!services.length) {
    notFound();
  }

  return (
    <main className="bg-[#FBF7F5] px-4 py-10 sm:py-16">
      <div className="mx-auto mb-10 max-w-6xl pt-4 sm:mb-12 sm:pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8E2332]">
          Blaise Coiffure · Réservation
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-[#24171A] sm:text-6xl">
          Prenez le temps de vous sentir bien.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-[#756563] sm:text-base">
          Choisissez votre soin, votre créneau et laissez-nous préparer un
          moment rien que pour vous.
        </p>
      </div>

      <BookingWizard services={services} defaultServiceSlug={params.service} />
    </main>
  );
}
