import Link from 'next/link';
import MobileMenu from './MobileMenu';

const LINKS = [
  { href: '/work', label: 'work' },
  { href: '/about', label: 'about' },
  { href: '/contact', label: 'contact' },
  { href: '/chat', label: 'chat' },
];

export default function Nav() {
  return (
    <header className="relative border-b border-white/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
        >
          emmanuel<span className="text-accent">.</span>dev
        </Link>
        <nav aria-label="Primary" className="hidden sm:flex items-center gap-6">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 rounded"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}
