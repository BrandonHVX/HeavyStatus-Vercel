import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug, getAllPosts } from '@/lib/queries';
import Link from 'next/link';
import PhotoGallery from '@/components/PhotoGallery';
import ShareButtons from '@/components/ShareButtons';
import AdUnit from '@/components/AdUnit';
import BackButton from '@/components/BackButton';
import Image from 'next/image';
import { timeAgo, stripHtml, postImg, postHref, postCat, postAuthor } from '@/lib/nuws-helpers';

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
      <div>
        <h1>Article not found</h1>
        <Link href="/">Back to home</Link>
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
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BackButton label="Back" />

      {post.featuredImage?.node?.sourceUrl && (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || post.title}
          width={800}
          height={450}
          sizes="(max-width: 768px) 100vw, 800px"
          priority
        />
      )}

      {post.categories?.nodes?.[0] && (
        <span>{post.categories.nodes[0].name}</span>
      )}

      <h1 dangerouslySetInnerHTML={{ __html: post.title }} />

      {excerptText && <p>{excerptText}</p>}

      <div>
        <Link href={`/author/${post?.author?.node?.slug}`}>
          {post?.author?.node?.name}
        </Link>
        <span> - {timeAgo(post.date)}</span>
      </div>

      <AdUnit slot="aboveFold" format="horizontal" />

      {post.tags?.nodes?.some(tag => tag.name.toLowerCase() === 'photo library') ? (
        <>
          {post.excerpt && (
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
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

      <AdUnit slot="inContent" format="rectangle" />

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

      <ShareButtons url={articleUrl} title={post.title} />

      {relatedPosts.length > 0 && (
        <section>
          <h2>Related Posts</h2>
          <ul>
            {relatedPosts.map((rp) => (
              <li key={rp.slug}>
                <Link href={postHref(rp)}>
                  <Image src={postImg(rp)} alt="" width={155} height={155} sizes="155px" />
                  <span>{postCat(rp)}</span>
                  <h3>{rp.title}</h3>
                  <p>{postAuthor(rp)} - {timeAgo(rp.date)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <BackButton label="Back to all articles" fallbackHref="/" />
    </article>
  );
}
