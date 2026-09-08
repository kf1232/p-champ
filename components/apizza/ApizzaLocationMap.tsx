import { APIZZA_ADDRESS_MAP_QUERY } from "./configs/apizzaHomeCopy";

function apizzaMapEmbedSrc(): string {
  const params = new URLSearchParams({
    q: APIZZA_ADDRESS_MAP_QUERY,
    output: "embed",
  });

  return `https://www.google.com/maps?${params.toString()}`;
}

export function ApizzaLocationMap() {
  return (
    <div className="apizza-location-map">
      <iframe
        title={APIZZA_ADDRESS_MAP_QUERY}
        src={apizzaMapEmbedSrc()}
        className="apizza-location-map__frame"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
