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
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
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
          router.push(`/${selected.slug}`);
        } else if (selected.type === 'category') {
          router.push(`/?categories=${selected.slug}`);
        } else {
          router.push(`/?search=${selected.slug}`);
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
    <div ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          aria-label="Search posts, categories, and tags"
          aria-expanded={isOpen && totalResults > 0}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={getActiveDescendant()}
          role="combobox"
        />
        <button type="submit" aria-label="Search">
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {isOpen && totalResults > 0 && (
        <div id={listboxId} role="listbox" aria-label="Search results">
          {results.posts.length > 0 && (
            <div>
              <div>Articles</div>
              {results.posts.map((post) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-post-${post.id}`;
                return (
                  <Link
                    key={post.id}
                    id={optionId}
                    href={`/${post.slug}`}
                    onClick={handleResultClick}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    {post.featuredImage?.node?.sourceUrl && (
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt=""
                        width={48}
                        height={48}
                        sizes="48px"
                      />
                    )}
                    <span dangerouslySetInnerHTML={{ __html: post.title }} />
                  </Link>
                );
              })}
            </div>
          )}

          {results.categories.length > 0 && (
            <div>
              <div>Categories</div>
              {results.categories.map((category) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-category-${category.id}`;
                return (
                  <Link
                    key={category.id}
                    id={optionId}
                    href={`/?categories=${category.slug}`}
                    onClick={handleResultClick}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    <span>{category.name}</span>
                    {category.count !== undefined && (
                      <span>{category.count} posts</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {results.tags.length > 0 && (
            <div>
              <div>Tags</div>
              {results.tags.map((tag) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const optionId = `search-option-tag-${tag.id}`;
                return (
                  <Link
                    key={tag.id}
                    id={optionId}
                    href={`/?search=${tag.slug}`}
                    onClick={handleResultClick}
                    role="option"
                    aria-selected={selectedIndex === currentIndex}
                  >
                    <span>#{tag.name}</span>
                    {tag.count !== undefined && (
                      <span>{tag.count} posts</span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          <div>
            <button type="button" onClick={navigateToSearch}>
              Press Enter to search all results for &quot;{searchTerm}&quot;
            </button>
          </div>
        </div>
      )}

      {isOpen && searchTerm.length >= 2 && totalResults === 0 && !isLoading && (
        <p>No results found for &quot;{searchTerm}&quot;</p>
      )}
    </div>
  );
}
