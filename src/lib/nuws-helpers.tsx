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
