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
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="section-title">Headlines</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Link href={`/blog/${featuredPost.slug}`} className="block group">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
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
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary"></div>
                )}
                <div className="featured-overlay"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {featuredPost.categories?.nodes?.[0] && (
                    <span className="category-badge mb-3 inline-block">
                      {featuredPost.categories.nodes[0].name}
                    </span>
                  )}
                  <h3 
                    className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-accent transition-colors leading-tight"
                    dangerouslySetInnerHTML={{ __html: featuredPost.title }}
                  />
                  <p className="text-gray-300 text-sm">{formatDate(featuredPost.date)}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-5 h-full">
              <h4 className="font-bold text-lg mb-4 text-gray-900">Latest Headlines</h4>
              <div className="space-y-0">
                {recentPosts.slice(0, 5).map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/blog/${post.slug}`}
                    className="headline-item block group"
                  >
                    <h3 
                      className="font-medium text-gray-800 transition-colors leading-snug text-sm"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
