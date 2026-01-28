import { SearchBar } from "@/components/search-bar";
import { Post } from '@/lib/types';
import Link from "next/link";

type LatestPostsProps = {
  posts: Post[];
  title?: string;
  searchTerm?: string;
  pageInfo?: { startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean };
  category?: string;
}

export function LatestPosts({ posts, searchTerm, pageInfo, category }: LatestPostsProps) {

  if (posts?.length === 0) {
    return <div>No posts available.</div>
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <h2 className="text-xl mb-4">Latest Posts</h2>
        <div>
          <SearchBar />
        </div>
      </div>

      <div className="flex flex-col mb-4">
        {posts.map((post: Post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="border-b py-4 flex justify-between hover:bg-slate-50"
          >
            <div dangerouslySetInnerHTML={{ __html: post.title }}></div>
            <p>{new Date(post.date).toLocaleDateString("de-De")}</p>
          </Link>
        ))}
      </div>



      <div className="flex justify-between">
        <div>

          {pageInfo?.hasPreviousPage && (
            <Link
              href={{
                pathname: '/blog',
                query: {
                  before: pageInfo.startCursor,
                  ...((searchTerm || category) && { searchTerm, category })
                }
              }}
            >
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
                  ...((searchTerm || category) && { searchTerm, category })
                }
              }}
            >
              Next
            </Link>
          )}
        </div>
      </div>









    </div>
  )
}