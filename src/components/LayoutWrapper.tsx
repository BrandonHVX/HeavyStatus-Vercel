'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BottomNav from '@/components/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLivePage = pathname === '/live';

  return (
    <>
      {!isLivePage && <Header />}
      <main>{children}</main>
      {!isLivePage && <Footer />}
      <BottomNav />
    </>
  );
}
