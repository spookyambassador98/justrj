"use client";

export function PremiumLoader({
  active,
  text = "CONDUCTING",
}: {
  active: boolean;
  text?: string;
}) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-auto fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--bg)]"
      role="status"
      aria-live="polite"
    >
      <div className="flex w-64 flex-col gap-5 md:w-80">
        <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          <span>{text}</span>
          <span className="text-[color:var(--filament)]">001</span>
        </div>
        <div className="relative h-px w-full overflow-hidden bg-white/10">
          <div className="absolute inset-y-0 left-0 w-full origin-left animate-pulse bg-[color:var(--filament)]" />
        </div>
      </div>
    </div>
  );
}
