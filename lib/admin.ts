import { siteEmail } from "./site";

/**
 * Contrôle d'accès au back-office.
 *
 * Principe : on refuse par défaut. La liste des administrateurs vient de la
 * variable ADMIN_EMAIL (plusieurs adresses possibles, séparées par des
 * virgules) ; si elle est absente, on retombe sur l'adresse du salon.
 * Elle n'est donc JAMAIS vide, et l'oubli d'une variable ne peut plus
 * ouvrir l'administration à tous les comptes connectés.
 */
const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || siteEmail)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** Adresse principale et vérifiée du compte Clerk, ou null. */
export function primaryEmailOf(user: {
  primaryEmailAddressId?: string | null;
  emailAddresses?: {
    id: string;
    emailAddress: string;
    verification?: { status?: string | null } | null;
  }[];
}): string | null {
  const adresses = user.emailAddresses ?? [];
  const principale =
    adresses.find((a) => a.id === user.primaryEmailAddressId) ?? adresses[0];

  if (!principale) return null;
  // Une adresse non vérifiée ne prouve rien : on la refuse.
  if (principale.verification?.status !== "verified") return null;

  return principale.emailAddress;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}
