import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getWriteClient } from "@/sanity/lib/writeClient";

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

    return NextResponse.json(
      {
        success: true,
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
