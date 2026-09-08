import { APIZZA_COMING_TO_AUSTIN, APIZZA_OPENING_SOON } from "./configs/apizzaHomeCopy";
import { APIZZA_ORDER_HEADING } from "./configs/apizzaBrandCopy";
import { ApizzaLocationBlock } from "./ApizzaLocationBlock";
import { ApizzaProsePage } from "./ApizzaProsePage";

export function ApizzaOrderScreen() {
  return (
    <ApizzaProsePage title={APIZZA_ORDER_HEADING}>
      <p className="apizza-prose__p">{APIZZA_OPENING_SOON}</p>
      <p className="apizza-prose__p">{APIZZA_COMING_TO_AUSTIN}</p>
      <ApizzaLocationBlock variant="prose" />
    </ApizzaProsePage>
  );
}
