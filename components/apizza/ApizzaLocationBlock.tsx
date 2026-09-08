import {
  APIZZA_ADDRESS_LINES,
  APIZZA_DIRECTIONS_HREF,
  APIZZA_DIRECTIONS_LABEL,
  APIZZA_HOURS,
  APIZZA_HOURS_LABEL,
} from "./configs/apizzaHomeCopy";

type ApizzaLocationBlockProps = {
  variant?: "hero" | "prose";
};

export function ApizzaLocationBlock({ variant = "hero" }: ApizzaLocationBlockProps) {
  const showHours = variant === "prose";

  return (
    <div
      className={[
        "apizza-location",
        variant === "hero" ? "apizza-location--hero" : "apizza-location--prose",
      ].join(" ")}
    >
      <p className="apizza-location__address">
        {APIZZA_ADDRESS_LINES.map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <a
        href={APIZZA_DIRECTIONS_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="apizza-location__directions"
      >
        {APIZZA_DIRECTIONS_LABEL}
      </a>
      {showHours ? (
        <div className="apizza-location__hours" aria-label={APIZZA_HOURS_LABEL}>
          <p className="apizza-location__hours-label">{APIZZA_HOURS_LABEL}</p>
          <ul className="apizza-location__hours-list">
            {APIZZA_HOURS.map((entry) => (
              <li key={entry.day} className="apizza-location__hours-row">
                <span className="apizza-location__hours-day">{entry.day}</span>
                <span className="apizza-location__hours-time">{entry.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
