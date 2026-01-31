'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
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

export function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], categories: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const listboxId = 'search-listbox';

  const totalResults = results.posts.length + results.categories.length + results.tags.length;

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateToSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/headlines?search=${encodeURIComponent(searchTerm)}`);
      setIsOpen(false);
      setSearchTerm('');
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
    return `search-option-${selected.type}-${selected.id}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || totalResults === 0) {
      if (e.key === 'Enter') {
        return;
      }
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
          router.push(`/headlines/${selected.slug}`);
        } else if (selected.type === 'category') {
          router.push(`/headlines?categories=${selected.slug}`);
        } else {
          router.push(`/headlines?search=${selected.slug}`);
        }
        setIsOpen(false);
        setSearchTerm('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  let itemIndex = -1;

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-black transition-colors bg-transparent w-full md:w-64 text-sm"
          aria-label="Search posts, categories, and tags"
          aria-expanded={isOpen && totalResults > 0}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={getActiveDescendant()}
          role="combobox"
        />
        <button
          type="submit"
          className="p-2 text-gray-600 hover:text-black transition-colors"
          aria-label="Search"
        >
          {isLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {isOpen && totalResults > 0 && (
        <div
          id={listboxId}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
        >
          {results.posts.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold">
                Articles
              </div>
              {results.posts.map((post) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-post-${post.id}`;
                return (
                  <Link
                    key={post.id}
                    id={optionId}
                    href={`/headlines/${post.slug}`}
                    onClick={handleResultClick}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedIndex === currentIndex ? 'bg-gray-100' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    {post.featuredImage?.node?.sourceUrl && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <span
                      className="text-sm font-serif line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                  </Link>
                );
              })}
            </div>
          )}

          {results.categories.length > 0 && (
            <div>
              <div className="px-4 py-2 bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold border-t border-gray-100">
                Categories
              </div>
              {results.categories.map((category) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-category-${category.id}`;
                return (
                  <Link
                    key={category.id}
                    id={optionId}
                    href={`/headlines?categories=${category.slug}`}
                    onClick={handleResultClick}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedIndex === currentIndex ? 'bg-gray-100' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    <span className="text-sm">{category.name}</span>
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
              <div className="px-4 py-2 bg-gray-50 text-xs uppercase tracking-widest text-gray-500 font-semibold border-t border-gray-100">
                Tags
              </div>
              {results.tags.map((tag) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-tag-${tag.id}`;
                return (
                  <Link
                    key={tag.id}
                    id={optionId}
                    href={`/headlines?search=${tag.slug}`}
                    onClick={handleResultClick}
                    className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedIndex === currentIndex ? 'bg-gray-100' : ''
                    }`}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    <span className="text-sm">#{tag.name}</span>
                    {tag.count !== undefined && (
                      <span className="text-xs text-gray-400">{tag.count} posts</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 px-4 py-6 text-center">
          <p className="text-sm text-gray-500">No results found for &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}
