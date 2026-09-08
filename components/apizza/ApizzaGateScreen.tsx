"use client";

import { useRouter } from "next/navigation";
import {
  type SubmitEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { APIZZA_VERIFY_PASSWORD_PATH } from "@/lib/apizza/access/constants";

import { APIZZA_SITE_NAME } from "./configs/apizzaHomeCopy";

export function ApizzaGateScreen() {
  const router = useRouter();
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
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch(APIZZA_VERIFY_PASSWORD_PATH, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
          credentials: "same-origin",
        });
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setError(
            typeof data.error === "string" ? data.error : "Incorrect password.",
          );
          setSubmitting(false);
          return;
        }
        setPassword("");
        setSubmitting(false);
        router.refresh();
      } catch {
        setError("Network error. Try again.");
        setSubmitting(false);
      }
    },
    [password, router],
  );

  return (
    <section className="apizza-gate" aria-labelledby={titleId}>
      <h1 id={titleId} className="apizza-gate__title">
        {APIZZA_SITE_NAME}
      </h1>
      <form onSubmit={handleSubmit} className="apizza-gate__form">
        <label className="apizza-gate__label">
          Password
          <input
            ref={passwordRef}
            type="password"
            name="apizza-password"
            autoComplete="current-password"
            className="apizza-gate__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
            required
          />
        </label>
        {error ? (
          <p className="apizza-gate__error" role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" className="apizza-gate__submit" disabled={submitting}>
          {submitting ? "Checking…" : "Continue"}
        </button>
      </form>
    </section>
  );
}
