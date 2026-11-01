'use client';
import { useLanguage } from '@/components/LanguageProvider';

// Route-level safety net: keeps the layout (and language) while showing a retry for the failed page.
export default function LocaleError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { lang } = useLanguage();

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-6 font-ui text-fg">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">{lang === 'bn' ? 'কিছু একটা ভুল হয়েছে' : 'Something went wrong'}</h1>
        <p className="mt-2 text-fg-muted">
          {lang === 'bn' ? 'পাতাটি লোড করা যায়নি। আবার চেষ্টা করুন।' : 'This page could not be loaded. Please try again.'}
        </p>
        <button type="button" onClick={reset} className="mt-6 rounded-full bg-brand px-5 py-2 text-on-brand">
          {lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Try again'}
        </button>
      </div>
    </main>
  );
}
