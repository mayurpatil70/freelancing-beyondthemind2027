import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { PRIVATE_BUCKET, isStorageConfigured, presignDownload } from '@/lib/media/storage';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  const key = req.nextUrl.searchParams.get('key') || '';
  if (!isStorageConfigured || !key.startsWith('payment-proofs/')) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }
  return NextResponse.redirect(await presignDownload(PRIVATE_BUCKET, key, 300));
}
