import Link from 'next/link';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { Dictionary } from '@/lib/dictionary';
import { localePath, type Locale } from '@/lib/i18n';

export function SiteHeader({ locale, nav }: { locale: Locale; nav: Dictionary['nav'] }) {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href={localePath(locale)} className="flex items-center gap-2 font-semibold text-fg">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-brand text-on-brand">
            🌾
          </span>
          {nav.brand}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href={localePath(locale)} className="rounded-lg px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">
            {nav.home}
          </Link>
          <Link href={localePath(locale, '/districts')} className="rounded-lg px-3 py-2 text-fg-muted hover:bg-surface-2 hover:text-fg">
            {nav.districts}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle label={nav.switchLanguage} ariaLabel={nav.switchLanguageLabel} />
          <ThemeToggle labels={{ toLight: nav.themeLight, toDark: nav.themeDark }} />
        </div>
      </div>
    </header>
  );
}
