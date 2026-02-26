'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  timeAgo,
  commentCount,
  postImg,
  postHref,
  postCat,
  postAuthor,
  fmtMonthYear,
  AuthorAvatar,
  BookmarkIcon,
  CommentIcon,
  MoreIcon,
  SectionHeader,
  NewsListItem,
  MagazineCard,
  SearchIconSvg,
} from '@/lib/nuws-helpers';

interface SearchPost {
  id: string;
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
  author?: {
    node: {
      name: string;
      slug: string;
    };
  };
  categories?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

interface SearchCategory {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface SearchTag {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface SearchResults {
  posts: SearchPost[];
  categories: SearchCategory[];
  tags: SearchTag[];
}

interface TopicsData {
  categories: SearchCategory[];
  tags: SearchTag[];
}

interface ChannelAuthor {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: { url: string } | null;
}

const TOPIC_COLORS = [
  'bg-green-100 text-green-700',
  'bg-red-100 text-red-700',
  'bg-gray-100 text-gray-700',
  'bg-blue-100 text-blue-700',
];

const CATEGORY_TABS = ['Today', 'International', 'Business', 'Sports', 'Fashion', 'Tech'];

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], categories: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [topics, setTopics] = useState<TopicsData>({ categories: [], tags: [] });
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const [channels, setChannels] = useState<ChannelAuthor[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const listboxId = 'explore-search-listbox';

  const totalResults = results.posts.length + results.categories.length + results.tags.length;

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch('/api/topics');
        const data = await response.json();
        setTopics({
          categories: data.categories || [],
          tags: data.tags || []
        });
      } catch (error) {
        console.error('Failed to fetch topics:', error);
      } finally {
        setTopicsLoading(false);
      }
    }
    fetchTopics();
  }, []);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const response = await fetch('/api/search?q=');
        const data = await response.json();
        setRecentPosts(data.posts || []);
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
      } finally {
        setPostsLoading(false);
      }
    }
    fetchRecentPosts();
  }, []);

  const fetchResults = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setResults({ posts: [], categories: [], tags: [] });
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchResults(searchTerm);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, fetchResults]);

  const navigateToSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/headlines?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToSearch();
  };

  const getAllItems = () => [
    ...results.posts.map((p) => ({ type: 'post' as const, slug: p.slug, id: p.id })),
    ...results.categories.map((c) => ({ type: 'category' as const, slug: c.slug, id: c.id })),
    ...results.tags.map((t) => ({ type: 'tag' as const, slug: t.slug, id: t.id })),
  ];

  const getActiveDescendant = () => {
    if (selectedIndex < 0) return undefined;
    const items = getAllItems();
    const selected = items[selectedIndex];
    if (!selected) return undefined;
    return `explore-search-option-${selected.type}-${selected.id}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || totalResults === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalResults - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalResults - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const allItems = getAllItems();
      const selected = allItems[selectedIndex];
      if (selected) {
        if (selected.type === 'post') {
          router.push(`/${selected.slug}`);
        } else if (selected.type === 'category') {
          router.push(`/headlines?categories=${selected.slug}`);
        } else {
          router.push(`/headlines?search=${selected.slug}`);
        }
      }
    }
  };

  const featuredPost = recentPosts[0] as any;
  const topNewsPosts = recentPosts.slice(1, 5);
  const magazinePosts = recentPosts.slice(5, 9);

  let itemIndex = -1;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-4 pb-24">

        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900">Nuws</h1>
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
            U
          </div>
        </div>

        <div className="relative mb-5">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3 gap-3">
              <SearchIconSvg className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search for everything..."
                className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                aria-label="Search"
                aria-expanded={isOpen && totalResults > 0}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={getActiveDescendant()}
                role="combobox"
              />
              {isLoading && (
                <svg className="w-5 h-5 text-gray-400 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>
          </form>

          {isOpen && totalResults > 0 && (
            <div
              id={listboxId}
              className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 max-h-80 overflow-y-auto z-50"
              role="listbox"
              aria-label="Search results"
            >
              {results.posts.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                    Articles
                  </div>
                  {results.posts.map((post) => {
                    itemIndex++;
                    const currentIndex = itemIndex;
                    const optionId = `explore-search-option-post-${post.id}`;
                    return (
                      <Link
                        key={post.id}
                        id={optionId}
                        href={`/${post.slug}`}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedIndex === currentIndex ? 'bg-gray-100' : ''
                        }`}
                        role="option"
                        aria-selected={selectedIndex === currentIndex}
                      >
                        {post.featuredImage?.node?.sourceUrl && (
                          <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        )}
                        <span
                          className="text-sm font-medium line-clamp-2 text-gray-900"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                      </Link>
                    );
                  })}
                </div>
              )}

              {results.categories.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-t border-gray-100">
                    Categories
                  </div>
                  {results.categories.map((category) => {
                    itemIndex++;
                    const currentIndex = itemIndex;
                    const optionId = `explore-search-option-category-${category.id}`;
                    return (
                      <Link
                        key={category.id}
                        id={optionId}
                        href={`/headlines?categories=${category.slug}`}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedIndex === currentIndex ? 'bg-gray-100' : ''
                        }`}
                        role="option"
                        aria-selected={selectedIndex === currentIndex}
                      >
                        <span className="text-sm text-gray-900">{category.name}</span>
                        {category.count !== undefined && (
                          <span className="text-xs text-gray-400">{category.count} posts</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}

              {results.tags.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 font-bold border-t border-gray-100">
                    Tags
                  </div>
                  {results.tags.map((tag) => {
                    itemIndex++;
                    const currentIndex = itemIndex;
                    const optionId = `explore-search-option-tag-${tag.id}`;
                    return (
                      <Link
                        key={tag.id}
                        id={optionId}
                        href={`/headlines?search=${tag.slug}`}
                        className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                          selectedIndex === currentIndex ? 'bg-gray-100' : ''
                        }`}
                        role="option"
                        aria-selected={selectedIndex === currentIndex}
                      >
                        <span className="text-sm text-gray-900">#{tag.name}</span>
                        {tag.count !== undefined && (
                          <span className="text-xs text-gray-400">{tag.count} posts</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}

              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <button
                  type="button"
                  onClick={navigateToSearch}
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Press Enter to search all results for &quot;{searchTerm}&quot;
                </button>
              </div>
            </div>
          )}

          {isOpen && searchTerm.length >= 2 && totalResults === 0 && !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 px-4 py-8 text-center z-50">
              <p className="text-sm text-gray-500">No results found for &quot;{searchTerm}&quot;</p>
            </div>
          )}
        </div>

        <div className="flex gap-1 overflow-x-auto mb-6 -mx-4 px-4 scrollbar-hide">
          {(topics.categories.length > 0
            ? topics.categories.slice(0, 8).map(c => c.name)
            : CATEGORY_TABS
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 text-sm font-medium px-3 py-1.5 whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'font-semibold text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {!postsLoading && featuredPost && (
          <section className="mb-6">
            <Link href={`/${featuredPost.slug}`} className="block group">
              <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                {featuredPost.featuredImage?.node?.sourceUrl && (
                  <Image
                    src={featuredPost.featuredImage.node.sourceUrl}
                    alt={featuredPost.title || ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 512px) 100vw, 512px"
                  />
                )}
                <div className="absolute top-3 right-3">
                  <BookmarkIcon className="w-5 h-5 text-white drop-shadow" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-medium text-gray-500 uppercase mb-1">
                  {featuredPost.categories?.nodes?.[0]?.name || 'News'}
                </p>
                <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-gray-700 transition-colors">
                  {featuredPost.title}
                </h3>
                <div className="flex items-center gap-2">
                  <AuthorAvatar name={featuredPost.author?.node?.name} size={28} />
                  <span className="text-xs font-medium text-gray-700">{featuredPost.author?.node?.name || 'Staff'}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{timeAgo(featuredPost.date)}</span>
                  <span className="text-xs text-gray-400">·</span>
                  <CommentIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">{commentCount(featuredPost)}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        <section className="mb-6">
          <SectionHeader title="Topics" href="/headlines" />
          {topicsLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {topics.categories.slice(0, 4).map((category, i) => (
                <Link
                  key={category.id}
                  href={`/headlines?categories=${category.slug}`}
                  className={`rounded-xl px-4 py-3 ${TOPIC_COLORS[i % TOPIC_COLORS.length]} transition-opacity hover:opacity-80`}
                >
                  <span className="text-sm font-semibold">{category.name}</span>
                  {category.count !== undefined && (
                    <p className="text-xs opacity-70 mt-0.5">{category.count} posts</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {topNewsPosts.length > 0 && (
          <section className="mb-6">
            <SectionHeader title="Top News" href="/headlines" />
            <div className="divide-y divide-gray-100">
              {topNewsPosts.map((post: any) => (
                <NewsListItem key={post.id || post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {magazinePosts.length > 0 && (
          <section className="mb-6">
            <SectionHeader title="Latest Magazines" href="/headlines" />
            <div className="flex overflow-x-auto gap-4 -mx-4 px-4 scrollbar-hide">
              {magazinePosts.map((post: any) => (
                <MagazineCard key={post.id || post.slug} post={post} />
              ))}
            </div>
          </section>
        )}

        {topics.categories.length > 0 && (
          <section className="mb-6">
            <SectionHeader title="Top Channels" href="/headlines" />
            <div className="space-y-4">
              {topics.categories.slice(0, 5).map((cat, i) => (
                <div key={cat.id} className="flex items-center gap-3">
                  <div className="w-[52px] h-[52px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg flex-shrink-0">
                    {cat.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{cat.name}</p>
                    <p className="text-xs text-gray-400">Contributor</p>
                  </div>
                  {i === 0 ? (
                    <Link
                      href={`/headlines?categories=${cat.slug}`}
                      className="px-5 py-1.5 rounded-full bg-blue-500 text-white text-xs font-semibold flex-shrink-0"
                    >
                      Follow
                    </Link>
                  ) : (
                    <Link
                      href={`/headlines?categories=${cat.slug}`}
                      className="px-5 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold flex-shrink-0"
                    >
                      Following
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
