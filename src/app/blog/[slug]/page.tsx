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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/blog" className="text-accent hover:underline">
            Return to blog
          </Link>
        </div>
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
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <BackButton label="Back" fallbackHref="/blog" />
      </div>

      <header className="max-w-4xl mx-auto px-4 pt-4 pb-6">
        {post.categories?.nodes?.[0] && (
          <span className="nb-category mb-3 inline-block">
            {post.categories.nodes[0].name}
          </span>
        )}
        <h1
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>By <span className="font-semibold text-black">{post?.author?.node?.name}</span></span>
          <span className="entry-meta"><span className="has-dot">{date}</span></span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }} />

        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <BackButton label="Back to all posts" fallbackHref="/blog" />
        </div>
      </div>
    </article>
  )
}
