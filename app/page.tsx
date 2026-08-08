import Link from 'next/link';
import DiffBlock from '@/components/DiffBlock';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-4">frontend engineering, reviewed not just generated</p>
      <h1 className="font-display font-semibold text-3xl sm:text-5xl text-ink leading-tight max-w-2xl">
        I ship what AI writes, after I&apos;ve actually read it.
      </h1>
      <p className="mt-6 text-lg text-muted max-w-xl">
        I help technical co-founders drowning in frontend backlog by directing AI-assisted workflows to
        ship production-ready code they don&apos;t have to rewrite. Not faster-but-sloppier output, but
        interfaces that pass their own review standard.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://backlog-tracker-app.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Review a live demo
        </a>
        <Link
          href="/work"
          className="font-mono text-sm text-muted hover:text-ink px-5 py-3 rounded-md border border-white/10 hover:border-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          See the work
        </Link>
      </div>

      <div className="mt-16">
        <p className="font-mono text-xs text-muted mb-3 uppercase tracking-wide">
          what &quot;reviewed, not just generated&quot; looks like
        </p>
        <DiffBlock
          label="case-study-copy.md"
          lines={[
            {
              type: 'remove',
              text: '"Leveraged AI-powered workflows to deliver results-driven solutions that exceeded expectations."',
            },
            {
              type: 'add',
              text: '"All 22 tests passed. The app still would have broken on load. I caught it by reading the code instead of trusting the test count."',
            },
          ]}
        />
      </div>
    </div>
  );
}
