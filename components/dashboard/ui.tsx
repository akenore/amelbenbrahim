"use client";

import { useFormStatus } from "react-dom";

/** Submit button that asks for confirmation first (destructive actions). */
export function ConfirmSubmit({
  children,
  message,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

export function PendingSubmit({
  children,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-label={ariaLabel} className={`${className} disabled:opacity-50`}>
      {children}
    </button>
  );
}
