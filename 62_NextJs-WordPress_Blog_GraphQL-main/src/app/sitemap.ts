import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts } = await getAllPosts();
  const baseUrl = 'https://heavy-status.com';

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/headlines/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/headlines`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...postEntries,
  ];
}
