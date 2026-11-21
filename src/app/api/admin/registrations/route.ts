import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth';
import {
  getRegistrations,
  updateRegistrationStatus,
  addAdminNote,
} from '@/lib/storage/store';
import { RegistrationStatus, PaymentVerificationStatus } from '@/types';

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
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
    const sanitizeCsvValue = (val: unknown): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // Prevent CSV formula injection if cell begins with =, +, -, @, tab, or carriage return
      if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

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
      sanitizeCsvValue(r.id),
      sanitizeCsvValue(r.full_name),
      sanitizeCsvValue(r.email),
      sanitizeCsvValue(r.country_code),
      sanitizeCsvValue(r.phone),
      sanitizeCsvValue(r.country),
      sanitizeCsvValue(r.city),
      sanitizeCsvValue(r.programme),
      sanitizeCsvValue(r.language_preference),
      sanitizeCsvValue(r.status),
      sanitizeCsvValue(r.payment_status),
      sanitizeCsvValue(r.created_at),
      sanitizeCsvValue(r.dietary_requirements || ''),
      sanitizeCsvValue(r.message || ''),
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
  if (!isAdminRequest(req)) {
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
  if (!isAdminRequest(req)) {
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
