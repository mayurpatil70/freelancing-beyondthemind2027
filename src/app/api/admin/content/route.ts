import { NextRequest, NextResponse } from 'next/server';
import {
  getSiteSettings,
  updateSiteSettings,
  getExperiences,
  updateExperiencesData,
  getProgramme,
  updateProgrammeData,
  getFAQs,
  updateFAQsData,
} from '@/lib/storage/store';

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

export async function GET() {
  const settings = await getSiteSettings();
  const experiences = await getExperiences();
  const programme = await getProgramme();
  const faqs = await getFAQs();

  return NextResponse.json({
    success: true,
    data: {
      settings,
      experiences,
      programme,
      faqs,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, payload } = body;

    if (type === 'settings') {
      const updated = await updateSiteSettings(payload);
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'experiences') {
      const updated = await updateExperiencesData(payload);
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'programme') {
      const updated = await updateProgrammeData(payload);
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'faqs') {
      const updated = await updateFAQsData(payload);
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid content type' }, { status: 400 });
  } catch (err) {
    console.error('CMS update error:', err);
    return NextResponse.json({ success: false, message: 'Content update error' }, { status: 500 });
  }
}
