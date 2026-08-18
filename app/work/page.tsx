import DiffBlock from '@/components/DiffBlock';
import Link from 'next/link';

const CASES = [
  {
    id: 'workflow-discipline',
    title: 'Building a repeatable AI-assisted engineering workflow',
    problem:
      "Building applications was never the hard part. My process didn't scale: every project started differently, documentation was minimal, and my AI conversations were scattered instead of part of a repeatable workflow. That caught up with me on a real client project, where I kept revisiting design decisions and rewriting prompts just to regain context I'd already had once.",
    decision:
      "I treated my capstone repo like a production project. I adopted Conventional Commits from the first commit and kept the repo deliberately minimal, resisting the urge to pad it with extra folders to look more substantial.",
    outcome:
      "The workflow caught a real bug before it shipped. Building the same feature twice, once with a vague prompt, once with a precise one including tests, all 22 tests passed on the precise version. But the code used Node/CommonJS export syntax while the HTML loaded it as a browser ES module, a mismatch that would have broken the app on load despite every test being green. I caught it by reading the code instead of trusting the test count.",
  },
  {
    id: 'onboarding-design',
    title: "Onboarding design for a live agro-tourism platform",
    problem:
      'Discovering authentic agro-tourism experiences in Nigeria was fragmented and largely offline. Travelers had no single place to find farms, cultural sites, and local artisans, and the providers themselves had no professional way to be found.',
    decision:
      "The hardest part wasn't visual design, it was onboarding: getting a Tourist, a Farmer, and an Artisan, three different users with different needs, through the same front door without any of them feeling like the product wasn't built for them. I considered collecting full profile information immediately at sign-up, and rejected it: a long form up front is intimidating and drops people before they see the product.",
    outcome:
      "Still in active development, not yet publicly launched. The onboarding and partner-registration flows have gone through multiple rounds of mentor feedback and my own usability review. I'd rather be honest about where in-progress work stands than dress it up as finished.",
  },
];

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24">
      <p className="font-mono text-sm text-accent mb-3">work</p>
      <h1 className="font-display font-semibold text-2xl sm:text-4xl text-ink">Case studies, not a portfolio grid</h1>
      <p className="mt-4 text-muted max-w-xl">
        Two real pieces of work, each with the actual problem, the decisions I made and rejected, and what
        came of it, honestly, including what&apos;s still in progress.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {CASES.map((c) => (
          <article key={c.id} className="border-t border-white/10 pt-8">
            <h2 className="font-display font-semibold text-xl text-ink">{c.title}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">the problem</p>
                <p className="text-sm text-ink/90 leading-relaxed">{c.problem}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">what I did</p>
                <p className="text-sm text-ink/90 leading-relaxed">{c.decision}</p>
              </div>
              <div>
                <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">what came of it</p>
                <p className="text-sm text-ink/90 leading-relaxed">{c.outcome}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16">
        <p className="font-mono text-xs text-muted mb-3 uppercase tracking-wide">a mistake caught, not hidden</p>
        <DiffBlock
          label="settings-form.js"
          lines={[
            { type: 'context', text: 'function mountSettingsForm(container, onSubmit) {' },
            { type: 'context', text: '  container.appendChild(createSettingsForm(onSubmit));' },
            { type: 'context', text: '}' },
            { type: 'remove', text: 'module.exports = { validate, createSettingsForm, mountSettingsForm };' },
            {
              type: 'add',
              text: "if (typeof module !== 'undefined' && module.exports) { module.exports = { validate, createSettingsForm, mountSettingsForm }; }",
            },
          ]}
        />
      </div>
        <div className="mt-16 border-t border-white/10 pt-8">
        <p className="font-display font-semibold text-xl text-ink">Have a frontend backlog?</p>
        <p className="mt-2 text-muted max-w-xl">Let&apos;s talk about the work that needs a careful pair of eyes.</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex font-mono text-sm bg-accent text-base font-medium px-5 py-3 rounded-md hover:bg-accent/90 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
