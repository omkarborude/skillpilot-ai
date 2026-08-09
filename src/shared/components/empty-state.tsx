import type { PropsWithChildren } from 'react';

export function EmptyState({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="empty-state">
      <div aria-hidden="true">✦</div>
      <h2>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
