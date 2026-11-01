import { describe, expect, it } from 'vitest';
import { ACCEPTED_TYPES, isSmallPhoto, MIN_GOOD_SIDE, scanErrorKey } from './image';
import { ALLOWED_IMAGE_TYPES } from '@/lib/scan';

describe('scan error messages', () => {
  it('maps /api/detect statuses to the right message', () => {
    expect(scanErrorKey(429)).toBe('rateLimited');
    for (const status of [400, 413, 415]) expect(scanErrorKey(status)).toBe('badImage');
    expect(scanErrorKey(503)).toBe('busy');
    for (const status of [500, 502]) expect(scanErrorKey(status)).toBe('failed');
  });

  it('accepts exactly the image types the server allows', () => {
    expect(ACCEPTED_TYPES.split(',')).toEqual([...ALLOWED_IMAGE_TYPES]);
  });
});

describe('isSmallPhoto', () => {
  it('flags photos whose longest edge is under the recommended size', () => {
    expect(isSmallPhoto({ width: 228, height: 180 })).toBe(true);
    expect(isSmallPhoto({ width: MIN_GOOD_SIDE - 1, height: 300 })).toBe(true);
    expect(isSmallPhoto({ width: 600, height: MIN_GOOD_SIDE })).toBe(false);
    expect(isSmallPhoto({ width: 4000, height: 3000 })).toBe(false);
  });
});
