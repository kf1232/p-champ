export function WowScreenTitleBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="wow-screen-title-block">
      <h1 className="wow-screen-title">{title}</h1>
      <p className="wow-screen-description">{description}</p>
    </div>
  );
}
