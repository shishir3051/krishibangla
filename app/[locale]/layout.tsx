import type { Metadata } from 'next';
import { Hind_Siliguri, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { LanguageProvider } from '@/components/LanguageProvider';
import { hasLocale, locales } from '@/lib/i18n';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const hind = Hind_Siliguri({ subsets: ['bengali', 'latin'], weight: ['400', '500', '600', '700'], variable: '--font-hind', display: 'swap' });

export const metadata: Metadata = {
  title: 'কৃষি বাংলাদেশ — Agriculture Intelligence Portal',
  description: 'AI-Powered Agriculture Intelligence Portal for Bangladesh',
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
