// app/page.tsx
import Link from "next/link";
import { getCategories, getAllPosts } from "@/lib/queries";

type WPPost = any;
type WPCategory = any;

function stripHtml(input?: string) {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostTitle(p?: WPPost) {
  return p?.title ?? "Untitled";
}

function getPostExcerpt(p?: WPPost) {
  const raw = p?.excerpt ?? p?.content ?? "";
  const clean = stripHtml(raw);
  return clean.length > 170 ? clean.slice(0, 167) + "…" : clean;
}

function getPostAuthor(p?: WPPost) {
  return p?.author?.node?.name || p?.author?.name || p?.authorName || "Staff";
}

function getPostHref(p?: WPPost) {
  // Prefer WPGraphQL "uri" if your routes support it.
  // Otherwise it falls back to "/{slug}".
  return p?.uri || (p?.slug ? `/${p.slug}` : "#");
}

function getPostImage(p?: WPPost) {
  // WPGraphQL typical: featuredImage.node.sourceUrl
  return (
    p?.featuredImage?.node?.sourceUrl ||
    p?.featuredImage?.sourceUrl ||
    p?.image ||
    "https://placehold.co/1200x700/png?text=IMAGE"
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const categoriesData = await getCategories();
  const { posts } = await getAllPosts();

  const cats: WPCategory[] =
    categoriesData?.categories?.nodes ||
    categoriesData?.nodes ||
    categoriesData ||
    [];

  const safePosts: WPPost[] = Array.isArray(posts) ? posts : [];

  const featuredPost = safePosts[0];
  const topStories = safePosts.slice(1, 5); // [1..4]
  const latestPosts = safePosts.slice(5, 12); // [5..11]
  const popularPosts = safePosts.slice(0, 4);

  // Slot mapping (avoid duplicates as much as possible)
  const leftTopPost = topStories[0];
  const leftMidPost = topStories[1];
  const leftBottomPost = topStories[2];

  const midRows = latestPosts.slice(0, 2); // two rows beneath hero
  const latestList = latestPosts.slice(2, 7); // 5 items in right "Latest Stories"

  const rightFeaturePost =
    topStories[3] || popularPosts[1] || latestPosts[0] || safePosts[0];

  const Tag = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-2 font-sans text-[9px] font-extrabold uppercase tracking-[0.22em] text-[#cf1717]">
      {children}
    </div>
  );

  const By = ({ children }: { children: React.ReactNode }) => (
    <div className="mt-[10px] font-sans text-[9px] font-extrabold tracking-[0.18em] text-[rgba(0,0,0,0.60)]">
      {children}
    </div>
  );

  const Divider = ({ soft }: { soft?: boolean }) => (
    <div
      className={[
        "h-px w-full",
        soft ? "mt-[18px] bg-[rgba(0,0,0,0.12)]" : "my-4 bg-[rgba(0,0,0,0.16)]",
      ].join(" ")}
    />
  );

  const TopNavCats =
    cats?.length > 0
      ? cats.slice(0, 5).map((c: any) => ({
          name: (c?.name ?? "").toUpperCase(),
          href: c?.uri || (c?.slug ? `/category/${c.slug}` : "#"),
        }))
      : [
          { name: "POLITICS", href: "#" },
          { name: "HOLLYWOOD", href: "#" },
          { name: "ROYALS", href: "#" },
          { name: "STYLE", href: "#" },
          { name: "CULTURE", href: "#" },
        ];

  // Simple empty-state (no sample “content”, just structure)
  if (!featuredPost) {
    return (
      <div className="min-h-screen bg-[#e6f4f1] text-[#0b0b0b]">
        <header className="grid h-[58px] grid-cols-[180px_1fr_220px] items-center bg-[#050505] px-[18px] text-white max-[980px]:grid-cols-[140px_1fr_180px]">
          <div className="justify-self-start rounded-[2px] bg-[#cf1717] px-3 py-[7px] text-[11px] font-bold tracking-[0.14em]">
            SUBSCRIBE
          </div>
          <div className="justify-self-center font-serif text-[20px] font-extrabold tracking-[0.12em]">
            VANITY FAIR
          </div>
          <div className="justify-self-end text-[11px] font-bold tracking-[0.14em] text-white/80">
            MENU ≡
          </div>
        </header>

        <div className="mx-auto mt-10 w-[min(1120px,calc(100%-40px))] rounded-md border border-black/10 bg-white/40 p-6 font-sans text-sm">
          No posts returned from WordPress yet. Once `getAllPosts()` returns
          posts, this layout will populate automatically.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6f4f1] text-[#0b0b0b]">
      {/* Top black bar */}

      {/* Thin rule */}
      <div className="mx-auto h-px w-[min(1120px,calc(100%-40px))] bg-[rgba(0,0,0,0.65)]" />

      {/* Content */}
      <main className="py-[22px] pb-[60px]">
        <div className="mx-auto grid w-[min(1120px,calc(100%-40px))] grid-cols-[270px_1fr_320px] gap-[34px] max-[980px]:grid-cols-1 max-[980px]:gap-[22px]">
          {/* Left column */}
          <aside>
            {leftTopPost && (
              <article>
                <Link href={getPostHref(leftTopPost)}>
                  <img
                    className="block h-auto w-full"
                    src={getPostImage(leftTopPost)}
                    alt=""
                    loading="lazy"
                  />
                </Link>
                <div className="pt-[14px]">
                  <Tag>
                    {(
                      leftTopPost?.categories?.nodes?.[0]?.name || "TOP STORY"
                    ).toString()}
                  </Tag>
                  <h3 className="font-serif text-[18px] font-extrabold leading-[1.15]">
                    <Link
                      href={getPostHref(leftTopPost)}
                      className="hover:underline"
                    >
                      {getPostTitle(leftTopPost)}
                    </Link>
                  </h3>
                  <By>
                    BY {getPostAuthor(leftTopPost).toUpperCase()}
                    {leftTopPost?.date
                      ? ` • ${formatDate(leftTopPost.date)}`
                      : ""}
                  </By>
                </div>
              </article>
            )}

            <Divider />

            {leftMidPost && (
              <>
                <Link href={getPostHref(leftMidPost)}>
                  <img
                    className="block h-auto w-full"
                    src={getPostImage(leftMidPost)}
                    alt=""
                    loading="lazy"
                  />
                </Link>

                <article>
                  <div className="pt-[10px]">
                    <Tag>
                      {(
                        leftMidPost?.categories?.nodes?.[0]?.name || "FEATURE"
                      ).toString()}
                    </Tag>
                    <h3 className="font-serif text-[16px] font-extrabold leading-[1.15]">
                      <Link
                        href={getPostHref(leftMidPost)}
                        className="hover:underline"
                      >
                        {getPostTitle(leftMidPost)}
                      </Link>
                    </h3>
                    <By>
                      BY {getPostAuthor(leftMidPost).toUpperCase()}
                      {leftMidPost?.date
                        ? ` • ${formatDate(leftMidPost.date)}`
                        : ""}
                    </By>
                  </div>
                </article>
              </>
            )}

            <Divider />

            {leftBottomPost && (
              <article>
                <Link href={getPostHref(leftBottomPost)}>
                  <img
                    className="block h-auto w-full"
                    src={getPostImage(leftBottomPost)}
                    alt=""
                    loading="lazy"
                  />
                </Link>
                <div className="pt-[14px]">
                  <Tag>
                    {(
                      leftBottomPost?.categories?.nodes?.[0]?.name ||
                      "RECOMMENDED"
                    ).toString()}
                  </Tag>
                  <h3 className="font-serif text-[18px] font-extrabold leading-[1.15]">
                    <Link
                      href={getPostHref(leftBottomPost)}
                      className="hover:underline"
                    >
                      {getPostTitle(leftBottomPost)}
                    </Link>
                  </h3>
                  <By>
                    BY {getPostAuthor(leftBottomPost).toUpperCase()}
                    {leftBottomPost?.date
                      ? ` • ${formatDate(leftBottomPost.date)}`
                      : ""}
                  </By>
                </div>
              </article>
            )}
          </aside>

          {/* Middle column */}
          <section>
            <article>
              <Link href={getPostHref(featuredPost)}>
                <img
                  className="block h-[320px] w-full object-cover max-[980px]:h-[260px]"
                  src={getPostImage(featuredPost)}
                  alt=""
                />
              </Link>
              <div className="pt-[14px]">
                <Tag>
                  {(
                    featuredPost?.categories?.nodes?.[0]?.name || "FEATURED"
                  ).toString()}
                </Tag>
                <h1 className="font-serif text-[34px] font-extrabold leading-[1.06] tracking-[-0.01em]">
                  <Link
                    href={getPostHref(featuredPost)}
                    className="hover:underline"
                  >
                    {getPostTitle(featuredPost)}
                  </Link>
                </h1>
                <p className="mt-[10px] font-sans text-[12px] leading-[1.5] text-[rgba(0,0,0,0.78)]">
                  {getPostExcerpt(featuredPost)}
                </p>
                <By>
                  BY {getPostAuthor(featuredPost).toUpperCase()}
                  {featuredPost?.date
                    ? ` • ${formatDate(featuredPost.date)}`
                    : ""}
                </By>
              </div>
            </article>

            <div className="my-[18px] h-px w-full bg-[rgba(0,0,0,0.16)]" />

            {midRows.map((p) => (
              <article
                key={p?.id || p?.slug || getPostTitle(p)}
                className="grid grid-cols-[1fr_200px] items-start gap-[18px] py-2 max-[980px]:grid-cols-1"
              >
                <div>
                  <Tag>
                    {(p?.categories?.nodes?.[0]?.name || "STORY").toString()}
                  </Tag>
                  <h3 className="font-serif text-[18px] font-extrabold leading-[1.15]">
                    <Link href={getPostHref(p)} className="hover:underline">
                      {getPostTitle(p)}
                    </Link>
                  </h3>
                  <p className="mt-2 font-sans text-[11px] leading-[1.5] text-[rgba(0,0,0,0.78)]">
                    {getPostExcerpt(p)}
                  </p>
                  <By>
                    BY {getPostAuthor(p).toUpperCase()}
                    {p?.date ? ` • ${formatDate(p.date)}` : ""}
                  </By>
                </div>

                <Link
                  href={getPostHref(p)}
                  className="block max-[980px]:order-first"
                >
                  <img
                    className="block h-[118px] w-[200px] justify-self-end bg-[#d7e9e6] object-cover max-[980px]:h-[180px] max-[980px]:w-full"
                    src={getPostImage(p)}
                    alt=""
                    loading="lazy"
                  />
                </Link>
              </article>
            ))}

            <div className="my-[18px] h-px w-full bg-[rgba(0,0,0,0.16)]" />
          </section>

          {/* Right column */}
          <aside>
            <div className="mb-[10px] font-sans text-[14px] font-black uppercase tracking-[0.28em]">
              LATEST STORIES
            </div>

            <div className="border-t border-[rgba(0,0,0,0.16)]">
              {latestList.map((p) => (
                <article
                  key={p?.id || p?.slug || getPostTitle(p)}
                  className="grid grid-cols-[1fr_52px] items-start gap-3 border-b border-[rgba(0,0,0,0.16)] py-[14px]"
                >
                  <div>
                    <Tag>
                      {(p?.categories?.nodes?.[0]?.name || "LATEST").toString()}
                    </Tag>
                    <div className="font-serif text-[14px] font-extrabold leading-[1.15]">
                      <Link href={getPostHref(p)} className="hover:underline">
                        {getPostTitle(p)}
                      </Link>
                    </div>
                    <By>BY {getPostAuthor(p).toUpperCase()}</By>
                  </div>

                  <Link href={getPostHref(p)} className="block">
                    <img
                      className="block h-[52px] w-[52px] bg-[#d7e9e6] object-cover"
                      src={getPostImage(p)}
                      alt=""
                      loading="lazy"
                    />
                  </Link>
                </article>
              ))}
            </div>

            <Divider />

            {rightFeaturePost && (
              <article>
                <Tag>
                  {(
                    rightFeaturePost?.categories?.nodes?.[0]?.name || "FEATURE"
                  ).toString()}
                </Tag>

                <Link href={getPostHref(rightFeaturePost)} className="block">
                  <img
                    className="my-2 block h-[160px] w-full bg-[#d7e9e6] object-cover"
                    src={getPostImage(rightFeaturePost)}
                    alt=""
                  />
                </Link>

                <h3 className="font-serif text-[18px] font-extrabold leading-[1.15]">
                  <Link
                    href={getPostHref(rightFeaturePost)}
                    className="hover:underline"
                  >
                    {getPostTitle(rightFeaturePost)}
                  </Link>
                </h3>

                <p className="mt-2 font-sans text-[11px] leading-[1.5] text-[rgba(0,0,0,0.78)]">
                  {getPostExcerpt(rightFeaturePost)}
                </p>

                <Divider soft />
              </article>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
