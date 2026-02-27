'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
