import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { BOOKINGS_QUERY } from "@/sanity/queries";
import AdminReservationsTable from "@/components/AdminReservationsTable";

export default async function AdminReservationsPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const adminEmail =
    process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
  const userEmail = user.emailAddresses?.[0]?.emailAddress ?? "";

  if (adminEmail && userEmail !== adminEmail) {
    redirect("/");
  }

  const bookings = await client.fetch(BOOKINGS_QUERY);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7A1220]">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Gestion des rendez-vous
        </h1>
      </div>

      <AdminReservationsTable initialBookings={bookings} />
    </main>
  );
}
