import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";
import { ORDERS_BY_USER_QUERY } from "@/sanity/queries";
import { OrderCard, type CustomerOrder } from "@/components/OrderCard";
import OrderLookup from "@/components/OrderLookup";

export const metadata = { title: "Mes commandes" };

export default async function MyOrdersPage() {
  // Page ouverte aux invitees : commander ne demande pas de compte, retrouver
  // sa commande non plus. Connectee, la cliente voit sa liste directement ;
  // sinon elle utilise la recherche par reference.
  const user = await currentUser().catch(() => null);

  let orders: CustomerOrder[] = [];

  if (user) {
    const email = user.emailAddresses?.[0]?.emailAddress ?? "";
    orders = (await client
      .withConfig({ useCdn: false })
      .fetch(ORDERS_BY_USER_QUERY, {
        email,
        userId: user.id,
      })) as CustomerOrder[];
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7A1220]">
            Mes commandes
          </p>
          <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
            Vos commandes de produits
          </h1>
        </div>

        <Link
          href="/#produits"
          className="rounded-full bg-[#7A1220] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Voir les produits
        </Link>
      </div>

      {user ? (
        orders.length ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center text-neutral-600">
            Vous n’avez pas encore de commande liée à ce compte.
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-neutral-600">
          <p>
            Connectez-vous pour retrouver toutes vos commandes automatiquement,
            ou utilisez la recherche ci-dessous.
          </p>
        </div>
      )}

      <div className="mt-8">
        <OrderLookup />
      </div>
    </main>
  );
}
