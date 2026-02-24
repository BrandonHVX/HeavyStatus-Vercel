'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/headlines?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
      <div className="flex-1 flex items-center gap-3 bg-neutral-100 rounded-full px-4 py-3">
        <svg className="w-[18px] h-[18px] text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for article"
          className="flex-1 bg-transparent text-[14px] text-neutral-900 placeholder-neutral-400 outline-none"
          style={{ fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}
        />
      </div>
      <button
        type="submit"
        className="w-11 h-11 rounded-full bg-neutral-900 flex items-center justify-center flex-shrink-0 hover:bg-neutral-800 transition-colors"
      >
        <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h18M3 12h18M3 18h18" />
          <circle cx="17" cy="6" r="2" fill="white" stroke="white" strokeWidth={1} />
          <circle cx="7" cy="12" r="2" fill="white" stroke="white" strokeWidth={1} />
          <circle cx="14" cy="18" r="2" fill="white" stroke="white" strokeWidth={1} />
        </svg>
      </button>
    </form>
  );
}
