interface Props {
  name: string;
  index?: number;
}

export function SkillBadge({ name }: Props) {
  return (
    <span
      className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
    >
      {name}
    </span>
  );
}
