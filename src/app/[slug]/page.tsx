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
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/" className="text-accent hover:underline">
            Return to home
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
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 pt-4">
        <BackButton label="Back" />
      </div>

      <header className="max-w-4xl mx-auto px-4 pt-4 pb-6">
        {post.categories?.nodes?.[0] && (
          <span className="nb-category mb-3 inline-block">
            {post.categories.nodes[0].name}
          </span>
        )}
        <h1
          className="font-heading text-3xl md:text-4xl lg:text-[42px] font-bold text-black leading-tight mb-4"
          dangerouslySetInnerHTML={{ __html: post.title }}
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span>
            By{' '}
            <Link href={`/author/${post?.author?.node?.slug}`} className="font-semibold text-black hover:text-accent transition-colors">
              {post?.author?.node?.name}
            </Link>
          </span>
          <span className="entry-meta">
            <span className="has-dot">{date}</span>
          </span>
          <span className="entry-meta">
            <span className="has-dot">{readTime} min read</span>
          </span>
        </div>
      </header>

      {post.featuredImage?.node?.sourceUrl && (
        <figure className="max-w-5xl mx-auto mb-8">
          <div className="relative w-full aspect-[16/9]">
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
              <div className="mb-8 text-lg text-gray-600 font-heading" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
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
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-sm hover:bg-gray-200 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-gray-200">
          <ShareButtons url={articleUrl} title={post.title} />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <BackButton label="Back to all posts" fallbackHref="/" />
        </div>
      </div>
    </article>
  );
}
