import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Oswald } from "next/font/google";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";
import { siteDescription, siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  // Base obligatoire pour que Next génère des URLs absolues (sitemap, partages)
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Salon de coiffure à Saint-Louis, Sénégal`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName,
    title: `${siteName} — Salon de coiffure à Saint-Louis, Sénégal`,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  // Code fourni par Google Search Console (méthode "Balise HTML").
  // Se renseigne dans la variable d'environnement, pas en dur dans le code.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: "/logo2.jpeg",
  },
};

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${oswald.variable} ${manrope.variable} antialiased`}>
          {children}
          <SanityLive />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#fff",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
};
export default RootLayout;
