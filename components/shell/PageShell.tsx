import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChatProvider } from '@/components/chat/ChatSheet';
import type { Dictionary } from '@/lib/dictionary';
import { localePath, type Locale } from '@/lib/i18n';
import { MobileTabBar } from './MobileTabBar';
import { SiteHeader } from './SiteHeader';

/**
 * Frame for every rebuilt page: header, footer, mobile tab bar and the chat sheet.
 * Pass `chatCropId` on crop pages so the assistant answers with that crop in mind.
 */
export function PageShell({ locale, t, chatCropId, children }: { locale: Locale; t: Dictionary; chatCropId?: string; children: ReactNode }) {
  return (
    <ChatProvider locale={locale} labels={t.chat} cropId={chatCropId}>
      <div className="flex min-h-screen flex-col bg-canvas pb-16 font-ui text-fg md:pb-0">
        <SiteHeader locale={locale} nav={t.nav} />
        <div className="flex-1">{children}</div>
        <footer className="no-print border-t border-line">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl">{t.nav.footer}</p>
            <Link href={localePath(locale, '/about/data')} className="underline underline-offset-2 hover:text-fg">
              {t.nav.dataSources}
            </Link>
          </div>
        </footer>
        <MobileTabBar locale={locale} nav={t.nav} />
      </div>
    </ChatProvider>
  );
}
