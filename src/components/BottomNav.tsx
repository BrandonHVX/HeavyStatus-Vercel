'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/headlines', label: 'Headlines' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
