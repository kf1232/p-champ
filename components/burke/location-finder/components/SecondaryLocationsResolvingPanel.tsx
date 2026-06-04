type SecondaryLocationsResolvingPanelProps = {
  count: number;
};

export function SecondaryLocationsResolvingPanel({
  count,
}: SecondaryLocationsResolvingPanelProps) {
  const label = count === 1 ? "location" : "locations";

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-md border border-black/15 bg-white/50 px-6 py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="h-6 w-6 animate-spin rounded-full border-2 border-black/15 border-t-black/60"
        aria-hidden
      />
      <p className="text-sm text-black/70">
        Resolving {count} {label}…
      </p>
      <p className="max-w-sm text-center text-xs text-black/45">
        Addresses are geocoded in batch before the list is shown.
      </p>
    </div>
  );
}
