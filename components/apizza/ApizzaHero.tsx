import {
  APIZZA_COMING_TO_AUSTIN,
  APIZZA_HERO_IMAGE,
  APIZZA_HERO_LAYOUT,
  APIZZA_OPENING_SOON,
} from "./configs/apizzaHomeCopy";
import { ApizzaLocationBlock } from "./ApizzaLocationBlock";

export function ApizzaHero() {
  return (
    <section
      className={`apizza-body apizza-hero apizza-hero--${APIZZA_HERO_LAYOUT}`}
      aria-labelledby="apizza-opening-soon"
    >
      <div className="apizza-hero__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="apizza-hero__photo"
          src={APIZZA_HERO_IMAGE.src}
          alt={APIZZA_HERO_IMAGE.alt}
        />
      </div>
      <div className="apizza-hero__content">
        <div className="apizza-hero__opening">
          <h1 id="apizza-opening-soon" className="apizza-hero__title">
            {APIZZA_OPENING_SOON}
          </h1>
          <p className="apizza-hero__tagline">{APIZZA_COMING_TO_AUSTIN}</p>
          <ApizzaLocationBlock variant="hero" />
        </div>
      </div>
    </section>
  );
}
