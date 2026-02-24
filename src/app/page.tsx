import Link from "next/link";
import Image from "next/image";
import { getCategories, getAllPosts } from "@/lib/queries";
import { Post, Category } from "@/lib/types";
import HomeSearchBar from "@/components/HomeSearchBar";

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
  return clean.length > 120 ? clean.slice(0, 117) + "..." : clean;
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

function getAuthorInitial(p?: Post) {
  const name = p?.author?.node?.name || "S";
  return name.charAt(0).toUpperCase();
}

export default async function Home() {
  const categoriesData = await getCategories();
  const { posts } = await getAllPosts();

  const cats: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const safePosts: Post[] = Array.isArray(posts) ? posts : [];

  const featuredPost = safePosts[0];
  const topPosts = safePosts.slice(1, 5);
  const discoverPosts = safePosts.slice(5, 10);
  const latestPosts = safePosts.slice(10, 18);

  if (!featuredPost) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-white" style={{ fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}>
        <div className="text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-400">No articles yet</h2>
          <p className="text-sm text-neutral-400 mt-1">Articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "-apple-system, 'Inter', system-ui, sans-serif" }}>
      <div className="max-w-3xl mx-auto px-5 pt-4 pb-8">

        <section className="mb-5">
          <h1 className="text-[22px] font-bold text-neutral-900 tracking-tight mb-4">
            What&apos;s new today
          </h1>
          <HomeSearchBar />
        </section>

        <section className="mb-7">
          <Link href={getPostHref(featuredPost)} className="block group">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                src={getPostImage(featuredPost)}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 720px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[11px] font-medium text-white tracking-wide mb-2.5">
                  {(featuredPost?.categories?.nodes?.[0]?.name || "Featured").toString()}
                </span>
                <h2 className="text-xl md:text-2xl font-semibold text-white leading-tight tracking-tight">
                  {getPostTitle(featuredPost)}
                </h2>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-6 h-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-[10px] font-semibold text-white">
                    {getAuthorInitial(featuredPost)}
                  </div>
                  <span className="text-xs text-white/80">{getPostAuthor(featuredPost)}</span>
                  <span className="text-xs text-white/50">{timeAgo(featuredPost?.date)}</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {topPosts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">The most relevant</h2>
              <Link href="/headlines" className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {topPosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="group"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-2.5">
                    <Image
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 50vw, 340px"
                    />
                  </div>
                  <h3 className="text-[13px] font-semibold text-neutral-900 leading-snug tracking-tight line-clamp-2 group-hover:text-neutral-600 transition-colors">
                    {getPostTitle(p)}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[11px] text-neutral-400">{getPostAuthor(p)}</span>
                    <span className="text-[11px] text-neutral-300">&middot;</span>
                    <span className="text-[11px] text-neutral-400">{getReadTime(p)} min read</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {discoverPosts.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">Discover new stories</h2>
              <Link href="/headlines" className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                View all
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x snap-mandatory scrollbar-hide">
              {discoverPosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="flex-shrink-0 w-[200px] snap-start group"
                >
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
                    <Image
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3.5">
                      <h3 className="text-[13px] font-semibold text-white leading-snug line-clamp-2">
                        {getPostTitle(p)}
                      </h3>
                      <span className="text-[11px] text-white/60 mt-1 block">{getPostAuthor(p)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {cats.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">Topics</h2>
              <Link href="/explore" className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                Explore
              </Link>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 snap-x scrollbar-hide">
              {cats.slice(0, 10).map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  href={`/headlines?categories=${cat.slug}`}
                  className="flex-shrink-0 px-4 py-2 bg-neutral-100 rounded-full text-[13px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors snap-start whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {latestPosts.length > 0 && (
          <section className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-semibold text-neutral-900 tracking-tight">Latest</h2>
              <Link href="/headlines" className="text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
                See all
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {latestPosts.map((p, i) => (
                <Link
                  key={p?.id || p?.slug || i}
                  href={getPostHref(p)}
                  className="flex gap-4 py-3.5 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                        {(p?.categories?.nodes?.[0]?.name || "News").toString()}
                      </span>
                      <span className="text-[11px] text-neutral-300">{timeAgo(p?.date)}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-neutral-600 transition-colors tracking-tight">
                      {getPostTitle(p)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[9px] font-semibold text-neutral-500">
                        {getAuthorInitial(p)}
                      </div>
                      <span className="text-[11px] text-neutral-400">{getPostAuthor(p)}</span>
                      <span className="text-[11px] text-neutral-300">&middot;</span>
                      <span className="text-[11px] text-neutral-400">{getReadTime(p)} min</span>
                    </div>
                  </div>
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="80px"
                    />
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
