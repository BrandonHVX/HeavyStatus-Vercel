import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug } from '@/lib/queries';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostsBySlug((await params).slug);
  if (!post) return {};

  const previousImages = (await parent).openGraph?.images || []

  const seo = post.seo;

  return {
    title: seo?.title || post.title,
    description: seo?.metaDesc,
    openGraph: {
      title: seo?.opengraphTitle || seo?.title || post.title,
      description: seo?.opengraphDescription || seo?.metaDesc,
      images: seo?.opengraphImage?.sourceUrl ? [seo.opengraphImage.sourceUrl] : ['/open-graph.jpg', ...previousImages],
    },
    twitter: {
      title: seo?.twitterTitle || seo?.title || post.title,
      description: seo?.twitterDescription || seo?.metaDesc,
      images: seo?.twitterImage?.sourceUrl ? [seo.twitterImage.sourceUrl] : [],
    }
  }
}

export default async function Page({ params }: {
  params: Promise<{ slug: string }>
}) {

  const post = await getPostsBySlug((await params).slug);
  if (!post) {
    return (
      <div>
        <h1>Post not found</h1>
        <Link href="/blog">Return to blog</Link>
      </div>
    );
  }

  const formattedDate = new Date(post.date);
  const date = formattedDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo?.title || post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post?.author?.node?.name,
    },
    "description": post.seo?.metaDesc || post.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://heavy-status.com/blog/${post.slug}`,
    },
    "image": post.seo?.opengraphImage?.sourceUrl
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackButton label="Back" fallbackHref="/blog" />

      <header>
        {post.categories?.nodes?.[0] && (
          <span>{post.categories.nodes[0].name}</span>
        )}
        <h1 dangerouslySetInnerHTML={{ __html: post.title }} />
        <div>
          <span>By {post?.author?.node?.name}</span>
          <span>{date}</span>
        </div>
      </header>

      <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }} />

      {post.tags?.nodes && post.tags.nodes.length > 0 && (
        <div>
          <h3>Tags</h3>
          <ul>
            {post.tags.nodes.map((tag, index) => (
              <li key={index}>{tag.name}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <BackButton label="Back to all posts" fallbackHref="/blog" />
      </div>
    </article>
  )
}
