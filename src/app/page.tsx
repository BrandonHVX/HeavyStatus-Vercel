import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/queries";
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const { posts } = await getAllPosts();

  return (
    <div>
      <h1>Latest News</h1>

      {posts.length === 0 ? (
        <p>No articles found.</p>
      ) : (
        <ul>
          {posts.map((post) => (
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
                <h2 dangerouslySetInnerHTML={{ __html: post.title }} />
                <p>{postAuthor(post)} - {timeAgo(post.date)}</p>
                <p>{stripHtml(post.excerpt, 150)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
