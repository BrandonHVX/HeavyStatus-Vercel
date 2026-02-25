import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";

export function title(p?: Post) { return p?.title ?? "Untitled"; }
export function postHref(p?: Post) { return p?.slug ? `/${p.slug}` : "#"; }
export function postImg(p?: Post) { return p?.featuredImage?.node?.sourceUrl || "https://placehold.co/800x600.png"; }
export function postCat(p?: Post) { return p?.categories?.nodes?.[0]?.name || "News"; }
export function postAuthor(p?: Post) { return p?.author?.node?.name || "Staff"; }
export function readMin(p?: Post) { return Math.max(1, Math.ceil((p?.content?.split(/\s+/).length || 0) / 200)); }
export function excerpt(p?: Post, len = 100) { return (p?.excerpt || p?.content || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, len); }
export function fmtDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " +
    dt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
}

export function SmallMeta({ text }: { text: string }) {
  return <div className="mt-2 text-[10px] tracking-wide text-[#9c9c9c]">{text}</div>;
}

export function StatPill({ views, likes }: { views: number; likes: number }) {
  return (
    <div className="flex items-center gap-3 text-[10px] text-[#a8a8a8]">
      <span className="inline-flex items-center gap-1">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.7">
          <path d="M12 5c-5.5 0-9.5 5.2-10 6 .5.8 4.5 6 10 6s9.5-5.2 10-6c-.5-.8-4.5-6-10-6Z" />
          <circle cx="12" cy="11" r="2.3" />
        </svg>
        {views}
      </span>
      <span className="inline-flex items-center gap-1">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current text-[#c7c7c7]">
          <path d="M12 21s-6.7-4.35-9.43-8.07C.77 10.45 1.18 6.8 4.2 4.74c2.18-1.48 5.02-1.05 6.8 1.03 1.78-2.08 4.62-2.5 6.8-1.03 3.02 2.06 3.43 5.71 1.63 8.19C18.7 16.65 12 21 12 21Z" />
        </svg>
        {likes}
      </span>
    </div>
  );
}

export function SCard({ sectionTitle, children, className = "" }: { sectionTitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[8px] border border-[#e7e7e7] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${className}`}>
      {sectionTitle && (
        <div className="border-b border-[#efefef] px-5 py-4">
          <h3 className="text-[13px] font-semibold tracking-[0.01em] text-[#343434]">{sectionTitle}</h3>
        </div>
      )}
      {children}
    </section>
  );
}

export function SidebarList({ listTitle, items }: { listTitle: string; items: Post[] }) {
  return (
    <SCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#efefef] px-4 py-3">
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b3b3b3]">{listTitle}</h4>
        <Link href="/headlines" className="text-[10px] font-medium text-[#9a9a9a] hover:text-[#666] transition-colors">View All</Link>
      </div>
      <div className="px-4 py-2">
        {items.map((p, idx) => (
          <div key={p.id || idx}>
            <Link href={postHref(p)} className="flex items-start gap-3 py-3 group">
              <div className="relative h-10 w-10 rounded-full overflow-hidden ring-1 ring-[#ececec] flex-shrink-0">
                <Image src={postImg(p)} alt="" fill className="object-cover" sizes="40px" />
              </div>
              <div className="min-w-0">
                <div className="mb-1 text-[10px] text-[#a1a1a1]">{fmtDate(p.date)}, {readMin(p)} min</div>
                <p className="text-[11px] font-medium leading-[1.25] text-[#434343] group-hover:text-[#222] transition-colors line-clamp-2">{title(p)}</p>
              </div>
            </Link>
            {idx !== items.length - 1 && <div className="border-t border-[#f1f1f1]" />}
          </div>
        ))}
      </div>
    </SCard>
  );
}
