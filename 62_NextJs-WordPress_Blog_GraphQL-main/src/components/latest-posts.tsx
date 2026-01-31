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

  if (posts?.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg font-serif italic">No articles found.</p>
      </div>
    );
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {showSearch && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-black">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold">All Articles</h2>
            <div className="w-full md:w-auto">
              <SearchBar />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {posts.map((post: Post) => {
            const authorName = post.author?.node?.name || 'Heavy Status';
            return (
              <Link
                key={post.id}
                href={`/headlines/${post.slug}`}
                className="vf-card group"
              >
                <div className="relative aspect-[16/9] mb-4 overflow-hidden">
                  {post.featuredImage?.node?.sourceUrl ? (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100"></div>
                  )}
                </div>
                <div>
                  {post.categories?.nodes?.[0] && (
                    <span className="vf-category mb-2 inline-block">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                  <h3 
                    className="vf-headline text-lg mb-2 leading-tight"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="vf-author">By {authorName}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
          <div className="flex justify-center items-center gap-8 pt-12 mt-12 border-t border-gray-200">
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
                className="text-xs uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-accent transition-colors"
              >
                &larr; Previous
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
                className="text-xs uppercase tracking-widest text-white bg-black px-6 py-3 hover:bg-accent transition-colors"
              >
                Next &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
