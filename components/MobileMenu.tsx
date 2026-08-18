'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '/work', label: 'work' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
  { href: '/chat', label: 'chat' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        {open ? <X aria-hidden="true" size={18} /> : <Menu aria-hidden="true" size={18} />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="absolute left-0 right-0 top-full z-20 flex flex-col gap-3 border-t border-white/10 bg-panel px-4 py-4 shadow-xl"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-1 py-2 font-mono text-sm text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
