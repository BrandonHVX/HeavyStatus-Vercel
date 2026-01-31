import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import AddToHomeScreen from "@/components/AddToHomeScreen";
import OneSignalInit from "@/components/OneSignalInit";

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
      </head>
      <body className="antialiased bg-white">
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer/>
        <AddToHomeScreen />
        <OneSignalInit />
      </body>
    </html>
  );
}
