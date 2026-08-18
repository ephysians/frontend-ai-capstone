import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">about</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink max-w-xl">
        Straightforward, curious, blunt, human.
      </h1>
      <p className="mt-6 text-muted max-w-xl leading-relaxed">
        I&apos;m Emmanuel Chukwukere Obinna. I run VertexIQ Technologies, a
        consultancy currently building the frontend for a live agro-tourism
        platform, and I&apos;m spending this stretch of my career turning
        AI-assisted development from a shortcut into a discipline: documented,
        tested, and reviewable, not just fast.
      </p>
      <Link
        href="/work"
        className="mt-8 inline-flex font-mono text-sm text-muted hover:text-ink px-5 py-3 rounded-md border border-white/10 hover:border-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
      >
        See the work
      </Link>
    </div>
  );
}
