import { getPostsByTag } from '@/lib/queries';
import PhotoGallery from '@/components/PhotoGallery';
import Link from 'next/link';

export const revalidate = 60;

export const metadata = {
  title: 'Photo Gallery - Political Aficionado',
  description: 'Browse our photo library collection',
};

function extractImagesFromContent(content: string): string[] {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  const images: string[] = [];
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1] && !match[1].includes('data:')) {
      images.push(match[1]);
    }
  }
  return images;
}

export default async function GalleryPage() {
  const posts = await getPostsByTag('photo-library');

  const allImages = posts.flatMap((post) => {
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
    contentImages.forEach((src, index) => {
      images.push({
        src,
        alt: `${post.title} - Image ${index + 1}`,
        title: post.title,
        postSlug: post.slug,
      });
    });

    return images;
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/" className="text-gray-500 hover:text-black text-sm">
            &larr; Back to Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Photo Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A curated collection of images from our Photo Library
          </p>
          <p className="text-sm text-gray-400 mt-2">{allImages.length} photos</p>
        </div>

        <PhotoGallery images={allImages} />
      </div>
    </div>
  );
}
