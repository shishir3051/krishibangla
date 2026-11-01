/**
 * image.ts — Browser-side photo preparation and response handling for the disease scan.
 * (lib/scan.ts holds the server-side validation; it isn't imported here to keep the AI SDK out of the client.)
 */

/** Longest edge sent to /api/detect — keeps uploads well under the server's 4 MB limit. */
export const MAX_SIDE = 1280;
export const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

/** Re-encodes a photo as a JPEG data URL no larger than `maxSide` on its longest edge. */
export function downscaleImage(file: Blob, maxSide = MAX_SIDE): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas is not available'));
      // JPEG has no transparency: paint white first so transparent PNGs don't turn black.
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not decode the image'));
    };
    img.src = url;
  });
}

export type ScanErrorKey = 'rateLimited' | 'badImage' | 'failed';

/** Maps an /api/detect error status to the message shown to the farmer. */
export function scanErrorKey(status: number): ScanErrorKey {
  if (status === 429) return 'rateLimited';
  if (status === 400 || status === 413 || status === 415) return 'badImage';
  return 'failed';
}
