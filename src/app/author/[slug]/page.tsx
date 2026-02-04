import type { Metadata } from 'next';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const author = await getAuthorBySlug((await params).slug);
  if (!author) return {};

  return {
    title: `${author.name} | Political Aficionado`,
    description: author.description || `Articles by ${author.name} on Political Aficionado`,
    openGraph: {
      title: `${author.name} | Political Aficionado`,
      description: author.description || `Articles by ${author.name}`,
      images: author.avatar?.url ? [author.avatar.url] : [],
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const slug = (await params).slug;
  const [author, posts] = await Promise.all([
    getAuthorBySlug(slug),
    getPostsByAuthor(slug),
  ]);

  if (!author) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Author not found</h1>
          <Link href="/" className="text-accent hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heavy-status-vercel.vercel.app';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": author.name,
      "description": author.description,
      "image": author.avatar?.url,
      "url": `${baseUrl}/author/${author.slug}`,
      "worksFor": {
        "@type": "Organization",
        "name": "Political Aficionado",
        "url": baseUrl
      }
    }
  };

  return (
    <section className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {author.avatar?.url && (
            <div className="mb-6">
              <Image
                src={author.avatar.url}
                alt={author.name}
                width={120}
                height={120}
                className="rounded-full mx-auto border-4 border-white shadow-lg"
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {author.name}
          </h1>
          {author.description && (
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              {author.description}
            </p>
          )}
          <p className="text-gray-400 mt-4">
            {posts.length} {posts.length === 1 ? 'Article' : 'Articles'} Published
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xs uppercase tracking-widest font-semibold mb-8 text-center">
          Articles by {author.name}
        </h2>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/${post.slug}`}>
                  {post.featuredImage?.node?.sourceUrl && (
                    <div className="aspect-[16/10] overflow-hidden mb-4">
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  {post.categories?.nodes?.[0] && (
                    <span className="text-xs uppercase tracking-widest text-accent font-semibold">
                      {post.categories.nodes[0].name}
                    </span>
                  )}
                  <h3
                    className="font-serif text-xl mt-2 group-hover:text-accent transition-colors"
                    dangerouslySetInnerHTML={{ __html: post.title }}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No articles found for this author.</p>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link
            href="/headlines"
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View all articles
          </Link>
        </div>
      </div>
    </section>
  );
}
