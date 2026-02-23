import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug } from '@/lib/queries';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';
import ShareButtons from '@/components/ShareButtons';
import AdUnit from '@/components/AdUnit';
import BackButton from '@/components/BackButton';
import Image from 'next/image';

export const revalidate = 60;

function extractImagesFromContent(content: string): { src: string; alt: string }[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi;
  const images: { src: string; alt: string }[] = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('data:')) {
      images.push({
        src: match[1],
        alt: match[2] || '',
      });
    }
  }
  return images;
}

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h1>
          <Link href="/" className="text-sm text-accent font-medium hover:text-accent-hover">
            Back to home
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

  const readTime = Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200));

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://heavy-status-vercel.vercel.app';
  const articleUrl = `${baseUrl}/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": post.seo?.title || post.title,
    "datePublished": post.date,
    "dateModified": post.modified || post.date,
    "author": {
      "@type": "Person",
      "name": post?.author?.node?.name,
      "url": `${baseUrl}/about`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Political Aficionado",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 600,
        "height": 60
      }
    },
    "description": post.seo?.metaDesc || post.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    "image": post.seo?.opengraphImage?.sourceUrl || post.featuredImage?.node?.sourceUrl,
    "articleSection": post.categories?.nodes?.[0]?.name,
    "keywords": post.tags?.nodes?.map(tag => tag.name).join(', '),
    "isAccessibleForFree": false,
    "hasPart": {
      "@type": "WebPageElement",
      "isAccessibleForFree": false,
      "cssSelector": ".article"
    }
  };

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 pt-4">
        <BackButton label="Back" />
      </div>

      <header className="max-w-3xl mx-auto px-4 pt-3 pb-5">
        <div className="flex items-center gap-2 mb-4">
          {post.categories?.nodes?.[0] && (
            <span className="category-chip">
              {post.categories.nodes[0].name}
            </span>
          )}
          <span className="text-[11px] text-gray-400 font-medium">{readTime} min read</span>
        </div>
        <h1
          className="font-heading text-[28px] md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2] mb-4"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
            {(post?.author?.node?.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div>
            <Link href={`/author/${post?.author?.node?.slug}`} className="text-sm font-semibold text-gray-900 hover:text-accent transition-colors">
              {post?.author?.node?.name}
            </Link>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{date}</span>
              <span className="read-time">{readTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {post.featuredImage?.node?.sourceUrl && (
        <figure className="max-w-4xl mx-auto mb-8 px-4">
          <div className="relative w-full aspect-[16/9] rounded-card overflow-hidden">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
        </figure>
      )}

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="mb-8">
          <AdUnit slot="aboveFold" format="horizontal" className="min-h-[90px]" />
        </div>

        {post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'photo library') ? (
          <>
            {post.excerpt && (
              <div className="mb-8 text-lg text-gray-500 font-heading leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            )}
            <PhotoGallery
              images={(() => {
                const images: { src: string; alt: string; title: string; postSlug: string }[] = [];
                if (post.featuredImage?.node?.sourceUrl) {
                  images.push({
                    src: post.featuredImage.node.sourceUrl,
                    alt: post.featuredImage.node.altText || post.title,
                    title: post.title,
                    postSlug: post.slug,
                  });
                }
                const contentImages = extractImagesFromContent(post.content || '');
                contentImages.forEach((img, index) => {
                  images.push({
                    src: img.src,
                    alt: img.alt || `${post.title} - Image ${index + 1}`,
                    title: post.title,
                    postSlug: post.slug,
                  });
                });
                return images;
              })()}
            />
          </>
        ) : (
          <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }} />
        )}

        <div className="my-8">
          <AdUnit slot="inContent" format="rectangle" className="min-h-[250px]" />
        </div>

        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-pill hover:bg-gray-100 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          <ShareButtons url={articleUrl} title={post.title} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <BackButton label="Back to all articles" fallbackHref="/" />
        </div>
      </div>
    </article>
  );
}
