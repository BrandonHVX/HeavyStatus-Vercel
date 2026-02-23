'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';

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

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = session?.user as { subscriptionStatus?: string } | undefined;
  const isSubscribed = user?.subscriptionStatus === 'active';
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
    setSearchOpen(false);
    setUserMenuOpen(false);
    setIsOpen(false);
    setSearchTerm('');
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuOpen && !(e.target as Element).closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, searchOpen]);

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

  const closeSearch = () => {
    setSearchOpen(false);
    setIsOpen(false);
    setSearchTerm('');
    setResults({ posts: [], categories: [], tags: [] });
  };

  const navigateToSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/headlines?search=${encodeURIComponent(searchTerm)}`);
      closeSearch();
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
      closeSearch();
      return;
    }

    if (!isOpen || totalResults === 0) return;

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
        closeSearch();
      }
    }
  };

  const handleResultClick = () => {
    closeSearch();
  };

  let itemIndex = -1;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/headlines', label: 'Headlines' },
    { href: '/explore', label: 'Explore' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="h-14 md:h-0" />

      <header className="fixed md:sticky top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 header-animate">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-1.5 -ml-1.5 text-black"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 font-heading text-xl md:text-2xl font-bold tracking-wide text-black hover:text-accent transition-colors whitespace-nowrap"
            >
              Political Aficionado
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-gray-600 hover:text-black transition-colors"
                aria-label="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <div className="user-menu-container relative">
                {status === 'loading' ? (
                  <span className="text-xs text-gray-400">...</span>
                ) : session ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-1.5 text-gray-600 hover:text-black transition-colors"
                    aria-label="Account menu"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="hidden md:block text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
                  >
                    Sign In
                  </Link>
                )}

                {userMenuOpen && session && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-fade-in-up">
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      My Account
                    </Link>
                    {!isSubscribed && (
                      <Link
                        href="/subscribe"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-accent font-medium hover:bg-gray-50 transition-colors"
                      >
                        Subscribe
                      </Link>
                    )}
                    <div className="h-px bg-gray-100 my-1" />
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="hidden md:block border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center gap-8 h-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.15em] font-bold transition-colors ${
                    pathname === link.href ? 'text-accent' : 'text-gray-700 hover:text-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {!isSubscribed && (
                <Link
                  href="/subscribe"
                  className="text-xs uppercase tracking-[0.15em] font-bold text-white bg-accent px-3 py-1 rounded-sm hover:bg-accent-hover transition-colors"
                >
                  Subscribe
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute top-14 left-0 bottom-0 w-[280px] bg-white shadow-xl overflow-y-auto animate-slide-in-left">
            <div className="py-4">
              <div className="px-5 pb-3 mb-3 border-b border-gray-100">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Navigation</p>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-5 py-3 text-base font-heading transition-colors ${
                    pathname === link.href ? 'text-accent font-semibold' : 'text-gray-800 hover:text-accent hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="h-px bg-gray-100 my-3" />

              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-base font-heading text-gray-800 hover:text-accent hover:bg-gray-50 transition-colors"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full text-left px-5 py-3 text-base font-heading text-gray-500 hover:text-accent hover:bg-gray-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-base font-heading text-gray-800 hover:text-accent hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-5 py-3 text-base font-heading text-gray-800 hover:text-accent hover:bg-gray-50 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}

              {!isSubscribed && (
                <div className="px-5 pt-4">
                  <Link
                    href="/subscribe"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center bg-accent text-white text-sm font-bold uppercase tracking-wider py-3 rounded-sm hover:bg-accent-hover transition-colors"
                  >
                    Subscribe
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] md:pt-[15vh] bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div
            ref={searchRef}
            className="w-full max-w-xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in-up"
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
                onClick={closeSearch}
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
                            className="text-sm font-heading line-clamp-2 text-gray-900"
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

      <style jsx>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </>
  );
}
