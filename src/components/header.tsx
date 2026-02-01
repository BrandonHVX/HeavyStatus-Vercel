'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
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

export function Header(){
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResults>({ posts: [], categories: [], tags: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const listboxId = 'header-search-listbox';

  const totalResults = results.posts.length + results.categories.length + results.tags.length;

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchModalOpen(false);
    setIsOpen(false);
    setSearchTerm('');
  }, [pathname]);

  useEffect(() => {
    if (searchModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (searchModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchModalOpen]);

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

  const closeModal = () => {
    setSearchModalOpen(false);
    setIsOpen(false);
    setSearchTerm('');
    setResults({ posts: [], categories: [], tags: [] });
  };

  const navigateToSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/headlines?search=${encodeURIComponent(searchTerm)}`);
      closeModal();
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
    return `header-search-option-${selected.type}-${selected.id}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }

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
        closeModal();
      }
    }
  };

  const handleResultClick = () => {
    closeModal();
  };

  let itemIndex = -1;

  return(
    <>
      <div className="h-[58px] md:hidden" />
      <header className="fixed md:relative top-0 left-0 right-0 z-40 grid h-[58px] grid-cols-[auto_1fr_auto] items-center bg-[#050505] px-4 text-white">
        <div className="flex items-center gap-3">
          <Link
            href="/headlines"
            className="hidden sm:block rounded-[2px] border border-[rgba(255,255,255,0.18)] bg-[#cf1717] px-3 py-[6px] text-[10px] font-bold tracking-[0.14em] hover:bg-[#b51414] transition-colors"
          >
            SUBSCRIBE
          </Link>
          <button
            className="sm:hidden text-white p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <Link
          href="/"
          className="justify-self-center font-serif text-[16px] sm:text-[18px] md:text-[20px] font-extrabold tracking-[0.1em] sm:tracking-[0.12em] hover:text-gray-300 transition-colors whitespace-nowrap"
        >
          HEAVY STATUS
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-1.5 text-[rgba(255,255,255,0.88)] hover:text-white transition-colors"
            aria-label="Open search"
          >
            <span className="hidden sm:inline text-[11px] font-bold tracking-[0.14em]">SEARCH</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hidden sm:block text-[11px] font-bold tracking-[0.14em] text-[rgba(255,255,255,0.88)] hover:text-white transition-colors"
          >
            MENU <span className="relative top-[1px] ml-1 text-[14px]">≡</span>
          </button>
        </div>
      </header>

      <nav className="hidden sm:flex justify-center gap-4 md:gap-[22px] border-t border-white/10 bg-[#0b0b0b] px-[14px] py-[10px]">
        <Link href="/" className="text-[10px] md:text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          TODAY
        </Link>
        <Link href="/headlines" className="text-[10px] md:text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          HEADLINES
        </Link>
      </nav>

      <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center bg-[#e6f4f1] px-[18px] py-[12px]">
        <div className="justify-self-start font-sans text-[9px] font-extrabold tracking-[0.18em] text-[#111]">
          HEAVY STATUS
        </div>
        <div className="justify-self-center font-sans text-[11px] md:text-[12px] text-[#111] text-center">
          Power. Personality. And freedom of the press.&nbsp;&nbsp;
          <Link href="/headlines" className="font-bold text-[#cf1717] hover:underline">
            Get unlimited access.
          </Link>
        </div>
        <div />
      </div>

      {mobileMenuOpen && (
        <nav className="sm:hidden bg-[#0b0b0b] py-4 border-t border-white/10" role="navigation" aria-label="Mobile navigation">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link href="/" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                TODAY
              </Link>
            </li>
            <li>
              <Link href="/headlines" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                HEADLINES
              </Link>
            </li>
            <li className="pt-2 border-t border-white/10 w-32 text-center">
              <Link
                href="/headlines"
                className="inline-block rounded-[2px] border border-[rgba(255,255,255,0.18)] bg-[#cf1717] px-4 py-2 text-[10px] font-bold tracking-[0.14em] text-white"
              >
                SUBSCRIBE
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {searchModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div 
            ref={searchRef}
            className="w-full max-w-xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
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
              <button
                type="button"
                onClick={closeModal}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
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
                      const optionId = `header-search-option-post-${post.id}`;
                      return (
                        <Link
                          key={post.id}
                          id={optionId}
                          href={`/${post.slug}`}
                          onClick={handleResultClick}
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
                      const optionId = `header-search-option-category-${category.id}`;
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
                      const optionId = `header-search-option-tag-${tag.id}`;
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

            {!isOpen && searchTerm.length < 2 && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-gray-400">Type at least 2 characters to search</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="h-[76px] md:hidden" />
      <nav className="fixed md:hidden bottom-4 left-4 right-4 z-40 bg-[#050505] rounded-full shadow-lg shadow-black/30">
        <div className="grid grid-cols-2 h-[56px]">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === '/' ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.14em]">TODAY</span>
          </Link>
          <Link
            href="/headlines"
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              pathname === '/headlines' || pathname.startsWith('/headlines/') ? 'text-white' : 'text-[rgba(255,255,255,0.6)]'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.14em]">HEADLINES</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
