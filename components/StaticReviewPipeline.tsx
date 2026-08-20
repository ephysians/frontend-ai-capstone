'use client';

import { useState } from 'react';

export type ReviewStage = {
  id: string;
  label: string;
  shortLabel: string;
  detail: string;
  signal: string;
};

export const REVIEW_STAGES: ReviewStage[] = [
  {
    id: 'prompt',
    label: 'Prompt',
    shortLabel: '01',
    detail: 'Turn the vague request into a constrained, testable brief.',
    signal: 'clarity',
  },
  {
    id: 'build',
    label: 'Build',
    shortLabel: '02',
    detail: 'Shape the interface in small, reviewable pieces.',
    signal: 'craft',
  },
  {
    id: 'tests',
    label: 'Tests',
    shortLabel: '03',
    detail: 'Verify behavior, then read the implementation behind the green check.',
    signal: 'evidence',
  },
  {
    id: 'review',
    label: 'Review',
    shortLabel: '04',
    detail: 'Find the mismatch AI did not catch and decide what ships.',
    signal: 'judgment',
  },
];

const LENSES = ['workflow', 'tests', 'risk'] as const;
export type ReviewLens = (typeof LENSES)[number];

const LENS_COPY: Record<ReviewLens, string> = {
  workflow: 'Follow the work from a rough idea to a deliberate release.',
  tests: 'Keep evidence visible, but remember a passing test is not the whole review.',
  risk: 'The final stage carries the most emphasis: inspect before shipping.',
};

export function StaticReviewPipeline({
  initialStage = 'review',
  onTry3D,
}: {
  initialStage?: string;
  onTry3D?: () => void;
}) {
  const [selectedId, setSelectedId] = useState(initialStage);
  const [lens, setLens] = useState<ReviewLens>('workflow');
  const selected = REVIEW_STAGES.find((stage) => stage.id === selectedId) ?? REVIEW_STAGES[0];

  return (
    <section aria-label="Static review pipeline" className="border border-white/10 bg-panel/70 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Static pipeline view</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">A useful review survives without WebGL.</h2>
        </div>
        {onTry3D && (
          <button
            type="button"
            onClick={onTry3D}
            className="rounded-md border border-accent/50 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            Try the 3D scene
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Review lens">
        {LENSES.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={lens === option}
            onClick={() => setLens(option)}
            className={`rounded-md border px-3 py-2 font-mono text-xs capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              lens === option
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/10 text-muted hover:border-white/20 hover:text-ink'
            }`}
          >
            {option} lens
          </button>
        ))}
      </div>
      <p className="mt-3 max-w-xl text-sm text-muted">{LENS_COPY[lens]}</p>

      <div className="mt-6 grid gap-2 sm:grid-cols-4" role="group" aria-label="Review stages">
        {REVIEW_STAGES.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            aria-pressed={selected.id === stage.id}
            onClick={() => setSelectedId(stage.id)}
            className={`relative min-h-28 rounded-md border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
              selected.id === stage.id
                ? 'border-accent bg-accent/10'
                : 'border-white/10 bg-base/50 hover:border-white/20'
            }`}
          >
            <span className="font-mono text-xs text-muted">{stage.shortLabel}</span>
            <span className="mt-4 block font-display text-sm font-semibold text-ink">{stage.label}</span>
            {index < REVIEW_STAGES.length - 1 && (
              <span aria-hidden="true" className="absolute -right-2 top-1/2 hidden h-px w-2 bg-white/20 sm:block" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4" aria-live="polite">
        <p className="font-mono text-xs uppercase tracking-wide text-accent">Selected: {selected.label}</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/80">{selected.detail}</p>
        <p className="mt-2 font-mono text-xs text-muted">signal: {selected.signal}</p>
      </div>
    </section>
  );
}
