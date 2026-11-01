import { describe, expect, it, vi } from 'vitest';
import { geminiErrorResponse } from './gemini';

describe('geminiErrorResponse', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  it('turns provider quota errors into a 503 without leaking upstream details', async () => {
    const quota = Object.assign(new Error('{"error":{"code":429,"message":"You exceeded your current quota … project 123","status":"RESOURCE_EXHAUSTED"}}'), { status: 429 });
    const res = geminiErrorResponse(quota, 'scan');
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.code).toBe('ai_quota');
    expect(JSON.stringify(body)).not.toMatch(/project|RESOURCE_EXHAUSTED/);
  });

  it('recognises quota errors by message when no status is attached', () => {
    expect(geminiErrorResponse(new Error('RESOURCE_EXHAUSTED: quota'), 'chat').status).toBe(503);
  });

  it('returns a generic 502 for other failures', async () => {
    const res = geminiErrorResponse(new Error('socket hang up at 10.0.0.1'), 'chat');
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe('The AI chat failed. Please try again.');
  });
});
