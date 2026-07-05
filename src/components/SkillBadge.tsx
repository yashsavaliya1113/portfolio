interface Props {
  name: string;
  index?: number;
}

export function SkillBadge({ name, index = 0 }: Props) {
  return (
    <span
      className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-all duration-200 hover:bg-primary/20 hover:-translate-y-0.5 animate-fade-up-sm"
      style={{ animationDelay: `${index * 0.03}s`, animationFillMode: "both" }}
    >
      {name}
    </span>
  );
}
