import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
  getSiteSettings,
  updateSiteSettings,
  getExperiences,
  updateExperiencesData,
  getHealingSessions,
  updateHealingSessionsData,
  getBlogPosts,
  updateBlogPostsData,
  getProgramme,
  updateProgrammeData,
  getFAQs,
  updateFAQsData,
  getAttractions,
  updateAttractionsData,
  getWeatherClothing,
  updateWeatherClothingData,
  getGallery,
  updateGalleryData,
  getTestimonials,
  updateTestimonialsData,
} from '@/lib/storage/store';

function revalidateAllPages() {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/experiences');
    revalidatePath('/programme');
    revalidatePath('/rishikesh');
    revalidatePath('/testimonials');
    revalidatePath('/faq');
    revalidatePath('/reach');
    revalidatePath('/participation');
    revalidatePath('/daily-meditation');
    revalidatePath('/register');
    revalidatePath('/contact');
    revalidatePath('/experiences/[slug]', 'page');
    revalidatePath('/healing-sessions');
    revalidatePath('/healing-sessions/[slug]', 'page');
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]', 'page');
    revalidatePath('/sitemap.xml');
  } catch (err) {
    console.warn('Revalidate error:', err);
  }
}

// Always read live content; never serve a build-time snapshot to the admin panel.
export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSiteSettings();
  const experiences = await getExperiences();
  const healingSessions = await getHealingSessions();
  const blogPosts = await getBlogPosts();
  const programme = await getProgramme();
  const faqs = await getFAQs();
  const attractions = await getAttractions();
  const weatherClothing = await getWeatherClothing();
  const gallery = await getGallery();
  const testimonials = await getTestimonials();

  return NextResponse.json({
    success: true,
    data: {
      settings,
      experiences,
      healingSessions,
      blogPosts,
      programme,
      faqs,
      attractions,
      weatherClothing,
      gallery,
      testimonials,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, payload } = body;

    if (type === 'settings') {
      const updated = await updateSiteSettings(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'experiences') {
      const updated = await updateExperiencesData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'healingSessions') {
      const updated = await updateHealingSessionsData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'blogPosts') {
      const updated = await updateBlogPostsData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'programme') {
      const updated = await updateProgrammeData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'faqs') {
      const updated = await updateFAQsData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'attractions') {
      const updated = await updateAttractionsData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'weatherClothing') {
      const updated = await updateWeatherClothingData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'gallery') {
      const updated = await updateGalleryData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    if (type === 'testimonials') {
      const updated = await updateTestimonialsData(payload);
      revalidateAllPages();
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid content type' }, { status: 400 });
  } catch (err) {
    console.error('CMS update error:', err);
    const reason = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, message: `Could not save to the database: ${reason.slice(0, 200)}` },
      { status: 500 }
    );
  }
}
