"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { APP_STORAGE_KEYS, appLocalStorage } from "@/lib/storage";
import {
  applyColorSchemeToDocument,
  persistColorSchemeOnClient,
  reconcileColorSchemeFromDocument,
  resolveColorScheme,
  type ColorScheme,
} from "@/lib/theme/colorScheme";

const colorSchemeStorage = appLocalStorage(APP_STORAGE_KEYS.colorScheme);

type ColorSchemeContextValue = {
  scheme: ColorScheme;
  setScheme: (scheme: ColorScheme) => void;
  toggleScheme: () => void;
};

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null);

function readStoredScheme(): ColorScheme {
  return resolveColorScheme(colorSchemeStorage.read());
}

function getSnapshot(): ColorScheme {
  return readStoredScheme();
}


function subscribe(listener: () => void): () => void {
  return colorSchemeStorage.subscribe(listener);
}

export function ColorSchemeProvider({
  children,
  initialScheme = "light",
}: {
  children: ReactNode;
  initialScheme?: ColorScheme;
}) {
  const scheme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => initialScheme,
  );

  const setScheme = useCallback((next: ColorScheme) => {
    persistColorSchemeOnClient(next, (value) => colorSchemeStorage.write(value));
  }, []);

  const toggleScheme = useCallback(() => {
    setScheme(scheme === "dark" ? "light" : "dark");
  }, [scheme, setScheme]);

  useEffect(() => {
    reconcileColorSchemeFromDocument(
      () => colorSchemeStorage.read(),
      (value) => colorSchemeStorage.write(value),
    );
  }, []);

  useEffect(() => {
    applyColorSchemeToDocument(scheme);
  }, [scheme]);

  const value = useMemo(
    () => ({ scheme, setScheme, toggleScheme }),
    [scheme, setScheme, toggleScheme],
  );

  return (
    <ColorSchemeContext.Provider value={value}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme(): ColorSchemeContextValue {
  const ctx = useContext(ColorSchemeContext);
  if (!ctx) {
    throw new Error("useColorScheme must be used within ColorSchemeProvider");
  }
  return ctx;
}
