import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/mes-reservations(.*)",
    "/mes-commandes(.*)",
    "/reservation(.*)",
    "/admin(.*)",
    "/api/bookings(.*)",
    // Necessaire pour que currentUser() soit disponible dans les routes
    // commandes. clerkMiddleware() n'impose pas la connexion : la creation
    // d'une commande reste ouverte, seul PATCH verifie l'administrateur.
    "/api/orders(.*)",
  ],
};
