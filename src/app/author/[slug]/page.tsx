import type { Metadata } from 'next';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/queries';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';

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
      <div>
        <h1>Author not found</h1>
        <Link href="/">Return to home</Link>
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
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackButton />

      <div>
        {author.avatar?.url && (
          <Image
            src={author.avatar.url}
            alt={author.name}
            width={120}
            height={120}
          />
        )}
        <h1>{author.name}</h1>
        {author.description && <p>{author.description}</p>}
        <p>{posts.length} {posts.length === 1 ? 'Article' : 'Articles'} Published</p>
      </div>

      <div>
        <h2>Articles by {author.name}</h2>

        {posts.length > 0 ? (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link href={`/${post.slug}`}>
                  {post.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      width={400}
                      height={250}
                    />
                  )}
                  {post.categories?.nodes?.[0] && (
                    <span>{post.categories.nodes[0].name}</span>
                  )}
                  <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
                  <p>
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No articles found for this author.</p>
        )}

        <div>
          <Link href="/headlines">&larr; View all articles</Link>
        </div>
      </div>
    </section>
  );
}
