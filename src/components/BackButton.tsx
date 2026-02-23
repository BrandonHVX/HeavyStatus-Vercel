'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

export default function BackButton({ label = 'Back', fallbackHref = '/', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`back-button ${className}`}
      aria-label={label}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
