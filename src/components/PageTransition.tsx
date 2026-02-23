'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        clearProps: 'all',
      }
    );
  }, [pathname]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}
