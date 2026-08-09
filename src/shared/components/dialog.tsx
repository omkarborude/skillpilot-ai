import type { PropsWithChildren } from 'react';
import { Button } from './button';

interface DialogProps extends PropsWithChildren {
  title: string;
  open: boolean;
  actionLabel: string;
  onAction: () => void;
  onClose: () => void;
}

export function Dialog({ title, open, actionLabel, onAction, onClose, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="dialog-title">{title}</h2>
        <p>{children}</p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      </section>
    </div>
  );
}
