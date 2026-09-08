type ApizzaImagePageProps = {
  src: string;
  alt: string;
};

export function ApizzaImagePage({ src, alt }: ApizzaImagePageProps) {
  return (
    <div className="apizza-body apizza-image-page">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="apizza-image-page__img" />
    </div>
  );
}
