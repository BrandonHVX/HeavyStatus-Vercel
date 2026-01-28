import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ['latin']});

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
      <body className={`${inter.className} antialiased`}>
        <div className="max-w-[780px] p-4 md:p-10 mx-auto bg-background min-h-screen">
          <Header/>
          {children}
          <Footer/>
        </div>
      </body>
    </html>
  );
}
