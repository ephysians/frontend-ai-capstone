import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useChat } from '@ai-sdk/react';
import { Chat } from '@/components/Chat';
import {
  assistantTextMessage,
  toolInputAvailableMessage,
  toolInputStreamingMessage,
  toolOutputAvailableMessage,
  toolOutputErrorMessage,
} from '../mocks/chat-fixtures';

vi.mock('@ai-sdk/react', () => ({
  useChat: vi.fn(),
}));

const mockedUseChat = vi.mocked(useChat);

function mockChat(overrides: Record<string, unknown> = {}) {
  const value = {
    messages: [],
    status: 'ready',
    error: undefined,
    sendMessage: vi.fn(),
    stop: vi.fn(),
    regenerate: vi.fn(),
    clearError: vi.fn(),
    ...overrides,
  };

  mockedUseChat.mockReturnValue(value as never);
  return value;
}

describe('Chat', () => {
  beforeEach(() => {
    mockChat();
  });

  it('renders assistant text messages as visible conversation content', () => {
    mockChat({ messages: [assistantTextMessage] });

    render(<Chat />);

    expect(screen.getByText('The workflow is documented and reviewable.')).toBeVisible();
  });

  it('shows the tool lookup state while tool input is streaming', () => {
    mockChat({ messages: [toolInputStreamingMessage] });

    render(<Chat />);

    expect(screen.getByText('reading question...')).toBeVisible();
  });

  it('shows the tool lookup topic and skeleton while a result is pending', () => {
    mockChat({ messages: [toolInputAvailableMessage] });

    render(<Chat />);

    expect(screen.getByText('looking up: workflow')).toBeVisible();
  });

  it('renders all structured fields when a tool result is available', () => {
    mockChat({ messages: [toolOutputAvailableMessage] });

    render(<Chat />);

    expect(screen.getByRole('heading', { name: 'Building a repeatable AI-assisted engineering workflow' })).toBeVisible();
    expect(screen.getByText('The process did not scale.')).toBeVisible();
    expect(screen.getByText('Adopted a deliberate workflow.')).toBeVisible();
    expect(screen.getByText('Caught a browser module mismatch before shipping.')).toBeVisible();
  });

  it('shows an accessible tool error when a lookup fails', () => {
    mockChat({ messages: [toolOutputErrorMessage] });

    render(<Chat />);

    expect(screen.getByRole('alert')).toHaveTextContent('Could not find a case study');
  });

  it('shows pending feedback and replaces send with stop while submitted', () => {
    mockChat({ status: 'submitted' });

    render(<Chat />);

    expect(screen.getByRole('status', { name: 'Assistant is thinking' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeEnabled();
    expect(screen.getByRole('textbox', { name: 'Message' })).toBeDisabled();
  });

  it('shows streamed assistant text and keeps stop available', () => {
    mockChat({ status: 'streaming', messages: [assistantTextMessage] });

    render(<Chat />);

    expect(screen.getByText('The workflow is documented and reviewable.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Stop generating' })).toBeEnabled();
  });

  it('shows an error and lets the user retry the failed response', async () => {
    const user = userEvent.setup();
    const value = mockChat({ error: new Error('stream failed') });

    render(<Chat />);

    expect(screen.getByRole('alert')).toHaveTextContent('The model returned an error mid-stream');
    await user.click(screen.getByRole('button', { name: 'Retry the last failed message' }));
    expect(value.clearError).toHaveBeenCalledOnce();
    expect(value.regenerate).toHaveBeenCalledOnce();
  });

  it('validates the message field on blur and enables submission for valid input', async () => {
    const user = userEvent.setup();
    const value = mockChat();

    render(<Chat />);

    const field = screen.getByRole('textbox', { name: 'Message' });
    const send = screen.getByRole('button', { name: 'Send message' });
    await user.click(field);
    await user.tab();

    expect(screen.getByRole('alert')).toHaveTextContent('Message is required.');
    expect(field).toHaveAttribute('aria-invalid', 'true');
    expect(send).toBeDisabled();

    await user.type(field, 'workflow');
    expect(field).toHaveAttribute('aria-invalid', 'false');
    expect(send).toBeEnabled();
    await user.click(send);
    expect(value.sendMessage).toHaveBeenCalledWith({ text: 'workflow' });
  });
});
