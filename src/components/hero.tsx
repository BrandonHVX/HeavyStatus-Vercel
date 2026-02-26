import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

type HeroProps = {
  featuredPost?: Post;
  recentPosts?: Post[];
}

export function Hero({ featuredPost, recentPosts = [] }: HeroProps){
  if (!featuredPost) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const excerpt = featuredPost.excerpt ? stripHtml(featuredPost.excerpt).substring(0, 200) : '';

  return (
    <section>
      <div>
        <Link href={`/${featuredPost.slug}`}>
          {featuredPost.featuredImage?.node?.sourceUrl && (
            <Image
              src={featuredPost.featuredImage.node.sourceUrl}
              alt={featuredPost.featuredImage.node.altText || featuredPost.title}
              width={800}
              height={500}
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
          )}
          {featuredPost.categories?.nodes?.[0] && (
            <span>{featuredPost.categories.nodes[0].name}</span>
          )}
          <h2 dangerouslySetInnerHTML={{ __html: featuredPost.title }} />
          {excerpt && <p>{excerpt}{excerpt.length >= 200 ? '...' : ''}</p>}
          <p>By Political Aficionado - {formatDate(featuredPost.date)}</p>
        </Link>
      </div>

      <div>
        <h3>Latest</h3>
        {recentPosts.slice(0, 5).map((post) => (
          <Link key={post.id} href={`/${post.slug}`}>
            {post.categories?.nodes?.[0] && (
              <span>{post.categories.nodes[0].name}</span>
            )}
            <h4 dangerouslySetInnerHTML={{ __html: post.title }} />
          </Link>
        ))}
      </div>
    </section>
  )
}
