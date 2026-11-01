import Link from 'next/link';
import { AskButton } from '@/components/chat/AskButton';
import { LocaleToggle } from '@/components/ui/LocaleToggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { Dictionary } from '@/lib/dictionary';
import { localePath, type Locale } from '@/lib/i18n';
import { HeaderNav } from './HeaderNav';

export function SiteHeader({ locale, nav }: { locale: Locale; nav: Dictionary['nav'] }) {
  const links = [
    { href: localePath(locale, '/districts'), label: nav.districts },
    { href: localePath(locale, '/markets'), label: nav.markets },
    { href: localePath(locale, '/climate'), label: nav.climate },
    { href: localePath(locale, '/scan'), label: nav.scan },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href={localePath(locale)} className="flex shrink-0 items-center gap-2 font-semibold text-fg">
          <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-brand text-on-brand">
            🌾
          </span>
          {nav.brand}
        </Link>
        <HeaderNav links={links} />
        <div className="ml-auto flex items-center gap-2">
          <AskButton className="hidden h-10 rounded-full bg-brand px-4 text-sm font-medium text-on-brand hover:opacity-90 md:block">
            💬 {nav.ask}
          </AskButton>
          <LocaleToggle label={nav.switchLanguage} ariaLabel={nav.switchLanguageLabel} />
          <ThemeToggle labels={{ toLight: nav.themeLight, toDark: nav.themeDark }} />
        </div>
      </div>
    </header>
  );
}
