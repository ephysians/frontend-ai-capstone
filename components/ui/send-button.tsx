"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send, Loader2, Check, RotateCcw } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

interface SendButtonProps {
  label?: string;
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  action: () => Promise<void>;
  successHoldMs?: number;
  className?: string;
}

const STATUS_ANNOUNCEMENT: Record<Status, string> = {
  idle: "",
  loading: "Sending message",
  success: "Message sent",
  error: "Failed to send. Retry available.",
};

export function SendButton({
  label = "Send",
  loadingLabel = "Sending…",
  successLabel = "Sent",
  errorLabel = "Retry",
  action,
  successHoldMs = 1400,
  className = "",
}: SendButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const requestId = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const trigger = useCallback(async () => {
    if (status === "loading") return;

    if (resetTimer.current) {
      clearTimeout(resetTimer.current);
      resetTimer.current = null;
    }

    const id = ++requestId.current;
    setStatus("loading");

    try {
      await action();
      if (id !== requestId.current) return;
      setStatus("success");
      resetTimer.current = setTimeout(() => {
        if (id === requestId.current) setStatus("idle");
      }, successHoldMs);
    } catch {
      if (id !== requestId.current) return;
      setStatus("error");
    }
  }, [status, action, successHoldMs]);

  const isDisabled = status === "loading";
  const visibleLabel =
    status === "loading"
      ? loadingLabel
      : status === "success"
        ? successLabel
        : status === "error"
          ? errorLabel
          : label;

  return (
    <button
      type="button"
      onClick={trigger}
      disabled={isDisabled}
      aria-busy={status === "loading"}
      data-status={status}
      className={`send-button inline-flex min-w-[8.5rem] items-center justify-center gap-2 rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-base disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
    >
      <span
        className="send-button__icon"
        aria-hidden="true"
        key={`icon-${status}`}
      >
        {status === "loading" && (
          <Loader2 size={16} className="send-button__spinner" />
        )}
        {status === "success" && <Check size={16} />}
        {status === "error" && <RotateCcw size={16} />}
        {status === "idle" && <Send size={16} />}
      </span>
      <span className="send-button__label" key={`label-${status}`}>
        {visibleLabel}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {STATUS_ANNOUNCEMENT[status]}
      </span>
    </button>
  );
}
