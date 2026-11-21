import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateRegistrationStatus } from '@/lib/storage/store';
import { PRIVATE_BUCKET, isStorageConfigured, putObject } from '@/lib/media/storage';

const EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
};

// Kept under Vercel's 4.5 MB request body limit.
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const registrationId = formData.get('registration_id') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }
    if (!EXT[file.type]) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Only JPG, PNG, WEBP and PDF are accepted.' },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: 'File size exceeds maximum 4MB limit.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `proof-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${EXT[file.type]}`;
    let fileUrl: string;

    if (isStorageConfigured) {
      const key = `payment-proofs/${filename}`;
      await putObject(PRIVATE_BUCKET, key, buffer, file.type);
      fileUrl = `/api/admin/proof?key=${encodeURIComponent(key)}`;
    } else {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      fs.mkdirSync(uploadsDir, { recursive: true });
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      fileUrl = `/uploads/${filename}`;
    }

    if (registrationId) {
      await updateRegistrationStatus(registrationId, 'Payment Verification', 'Pending Verification', fileUrl);
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      message: 'Receipt uploaded securely. Payment status set to Pending Verification.',
    });
  } catch (err) {
    console.error('Upload proof error:', err);
    return NextResponse.json({ success: false, message: 'Failed to process file upload.' }, { status: 500 });
  }
}
