import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CopyButton } from '@/components/ui/CopyButton';

describe('CopyButton', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders idle state with default and custom label', () => {
    const { rerender } = render(<CopyButton textToCopy="test code" />);
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();

    rerender(<CopyButton textToCopy="test code" label="Email" />);
    expect(screen.getByRole('button', { name: /copy email/i })).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('copies text, enters copied state, calls onCopied, and resets after 2000ms', async () => {
    const onCopied = vi.fn();
    render(<CopyButton textToCopy="git clone repo" onCopied={onCopied} />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('git clone repo');
    expect(onCopied).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Copied!')).toBeInTheDocument();

    // Fast-forward 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('enters error state when clipboard writeText rejects and resets after 2000ms', async () => {
    vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(new Error('Permission denied'));

    render(<CopyButton textToCopy="sensitive data" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /failed to copy/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Copy')).toBeInTheDocument();
  });

  it('handles missing clipboard API gracefully', async () => {
    const originalClipboard = navigator.clipboard;
    // @ts-expect-error simulating missing API
    delete navigator.clipboard;

    render(<CopyButton textToCopy="no clipboard" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Failed')).toBeInTheDocument();

    Object.assign(navigator, { clipboard: originalClipboard });
  });

  it('cleans up timeout on unmount without warnings', async () => {
    const { unmount } = render(<CopyButton textToCopy="clean unmount" />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied!')).toBeInTheDocument();

    unmount();

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(2000);
      });
    }).not.toThrow();
  });
});

