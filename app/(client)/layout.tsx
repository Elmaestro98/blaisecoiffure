import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import { sanityFetch } from "@/sanity/lib/live";
import { ANNOUNCEMENT_BAR_QUERY } from "@/sanity/queries";

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
  const { data } = await sanityFetch({ query: ANNOUNCEMENT_BAR_QUERY });
  const announcementBar = data as AnnouncementBarData | null;

  return (
    <ClerkProvider>
      <div className="flex min-h-screen flex-col">
        {announcementBar?.messages?.length ? (
          <AnnouncementBar
            messages={announcementBar.messages}
            intervalMs={announcementBar.intervalMs}
          />
        ) : null}
        <Header />
        <main className="flex-1">{children}</main>
      </div>
    </ClerkProvider>
  );
}
