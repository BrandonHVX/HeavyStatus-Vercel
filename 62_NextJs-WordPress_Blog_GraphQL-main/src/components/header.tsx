'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SearchBar } from './search-bar';

export function Header(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 120);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return(
    <>
      {isSticky && <div className="h-[52px] md:h-[52px]"></div>}
      <header className={`bg-white border-b border-gray-200 transition-shadow ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-sm header-animate' : ''}`}>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-center items-center py-3 md:hidden relative'>
            <button 
              className='absolute left-0 text-black p-2'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {mobileMenuOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 6h16M4 12h16M4 18h16' />
                )}
              </svg>
            </button>
            
            <Link href={'/'} className='font-serif text-lg tracking-[0.2em] uppercase text-black'>
              Heavy Status
            </Link>

            <button 
              className='absolute right-0 text-black p-2'
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            >
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                {mobileSearchOpen ? (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M6 18L18 6M6 6l12 12' />
                ) : (
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                )}
              </svg>
            </button>
          </div>

          {mobileSearchOpen && (
            <div className='md:hidden py-3 border-t border-gray-100'>
              <SearchBar />
            </div>
          )}

          <div className='hidden md:block'>
            <div className='flex justify-between items-center py-3'>
              <ul className='flex gap-6'>
                <li>
                  <Link href={'/'} className='nav-link text-[11px]'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={'/blog'} className='nav-link text-[11px]'>
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href={'/about'} className='nav-link text-[11px]'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href={'/contact'} className='nav-link text-[11px]'>
                    Contact
                  </Link>
                </li>
              </ul>
              
              <Link href={'/'} className='font-serif text-2xl tracking-[0.25em] uppercase text-black hover:text-accent transition-colors absolute left-1/2 transform -translate-x-1/2'>
                Heavy Status
              </Link>

              <div className='flex items-center gap-4'>
                <SearchBar />
                <Link 
                  href="/blog" 
                  className="text-[10px] uppercase tracking-wider bg-accent text-white px-4 py-2 hover:bg-black transition-colors"
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className='md:hidden py-4 border-t border-gray-100' role='navigation' aria-label='Mobile navigation'>
              <ul className='flex flex-col items-center gap-4'>
                <li>
                  <Link href={'/'} className='nav-link py-2 block'>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={'/blog'} className='nav-link py-2 block'>
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href={'/about'} className='nav-link py-2 block'>
                    About
                  </Link>
                </li>
                <li>
                  <Link href={'/contact'} className='nav-link py-2 block'>
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
