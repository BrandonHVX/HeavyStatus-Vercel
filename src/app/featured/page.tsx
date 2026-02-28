import { getAllPosts } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function FeaturedPage() {
  const { posts } = await getAllPosts();

  return (
    <div>
      <h1>Featured</h1>
      <p>Top stories and editor picks</p>

      {posts.length === 0 ? (
        <p>No featured posts available.</p>
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
