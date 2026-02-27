'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <>
      {!isHomepage && <Header />}
      <main>{children}</main>
      {!isHomepage && <Footer />}
    </>
  );
}
