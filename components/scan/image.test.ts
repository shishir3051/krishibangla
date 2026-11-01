import { describe, expect, it } from 'vitest';
import { ACCEPTED_TYPES, scanErrorKey } from './image';
import { ALLOWED_IMAGE_TYPES } from '@/lib/scan';

describe('scan error messages', () => {
  it('maps /api/detect statuses to the right message', () => {
    expect(scanErrorKey(429)).toBe('rateLimited');
    for (const status of [400, 413, 415]) expect(scanErrorKey(status)).toBe('badImage');
    for (const status of [500, 502, 503]) expect(scanErrorKey(status)).toBe('failed');
  });

  it('accepts exactly the image types the server allows', () => {
    expect(ACCEPTED_TYPES.split(',')).toEqual([...ALLOWED_IMAGE_TYPES]);
  });
});
