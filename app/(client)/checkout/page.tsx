"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";
import useStore from "@/store";

const WAVE_PAYMENT_LINK = process.env.NEXT_PUBLIC_WAVE_PAYMENT_LINK ?? "";
const WHATSAPP_RECIPIENT_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP_RECIPIENT_PHONE ?? "";

export default function CheckoutPage() {
  const items = useStore((state) => state.items);
  const resetCart = useStore((state) => state.resetCart);
  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  // Copie des lignes au moment de la validation : le panier est vide ensuite,
  // mais l'ecran de confirmation doit encore pouvoir les afficher.
  const [orderedItems, setOrderedItems] = useState<typeof items>([]);
  const [orderedTotal, setOrderedTotal] = useState(0);
  const [payNow, setPayNow] = useState(false);
  const [orderAction, setOrderAction] = useState<"whatsapp" | "wave" | null>(
    null,
  );
  const [orderReference, setOrderReference] = useState("");

  const whatsappUrl = useMemo(() => {
    if (!fullName.trim() || !phone.trim() || !WHATSAPP_RECIPIENT_PHONE) {
      return "";
    }

    const itemsText = items
      .map(
        ({ product, quantity }) =>
          `- ${product.name} x${quantity}: ${(product.price * quantity).toLocaleString("fr-FR")} FCFA`,
      )
      .join("\n");
    const paymentText = payNow
      ? "Paiement choisi : Wave"
      : "Paiement choisi : à confirmer avec le salon";
    const message = [
      "Bonjour Blaise Coiffure, je valide ma commande.",
      "",
      `Client : ${fullName.trim()}`,
      `Téléphone : ${phone.trim()}`,
      "",
      "Produits :",
      itemsText,
      "",
      `Total : ${total.toLocaleString("fr-FR")} FCFA`,
      paymentText,
    ].join("\n");

    return `https://wa.me/${WHATSAPP_RECIPIENT_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  }, [fullName, items, payNow, phone, total]);

  // Enregistre la commande cote serveur AVANT d'ouvrir WhatsApp ou Wave :
  // meme si la cliente n'envoie jamais le message, le salon a la trace.
  const registerOrderAction = async (action: "whatsapp" | "wave") => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSaveError("");

    const snapshotItems = items;
    const snapshotTotal = total;

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          paymentMethod: action,
          items: snapshotItems.map(({ product, quantity }) => ({
            productId: product._id,
            quantity,
          })),
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error ?? "La commande n’a pas pu être enregistrée.");
      }

      setOrderedItems(snapshotItems);
      setOrderedTotal(result?.total ?? snapshotTotal);
      setOrderReference(result?.reference ?? "");
      setOrderAction(action);
      resetCart();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "La commande n’a pas pu être enregistrée.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center sm:py-24">
        <ShoppingBag className="mx-auto h-12 w-12 text-[#7A1220]" />
        <h1 className="mt-5 font-display text-4xl text-[#24171A]">
          Votre panier est vide
        </h1>
        <Link
          href="/#produits"
          className="mt-7 inline-flex rounded-full bg-[#7A1220] px-6 py-3 text-sm font-semibold text-white"
        >
          Découvrir les produits
        </Link>
      </main>
    );
  }

  if (orderAction) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <section className="rounded-3xl border border-[#E8D9D5] bg-white p-8 shadow-[0_24px_80px_rgba(75,33,29,0.08)] sm:p-12">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#EAF8EF] text-[#16803C]">
            <Check className="h-8 w-8" />
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#8E2332]">
            Commande enregistrée
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[#24171A]">
            Merci {fullName}, votre commande est bien préparée.
          </h1>
          <p className="mt-4 leading-7 text-[#756563]">
            Référence : <strong>{orderReference}</strong>. Votre commande a été
            ouverte avec {orderAction === "wave" ? "Wave" : "WhatsApp"}.
          </p>

          <div className="mt-8 rounded-2xl bg-[#FBF7F5] p-5">
            <div className="flex items-center justify-between text-sm font-semibold text-[#24171A]">
              <span>Total</span>
              <span>{orderedTotal.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div className="mt-4 space-y-2 border-t border-[#E8D9D5] pt-4 text-sm text-[#756563]">
              {orderedItems.map(({ product, quantity }) => (
                <div key={product._id} className="flex justify-between gap-4">
                  <span>
                    {product.name} x{quantity}
                  </span>
                  <span>
                    {(product.price * quantity).toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm leading-6 text-[#756563]">
            {orderAction === "wave"
              ? "Terminez le paiement dans Wave. L’équipe pourra ensuite confirmer votre commande."
              : "L’équipe va confirmer votre commande sur WhatsApp."}
          </p>
          <p className="mt-6 rounded-xl border border-[#E8D9D5] bg-white p-4 text-sm leading-6 text-[#756563]">
            Notez votre référence <strong>{orderReference}</strong> : elle vous
            permet de suivre la commande depuis{" "}
            <Link href="/mes-commandes" className="font-semibold text-[#7A1220] hover:underline">
              Mes commandes
            </Link>
            , même sans compte.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/mes-commandes"
              className="inline-flex rounded-full bg-[#7A1220] px-6 py-3 text-sm font-semibold text-white"
            >
              Suivre ma commande
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-[#E8D9D5] bg-white px-6 py-3 text-sm font-semibold text-[#24171A]"
            >
              Continuer mes achats
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <Link
        href="/panier"
        className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au panier
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8E2332]">
            Paiement
          </p>
          <h1 className="mt-2 font-display text-4xl text-[#24171A]">
            Valider ma commande
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#756563]">
            Vérifiez vos produits, renseignez vos coordonnées, puis validez la
            commande sur WhatsApp.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-[#24171A]">
              Nom complet
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ex. Marie Diop"
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
            <label className="text-sm font-semibold text-[#24171A] sm:col-span-2">
              Email <span className="font-normal text-[#9C8D89]">(facultatif — pour recevoir un récapitulatif)</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="marie@exemple.com"
                className="mt-2 h-12 w-full rounded-xl border border-[#E8D9D5] bg-white px-4 font-normal outline-none focus:border-[#7A1220]"
              />
            </label>
          </div>

          <div className="mt-8 space-y-3">
            {items.map(({ product, quantity }) => {
              const imageUrl =
                typeof product.image === "string"
                  ? product.image
                  : (product.image?.asset?.url ?? null);

              return (
                <article
                  key={product._id}
                  className="flex items-center gap-4 rounded-2xl border border-[#E8D9D5] bg-white p-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F8EFEC]">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-contain p-2"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-[#24171A]">
                      {product.name}
                    </h2>
                    <p className="mt-1 text-sm text-[#756563]">
                      {quantity} x {product.price.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#7A1220]">
                    {(product.price * quantity).toLocaleString("fr-FR")} FCFA
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="h-fit rounded-2xl bg-[#FFF9F7] p-6">
          <h2 className="font-display text-2xl text-[#7A1220]">Résumé</h2>
          <div className="mt-5 flex items-center justify-between border-t border-[#E8D9D5] pt-4 font-semibold text-[#24171A]">
            <span>Total</span>
            <span>{total.toLocaleString("fr-FR")} FCFA</span>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm font-semibold text-[#24171A]">
              Choisir le paiement
            </p>
            <button
              type="button"
              onClick={() => setPayNow((value) => !value)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${payNow ? "border-[#1A73E8] bg-[#EFF6FF]" : "border-[#E8D9D5] bg-white"}`}
            >
              <span
                className={`grid h-5 w-5 place-items-center rounded border ${payNow ? "border-[#1A73E8] bg-[#1A73E8] text-white" : "border-[#CDA9A5]"}`}
              >
                {payNow ? <Check className="h-3.5 w-3.5" /> : null}
              </span>
              <span>
                <strong className="block text-[#24171A]">
                  Payer maintenant avec Wave
                </strong>
                <span className="text-xs font-normal text-[#756563]">
                  Le lien Wave s&apos;ouvrira après la validation WhatsApp.
                </span>
              </span>
            </button>
          </div>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registerOrderAction("whatsapp")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1DA851]"
            >
              Valider la commande sur WhatsApp
              <MessageCircle className="h-4 w-4" />
            </a>
          ) : (
            <p className="mt-4 text-xs leading-5 text-[#8E2332]">
              Renseignez votre nom et votre téléphone pour valider la commande.
            </p>
          )}

          {saveError ? (
            <p className="mt-4 rounded-xl border border-[#E8B4B4] bg-[#FDF2F2] p-3 text-xs leading-5 text-[#8E2332]">
              {saveError}
            </p>
          ) : null}

          {payNow && WAVE_PAYMENT_LINK ? (
            <a
              href={WAVE_PAYMENT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => registerOrderAction("wave")}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1A73E8] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Ouvrir Wave pour payer
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : payNow ? (
            <p className="mt-6 rounded-xl border border-[#E8D9D5] bg-white p-4 text-sm leading-6 text-[#756563]">
              Le lien de paiement Wave n&apos;est pas encore configuré.
            </p>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
