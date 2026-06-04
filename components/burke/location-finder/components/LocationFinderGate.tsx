"use client";

import {
  type SubmitEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { BURKE_VERIFY_LOCATION_FINDER_PASSWORD_PATH } from "@/lib/burke";

import { LOCATION_FINDER_INPUT_CLASS } from "../configs/locationFinderStyles";
import { LOCATION_FINDER_TITLE } from "../configs/locationFinderCopy";

type LocationFinderGateProps = {
  configured: boolean;
  onGranted: () => void;
};

export function LocationFinderGate({
  configured,
  onGranted,
}: LocationFinderGateProps) {
  const titleId = useId();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    passwordRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = useCallback(
    async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!configured) {
        return;
      }
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch(BURKE_VERIFY_LOCATION_FINDER_PASSWORD_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          credentials: "same-origin",
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(
            typeof data.error === "string"
              ? data.error
              : res.status === 503
                ? "Location Finder is not available."
                : "Incorrect password.",
          );
          setSubmitting(false);
          return;
        }
        setPassword("");
        setSubmitting(false);
        onGranted();
      } catch {
        setError("Network error. Try again.");
        setSubmitting(false);
      }
    },
    [configured, onGranted, password],
  );

  return (
    <section
      className="mx-auto flex w-full max-w-md flex-col gap-6 pt-16"
      aria-labelledby={titleId}
    >
      <div className="flex flex-col gap-2 text-center">
        <h1
          id={titleId}
          className="text-2xl font-semibold tracking-tight text-primary"
        >
          {LOCATION_FINDER_TITLE}
        </h1>
        <p className="text-sm text-secondary">
          {configured
            ? "Enter the password to continue."
            : "Location Finder is not configured on this server."}
        </p>
      </div>

      {configured ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <label className="flex w-full max-w-sm flex-col gap-1.5 text-left text-sm font-medium text-primary">
            Password
            <input
              ref={passwordRef}
              type="password"
              name="location-finder-password"
              autoComplete="current-password"
              className={`${LOCATION_FINDER_INPUT_CLASS} max-w-sm`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              required
            />
          </label>
          {error ? (
            <p className="w-full max-w-sm text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Checking…" : "Continue"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
