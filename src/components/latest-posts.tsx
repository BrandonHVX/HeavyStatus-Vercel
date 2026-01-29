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
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-gray-200">
            <h2 className="text-xs uppercase tracking-widest font-semibold">Articles</h2>
            <div className="w-full md:w-auto">
              <SearchBar />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {posts.map((post: Post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="vogue-card group"
            >
              <div className="relative aspect-[4/3] mb-4 overflow-hidden">
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
                  <span className="vogue-category mb-2 inline-block">
                    {post.categories.nodes[0].name}
                  </span>
                )}
                <h3 
                  className="vogue-headline text-xl mb-3 leading-tight"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
                <p className="vogue-byline">{formatDate(post.date)}</p>
              </div>
            </Link>
          ))}
        </div>

        {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
          <div className="flex justify-center items-center gap-8 pt-12 mt-12 border-t border-gray-200">
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
                className="text-xs uppercase tracking-widest text-black hover:text-accent transition-colors"
              >
                &larr; Previous
              </Link>
            )}

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
                className="text-xs uppercase tracking-widest text-black hover:text-accent transition-colors"
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
