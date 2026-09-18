import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const adminEmail =
      process.env.ADMIN_EMAIL ?? process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";
    const userEmail = user.emailAddresses?.[0]?.emailAddress ?? "";

    if (adminEmail && userEmail !== adminEmail) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body?.status;

    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
    }

    const updated = await client.patch(id).set({ status }).commit();

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("Booking update failed:", error);
    return NextResponse.json(
      { error: "Le statut n’a pas pu être mis à jour." },
      { status: 500 },
    );
  }
}
