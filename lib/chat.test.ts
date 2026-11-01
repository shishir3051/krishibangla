import { describe, expect, it } from 'vitest';
import { buildSystemPrompt, detectLanguage, findCrop, MAX_CHARS, MAX_HISTORY, parseChatRequest, toGeminiContents } from './chat';

const user = (content: string) => ({ role: 'user', content });
const assistant = (content: string) => ({ role: 'assistant', content });

describe('parseChatRequest', () => {
  it('accepts a normal conversation with crop context', () => {
    const result = parseChatRequest({ messages: [user('hi'), assistant('hello'), user('rice?')], context: { cropId: 'rice' } });
    expect(result.ok).toBe(true);
  });

  it.each([
    ['missing messages', {}, 'messages must be a non-empty array.'],
    ['empty messages', { messages: [] }, 'messages must be a non-empty array.'],
    ['system role', { messages: [{ role: 'system', content: 'x' }, user('hi')] }, 'Only "user" and "assistant" roles are allowed.'],
    ['non-text content', { messages: [{ role: 'user', content: 42 }] }, 'Message content must be text.'],
    ['over-long message', { messages: [user('a'.repeat(MAX_CHARS + 1))] }, `Each message must be under ${MAX_CHARS} characters.`],
    ['assistant last', { messages: [user('hi'), assistant('hello')] }, 'The last message must be a non-empty user question.'],
    ['blank question', { messages: [user('   ')] }, 'The last message must be a non-empty user question.'],
    ['too many messages', { messages: Array.from({ length: MAX_HISTORY + 1 }, () => user('x')) }, 'This conversation is too long. Please start a new chat.'],
  ])('rejects %s', (_label, body, error) => {
    expect(parseChatRequest(body)).toEqual({ ok: false, error });
  });
});

describe('detectLanguage', () => {
  it('detects English', () => expect(detectLanguage('When is Boro rice harvested?')).toBe('en'));
  it('detects Bangla', () => expect(detectLanguage('বোরো ধান কখন কাটা হয়?')).toBe('bn'));
  it('uses the dominant script in mixed text', () => {
    expect(detectLanguage('BRRI dhan29 কোন মৌসুমে ভালো ফলন দেয়?')).toBe('bn');
    expect(detectLanguage('What does আমন mean for farmers in Rangpur?')).toBe('en');
  });
});

describe('findCrop', () => {
  it('finds known crops case-insensitively', () => {
    expect(findCrop('Potato')).toMatchObject({ en: 'Potato' });
  });
  it('ignores unknown ids and prototype keys', () => {
    expect(findCrop('banana')).toBeNull();
    expect(findCrop('constructor')).toBeNull();
    expect(findCrop(undefined)).toBeNull();
  });
});

describe('buildSystemPrompt', () => {
  it('pins the reply language', () => {
    expect(buildSystemPrompt('bn', null)).toContain('Write the entire answer in Bangla');
    expect(buildSystemPrompt('en', null)).toContain('Write the entire answer in English');
  });
  it('adds crop focus only when a crop is given', () => {
    expect(buildSystemPrompt('en', { en: 'Potato', bn: 'আলু' })).toContain('specialised in Potato');
    expect(buildSystemPrompt('en', null)).not.toContain('FOCUS:');
  });
});

describe('toGeminiContents', () => {
  it('maps roles, drops empty turns and a leading model turn', () => {
    const contents = toGeminiContents([
      { role: 'assistant', content: 'greeting' },
      { role: 'user', content: 'q1' },
      { role: 'assistant', content: '' },
      { role: 'user', content: 'q2' },
    ]);
    expect(contents).toEqual([
      { role: 'user', parts: [{ text: 'q1' }] },
      { role: 'user', parts: [{ text: 'q2' }] },
    ]);
  });
});
