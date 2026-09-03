'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';

export interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  className?: string;
  onCopied?: () => void;
}

type CopyStatus = 'idle' | 'copied' | 'error';

export function CopyButton({
  textToCopy,
  label,
  className = '',
  onCopied,
}: CopyButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setStatus('copied');
        onCopied?.();
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      setStatus('error');
    }

    timerRef.current = setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const ariaLabel =
    status === 'copied'
      ? 'Copied to clipboard'
      : status === 'error'
        ? 'Failed to copy'
        : label
          ? `Copy ${label}`
          : 'Copy to clipboard';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 rounded border border-white/10 bg-panel px-2.5 py-1.5 font-mono text-xs text-ink transition-colors hover:border-white/20 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`}
    >
      {status === 'copied' ? (
        <>
          <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          <span>Copied!</span>
        </>
      ) : status === 'error' ? (
        <>
          <AlertCircle className="h-3.5 w-3.5 text-remove" aria-hidden="true" />
          <span>Failed</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
          <span>{label || 'Copy'}</span>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Copied to clipboard' : status === 'error' ? 'Failed to copy to clipboard' : ''}
      </span>
    </button>
  );
}

