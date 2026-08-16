'use client';

import { useState } from 'react';
import Link from 'next/link';

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
        className="font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded px-2 py-1"
      >
        {open ? 'close' : 'menu'}
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="absolute left-0 right-0 top-full bg-panel border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-mono text-sm text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
