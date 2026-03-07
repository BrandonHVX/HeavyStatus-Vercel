import Link from "next/link";
import Image from "next/image";
import { getAllPosts, getCategories, getAllAuthors } from "@/lib/queries";
import { timeAgo, fmtMonthYear, commentCount, stripHtml, postImg, postHref, postCat, postAuthor } from "@/lib/nuws-helpers";

export const revalidate = 60;

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const avatarColors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500',
  'bg-amber-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-pink-500',
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
  const topAuthors = authors.slice(0, 5);
  const topCategories = categories.slice(0, 6);

  return (
    <div className="bg-white min-h-screen max-w-[430px] mx-auto relative pb-20">

      {/* Scrollable content */}
      <div className="scrollbar-hide">

        {/* Hero banner */}
        <div className="mx-4 mb-5 rounded-[20px] overflow-hidden relative">
          <div className="w-full h-[280px] bg-gray-200 relative">
            {magazinePosts[0] && (
              <Image
                src={postImg(magazinePosts[0])}
                alt="Hero"
                fill
                sizes="(max-width: 430px) 100vw, 400px"
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.97))' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-6">
            <p className="text-[22px] font-black text-gray-900 text-center mb-1">Nuws</p>
            <p className="text-[15px] font-bold text-gray-900 text-center leading-snug mb-1 max-w-[260px]">
              Millions of the latest magazines and news. One subscription
            </p>
            <p className="text-[12px] text-gray-400 text-center mb-4">
              Plan auto-renews for $9.99/month until canceled
            </p>
            <Link
              href="/subscribe"
              className="bg-blue-500 text-white text-[15px] font-semibold px-10 py-2.5 rounded-full shadow-[0_4px_12px_rgba(59,130,246,0.4)] hover:bg-blue-600 active:scale-95 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 px-4 pb-5 overflow-x-auto scrollbar-hide">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] border-gray-300 bg-white text-gray-700 shadow-sm flex-shrink-0"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            Categories
          </Link>
          <Link
            href="/featured"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] border-gray-200 bg-white text-gray-400 flex-shrink-0"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            Featured
          </Link>
          <Link
            href="/live"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] border-gray-200 bg-white text-gray-400 flex-shrink-0"
          >
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c0 0-5 4-5 10a5 5 0 0 0 10 0c0-2.5-1.5-5-2-6.5C14.5 7 14 9 12 10c0 0 1-4-1-8z"/></svg>
            Hot
          </Link>
          {topCategories.slice(0, 3).map((cat) => (
            <Link
              key={cat.id}
              href={`/?categories=${cat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium border-[1.5px] border-gray-200 bg-white text-gray-400 flex-shrink-0"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Latest Magazines */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-gray-900">Latest Magazines</h2>
            <Link href="/featured" className="text-[13px] text-gray-400">See all ›</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {magazinePosts.map((post) => (
              <Link key={post.id} href={postHref(post)} className="flex-shrink-0 w-[114px] block group">
                <div className="relative">
                  <div className="w-[114px] h-[152px] bg-gray-200 rounded-xl overflow-hidden relative">
                    <Image
                      src={postImg(post)}
                      alt={post.title}
                      fill
                      sizes="114px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm flex">
                    <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </div>
                </div>
                <p className="mt-2 text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                <p className="text-[11px] text-gray-400 mt-0.5">{fmtMonthYear(post.date)}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Top News */}
        <div className="px-5 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[17px] font-bold text-gray-900">Top News</h2>
            <Link href="/featured" className="text-[13px] text-gray-400">See all ›</Link>
          </div>

          {/* Hero card */}
          {featuredPost && (
            <Link href={postHref(featuredPost)} className="block relative rounded-2xl overflow-hidden mb-3">
              <div className="w-full h-[220px] bg-gray-200 relative">
                <Image
                  src={postImg(featuredPost)}
                  alt={featuredPost.title}
                  fill
                  sizes="(max-width: 430px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 flex">
                <svg width="14" height="14" fill="none" stroke="#d1d5db" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[11px] font-semibold text-blue-300 block mb-1">{postCat(featuredPost)}</span>
                <h3 className="text-[16px] font-bold text-white leading-snug mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: featuredPost.title }} />
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${getAvatarColor(postAuthor(featuredPost))} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-[8px] font-bold">{getInitials(postAuthor(featuredPost))}</span>
                  </div>
                  <span className="text-[12px] text-gray-300 font-medium">{postAuthor(featuredPost)}</span>
                  <span className="text-[11px] text-gray-500">· {timeAgo(featuredPost.date)}</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
                    </svg>
                    <span className="text-[11px] text-gray-500 font-medium">{commentCount(featuredPost)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* List items */}
          {listPosts.map((post, i) => (
            <div key={post.id}>
              <Link href={postHref(post)} className="flex items-start gap-3 py-3 group">
                <div className="w-[80px] h-[80px] bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden relative">
                  <Image
                    src={postImg(post)}
                    alt={post.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <span className="text-[11px] font-semibold text-blue-500 block mb-1">{postCat(post)}</span>
                  <h4 className="text-[14px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5" dangerouslySetInnerHTML={{ __html: post.title }} />
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full ${getAvatarColor(postAuthor(post))} flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-[7px] font-bold">{getInitials(postAuthor(post))}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">{postAuthor(post)} · {timeAgo(post.date)}</span>
                  </div>
                </div>
              </Link>
              {i < listPosts.length - 1 && <div className="h-px bg-gray-100" />}
            </div>
          ))}
        </div>

        {/* Popular Authors */}
        {topAuthors.length > 0 && (
          <div className="px-5 pb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[17px] font-bold text-gray-900">Popular Authors</h2>
              <Link href="/featured" className="text-[13px] text-gray-400">See all ›</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-1">
              {topAuthors.map((author) => (
                <Link key={author.id} href={`/author/${author.slug}`} className="flex items-center gap-3 flex-shrink-0 group">
                  <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center flex-shrink-0">
                    {author.avatar?.url ? (
                      <Image
                        src={author.avatar.url}
                        alt={author.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${getAvatarColor(author.name)} flex items-center justify-center`}>
                        <span className="text-white text-[12px] font-bold">{getInitials(author.name)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{author.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{author.description ? stripHtml(author.description, 25) : 'Author'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
