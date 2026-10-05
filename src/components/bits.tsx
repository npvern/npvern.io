import { isTodo, type Project, type Text } from "@/content/site";

export function StatusLabel({ status }: { status: Project["status"] }) {
  const live = status === "In progress";
  return (
    <span className={`inline-flex items-center gap-2 ${live ? "text-signal" : "text-ink-muted"}`}>
      {live && <span className="h-1.5 w-1.5 rounded-full bg-signal" aria-hidden />}
      {status}
    </span>
  );
}

export function Tags({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Tools and methods">
      {items.map((t) => (
        <li
          key={t}
          className="rounded-full border border-rule bg-surface px-3 py-1 font-mono text-[0.75rem] text-ink-muted"
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Renders real text, or a dashed placeholder for content still to be written. */
export function T({ value }: { value: Text }) {
  if (isTodo(value)) {
    return (
      <span className="inline-block border border-dashed border-blueprint/70 bg-blueprint-wash px-2 font-mono text-[0.85em] text-blueprint">
        Placeholder: {value.todo}
      </span>
    );
  }
  return <>{value}</>;
}
