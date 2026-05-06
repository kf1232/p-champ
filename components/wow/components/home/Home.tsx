import { WOW_HOME_DESCRIPTION } from "./configs/wowHomeCopy";
import { WowPlaceholderGrid } from "./components/WowPlaceholderGrid";

/** WoW `/wow` home body — intro copy and feature grid. */
export function Home() {
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
