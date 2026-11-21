export type MediaKind = 'image' | 'video';

export const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export const IMAGE_ACCEPT = Object.keys(IMAGE_TYPES).join(',');

export function mediaKindOf(mime: string): MediaKind | null {
  return mime in IMAGE_TYPES ? 'image' : null;
}

export function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

export function validateMedia(mime: string, size: number): { kind: MediaKind } | { error: string } {
  if (!mediaKindOf(mime)) return { error: 'Only images can be uploaded (JPG, PNG, WEBP, GIF or AVIF).' };
  if (size > MAX_IMAGE_BYTES) return { error: `Image is too large. Images can be up to ${MAX_IMAGE_BYTES / 1024 / 1024} MB.` };
  return { kind: 'image' };
}

export function buildObjectKey(folder: string, fileName: string, mime: string) {
  const ext = IMAGE_TYPES[mime] || '';
  const base =
    fileName
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'file';
  const now = new Date();
  const month = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
  return `${folder}/${month}/${base}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}${ext}`;
}
