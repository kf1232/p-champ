import {
  APIZZA_COMING_TO_AUSTIN,
  APIZZA_OPENING_SOON,
} from "./configs/apizzaHomeCopy";
import { ApizzaLocationBlock } from "./ApizzaLocationBlock";
import { ApizzaLocationMap } from "./ApizzaLocationMap";
import { ApizzaProsePage } from "./ApizzaProsePage";

export function ApizzaLocationsScreen() {
  return (
    <ApizzaProsePage title={APIZZA_OPENING_SOON}>
      <div className="apizza-locations-split">
        <div className="apizza-locations-split__copy">
          <p className="apizza-prose__p">{APIZZA_COMING_TO_AUSTIN}</p>
          <ApizzaLocationBlock variant="prose" />
        </div>
        <ApizzaLocationMap />
      </div>
    </ApizzaProsePage>
  );
}
