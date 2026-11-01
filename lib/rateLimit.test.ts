import { describe, expect, it } from 'vitest';
import { rateLimit } from './rateLimit';

const request = (headers: Record<string, string>) => new Request('http://localhost/api/chat', { method: 'POST', headers });

// No Upstash env in tests, so this exercises the in-memory limiter.
describe('rateLimit', () => {
  it('allows 20 chat requests per IP, then returns 429 with Retry-After', async () => {
    const req = request({ 'x-real-ip': '203.0.113.1' });
    for (let i = 0; i < 20; i++) expect(await rateLimit('chat', req)).toBeNull();

    const blocked = await rateLimit('chat', req);
    expect(blocked?.status).toBe(429);
    expect(Number(blocked?.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(await blocked?.json()).toMatchObject({ code: 'rate_limited' });
  });

  it('tracks IPs and route names separately', async () => {
    const req = request({ 'x-real-ip': '203.0.113.2' });
    for (let i = 0; i < 20; i++) await rateLimit('chat', req);
    expect(await rateLimit('chat', request({ 'x-real-ip': '203.0.113.3' }))).toBeNull();
    expect(await rateLimit('detect', req)).toBeNull();
  });

  it('prefers x-real-ip over a spoofable x-forwarded-for', async () => {
    for (let i = 0; i < 20; i++) {
      await rateLimit('chat', request({ 'x-real-ip': '203.0.113.4', 'x-forwarded-for': `198.51.100.${i}` }));
    }
    const blocked = await rateLimit('chat', request({ 'x-real-ip': '203.0.113.4', 'x-forwarded-for': '198.51.100.99' }));
    expect(blocked?.status).toBe(429);
  });
});
