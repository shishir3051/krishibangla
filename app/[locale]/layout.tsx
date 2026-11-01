import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/components/LanguageProvider';
import { hasLocale, locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Noto Sans Bengali has standard, easy-to-read Bangla digits (Hind Siliguri's ১ looked like a hook).
// Bengali characters only — Inter covers Latin. One variable-weight file covers every weight the UI uses.
const bangla = Noto_Sans_Bengali({ subsets: ['bengali'], variable: '--font-bangla-src', display: 'swap' });

// Pages set their own title, description, canonical and alternates via lib/site.ts → pageMetadata().
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  applicationName: 'KrishiBangla',
  title: 'কৃষিবাংলা · KrishiBangla',
  description: 'Weather, irrigation advice, market prices and climate alerts for farmers in Bangladesh.',
};

export const viewport: Viewport = {
  // Light by default (readable outdoors); dark only when the visitor picks it with the theme toggle.
  themeColor: '#f6f7f2',
  colorScheme: 'light',
};

// Runs before first paint: light unless the visitor chose dark with the toggle (ignores the OS setting).
const themeScript = `(function(){var t='light';try{if(localStorage.getItem('theme')==='dark')t='dark'}catch(e){}document.documentElement.dataset.theme=t})()`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${inter.variable} ${bangla.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider lang={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
