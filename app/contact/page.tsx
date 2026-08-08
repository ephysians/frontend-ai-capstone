export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">contact</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink max-w-xl">
        See the code before you take a call.
      </h1>
      <p className="mt-6 text-muted max-w-xl leading-relaxed">
        If you&apos;re a technical co-founder buried under a frontend queue, the fastest way to check
        whether I&apos;m worth your time is to open a live demo and judge the code yourself, not sit
        through a pitch.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="https://backlog-tracker-app.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Review the live demo
        </a>
        <a
          href="mailto:njokuobinna@gmail.com"
          className="font-mono text-sm text-muted hover:text-ink px-5 py-3 rounded-md border border-white/10 hover:border-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Email instead
        </a>
      </div>

      <p className="mt-6 font-mono text-xs text-muted">
        Convinced already? Email works, and I&apos;ll usually reply within a day.
      </p>
    </div>
  );
}
