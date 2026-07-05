interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function Loader({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`${sizes[size]} animate-spin rounded-full border-[var(--color-border)] border-t-primary ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-bg)]/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Loader size="lg" />
        <p className="text-sm text-[var(--color-muted)]">Loading...</p>
      </div>
    </div>
  );
}
