import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/queries";
import { Post } from "@/lib/types";
import {
  timeAgo,
  commentCount,
  stripHtml,
  postHref,
  postImg,
  postCat,
  postAuthor,
  AuthorAvatar,
  BookmarkIcon,
  CommentIcon,
  MoreIcon,
  SearchIconSvg,
  NewsListItem,
} from "@/lib/nuws-helpers";

export const revalidate = 60;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function CategoryChips({
  categories,
  activeCategory,
}: {
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Link
        href="/headlines"
        className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
          !activeCategory
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {categories.slice(0, 12).map((cat) => (
        <Link
          key={cat.id}
          href={`/headlines?categories=${cat.slug}`}
          className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
            activeCategory === cat.slug
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}

function QuoteCard({ post }: { post: Post }) {
  const quote = stripHtml(post.excerpt, 180);
  return (
    <div className="border-l-4 border-blue-500 bg-white py-4 pl-4 pr-2">
      <div className="text-[11px] font-medium text-gray-500 uppercase mb-2">
        {postCat(post)}
      </div>
      <p className="text-[15px] font-semibold text-gray-900 leading-snug mb-3">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="text-[12px] text-gray-500">
        <span className="font-bold text-gray-700">{postAuthor(post)}</span>
        <span>, Contributor</span>
      </div>
    </div>
  );
}

function FilterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
      />
    </svg>
  );
}

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const searchTerm =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const category =
    typeof searchParams.categories === "string" ? searchParams.categories : "";
  const before = (searchParams.before as string) || null;
  const after = (searchParams.after as string) || null;

  const [categories, { posts, pageInfo }] = await Promise.all([
    getCategories(),
    getAllPosts(searchTerm, category, { before, after }),
  ]);

  const all: Post[] = Array.isArray(posts) ? posts : [];

  if (all.length === 0) {
    return (
      <div
        className="min-h-screen bg-white"
        style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}
      >
        <div className="mx-auto max-w-lg px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div />
            <h1 className="text-base font-semibold text-gray-900">
              Latest News
            </h1>
            <div className="flex items-center gap-3">
              <Link href="/explore" className="text-gray-500">
                <SearchIconSvg className="w-5 h-5" />
              </Link>
              <FilterIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          {categories.length > 0 && (
            <div className="mb-4">
              <CategoryChips
                categories={categories}
                activeCategory={category}
              />
            </div>
          )}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">
              No articles found
              {searchTerm ? ` for "${searchTerm}"` : ""}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const featuredPost = all[0];
  const listPosts = all.slice(1, 8);

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div />
          <h1 className="text-base font-semibold text-gray-900">
            Latest News
          </h1>
          <div className="flex items-center gap-3">
            <Link href="/explore" className="text-gray-500">
              <SearchIconSvg className="w-5 h-5" />
            </Link>
            <FilterIcon className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {categories.length > 0 && (
          <div className="mb-4">
            <CategoryChips
              categories={categories}
              activeCategory={category}
            />
          </div>
        )}

        <div className="mb-4">
          <Link href={postHref(featuredPost)} className="block group">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={postImg(featuredPost)}
                alt={featuredPost.title}
                fill
                className="object-cover"
                sizes="(max-width: 512px) 100vw, 512px"
                priority
              />
              <div className="absolute top-3 right-3">
                <BookmarkIcon className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
          </Link>
          <div className="mt-3">
            <div className="text-xs text-gray-500 font-medium uppercase">
              {postCat(featuredPost)}
            </div>
            <Link href={postHref(featuredPost)} className="block group">
              <h2 className="text-lg font-bold text-gray-900 leading-snug mt-1 group-hover:text-gray-700 transition-colors">
                {featuredPost.title}
              </h2>
            </Link>
            <div className="flex items-center gap-2 mt-2">
              <AuthorAvatar name={postAuthor(featuredPost)} size={28} />
              <span className="text-xs font-medium text-gray-700">
                {postAuthor(featuredPost)}
              </span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">
                {timeAgo(featuredPost.date)}
              </span>
              <span className="text-xs text-gray-400">·</span>
              <CommentIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">
                {commentCount(featuredPost)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 my-4" />

        <div>
          {listPosts.map((post, idx) => (
            <div key={post.id || idx}>
              {idx > 0 && idx % 3 === 0 && (
                <>
                  <div className="border-t border-gray-100 my-4" />
                  <QuoteCard post={post} />
                  <div className="border-t border-gray-100 my-4" />
                </>
              )}
              <NewsListItem post={post} />
              <div className="border-t border-gray-100" />
            </div>
          ))}
        </div>

        {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
          <div className="flex justify-center items-center gap-6 py-6">
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
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
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
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Next
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
