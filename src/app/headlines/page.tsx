import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/queries";
import { Post } from "@/lib/types";
import { title, postHref, postImg, postCat, readMin, excerpt, fmtDate, SmallMeta, StatPill, SCard, SidebarList } from "@/lib/dashboard-helpers";
import { SearchBar } from "@/components/search-bar";

export const revalidate = 60;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function CategoryChips({ categories, activeCategory }: { categories: { id: string; name: string; slug: string }[]; activeCategory: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/headlines"
        className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
          !activeCategory
            ? "bg-[#1f4f93] text-white"
            : "bg-[#f2f2f2] text-[#777] hover:bg-[#e8e8e8]"
        }`}
      >
        All
      </Link>
      {categories.slice(0, 12).map((cat) => (
        <Link
          key={cat.id}
          href={`/headlines?categories=${cat.slug}`}
          className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
            activeCategory === cat.slug
              ? "bg-[#1f4f93] text-white"
              : "bg-[#f2f2f2] text-[#777] hover:bg-[#e8e8e8]"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const searchTerm = typeof searchParams.search === "string" ? searchParams.search : "";
  const category = typeof searchParams.categories === "string" ? searchParams.categories : "";
  const before = (searchParams.before as string) || null;
  const after = (searchParams.after as string) || null;

  const [categories, { posts, pageInfo }] = await Promise.all([
    getCategories(),
    getAllPosts(searchTerm, category, { before, after }),
  ]);

  const all: Post[] = Array.isArray(posts) ? posts : [];

  if (all.length === 0) {
    return (
      <div className="min-h-screen bg-[#efefef] p-4 sm:p-6 lg:p-7" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
        <div className="mx-auto max-w-[1540px] rounded-[8px] border border-[#e6e6e6] bg-[#f5f5f5] shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
          <div className="p-5">
            <SCard>
              <div className="px-5 py-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <CategoryChips categories={categories} activeCategory={category} />
                  <div className="w-full sm:w-auto"><SearchBar /></div>
                </div>
              </div>
            </SCard>
            <div className="mt-6 flex flex-col items-center justify-center py-16">
              <div className="h-14 w-14 rounded-full bg-white border border-[#e7e7e7] flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#ccc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                </svg>
              </div>
              <p className="text-[#999] text-sm">No articles found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const heroPost = all[0];
  const lifestyleFairPosts = all.slice(1, 4);
  const globalPosts = all.slice(4, 7);
  const opinionPosts = all.slice(0, 3);
  const specialPost = all[3];
  const lifestyleAdvPosts = all.slice(4, 7);
  const podcastPost = all[7];
  const techPosts = all.slice(8, 11);
  const sidebarPosts1 = all.slice(0, 3);
  const sidebarPosts2 = all.slice(3, 6);

  return (
    <div className="min-h-screen bg-[#efefef] p-4 sm:p-6 lg:p-7" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-[1540px] rounded-[8px] border border-[#e6e6e6] bg-[#f5f5f5] shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
        <div className="p-5">

          <SCard className="mb-4">
            <div className="px-5 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CategoryChips categories={categories} activeCategory={category} />
                <div className="w-full sm:w-auto"><SearchBar /></div>
              </div>
            </div>
          </SCard>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.02fr_1.38fr_230px]">

            {/* ========== LEFT COLUMN ========== */}
            <div className="min-w-0 space-y-4">

              <SCard>
                <div className="px-5 pt-4">
                  <h2 className="text-[17px] font-semibold text-[#353535]">Politics &amp; Culture</h2>
                </div>
                <div className="px-5 py-4">
                  <Link href={postHref(heroPost)} className="block group">
                    <div className="overflow-hidden rounded-[5px] border border-[#ececec] bg-[#f7f7f7] relative h-[345px]">
                      <Image src={postImg(heroPost)} alt={title(heroPost)} fill className="object-cover group-hover:scale-[1.02] transition-transform duration-500" sizes="(max-width: 1280px) 100vw, 450px" priority />
                    </div>
                  </Link>
                  <Link href={postHref(heroPost)} className="block mt-3 group">
                    <h3 className="text-[14px] font-semibold text-[#333] leading-snug group-hover:text-[#111] transition-colors">{title(heroPost)}</h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="text-[10px] tracking-wide text-[#9d9d9d]">{fmtDate(heroPost.date)}</div>
                    <StatPill views={345} likes={35} />
                  </div>
                </div>
              </SCard>

              {lifestyleFairPosts.length > 0 && (
                <SCard>
                  <div className="px-5 pt-4">
                    <h2 className="text-[17px] font-semibold text-[#353535]">Lifestyle &amp; Fairs</h2>
                  </div>
                  <div className="grid grid-cols-[1fr_1.2fr_1fr] gap-4 px-5 py-4">
                    {lifestyleFairPosts[0] && (
                      <Link href={postHref(lifestyleFairPosts[0])} className="min-w-0 group block">
                        <div className="overflow-hidden rounded-[4px] border border-[#ececec] relative h-[98px]">
                          <Image src={postImg(lifestyleFairPosts[0])} alt="" fill className="object-cover" sizes="200px" />
                        </div>
                        <p className="mt-2 text-[10px] font-semibold leading-[1.25] text-[#454545] line-clamp-2 group-hover:text-[#222] transition-colors">{title(lifestyleFairPosts[0])}</p>
                        <SmallMeta text={fmtDate(lifestyleFairPosts[0].date)} />
                      </Link>
                    )}

                    {lifestyleFairPosts[1] && (
                      <Link href={postHref(lifestyleFairPosts[1])} className="min-w-0 group block">
                        <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[#b2b2b2]">Featured</div>
                        <h3 className="text-[13px] font-semibold leading-[1.18] text-[#3a3a3a] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-3">{title(lifestyleFairPosts[1])}</h3>
                        <p className="mt-2 text-[10px] leading-[1.35] text-[#9b9b9b] line-clamp-3">{excerpt(lifestyleFairPosts[1])}</p>
                        <SmallMeta text={fmtDate(lifestyleFairPosts[1].date)} />
                      </Link>
                    )}

                    {lifestyleFairPosts[2] && (
                      <Link href={postHref(lifestyleFairPosts[2])} className="min-w-0 group block">
                        <div className="overflow-hidden rounded-[4px] border border-[#ececec] relative h-[98px]">
                          <Image src={postImg(lifestyleFairPosts[2])} alt="" fill className="object-cover" sizes="200px" />
                        </div>
                        <p className="mt-2 text-[10px] font-semibold leading-[1.25] text-[#454545] line-clamp-2 group-hover:text-[#222] transition-colors">{title(lifestyleFairPosts[2])}</p>
                        <SmallMeta text={fmtDate(lifestyleFairPosts[2].date)} />
                      </Link>
                    )}
                  </div>
                </SCard>
              )}

              {globalPosts.length > 0 && (
                <SCard>
                  <div className="px-5 pt-4">
                    <h2 className="text-[17px] font-semibold text-[#353535]">Global Affairs</h2>
                  </div>
                  <div className="grid grid-cols-3 gap-4 px-5 py-4">
                    {globalPosts.map((p, i) => (
                      <Link href={postHref(p)} key={p.id || i} className="min-w-0 group block">
                        <div className="overflow-hidden rounded-[4px] border border-[#ececec] relative h-[88px]">
                          <Image src={postImg(p)} alt="" fill className={`object-cover ${i === 1 ? "grayscale" : ""}`} sizes="200px" />
                        </div>
                        <div className="mt-2 text-[10px] font-semibold leading-[1.25] text-[#454545] line-clamp-2 group-hover:text-[#222] transition-colors">{title(p)}</div>
                      </Link>
                    ))}
                  </div>
                </SCard>
              )}
            </div>

            {/* ========== CENTER COLUMN ========== */}
            <div className="min-w-0 space-y-4">

              <SCard>
                <div className="border-b border-[#efefef] px-5 py-4">
                  <h2 className="text-[17px] font-semibold text-[#353535]">Opinion &amp; Analysis</h2>
                </div>
                <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_1fr_1fr_1.05fr]">
                  {opinionPosts.map((p, idx) => (
                    <Link href={postHref(p)} key={p.id || idx} className="min-w-0 group block">
                      <div className="overflow-hidden rounded-[4px] border border-[#ececec] bg-[#f7f7f7] relative h-[110px]">
                        <Image src={postImg(p)} alt="" fill className={`object-cover ${idx === 0 ? "grayscale" : ""}`} sizes="250px" />
                      </div>
                      {idx === 0 ? (
                        <>
                          <div className="mt-2 inline-flex rounded-full bg-[#f2f2f2] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#666]">{postCat(p)}</div>
                          <h3 className="mt-2 text-[13px] font-semibold leading-[1.18] text-[#333] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-2">{title(p)}</h3>
                          <p className="mt-2 text-[10px] leading-[1.35] text-[#9c9c9c] line-clamp-2">{excerpt(p)}</p>
                          <div className="mt-3 flex items-center justify-between">
                            <SmallMeta text={fmtDate(p.date)} />
                            <span className="text-[10px] text-[#a8a8a8]">{readMin(p)} min</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 className="mt-2 text-[11px] font-semibold leading-[1.2] text-[#434343] group-hover:text-[#222] transition-colors line-clamp-2">{title(p)}</h4>
                          <div className="mt-3 flex items-center justify-between">
                            <SmallMeta text={fmtDate(p.date)} />
                            <span className="text-[10px] text-[#a8a8a8]">{readMin(p)} min</span>
                          </div>
                        </>
                      )}
                    </Link>
                  ))}

                  {specialPost && (
                    <div className="min-w-0 self-stretch rounded-[4px] border border-[#f0f0f0] bg-white p-3">
                      <div className="text-[9px] uppercase tracking-[0.16em] text-[#b7b7b7]">Special</div>
                      <h3 className="mt-2 text-[15px] leading-[1.15] text-[#3a3a3a] [font-family:Georgia,serif] line-clamp-4">{title(specialPost)}</h3>
                      <p className="mt-3 text-[10px] leading-[1.35] text-[#9f9f9f] line-clamp-3">{excerpt(specialPost, 120)}</p>
                      <Link href={postHref(specialPost)} className="mt-4 inline-flex items-center rounded-full bg-[#1f4f93] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white shadow-sm hover:bg-[#173d73] transition-colors">
                        Read More
                      </Link>
                    </div>
                  )}
                </div>
              </SCard>

              {lifestyleAdvPosts.length > 0 && (
                <SCard>
                  <div className="border-b border-[#efefef] px-5 py-4">
                    <h2 className="text-[17px] font-semibold text-[#353535]">Lifestyle &amp; Advocacy</h2>
                  </div>
                  <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_1fr_1fr_160px]">
                    {lifestyleAdvPosts.map((p, i) => (
                      <Link href={postHref(p)} key={p.id || i} className="min-w-0 group block">
                        <div className="overflow-hidden rounded-[4px] border border-[#ececec] bg-[#f7f7f7] relative h-[160px]">
                          <Image src={postImg(p)} alt="" fill className={`object-cover ${i > 0 ? "grayscale" : ""}`} sizes="300px" />
                        </div>
                        <h3 className="mt-3 text-[13px] leading-[1.16] text-[#3a3a3a] [font-family:Georgia,serif] group-hover:text-[#111] transition-colors line-clamp-2">{title(p)}</h3>
                        {i === 0 && <p className="mt-2 text-[10px] leading-[1.35] text-[#9c9c9c] line-clamp-2">{excerpt(p)}</p>}
                        <SmallMeta text={fmtDate(p.date)} />
                      </Link>
                    ))}

                    {podcastPost && (
                      <div className="flex min-h-[160px] flex-col items-start justify-center rounded-[4px] border border-[#f0f0f0] bg-white p-3">
                        <div className="text-[12px] uppercase tracking-[0.18em] text-[#b7b7b7]">Podcast</div>
                        <div className="mt-2 text-[16px] leading-[1.1] text-[#4b4b4b] [font-family:Georgia,serif] line-clamp-2">{title(podcastPost)}</div>
                        <Link href={postHref(podcastPost)} className="mt-4 inline-flex items-center rounded-full bg-[#1f4f93] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-[#173d73] transition-colors">
                          Read More
                        </Link>
                      </div>
                    )}
                  </div>
                </SCard>
              )}

              {techPosts.length > 0 && (
                <SCard>
                  <div className="border-b border-[#efefef] px-5 py-4">
                    <h2 className="text-[17px] font-semibold text-[#353535]">Technology &amp; Society</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 px-5 py-4 md:grid-cols-3">
                    {techPosts.map((p, i) => (
                      <Link href={postHref(p)} key={p.id || i} className="min-w-0 group block">
                        <div className="overflow-hidden rounded-[4px] border border-[#ececec] relative h-[92px]">
                          <Image src={postImg(p)} alt="" fill className={`object-cover ${i === 2 ? "grayscale" : ""}`} sizes="280px" />
                        </div>
                        <div className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#b5b5b5]">{postCat(p)}</div>
                        <h4 className="mt-1 text-[12px] font-semibold leading-[1.2] text-[#424242] group-hover:text-[#111] transition-colors line-clamp-2">{title(p)}</h4>
                      </Link>
                    ))}
                  </div>
                </SCard>
              )}

              {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
                <div className="flex justify-center items-center gap-3 py-2">
                  {pageInfo?.hasPreviousPage && (
                    <Link
                      href={{
                        pathname: "/headlines",
                        query: {
                          before: pageInfo.startCursor,
                          ...(searchTerm && { search: searchTerm }),
                          ...(category && { categories: category }),
                        },
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-[#e7e7e7] px-5 py-2 text-[11px] font-semibold text-[#555] hover:border-[#1f4f93] hover:text-[#1f4f93] transition-colors shadow-sm"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </Link>
                  )}
                  {pageInfo?.hasNextPage && (
                    <Link
                      href={{
                        pathname: "/headlines",
                        query: {
                          after: pageInfo.endCursor,
                          ...(searchTerm && { search: searchTerm }),
                          ...(category && { categories: category }),
                        },
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-[#e7e7e7] px-5 py-2 text-[11px] font-semibold text-[#555] hover:border-[#1f4f93] hover:text-[#1f4f93] transition-colors shadow-sm"
                    >
                      Next
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* ========== RIGHT SIDEBAR ========== */}
            <aside className="min-w-0 space-y-4">
              <SidebarList listTitle="Most Viewed" items={sidebarPosts1} />
              <SidebarList listTitle="Trending Now" items={sidebarPosts2} />
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
