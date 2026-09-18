import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/mes-reservations(.*)",
    "/reservation(.*)",
    "/admin(.*)",
    "/api/bookings(.*)",
  ],
};
