'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Header(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return(
    <header className='bg-white border-b border-gray-200'>
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
        </div>

        <div className='hidden md:block'>
          <nav className='flex justify-center py-3 border-b border-gray-100'>
            <ul className='flex gap-8'>
              <li>
                <Link href={'/'} className='nav-link'>
                  Home
                </Link>
              </li>
              <li>
                <Link href={'/blog'} className='nav-link'>
                  Articles
                </Link>
              </li>
              <li>
                <Link href={'/about'} className='nav-link'>
                  About
                </Link>
              </li>
              <li>
                <Link href={'/contact'} className='nav-link'>
                  Contact
                </Link>
              </li>
            </ul>
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
  )
}
