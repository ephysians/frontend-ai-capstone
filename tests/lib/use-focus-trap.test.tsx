import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { useFocusTrap } from '../../lib/use-focus-trap';

function TestModal({ isOpen, onClose }: { isOpen: boolean; onClose?: () => void }) {
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div ref={containerRef} data-testid="modal-container">
      <button data-testid="btn-first">First</button>
      <input data-testid="input-middle" type="text" />
      <button data-testid="btn-last">Last</button>
    </div>
  );
}

function EmptyModal({ isOpen }: { isOpen: boolean }) {
  const containerRef = useFocusTrap<HTMLDivElement>(isOpen);
  if (!isOpen) return null;
  return <div ref={containerRef} data-testid="empty-container">Static Text No Inputs</div>;
}

describe('useFocusTrap', () => {
  it('autofocuses first focusable element when opened', () => {
    render(<TestModal isOpen={true} />);
    expect(screen.getByTestId('btn-first')).toHaveFocus();
  });

  it('traps focus when tabbing forward from last element to first', async () => {
    const user = userEvent.setup();
    render(<TestModal isOpen={true} />);

    const lastBtn = screen.getByTestId('btn-last');
    const firstBtn = screen.getByTestId('btn-first');

    lastBtn.focus();
    expect(lastBtn).toHaveFocus();

    await user.tab();
    expect(firstBtn).toHaveFocus();
  });

  it('traps focus when tabbing backward from first element to last', async () => {
    const user = userEvent.setup();
    render(<TestModal isOpen={true} />);

    const firstBtn = screen.getByTestId('btn-first');
    const lastBtn = screen.getByTestId('btn-last');

    firstBtn.focus();
    expect(firstBtn).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastBtn).toHaveFocus();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<TestModal isOpen={true} onClose={handleClose} />);

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('handles containers with zero focusable elements without error', () => {
    expect(() => {
      render(<EmptyModal isOpen={true} />);
    }).not.toThrow();
  });
});
