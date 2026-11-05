import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { updateRegistrationStatus } from '@/lib/storage/store';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const registrationId = formData.get('registration_id') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded.' }, { status: 400 });
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Only JPG, PNG, WEBP and PDF are accepted.' },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds maximum 5MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeExt = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
    const filename = `proof-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;
    const destination = path.join(uploadsDir, filename);

    fs.writeFileSync(destination, buffer);
    const fileUrl = `/uploads/${filename}`;

    if (registrationId) {
      await updateRegistrationStatus(registrationId, 'Payment Verification', 'Pending Verification');
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      message: 'Receipt uploaded securely. Payment status set to Pending Verification.',
    });
  } catch (err) {
    console.error('Upload proof error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to process file upload.' },
      { status: 500 }
    );
  }
}

