import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation/registration';
import { saveRegistration } from '@/lib/storage/store';
import { generateRegistrationId, formatWhatsAppUrl } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();

    // Support both full registration forms and quick enquiry modals / contact forms
    const normalizedBody = {
      full_name: (rawBody.full_name || rawBody.name || '').trim(),
      email: (rawBody.email || `${(rawBody.phone || 'retreat').replace(/[^0-9]/g, '') || 'seeker'}@inquiry.beyondthemindretreat.org`).trim().toLowerCase(),
      country_code: rawBody.country_code || '+91',
      phone: (rawBody.phone || rawBody.whatsapp || '').trim(),
      country: (rawBody.country || 'India').trim(),
      city: (rawBody.city || 'Online / Sanctuary').trim(),
      programme: rawBody.programme || 'The Divine Retreat Rishikesh (Offline: Oct 5–9, 2027)',
      language_preference: rawBody.language_preference || 'English',
      dietary_requirements: rawBody.dietary_requirements || undefined,
      message: rawBody.message || rawBody.note || undefined,
      privacy_consent: rawBody.privacy_consent ?? true,
      payment_proof_url: rawBody.payment_proof_url || undefined,
    };

    const parseResult = registrationSchema.safeParse(normalizedBody);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;
    const generatedId = generateRegistrationId();

    const savedRecord = await saveRegistration({
      id: generatedId,
      full_name: validData.full_name,
      email: validData.email,
      country_code: validData.country_code,
      phone: validData.phone,
      country: validData.country,
      city: validData.city,
      programme: validData.programme,
      language_preference: validData.language_preference,
      dietary_requirements: validData.dietary_requirements || undefined,
      message: validData.message || undefined,
      privacy_consent: validData.privacy_consent,
      payment_proof_url: rawBody.payment_proof_url || undefined,
    });

    const retreatWhatsApp = '+91 8075572018';
    const followUpMessage = `Namaste Beyond the Mind Team,\n\nI have submitted my retreat registration / enquiry.\n\n*Reference ID:* ${savedRecord.id}\n*Name:* ${savedRecord.full_name}\n*Phone:* ${savedRecord.country_code} ${savedRecord.phone}\n*Programme:* ${savedRecord.programme}\n${savedRecord.city ? `*Location:* ${savedRecord.city}\n` : ''}${savedRecord.message ? `*Notes:* ${savedRecord.message}\n` : ''}\nKindly confirm availability and share details. Thank you!`;
    const whatsappUrl = formatWhatsAppUrl(retreatWhatsApp, followUpMessage);

    return NextResponse.json({
      success: true,
      data: savedRecord,
      whatsappUrl,
    });
  } catch (err: unknown) {
    console.error('Registration API error:', err);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred while processing your registration.' },
      { status: 500 }
    );
  }
}

