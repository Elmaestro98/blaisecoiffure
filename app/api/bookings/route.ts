import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getWriteClient } from "@/sanity/lib/writeClient";
import { sendBookingEmails } from "@/lib/email";

const WHATSAPP_RECIPIENT_PHONE = process.env.WHATSAPP_RECIPIENT_PHONE;

export async function POST(request: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour réserver." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      serviceId,
      service,
      serviceSlug,
      date,
      time,
      fullName,
      phone,
      email,
      notes,
    } = body ?? {};

    if (
      !serviceId ||
      !service ||
      !date ||
      !time ||
      !fullName ||
      !phone ||
      !email
    ) {
      return NextResponse.json(
        { error: "Informations de réservation incomplètes." },
        { status: 400 },
      );
    }

    const booking = await getWriteClient().create({
      _type: "bookingRequest",
      service: {
        _type: "reference",
        _ref: String(serviceId),
      },
      serviceName: String(service),
      serviceSlug: serviceSlug ? String(serviceSlug) : "",
      clientName: String(fullName),
      phone: String(phone),
      email: String(email),
      appointmentDate: String(date),
      appointmentTime: String(time),
      notes: notes ? String(notes) : "",
      status: "pending",
      clerkUserId: user.id,
      createdAt: new Date().toISOString(),
    });

    // E-mails : accuse de reception au client + notification au salon.
    // La reservation est deja enregistree ; un echec d'envoi ne doit pas
    // la faire echouer, on se contente de le signaler dans la reponse.
    const emails = await sendBookingEmails({
      reference: booking._id,
      clientName: String(fullName),
      email: String(email),
      phone: String(phone),
      serviceName: String(service),
      date: String(date),
      time: String(time),
      notes: notes ? String(notes) : "",
    }).catch((error) => {
      console.error("Envoi des e-mails impossible :", error);
      return { client: false, salon: false };
    });

    let whatsappUrl = "";
    if (WHATSAPP_RECIPIENT_PHONE) {
      const whatsappMessage = [
        "Bonjour Blaise Coiffure, je viens de faire une demande de réservation.",
        "",
        `Client : ${String(fullName)}`,
        `Téléphone : ${String(phone)}`,
        `Email : ${String(email)}`,
        `Service : ${String(service)}`,
        `Date : ${String(date)}`,
        `Heure : ${String(time)}`,
        `Message : ${notes ? String(notes) : "Aucun"}`,
        `Référence : ${booking._id}`,
      ].join("\n");
      whatsappUrl = `https://wa.me/${WHATSAPP_RECIPIENT_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;
    } else {
      console.warn(
        "WHATSAPP_RECIPIENT_PHONE is not configured; WhatsApp link skipped.",
      );
    }

    return NextResponse.json(
      {
        success: true,
        whatsappUrl,
        emails,
        booking,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Booking creation failed:", error);
    return NextResponse.json(
      {
        error: "La réservation n’a pas pu être enregistrée.",
        ...(process.env.NODE_ENV !== "production" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 },
    );
  }
}
