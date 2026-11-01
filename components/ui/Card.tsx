import type { ReactNode } from 'react';

type CardProps = {
  title?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Card({ title, action, footer, className = '', children }: CardProps) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          {title && <h2 className="text-base font-semibold text-fg">{title}</h2>}
          {action}
        </header>
      )}
      {children}
      {footer && <footer className="mt-4 border-t border-line pt-3">{footer}</footer>}
    </section>
  );
}
