"use client";

import { useState } from "react";
import { OrderCard, type CustomerOrder } from "./OrderCard";

export default function OrderLookup() {
  const [reference, setReference] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const search = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, phone }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? "La recherche n’a pas pu aboutir.");
      }
      setOrder(result.order as CustomerOrder);
    } catch (e) {
      setError(e instanceof Error ? e.message : "La recherche a échoué.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-[24px] border border-[#E8D9D5] bg-[#FFF9F7] p-6">
      <h2 className="font-display text-2xl text-[#7A1220]">
        Retrouver une commande
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#756563]">
        Vous avez commandé sans créer de compte ? Saisissez la référence reçue
        après votre commande et le téléphone indiqué.
      </p>

      <form onSubmit={search} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-sm font-semibold text-[#24171A]">
          Référence
          <input
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="BC-XXXXXX"
            className="mt-2 h-12 w-full rounded-xl border border-[#E8D9D5] bg-white px-4 font-normal outline-none focus:border-[#7A1220]"
          />
        </label>
        <label className="text-sm font-semibold text-[#24171A]">
          Téléphone
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+221 77 000 00 00"
            className="mt-2 h-12 w-full rounded-xl border border-[#E8D9D5] bg-white px-4 font-normal outline-none focus:border-[#7A1220]"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading || !reference.trim() || !phone.trim()}
          className="mt-2 h-12 self-end rounded-xl bg-[#7A1220] px-6 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 sm:mt-0"
        >
          {isLoading ? "Recherche…" : "Rechercher"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 rounded-xl border border-[#E8B4B4] bg-[#FDF2F2] p-3 text-sm text-[#8E2332]">
          {error}
        </p>
      ) : null}

      {order ? (
        <div className="mt-5">
          <OrderCard order={order} />
        </div>
      ) : null}
    </section>
  );
}
