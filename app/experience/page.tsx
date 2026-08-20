import Link from 'next/link';
import Experience from '@/components/Experience';

export default function ExperiencePage({ searchParams }: { searchParams: { fallback?: string } }) {
  const forceFallback = searchParams?.fallback === '1';

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="font-mono text-sm text-accent">FE-AA2 / interactive 3D</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight text-ink sm:text-5xl">Review the pipeline before it ships.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        A small procedural scene about the part of AI-assisted frontend work that still needs a human pair of eyes.
        Select a stage, change the lens, and inspect what each step is protecting.
      </p>

      <div className="mt-10">
        <Experience forceFallback={forceFallback} />
      </div>

      <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">geometry</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">Four lightweight procedural blocks. No model download, textures, or environment map.</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">interaction</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">Selection changes the active block; lenses shift emphasis toward workflow, evidence, or risk.</p>
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">fallback</p>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">The same stages remain selectable in a static view for reduced motion, missing WebGL, or scene failure.</p>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8">
        <Link href="/work" className="font-mono text-sm text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">Back to the work</Link>
        <Link href="/experience?fallback=1" className="font-mono text-sm text-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2">Open the static fallback</Link>
      </div>
    </div>
  );
}
