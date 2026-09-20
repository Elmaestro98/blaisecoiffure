import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getWriteClient } from "@/sanity/lib/writeClient";
import { isAdminEmail, primaryEmailOf } from "@/lib/admin";

const STATUTS = ["pending", "confirmed", "delivered", "cancelled"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    // Refus par defaut : seule une adresse administrateur connue passe.
    if (!isAdminEmail(primaryEmailOf(user))) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body?.status;

    if (!status || !STATUTS.includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const updated = await getWriteClient().patch(id).set({ status }).commit();

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order update failed:", error);
    return NextResponse.json(
      { error: "Le statut n’a pas pu être mis à jour." },
      { status: 500 },
    );
  }
}
