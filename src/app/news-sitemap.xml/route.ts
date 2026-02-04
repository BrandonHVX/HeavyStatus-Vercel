import { getAllPosts } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { posts } = await getAllPosts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heavy-status-vercel.vercel.app';
  
  // News sitemap only includes posts from the last 2 days per Google News requirements
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const newsPosts = posts.filter(post => new Date(post.date) >= twoDaysAgo);

  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${newsPosts.map(post => `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Political Aficionado</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
