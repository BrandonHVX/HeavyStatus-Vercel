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
      router.push(`/?search=${encodeURIComponent(searchTerm)}`);
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
          router.push(`/?categories=${selected.slug}`);
        } else {
          router.push(`/?search=${selected.slug}`);
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
    { href: '/', label: 'HOME' },
    { href: '/featured', label: 'FEATURED' },
    { href: '/explore', label: 'EXPLORE' },
    { href: '/live', label: 'LIVE' },
    { href: '/about', label: 'ABOUT' },
    { href: '/contact', label: 'CONTACT' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-black transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <Link href="/" className="block">
                <h1 className="text-[22px] sm:text-[28px] font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                  Political Aficionado
                </h1>
                <p className="text-[9px] sm:text-[10px] text-gray-400 tracking-[0.15em] uppercase font-medium -mt-0.5">
                  Breaking News &middot; World News &middot; Politics
                </p>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="/rss.xml" aria-label="RSS Feed" className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/></svg>
                </a>
              </div>

              <div className="user-menu-container relative">
                {status === 'loading' ? (
                  <div className="w-7 h-7" />
                ) : session ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="Account menu"
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors text-xs font-bold"
                  >
                    {session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </button>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 transition-colors uppercase tracking-wide"
                  >
                    Sign In
                  </Link>
                )}

                {userMenuOpen && session && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-[13px] font-medium text-gray-900 truncate">{session.user?.email}</p>
                      <p className="text-[11px] text-gray-500">{isSubscribed ? 'Premium Member' : 'Free Account'}</p>
                    </div>
                    <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">My Account</Link>
                    {!isSubscribed && (
                      <Link href="/subscribe" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50">Subscribe</Link>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="block w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <nav className="bg-[#1a1a1a] hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em] transition-colors ${
                  isActive(link.href)
                    ? 'bg-white text-[#1a1a1a]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!isSubscribed && (
              <Link
                href="/subscribe"
                className="px-4 py-2.5 text-[11px] font-semibold tracking-[0.08em] text-gray-300 hover:text-white transition-colors"
              >
                SUBSCRIBE
              </Link>
            )}
          </div>
        </nav>
      </header>

      <div className="h-[52px] sm:h-[92px]" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-[15px] font-bold text-gray-900" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-6 py-3 text-[13px] font-semibold tracking-wide transition-colors ${
                    isActive(link.href)
                      ? 'bg-gray-100 text-black'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="border-t border-gray-100 py-2">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50">MY ACCOUNT</Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="block w-full text-left px-6 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    SIGN OUT
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50">SIGN IN</Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50">REGISTER</Link>
                </>
              )}
              {!isSubscribed && (
                <Link href="/subscribe" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[13px] font-semibold text-gray-700 hover:bg-gray-50">SUBSCRIBE</Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeSearch();
          }}
        >
          <div
            ref={searchRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="flex items-center border-b border-gray-200 px-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search articles..."
                aria-label="Search"
                aria-expanded={isOpen && totalResults > 0}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={getActiveDescendant()}
                role="combobox"
                className="flex-1 px-3 py-4 text-[14px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
              />
              {isLoading && <span className="text-[12px] text-gray-400 mr-2">Loading...</span>}
              <button type="button" onClick={closeSearch} aria-label="Close search" className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
              </button>
            </form>

            {isOpen && totalResults > 0 && (
              <div id={listboxId} role="listbox" aria-label="Search results" className="max-h-96 overflow-y-auto">
                {results.posts.length > 0 && (
                  <div className="px-4 pt-3 pb-1">
                    <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Articles</div>
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
                          role="option"
                          aria-selected={selectedIndex === currentIndex}
                          className={`flex items-center gap-3 py-2 px-2 rounded-lg transition-colors ${selectedIndex === currentIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                          {post.featuredImage?.node?.sourceUrl && (
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt=""
                              width={44}
                              height={44}
                              sizes="44px"
                              className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <span className="text-[13px] text-gray-800 font-medium line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {results.categories.length > 0 && (
                  <div className="px-4 pt-3 pb-1 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Categories</div>
                    {results.categories.map((category) => {
                      itemIndex++;
                      const currentIndex = itemIndex;
                      const optionId = `header-search-option-category-${category.id}`;
                      return (
                        <Link
                          key={category.id}
                          id={optionId}
                          href={`/?categories=${category.slug}`}
                          onClick={handleResultClick}
                          role="option"
                          aria-selected={selectedIndex === currentIndex}
                          className={`flex items-center justify-between py-2 px-2 rounded-lg transition-colors ${selectedIndex === currentIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                          <span className="text-[13px] text-gray-800 font-medium">{category.name}</span>
                          {category.count !== undefined && (
                            <span className="text-[11px] text-gray-400">{category.count} posts</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {results.tags.length > 0 && (
                  <div className="px-4 pt-3 pb-3 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">Tags</div>
                    {results.tags.map((tag) => {
                      itemIndex++;
                      const currentIndex = itemIndex;
                      const optionId = `header-search-option-tag-${tag.id}`;
                      return (
                        <Link
                          key={tag.id}
                          id={optionId}
                          href={`/?search=${tag.slug}`}
                          onClick={handleResultClick}
                          role="option"
                          aria-selected={selectedIndex === currentIndex}
                          className={`flex items-center justify-between py-2 px-2 rounded-lg transition-colors ${selectedIndex === currentIndex ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                        >
                          <span className="text-[13px] text-gray-800 font-medium">#{tag.name}</span>
                          {tag.count !== undefined && (
                            <span className="text-[11px] text-gray-400">{tag.count} posts</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
