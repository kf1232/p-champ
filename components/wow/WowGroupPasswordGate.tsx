import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useId,
  useState,
} from "react";

type WowGroupPasswordGateProps = {
  groupId: string;
  groupName: string;
  scheduleLabel: string;
  /** Wrapped in full-page centering layout (default). `compact` is for modal embedding. */
  variant?: "page" | "compact";
  /** After verify, navigate here instead of `router.refresh()` (e.g. roster detail URL). */
  afterSuccessHref?: string;
  /** Optional id for the title heading (e.g. modal aria-labelledby). */
  titleId?: string;
};

export function WowGroupPasswordGate({
  groupId,
  groupName,
  scheduleLabel,
  variant = "page",
  afterSuccessHref,
  titleId: titleIdProp,
}: WowGroupPasswordGateProps) {
  const router = useRouter();
  const genTitleId = useId();
  const titleId = titleIdProp ?? genTitleId;
  const passwordFieldId = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch("/api/wow/verify-group-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId, password }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!res.ok) {
          setError(
            typeof data.error === "string"
              ? data.error
              : "Could not verify password.",
          );
          setSubmitting(false);
          return;
        }
        setPassword("");
        if (afterSuccessHref) {
          router.replace(afterSuccessHref);
        } else {
          router.refresh();
        }
      } catch {
        setError("Network error. Try again.");
      } finally {
        setSubmitting(false);
      }
    },
    [groupId, password, router, afterSuccessHref],
  );

  const TitleTag = variant === "compact" ? "h2" : "h1";

  const card = (
    <div
      className="wow-group-gate-card"
      {...(variant === "compact"
        ? {}
        : { role: "region" as const, "aria-labelledby": titleId })}
    >
      <TitleTag id={titleId} className="wow-group-gate-title">
        {groupName}
      </TitleTag>
      <p className="wow-group-gate-schedule">{scheduleLabel}</p>
      <p className="wow-group-gate-lead">
        Enter the group password to view this roster.
      </p>
      <form className="wow-group-gate-form" onSubmit={onSubmit}>
        <label className="wow-group-gate-label" htmlFor={passwordFieldId}>
          Password
        </label>
        <input
          id={passwordFieldId}
          className="wow-group-gate-input"
          type="password"
          name="wow-group-password"
          autoComplete="current-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          disabled={submitting}
          required
        />
        {error ? (
          <p className="wow-group-gate-error" role="alert">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="wow-group-gate-submit"
          disabled={submitting}
        >
          {submitting ? "Checking…" : "Unlock roster"}
        </button>
      </form>
    </div>
  );

  if (variant === "compact") {
    return card;
  }

  return <div className="wow-group-gate">{card}</div>;
}