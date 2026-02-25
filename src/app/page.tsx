import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/queries";
import { Post } from "@/lib/types";

export const revalidate = 60;

function t(p?: Post) { return p?.title ?? "Untitled"; }
function href(p?: Post) { return p?.slug ? `/${p.slug}` : "#"; }
function img(p?: Post) { return p?.featuredImage?.node?.sourceUrl || "https://placehold.co/800x600.png"; }
function cat(p?: Post) { return p?.categories?.nodes?.[0]?.name || "News"; }
function author(p?: Post) { return p?.author?.node?.name || "Staff"; }
function ex(p?: Post, len = 100) { return (p?.excerpt || p?.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, len); }
function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[14px] border border-[#ececec] bg-white shadow-[0_1px_2px_rgba(0,0,0,.02)] ${className}`}>
      {children}
    </div>
  );
}

function Badge({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${dark ? "bg-black/50 text-white ring-1 ring-white/20" : "bg-white text-[#555] ring-1 ring-black/5"}`}>
      {label}
    </span>
  );
}

function Meta({ date = "", views = "965", likes = "25", dark = false }: { date?: string; views?: string; likes?: string; dark?: boolean }) {
  const cls = dark ? "text-white/80" : "text-[#9a9a9a]";
  return (
    <div className={`mt-3 flex items-center gap-3 text-[10px] ${cls}`}>
      <span>{date}</span>
      <span>•</span>
      <span>{views}</span>
      <span>•</span>
      <span>{likes}</span>
    </div>
  );
}

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 12H5" /><path d="M11 5l-7 7 7 7" />
    </svg>
  );
}

function DotMenu({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${dark ? "bg-black/40 text-white" : "bg-white text-[#666] ring-1 ring-black/5"}`} aria-label="More">
      <span className="-mt-1 text-lg leading-none">•••</span>
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-[#8f8f8f]">{children}</h3>;
}

export default async function Home() {
  const { posts } = await getAllPosts();
  const all: Post[] = Array.isArray(posts) ? posts : [];

  if (all.length === 0) {
    return (
      <div className="min-h-screen bg-[#ececec] flex items-center justify-center">
        <p className="text-[#999] text-sm">No articles yet.</p>
      </div>
    );
  }

  const p0 = all[0], p1 = all[1], p2 = all[2], p3 = all[3], p4 = all[4],
        p5 = all[5], p6 = all[6], p7 = all[7], p8 = all[8], p9 = all[9],
        p10 = all[10], p11 = all[11];
  const morningPosts = all.slice(4, 8);
  const travelPosts = all.slice(6, 8);
  const rightStackPosts = all.slice(8, 11);
  const popularPosts = all.slice(0, 4);
  const mostViewedPosts = all.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#ececec] p-3 md:p-5" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[1020px]">

        {/* ─── TOP MOSAIC ─── */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.9fr_1fr]">

          {/* Science card (left) */}
          {p0 && (
            <Card className="overflow-hidden p-2">
              <Link href={href(p0)} className="group block">
                <div className="relative overflow-hidden rounded-[10px]">
                  <Image src={img(p0)} alt={t(p0)} fill className="!relative h-[170px] w-full object-cover" sizes="400px" priority />
                  <div className="absolute left-2 top-2"><Badge label={cat(p0)} /></div>
                </div>
                <div className="px-1 pb-1 pt-3">
                  <h2 className="text-[14px] leading-[1.2] text-[#353535] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-3">{t(p0)}</h2>
                  <p className="mt-2 text-[10px] leading-[1.35] text-[#a0a0a0] line-clamp-2">{ex(p0)}</p>
                  <Meta date={fmtDate(p0.date)} />
                </div>
              </Link>
            </Card>
          )}

          {/* Center hero (fashion-style text overlay) */}
          {p1 && (
            <Card className="relative overflow-hidden p-3">
              <Link href={href(p1)} className="block group">
                <div className="absolute right-4 top-4 text-[#666]"><ArrowRight /></div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7f7f7f]">{cat(p1)}</div>
                <div className="mt-4 grid min-h-[196px] grid-cols-1 items-center">
                  <div className="relative">
                    <Image src={img(p1)} alt="" fill className="!relative rounded-[10px] object-cover opacity-10 h-full w-full" sizes="600px" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-5 text-center">
                        <h1 className="text-[22px] leading-[1.15] text-[#2d2d2d] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-3">{t(p1)}</h1>
                        <p className="mx-auto mt-3 max-w-[70%] text-[10px] leading-[1.35] text-[#9a9a9a] line-clamp-3">{ex(p1, 140)}</p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-black" />
                          <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                          <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-1"><Meta date={fmtDate(p1.date)} /></div>
              </Link>
            </Card>
          )}

          {/* Dark review card (right) */}
          {p2 && (
            <Card className="overflow-hidden bg-[#0d0d0f] p-2 text-white">
              <Link href={href(p2)} className="block group">
                <div className="relative overflow-hidden rounded-[10px]">
                  <Image src={img(p2)} alt={t(p2)} fill className="!relative h-[250px] w-full object-cover opacity-70" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/30" />
                  <div className="absolute left-3 top-3"><Badge label={cat(p2)} dark /></div>
                  <div className="absolute right-3 top-3"><DotMenu dark /></div>
                  <div className="absolute left-3 right-3 top-12">
                    <h3 className="text-[13px] leading-[1.18] [font-family:Georgia,serif] group-hover:text-white/90 transition-colors line-clamp-5">{t(p2)}</h3>
                    <span className="mt-5 inline-block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">Read More</span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3"><Meta dark date={fmtDate(p2.date)} /></div>
                </div>
              </Link>
            </Card>
          )}
        </div>

        {/* ─── SECOND ROW ─── */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.25fr_.95fr_.95fr]">

          {/* Design & Art dark overlay */}
          {p3 && (
            <Card className="overflow-hidden bg-[#0e0e10] p-2 text-white">
              <Link href={href(p3)} className="block group">
                <div className="relative overflow-hidden rounded-[10px]">
                  <Image src={img(p3)} alt={t(p3)} fill className="!relative h-[255px] w-full object-cover opacity-75" sizes="500px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/20" />
                  <div className="absolute left-3 top-3 flex items-center justify-between w-[calc(100%-24px)]">
                    <Badge label={cat(p3)} dark /><DotMenu dark />
                  </div>
                  <div className="absolute left-4 right-4 top-[72px]">
                    <h3 className="text-[14px] leading-[1.18] [font-family:Georgia,serif] md:text-[16px] group-hover:text-white/90 transition-colors line-clamp-4">{t(p3)}</h3>
                    <p className="mt-3 text-[10px] leading-[1.35] text-white/75 line-clamp-2">{ex(p3)}</p>
                    <span className="mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#222]">Read More</span>
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-white/80">
                    <Meta dark date={fmtDate(p3.date)} />
                    <span className="ml-2 whitespace-nowrap">{author(p3)}</span>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {/* Tech + Life stacked */}
          <div className="grid gap-3">
            {p4 && (
              <Card className="overflow-hidden bg-[#1d5fbc] p-3 text-white">
                <Link href={href(p4)} className="block group">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/80">{cat(p4)}</div>
                      <h3 className="mt-2 text-[14px] leading-[1.18] [font-family:Georgia,serif] group-hover:text-white/90 transition-colors line-clamp-3">{t(p4)}</h3>
                      <p className="mt-2 text-[10px] italic text-white/80">{author(p4)}</p>
                    </div>
                    <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </div>
                  <Meta dark date={fmtDate(p4.date)} />
                </Link>
              </Card>
            )}

            {p5 && (
              <Card className="overflow-hidden p-0">
                <Link href={href(p5)} className="block group">
                  <div className="grid grid-cols-[1.15fr_.85fr]">
                    <div className="bg-[#efbea8] p-4">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7f5f4f]">{cat(p5)}</div>
                      <h4 className="mt-2 text-[13px] leading-[1.2] text-[#63483b] [font-family:Georgia,serif] group-hover:text-[#3a2519] transition-colors line-clamp-4">{t(p5)}</h4>
                      <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a5f4f]">{author(p5)}</div>
                      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5e463a]">Read More <ArrowRight /></span>
                    </div>
                    <div className="relative h-full min-h-[140px]">
                      <Image src={img(p5)} alt="" fill className="object-cover sepia-[.25]" sizes="300px" />
                    </div>
                  </div>
                </Link>
              </Card>
            )}
          </div>

          {/* Most Views sidebar */}
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-[#efefef] px-4 py-3">
              <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8e8e8e]">
                <span className="text-[#4a4a4a]">Most Views</span>
                <span>Recent</span>
                <span>Comments</span>
              </div>
            </div>
            <div className="divide-y divide-[#f1f1f1]">
              {mostViewedPosts.map((p, idx) => (
                <Link href={href(p)} key={p.id || idx} className="flex items-start gap-3 px-4 py-3 group">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden ring-1 ring-[#ececec] flex-shrink-0">
                    <Image src={img(p)} alt="" fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] text-[#a0a0a0]">{fmtDate(p.date)}</div>
                    <p className="mt-1 text-[11px] leading-[1.25] text-[#444] group-hover:text-[#111] transition-colors line-clamp-2">{t(p)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-[11px] text-[#666]">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#333]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#bbb]" />
              </div>
              <Link href="/headlines" className="inline-flex items-center gap-2 font-semibold hover:text-[#333] transition-colors">View All <ArrowRight /></Link>
            </div>
          </Card>
        </div>

        {/* ─── THIRD ROW — movies strip ─── */}
        {(p6 || p7 || p8) && (
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[1.1fr_1.25fr_1.45fr]">
            {p6 && (
              <Card className="overflow-hidden bg-[#131417] p-2 text-white">
                <Link href={href(p6)} className="block group">
                  <div className="relative overflow-hidden rounded-[10px]">
                    <Image src={img(p6)} alt={t(p6)} fill className="!relative h-[128px] w-full object-cover opacity-70" sizes="400px" />
                    <div className="absolute left-3 top-3"><Badge label={cat(p6)} dark /></div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
                    </div>
                  </div>
                </Link>
              </Card>
            )}

            {p7 && (
              <Card className="overflow-hidden bg-[#11489a] p-3 text-white">
                <Link href={href(p7)} className="flex h-full flex-col justify-between group">
                  <h3 className="text-[13px] leading-[1.1] [font-family:Georgia,serif] md:text-[15px] group-hover:text-white/90 transition-colors line-clamp-3">{t(p7)}</h3>
                  <span className="mt-4 inline-flex w-fit rounded-full bg-white px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#222]">Read More</span>
                </Link>
              </Card>
            )}

            {p8 && (
              <Card className="overflow-hidden p-0">
                <Link href={href(p8)} className="block group">
                  <div className="grid grid-cols-[1fr_1.1fr]">
                    <div className="relative">
                      <Image src={img(p8)} alt={t(p8)} fill className="!relative h-[128px] w-full object-cover grayscale" sizes="400px" />
                      <div className="absolute left-3 top-3"><Badge label={cat(p8)} /></div>
                    </div>
                    <div className="relative bg-[#f7f7f7] p-4">
                      <div className="text-right text-[24px] leading-[1.0] text-[#555] [font-family:Georgia,serif] group-hover:text-[#333] transition-colors line-clamp-2">{t(p8)}</div>
                      <span className="absolute bottom-4 right-4 rounded-full bg-black px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">Read More</span>
                    </div>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        )}

        {/* ─── LOWER MAIN GRID ─── */}
        <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[225px_1fr_240px]">

          {/* Left vertical list rail */}
          <Card className="p-3">
            <SectionLabel>Morning</SectionLabel>
            {morningPosts[0] && (
              <Link href={href(morningPosts[0])} className="block group">
                <div className="overflow-hidden rounded-[10px] border border-[#efefef] relative h-[112px]">
                  <Image src={img(morningPosts[0])} alt="" fill className="object-cover" sizes="225px" />
                </div>
              </Link>
            )}
            <div className="mt-3 space-y-4">
              {morningPosts.map((p, i) => (
                <div key={p.id || i} className={i === 0 ? "" : "border-t border-[#f0f0f0] pt-4"}>
                  <Link href={href(p)} className="block group">
                    <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a4a4a4]">{cat(p)}</div>
                    <p className="mt-1 text-[11px] leading-[1.22] text-[#444] group-hover:text-[#111] transition-colors line-clamp-2">{t(p)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={img(p)} alt="" fill className="object-cover" sizes="24px" />
                      </div>
                      <span className="text-[10px] text-[#8c8c8c]">by {author(p)}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/headlines" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] border border-[#ececec] py-2 text-[11px] font-semibold text-[#555] hover:bg-[#f5f5f5] transition-colors">
              View All <ArrowRight />
            </Link>
          </Card>

          {/* Center: Home card + Travel dark slider */}
          <div className="space-y-3">
            {p9 && (
              <Card className="p-3">
                <Link href={href(p9)} className="block group">
                  <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#a4a4a4]">{cat(p9)}</div>
                  <div className="grid gap-4 md:grid-cols-[.95fr_1.05fr]">
                    <div className="overflow-hidden rounded-[10px] border border-[#efefef] relative h-[215px]">
                      <Image src={img(p9)} alt={t(p9)} fill className="object-cover" sizes="450px" />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h2 className="text-[16px] leading-[1.15] text-[#333] [font-family:Georgia,serif] md:text-[18px] group-hover:text-[#111] transition-colors line-clamp-3">{t(p9)}</h2>
                        <p className="mt-3 text-[10px] leading-[1.35] text-[#999] line-clamp-3">{ex(p9, 160)}</p>
                      </div>
                      <span className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#ebebeb] text-[#666]"><ArrowRight /></span>
                    </div>
                  </div>
                </Link>
              </Card>
            )}

            {travelPosts.length >= 2 && (
              <Card className="overflow-hidden bg-[#121215] p-3 text-white">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/75">{cat(travelPosts[0])}</div>
                  <div className="flex items-center gap-2 text-white/75"><ArrowLeft /><ArrowRight /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {travelPosts.map((p, i) => (
                    <Link href={href(p)} key={p.id || i} className="block group overflow-hidden rounded-[10px] bg-white/5 ring-1 ring-white/10">
                      <div className="relative h-[88px]">
                        <Image src={img(p)} alt="" fill className="object-cover" sizes="400px" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-[13px] leading-[1.15] [font-family:Georgia,serif] group-hover:text-white/90 transition-colors line-clamp-3">{t(p)}</h4>
                        <p className="mt-2 text-[10px] leading-[1.35] text-white/60 line-clamp-3">{ex(p, 120)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                    <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                  </div>
                  <Link href="/headlines" className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/85 hover:text-white transition-colors">View All</Link>
                </div>
              </Card>
            )}
          </div>

          {/* Right stack */}
          <div className="space-y-3">
            {rightStackPosts[0] && (
              <Card className="overflow-hidden p-0">
                <Link href={href(rightStackPosts[0])} className="block group">
                  <div className="relative h-[210px]">
                    <Image src={img(rightStackPosts[0])} alt={t(rightStackPosts[0])} fill className="object-cover" sizes="240px" />
                    <div className="absolute left-3 top-3"><Badge label={cat(rightStackPosts[0])} /></div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] leading-[1.15] text-[#3a3a3a] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-2">{t(rightStackPosts[0])}</h3>
                    <Meta date={fmtDate(rightStackPosts[0].date)} />
                  </div>
                </Link>
              </Card>
            )}

            {rightStackPosts[1] && (
              <Card className="overflow-hidden p-0">
                <Link href={href(rightStackPosts[1])} className="block group">
                  <div className="relative h-[130px]">
                    <Image src={img(rightStackPosts[1])} alt="" fill className="object-cover" sizes="240px" />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className="absolute inset-0 p-4">
                      <h3 className="text-[13px] leading-[1.15] text-white [font-family:Georgia,serif] group-hover:text-white/90 transition-colors line-clamp-3">{t(rightStackPosts[1])}</h3>
                      <span className="mt-4 inline-block rounded-full bg-black/40 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white ring-1 ring-white/20">{cat(rightStackPosts[1])}</span>
                    </div>
                  </div>
                </Link>
              </Card>
            )}

            {rightStackPosts[2] && (
              <Card className="overflow-hidden p-0">
                <Link href={href(rightStackPosts[2])} className="block group">
                  <div className="relative h-[92px]">
                    <Image src={img(rightStackPosts[2])} alt="" fill className="object-cover" sizes="240px" />
                  </div>
                  <div className="bg-[#1b4fa2] px-3 py-2 text-white">
                    <div className="text-[10px] line-clamp-1 group-hover:text-white/90 transition-colors">{t(rightStackPosts[2])}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative h-5 w-5 rounded-full overflow-hidden ring-1 ring-white/60 flex-shrink-0">
                          <Image src={img(rightStackPosts[2])} alt="" fill className="object-cover" sizes="20px" />
                        </div>
                        <span className="text-[10px] font-semibold">{author(rightStackPosts[2])}</span>
                      </div>
                      <span className="text-[10px] font-semibold">965</span>
                    </div>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* ─── BOTTOM POPULAR STRIP ─── */}
        <div className="mt-4">
          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#7e7e7e]">Most Popular</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-[11px] text-[#8b8b8b] [font-family:Georgia,serif]">
                  <span className="text-[#333] underline underline-offset-4">Day</span>
                  <span>Week</span>
                  <span>Month</span>
                </div>
                <div className="flex items-center gap-2 text-[#888]">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ececec]"><ArrowLeft /></span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#ececec]"><ArrowRight /></span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {popularPosts.map((p, i) => (
                <Link href={href(p)} key={p.id || i} className="block rounded-[12px] border border-[#efefef] p-4 group hover:border-[#ddd] transition-colors">
                  <div className="text-[9px] text-[#a5a5a5]">{fmtDate(p.date)}</div>
                  <h4 className="mt-3 text-[13px] leading-[1.2] text-[#3d3d3d] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-3">{t(p)}</h4>
                </Link>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
