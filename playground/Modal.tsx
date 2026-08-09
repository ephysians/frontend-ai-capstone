import { useEffect, useRef, ReactNode } from 'react';
import './playground.css';

/**
 * Modal — built against the ARIA APG "Dialog (Modal)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * Required behavior implemented here:
 * - role="dialog", aria-modal="true", aria-labelledby pointing at the title
 * - Focus moves into the dialog when it opens
 * - Focus is trapped inside the dialog while open (Tab/Shift+Tab cycle)
 * - Escape closes the dialog
 * - Focus returns to whatever triggered the dialog when it closes
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ isOpen, onClose, titleId, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Remember what had focus before the dialog opened, so we can restore it.
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Move focus into the dialog. The dialog container itself is focusable
    // (tabIndex={-1} + focus()) so there's always a safe fallback even if
    // the dialog happens to render with no focusable children yet.
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    if (focusables && focusables.length > 0) {
      focusables[0].focus();
    } else {
      dialogRef.current?.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      // Focus trap: keep Tab/Shift+Tab cycling within the dialog's
      // focusable elements instead of leaking out to the page behind it.
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!nodes || nodes.length === 0) {
        e.preventDefault();
        return;
      }

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus to whatever opened the dialog. Without this, keyboard
      // users lose their place in the page entirely after closing.
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      // Click on the backdrop closes the dialog, same as Escape.
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="pg-focusable"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#171A21',
          color: '#E8EAED',
          borderRadius: 8,
          padding: '1.5rem',
          minWidth: 320,
          maxWidth: '90vw',
        }}
      >
        <h2 id={titleId} style={{ margin: '0 0 1rem', fontSize: '1.25rem' }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
