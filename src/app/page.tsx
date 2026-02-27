import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories } from "@/lib/queries";
import { Categories } from "@/components/categories";
import { Hero } from "@/components/hero";
import { timeAgo, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const [{ posts }, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 6);
  const remainingPosts = posts.slice(6);

  return (
    <div>
      <h1>Political Aficionado</h1>

      <Categories categories={categories} />

      <Hero featuredPost={featuredPost} recentPosts={recentPosts} />

      {remainingPosts.length > 0 && (
        <section>
          <h2>More Articles</h2>
          <ul>
            {remainingPosts.map((post) => (
              <li key={post.id}>
                <Link href={postHref(post)}>
                  <Image
                    src={postImg(post)}
                    alt={post.title}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <span>{postCat(post)}</span>
                  <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
                  <p>{postAuthor(post)} - {timeAgo(post.date)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href="/headlines">View All Headlines</Link>
    </div>
  );
}
