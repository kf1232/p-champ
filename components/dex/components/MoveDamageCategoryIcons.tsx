/**
 * Main-series-style damage category marks: physical (orange impact) vs special (blue rings).
 * Same visual language as move lists (physical / special), not move types.
 */
export function PhysicalDamageCategoryIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={14}
      height={14}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M8 1l1.5 4.5L14 8l-4.5 1.5L8 14l-1.5-4.5L2 8l4.5-1.5z"
      />
    </svg>
  );
}

export function SpecialDamageCategoryIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      width={14}
      height={14}
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="3.25" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <circle cx="8" cy="8" r="1.15" fill="currentColor" />
    </svg>
  );
}
