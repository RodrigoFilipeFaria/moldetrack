"use client";

import { useRef, type FormEvent, type ReactNode } from "react";

export default function PinConfirmForm({
  action,
  hidden,
  className,
  children,
  confirmMessage = "Tens a certeza?",
}: {
  action: (formData: FormData) => void;
  hidden?: Record<string, string>;
  className?: string;
  children: ReactNode;
  confirmMessage?: string;
}) {
  const pinRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmMessage)) {
      e.preventDefault();
      return;
    }
    const pin = window.prompt("Introduz o PIN de 4 dígitos:");
    if (!pin) {
      e.preventDefault();
      return;
    }
    if (pinRef.current) pinRef.current.value = pin;
  }

  return (
    <form action={action} onSubmit={handleSubmit} className={className}>
      {hidden &&
        Object.entries(hidden).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
      <input type="hidden" name="pin" ref={pinRef} />
      {children}
    </form>
  );
}
