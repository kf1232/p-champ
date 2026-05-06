import { WowPlaceholderGrid } from "./WowPlaceholderGrid";

const WOW_HOME_DESCRIPTION =
  "World of Warcraft tools and lookups for this site. Use the grid below as features are wired in.";

export function WowServiceHomeContent() {
  return (
    <>
      <div className="wow-home-intro">
        <h1 className="wow-home-title">WoW</h1>
        <p className="wow-home-desc">{WOW_HOME_DESCRIPTION}</p>
      </div>

      <WowPlaceholderGrid />
    </>
  );
}
