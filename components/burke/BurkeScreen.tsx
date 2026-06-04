import { BurkePlaceholderGrid } from "./BurkePlaceholderGrid";
import { BURKE_TITLE } from "./configs/burkeHomeCopy";

export function BurkeScreen() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight text-primary">
        {BURKE_TITLE}
      </h1>

      <BurkePlaceholderGrid />
    </>
  );
}
