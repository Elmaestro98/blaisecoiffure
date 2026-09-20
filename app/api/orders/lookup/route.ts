import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { ORDER_BY_REFERENCE_QUERY } from "@/sanity/queries";

/**
 * Recherche d'une commande par une cliente non connectee.
 *
 * On exige la reference ET le telephone : la reference seule serait
 * devinable, et permettrait de lire les commandes des autres.
 * En POST plutot qu'en GET pour que le numero de telephone ne se retrouve
 * ni dans l'URL, ni dans l'historique du navigateur, ni dans les journaux.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const reference = String(body?.reference ?? "").trim().toUpperCase();
    const phone = String(body?.phone ?? "").trim();

    if (!reference || !phone) {
      return NextResponse.json(
        { error: "Référence et téléphone sont nécessaires." },
        { status: 400 },
      );
    }

    const order = await client
      .withConfig({ useCdn: false })
      .fetch(ORDER_BY_REFERENCE_QUERY, { reference, phone });

    if (!order) {
      // Message volontairement identique que la reference existe ou non :
      // on n'indique pas si une reference est valide.
      return NextResponse.json(
        { error: "Aucune commande ne correspond à ces informations." },
        { status: 404 },
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order lookup failed:", error);
    return NextResponse.json(
      { error: "La recherche n’a pas pu aboutir." },
      { status: 500 },
    );
  }
}
