import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { isAdminRequest } from '@/lib/auth';
import { mediaKindOf } from '@/lib/media/rules';
import {
  MEDIA_BUCKET,
  deleteObject,
  headObject,
  isStorageConfigured,
  publicObjectUrl,
} from '@/lib/media/storage';
import { addMedia, listMedia, removeMedia } from '@/lib/storage/store';

const fail = (message: string, status = 400) => NextResponse.json({ success: false, message }, { status });

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return fail('Unauthorized', 401);
  return NextResponse.json({ success: true, data: await listMedia() });
}

// Records an object the browser has just uploaded with a presigned URL.
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return fail('Unauthorized', 401);
  if (!isStorageConfigured) return fail('Storage is not configured');

  const { key, name } = await req.json();
  if (typeof key !== 'string' || !key.startsWith('images/')) return fail('Invalid key');

  const head = await headObject(MEDIA_BUCKET, key);
  if (!head) return fail('Uploaded file was not found in storage', 404);
  const kind = mediaKindOf(head.contentType);
  if (!kind) return fail('Unsupported file type');

  const asset = await addMedia({
    key,
    url: publicObjectUrl(key),
    kind,
    mime_type: head.contentType,
    size_bytes: head.size,
    original_name: String(name || key.split('/').pop()),
  });
  return NextResponse.json({ success: true, data: asset });
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return fail('Unauthorized', 401);

  const { id } = await req.json();
  const asset = await removeMedia(String(id));
  if (!asset) return fail('Not found', 404);

  try {
    if (asset.url.startsWith('/uploads/')) {
      fs.rmSync(path.join(process.cwd(), 'public', asset.url), { force: true });
    } else if (isStorageConfigured) {
      await deleteObject(MEDIA_BUCKET, asset.key);
    }
  } catch (err) {
    console.warn('Media object delete failed:', err);
  }
  return NextResponse.json({ success: true });
}
