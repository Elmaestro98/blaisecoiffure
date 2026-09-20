const statusClasses: Record<string, string> = {
  pending: "bg-[#F4E2E5] text-[#7A1220]",
  confirmed: "bg-emerald-100 text-emerald-700",
  delivered: "bg-sky-100 text-sky-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export type CustomerOrder = {
  _id: string;
  reference?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  total?: number;
  paymentMethod?: "whatsapp" | "wave";
  status?: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt?: string;
  items?: {
    name?: string;
    unitPrice?: number;
    quantity?: number;
    lineTotal?: number;
  }[];
};

const fcfa = (n = 0) => `${n.toLocaleString("fr-FR")} FCFA`;

export function OrderCard({ order }: { order: CustomerOrder }) {
  const status = order.status ?? "pending";

  return (
    <article className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-400">
            {order.reference}
          </p>
          <h2 className="mt-2 text-xl font-bold text-neutral-900">
            {fcfa(order.total)}
          </h2>
          {order.createdAt ? (
            <p className="mt-1 text-sm text-neutral-500">
              Commandée le{" "}
              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          ) : null}
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1.5 text-xs font-semibold ${statusClasses[status]}`}
        >
          {statusLabel[status]}
        </span>
      </div>

      <ul className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm text-neutral-700">
        {(order.items ?? []).map((item, index) => (
          <li key={index} className="flex justify-between gap-4">
            <span>
              {item.name}{" "}
              <span className="text-neutral-400">x{item.quantity}</span>
            </span>
            <span className="font-medium">{fcfa(item.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        Paiement :{" "}
        {order.paymentMethod === "wave" ? "Wave" : "à confirmer avec le salon"}
      </p>
    </article>
  );
}
