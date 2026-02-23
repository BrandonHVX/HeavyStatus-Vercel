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
  return clean.length > 170 ? clean.slice(0, 167) + "..." : clean;
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

export default async function Home() {
  const categoriesData = await getCategories();
  const { posts } = await getAllPosts();

  const cats: Category[] = Array.isArray(categoriesData) ? categoriesData : [];
  const safePosts: Post[] = Array.isArray(posts) ? posts : [];

  const featuredPost = safePosts[0];
  const secondaryPosts = safePosts.slice(1, 3);
  const sidebarPosts = safePosts.slice(3, 8);
  const gridPosts = safePosts.slice(8, 14);

  void cats;

  if (!featuredPost) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto mt-10 px-4 py-12 text-center">
          <h2 className="font-heading text-2xl text-gray-400">No posts available yet.</h2>
          <p className="text-sm text-gray-400 mt-2">Articles will appear here once published.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="max-w-7xl mx-auto px-4 pt-6 pb-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <Link href={getPostHref(featuredPost)} className="nb-card group block">
                <div className="relative w-full aspect-[16/9] md:aspect-[16/10] overflow-hidden rounded-sm img-hover-scale">
                  <Image
                    className="object-cover"
                    src={getPostImage(featuredPost)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute inset-0 hero-overlay" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-accent bg-white px-2 py-0.5 rounded-sm mb-3">
                      {(featuredPost?.categories?.nodes?.[0]?.name || "Featured").toString()}
                    </span>
                    <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
                      {getPostTitle(featuredPost)}
                    </h1>
                    <p className="hidden md:block text-sm text-white/80 max-w-2xl text-limit-2-row">
                      {getPostExcerpt(featuredPost)}
                    </p>
                    <div className="mt-3 text-xs text-white/60 uppercase tracking-wider">
                      By {getPostAuthor(featuredPost)} {featuredPost?.date ? ` \u2022 ${formatDate(featuredPost.date)}` : ""}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                {secondaryPosts.map((p) => (
                  <Link key={p?.id || p?.slug} href={getPostHref(p)} className="nb-card group block">
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm img-hover-scale">
                      <Image
                        className="object-cover"
                        src={getPostImage(p)}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                    <div className="pt-3">
                      <span className="nb-category">
                        {(p?.categories?.nodes?.[0]?.name || "News").toString()}
                      </span>
                      <h3 className="nb-title font-heading text-lg md:text-xl font-semibold mt-1 text-limit-2-row">
                        {getPostTitle(p)}
                      </h3>
                      <div className="nb-byline mt-2">
                        By {getPostAuthor(p)} {p?.date ? ` \u2022 ${formatDate(p.date)}` : ""}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 lg:border-l lg:border-gray-200 lg:pl-6">
              <div className="nb-section-title">Latest Stories</div>
              <div className="divide-y divide-gray-100">
                {sidebarPosts.map((p, i) => (
                  <Link
                    key={p?.id || p?.slug}
                    href={getPostHref(p)}
                    className="nb-card group flex gap-4 py-4 first:pt-0"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="nb-category text-[10px]">
                        {(p?.categories?.nodes?.[0]?.name || "Latest").toString()}
                      </span>
                      <h4 className="nb-title font-heading text-base font-semibold mt-1 text-limit-2-row">
                        {getPostTitle(p)}
                      </h4>
                      <div className="nb-byline mt-1.5 text-[11px]">
                        {getPostAuthor(p)}
                      </div>
                    </div>
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-sm overflow-hidden img-hover-scale">
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
            </aside>
          </div>
        </section>

        {gridPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="nb-divider-dark mb-6" />
            <h2 className="nb-section-title">More Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((p) => (
                <Link key={p?.id || p?.slug} href={getPostHref(p)} className="nb-card group block">
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm img-hover-scale">
                    <Image
                      className="object-cover"
                      src={getPostImage(p)}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="pt-3">
                    <span className="nb-category text-[10px]">
                      {(p?.categories?.nodes?.[0]?.name || "Story").toString()}
                    </span>
                    <h3 className="nb-title font-heading text-lg font-semibold mt-1 text-limit-2-row">
                      {getPostTitle(p)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2 text-limit-2-row">
                      {getPostExcerpt(p)}
                    </p>
                    <div className="nb-byline mt-2">
                      {getPostAuthor(p)} {p?.date ? ` \u2022 ${formatDate(p.date)}` : ""}
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
