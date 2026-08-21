'use client';

import dynamic from 'next/dynamic';
import { Component, ReactNode, useEffect, useState, useRef } from 'react';
import { REVIEW_STAGES, ReviewLens, StaticReviewPipeline } from './StaticReviewPipeline';

const ReviewScene = dynamic(() => import('./ReviewScene'), {
  ssr: false,
  loading: () => <div className="flex h-[360px] items-center justify-center border border-white/10 bg-[#0B0D11] font-mono text-xs text-muted sm:h-[430px]">Preparing the review scene...</div>,
});

class SceneErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Experience({ forceFallback = false }: { forceFallback?: boolean }) {
  const [selectedId, setSelectedId] = useState(REVIEW_STAGES[3].id);
  const [lens, setLens] = useState<ReviewLens>('workflow');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [sceneFailed, setSceneFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener('change', updateMotion);
    setWebglAvailable(supportsWebGL());
    return () => media.removeEventListener('change', updateMotion);
  }, []);

  const showFallback = forceFallback || reducedMotion || !webglAvailable || sceneFailed;
  const [showScene, setShowScene] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (showFallback) return;
    if (showScene) return;
    const el = containerRef.current;
    if (!el) return setShowScene(true);
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShowScene(true);
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [showFallback, showScene]);

  if (showFallback) {
    return (
      <StaticReviewPipeline
        initialStage={selectedId}
        onTry3D={reducedMotion || !webglAvailable || sceneFailed ? undefined : () => setSceneFailed(false)}
      />
    );
  }
  return (
    <div ref={containerRef}>
      <SceneErrorBoundary onError={() => setSceneFailed(true)}>
        {showScene ? (
          <ReviewScene selectedId={selectedId} lens={lens} reducedMotion={reducedMotion} onSelect={setSelectedId} />
        ) : (
          <div className="flex h-[360px] items-center justify-center border border-white/10 bg-[#0B0D11] font-mono text-xs text-muted sm:h-[430px]">Preparing the review scene...</div>
        )}
      </SceneErrorBoundary>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Select a review stage">
        {REVIEW_STAGES.map((stage) => (
          <button
            key={stage.id}
            type="button"
            aria-pressed={selectedId === stage.id}
            onClick={() => setSelectedId(stage.id)}
            className={`rounded-md border px-3 py-2 text-left font-mono text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${selectedId === stage.id ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-muted hover:border-white/20 hover:text-ink'}`}
          >
            {stage.shortLabel} {stage.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Review lens">
          {(['workflow', 'tests', 'risk'] as ReviewLens[]).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={lens === option}
              onClick={() => setLens(option)}
              className={`rounded-md border px-3 py-2 font-mono text-xs capitalize transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${lens === option ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-muted hover:border-white/20 hover:text-ink'}`}
            >
              {option} lens
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSceneFailed(true)}
          className="font-mono text-xs text-muted underline decoration-white/20 underline-offset-4 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Use static view
        </button>
      </div>
      <p className="mt-3 font-mono text-xs text-muted">Click a block to inspect it. The static view remains available if WebGL cannot run.</p>
    </div>
  );
}
