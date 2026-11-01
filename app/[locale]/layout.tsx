import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/components/LanguageProvider';
import { hasLocale, locales } from '@/lib/i18n';
import '../globals.css';

export const metadata: Metadata = {
  title: 'কৃষি বাংলাদেশ — Agriculture Intelligence Portal',
  description: 'AI-Powered Agriculture Intelligence Portal for Bangladesh',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider lang={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
