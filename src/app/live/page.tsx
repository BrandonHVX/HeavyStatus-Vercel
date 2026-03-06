import { getAllPosts } from "@/lib/queries";
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";
import LiveClientWrapper from "./LiveClientWrapper";

export const revalidate = 30;

function generateDuration(postId: string): string {
  const n = typeof postId === "string" ? parseInt(postId.replace(/\D/g, ""), 10) || 0 : Number(postId);
  const mins = 1 + (((n * 7 + 3) * 13) % 12);
  const secs = ((n * 11 + 7) * 17) % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default async function LivePage() {
  const { posts } = await getAllPosts();

  if (posts.length === 0) {
    return (
      <div>
        <p>No live updates available.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const upNextPosts = posts.slice(1, 10);

  return (
    <LiveClientWrapper
      featuredPost={{
        title: featuredPost.title,
        slug: featuredPost.slug,
        excerpt: stripHtml(featuredPost.excerpt, 200),
        category: postCat(featuredPost),
        author: postAuthor(featuredPost),
        timeAgo: timeAgo(featuredPost.date),
        imageUrl: postImg(featuredPost),
        duration: generateDuration(featuredPost.id),
        href: postHref(featuredPost),
      }}
      upNextPosts={upNextPosts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        category: postCat(post),
        author: postAuthor(post),
        timeAgo: timeAgo(post.date),
        imageUrl: postImg(post),
        duration: generateDuration(post.id),
        href: postHref(post),
      }))}
    />
  );
}
