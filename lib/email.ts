import { Resend } from "resend";
import { siteCity, siteEmail, siteName, sitePhoneDisplay, siteUrl } from "./site";

const ACCENT = "#7A1220";

// Adresse d'expedition. Le domaine doit etre verifie dans Resend, sinon
// l'envoi echoue. En attendant la verification, RESEND_FROM_EMAIL permet
// d'utiliser l'adresse de test "onboarding@resend.dev".
const FROM =
  process.env.RESEND_FROM_EMAIL ||
  `${siteName} <rendezvous@blaisecoiffure.com>`;

// Boite qui recoit les nouvelles demandes.
const SALON_INBOX = process.env.ADMIN_EMAIL || siteEmail;

export type BookingEmailData = {
  reference: string;
  clientName: string;
  email: string;
  phone: string;
  serviceName: string;
  date: string; // AAAA-MM-JJ
  time: string;
  notes?: string;
};

function formatDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function recapRows(b: BookingEmailData) {
  const lignes: [string, string][] = [
    ["Service", b.serviceName],
    ["Date", formatDate(b.date)],
    ["Heure", b.time],
    ["Nom", b.clientName],
    ["Téléphone", b.phone],
    ["Email", b.email],
  ];
  if (b.notes?.trim()) lignes.push(["Message", b.notes.trim()]);

  return lignes
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:8px 0;color:#756563;font-size:14px;width:120px;vertical-align:top">${k}</td>
           <td style="padding:8px 0;color:#24171A;font-size:14px;font-weight:600">${escapeHtml(v)}</td>
         </tr>`,
    )
    .join("");
}

function layout(titre: string, intro: string, b: BookingEmailData, pied: string) {
  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#FBF7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF7F5;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #F2E6E3">
        <tr><td style="background:${ACCENT};padding:24px">
          <p style="margin:0;color:#F1C8C8;font-size:11px;letter-spacing:2px;text-transform:uppercase">${siteName} · ${siteCity}</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;line-height:1.3">${titre}</h1>
        </td></tr>
        <tr><td style="padding:24px">
          <p style="margin:0 0 20px;color:#756563;font-size:15px;line-height:1.6">${intro}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="background:#FDF7F6;border:1px solid #F2E6E3;border-radius:12px;padding:8px 16px">
            ${recapRows(b)}
          </table>
          <p style="margin:20px 0 0;color:#9C8D89;font-size:12px">Référence : ${escapeHtml(b.reference)}</p>
        </td></tr>
        <tr><td style="padding:0 24px 24px">
          <p style="margin:0;color:#756563;font-size:13px;line-height:1.6;border-top:1px solid #F2E6E3;padding-top:16px">${pied}</p>
          <p style="margin:12px 0 0;color:#9C8D89;font-size:12px">
            ${siteName} — ${siteCity} · ${sitePhoneDisplay}<br>
            <a href="${siteUrl}" style="color:${ACCENT}">${siteUrl.replace("https://", "")}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function texteClient(b: BookingEmailData) {
  return [
    `Bonjour ${b.clientName},`,
    "",
    "Nous avons bien recu votre demande de rendez-vous.",
    "",
    `Service : ${b.serviceName}`,
    `Date    : ${formatDate(b.date)}`,
    `Heure   : ${b.time}`,
    "",
    "Notre equipe vous recontacte rapidement pour confirmer le creneau.",
    `Reference : ${b.reference}`,
    "",
    `${siteName} — ${siteCity} — ${sitePhoneDisplay}`,
  ].join("\n");
}

/**
 * Envoie les deux e-mails d'une nouvelle demande : l'accuse de reception au
 * client, et la notification au salon.
 * Ne jette jamais : une panne d'e-mail ne doit pas faire echouer une
 * reservation deja enregistree dans Sanity.
 */
export async function sendBookingEmails(b: BookingEmailData) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("RESEND_API_KEY absente : aucun e-mail envoye.");
    return { client: false, salon: false, reason: "missing_api_key" as const };
  }

  const resend = new Resend(apiKey);

  const auClient = resend.emails.send({
    from: FROM,
    to: b.email,
    subject: `Votre demande de rendez-vous — ${b.serviceName}`,
    text: texteClient(b),
    html: layout(
      "Demande bien reçue",
      `Bonjour ${escapeHtml(b.clientName)}, nous avons bien reçu votre demande de rendez-vous. Notre équipe vous recontacte rapidement pour confirmer le créneau.`,
      b,
      "Un imprévu ? Répondez simplement à cet e-mail ou appelez-nous, nous trouverons un autre créneau.",
    ),
  });

  const auSalon = resend.emails.send({
    from: FROM,
    to: SALON_INBOX,
    replyTo: b.email,
    subject: `Nouvelle demande — ${b.clientName} — ${formatDate(b.date)} ${b.time}`,
    text: [
      "Nouvelle demande de rendez-vous.",
      "",
      `Client  : ${b.clientName}`,
      `Tel     : ${b.phone}`,
      `Email   : ${b.email}`,
      `Service : ${b.serviceName}`,
      `Date    : ${formatDate(b.date)} a ${b.time}`,
      `Message : ${b.notes?.trim() || "Aucun"}`,
      `Ref     : ${b.reference}`,
      "",
      `Gerer : ${siteUrl}/admin/reservations`,
    ].join("\n"),
    html: layout(
      "Nouvelle demande de rendez-vous",
      "Une cliente ou un client vient de réserver en ligne. Le statut est « en attente » tant que vous ne l'avez pas confirmé.",
      b,
      `<a href="${siteUrl}/admin/reservations" style="color:${ACCENT};font-weight:600">Gérer les rendez-vous</a>`,
    ),
  });

  const [rClient, rSalon] = await Promise.allSettled([auClient, auSalon]);

  const ok = (r: PromiseSettledResult<{ error: unknown }>) =>
    r.status === "fulfilled" && !r.value?.error;

  if (!ok(rClient)) {
    console.error(
      "E-mail client non envoye :",
      rClient.status === "fulfilled" ? rClient.value.error : rClient.reason,
    );
  }
  if (!ok(rSalon)) {
    console.error(
      "E-mail salon non envoye :",
      rSalon.status === "fulfilled" ? rSalon.value.error : rSalon.reason,
    );
  }

  return { client: ok(rClient), salon: ok(rSalon) };
}
