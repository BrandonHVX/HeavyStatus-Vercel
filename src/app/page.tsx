import Link from "next/link";
import Image from "next/image";
import { getCategories, getAllPosts } from "@/lib/queries";
import { Post, Category } from "@/lib/types";
import HomeSearchBar from "@/components/HomeSearchBar";
import HomeTabs from "@/components/HomeTabs";

export const revalidate = 60;

function getPostTitle(p?: Post) {
  return p?.title ?? "Untitled";
}

function getPostAuthor(p?: Post) {
  return p?.author?.node?.name || "Staff";
}

function getPostHref(p?: Post) {
  return p?.slug ? `/${p.slug}` : "#";
}

function getPostImage(p?: Post) {
  return (
    p?.featuredImage?.node?.sourceUrl ||
    "https://placehold.co/800x600/png?text=IMAGE"
  );
}

function getReadTime(p?: Post) {
  const words = p?.content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

function formatFullDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) {
    return "Yesterday, " + d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  }
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default async function Home() {
  const categoriesData = await getCategories();
  const { posts } = await getAllPosts();

  const cats: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const safePosts: Post[] = Array.isArray(posts) ? posts : [];

  const popularPosts = safePosts.slice(0, 5);
  const trendingPosts = safePosts.length > 5 ? safePosts.slice(5, 10) : safePosts.slice(0, 5);
  const recentPosts = [...safePosts].sort((a, b) => new Date(b?.date || 0).getTime() - new Date(a?.date || 0).getTime()).slice(0, 5);
  const learnMorePosts = safePosts.slice(5, 12);

  if (safePosts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#eef2f0', fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-500">No articles yet</h2>
          <p className="text-sm text-neutral-400 mt-1">Articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eef2f0', fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}>
      <div className="max-w-3xl mx-auto px-5 pt-4 pb-8">

        <section className="mb-5">
          <HomeSearchBar />
        </section>

        {cats.length > 0 && (
          <section className="mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 snap-x scrollbar-hide">
              {cats.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/headlines?categories=${cat.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium text-neutral-600 snap-start whitespace-nowrap transition-colors hover:bg-white/80"
                  style={{ border: '1.5px solid #d1d5db', backgroundColor: 'transparent' }}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-6">
          <HomeTabs
            popularPosts={popularPosts}
            trendingPosts={trendingPosts}
            recentPosts={recentPosts}
          />
        </section>

        {learnMorePosts.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-neutral-900 tracking-tight">Learn More</h2>
              <Link href="/headlines" className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                See All
              </Link>
            </div>
            <div className="space-y-3">
              {learnMorePosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="flex gap-4 items-start group bg-white rounded-2xl p-3"
                >
                  <div className="relative w-[88px] h-[88px] flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="88px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <span className="text-[11px] text-neutral-400 block mb-1">
                      {formatFullDate(p?.date)}
                    </span>
                    <h3 className="text-[14px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors tracking-tight">
                      {getPostTitle(p)}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[12px] text-neutral-400">{getReadTime(p)} min read</span>
                      <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
