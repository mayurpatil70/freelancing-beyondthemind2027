import { NextRequest, NextResponse } from 'next/server';
import { registrationSchema } from '@/lib/validation/registration';
import { saveRegistration } from '@/lib/storage/store';
import { generateRegistrationId, formatWhatsAppUrl } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parseResult = registrationSchema.safeParse(body);
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
      payment_proof_url: body.payment_proof_url || undefined,
    });

    const retreatWhatsApp = '+91 8075572018';
    const followUpMessage = `Namaste Beyond the Mind Team,\n\nI have submitted my retreat registration.\n\n*Reference ID:* ${savedRecord.id}\n*Name:* ${savedRecord.full_name}\n*Programme:* ${savedRecord.programme}\n\nKindly share further details and confirmation guidance. Thank you!`;
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

