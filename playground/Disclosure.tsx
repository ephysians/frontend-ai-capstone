import { useId, useState, ReactNode } from 'react';
import './playground.css';

/**
 * Disclosure — built against the ARIA APG "Disclosure (Show/Hide)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * Required behavior implemented here:
 * - A native <button> as the trigger, so Enter and Space activation come
 *   free from the browser, nothing custom to implement or get wrong there
 * - aria-expanded reflects open/closed state
 * - aria-controls points at the disclosed content region's id
 * - Content is only rendered in the DOM when expanded (simplest correct
 *   approach; the alternative is rendering it always and toggling the
 *   `hidden` attribute, which matters more once the region needs to keep
 *   internal state while collapsed)
 */

interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((v) => !v)}
        className="pg-focusable"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'none',
          border: 'none',
          color: '#E8EAED',
          cursor: 'pointer',
          padding: '0.5rem 0',
          font: 'inherit',
        }}
      >
        <span aria-hidden="true" style={{ display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}>
          ▶
        </span>
        {summary}
      </button>
      {open && (
        <div id={contentId} style={{ padding: '0.5rem 0 0.5rem 1.5rem', color: '#8B93A1' }}>
          {children}
        </div>
      )}
    </div>
  );
}
