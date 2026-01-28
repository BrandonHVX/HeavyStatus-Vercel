import { Hero } from '@/components/hero';
import { Categories } from '@/components/categories';
import { LatestPosts } from '@/components/latest-posts';
import { getCategories, getAllPosts } from '@/lib/queries';
import Link from 'next/link';

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
      <LatestPosts posts={latestPosts} showSearch={false} />
      <div className='bg-white pb-10'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <Link 
            href={`/blog`} 
            className='inline-block px-8 py-3 bg-accent text-white font-medium rounded hover:bg-red-600 transition-colors'
          >
            View All Posts
          </Link>
        </div>
      </div>
    </>
  );
}
