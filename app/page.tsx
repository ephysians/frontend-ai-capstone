import Link from 'next/link';
import DiffBlock from '@/components/DiffBlock';
import SignatureShader from '@/components/SignatureShader';

export default function HomePage() {
  return (
    <>
      <section className="signature-hero relative isolate overflow-hidden">
        <SignatureShader />
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] max-w-4xl items-center px-4 py-16 sm:px-6 sm:py-24">
          <div className="signature-hero__content max-w-2xl">
            <p className="mb-4 font-mono text-sm text-accent">frontend engineering, reviewed not just generated</p>
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">
              I ship what AI writes, after I&apos;ve actually read it.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
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
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-muted">
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
    </>
  );
}
