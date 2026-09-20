// Adresse publique du site.
// La variable NEXT_PUBLIC_SITE_URL permet de changer de domaine sans toucher
// au code ; sinon on retombe sur le domaine officiel (ou localhost en dev).
const PRODUCTION_URL = "https://www.blaisecoiffure.com";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === "production"
    ? PRODUCTION_URL
    : "http://localhost:3000")
).replace(/\/+$/, "");

export const siteName = "Blaise Coiffure";

// Ville du salon : sert au référencement local (recherches type
// "coiffeur Saint-Louis"). À corriger ici si l'adresse change.
export const siteCity = "Saint-Louis";
export const siteRegion = "Sénégal";
export const sitePostalCode = "46000";
export const siteCountry = "SN"; // code ISO du Sénégal
export const siteEmail = "blaisechoco@gmail.com";

// Profil TikTok vérifié. Facebook et Instagram pointent encore vers les pages
// d'accueil des réseaux, pas vers le salon : on ne les déclare pas à Google
// tant que les vraies adresses ne sont pas connues.
export const siteSocialProfiles = ["https://www.tiktok.com/@blaiseabobade"];

// Numéro unique du salon, au format international pour les liens tel: et
// WhatsApp. Toute modification ici se répercute partout.
export const sitePhoneDisplay = "+221 77 461 50 64";
export const sitePhoneE164 = "+221774615064";
export const siteWhatsApp = "221774615064";

export const siteDescription =
  "Salon de coiffure et institut de beauté à Saint-Louis, Sénégal : coupe, coloration, balayage, extensions, soins du visage, manucure et pédicure. Réservez votre rendez-vous en ligne.";
