import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' });

export const metadata: Metadata = {
  title: 'Emmanuel Chukwukere Obinna',
  description:
    'I help technical co-founders drowning in frontend backlog by directing AI-assisted workflows to ship production-ready code they do not have to rewrite.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body">
        <a href="#content" className="skip-link focus-visible:inline-block sr-only">Skip to content</a>
        <Nav />
        <main id="content">{children}</main>
      </body>
    </html>
  );
}
