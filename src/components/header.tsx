'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SearchBar } from './search-bar';

export function Header(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [pathname]);

  return(
    <>
      <div className="h-[58px] md:hidden" />
      <header className='fixed md:relative top-0 left-0 right-0 z-40 bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex justify-center items-center py-4 md:hidden relative'>
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
            
            <Link href={'/'} className='font-serif text-xl tracking-[0.2em] uppercase text-black'>
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
            <div className='md:hidden py-4 border-t border-gray-100'>
              <SearchBar />
            </div>
          )}

          <div className='hidden md:block'>
            <nav className='flex justify-between items-center py-3 border-b border-gray-100'>
              <ul className='flex gap-8'>
                <li>
                  <Link href={'/'} className='nav-link'>
                    Today
                  </Link>
                </li>
                <li>
                  <Link href={'/headlines'} className='nav-link'>
                    Headlines
                  </Link>
                </li>
              </ul>
              <SearchBar />
            </nav>

            <div className='py-6 text-center'>
              <Link href={'/'} className='font-serif text-4xl tracking-[0.3em] uppercase text-black hover:text-accent transition-colors'>
                Heavy Status
              </Link>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className='md:hidden py-4 border-t border-gray-100' role='navigation' aria-label='Mobile navigation'>
              <ul className='flex flex-col items-center gap-4'>
                <li>
                  <Link href={'/'} className='nav-link py-2 block'>
                    Today
                  </Link>
                </li>
                <li>
                  <Link href={'/headlines'} className='nav-link py-2 block'>
                    Headlines
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

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
