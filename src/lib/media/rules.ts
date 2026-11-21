export type MediaKind = 'image' | 'video';

export const IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

export const VIDEO_TYPES: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
};

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 250 * 1024 * 1024;

export const MEDIA_ACCEPT = [...Object.keys(IMAGE_TYPES), ...Object.keys(VIDEO_TYPES)].join(',');

export function mediaKindOf(mime: string): MediaKind | null {
  if (mime in IMAGE_TYPES) return 'image';
  if (mime in VIDEO_TYPES) return 'video';
  return null;
}

export function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov)(\?|#|$)/i.test(url);
}

export function validateMedia(mime: string, size: number): { kind: MediaKind } | { error: string } {
  const kind = mediaKindOf(mime);
  if (!kind) return { error: 'Unsupported file type. Use JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM or MOV.' };
  const max = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (size > max) return { error: `File is too large. ${kind === 'image' ? 'Images' : 'Videos'} can be up to ${max / 1024 / 1024} MB.` };
  return { kind };
}

export function buildObjectKey(folder: string, fileName: string, mime: string) {
  const ext = IMAGE_TYPES[mime] || VIDEO_TYPES[mime] || '';
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
