'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
}

export default function BackButton({ label = 'Back', fallbackHref = '/' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button onClick={handleBack} aria-label={label}>
      &larr; {label}
    </button>
  );
}
