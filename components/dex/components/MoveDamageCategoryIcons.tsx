/**
 * Main-series-style damage category marks: physical (orange impact) vs special (blue rings).
 * Same visual language as move lists (physical / special), not move types.
 */
export function PhysicalDamageCategoryIcon({
  className = "h-3.5 w-3.5 shrink-0",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 1l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5z"
      />
    </svg>
  );
}

export function SpecialDamageCategoryIcon({
  className = "h-3.5 w-3.5 shrink-0",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="8" r="1.15" fill="currentColor" />
    </svg>
  );
}

/** Compact speed / initiative mark (wind lines). */
export function SpeedStatIcon({
  className = "h-3.5 w-3.5 shrink-0",
}: {
  className?: string;
}) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M2.5 9.25h4.25L5.5 14 13.5 6.75H9.25L10.5 2 2.5 9.25z"
      />
    </svg>
  );
}
