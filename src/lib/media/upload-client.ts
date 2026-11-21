import type { MediaAsset } from '@/types';
import { type MediaKind, validateMedia } from '@/lib/media/rules';

export interface UploadedMedia {
  url: string;
  kind: MediaKind;
  asset?: MediaAsset;
}

function send(
  method: string,
  url: string,
  body: XMLHttpRequestBodyInit,
  headers: Record<string, string>,
  onProgress?: (pct: number) => void
) {
  return new Promise<{ status: number; text: string }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => resolve({ status: xhr.status, text: xhr.responseText });
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(body);
  });
}

async function readJson(res: Response) {
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || 'Upload failed');
  return json;
}

export async function uploadMediaFile(file: File, onProgress?: (pct: number) => void): Promise<UploadedMedia> {
  const check = validateMedia(file.type, file.size);
  if ('error' in check) throw new Error(check.error);

  const presign = await readJson(
    await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
    })
  );

  if (presign.mode === 'form') {
    const form = new FormData();
    form.append('file', file);
    const res = await send('POST', '/api/admin/upload', form, {}, onProgress);
    const json = JSON.parse(res.text || '{}');
    if (res.status >= 300 || !json.success) throw new Error(json.message || 'Upload failed');
    return { url: json.url, kind: json.kind, asset: json.asset };
  }

  const put = await send('PUT', presign.uploadUrl, file, presign.headers, onProgress);
  if (put.status >= 300) throw new Error(`Storage rejected the upload (HTTP ${put.status})`);

  const record = await readJson(
    await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: presign.key, name: file.name }),
    })
  );
  return { url: presign.url, kind: presign.kind, asset: record.data };
}
