import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/queries";
import { Post } from "@/lib/types";
import HomeMostPopular from "@/components/HomeMostPopular";

export const revalidate = 60;

function t(p?: Post) { return p?.title ?? "Untitled"; }
function author(p?: Post) { return p?.author?.node?.name || "Staff"; }
function href(p?: Post) { return p?.slug ? `/${p.slug}` : "#"; }
function img(p?: Post) { return p?.featuredImage?.node?.sourceUrl || "https://placehold.co/800x600.png"; }
function cat(p?: Post) { return p?.categories?.nodes?.[0]?.name || "News"; }
function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function authorInitial(p?: Post) {
  const n = p?.author?.node?.name || "S";
  return n.charAt(0).toUpperCase();
}

export default async function Home() {
  const { posts } = await getAllPosts();
  const all: Post[] = Array.isArray(posts) ? posts : [];

  const hero1 = all[0];
  const hero2 = all[1];
  const hero3 = all[2];
  const hero4 = all[3];
  const hero5 = all[4];

  const opinionPosts = all.slice(5, 7);
  const trendingPosts = all.slice(7, 11);

  const lifestylePosts = all.slice(0, 3);
  const lifestyleList = all.slice(3, 7);

  const mostPopularPosts = all.slice(0, 4);

  if (all.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-400">No articles yet</h2>
          <p className="text-sm text-neutral-400 mt-1">Articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">

        {/* ===== HERO BENTO GRID ===== */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            {/* Large featured - left */}
            {hero1 && (
              <Link href={href(hero1)} className="lg:col-span-6 lg:row-span-2 group block relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(hero1)} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h2 className="text-2xl md:text-[28px] font-bold text-white leading-tight tracking-tight font-heading">
                    {t(hero1)}
                  </h2>
                  <div className="flex items-center gap-2 mt-3 text-[12px] text-white/70">
                    <span>{author(hero1)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right column - 2 stacked cards */}
            {hero2 && (
              <Link href={href(hero2)} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden aspect-[3/2] lg:aspect-auto bg-neutral-100">
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(hero2)} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-3">{t(hero2)}</h3>
                  <span className="text-[11px] text-white/60 mt-1 block">{author(hero2)}</span>
                </div>
              </Link>
            )}

            {hero3 && (
              <Link href={href(hero3)} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden aspect-[3/2] lg:aspect-auto bg-neutral-100">
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(hero3)} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-3">{t(hero3)}</h3>
                  <span className="text-[11px] text-white/60 mt-1 block">{author(hero3)}</span>
                </div>
              </Link>
            )}

            {/* Bottom row */}
            {hero4 && (
              <Link href={href(hero4)} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden bg-neutral-900 p-5 flex flex-col justify-end min-h-[160px]">
                <Image className="object-cover opacity-40" src={img(hero4)} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="relative z-10">
                  <h3 className="text-[14px] font-bold text-white leading-snug font-heading line-clamp-3">{t(hero4)}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-white/50">
                    <span>{cat(hero4)}</span>
                    <span>&middot;</span>
                    <span>{author(hero4)}</span>
                  </div>
                </div>
              </Link>
            )}

            {hero5 && (
              <Link href={href(hero5)} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden bg-neutral-900 p-5 flex flex-col justify-end min-h-[160px]">
                <Image className="object-cover opacity-40" src={img(hero5)} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="relative z-10">
                  <h3 className="text-[14px] font-bold text-white leading-snug font-heading line-clamp-3">{t(hero5)}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-white/50">
                    <span>{cat(hero5)}</span>
                    <span>&middot;</span>
                    <span>{author(hero5)}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* ===== OPINION & ESSAYS + TRENDING TOPICS ===== */}
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Opinion & Essays */}
            <div className="lg:col-span-8">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-5 uppercase font-heading">Opinion & Essays</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {opinionPosts.map((p, i) => (
                  <Link key={p?.id || i} href={href(p)} className="group block">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-neutral-100">
                      <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(p)} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-sm rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                        {cat(p)}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2 group-hover:text-neutral-600 transition-colors">
                      {t(p)}
                    </h3>
                    <span className="text-[12px] text-neutral-400 mt-1.5 block">{author(p)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Trending Topics */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-5 uppercase font-heading">Trending Topics</h2>
              <div className="space-y-4">
                {trendingPosts.map((p, i) => (
                  <Link key={p?.id || i} href={href(p)} className="flex items-start gap-3 group">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100">
                      <Image className="object-cover" src={img(p)} alt="" fill sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors">
                        {t(p)}
                      </h3>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block">{cat(p)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== LIFESTYLE & IMPACT ===== */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-5 uppercase font-heading">Lifestyle & Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: article list */}
            <div className="lg:col-span-3">
              <div className="space-y-0 divide-y divide-neutral-100">
                {lifestyleList.map((p, i) => (
                  <Link key={p?.id || i} href={href(p)} className="block py-4 first:pt-0 group">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{cat(p)}</span>
                      <span className="text-[10px] text-neutral-300">{fmtDate(p?.date)}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors font-heading">
                      {t(p)}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[9px] font-semibold text-neutral-500">
                        {authorInitial(p)}
                      </div>
                      <span className="text-[11px] text-neutral-400">{author(p)}</span>
                    </div>
                  </Link>
                ))}
                <Link href="/headlines" className="flex items-center gap-1 pt-4 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors">
                  View All
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Center: large featured card */}
            {lifestylePosts[0] && (
              <Link href={href(lifestylePosts[0])} className="lg:col-span-5 group block relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3] lg:aspect-auto lg:min-h-[380px]">
                <span className="absolute top-3 left-3 z-10 px-2 py-0.5 bg-white rounded text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">
                  Home
                </span>
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(lifestylePosts[0])} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-[18px] font-bold text-white leading-snug font-heading line-clamp-2">
                    {t(lifestylePosts[0])}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/60">
                    <span>{fmtDate(lifestylePosts[0]?.date)}</span>
                    <span>Views: {Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right: dark card + another card */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {lifestylePosts[1] && (
                <Link href={href(lifestylePosts[1])} className="group block relative rounded-2xl overflow-hidden flex-1 min-h-[180px]" style={{ backgroundColor: '#1a1a2e' }}>
                  <Image className="object-cover opacity-50" src={img(lifestylePosts[1])} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" />
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-green-400 rounded text-[10px] font-bold text-neutral-900 uppercase tracking-wider">
                    Voice
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="text-[16px] font-bold text-white leading-snug font-heading line-clamp-3">
                      {t(lifestylePosts[1])}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-white/50">
                      <span>{fmtDate(lifestylePosts[1]?.date)}</span>
                    </div>
                  </div>
                </Link>
              )}

              {lifestylePosts[2] && (
                <Link href={href(lifestylePosts[2])} className="group block relative rounded-2xl overflow-hidden flex-1 min-h-[180px] bg-neutral-100">
                  <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(lifestylePosts[2])} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-2">
                      {t(lifestylePosts[2])}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-[10px] font-bold text-white">
                        {authorInitial(lifestylePosts[2])}
                      </div>
                      <span className="text-[11px] text-white/70 font-medium">{author(lifestylePosts[2])}</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ===== FEATURED ARTICLES CAROUSEL-STYLE ROW ===== */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight uppercase font-heading">Featured</h2>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {all.slice(0, 3).map((p, i) => (
              <Link key={p?.id || i} href={href(p)} className="group block">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-3 bg-neutral-100">
                  <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(p)} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                </div>
                <h3 className="text-[15px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2 group-hover:text-neutral-600 transition-colors">
                  {t(p)}
                </h3>
                <p className="text-[12px] text-neutral-400 mt-1.5 line-clamp-2">
                  {p?.excerpt?.replace(/<[^>]*>/g, "").slice(0, 100) || ""}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-500">
                    {authorInitial(p)}
                  </div>
                  <span className="text-[11px] text-neutral-500 font-medium">{author(p)}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex gap-1">
              {[0,1,2,3,4].map((dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full ${dot === 0 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              ))}
            </div>
            <Link href="/headlines" className="flex items-center gap-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors">
              View All
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* ===== MOST POPULAR ===== */}
        <HomeMostPopular posts={mostPopularPosts} />

      </div>
    </div>
  );
}
