import { Hero } from '@/components/hero';
import { Categories } from '@/components/categories';
import { getCategories, getAllPosts } from '@/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const categories = await getCategories();
  const { posts } = await getAllPosts();

  const featuredPost = posts[0];
  const topStories = posts.slice(1, 5);
  const latestPosts = posts.slice(5, 11);
  const popularPosts = posts.slice(0, 4);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <Categories categories={categories} />
      <Hero featuredPost={featuredPost} topStories={topStories} />
      
      <section className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="vf-section-title">Latest Stories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {latestPosts.map((post) => {
                  const authorName = post.author?.node?.name || 'Heavy Status';
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="vf-card group"
                    >
                      {post.featuredImage?.node?.sourceUrl && (
                        <div className="relative aspect-[16/9] mb-4 overflow-hidden">
                          <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      {post.categories?.nodes?.[0] && (
                        <span className="vf-category mb-2 inline-block">
                          {post.categories.nodes[0].name}
                        </span>
                      )}
                      <h3 
                        className="vf-headline text-lg leading-tight mb-2"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <p className="vf-author">By {authorName}</p>
                    </Link>
                  );
                })}
              </div>
              
              <div className="text-center mt-10 pt-8 border-t border-gray-200">
                <Link 
                  href="/blog" 
                  className="text-xs uppercase tracking-widest text-white bg-black px-8 py-3 inline-block hover:bg-accent transition-colors"
                >
                  View All Articles
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <h2 className="vf-section-title">Most Popular</h2>
              <div className="space-y-6">
                {popularPosts.map((post, index) => {
                  const authorName = post.author?.node?.name || 'Heavy Status';
                  return (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="vf-card group flex gap-4"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
                        {post.featuredImage?.node?.sourceUrl ? (
                          <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-2xl font-serif text-gray-400">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {post.categories?.nodes?.[0] && (
                          <span className="vf-category mb-1 inline-block">
                            {post.categories.nodes[0].name}
                          </span>
                        )}
                        <h3 
                          className="vf-headline text-sm leading-snug line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                        <p className="vf-author mt-1 text-[11px]">By {authorName}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="vf-section-title">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog?categories=${cat.slug}`}
                      className="text-xs uppercase tracking-wider border border-gray-300 px-3 py-2 hover:bg-black hover:text-white hover:border-black transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
