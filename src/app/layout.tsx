import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import { Providers } from "@/components/Providers";
import SubscriptionPrompt from "@/components/SubscriptionPrompt";

export const metadata: Metadata = {
  title: "Political Aficionado - Latest News",
  description: "Stay updated with the latest from Political Aficionado. Featured in Google News and Yahoo News.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Political Aficionado",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Political Aficionado",
    title: "Political Aficionado - Latest News",
    description: "Stay updated with the latest from Political Aficionado.",
  },
  twitter: {
    card: "summary",
    title: "Political Aficionado",
    description: "Stay updated with the latest from Political Aficionado.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://heavy-status.com" />
        <link rel="dns-prefetch" href="https://heavy-status.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9621492718805938"
          crossOrigin="anonymous"
        />
        <script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.OneSignalDeferred = window.OneSignalDeferred || [];
              OneSignalDeferred.push(async function(OneSignal) {
                await OneSignal.init({
                  appId: "1e4a9567-b83d-48e5-815e-9693386df41f",
                });
              });
            `,
          }}
        />
      </head>
      <body className="antialiased bg-white">
        <Providers>
          <Header/>
          <main className="min-h-screen">
            {children}
          </main>
          <Footer/>
          <AddToHomeScreen />
          <SubscriptionPrompt />
        </Providers>
      </body>
    </html>
  );
}
