import Link from "next/link";
import Image from "next/image";
import { getCategories, getAllPosts } from "@/lib/queries";
import { Post, Category } from "@/lib/types";

export const revalidate = 60;

function stripHtml(input?: string) {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostTitle(p?: Post) {
  return p?.title ?? "Untitled";
}

function getPostExcerpt(p?: Post) {
  const raw = p?.excerpt ?? p?.content ?? "";
  const clean = stripHtml(raw);
  return clean.length > 150 ? clean.slice(0, 147) + "..." : clean;
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
    "https://placehold.co/1200x700/png?text=IMAGE"
  );
}

function getReadTime(p?: Post) {
  const words = p?.content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export default async function Home() {
  const categoriesData = await getCategories();
  const { posts } = await getAllPosts();

  const cats: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const safePosts: Post[] = Array.isArray(posts) ? posts : [];

  const featuredPost = safePosts[0];
  const trendingPosts = safePosts.slice(1, 5);
  const latestPosts = safePosts.slice(5, 11);
  const morePosts = safePosts.slice(11, 17);

  if (!featuredPost) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-400">No articles yet</h2>
          <p className="text-sm text-gray-400 mt-1">Articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 py-5">
        <Link href={getPostHref(featuredPost)} className="block group mb-6">
          <div className="card overflow-hidden">
            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] img-hover-scale">
              <Image
                className="object-cover"
                src={getPostImage(featuredPost)}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 1200px"
                priority
              />
              <div className="absolute inset-0 hero-overlay" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="category-chip text-white bg-accent border-0">
                    {(featuredPost?.categories?.nodes?.[0]?.name || "Featured").toString()}
                  </span>
                  <span className="text-[11px] text-white/70 font-medium">{timeAgo(featuredPost?.date)}</span>
                </div>
                <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
                  {getPostTitle(featuredPost)}
                </h1>
                <p className="hidden md:block text-sm text-white/75 max-w-2xl text-limit-2-row leading-relaxed">
                  {getPostExcerpt(featuredPost)}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-white/60 font-medium">{getPostAuthor(featuredPost)}</span>
                  <span className="text-xs text-white/40">{getReadTime(featuredPost)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </Link>

        {trendingPosts.length > 0 && (
          <section className="mb-8">
            <div className="section-header">
              <div className="flex items-center gap-2">
                <span className="trending-dot" />
                <h2 className="section-title">Trending Now</h2>
              </div>
              <Link href="/headlines" className="section-link">See all</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
              {trendingPosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="card flex-shrink-0 w-[280px] md:w-auto md:flex-1 snap-start group"
                >
                  <div className="relative w-full aspect-[4/3] img-hover-scale">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 280px, 25vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="category-chip-sm">
                        {(p?.categories?.nodes?.[0]?.name || "News").toString()}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-gray-900 text-limit-2-row leading-snug group-hover:text-accent transition-colors">
                      {getPostTitle(p)}
                    </h3>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-400">
                      <span className="font-medium text-gray-500">{getPostAuthor(p)}</span>
                      <span className="read-time">{getReadTime(p)} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {latestPosts.length > 0 && (
          <section className="mb-8">
            <div className="section-header">
              <h2 className="section-title">Latest News</h2>
              <Link href="/headlines" className="section-link">View all</Link>
            </div>
            <div className="space-y-3">
              {latestPosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="card-flat flex gap-4 p-3 rounded-card-sm group"
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-card-sm overflow-hidden img-hover-scale">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="112px"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="category-chip-sm">
                        {(p?.categories?.nodes?.[0]?.name || "Latest").toString()}
                      </span>
                      <span className="text-[11px] text-gray-400">{timeAgo(p?.date)}</span>
                    </div>
                    <h3 className="font-heading text-[15px] md:text-base font-semibold text-gray-900 text-limit-2-row leading-snug group-hover:text-accent transition-colors">
                      {getPostTitle(p)}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                      <span className="font-medium text-gray-500">{getPostAuthor(p)}</span>
                      <span className="read-time">{getReadTime(p)} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {cats.length > 0 && (
          <section className="mb-8">
            <div className="section-header">
              <h2 className="section-title">Topics</h2>
              <Link href="/explore" className="section-link">Explore</Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
              {cats.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/headlines?categories=${cat.slug}`}
                  className="flex-shrink-0 px-4 py-2.5 bg-white border border-gray-200 rounded-pill text-sm font-medium text-gray-700 hover:border-accent hover:text-accent hover:bg-accent-light transition-all snap-start whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {morePosts.length > 0 && (
          <section className="mb-8">
            <div className="section-header">
              <h2 className="section-title">More Stories</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {morePosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="card group"
                >
                  <div className="relative w-full aspect-[4/3] img-hover-scale">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="category-chip-sm">
                        {(p?.categories?.nodes?.[0]?.name || "Story").toString()}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-gray-900 text-limit-2-row leading-snug group-hover:text-accent transition-colors">
                      {getPostTitle(p)}
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-2 text-limit-2-row leading-relaxed">
                      {getPostExcerpt(p)}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-400">
                      <span className="font-medium text-gray-500">{getPostAuthor(p)}</span>
                      <span className="read-time">{getReadTime(p)} min</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
