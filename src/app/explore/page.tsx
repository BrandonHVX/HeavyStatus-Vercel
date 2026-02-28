'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { timeAgo } from '@/lib/nuws-helpers';

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

export default function ExplorePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], categories: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [topics, setTopics] = useState<TopicsData>({ categories: [], tags: [] });
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState<SearchPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
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
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
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
          router.push(`/?categories=${selected.slug}`);
        } else {
          router.push(`/?search=${selected.slug}`);
        }
      }
    }
  };

  let itemIndex = -1;

  return (
    <div>
      <h1>Explore</h1>

      <div>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for everything..."
            aria-label="Search"
            aria-expanded={isOpen && totalResults > 0}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={getActiveDescendant()}
            role="combobox"
          />
          {isLoading && <span>Loading...</span>}
        </form>

        {isOpen && totalResults > 0 && (
          <div id={listboxId} role="listbox" aria-label="Search results">
            {results.posts.length > 0 && (
              <div>
                <div>Articles</div>
                {results.posts.map((post) => {
                  itemIndex++;
                  const currentIndex = itemIndex;
                  const optionId = `explore-search-option-post-${post.id}`;
                  return (
                    <Link
                      key={post.id}
                      id={optionId}
                      href={`/${post.slug}`}
                      role="option"
                      aria-selected={selectedIndex === currentIndex}
                    >
                      {post.featuredImage?.node?.sourceUrl && (
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt=""
                          width={40}
                          height={40}
                          sizes="40px"
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
                  const optionId = `explore-search-option-category-${category.id}`;
                  return (
                    <Link
                      key={category.id}
                      id={optionId}
                      href={`/?categories=${category.slug}`}
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
                  const optionId = `explore-search-option-tag-${tag.id}`;
                  return (
                    <Link
                      key={tag.id}
                      id={optionId}
                      href={`/?search=${tag.slug}`}
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

      <section>
        <h2>Categories</h2>
        {topicsLoading ? (
          <p>Loading categories...</p>
        ) : (
          <ul>
            {topics.categories.map((category) => (
              <li key={category.id}>
                <Link href={`/?categories=${category.slug}`}>
                  {category.name}
                  {category.count !== undefined && ` (${category.count})`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Tags</h2>
        {topicsLoading ? (
          <p>Loading tags...</p>
        ) : (
          <ul>
            {topics.tags.map((tag) => (
              <li key={tag.id}>
                <Link href={`/?search=${tag.slug}`}>
                  #{tag.name}
                  {tag.count !== undefined && ` (${tag.count})`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {!postsLoading && recentPosts.length > 0 && (
        <section>
          <h2>Recent Posts</h2>
          <ul>
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/${post.slug}`}>
                  {post.featuredImage?.node?.sourceUrl && (
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.title || ''}
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  )}
                  <h3>{post.title}</h3>
                  <p>{post.author?.node?.name || 'Staff'} - {timeAgo(post.date)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
