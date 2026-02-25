'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PopularPost {
  id?: string | number;
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
  author?: { node?: { name?: string } };
  categories?: { nodes?: { name?: string; slug?: string }[] };
}

function formatShortDate(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function readMin(p?: PopularPost) {
  const w = p?.content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(w / 200));
}

function cat(p?: PopularPost) {
  return p?.categories?.nodes?.[0]?.name || 'News';
}

const tabs = ['Day', 'Week', 'Month'] as const;

const borderColors = ['border-red-500', 'border-blue-500', 'border-emerald-500', 'border-amber-500'];
const numColors = ['text-red-200', 'text-blue-200', 'text-emerald-200', 'text-amber-200'];
const catColors = ['text-red-500', 'text-blue-500', 'text-emerald-500', 'text-amber-500'];

export default function HomeMostPopular({ posts }: { posts: PopularPost[] }) {
  const [activeTab, setActiveTab] = useState<string>('Day');

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-neutral-900 tracking-tight uppercase font-heading">Most Popular</h2>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {posts.slice(0, 4).map((p, i) => (
          <Link
            key={p?.id || p?.slug || i}
            href={`/${p?.slug || ''}`}
            className="group block"
          >
            <div className={`border-t-[3px] ${borderColors[i]} pt-4`}>
              <div className="flex items-start gap-3">
                <span className={`text-[32px] font-black ${numColors[i]} leading-none select-none`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0 pt-1">
                  <span className="text-[11px] text-neutral-400 block mb-1">
                    {formatShortDate(p?.date)}
                  </span>
                  <h3 className="text-[14px] font-bold text-neutral-900 leading-snug line-clamp-3 group-hover:text-neutral-600 transition-colors font-heading">
                    {p?.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${catColors[i]}`}>{cat(p)}</span>
                    <span className="text-[10px] text-neutral-300">&middot;</span>
                    <span className="text-[10px] text-neutral-400">{readMin(p)} min</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
