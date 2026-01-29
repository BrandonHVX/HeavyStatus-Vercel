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
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Link href={`/blog/${featuredPost.slug}`} className="vogue-card group block">
              <div className="relative aspect-[16/10] mb-6">
                {featuredPost.featuredImage?.node?.sourceUrl ? (
                  <Image
                    src={featuredPost.featuredImage.node.sourceUrl}
                    alt={featuredPost.featuredImage.node.altText || featuredPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100"></div>
                )}
              </div>
              <div>
                {featuredPost.categories?.nodes?.[0] && (
                  <span className="vogue-category mb-3 inline-block">
                    {featuredPost.categories.nodes[0].name}
                  </span>
                )}
                <h2 
                  className="vogue-headline text-3xl md:text-4xl mb-4"
                  dangerouslySetInnerHTML={{ __html: featuredPost.title }}
                />
                {excerpt && (
                  <p className="text-gray-600 text-base mb-4 max-w-2xl">
                    {excerpt}{excerpt.length >= 200 ? '...' : ''}
                  </p>
                )}
                <p className="vogue-byline">By Heavy Status · {formatDate(featuredPost.date)}</p>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-gray-200 pt-8 lg:pt-0 lg:pl-8">
            <h3 className="text-xs uppercase tracking-widest font-semibold mb-6">Latest</h3>
            <div className="space-y-6">
              {recentPosts.slice(0, 5).map((post) => (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.slug}`}
                  className="vogue-card group block pb-6 border-b border-gray-100 last:border-b-0"
                >
                  {post.categories?.nodes?.[0] && (
                    <span className="vogue-category mb-2 inline-block">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                  <h4 
                    className="vogue-headline text-lg leading-snug"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
