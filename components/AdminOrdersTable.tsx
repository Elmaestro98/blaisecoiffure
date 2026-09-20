"use client";

import { useState } from "react";

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

type OrderItem = {
  name?: string;
  unitPrice?: number;
  quantity?: number;
  lineTotal?: number;
};

export type OrderRow = {
  _id: string;
  reference?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  total?: number;
  paymentMethod?: "whatsapp" | "wave";
  status?: "pending" | "confirmed" | "delivered" | "cancelled";
  createdAt?: string;
  items?: OrderItem[];
};

const fcfa = (n = 0) => `${n.toLocaleString("fr-FR")} FCFA`;

export default function AdminOrdersTable({
  initialOrders,
}: {
  initialOrders: OrderRow[];
}) {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const updateStatus = async (id: string, status: OrderRow["status"]) => {
    setBusyId(id);
    setError("");
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Mise à jour impossible.");
      }
      setOrders((current) =>
        current.map((order) =>
          order._id === id ? { ...order, status } : order,
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mise à jour impossible.");
    } finally {
      setBusyId(null);
    }
  };

  if (!orders.length) {
    return (
      <p className="rounded-2xl border border-dashed border-[#D9B4B0] bg-[#FFF9F8] p-10 text-center text-sm text-[#756563]">
        Aucune commande pour le moment.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-[#E8B4B4] bg-[#FDF2F2] p-3 text-sm text-[#8E2332]">
          {error}
        </p>
      ) : null}

      {orders.map((order) => (
        <article
          key={order._id}
          className="rounded-2xl border border-[#E8D9D5] bg-white p-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-neutral-900">
                {order.customerName}{" "}
                <span className="font-normal text-neutral-500">
                  · {order.phone}
                </span>
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                {order.reference}
                {order.createdAt
                  ? ` · ${new Date(order.createdAt).toLocaleString("fr-FR")}`
                  : ""}
                {order.email ? ` · ${order.email}` : ""}
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[order.status ?? "pending"]}`}
            >
              {statusLabel[order.status ?? "pending"]}
            </span>
          </div>

          <ul className="mt-4 space-y-1 border-t border-[#F2E6E3] pt-3 text-sm text-neutral-700">
            {(order.items ?? []).map((item, index) => (
              <li key={index} className="flex justify-between gap-4">
                <span>
                  {item.name}{" "}
                  <span className="text-neutral-400">x{item.quantity}</span>
                </span>
                <span>{fcfa(item.lineTotal)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#F2E6E3] pt-3">
            <p className="text-sm font-bold text-[#7A1220]">
              Total {fcfa(order.total)}
              <span className="ml-2 text-xs font-normal text-neutral-500">
                {order.paymentMethod === "wave"
                  ? "Wave"
                  : "paiement à confirmer"}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {(["confirmed", "delivered", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busyId === order._id || order.status === s}
                  onClick={() => updateStatus(order._id, s)}
                  className="rounded-full border border-[#E8D9D5] px-3 py-1.5 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
