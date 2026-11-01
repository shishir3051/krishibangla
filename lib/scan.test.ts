import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_BYTES, parseDiagnosis, parseImageDataUrl, SCAN_GENERATION } from './scan';

describe('parseImageDataUrl', () => {
  it('accepts JPEG, PNG and WebP data URLs', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp']) {
      expect(parseImageDataUrl(`data:${type};base64,AAAA`)).toEqual({ ok: true, image: { mimeType: type, data: 'AAAA' } });
    }
  });

  it('rejects other image types with 415', () => {
    expect(parseImageDataUrl('data:image/gif;base64,R0lGOD')).toMatchObject({ ok: false, status: 415 });
  });

  it('rejects non-data-URLs and non-strings with 400', () => {
    expect(parseImageDataUrl('https://example.com/leaf.jpg')).toMatchObject({ ok: false, status: 400 });
    expect(parseImageDataUrl(undefined)).toMatchObject({ ok: false, status: 400 });
  });

  it('rejects images over the size limit with 413', () => {
    const tooBig = 'A'.repeat(Math.ceil((MAX_IMAGE_BYTES * 4) / 3) + 8);
    expect(parseImageDataUrl(`data:image/jpeg;base64,${tooBig}`)).toMatchObject({ ok: false, status: 413 });
  });
});

describe('parseDiagnosis', () => {
  const tomato = {
    detected: true,
    crop_en: 'Tomato',
    crop_bn: 'টমেটো',
    candidates: [
      { disease_en: 'Anthracnose', disease_bn: 'অ্যানথ্রাকনোজ', check_en: 'Circular sunken spots on ripe fruit', check_bn: 'পাকা ফলে গোল বসে যাওয়া দাগ' },
      { disease_en: 'Late blight', disease_bn: 'নাবি ধসা', check_en: 'Dark greasy patches on leaves too', check_bn: 'পাতায়ও কালচে তেলতেলে দাগ' },
    ],
    description_en: 'A large dark sunken lesion.',
    description_bn: 'একটি বড় কালো বসে যাওয়া দাগ।',
    treatment_en: ['Remove infected fruit'],
    treatment_bn: ['আক্রান্ত ফল সরিয়ে ফেলুন'],
    message_en: '',
    message_bn: '',
    photo_ok: false,
    photo_tip_en: 'Take a closer photo in daylight.',
    photo_tip_bn: 'দিনের আলোয় আরও কাছ থেকে ছবি তুলুন।',
  };

  it('keeps the ranked candidates, most likely first, and drops empty message fields', () => {
    const result = parseDiagnosis(JSON.stringify(tomato));
    expect(result).toMatchObject({ detected: true, crop_en: 'Tomato', photo_ok: false, photo_tip_en: 'Take a closer photo in daylight.' });
    expect(result?.detected && result.candidates.map((c) => c.disease_en)).toEqual(['Anthracnose', 'Late blight']);
    expect(result).not.toHaveProperty('message_en');
    expect(result).not.toHaveProperty('confidence');
  });

  it('skips unusable candidates and keeps at most three', () => {
    const many = Array.from({ length: 5 }, (_, i) => ({ disease_en: `D${i}`, disease_bn: `রোগ${i}`, check_en: '', check_bn: '' }));
    const result = parseDiagnosis(JSON.stringify({ ...tomato, candidates: [{ disease_en: '', disease_bn: '' }, ...many] }));
    expect(result?.detected && result.candidates.map((c) => c.disease_en)).toEqual(['D0', 'D1', 'D2']);
  });

  it('rejects a disease result without any usable candidate', () => {
    expect(parseDiagnosis(JSON.stringify({ ...tomato, candidates: [] }))).toBeNull();
    expect(parseDiagnosis(JSON.stringify({ ...tomato, candidates: [{ disease_en: ' ', disease_bn: '' }] }))).toBeNull();
  });

  it('keeps model messages and only falls back for blank ones', () => {
    expect(parseDiagnosis('{"detected":false,"message_en":"Not a plant.","message_bn":"এটি গাছ নয়।","photo_ok":true}')).toEqual({
      detected: false,
      message_en: 'Not a plant.',
      message_bn: 'এটি গাছ নয়।',
      photo_ok: true,
      photo_tip_en: '',
      photo_tip_bn: '',
    });
    expect(parseDiagnosis('{"detected":false,"message_en":"","message_bn":"  "}')).toMatchObject({
      message_en: 'No disease was detected in this photo.',
      message_bn: 'এই ছবিতে কোনো রোগ শনাক্ত হয়নি।',
      photo_ok: true,
    });
  });

  it('returns null for missing, malformed or incomplete output', () => {
    expect(parseDiagnosis(undefined)).toBeNull();
    expect(parseDiagnosis('not json')).toBeNull();
    expect(parseDiagnosis('{"detected":true,"crop_en":"Rice"}')).toBeNull();
  });
});

describe('scan generation settings', () => {
  it('uses no sampling randomness so the same photo gets the same answer', () => {
    expect(SCAN_GENERATION.temperature).toBe(0);
    expect(typeof SCAN_GENERATION.seed).toBe('number');
  });
});
