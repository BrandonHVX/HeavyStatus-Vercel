'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Headlines' },
  { href: '/featured', label: 'Featured' },
  { href: '/explore', label: 'Explore' },
  { href: '/live', label: 'Live' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav>
      {navItems.map((item) => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href}>
            {isActive ? `[${item.label}]` : item.label}
          </Link>
        );
      })}
    </nav>
  );
}
