import type { Metadata, ResolvingMetadata } from 'next';
import { getPostsBySlug } from '@/lib/queries';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostsBySlug((await params).slug);

  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: post?.title,
    openGraph: {
      images: ['/open-graph.jpg', ...previousImages],
    },
  }
}

export default async function Page({ params} : {
  params: Promise<{ slug: string}>
}) {

  const post = await getPostsBySlug((await params).slug);
  if(!post) { return <div>Post not found.</div>}

  const formattedDate = new Date(post.date);
  const date = formattedDate.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div>
      <h1 className='font-bold text-2xl mb-4' dangerouslySetInnerHTML={{ __html:post.title }}></h1>
      <div>Published on <b>{date}</b> by {post?.author?.node?.name}</div>
      <div className='article' dangerouslySetInnerHTML={{ __html: post?.content }}/>
    </div>
  )
}