import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Oswald } from "next/font/google";
import type { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";

export const metadata: Metadata = {
  title: "Blaise Coiffure",
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
