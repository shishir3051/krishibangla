import { NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';
import { config, proxy } from '../proxy';

const run = (path: string, cookie?: string) =>
  proxy(new NextRequest(`http://localhost${path}`, { headers: cookie ? { cookie } : {} }));

describe('proxy', () => {
  it('sends first-time visitors to Bangla', () => {
    const res = run('/');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost/bn');
  });

  it('honours a saved language choice', () => {
    expect(run('/', 'NEXT_LOCALE=en').headers.get('location')).toBe('http://localhost/en');
    expect(run('/crops/rice', 'NEXT_LOCALE=en').headers.get('location')).toBe('http://localhost/en/crops/rice');
  });

  it('ignores an invalid cookie value', () => {
    expect(run('/', 'NEXT_LOCALE=fr').headers.get('location')).toBe('http://localhost/bn');
  });

  it('keeps the query string', () => {
    expect(run('/crops/rice?tab=market').headers.get('location')).toBe('http://localhost/bn/crops/rice?tab=market');
  });

  it('permanently moves old /crop/:id URLs to /crops/:id', () => {
    const res = run('/crop/rice');
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('http://localhost/crops/rice');
  });

  it('passes through paths that already have a locale', () => {
    const res = run('/en/crops/rice');
    expect(res.headers.get('location')).toBeNull();
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});

describe('proxy matcher', () => {
  // Same pattern Next compiles from config.matcher; paths it rejects never reach the proxy.
  const matches = (path: string) => new RegExp(`^${config.matcher[0]}$`).test(path);

  it('runs for pages and skips API routes, assets and metadata files', () => {
    expect(matches('/')).toBe(true);
    expect(matches('/crops/rice')).toBe(true);
    expect(matches('/api/chat')).toBe(false);
    expect(matches('/sitemap.xml')).toBe(false);
    expect(matches('/robots.txt')).toBe(false);
    expect(matches('/opengraph-image')).toBe(false);
    expect(matches('/favicon.ico')).toBe(false);
  });
});
