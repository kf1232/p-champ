"use client";

import { useColorScheme } from "./ColorSchemeProvider";

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const TOGGLE_BY_SCHEME = {
  dark: {
    Icon: SunIcon,
    label: "Light",
    ariaLabel: "Switch to light mode",
    title: "Light mode",
  },
  light: {
    Icon: MoonIcon,
    label: "Dark",
    ariaLabel: "Switch to dark mode",
    title: "Dark mode",
  },
} as const;

/** Header control — switches `data-color-scheme` on `<html>`. */
export function ColorSchemeToggle() {
  const { scheme, toggleScheme } = useColorScheme();
  const { Icon, label, ariaLabel, title } = TOGGLE_BY_SCHEME[scheme];

  return (
    <button
      type="button"
      className="header-light-dark-toggle"
      suppressHydrationWarning
      onClick={toggleScheme}
      aria-label={ariaLabel}
      title={title}
    >
      <Icon />
      <span className="header-light-dark-toggle__label">{label}</span>
    </button>
  );
}
