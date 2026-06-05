"use client";

import {
  type SubmitEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

type GatedGalleryLinkProps = {
  /** Same as `PhotographyAlbumEntry.id` — keys env maps and the verify API `id` field. */
  albumId: string;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function GatedGalleryLink({
  albumId,
  children,
  className = "",
  ariaLabel,
}: GatedGalleryLinkProps) {
  const dialogTitleId = useId();
  const dialogDescId = useId();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleActivate = useCallback(() => {
    setModalOpen(true);
    setError(null);
    setPassword("");
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
    setError(null);
    setPassword("");
    setSubmitting(false);
  }, []);

  const handleSubmit = useCallback(
    async (e: SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch("/api/photography/verify-gallery-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: albumId, password }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          shareUrl?: string;
        };
        if (!res.ok) {
          setError(
            typeof data.error === "string"
              ? data.error
              : res.status === 503
                ? "This gallery is not available yet."
                : "Could not verify password.",
          );
          setSubmitting(false);
          return;
        }
        const shareUrl =
          typeof data.shareUrl === "string" ? data.shareUrl.trim() : "";
        if (!shareUrl) {
          setError("Could not open gallery link.");
          setSubmitting(false);
          return;
        }
        setModalOpen(false);
        setPassword("");
        setSubmitting(false);
        window.open(shareUrl, "_blank", "noopener,noreferrer");
      } catch {
        setError("Network error. Try again.");
        setSubmitting(false);
      }
    },
    [albumId, password],
  );

  useEffect(() => {
    if (!modalOpen) return;
    const t = window.setTimeout(() => {
      passwordInputRef.current?.focus({ preventScroll: true });
    }, 0);
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [modalOpen, handleClose]);

  return (
    <>
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        onClick={handleActivate}
      >
        {children}
      </button>

      {modalOpen ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(ev) => {
            if (ev.target === ev.currentTarget) handleClose();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescId}
            className="app-modal-dialog"
          >
            <h2 id={dialogTitleId} className="app-modal-title">
              Lightroom album
            </h2>
            <p id={dialogDescId} className="app-modal-description">
              Enter the gallery password to open the full share on Adobe
              Lightroom in a new tab.
            </p>
            <form onSubmit={handleSubmit} className="app-modal-form">
              <label className="app-modal-label">
                Password
                <input
                  ref={passwordInputRef}
                  type="password"
                  name="gallery-password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="app-modal-input"
                  disabled={submitting}
                  required
                />
              </label>
              {error ? (
                <p className="app-modal-error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="app-modal-actions">
                <button
                  type="button"
                  className="app-modal-btn-cancel"
                  onClick={handleClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="app-modal-btn-submit"
                  disabled={submitting}
                >
                  {submitting ? "Checking…" : "Open album"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
