import type { CaseStudy } from '@/lib/tools';

export function CaseStudyCard({ data }: { data: CaseStudy }) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel p-4 text-sm">
      <h3 className="font-display font-semibold text-ink mb-3">{data.title}</h3>
      <div className="grid gap-3">
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">Problem</p>
          <p className="text-ink/90">{data.problem}</p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">Decision</p>
          <p className="text-ink/90">{data.decision}</p>
        </div>
        <div>
          <p className="font-mono text-xs text-muted uppercase tracking-wide mb-1">Outcome</p>
          <p className="text-ink/90">{data.outcome}</p>
        </div>
      </div>
    </div>
  );
}
