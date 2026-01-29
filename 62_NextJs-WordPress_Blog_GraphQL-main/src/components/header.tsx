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
    <>
      <header className="grid h-[58px] grid-cols-[1fr_auto_1fr] items-center bg-[#050505] px-[18px] text-white max-[980px]:grid-cols-[100px_1fr_100px]">
        <Link
          href="/blog"
          className="justify-self-start rounded-[2px] border border-[rgba(255,255,255,0.18)] bg-[#cf1717] px-3 py-[7px] text-[11px] font-bold tracking-[0.14em] hover:bg-[#b51414] transition-colors"
        >
          SUBSCRIBE
        </Link>

        <Link
          href="/"
          className="justify-self-center font-serif text-[18px] md:text-[20px] font-extrabold tracking-[0.12em] hover:text-gray-300 transition-colors"
        >
          HEAVY STATUS
        </Link>

        <div className="hidden md:flex items-center justify-self-end gap-[18px]">
          <Link
            href="/blog"
            className="text-[11px] font-bold tracking-[0.14em] text-[rgba(255,255,255,0.88)] hover:text-white transition-colors"
          >
            NEWSLETTERS
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[11px] font-bold tracking-[0.14em] text-[rgba(255,255,255,0.88)] hover:text-white transition-colors"
          >
            MENU <span className="relative top-[1px] ml-1 text-[14px]">≡</span>
          </button>
        </div>

        <button
          className="md:hidden justify-self-end text-white p-2"
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
      </header>

      <nav className="hidden md:flex justify-center gap-[22px] border-t border-white/10 bg-[#0b0b0b] px-[14px] py-[10px]">
        <Link href="/" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          HOME
        </Link>
        <Link href="/blog" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          ARTICLES
        </Link>
        <Link href="/about" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          ABOUT
        </Link>
        <Link href="/contact" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] hover:text-white transition-colors">
          CONTACT
        </Link>
      </nav>

      <div className="hidden md:grid grid-cols-[180px_1fr_180px] items-center bg-[#e6f4f1] px-[18px] py-[14px] max-[980px]:grid-cols-[140px_1fr_140px]">
        <div className="justify-self-start font-sans text-[9px] font-extrabold tracking-[0.18em] text-[#111]">
          HEAVY STATUS
        </div>
        <div className="justify-self-center font-sans text-[12px] text-[#111] text-center">
          Power. Personality. And freedom of the press.&nbsp;&nbsp;
          <Link href="/blog" className="font-bold text-[#cf1717] hover:underline">
            Get unlimited access.
          </Link>
        </div>
        <div />
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-[#0b0b0b] py-4 border-t border-white/10" role="navigation" aria-label="Mobile navigation">
          <ul className="flex flex-col items-center gap-4">
            <li>
              <Link href="/" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                HOME
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                ARTICLES
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                ABOUT
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[11px] font-bold tracking-[0.18em] text-[rgba(255,255,255,0.86)] py-2 block">
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  )
}
