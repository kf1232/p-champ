import {
  APIZZA_LOVING_CUP_BODY,
  APIZZA_LOVING_CUP_EXTERNAL_HREF,
  APIZZA_LOVING_CUP_HEADING,
  APIZZA_NAV_LOVING_CUP,
} from "./configs/apizzaBrandCopy";

export function ApizzaLovingCupScreen() {
  return (
    <article className="apizza-body apizza-prose" aria-labelledby="apizza-loving-cup-title">
      <h1 id="apizza-loving-cup-title" className="sr-only">
        {APIZZA_NAV_LOVING_CUP}
      </h1>
      <div className="apizza-prose__menu">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/apizza/loving-cup.jpg"
          alt={APIZZA_NAV_LOVING_CUP}
          className="apizza-prose__menu-img"
        />
      </div>
      <div className="apizza-prose__copy">
        <h2 className="apizza-prose__title apizza-prose__title--in-copy">
          {APIZZA_LOVING_CUP_HEADING}
        </h2>
        <p className="apizza-prose__p">{APIZZA_LOVING_CUP_BODY}</p>
        <p className="apizza-prose__p">
          <a
            href={APIZZA_LOVING_CUP_EXTERNAL_HREF}
            target="_blank"
            rel="noreferrer"
            className="apizza-prose__link"
          >
            {APIZZA_NAV_LOVING_CUP}
          </a>
        </p>
      </div>
    </article>
  );
}
