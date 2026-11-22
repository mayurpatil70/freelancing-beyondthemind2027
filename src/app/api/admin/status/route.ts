import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/db/neon';
import { isStorageConfigured } from '@/lib/media/storage';
import { getSecurityThreatSummary } from '@/lib/security/rateLimit';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({
    success: true,
    database: isDatabaseConfigured,
    storage: isStorageConfigured,
    hosted: Boolean(process.env.VERCEL),
    security: await getSecurityThreatSummary(),
  });
}
