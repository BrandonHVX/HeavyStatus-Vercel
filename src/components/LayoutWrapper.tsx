'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import BottomNav from '@/components/BottomNav';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideGlobalNav = pathname === '/' || pathname === '/live';

  return (
    <>
      {!hideGlobalNav && <Header />}
      <main>{children}</main>
      {!hideGlobalNav && <Footer />}
      <BottomNav />
    </>
  );
}
