import type { ReactNode } from "react";

type ApizzaProsePageProps = {
  title: string;
  children: ReactNode;
};

export function ApizzaProsePage({ title, children }: ApizzaProsePageProps) {
  return (
    <article className="apizza-body apizza-prose">
      <h1 className="apizza-prose__title">{title}</h1>
      {children}
    </article>
  );
}
