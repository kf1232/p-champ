type AppPageIntroProps = {
  title: string;
  description?: string;
  /** Center title and description (portal home). */
  centered?: boolean;
  /** Optional layout overrides on the header wrapper. */
  className?: string;
};

/** Route body heading — title and optional lead copy. */
export function AppPageIntro({
  title,
  description,
  centered,
  className,
}: AppPageIntroProps) {
  return (
    <header
      className={[
        "app-page-intro",
        centered ? "app-page-intro--center" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h1 className="app-page-intro__title">{title}</h1>
      {description ? (
        <p className="app-page-intro__desc">{description}</p>
      ) : null}
    </header>
  );
}
