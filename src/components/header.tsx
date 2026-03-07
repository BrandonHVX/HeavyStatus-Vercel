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

const pageTitles: Record<string, string> = {
  '/': 'Headlines',
  '/featured': 'Featured',
  '/explore': 'Explore',
  '/live': 'Live',
  '/about': 'About',
  '/contact': 'Contact',
  '/subscribe': 'Subscribe',
  '/account': 'Account',
  '/privacy': 'Privacy',
  '/editorial-policy': 'Editorial Policy',
  '/corrections': 'Corrections',
  '/gallery': 'Gallery',
};

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

  const pageTitle = pageTitles[pathname] || 'Political Aficionado';

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
    return () => { document.body.style.overflow = ''; };
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(searchTerm), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
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
    if (e.key === 'Escape') { closeSearch(); return; }
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
        if (selected.type === 'post') router.push(`/${selected.slug}`);
        else if (selected.type === 'category') router.push(`/?categories=${selected.slug}`);
        else router.push(`/?search=${selected.slug}`);
        closeSearch();
      }
    }
  };

  const handleResultClick = () => closeSearch();

  let itemIndex = -1;

  const menuLinks = [
    { href: '/', label: 'Headlines' },
    { href: '/featured', label: 'Featured' },
    { href: '/explore', label: 'Explore' },
    { href: '/live', label: 'Live' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 pt-2 px-3">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-white/50 max-w-3xl mx-auto">
          <div className="flex items-center justify-between h-11 px-3.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 active:bg-black/5 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>

            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-[15px] font-semibold text-gray-900 tracking-tight">{pageTitle}</span>
            </Link>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 active:bg-black/5 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </button>

              <span className="user-menu-container relative">
                {status === 'loading' ? (
                  <span className="w-8 h-8 block" />
                ) : session ? (
                  <>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      aria-label="Account menu"
                      className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold active:opacity-80 transition-opacity"
                    >
                      {session.user?.email?.[0]?.toUpperCase() || 'U'}
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-200/50 overflow-hidden z-50">
                        <div className="px-4 py-3 bg-gray-50/60">
                          <p className="text-[13px] font-semibold text-gray-900 truncate">{session.user?.email}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{isSubscribed ? 'Premium Member' : 'Free Account'}</p>
                        </div>
                        <div className="py-1">
                          <Link href="/account" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-[13px] text-gray-700 active:bg-gray-100">My Account</Link>
                          {!isSubscribed && (
                            <Link href="/subscribe" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-[13px] text-gray-700 active:bg-gray-100">Subscribe</Link>
                          )}
                          <button
                            onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                            className="block w-full text-left px-4 py-2.5 text-[13px] text-red-500 active:bg-gray-100"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    aria-label="Sign in"
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 active:bg-black/5 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </Link>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="h-[60px]" />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute left-0 top-0 bottom-0 w-72 bg-white/95 backdrop-blur-xl shadow-2xl">
            <div className="pt-14 pb-2 px-5 border-b border-gray-100">
              <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">Political Aficionado</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Breaking News · World News</p>
            </div>
            <div className="py-2">
              {menuLinks.map((link) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-5 py-3 text-[15px] transition-colors ${active ? 'text-blue-500 font-semibold bg-blue-50/50' : 'text-gray-700 font-medium active:bg-gray-50'}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-gray-100 py-2">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-[15px] font-medium text-gray-700 active:bg-gray-50">My Account</Link>
                  <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }} className="block w-full text-left px-5 py-3 text-[15px] font-medium text-red-500 active:bg-gray-50">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-[15px] font-medium text-gray-700 active:bg-gray-50">Sign In</Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-[15px] font-medium text-gray-700 active:bg-gray-50">Register</Link>
                </>
              )}
              {!isSubscribed && (
                <Link href="/subscribe" onClick={() => setMobileMenuOpen(false)} className="block px-5 py-3 text-[15px] font-semibold text-blue-500 active:bg-gray-50">Subscribe</Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}>
          <div className="pt-16 px-4">
            <div ref={searchRef} role="dialog" aria-modal="true" aria-label="Search" className="w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden">
              <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 border-b border-gray-100">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
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
                  className="flex-1 py-3.5 text-[15px] text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                />
                {isLoading && <span className="text-[12px] text-gray-400">...</span>}
                <button type="button" onClick={closeSearch} className="text-[14px] font-medium text-blue-500 active:opacity-60">Cancel</button>
              </form>

              {isOpen && totalResults > 0 && (
                <div id={listboxId} role="listbox" aria-label="Search results" className="max-h-80 overflow-y-auto">
                  {results.posts.length > 0 && (
                    <div className="px-4 pt-3 pb-1">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Articles</div>
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
                            className={`flex items-center gap-3 py-2 px-2 rounded-xl transition-colors ${selectedIndex === currentIndex ? 'bg-blue-50' : 'active:bg-gray-50'}`}
                          >
                            {post.featuredImage?.node?.sourceUrl && (
                              <Image src={post.featuredImage.node.sourceUrl} alt="" width={40} height={40} sizes="40px" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            )}
                            <span className="text-[14px] text-gray-800 font-medium line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title }} />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  {results.categories.length > 0 && (
                    <div className="px-4 pt-3 pb-1 border-t border-gray-100/60">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</div>
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
                            className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${selectedIndex === currentIndex ? 'bg-blue-50' : 'active:bg-gray-50'}`}
                          >
                            <span className="text-[14px] text-gray-800 font-medium">{category.name}</span>
                            {category.count !== undefined && <span className="text-[12px] text-gray-400">{category.count}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  {results.tags.length > 0 && (
                    <div className="px-4 pt-3 pb-3 border-t border-gray-100/60">
                      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</div>
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
                            className={`flex items-center justify-between py-2.5 px-2 rounded-xl transition-colors ${selectedIndex === currentIndex ? 'bg-blue-50' : 'active:bg-gray-50'}`}
                          >
                            <span className="text-[14px] text-gray-800 font-medium">#{tag.name}</span>
                            {tag.count !== undefined && <span className="text-[12px] text-gray-400">{tag.count}</span>}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
