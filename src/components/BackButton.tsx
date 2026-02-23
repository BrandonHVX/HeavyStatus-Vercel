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
      className={`back-button group ${className}`}
      aria-label={label}
    >
      <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-colors">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
