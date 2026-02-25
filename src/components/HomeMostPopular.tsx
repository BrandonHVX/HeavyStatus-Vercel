'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PopularPost {
  id?: string | number;
  slug?: string;
  title?: string;
  date?: string;
  author?: { node?: { name?: string } };
  categories?: { nodes?: { name?: string; slug?: string }[] };
}

function formatShortDate(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const tabs = ['Day', '2 Wrd', 'Month'] as const;

export default function HomeMostPopular({ posts }: { posts: PopularPost[] }) {
  const [activeTab, setActiveTab] = useState<string>('Day');

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-heading">MOST POPULAR</h2>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0 bg-neutral-100 rounded-full p-0.5">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="ml-2 w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
            <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {posts.slice(0, 4).map((p, i) => (
          <Link
            key={p?.id || p?.slug || i}
            href={`/${p?.slug || ''}`}
            className="group block"
          >
            <div className="border-t-2 border-neutral-900 pt-3">
              <span className="text-[11px] text-neutral-400 block mb-1.5">
                {formatShortDate(p?.date)}
              </span>
              <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-3 group-hover:text-neutral-600 transition-colors font-heading">
                {p?.title || 'Untitled'}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
