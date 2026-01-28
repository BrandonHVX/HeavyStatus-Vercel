import { getAllPosts } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { posts } = await getAllPosts();
  const baseUrl = 'https://heavy-status.com'; // Change this to your actual production domain

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Heavy Status</title>
    <link>${baseUrl}</link>
    <description>Latest news from Heavy Status</description>
    ${posts.map(post => `
    <item>
      <title>${post.title}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
