import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getAllAuthors } from "@/lib/queries";
import { Post, Author } from "@/lib/types";
import { timeAgo, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const [{ posts }, authors] = await Promise.all([getAllPosts(), getAllAuthors()]);
  const all: Post[] = Array.isArray(posts) ? posts : [];

  if (all.length === 0) {
    return (
      <div>
        <p>No articles yet. Content will appear once published.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Browse</h1>

      <div>
        <Link href="/subscribe">Get Started - $9.99/month</Link>
      </div>

      <nav>
        <Link href="/headlines">Categories</Link>
        <Link href="/headlines?filter=featured">Featured</Link>
        <Link href="/headlines?filter=hot">Hot</Link>
      </nav>

      <section>
        <h2>Latest Posts</h2>
        <ul>
          {all.map((post) => (
            <li key={post.id}>
              <Link href={postHref(post)}>
                {post.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={postImg(post)}
                    alt={post.title || ""}
                    width={400}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                )}
                <span>{postCat(post)}</span>
                <h3>{post.title}</h3>
                <p>{postAuthor(post)} - {timeAgo(post.date)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Authors</h2>
        <ul>
          {(authors as Author[]).slice(0, 8).map((a) => (
            <li key={a.id}>
              <Link href={`/author/${a.slug}`}>
                {a.avatar?.url && (
                  <Image src={a.avatar.url} alt={a.name} width={48} height={48} />
                )}
                <span>{a.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
