'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface SearchPost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
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

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], categories: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [topics, setTopics] = useState<TopicsData>({ categories: [], tags: [] });
  const [topicsLoading, setTopicsLoading] = useState(true);
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

  let itemIndex = -1;

  return (
    <div className="min-h-screen bg-[#e6f4f1]">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-center mb-8 text-[#0b0b0b]">
          Explore
        </h1>

        <div className="relative mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center border-b border-gray-200 px-4">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <form onSubmit={handleSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles, categories, tags..."
                  className="w-full px-4 py-4 text-base text-gray-900 placeholder-gray-400 focus:outline-none"
                  aria-label="Search"
                  aria-expanded={isOpen && totalResults > 0}
                  aria-autocomplete="list"
                  aria-controls={listboxId}
                  aria-activedescendant={getActiveDescendant()}
                  role="combobox"
                />
              </form>
              {isLoading && (
                <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
            </div>

            {isOpen && totalResults > 0 && (
              <div
                id={listboxId}
                className="max-h-80 overflow-y-auto"
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
                            className="text-sm font-serif line-clamp-2 text-gray-900"
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
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No results found for &quot;{searchTerm}&quot;</p>
              </div>
            )}
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-sm font-sans font-extrabold uppercase tracking-[0.2em] text-[#0b0b0b] mb-6">
            Popular Categories
          </h2>
          {topicsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 bg-white/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {topics.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/headlines?categories=${category.slug}`}
                  className="flex items-center justify-between px-4 py-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-serif font-bold text-[#0b0b0b]">{category.name}</span>
                  {category.count !== undefined && (
                    <span className="text-xs text-gray-400">{category.count}</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>

        {topics.tags.length > 0 && (
          <section>
            <h2 className="text-sm font-sans font-extrabold uppercase tracking-[0.2em] text-[#0b0b0b] mb-6">
              Popular Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {topics.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/headlines?search=${tag.slug}`}
                  className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  #{tag.name}
                  {tag.count !== undefined && (
                    <span className="ml-1 text-xs text-gray-400">({tag.count})</span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
