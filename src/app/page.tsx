import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/queries";
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const [{ posts }, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  return (
    <div>
      <h1>Headlines</h1>

      <nav>
        <Link href="/">All</Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/?categories=${cat.slug}`}>{cat.name}</Link>
        ))}
      </nav>

      {posts.length === 0 ? (
        <p>No posts available.</p>
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
                <span>{postCat(post)}</span>
                <h2 dangerouslySetInnerHTML={{ __html: post.title }} />
                <p>{stripHtml(post.excerpt, 150)}</p>
                <p>{postAuthor(post)} - {timeAgo(post.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
