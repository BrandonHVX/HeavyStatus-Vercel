import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";

export function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtMonthYear(dateStr?: string): string {
  if (!dateStr) return "";
  const dt = new Date(dateStr);
  return dt.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function commentCount(p?: Post): number {
  if (!p?.id) return 64;
  const n = typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, ""), 10) || 0 : p.id;
  return 30 + (((n * 7 + 13) * 31) % 870);
}

export function stripHtml(html?: string, maxLen = 200): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim().slice(0, maxLen);
}

export function postImg(p?: Post): string {
  return p?.featuredImage?.node?.sourceUrl || "https://placehold.co/800x600/e5e7eb/9ca3af.png";
}

export function postHref(p?: Post): string {
  return p?.slug ? `/${p.slug}` : "#";
}

export function postCat(p?: Post): string {
  return p?.categories?.nodes?.[0]?.name || "News";
}

export function postCatSlug(p?: Post): string {
  return p?.categories?.nodes?.[0]?.slug || "";
}

export function postAuthor(p?: Post): string {
  return p?.author?.node?.name || "Staff";
}

export function postAuthorSlug(p?: Post): string {
  return p?.author?.node?.slug || "";
}

export function AuthorAvatar({ name, size = 28, className = "" }: { name?: string; size?: number; className?: string }) {
  const letter = (name || "S").charAt(0).toUpperCase();
  return (
    <div
      className={`rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold flex-shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {letter}
    </div>
  );
}

export function BookmarkIcon({ className = "w-5 h-5", filled = false }: { className?: string; filled?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  );
}

export function CommentIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
    </svg>
  );
}

export function MoreIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

export function PlayIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="white" fillOpacity={0.85} />
      <path d="M16 13l10 7-10 7V13z" fill="#333" />
    </svg>
  );
}

export function SearchIconSvg({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

export function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold text-gray-900">{title}</h2>
      {href && (
        <Link href={href} className="text-xs text-gray-400 font-medium">
          See all &gt;
        </Link>
      )}
    </div>
  );
}

export function NewsListItem({ post, showImage = true }: { post: Post; showImage?: boolean }) {
  return (
    <Link href={postHref(post)} className="flex items-start gap-3 py-4 group">
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-medium text-gray-500 uppercase mb-1">{postCat(post)}</div>
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-3 mb-2 group-hover:text-gray-700 transition-colors">
          {post.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <span>{postAuthor(post)}</span>
          <span>·</span>
          <span>{timeAgo(post.date)}</span>
          <span>·</span>
          <CommentIcon className="w-3.5 h-3.5" />
          <span>{commentCount(post)}</span>
          <div className="flex-1" />
          <BookmarkIcon className="w-4 h-4 text-gray-300" />
          <MoreIcon className="w-4 h-4 text-gray-300" />
        </div>
      </div>
      {showImage && (
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <Image src={postImg(post)} alt="" fill className="object-cover" sizes="80px" />
        </div>
      )}
    </Link>
  );
}

export function MagazineCard({ post }: { post: Post }) {
  return (
    <Link href={postHref(post)} className="flex-shrink-0 w-[114px] group">
      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
        <Image src={postImg(post)} alt="" fill className="object-cover" sizes="114px" />
        <div className="absolute top-2 right-2">
          <BookmarkIcon className="w-4 h-4 text-white drop-shadow" />
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
        {post.title}
      </p>
      <p className="text-[11px] text-gray-400">{fmtMonthYear(post.date)}</p>
    </Link>
  );
}
