import type { Metadata, Viewport } from 'next';
import { Hind_Siliguri, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/components/LanguageProvider';
import { hasLocale, locales } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
// Two weights keep the Bangla font download small on mobile data (medium falls back to 400, bold to 600).
const hind = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '600'], variable: '--font-hind', display: 'swap' });

// Pages set their own title, description, canonical and alternates via lib/site.ts → pageMetadata().
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  applicationName: 'KrishiBangla',
  title: 'কৃষিবাংলা · KrishiBangla',
  description: 'Weather, irrigation advice, market prices and climate alerts for farmers in Bangladesh.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f7f2' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1410' },
  ],
  colorScheme: 'light dark',
};

// Runs before first paint so the saved (or system) theme applies without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}})()`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${inter.variable} ${hind.variable}`} suppressHydrationWarning>
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
