import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/queries";
import { Post } from "@/lib/types";
import { timeAgo, stripHtml, postHref, postImg, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

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

  return (
    <div>
      <h1>Latest News</h1>

      {categories.length > 0 && (
        <nav>
          <Link href="/headlines">All</Link>
          {categories.slice(0, 12).map((cat) => (
            <Link
              key={cat.id}
              href={`/headlines?categories=${cat.slug}`}
            >
              {category === cat.slug ? `[${cat.name}]` : cat.name}
            </Link>
          ))}
        </nav>
      )}

      {all.length === 0 ? (
        <p>No articles found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
      ) : (
        <ul>
          {all.map((post) => (
            <li key={post.id}>
              <Link href={postHref(post)}>
                {post.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={postImg(post)}
                    alt={post.title}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                )}
                <span>{postCat(post)}</span>
                <h2>{post.title}</h2>
                <p>{postAuthor(post)} - {timeAgo(post.date)}</p>
                <p>{stripHtml(post.excerpt, 150)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
        <div>
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
            >
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
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
