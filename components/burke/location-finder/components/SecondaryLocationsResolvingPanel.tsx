type SecondaryLocationsResolvingPanelProps = {
  count: number;
};

export function SecondaryLocationsResolvingPanel({
  count,
}: SecondaryLocationsResolvingPanelProps) {
  const label = count === 1 ? "location" : "locations";

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-md border border-border-default bg-surface-overlay px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-border-default border-t-black/60"
        aria-hidden
      />
      <p className="text-sm text-secondary">
        Resolving {count} {label}…
      </p>
      <p className="max-w-sm text-center text-xs text-tertiary">
        Addresses are geocoded in batch before the list is shown.
      </p>
    </div>
  );
}
