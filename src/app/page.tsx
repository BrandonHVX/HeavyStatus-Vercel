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
function excerpt(p?: Post) { return (p?.excerpt || p?.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120); }
function readMin(p?: Post) { const w = p?.content?.split(/\s+/).length || 0; return Math.max(1, Math.ceil(w / 200)); }
function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtShort(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function authorInitial(p?: Post) {
  const n = p?.author?.node?.name || "S";
  return n.charAt(0).toUpperCase();
}

export default async function Home() {
  const { posts } = await getAllPosts();
  const all: Post[] = Array.isArray(posts) ? posts : [];

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
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">

            {/* 1: Large featured hero - left side, full height */}
            {all[0] && (
              <Link href={href(all[0])} className="lg:col-span-6 lg:row-span-2 group block relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:min-h-[440px]">
                <Image className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={img(all[0])} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block px-3 py-1 bg-red-500 rounded-sm text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                    {cat(all[0])}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight font-heading">
                    {t(all[0])}
                  </h2>
                  <p className="text-[13px] text-white/60 mt-2 line-clamp-2 max-w-lg">{excerpt(all[0])}</p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-[12px] font-bold text-white border border-white/30">
                      {authorInitial(all[0])}
                    </div>
                    <div>
                      <span className="text-[12px] text-white/90 font-medium block">{author(all[0])}</span>
                      <span className="text-[10px] text-white/50">{fmtDate(all[0]?.date)} &middot; {readMin(all[0])} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* 2: Top-right — white text-only card on image, no gradient, clean */}
            {all[1] && (
              <Link href={href(all[1])} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden bg-neutral-200 aspect-[3/2] lg:aspect-auto">
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(all[1])} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 right-0 p-4">
                  <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-3 drop-shadow-lg">{t(all[1])}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-white/80 font-medium">{author(all[1])}</span>
                    <span className="text-[10px] text-white/50">{fmtShort(all[1]?.date)}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* 3: Top-right — bottom-aligned text, accent border left */}
            {all[2] && (
              <Link href={href(all[2])} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[3/2] lg:aspect-auto">
                <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(all[2])} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="border-l-2 border-amber-400 pl-3">
                    <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-2">{t(all[2])}</h3>
                    <span className="text-[10px] text-amber-300/80 uppercase tracking-wider font-semibold mt-1 block">{cat(all[2])}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* 4: Bottom-left dark — dark overlay, icon + minimal text, navy tint */}
            {all[3] && (
              <Link href={href(all[3])} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden min-h-[160px]" style={{ backgroundColor: '#0f172a' }}>
                <Image className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" src={img(all[3])} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                  <span className="self-start px-2 py-0.5 bg-sky-500/20 border border-sky-400/30 rounded text-[9px] font-bold text-sky-300 uppercase tracking-wider">
                    {cat(all[3])}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-white leading-snug font-heading line-clamp-3">{t(all[3])}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-3.5 h-3.5 text-sky-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                      <span className="text-[11px] text-white/50">{author(all[3])}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* 5: Bottom-right dark — warm tint, stats bar at bottom */}
            {all[4] && (
              <Link href={href(all[4])} className="lg:col-span-3 group block relative rounded-2xl overflow-hidden min-h-[160px]" style={{ backgroundColor: '#1c1917' }}>
                <Image className="object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-500" src={img(all[4])} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                  <h3 className="text-[14px] font-bold text-white leading-snug font-heading line-clamp-3">{t(all[4])}</h3>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-amber-400/80 font-semibold uppercase tracking-wider">{cat(all[4])}</span>
                    <span className="text-[10px] text-white/40">{readMin(all[4])} min &middot; {fmtShort(all[4]?.date)}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* ===== OPINION & ESSAYS + TRENDING TOPICS ===== */}
        <section className="mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-6 uppercase font-heading">Opinion & Essays</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Opinion 1: Large image card with dark tag and excerpt */}
                {all[5] && (
                  <Link href={href(all[5])} className="group block">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-neutral-100">
                      <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" src={img(all[5])} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-900/80 backdrop-blur-sm rounded text-[10px] font-semibold text-white uppercase tracking-wider">
                        {cat(all[5])}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2 group-hover:text-neutral-600 transition-colors">
                      {t(all[5])}
                    </h3>
                    <p className="text-[12px] text-neutral-400 mt-1 line-clamp-2">{excerpt(all[5])}</p>
                    <span className="text-[11px] text-neutral-500 font-medium mt-2 block">{author(all[5])}</span>
                  </Link>
                )}

                {/* Opinion 2: Colored accent bar top, clean white card feel */}
                {all[6] && (
                  <Link href={href(all[6])} className="group block">
                    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-neutral-100">
                      <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" src={img(all[6])} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <span className="inline-block w-8 h-1 bg-indigo-500 rounded-full mb-2" />
                        <h3 className="text-[16px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2">
                          {t(all[6])}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        {authorInitial(all[6])}
                      </div>
                      <span className="text-[12px] text-neutral-500">{author(all[6])}</span>
                      <span className="text-[10px] text-neutral-300">&middot;</span>
                      <span className="text-[10px] text-neutral-400">{readMin(all[6])} min read</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Trending Topics — each item has different accent */}
            <div className="lg:col-span-4">
              <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-6 uppercase font-heading">Trending Topics</h2>
              <div className="space-y-1">

                {/* Trending 1: Blue left border */}
                {all[7] && (
                  <Link href={href(all[7])} className="flex items-start gap-3 group p-3 rounded-lg hover:bg-neutral-50 transition-colors border-l-3 border-l-blue-500">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <Image className="object-cover" src={img(all[7])} alt="" fill sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">{t(all[7])}</h3>
                      <span className="text-[10px] text-blue-500 font-medium mt-0.5 block">{cat(all[7])}</span>
                    </div>
                  </Link>
                )}

                {/* Trending 2: Green accent */}
                {all[8] && (
                  <Link href={href(all[8])} className="flex items-start gap-3 group p-3 rounded-lg hover:bg-neutral-50 transition-colors border-l-3 border-l-emerald-500">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                      <Image className="object-cover" src={img(all[8])} alt="" fill sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-emerald-600 transition-colors">{t(all[8])}</h3>
                      <span className="text-[10px] text-emerald-500 font-medium mt-0.5 block">{cat(all[8])}</span>
                    </div>
                  </Link>
                )}

                {/* Trending 3: Purple accent */}
                {all[9] && (
                  <Link href={href(all[9])} className="flex items-start gap-3 group p-3 rounded-lg hover:bg-neutral-50 transition-colors border-l-3 border-l-violet-500">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0">
                      <Image className="object-cover" src={img(all[9])} alt="" fill sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-violet-600 transition-colors">{t(all[9])}</h3>
                      <span className="text-[10px] text-violet-500 font-medium mt-0.5 block">{cat(all[9])}</span>
                    </div>
                  </Link>
                )}

                {/* Trending 4: Orange accent */}
                {all[10] && (
                  <Link href={href(all[10])} className="flex items-start gap-3 group p-3 rounded-lg hover:bg-neutral-50 transition-colors border-l-3 border-l-orange-500">
                    <div className="relative w-11 h-11 rounded-md overflow-hidden flex-shrink-0 ring-2 ring-orange-200">
                      <Image className="object-cover" src={img(all[10])} alt="" fill sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">{t(all[10])}</h3>
                      <span className="text-[10px] text-orange-500 font-medium mt-0.5 block">{cat(all[10])}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== LIFESTYLE & IMPACT ===== */}
        <section className="mb-14">
          <h2 className="text-lg font-bold text-neutral-900 tracking-tight mb-6 uppercase font-heading">Lifestyle & Impact</h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

            {/* Left column: text-based article list, each with unique style */}
            <div className="lg:col-span-3 space-y-0">

              {/* List item 1: Bold category chip + serif title */}
              {all[3] && (
                <Link href={href(all[3])} className="block py-4 border-b border-neutral-100 group">
                  <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[9px] font-bold uppercase tracking-wider mb-1.5">{cat(all[3])}</span>
                  <span className="text-[10px] text-neutral-300 ml-2">{fmtShort(all[3]?.date)}</span>
                  <h3 className="text-[14px] font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-rose-600 transition-colors font-heading mt-1">{t(all[3])}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-[9px] font-bold text-rose-500">{authorInitial(all[3])}</div>
                    <span className="text-[11px] text-neutral-400">{author(all[3])}</span>
                  </div>
                </Link>
              )}

              {/* List item 2: Underline-style, italic category */}
              {all[4] && (
                <Link href={href(all[4])} className="block py-4 border-b border-neutral-100 group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-teal-600 font-semibold italic">{cat(all[4])}</span>
                    <span className="text-[10px] text-neutral-300">{fmtDate(all[4]?.date)}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors font-heading underline decoration-transparent group-hover:decoration-teal-300 decoration-2 underline-offset-2 transition-all">{t(all[4])}</h3>
                  <span className="text-[11px] text-neutral-400 mt-1.5 block">{author(all[4])} &middot; {readMin(all[4])} min</span>
                </Link>
              )}

              {/* List item 3: Numbered style */}
              {all[5] && (
                <Link href={href(all[5])} className="flex gap-3 py-4 border-b border-neutral-100 group">
                  <span className="text-3xl font-black text-neutral-100 group-hover:text-neutral-200 transition-colors leading-none mt-0.5">03</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors font-heading">{t(all[5])}</h3>
                    <span className="text-[10px] text-neutral-400 mt-1 block">{fmtShort(all[5]?.date)}</span>
                  </div>
                </Link>
              )}

              {/* List item 4: Compact with small thumbnail */}
              {all[6] && (
                <Link href={href(all[6])} className="flex gap-3 items-center py-4 group">
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-neutral-100">
                    <Image className="object-cover" src={img(all[6])} alt="" fill sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[12px] font-semibold text-neutral-800 leading-snug line-clamp-2 group-hover:text-neutral-500 transition-colors">{t(all[6])}</h3>
                    <span className="text-[10px] text-neutral-400">{author(all[6])}</span>
                  </div>
                </Link>
              )}

              <Link href="/headlines" className="flex items-center gap-1 pt-3 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors">
                View All <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            {/* Center: large featured card with white tag */}
            {all[0] && (
              <Link href={href(all[0])} className="lg:col-span-5 group block relative rounded-2xl overflow-hidden bg-neutral-100 aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-white/90 backdrop-blur rounded-md text-[10px] font-semibold text-neutral-700 uppercase tracking-wider shadow-sm">
                  {cat(all[0])}
                </span>
                <span className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </span>
                <Image className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" src={img(all[0])} alt="" fill sizes="(max-width: 1024px) 100vw, 45vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white leading-snug font-heading line-clamp-2">{t(all[0])}</h3>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-white/60">
                    <span>{fmtDate(all[0]?.date)}</span>
                    <span>&middot;</span>
                    <span>{readMin(all[0])} min read</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Right column: stacked cards with different styles */}
            <div className="lg:col-span-4 flex flex-col gap-4">

              {/* Right 1: Dark navy card with green accent badge */}
              {all[1] && (
                <Link href={href(all[1])} className="group block relative rounded-2xl overflow-hidden flex-1 min-h-[185px]" style={{ backgroundColor: '#0f172a' }}>
                  <Image className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500" src={img(all[1])} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" />
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-emerald-400 rounded text-[9px] font-bold text-neutral-900 uppercase tracking-wider">
                    Voice
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                    <h3 className="text-[16px] font-bold text-white leading-snug font-heading line-clamp-3">{t(all[1])}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-emerald-300/60">{fmtDate(all[1]?.date)}</span>
                      <span className="text-white/20">&middot;</span>
                      <span className="text-[11px] text-white/40">{readMin(all[1])} min</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Right 2: Warm image card with author avatar bar */}
              {all[2] && (
                <Link href={href(all[2])} className="group block relative rounded-2xl overflow-hidden flex-1 min-h-[185px] bg-neutral-100">
                  <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" src={img(all[2])} alt="" fill sizes="(max-width: 1024px) 100vw, 30vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-[15px] font-bold text-white leading-snug font-heading line-clamp-2">{t(all[2])}</h3>
                    <div className="flex items-center gap-2 mt-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 w-fit">
                      <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-bold text-amber-900">{authorInitial(all[2])}</div>
                      <span className="text-[11px] text-white/80 font-medium">{author(all[2])}</span>
                      <span className="text-[10px] text-white/40">&middot; {readMin(all[2])} min</span>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ===== FEATURED ARTICLES — each card has distinct style ===== */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight uppercase font-heading">Featured</h2>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors">
                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Featured 1: Clean card with image + text below, subtle shadow */}
            {all[0] && (
              <Link href={href(all[0])} className="group block bg-white rounded-2xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.1)] transition-shadow">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" src={img(all[0])} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{cat(all[0])}</span>
                  <h3 className="text-[15px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2 mt-1 group-hover:text-blue-700 transition-colors">{t(all[0])}</h3>
                  <p className="text-[12px] text-neutral-400 mt-1.5 line-clamp-2">{excerpt(all[0])}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{authorInitial(all[0])}</div>
                    <span className="text-[11px] text-neutral-500 font-medium">{author(all[0])}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Featured 2: Dark card background, white text, no separate image */}
            {all[1] && (
              <Link href={href(all[1])} className="group block relative rounded-2xl overflow-hidden min-h-[320px]" style={{ backgroundColor: '#1e293b' }}>
                <Image className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500" src={img(all[1])} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                <div className="absolute inset-0 p-5 flex flex-col justify-end z-10">
                  <span className="self-start px-2 py-0.5 bg-amber-400/90 rounded text-[9px] font-bold text-neutral-900 uppercase tracking-wider mb-3">{cat(all[1])}</span>
                  <h3 className="text-[17px] font-bold text-white leading-snug font-heading line-clamp-2">{t(all[1])}</h3>
                  <p className="text-[11px] text-white/50 mt-1.5 line-clamp-2">{excerpt(all[1])}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">{authorInitial(all[1])}</div>
                    <span className="text-[11px] text-white/70 font-medium">{author(all[1])}</span>
                  </div>
                </div>
              </Link>
            )}

            {/* Featured 3: Horizontal card with side-by-side image & text */}
            {all[2] && (
              <Link href={href(all[2])} className="group block bg-neutral-50 rounded-2xl overflow-hidden hover:bg-neutral-100 transition-colors">
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  <Image className="object-cover transition-transform duration-500 group-hover:scale-[1.02]" src={img(all[2])} alt="" fill sizes="(max-width: 768px) 100vw, 380px" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-50/80" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{cat(all[2])}</span>
                    <span className="text-[10px] text-neutral-300 ml-auto">{fmtShort(all[2]?.date)}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-neutral-900 leading-snug font-heading line-clamp-2 group-hover:text-emerald-700 transition-colors">{t(all[2])}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px] text-neutral-500">{author(all[2])}</span>
                    <span className="text-[10px] text-neutral-400 bg-neutral-200 px-2 py-0.5 rounded-full">{readMin(all[2])} min read</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1.5">
              {[0,1,2,3,4].map((dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full ${dot === 0 ? 'bg-neutral-900' : 'bg-neutral-200'}`} />
              ))}
            </div>
            <Link href="/headlines" className="flex items-center gap-1 text-[12px] font-medium text-neutral-500 hover:text-neutral-800 transition-colors">
              View All <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* ===== MOST POPULAR ===== */}
        <HomeMostPopular posts={all.slice(0, 4)} />

      </div>
    </div>
  );
}
