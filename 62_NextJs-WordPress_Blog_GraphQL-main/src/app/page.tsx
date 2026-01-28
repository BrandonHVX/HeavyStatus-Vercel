import { Hero } from '@/components/hero';
import { SocialIcons } from '@/components/social-icons';
import { Categories } from '@/components/categories';
import { LatestPosts } from '@/components/latest-posts';
import { getCategories, getAllPosts } from '@/lib/queries';
import Link from 'next/link';

export default async function Home() {
  const categories = await getCategories();
  const { posts } = await getAllPosts();

  return (
    <section>
      <Hero />
      <SocialIcons />
      <Categories categories={categories} />
      <LatestPosts posts={posts} />
      <div className='text-center'>
        <Link href={`/blog`} className='hover:underline text-gray-900 py-5 block rounded-md'>
          View More Posts
        </Link>
      </div>
    </section>
  );
}
