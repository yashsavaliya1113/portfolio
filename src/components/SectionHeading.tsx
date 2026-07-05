interface Props {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-12 animate-fade-up" style={{ animationFillMode: "both" }}>
      <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-[var(--color-muted)]">{subtitle}</p>
      )}
    </div>
  );
}
