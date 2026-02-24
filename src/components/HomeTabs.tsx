'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface TabPost {
  id?: string | number;
  slug?: string;
  title?: string;
  date?: string;
  content?: string;
  featuredImage?: { node?: { sourceUrl?: string } };
  author?: { node?: { name?: string } };
  categories?: { nodes?: { name?: string; slug?: string }[] };
}

function getPostImage(p?: TabPost) {
  return p?.featuredImage?.node?.sourceUrl || 'https://placehold.co/800x600/png?text=IMAGE';
}

function getPostAuthor(p?: TabPost) {
  return p?.author?.node?.name || 'Staff';
}

function getAuthorInitial(p?: TabPost) {
  const name = p?.author?.node?.name || 'S';
  return name.charAt(0).toUpperCase();
}

function getReadTime(p?: TabPost) {
  const words = p?.content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

function formatFullDate(dateString?: string) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) {
    return 'Yesterday, ' + d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

const tabs = ['Popular', 'Trending', 'Recent'] as const;

export default function HomeTabs({
  popularPosts,
  trendingPosts,
  recentPosts,
}: {
  popularPosts: TabPost[];
  trendingPosts: TabPost[];
  recentPosts: TabPost[];
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('Popular');

  const postsMap = {
    Popular: popularPosts,
    Trending: trendingPosts,
    Recent: recentPosts,
  };

  const currentPosts = postsMap[activeTab];
  const featured = currentPosts[0];
  const secondaryPosts = currentPosts.slice(1);

  return (
    <div>
      <div className="flex items-center gap-6 mb-5 border-b border-neutral-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[15px] font-semibold transition-colors relative ${
              activeTab === tab
                ? 'text-neutral-900'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
            style={{ fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-neutral-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {featured && (
        <Link href={`/${featured.slug || ''}`} className="block group mb-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden" style={{ backgroundColor: '#c8d0ce' }}>
            <Image
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              src={getPostImage(featured)}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm"
              onClick={(e) => e.preventDefault()}
            >
              <svg className="w-[16px] h-[16px] text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[12px] text-white/70 mb-2 block">
                {formatFullDate(featured.date)}
              </span>
              <h2 className="text-[20px] md:text-[22px] font-bold text-white leading-snug tracking-tight">
                {featured.title || 'Untitled'}
              </h2>
              <div className="flex items-center gap-2.5 mt-3">
                <div className="w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-[11px] font-semibold text-white">
                  {getAuthorInitial(featured)}
                </div>
                <span className="text-[13px] text-white/90 font-medium">{getPostAuthor(featured)}</span>
                <span className="text-white/40">&bull;</span>
                <span className="text-[13px] text-white/70">{getReadTime(featured)} min read</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {secondaryPosts.length > 0 && (
        <div className="space-y-2.5">
          {secondaryPosts.map((p, i) => (
            <Link
              key={p?.id || p?.slug || i}
              href={`/${p?.slug || ''}`}
              className="flex gap-3.5 items-center group bg-white rounded-xl p-2.5"
            >
              <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  className="object-cover"
                  src={getPostImage(p)}
                  alt=""
                  fill
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors">
                  {p?.title || 'Untitled'}
                </h3>
                <span className="text-[11px] text-neutral-400 mt-0.5 block">
                  {getPostAuthor(p)} &middot; {getReadTime(p)} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
