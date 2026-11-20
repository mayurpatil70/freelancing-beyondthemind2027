import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function checkAuth(req: NextRequest): boolean {
  const session = req.cookies.get('btm_admin_session');
  if (!session?.value) return false;
  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString('utf-8'));
    return Boolean(data.authenticated);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPG, PNG, WEBP, GIF, AVIF and SVG are allowed.' },
        { status: 400 }
      );
    }

    // Max 10 MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File exceeds maximum 10MB limit.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
      'image/avif': '.avif',
    };
    const ext = extMap[file.type] || path.extname(file.name) || '.jpg';
    const cleanBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    const filename = `${cleanBase || 'photo'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;

    // Attempt writing to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    let fileUrl = '';

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const destination = path.join(uploadsDir, filename);
      fs.writeFileSync(destination, buffer);
      fileUrl = `/uploads/${filename}`;
    } catch (writeErr) {
      // Fallback for read-only serverless platforms (e.g. Vercel)
      console.warn('Filesystem read-only, falling back to base64 data URI:', writeErr);
      fileUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: 'Photo uploaded successfully!',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Upload error:', message);
    return NextResponse.json({ success: false, message: 'Upload failed', error: message }, { status: 500 });
  }
}
