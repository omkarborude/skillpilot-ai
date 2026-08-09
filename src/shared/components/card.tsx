import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <article className="card">
      <div>
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </article>
  );
}
