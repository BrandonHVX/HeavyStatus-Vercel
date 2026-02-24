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
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-3 bg-neutral-100 rounded-2xl px-4 py-3 transition-all focus-within:bg-neutral-50 focus-within:ring-1 focus-within:ring-neutral-200">
        <svg className="w-[18px] h-[18px] text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 bg-transparent text-[15px] text-neutral-900 placeholder-neutral-400 outline-none"
          style={{ fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}
        />
      </div>
    </form>
  );
}
