import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_BYTES, parseDiagnosis, parseImageDataUrl } from './scan';

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
  it('parses a disease result and normalises percentage confidence', () => {
    const result = parseDiagnosis(
      JSON.stringify({
        detected: true,
        crop_en: 'Rice',
        crop_bn: 'ধান',
        disease_en: 'Blast',
        disease_bn: 'ব্লাস্ট',
        confidence: 92,
        treatment_en: ['Apply tricyclazole'],
      })
    );
    expect(result).toMatchObject({ detected: true, disease_en: 'Blast', confidence: 0.92, treatment_bn: [], description_en: '' });
  });

  it('keeps model messages and only falls back for blank ones', () => {
    expect(parseDiagnosis('{"detected":false,"message_en":"Not a plant.","message_bn":"এটি গাছ নয়।"}')).toEqual({
      detected: false,
      message_en: 'Not a plant.',
      message_bn: 'এটি গাছ নয়।',
    });
    expect(parseDiagnosis('{"detected":false,"message_en":"","message_bn":"  "}')).toEqual({
      detected: false,
      message_en: 'No disease was detected in this photo.',
      message_bn: 'এই ছবিতে কোনো রোগ শনাক্ত হয়নি।',
    });
  });

  it('drops the empty message fields that come back with a disease result', () => {
    const result = parseDiagnosis(
      JSON.stringify({ detected: true, crop_en: 'Potato', crop_bn: 'আলু', disease_en: 'Black scurf', disease_bn: 'কালো দাগ', confidence: 0.8, message_en: '', message_bn: '' })
    );
    expect(result).not.toHaveProperty('message_en');
  });

  it('returns null for missing, malformed or incomplete output', () => {
    expect(parseDiagnosis(undefined)).toBeNull();
    expect(parseDiagnosis('not json')).toBeNull();
    expect(parseDiagnosis('{"detected":true,"crop_en":"Rice"}')).toBeNull();
  });
});
