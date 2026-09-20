import { redirect } from "next/navigation";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail, primaryEmailOf } from "@/lib/admin";
import { client } from "@/sanity/lib/client";
import { ORDERS_QUERY } from "@/sanity/queries";
import AdminOrdersTable, { type OrderRow } from "@/components/AdminOrdersTable";

export default async function AdminOrdersPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Refus par defaut : seule une adresse administrateur connue passe.
  if (!isAdminEmail(primaryEmailOf(user))) {
    redirect("/");
  }

  // Lecture sans cache CDN : un back-office doit afficher l'etat reel.
  const orders = (await client
    .withConfig({ useCdn: false })
    .fetch(ORDERS_QUERY)) as OrderRow[];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7A1220]">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Commandes de produits
        </h1>
        <Link
          href="/admin/reservations"
          className="mt-3 inline-block text-sm font-medium text-[#7A1220] hover:underline"
        >
          Voir les rendez-vous
        </Link>
      </div>

      <AdminOrdersTable initialOrders={orders} />
    </main>
  );
}
