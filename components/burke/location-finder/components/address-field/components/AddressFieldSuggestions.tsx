import type { GeocodeSuggestion } from "@/lib/burke/geo/types";

type AddressFieldSuggestionsProps = {
  listId: string;
  open: boolean;
  suggestions: GeocodeSuggestion[];
  highlight: number;
  onMouseDownOption: () => void;
  onPick: (suggestion: GeocodeSuggestion) => void;
};

export function AddressFieldSuggestions({
  listId,
  open,
  suggestions,
  highlight,
  onMouseDownOption,
  onPick,
}: AddressFieldSuggestionsProps) {
  if (!open || suggestions.length === 0) {
    return null;
  }

  return (
    <ul
      id={listId}
      role="listbox"
      className="z-10 max-h-48 overflow-auto rounded-md border border-black/15 bg-white py-1 shadow-md"
    >
      {suggestions.map((row, i) => (
        <li key={row.placeId} role="presentation">
          <button
            type="button"
            role="option"
            aria-selected={highlight === i}
            className={[
              "w-full px-3 py-2 text-left text-sm text-black hover:bg-black/[0.04]",
              highlight === i ? "bg-black/[0.06]" : "",
            ].join(" ")}
            onMouseDown={onMouseDownOption}
            onClick={() => onPick(row)}
          >
            {row.formatted}
          </button>
        </li>
      ))}
    </ul>
  );
}
