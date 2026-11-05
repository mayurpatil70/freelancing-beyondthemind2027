import { NextRequest, NextResponse } from 'next/server';
import {
  getRegistrations,
  updateRegistrationStatus,
  addAdminNote,
} from '@/lib/storage/store';
import { RegistrationStatus, PaymentVerificationStatus } from '@/types';

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

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get('status');
  const searchQuery = searchParams.get('search')?.toLowerCase();
  const format = searchParams.get('format');

  let records = await getRegistrations();

  if (statusFilter && statusFilter !== 'All') {
    records = records.filter((r) => r.status === statusFilter);
  }

  if (searchQuery) {
    records = records.filter(
      (r) =>
        r.full_name.toLowerCase().includes(searchQuery) ||
        r.email.toLowerCase().includes(searchQuery) ||
        r.phone.includes(searchQuery) ||
        r.id.toLowerCase().includes(searchQuery) ||
        r.city.toLowerCase().includes(searchQuery) ||
        r.country.toLowerCase().includes(searchQuery)
    );
  }

  // Handle CSV Export
  if (format === 'csv') {
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Country Code',
      'Phone',
      'Country',
      'City',
      'Programme',
      'Language Preference',
      'Status',
      'Payment Status',
      'Created At',
      'Dietary Notes',
      'Message',
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.full_name.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.country_code}"`,
      `"${r.phone}"`,
      `"${r.country.replace(/"/g, '""')}"`,
      `"${r.city.replace(/"/g, '""')}"`,
      `"${r.programme.replace(/"/g, '""')}"`,
      `"${r.language_preference}"`,
      `"${r.status}"`,
      `"${r.payment_status}"`,
      `"${r.created_at}"`,
      `"${(r.dietary_requirements || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="beyond-the-mind-registrations-${Date.now()}.csv"`,
      },
    });
  }

  return NextResponse.json({ success: true, count: records.length, data: records });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, payment_status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'ID and status are required' }, { status: 400 });
    }

    const updated = await updateRegistrationStatus(
      id,
      status as RegistrationStatus,
      payment_status as PaymentVerificationStatus | undefined
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Registration not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update registration error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { registration_id, text, author } = await req.json();
    if (!registration_id || !text) {
      return NextResponse.json(
        { success: false, message: 'registration_id and text are required' },
        { status: 400 }
      );
    }

    const note = await addAdminNote(registration_id, text, author || 'Admin Concierge');
    return NextResponse.json({ success: true, data: note });
  } catch (err) {
    console.error('Add note error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
