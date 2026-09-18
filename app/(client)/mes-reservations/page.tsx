import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { BOOKINGS_BY_USER_QUERY } from "@/sanity/queries";

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

type Booking = {
  _id: string;
  serviceName?: string;
  service?: { name?: string } | null;
  clientName: string;
  phone?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  notes?: string;
  status?: string;
};

export default async function MyReservationsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";
  const bookings = await client.fetch(BOOKINGS_BY_USER_QUERY, {
    email,
    userId: user.id,
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7A1220]">
            Mes réservations
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Vos rendez-vous
          </h1>
        </div>

        <Link
          href="/reservation"
          className="rounded-full bg-[#7A1220] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Nouvelle réservation
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-neutral-600">
          Vous n’avez pas encore de réservation.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: Booking) => (
            <article
              key={booking._id}
              className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
                    {booking.serviceName || booking.service?.name || "Service"}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-neutral-900">
                    {booking.clientName}
                  </h2>
                </div>

                <span className="inline-flex w-fit items-center rounded-full bg-[#F4E2E5] px-3 py-1.5 text-xs font-semibold text-[#7A1220]">
                  {statusLabel[booking.status ?? "pending"] ??
                    booking.status ??
                    "En attente"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    Date
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {booking.appointmentDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    Heure
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {booking.appointmentTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                    Contact
                  </p>
                  <p className="mt-1 font-semibold text-neutral-900">
                    {booking.phone}
                  </p>
                </div>
              </div>

              {booking.notes ? (
                <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  {booking.notes}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
