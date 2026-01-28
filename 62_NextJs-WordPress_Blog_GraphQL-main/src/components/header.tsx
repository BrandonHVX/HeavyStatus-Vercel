'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function Header(){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return(
    <header className='bg-primary sticky top-0 z-50 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='flex justify-between items-center py-4'>
          <div className='font-bold text-2xl'>
            <Link href={'/'} className='text-white hover:text-accent transition-colors'>
              Heavy Status
            </Link>
          </div>

          <button 
            className='md:hidden text-white p-2'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              {mobileMenuOpen ? (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </svg>
          </button>

          <nav className='hidden md:block'>
            <ul className='flex gap-8'>
              <li>
                <Link href={'/'} className='text-white hover:text-accent transition-colors font-medium'>
                  Home
                </Link>
              </li>
              <li>
                <Link href={'/blog'} className='text-white hover:text-accent transition-colors font-medium'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href={'/about'} className='text-white hover:text-accent transition-colors font-medium'>
                  About
                </Link>
              </li>
              <li>
                <Link href={'/contact'} className='text-white hover:text-accent transition-colors font-medium'>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {mobileMenuOpen && (
          <nav className='md:hidden pb-4' role='navigation' aria-label='Mobile navigation'>
            <ul className='flex flex-col gap-4'>
              <li>
                <Link href={'/'} className='text-white hover:text-accent transition-colors font-medium block py-2'>
                  Home
                </Link>
              </li>
              <li>
                <Link href={'/blog'} className='text-white hover:text-accent transition-colors font-medium block py-2'>
                  Blog
                </Link>
              </li>
              <li>
                <Link href={'/about'} className='text-white hover:text-accent transition-colors font-medium block py-2'>
                  About
                </Link>
              </li>
              <li>
                <Link href={'/contact'} className='text-white hover:text-accent transition-colors font-medium block py-2'>
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
