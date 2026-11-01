'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AskButton } from '@/components/chat/AskButton';
import type { Dictionary } from '@/lib/dictionary';
import { localePath, type Locale } from '@/lib/i18n';

/** Bottom navigation on phones (hidden from md up, where the header shows the same links). */
export function MobileTabBar({ locale, nav }: { locale: Locale; nav: Dictionary['nav'] }) {
  const pathname = usePathname();
  const tabs = [
    { href: localePath(locale), icon: '🏠', label: nav.home },
    { href: localePath(locale, '/districts'), icon: '🗺️', label: nav.districts },
    { href: localePath(locale, '/markets'), icon: '🧺', label: nav.markets },
    { href: localePath(locale, '/scan'), icon: '🔍', label: nav.scan },
  ];
  const item = 'flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px]';

  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-surface/95 backdrop-blur md:hidden">
      {tabs.map((tab) => {
        const active = tab.href === localePath(locale) ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link key={tab.href} href={tab.href} className={`${item} ${active ? 'text-brand' : 'text-fg-muted'}`} aria-current={active ? 'page' : undefined}>
            <span aria-hidden className="text-lg">
              {tab.icon}
            </span>
            {tab.label}
          </Link>
        );
      })}
      <AskButton className={`${item} text-fg-muted`}>
        <span aria-hidden className="text-lg">
          💬
        </span>
        {nav.ask}
      </AskButton>
    </nav>
  );
}
