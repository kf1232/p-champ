import { useEffect, type RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
): void {
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const el = ref.current;
      if (!el || !(e.target instanceof Node) || el.contains(e.target)) {
        return;
      }
      onOutside();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [ref, onOutside]);
}
