import {
  APIZZA_BRAND_TAGLINE_PRIMARY,
  APIZZA_BRAND_TAGLINE_SECONDARY,
} from "./configs/apizzaBrandCopy";

export function ApizzaBrandBanner() {
  return (
    <div className="apizza-brand-banner">
      <p className="apizza-brand-banner__text">{APIZZA_BRAND_TAGLINE_PRIMARY}</p>
      <p className="apizza-brand-banner__text apizza-brand-banner__text--secondary">
        {APIZZA_BRAND_TAGLINE_SECONDARY}
      </p>
    </div>
  );
}
