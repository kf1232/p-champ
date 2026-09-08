import {
  APIZZA_BORN_BODY,
  APIZZA_BORN_HEADING,
} from "./configs/apizzaBrandCopy";
import { APIZZA_ABOUT_PARAGRAPHS } from "./configs/apizzaHomeCopy";

export function ApizzaAbout() {
  return (
    <section className="apizza-body apizza-about" aria-labelledby="apizza-about-heading">
      <div className="apizza-about__copy">
        <h1 id="apizza-about-heading" className="apizza-about__heading">
          {APIZZA_BORN_HEADING}
        </h1>
        <p className="apizza-about__p">{APIZZA_BORN_BODY}</p>
        {APIZZA_ABOUT_PARAGRAPHS.map((paragraph) => (
          <p key={paragraph} className="apizza-about__p">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="apizza-about__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/apizza/about-pizza.jpg"
          alt=""
          className="apizza-about__photo"
        />
      </div>
    </section>
  );
}
