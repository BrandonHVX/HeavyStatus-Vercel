import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
      <body className="antialiased bg-white">
        <Header/>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
