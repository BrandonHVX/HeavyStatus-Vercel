import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "Heavy Status - Latest News",
  description: "Stay updated with the latest from Heavy Status. Featured in Google News and Yahoo News.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Heavy Status",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Heavy Status",
    title: "Heavy Status - Latest News",
    description: "Stay updated with the latest from Heavy Status.",
  },
  twitter: {
    card: "summary",
    title: "Heavy Status",
    description: "Stay updated with the latest from Heavy Status.",
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
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer/>
        <AddToHomeScreen />
      </body>
    </html>
  );
}
