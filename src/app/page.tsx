import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories, getAllAuthors } from "@/lib/queries";
import { timeAgo, fmtMonthYear, commentCount, stripHtml, postImg, postHref, postCat, postAuthor, postAuthorSlug } from "@/lib/nuws-helpers";

export const revalidate = 60;

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  'bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-rose-400',
  'bg-amber-400', 'bg-cyan-400', 'bg-indigo-400', 'bg-pink-400',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export default async function Home() {
  const [{ posts }, categories, authors] = await Promise.all([
    getAllPosts(),
    getCategories(),
    getAllAuthors(),
  ]);

  const magazinePosts = posts.slice(0, 3);
  const featuredPost = posts[3] || posts[0];
  const listPosts = posts.slice(4, 7);
  const videoPosts = posts.slice(7, 9);
  const topCategories = categories.slice(0, 6);
  const topAuthors = authors.slice(0, 5);

  return (
    <div className="bg-white min-h-screen max-w-lg mx-auto pb-24 relative">
      <div className="h-2" />

      <div className="flex items-center justify-between px-4 pt-1 pb-1">
        <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center">
          <svg className="w-[18px] h-[18px] text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
          </svg>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-[22px] h-[22px] text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <h1 className="text-[28px] font-extrabold text-gray-900 px-4 mt-1 mb-4 tracking-tight">Browse</h1>

      <div className="mx-4 rounded-2xl bg-[#e8e8e8] overflow-hidden relative mb-5">
        <div className="flex flex-col items-center justify-center text-center py-10 px-6">
          <p className="text-gray-400 text-[11px] mb-2 tracking-wide">375 x 398</p>
          <h2 className="text-[34px] font-extrabold text-gray-900 leading-none mb-2.5 tracking-tight">Nuws</h2>
          <p className="text-[15px] font-semibold text-gray-900 leading-snug mb-1 max-w-[260px]">
            Millions of the latest magazines and news. One subscription
          </p>
          <p className="text-[11px] text-gray-400 mb-5">
            Plan auto-renews for $9.99/month until canceled
          </p>
          <Link
            href="/subscribe"
            className="bg-green text-white text-[15px] font-semibold px-8 py-3 rounded-full hover:brightness-110 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="flex gap-2.5 px-4 mb-7 overflow-x-auto hide-scrollbar">
        {topCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/headlines?categories=${cat.slug}`}
            className="flex items-center gap-2 bg-[#f0f0f0] text-gray-600 text-[13px] font-semibold px-4 py-2.5 rounded-xl whitespace-nowrap flex-shrink-0 hover:bg-[#e5e5e5] transition-all active:scale-95"
          >
            <svg className="w-[16px] h-[16px] text-teal" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" />
            </svg>
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mb-7">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="text-[17px] font-bold text-gray-900">Latest Magazines</h3>
          <Link href="/headlines" className="text-[13px] text-teal font-semibold">See all &gt;</Link>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
          {magazinePosts.map((post) => (
            <Link key={post.id} href={postHref(post)} className="flex-shrink-0 w-[114px] group cursor-pointer block">
              <div className="w-[114px] h-[152px] bg-[#e8e8e8] rounded-xl mb-2 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                <Image
                  src={postImg(post)}
                  alt={post.title}
                  fill
                  sizes="114px"
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 z-10">
                  <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3a2.25 2.25 0 00-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                </div>
              </div>
              <p className="text-[12px] font-semibold text-gray-900 leading-tight mb-0.5 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
              <p className="text-[11px] text-gray-400">{fmtMonthYear(post.date)}</p>
            </Link>
          ))}
        </div>
      </div>

      {featuredPost && (
        <div className="mb-7">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-[17px] font-bold text-gray-900">Top News</h3>
          </div>

          <Link href={postHref(featuredPost)} className="block mx-4 mb-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="w-full h-[200px] bg-[#e8e8e8] relative overflow-hidden">
                <Image
                  src={postImg(featuredPost)}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 512px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="text-[11px] font-semibold text-teal tracking-wide uppercase">{postCat(featuredPost)}</span>
                  <h4 className="text-[17px] font-bold text-white leading-snug mt-0.5" dangerouslySetInnerHTML={{ __html: featuredPost.title }} />
                </div>
              </div>
              <div className="p-4 pt-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(postAuthor(featuredPost))} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-[10px] font-bold">{getInitials(postAuthor(featuredPost))}</span>
                  </div>
                  <span className="text-[12px] font-medium text-gray-700">{postAuthor(featuredPost)}</span>
                  <span className="text-[11px] text-gray-400">· {timeAgo(featuredPost.date)}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                    <span className="text-[11px] text-gray-400 font-medium">{commentCount(featuredPost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div className="px-4 space-y-0">
            {listPosts.map((post, i) => (
              <div key={post.id}>
                <Link href={postHref(post)} className="flex items-start gap-3 py-3 group cursor-pointer">
                  <div className="w-[100px] h-[75px] bg-[#e8e8e8] rounded-xl flex-shrink-0 overflow-hidden relative group-hover:opacity-90 transition-opacity">
                    <Image
                      src={postImg(post)}
                      alt={post.title}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 flex-1" dangerouslySetInnerHTML={{ __html: post.title }} />
                      <span className="flex-shrink-0 mt-0.5 p-1">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">{postAuthor(post)} · {timeAgo(post.date)}</p>
                  </div>
                </Link>
                {i < listPosts.length - 1 && <div className="h-px bg-gray-100" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {topAuthors.length > 0 && (
        <div className="mb-7">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-[17px] font-bold text-gray-900">Popular Authors</h3>
            <Link href="/headlines" className="text-[13px] text-teal font-semibold">See all &gt;</Link>
          </div>
          <div className="flex gap-5 px-4 overflow-x-auto hide-scrollbar">
            {topAuthors.map((author) => (
              <Link key={author.id} href={`/author/${author.slug}`} className="flex items-center gap-3 flex-shrink-0 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#e8e8e8] flex items-center justify-center group-hover:bg-[#ddd] transition-colors flex-shrink-0 overflow-hidden relative">
                  {author.avatar?.url ? (
                    <Image
                      src={author.avatar.url}
                      alt={author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-[9px]">48 x 48</span>
                  )}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-gray-900">{author.name}</p>
                  <p className="text-[11px] text-gray-400">{author.description ? stripHtml(author.description, 30) : 'Author'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {videoPosts.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between px-4 mb-3">
            <h3 className="text-[17px] font-bold text-gray-900">Recent Video</h3>
            <Link href="/headlines" className="text-[13px] text-teal font-semibold">See all &gt;</Link>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar">
            {videoPosts.map((post) => (
              <Link key={post.id} href={postHref(post)} className="flex-shrink-0 w-[256px] group cursor-pointer block">
                <div className="w-[256px] h-[168px] bg-[#e8e8e8] rounded-2xl mb-2 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                  <Image
                    src={postImg(post)}
                    alt={post.title}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5 text-gray-700 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-gray-500 mb-0.5">{postCat(post)}</p>
                <p className="text-[13px] font-semibold text-gray-900 leading-snug mb-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: post.title }} />
                <p className="text-[11px] text-gray-400">{postAuthor(post)} · {timeAgo(post.date)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 lg:hidden">
        <div className="max-w-lg mx-auto flex items-center justify-around pt-2 pb-7">
          <Link href="/" className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <svg className="w-6 h-6 text-[#007AFF]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-[10px] font-semibold text-[#007AFF]">Browse</span>
          </Link>
          <Link href="/headlines" className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-400">Watch</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-[10px] font-medium text-gray-400">Create</span>
          </Link>
          <Link href="/highlights" className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-400">Listen</span>
          </Link>
          <Link href="/account" className="flex flex-col items-center gap-0.5 min-w-[48px]">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <span className="text-[10px] font-medium text-gray-400">Account</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
