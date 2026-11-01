import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: '404 — পাতা পাওয়া যায়নি · Page not found',
};

// Shown for URLs that match no route at all (the root layout lives under [locale]).
export default function GlobalNotFound() {
  return (
    <html lang="bn">
      <body className="min-h-screen flex items-center justify-center bg-canvas font-ui text-fg px-6">
        <main className="max-w-md text-center">
          <p className="text-sm tracking-widest text-fg-muted">404</p>
          <h1 className="mt-2 text-3xl font-bold">পাতাটি পাওয়া যায়নি</h1>
          <p className="mt-1 text-lg text-fg-muted">This page could not be found.</p>
          <Link href="/" className="inline-block mt-6 px-5 py-2 rounded-full bg-brand text-on-brand">
            হোমে ফিরুন · Go home
          </Link>
        </main>
      </body>
    </html>
  );
}
