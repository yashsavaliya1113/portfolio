"use client";

interface Props {
  label: string;
  value: string;
}

export function MetricCard({ label, value }: Props) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
      <div className="font-heading text-2xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-sm text-[var(--color-muted)]">{label}</div>
    </div>
  );
}
