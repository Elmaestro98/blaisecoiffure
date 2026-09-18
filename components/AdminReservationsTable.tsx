"use client";

import { useState } from "react";

const statusClasses: Record<string, string> = {
  pending: "bg-[#F4E2E5] text-[#7A1220]",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-neutral-200 text-neutral-700",
};

const statusLabel: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmé",
  cancelled: "Annulé",
};

type BookingRow = {
  _id: string;
  clientName: string;
  email: string;
  serviceName?: string;
  service?: { name?: string } | null;
  appointmentDate?: string;
  appointmentTime?: string;
  phone?: string;
  status?: "pending" | "confirmed" | "cancelled";
};

export default function AdminReservationsTable({
  initialBookings,
}: {
  initialBookings: BookingRow[];
}) {
  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings);

  const updateStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      alert("Le statut n’a pas pu être mis à jour.");
      return;
    }

    setBookings((current) =>
      current.map((booking) =>
        booking._id === id
          ? { ...booking, status: status as BookingRow["status"] }
          : booking,
      ),
    );
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Client</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Heure</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-neutral-500"
                >
                  Aucune réservation pour le moment.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking._id} className="border-t border-neutral-200">
                  <td className="px-4 py-4 align-top">
                    <div className="font-semibold text-neutral-900">
                      {booking.clientName}
                    </div>
                    <div className="mt-1 text-neutral-500">{booking.email}</div>
                  </td>
                  <td className="px-4 py-4 align-top text-neutral-700">
                    {booking.serviceName || booking.service?.name || "Service"}
                  </td>
                  <td className="px-4 py-4 align-top text-neutral-700">
                    {booking.appointmentDate}
                  </td>
                  <td className="px-4 py-4 align-top text-neutral-700">
                    {booking.appointmentTime}
                  </td>
                  <td className="px-4 py-4 align-top text-neutral-700">
                    {booking.phone}
                  </td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex flex-col gap-2">
                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusClasses[booking.status ?? "pending"] ?? "bg-neutral-100 text-neutral-700"}`}
                      >
                        {statusLabel[booking.status ?? "pending"] ??
                          "En attente"}
                      </span>
                      <select
                        value={booking.status ?? "pending"}
                        onChange={(event) =>
                          updateStatus(booking._id, event.target.value)
                        }
                        className="rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-xs text-neutral-700 outline-none focus:border-[#7A1220]"
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmé</option>
                        <option value="cancelled">Annulé</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
