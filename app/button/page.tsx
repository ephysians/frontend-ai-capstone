"use client";

import { useState } from "react";
import { SendButton } from "@/components/ui/send-button";

type ForceMode = "random" | "success" | "error";

function fakeSend(mode: ForceMode): Promise<void> {
  const delay = 500 + Math.random() * 900; // 500–1400ms, feels like a real round trip
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fail =
        mode === "error" || (mode === "random" && Math.random() < 0.2);
      if (fail) reject(new Error("Simulated failure"));
      else resolve();
    }, delay);
  });
}

export default function ButtonsPage() {
  const [mode, setMode] = useState<ForceMode>("random");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 sm:py-24">
      <h1 className="font-display font-semibold text-2xl text-ink mb-2">
        Buttons with a brain
      </h1>
      <p className="text-muted mb-8">
        A Send button that communicates its own lifecycle through state and
        motion, not just a decorated click target. Every click runs a fake
        network call with a randomized delay and roughly a 20% failure rate.
      </p>

      <section className="mb-10">
        <p className="font-mono text-xs text-muted uppercase tracking-wide mb-3">
          test controls
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {(["random", "success", "error"] as ForceMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
                mode === m
                  ? "border-accent text-accent bg-accent/10"
                  : "border-white/10 text-muted hover:border-white/20 hover:text-ink"
              }`}
            >
              {m === "random"
                ? "Random (~20% fail)"
                : m === "success"
                  ? "Force success"
                  : "Force failure"}
            </button>
          ))}
        </div>

        <SendButton action={() => fakeSend(mode)} />
      </section>

      <section className="border-t border-white/10 pt-8">
        <h2 className="font-display text-lg text-ink mb-3">
          Why these durations and easings
        </h2>
        <div className="text-sm text-ink/80 leading-relaxed space-y-3">
          <p>
            Hover and focus use a fast 150ms ease-out nudge, quick enough to
            feel like a direct response to the pointer rather than a separate
            animated event.
          </p>
          <p>
            The idle-to-loading swap uses a 200ms fade-and-slide instead of an
            instant text replacement, so the label change reads as continuous
            rather than a flicker. The spinner rotates at a steady 900ms linear
            pace, deliberately unhurried so it reads as &ldquo;in
            progress&rdquo; rather than urgent.
          </p>
          <p>
            Success holds for about 1.4 seconds, long enough to register as a
            real outcome before the button eases back to idle on its own, short
            enough not to block reuse. The checkmark pops in with a slight
            overshoot because a small overshoot reads as more resolved than a
            linear scale.
          </p>
          <p>
            Error adds a brief 400ms shake to the icon, a physical cue that
            something went wrong, paired with the label switching to
            &ldquo;Retry&rdquo; so recovery is explicit rather than implied.
          </p>
          <p>
            With{" "}
            <code className="font-mono text-xs">prefers-reduced-motion</code>{" "}
            enabled, every transition, the shake, the checkmark pop, and the
            spinner rotation are removed entirely. State is still fully
            communicated through the label text and icon swap, so nothing
            essential depends on motion.
          </p>
        </div>
      </section>
    </div>
  );
}
