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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header>
        <div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            ☰
          </button>

          <Link href="/">Political Aficionado</Link>

          <div>
            <button onClick={() => setSearchOpen(true)} aria-label="Search">🔍</button>

            <span className="user-menu-container">
              {status === 'loading' ? null : session ? (
                <>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} aria-label="Account menu">
                    {session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </button>
                  {userMenuOpen && (
                    <div>
                      <p>{session.user?.email}</p>
                      <p>{isSubscribed ? 'Premium Member' : 'Free Account'}</p>
                      <Link href="/account" onClick={() => setUserMenuOpen(false)}>My Account</Link>
                      {!isSubscribed && (
                        <Link href="/subscribe" onClick={() => setUserMenuOpen(false)}>Subscribe</Link>
                      )}
                      <button onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/auth/signin" aria-label="Sign in">Sign In</Link>
              )}
            </span>
          </div>
        </div>

        <nav>
          {menuLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {isActive(link.href) ? `[${link.label}]` : link.label}
            </Link>
          ))}
        </nav>
      </header>

      {mobileMenuOpen && (
        <div>
          <button onClick={() => setMobileMenuOpen(false)}>✕ Close</button>
          <nav>
            {menuLinks.map((link) => (
              <div key={link.href}>
                <Link href={link.href} onClick={() => setMobileMenuOpen(false)}>
                  {link.label}
                </Link>
              </div>
            ))}
            <hr />
            {session ? (
              <>
                <div><Link href="/account" onClick={() => setMobileMenuOpen(false)}>My Account</Link></div>
                <div>
                  <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: '/' }); }}>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div><Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link></div>
                <div><Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>Register</Link></div>
              </>
            )}
            {!isSubscribed && (
              <div><Link href="/subscribe" onClick={() => setMobileMenuOpen(false)}>Subscribe</Link></div>
            )}
          </nav>
        </div>
      )}

      {searchOpen && (
        <div ref={searchRef} role="dialog" aria-modal="true" aria-label="Search">
          <form onSubmit={handleSubmit}>
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
            />
            {isLoading && <span>Loading...</span>}
            <button type="button" onClick={closeSearch}>Cancel</button>
          </form>

          {isOpen && totalResults > 0 && (
            <div id={listboxId} role="listbox" aria-label="Search results">
              {results.posts.length > 0 && (
                <div>
                  <div>Articles</div>
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
                      >
                        {post.featuredImage?.node?.sourceUrl && (
                          <Image src={post.featuredImage.node.sourceUrl} alt="" width={40} height={40} sizes="40px" />
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
                    const optionId = `header-search-option-category-${category.id}`;
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
                        {category.count !== undefined && <span>{category.count} posts</span>}
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
                    const optionId = `header-search-option-tag-${tag.id}`;
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
                        {tag.count !== undefined && <span>{tag.count} posts</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
