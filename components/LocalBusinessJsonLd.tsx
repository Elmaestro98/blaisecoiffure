import {
  siteCity,
  siteCountry,
  siteDescription,
  siteEmail,
  siteName,
  sitePhoneE164,
  sitePostalCode,
  siteRegion,
  siteSocialProfiles,
  siteUrl,
} from "@/lib/site";

/**
 * Données structurées « HairSalon » (schema.org).
 * Bloc invisible pour les visiteurs : il décrit le salon à Google, ce qui
 * permet d'apparaître dans les recherches locales et sur Maps.
 *
 * À COMPLÉTER quand les informations seront connues :
 *   - streetAddress  : le nom de rue / quartier exact
 *   - openingHours   : les horaires d'ouverture
 * Elles sont volontairement absentes plutôt qu'inventées : une donnée
 * structurée fausse est pénalisée par Google.
 */
export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    "@id": `${siteUrl}/#salon`,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    telephone: sitePhoneE164,
    email: siteEmail,
    image: `${siteUrl}/logo1.png`,
    logo: `${siteUrl}/logo1.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteCity,
      postalCode: sitePostalCode,
      addressCountry: siteCountry,
    },
    areaServed: {
      "@type": "City",
      name: `${siteCity}, ${siteRegion}`,
    },
    sameAs: siteSocialProfiles,
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/reservation`,
        inLanguage: "fr-FR",
      },
      name: "Réserver un rendez-vous",
    },
  };

  return (
    <script
      type="application/ld+json"
      // .replace(/</g, "\u003c") : recommandation de la doc Next pour
      // neutraliser toute injection de balise dans le JSON.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\u003c"),
      }}
    />
  );
}
