'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FeaturedPost {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  timeAgo: string;
  imageUrl: string;
  duration: string;
  href: string;
}

interface UpNextPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  timeAgo: string;
  imageUrl: string;
  duration: string;
  href: string;
}

interface LiveClientWrapperProps {
  featuredPost: FeaturedPost;
  upNextPosts: UpNextPost[];
}

export default function LiveClientWrapper({ featuredPost, upNextPosts }: LiveClientWrapperProps) {
  const router = useRouter();
  const [autoplay, setAutoplay] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());

  const toggleSave = (id: string) => {
    setSavedPosts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',system-ui,-apple-system,sans-serif] pb-24">
      <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
        <Image
          src={featuredPost.imageUrl}
          alt={featuredPost.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="w-9 h-9 flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <button aria-label="Picture in picture" className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <rect x="12" y="9" width="8" height="6" rx="1" />
              </svg>
            </button>
            <button aria-label="More options" className="w-9 h-9 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex items-center gap-8">
            <button aria-label="Rewind 30 seconds" className="flex flex-col items-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
              <span className="text-white text-[10px] font-bold mt-0.5">30</span>
            </button>

            <Link
              href={featuredPost.href}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>

            <button aria-label="Forward 30 seconds" className="flex flex-col items-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </svg>
              <span className="text-white text-[10px] font-bold mt-0.5">30</span>
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
          <div className="flex items-center gap-3">
            <span className="text-white/90 text-[11px] font-medium tabular-nums">01:27</span>
            <div className="flex-1 h-[3px] bg-white/30 rounded-full relative">
              <div className="absolute left-0 top-0 h-full w-[22%] bg-[#2997FF] rounded-full">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-[#2997FF] rounded-full" />
              </div>
            </div>
            <span className="text-white/90 text-[11px] font-medium tabular-nums">{featuredPost.duration}</span>
            <button aria-label="Fullscreen" className="ml-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pt-5 pb-4">
        <span className="text-[13px] font-medium text-gray-400 tracking-wide">{featuredPost.category}</span>

        <h1
          className="text-[26px] font-extrabold text-white leading-[1.15] mt-2 tracking-tight"
          dangerouslySetInnerHTML={{ __html: featuredPost.title }}
        />

        <div className="flex items-center gap-3 mt-4">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-gray-300">
              {featuredPost.author.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <span className="text-[14px] font-medium text-white">{featuredPost.author}</span>
          <span className="text-[13px] text-gray-500">·</span>
          <span className="text-[13px] text-gray-500">{featuredPost.timeAgo}</span>
        </div>
      </div>

      <div className="px-4 pb-5">
        <h2 className="text-[16px] font-bold text-white mb-2">Description</h2>
        <p className="text-[14px] leading-relaxed text-gray-400">
          {descExpanded ? featuredPost.excerpt : featuredPost.excerpt.slice(0, 140)}
          {featuredPost.excerpt.length > 140 && !descExpanded && (
            <>
              ....
              <button
                onClick={() => setDescExpanded(true)}
                className="text-[#2997FF] font-medium ml-0.5"
              >
                read more
              </button>
            </>
          )}
        </p>
      </div>

      <div className="h-px bg-gray-800 mx-4" />

      <div className="px-4 pt-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-white">Up Next</h2>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-gray-400 font-medium">Autoplay</span>
            <button
              onClick={() => setAutoplay(!autoplay)}
              aria-label={autoplay ? 'Disable autoplay' : 'Enable autoplay'}
              className={`w-[50px] h-[30px] rounded-full relative transition-colors duration-200 ${autoplay ? 'bg-[#34C759]' : 'bg-gray-700'}`}
            >
              <div
                className={`w-[26px] h-[26px] bg-white rounded-full absolute top-[2px] transition-transform duration-200 shadow-md ${autoplay ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
              />
            </button>
          </div>
        </div>

        <div className="space-y-0">
          {upNextPosts.map((post, i) => (
            <div key={post.id}>
              <div className="flex items-start gap-3 py-3">
                <Link href={post.href} className="flex-shrink-0 w-[100px] h-[75px] rounded-xl overflow-hidden relative bg-gray-800 block">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-1.5 left-1.5 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-white tabular-nums">
                    {post.duration}
                  </div>
                </Link>

                <div className="flex-1 min-w-0 pt-0.5">
                  <Link href={post.href}>
                    <h3
                      className="text-[14px] font-semibold text-white leading-snug line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                  </Link>
                  <p className="text-[12px] text-gray-500 mt-1.5">
                    {post.category} · {post.timeAgo}
                  </p>
                </div>

                <button
                  onClick={() => toggleSave(post.id)}
                  aria-label={savedPosts.has(post.id) ? 'Remove bookmark' : 'Save for later'}
                  className="flex-shrink-0 mt-1 p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={savedPosts.has(post.id) ? 'white' : 'none'} stroke={savedPosts.has(post.id) ? 'white' : '#6b7280'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                  </svg>
                </button>
              </div>
              {i < upNextPosts.length - 1 && <div className="h-px bg-gray-800/80" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
