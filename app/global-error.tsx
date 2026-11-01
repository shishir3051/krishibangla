'use client';
import './globals.css';

// Last-resort error screen when the root layout itself fails. Bilingual because the locale may be unknown here.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex items-center justify-center bg-canvas font-ui text-fg px-6">
        <main className="max-w-md text-center">
          <h1 className="text-3xl font-bold">কিছু একটা ভুল হয়েছে</h1>
          <p className="mt-1 text-lg text-fg-muted">Something went wrong.</p>
          <button onClick={reset} className="mt-6 px-5 py-2 rounded-full bg-brand text-on-brand">
            আবার চেষ্টা করুন · Try again
          </button>
        </main>
      </body>
    </html>
  );
}
