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

  if (posts?.length === 0) {
    return <p>No articles found.</p>;
  }

  return (
    <section>
      {showSearch && (
        <div>
          <h2>Articles</h2>
          <SearchBar />
        </div>
      )}

      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link href={`/${post.slug}`}>
              {post.featuredImage?.node?.sourceUrl && (
                <Image
                  src={post.featuredImage.node.sourceUrl}
                  alt={post.featuredImage.node.altText || post.title}
                  width={400}
                  height={300}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              )}
              {post.categories?.nodes?.[0] && (
                <span>{post.categories.nodes[0].name}</span>
              )}
              <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
              <span>{formatDate(post.date)}</span>
            </Link>
          </li>
        ))}
      </ul>

      {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
        <div>
          {pageInfo?.hasPreviousPage && (
            <Link
              href={{
                pathname: '/',
                query: {
                  before: pageInfo.startCursor,
                  ...(searchTerm && { search: searchTerm }),
                  ...(category && { categories: category })
                }
              }}
            >
              Previous
            </Link>
          )}
          {pageInfo?.hasNextPage && (
            <Link
              href={{
                pathname: '/',
                query: {
                  after: pageInfo.endCursor,
                  ...(searchTerm && { search: searchTerm }),
                  ...(category && { categories: category })
                }
              }}
            >
              Next
            </Link>
          )}
        </div>
      )}
    </section>
  )
}
