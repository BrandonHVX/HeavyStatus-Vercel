import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

type HeroProps = {
  featuredPost?: Post;
  topStories?: Post[];
}

export function Hero({ featuredPost, topStories = [] }: HeroProps){
  if (!featuredPost) {
    return null;
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const excerpt = featuredPost.excerpt ? stripHtml(featuredPost.excerpt).substring(0, 180) : '';
  const authorName = featuredPost.author?.node?.name || 'Heavy Status';

  return (
    <section className="bg-white">
      <Link href={`/headlines/${featuredPost.slug}`} className="vf-headline-hover block relative">
        <div className="relative aspect-[16/9] w-full">
          {featuredPost.featuredImage?.node?.sourceUrl ? (
            <Image
              src={featuredPost.featuredImage.node.sourceUrl}
              alt={featuredPost.featuredImage.node.altText || featuredPost.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200"></div>
          )}
          <div className="hero-overlay absolute inset-0"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <div className="max-w-4xl">
              {featuredPost.categories?.nodes?.[0] && (
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/90 mb-3 inline-block">
                  {featuredPost.categories.nodes[0].name}
                </span>
              )}
              <h1 
                className="vf-headline text-2xl md:text-4xl lg:text-5xl text-white mb-4"
                dangerouslySetInnerHTML={{ __html: featuredPost.title }}
              />
              {excerpt && (
                <p className="text-white/80 text-sm md:text-base mb-4 max-w-2xl hidden md:block">
                  {excerpt}{excerpt.length >= 180 ? '...' : ''}
                </p>
              )}
              <p className="text-white/70 text-xs">By {authorName}</p>
            </div>
          </div>
        </div>
      </Link>

      {topStories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topStories.slice(0, 4).map((post) => {
              const postAuthor = post.author?.node?.name || 'Heavy Status';
              return (
                <Link 
                  key={post.id} 
                  href={`/headlines/${post.slug}`}
                  className="vf-card group"
                >
                  <div className="relative aspect-[16/9] mb-4 overflow-hidden">
                    {post.featuredImage?.node?.sourceUrl ? (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100"></div>
                    )}
                  </div>
                  {post.categories?.nodes?.[0] && (
                    <span className="vf-category mb-2 inline-block">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                  <h3 
                    className="vf-headline text-lg leading-snug mb-2"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="vf-author">By {postAuthor}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  )
}
