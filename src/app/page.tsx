import { Hero } from '@/components/hero';
import { Categories } from '@/components/categories';
import { getCategories, getAllPosts } from '@/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const categories = await getCategories();
  const { posts } = await getAllPosts();

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 6);
  const latestPosts = posts.slice(1);

  return (
    <>
      <Categories categories={categories} />
      <Hero featuredPost={featuredPost} recentPosts={recentPosts} />
      
      <section className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-10">More Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {latestPosts.slice(0, 6).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="vogue-card group"
              >
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative aspect-[4/3] mb-4 overflow-hidden">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                {post.categories?.nodes?.[0] && (
                  <span className="vogue-category mb-2 inline-block">
                    {post.categories.nodes[0].name}
                  </span>
                )}
                <h3 
                  className="vogue-headline text-xl leading-tight"
                  dangerouslySetInnerHTML={{ __html: post.title }}
                />
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12 pt-8 border-t border-gray-200">
            <Link 
              href="/blog" 
              className="text-xs uppercase tracking-widest text-black border border-black px-8 py-3 inline-block hover:bg-black hover:text-white transition-colors"
            >
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
