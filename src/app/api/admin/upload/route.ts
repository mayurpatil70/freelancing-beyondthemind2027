import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdminRequest } from '@/lib/auth';
import { buildObjectKey, validateMedia } from '@/lib/media/rules';
import {
  MEDIA_BUCKET,
  ensureMediaCors,
  isStorageConfigured,
  presignUpload,
  publicObjectUrl,
} from '@/lib/media/storage';
import { addMedia } from '@/lib/storage/store';

const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status });

// JSON body: presign a direct browser upload to Neon storage. Multipart body: local fallback without storage.
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return fail('Unauthorized', 401);

  try {
    if ((req.headers.get('content-type') || '').includes('application/json')) {
      if (!isStorageConfigured) return NextResponse.json({ success: true, mode: 'form' });

      const { name, type, size } = await req.json();
      const check = validateMedia(String(type), Number(size));
      if ('error' in check) return fail(check.error);

      await ensureMediaCors();
      const key = buildObjectKey(`${check.kind}s`, String(name || 'file'), type);
      const uploadUrl = await presignUpload(MEDIA_BUCKET, key, type);
      return NextResponse.json({
        success: true,
        mode: 'direct',
        key,
        kind: check.kind,
        uploadUrl,
        url: publicObjectUrl(key),
        headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=31536000, immutable' },
      });
    }

    const file = (await req.formData()).get('file') as File | null;
    if (!file) return fail('No file provided');
    const check = validateMedia(file.type, file.size);
    if ('error' in check) return fail(check.error);
    if (isStorageConfigured) return fail('Upload directly to storage using a presigned URL.');

    const key = buildObjectKey(`${check.kind}s`, file.name, file.type);
    const filename = key.replace(/\//g, '-');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(await file.arrayBuffer()));

    const asset = await addMedia({
      key: filename,
      url: `/uploads/${filename}`,
      kind: check.kind,
      mime_type: file.type,
      size_bytes: file.size,
      original_name: file.name,
    });
    return NextResponse.json({ success: true, mode: 'form', url: asset.url, kind: asset.kind, asset });
  } catch (err) {
    console.error('Upload error:', err);
    return fail('Upload failed', 500);
  }
}
