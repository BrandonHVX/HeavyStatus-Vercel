import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getAllAuthors } from "@/lib/queries";
import { Post, Author } from "@/lib/types";
import {
  timeAgo,
  fmtMonthYear,
  commentCount,
  postImg,
  postHref,
  postCat,
  postAuthor,
  AuthorAvatar,
  BookmarkIcon,
  CommentIcon,
  MoreIcon,
  PlayIcon,
  SectionHeader,
  MagazineCard,
} from "@/lib/nuws-helpers";

export const revalidate = 60;

export default async function Home() {
  const [{ posts }, authors] = await Promise.all([getAllPosts(), getAllAuthors()]);
  const all: Post[] = Array.isArray(posts) ? posts : [];

  if (all.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">No articles yet. Content will appear once published.</p>
      </div>
    );
  }

  const magazinePosts = all.slice(0, 4);
  const topNewsFeatured = all[4] || all[0];
  const topNewsListPosts = all.slice(5, 8).length ? all.slice(5, 8) : all.slice(1, 4);
  const videoPosts = all.slice(8, 11).length ? all.slice(8, 11) : all.slice(0, 3);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <div className="mx-auto max-w-lg px-4 pb-24 pt-6">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Browse</h1>

        <div className="rounded-2xl bg-gray-100 px-6 py-8 text-center mb-8">
          <div className="text-2xl font-bold text-gray-900 mb-2">Nuws</div>
          <p className="text-sm text-gray-600 mb-1">Millions of the latest magazines and news. One subscription</p>
          <p className="text-xs text-gray-400 mb-5">Plan auto-renews for $9.99/month until cancelled</p>
          <Link
            href="/subscribe"
            className="inline-block bg-green-600 text-white rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        <div className="flex gap-3 mb-8 overflow-x-auto scrollbar-hide">
          <Link href="/headlines" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 flex-shrink-0">
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Categories</span>
          </Link>
          <Link href="/headlines?filter=featured" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 flex-shrink-0">
            <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Featured</span>
          </Link>
          <Link href="/headlines?filter=hot" className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 flex-shrink-0">
            <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Hot</span>
          </Link>
        </div>

        <section className="mb-8">
          <SectionHeader title="Latest Magazines" href="/headlines" />
          <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
            {magazinePosts.map((p) => (
              <MagazineCard key={p.id} post={p} />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <SectionHeader title="Top News" href="/headlines" />

          <Link href={postHref(topNewsFeatured)} className="block group mb-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
              <Image src={postImg(topNewsFeatured)} alt={topNewsFeatured.title || ""} fill className="object-cover" sizes="(max-width: 512px) 100vw, 512px" priority />
              <div className="absolute top-3 left-3 bg-white/80 text-xs px-2 py-0.5 rounded-md font-medium">
                {postCat(topNewsFeatured)}
              </div>
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
              {topNewsFeatured.title}
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <AuthorAvatar name={postAuthor(topNewsFeatured)} size={28} />
              <span className="text-xs font-medium text-gray-700">{postAuthor(topNewsFeatured)}</span>
              <span className="text-xs text-gray-400">{timeAgo(topNewsFeatured.date)}</span>
              <CommentIcon className="w-3.5 h-3.5 text-gray-400 ml-1" />
              <span className="text-xs text-gray-400">{commentCount(topNewsFeatured)}</span>
            </div>
          </Link>

          {topNewsListPosts.map((p, i) => (
            <div key={p.id || i}>
              <Link href={postHref(p)} className="flex items-start gap-3 py-3 group">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {p.title}
                  </h4>
                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-400">
                    <span>{postAuthor(p)}</span>
                    <span>·</span>
                    <span>{timeAgo(p.date)}</span>
                  </div>
                </div>
                <div className="relative w-[100px] h-[75px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image src={postImg(p)} alt="" fill className="object-cover" sizes="100px" />
                </div>
              </Link>
              <div className="border-t border-gray-100" />
            </div>
          ))}
        </section>

        <section className="mb-8">
          <SectionHeader title="Popular Authors" href="/headlines" />
          <div className="flex overflow-x-auto gap-5 scrollbar-hide pb-2">
            {(authors as Author[]).slice(0, 8).map((a) => (
              <Link href={`/author/${a.slug}`} key={a.id} className="flex-shrink-0 flex flex-col items-center w-16">
                {a.avatar?.url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <Image src={a.avatar.url} alt={a.name} fill className="object-cover" sizes="48px" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold text-base">
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="mt-2 text-xs font-medium text-gray-900 text-center line-clamp-1">{a.name}</span>
                <span className="text-[11px] text-gray-400">Contributor</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <SectionHeader title="Recent Video" href="/headlines" />
          <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-2">
            {videoPosts.map((p) => (
              <Link href={postHref(p)} key={p.id} className="flex-shrink-0 w-[256px] group">
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                  <Image src={postImg(p)} alt="" fill className="object-cover" sizes="256px" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayIcon />
                  </div>
                </div>
                <div className="mt-2 text-[11px] font-medium text-gray-500 uppercase">{postCat(p)}</div>
                <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {p.title}
                </h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span>{postAuthor(p)}</span>
                  <span>·</span>
                  <span>{timeAgo(p.date)}</span>
                  <span>·</span>
                  <CommentIcon className="w-3.5 h-3.5" />
                  <span>{commentCount(p)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
