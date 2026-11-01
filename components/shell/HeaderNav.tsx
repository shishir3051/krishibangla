'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActivePath } from '@/lib/i18n';

/** Desktop header links; the current section is highlighted and marked aria-current="page". */
export function HeaderNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 text-sm md:flex">
      {links.map((link) => {
        const active = isActivePath(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-lg px-3 py-2 transition-colors ${
              active ? 'bg-brand-soft font-semibold text-brand' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
