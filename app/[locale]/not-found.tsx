'use client';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { localePath } from '@/lib/i18n';

// Shown when a page calls notFound() (e.g. an unknown crop id) — rendered inside the locale layout.
export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen flex items-center justify-center bg-canvas font-ui text-fg px-6">
      <div className="max-w-md text-center">
        <p className="text-sm tracking-widest text-fg-muted">404</p>
        <h1 className="mt-2 text-3xl font-bold">{lang === 'bn' ? 'পাতাটি পাওয়া যায়নি' : 'Page not found'}</h1>
        <p className="mt-2 text-fg-muted">
          {lang === 'bn' ? 'আপনি যে পাতাটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।' : 'The page you are looking for does not exist or has moved.'}
        </p>
        <Link href={localePath(lang)} className="inline-block mt-6 px-5 py-2 rounded-full bg-brand text-on-brand">
          {lang === 'bn' ? 'হোমে ফিরুন' : 'Go home'}
        </Link>
      </div>
    </main>
  );
}
