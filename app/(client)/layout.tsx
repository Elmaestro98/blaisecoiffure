import { Suspense } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { sanityFetch } from "@/sanity/lib/live";
import { ANNOUNCEMENT_BAR_QUERY, PRODUCTS_QUERY } from "@/sanity/queries";
import type { ProductSummary } from "@/type/products";

type AnnouncementBarData = {
  intervalMs: number;
  messages: Array<{
    text: string;
    icon?: string;
    link?: string;
  }>;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [{ data: announcementData }, { data: productsData }] =
    await Promise.all([
      sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY }),
      sanityFetch({ query: PRODUCTS_QUERY }),
    ]);
  const announcementBar = announcementData as AnnouncementBarData | null;
  const products = (productsData ?? []) as ProductSummary[];

  return (
    <ClerkProvider>
      <div className="flex min-h-screen flex-col">
        {announcementBar?.messages?.length ? (
          <AnnouncementBar
            messages={announcementBar.messages}
            intervalMs={announcementBar.intervalMs}
          />
        ) : null}
        <Suspense fallback={null}>
          <Header products={products} />
        </Suspense>
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </ClerkProvider>
  );
}
