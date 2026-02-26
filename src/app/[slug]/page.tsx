import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug, getAllPosts } from '@/lib/queries';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';
import ShareButtons from '@/components/ShareButtons';
import AdUnit from '@/components/AdUnit';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import {
  timeAgo,
  stripHtml,
  commentCount,
  postImg,
  postHref,
  postCat,
  postAuthor,
  AuthorAvatar,
  BookmarkIcon,
  CommentIcon,
  MoreIcon,
  SectionHeader,
} from '@/lib/nuws-helpers';

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
          <Link href="/" className="text-sm text-gray-500 font-medium hover:text-gray-900">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const catSlug = post.categories?.nodes?.[0]?.slug || '';
  let relatedPosts: typeof post[] = [];
  try {
    const result = await getAllPosts('', catSlug);
    relatedPosts = result.posts.filter(p => p.slug !== post.slug).slice(0, 6);
  } catch {}

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

  const excerptText = stripHtml(post.excerpt, 300);

  return (
    <article className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl mx-auto">
        <div className="px-4 pt-4">
          <BackButton label="Back" />
        </div>

        {post.featuredImage?.node?.sourceUrl && (
          <div className="relative w-full aspect-[3/4] md:aspect-[16/9] overflow-hidden mt-3">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        <div className="px-4">
          <div className="flex items-center justify-end gap-4 py-3 border-b border-gray-100">
            <button className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Font size">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h7M5 3v4m8-4h8m-4 0v18M5 21h4m-2-4h.01" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Share">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
            <BookmarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
            <MoreIcon className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" />
          </div>

          {post.categories?.nodes?.[0] && (
            <div className="mt-4">
              <span className="text-xs font-medium text-gray-500 uppercase">
                {post.categories.nodes[0].name}
              </span>
            </div>
          )}

          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mt-3"
            dangerouslySetInnerHTML={{ __html: post.title }}
          />

          {excerptText && (
            <p className="text-sm text-gray-500 leading-relaxed mt-3">
              {excerptText}
            </p>
          )}

          <div className="flex items-center gap-3 mt-4 pb-6 border-b border-gray-100">
            <AuthorAvatar name={post?.author?.node?.name} size={36} />
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
              <Link href={`/author/${post?.author?.node?.slug}`} className="font-semibold text-gray-900 hover:text-gray-600 transition-colors">
                {post?.author?.node?.name}
              </Link>
              <span>·</span>
              <span>{timeAgo(post.date)}</span>
            </div>
          </div>
        </div>

        <div className="px-4 pt-6 pb-12">
          <div className="mb-8">
            <AdUnit slot="aboveFold" format="horizontal" className="min-h-[90px]" />
          </div>

          {post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'photo library') ? (
            <>
              {post.excerpt && (
                <div className="mb-8 text-lg text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.excerpt }} />
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
                    className="px-3 py-1.5 bg-gray-50 text-gray-600 text-sm rounded-full hover:bg-gray-100 transition-colors"
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

          {relatedPosts.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-100">
              <SectionHeader title="Related Posts" href={catSlug ? `/headlines?categories=${catSlug}` : '/headlines'} />
              <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} href={postHref(rp)} className="flex-shrink-0 w-[155px] group">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image src={postImg(rp)} alt="" fill className="object-cover" sizes="155px" />
                    </div>
                    <div className="text-[11px] font-medium text-gray-500 uppercase mt-2">{postCat(rp)}</div>
                    <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mt-1 group-hover:text-gray-600 transition-colors">
                      {rp.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-1">
                      <span>{postAuthor(rp)}</span>
                      <span>·</span>
                      <span>{timeAgo(rp.date)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4">Comments</h3>
            <div className="flex items-center gap-3 mb-6">
              <AuthorAvatar name="You" size={32} />
              <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm text-gray-400">
                Write a comment...
              </div>
            </div>
            <div className="flex items-start gap-3 py-3">
              <AuthorAvatar name="R" size={28} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">Reader</span>
                  <span className="text-[11px] text-gray-400">2h ago</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Great article, very informative!</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                  <button className="hover:text-gray-600">Like</button>
                  <button className="hover:text-gray-600">Reply</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <BackButton label="Back to all articles" fallbackHref="/" />
          </div>
        </div>
      </div>
    </article>
  );
}
