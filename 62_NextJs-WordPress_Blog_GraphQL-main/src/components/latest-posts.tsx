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

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 120) + '...';
  };

  if (posts?.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts available.</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="section-title mb-0">Latest Posts</h2>
          {showSearch && (
            <div className="w-full md:w-auto">
              <SearchBar />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="post-card group"
            >
              <div className="post-card-image h-48 relative">
                {post.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-accent"></div>
                )}
              </div>
              <div className="p-5">
                {post.categories?.nodes?.[0] && (
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                    {post.categories.nodes[0].name}
                  </span>
                )}
                <h3 
                  className="font-bold text-lg text-gray-900 mt-2 mb-3 group-hover:text-accent transition-colors leading-tight"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {stripHtml(post.excerpt)}
                  </p>
                )}
                <p className="text-gray-400 text-xs">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            {pageInfo?.hasPreviousPage && (
              <Link
                href={{
                  pathname: '/blog',
                  query: {
                    before: pageInfo.startCursor,
                    ...(searchTerm && { search: searchTerm }),
                    ...(category && { categories: category })
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded hover:bg-secondary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            )}
          </div>

          <div>
            {pageInfo?.hasNextPage && (
              <Link
                href={{
                  pathname: '/blog',
                  query: {
                    after: pageInfo.endCursor,
                    ...(searchTerm && { search: searchTerm }),
                    ...(category && { categories: category })
                  }
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded hover:bg-secondary transition-colors"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
