import { SearchBar } from "@/components/search-bar";
import { Post } from '@/lib/types';
import Link from "next/link";
import Image from "next/image";

type LatestPostsProps = {
  posts: Post[];
  title?: string;
  searchTerm?: string;
  pageInfo?: { startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean };
  category?: string;
  showSearch?: boolean;
}

export function LatestPosts({ posts, searchTerm, pageInfo, category, showSearch = true }: LatestPostsProps) {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getReadTime = (post: Post) => {
    const words = post?.content?.split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / 200));
  };

  if (posts?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm font-medium">No articles found.</p>
      </div>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        {showSearch && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-lg font-bold text-gray-900">Articles</h2>
            <div className="w-full md:w-auto">
              <SearchBar />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="card group"
            >
              <div className="relative aspect-[4/3] img-hover-scale">
                {post.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {post.categories?.nodes?.[0] && (
                    <span className="category-chip-sm">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                </div>
                <h3
                  className="font-heading text-base font-semibold text-gray-900 text-limit-2-row leading-snug group-hover:text-accent transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <div className="flex items-center gap-2 mt-3 text-[11px] text-gray-400">
                  <span className="font-medium text-gray-500">{formatDate(post.date)}</span>
                  <span className="read-time">{getReadTime(post)} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
          <div className="flex justify-center items-center gap-4 pt-8 mt-8">
            {pageInfo?.hasPreviousPage && (
              <Link
                href={{
                  pathname: '/headlines',
                  query: {
                    before: pageInfo.startCursor,
                    ...(searchTerm && { search: searchTerm }),
                    ...(category && { categories: category })
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-card-sm text-sm font-medium text-gray-700 hover:border-accent hover:text-accent transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}

            {pageInfo?.hasNextPage && (
              <Link
                href={{
                  pathname: '/headlines',
                  query: {
                    after: pageInfo.endCursor,
                    ...(searchTerm && { search: searchTerm }),
                    ...(category && { categories: category })
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-card-sm text-sm font-medium text-gray-700 hover:border-accent hover:text-accent transition-all"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
