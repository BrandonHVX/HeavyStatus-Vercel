import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories, getAllAuthors } from "@/lib/queries";
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor, postAuthorSlug } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const [{ posts }, categories, authors] = await Promise.all([
    getAllPosts(),
    getCategories(),
    getAllAuthors(),
  ]);

  return (
    <div>
      <h1>Headlines</h1>

      <nav>
        <Link href="/">All</Link>
        {categories.slice(0, 10).map((cat) => (
          <Link key={cat.id} href={`/?categories=${cat.slug}`}>
            {cat.name}
          </Link>
        ))}
      </nav>

      <section>
        <h2>Latest Posts</h2>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={postHref(post)}>
                  {post.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={postImg(post)}
                      alt={post.featuredImage.node.altText || post.title}
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  )}
                  <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
                </Link>
                <p>
                  <span>{postCat(post)}</span> |{" "}
                  <Link href={`/author/${postAuthorSlug(post)}`}>{postAuthor(post)}</Link> |{" "}
                  <span>{timeAgo(post.date)}</span>
                </p>
                <p>{stripHtml(post.excerpt, 150)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {authors.length > 0 && (
        <section>
          <h2>Authors</h2>
          <ul>
            {authors.slice(0, 10).map((author) => (
              <li key={author.id}>
                <Link href={`/author/${author.slug}`}>
                  {author.avatar?.url && (
                    <Image
                      src={author.avatar.url}
                      alt={author.name}
                      width={48}
                      height={48}
                      sizes="48px"
                    />
                  )}
                  {author.name}
                </Link>
                {author.description && <p>{stripHtml(author.description, 60)}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
