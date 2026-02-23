'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface PullToRefreshProps {
  children: ReactNode;
}

export default function PullToRefresh({ children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const threshold = 80;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        setPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!pulling || refreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      if (diff > 0 && window.scrollY === 0) {
        e.preventDefault();
        const resistance = 0.4;
        const distance = Math.min(diff * resistance, 120);
        setPullDistance(distance);
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !refreshing) {
        setRefreshing(true);
        setPullDistance(48);

        await new Promise(resolve => setTimeout(resolve, 400));
        router.refresh();

        setTimeout(() => {
          setRefreshing(false);
          setPullDistance(0);
          setPulling(false);
        }, 600);
      } else {
        setPullDistance(0);
        setPulling(false);
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pulling, pullDistance, refreshing, router]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: pullDistance > 0 ? pullDistance : 0,
          transition: pulling ? 'none' : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className={`flex flex-col items-center gap-1 text-gray-400 ${refreshing ? 'animate-pulse' : ''}`}>
          <svg
            className="w-5 h-5"
            style={{
              transform: refreshing ? 'none' : `rotate(${progress * 360}deg)`,
              transition: refreshing ? 'none' : 'transform 0.1s linear',
              animation: refreshing ? 'spin 0.8s linear infinite' : 'none',
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-xs font-sans">
            {refreshing ? 'Refreshing...' : pullDistance >= threshold ? 'Release' : ''}
          </span>
        </div>
      </div>
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(0)` : undefined,
          transition: pulling ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
