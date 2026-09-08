import {
  APIZZA_DOUGH_HEADING,
  APIZZA_DOUGH_PARAGRAPHS,
  APIZZA_INGREDIENTS_CRUST_HEADING,
  APIZZA_INGREDIENTS_SECTIONS,
  APIZZA_MORE_INGREDIENTS,
  APIZZA_MORE_INGREDIENTS_HEADING,
  APIZZA_OIL_FLAVORS,
  APIZZA_OILS_HEADING,
  APIZZA_OILS_INTRO,
} from "./configs/apizzaBrandCopy";
import { ApizzaProsePage } from "./ApizzaProsePage";

export function ApizzaIngredientsScreen() {
  return (
    <ApizzaProsePage title={APIZZA_INGREDIENTS_CRUST_HEADING}>
      {APIZZA_INGREDIENTS_SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2 className="apizza-prose__sub">{section.heading}</h2>
          <p className="apizza-prose__p">{section.body}</p>
        </section>
      ))}
      <h2 className="apizza-prose__sub">{APIZZA_DOUGH_HEADING}</h2>
      {APIZZA_DOUGH_PARAGRAPHS.map((paragraph) => (
        <p key={paragraph} className="apizza-prose__p">
          {paragraph}
        </p>
      ))}
      <h2 className="apizza-prose__sub">{APIZZA_MORE_INGREDIENTS_HEADING}</h2>
      {APIZZA_MORE_INGREDIENTS.map((section) => (
        <section key={section.heading}>
          <h3 className="apizza-prose__sub">{section.heading}</h3>
          <p className="apizza-prose__p">{section.body}</p>
        </section>
      ))}
      <h2 className="apizza-prose__sub">{APIZZA_OILS_HEADING}</h2>
      <p className="apizza-prose__p">{APIZZA_OILS_INTRO}</p>
      {APIZZA_OIL_FLAVORS.map((flavor) => (
        <h3 key={flavor} className="apizza-prose__sub">
          {flavor}
        </h3>
      ))}
    </ApizzaProsePage>
  );
}
