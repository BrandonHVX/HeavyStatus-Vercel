import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug } from '@/lib/queries';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';

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

export default async function Page({ params} : {
  params: Promise<{ slug: string}>
}) {

  const post = await getPostsBySlug((await params).slug);
  if(!post) { 
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post not found</h1>
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
      "@id": `https://heavy-status-vercel.vercel.app/${post.slug}`,
    },
    "image": post.seo?.opengraphImage?.sourceUrl
  };

  return (
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="bg-gradient-to-br from-primary to-secondary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {post.categories?.nodes?.[0] && (
            <span className="category-badge mb-4 inline-block">
              {post.categories.nodes[0].name}
            </span>
          )}
          <h1 
            className='text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight' 
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <span>By <span className="text-white font-medium">{post?.author?.node?.name}</span></span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'photo gallery') ? (
          <>
            {post.excerpt && (
              <div className="mb-8 text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
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
          <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }}/>
        )}
        
        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-accent hover:underline font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </div>
    </article>
  )
}
