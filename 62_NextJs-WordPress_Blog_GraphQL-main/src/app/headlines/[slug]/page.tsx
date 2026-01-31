import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug } from '@/lib/queries';
import Link from 'next/link';
import Image from 'next/image';

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
          <h1 className="text-4xl font-serif text-black mb-4">Article not found</h1>
          <Link href="/headlines" className="text-accent hover:underline text-sm uppercase tracking-wider">
            Return to articles
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

  const authorName = post?.author?.node?.name || 'Heavy Status';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.seo?.title || post.title,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": authorName,
    },
    "description": post.seo?.metaDesc || post.title,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://heavy-status.com/headlines/${post.slug}`,
    },
    "image": post.seo?.opengraphImage?.sourceUrl || post.featuredImage?.node?.sourceUrl
  };

  return (
    <article className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {post.featuredImage?.node?.sourceUrl && (
        <div className="relative w-full aspect-[21/9]">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          {post.categories?.nodes?.[0] && (
            <span className="vf-category mb-4 inline-block">
              {post.categories.nodes[0].name}
            </span>
          )}
          <h1 
            className='font-serif text-3xl md:text-4xl lg:text-5xl text-black mb-6 leading-tight' 
            dangerouslySetInnerHTML={{ __html: post.title }}
          />
          <div className="flex items-center justify-center gap-3 text-gray-500 text-sm">
            <span>By <span className="text-black">{authorName}</span></span>
            <span className="text-gray-300">|</span>
            <span>{date}</span>
          </div>
        </header>

        <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }}/>
        
        {post.tags?.nodes && post.tags.nodes.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.2em] mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.nodes.map((tag, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-xs uppercase tracking-wider hover:bg-black hover:text-white hover:border-black transition-colors cursor-default"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link 
            href="/headlines" 
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </article>
  )
}
