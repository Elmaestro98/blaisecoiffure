import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getWriteClient } from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";
import { PRODUCTS_FOR_ORDER_QUERY } from "@/sanity/queries";
import { sendOrderEmails } from "@/lib/email";

const MAX_LIGNES = 50;
const MAX_QUANTITE = 99;

type LigneRecue = { productId?: unknown; quantity?: unknown };
type ProduitSanity = { _id: string; name: string; price: number; stock?: number };

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, email, paymentMethod, items } = body ?? {};

    if (!fullName || !phone || !Array.isArray(items) || !items.length) {
      return NextResponse.json(
        { error: "Informations de commande incomplètes." },
        { status: 400 },
      );
    }

    if (items.length > MAX_LIGNES) {
      return NextResponse.json({ error: "Trop de produits." }, { status: 400 });
    }

    // Quantites : entiers positifs uniquement, regroupes par produit.
    const quantites = new Map<string, number>();
    for (const ligne of items as LigneRecue[]) {
      const id = String(ligne?.productId ?? "");
      const q = Number(ligne?.quantity);
      if (!id || !Number.isInteger(q) || q < 1 || q > MAX_QUANTITE) {
        return NextResponse.json(
          { error: "Produit ou quantité invalide." },
          { status: 400 },
        );
      }
      quantites.set(id, Math.min((quantites.get(id) ?? 0) + q, MAX_QUANTITE));
    }

    // SECURITE : on ne fait aucune confiance aux prix envoyes par le
    // navigateur. On relit les produits dans Sanity et on recalcule tout.
    const produits = await client
      .withConfig({ useCdn: false })
      .fetch<ProduitSanity[]>(PRODUCTS_FOR_ORDER_QUERY, {
        ids: [...quantites.keys()],
      });

    if (!produits.length) {
      return NextResponse.json(
        { error: "Aucun des produits commandés n'est disponible." },
        { status: 400 },
      );
    }

    const lignes = produits.map((p) => {
      const quantity = quantites.get(p._id) ?? 0;
      const unitPrice = Number(p.price) || 0;
      return {
        _key: p._id,
        _type: "orderItem",
        product: { _type: "reference", _ref: p._id },
        name: p.name,
        unitPrice,
        quantity,
        lineTotal: unitPrice * quantity,
      };
    });

    const total = lignes.reduce((somme, l) => somme + l.lineTotal, 0);
    const reference = `BC-${Date.now().toString(36).toUpperCase()}`;
    const user = await currentUser().catch(() => null);

    const order = await getWriteClient().create({
      _type: "order",
      reference,
      customerName: String(fullName).slice(0, 120),
      phone: String(phone).slice(0, 40),
      email: email ? String(email).slice(0, 160) : undefined,
      items: lignes,
      total,
      paymentMethod: paymentMethod === "wave" ? "wave" : "whatsapp",
      status: "pending",
      clerkUserId: user?.id,
      createdAt: new Date().toISOString(),
    });

    // Les e-mails ne doivent jamais faire echouer une commande enregistree.
    const emails = await sendOrderEmails({
      reference,
      customerName: String(fullName),
      phone: String(phone),
      email: email ? String(email) : undefined,
      total,
      paymentMethod: paymentMethod === "wave" ? "wave" : "whatsapp",
      items: lignes.map(({ name, unitPrice, quantity, lineTotal }) => ({
        name,
        unitPrice,
        quantity,
        lineTotal,
      })),
    }).catch((error) => {
      console.error("Envoi des e-mails de commande impossible :", error);
      return { client: false, salon: false };
    });

    // Les produits ignores (supprimes ou desactives depuis l'ajout au panier).
    const ignores = [...quantites.keys()].filter(
      (id) => !produits.some((p) => p._id === id),
    );

    return NextResponse.json(
      { success: true, reference, total, emails, ignores, orderId: order._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "La commande n’a pas pu être enregistrée." },
      { status: 500 },
    );
  }
}
