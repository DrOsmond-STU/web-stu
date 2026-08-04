import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

const MAX_LENGTH = 5000;

/**
 * Menerima kiriman formulir kontak dari halaman publik.
 * Pesan disimpan ke tabel `messages` dan dapat dibaca lewat CMS.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nama, email, dan pesan wajib diisi.' },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid.' }, { status: 400 });
    }
    if (message.length > MAX_LENGTH) {
      return NextResponse.json({ error: 'Pesan terlalu panjang.' }, { status: 400 });
    }

    await query(
      `INSERT INTO messages (name, email, phone, company, subject, message)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        name.slice(0, 200),
        email.slice(0, 200),
        String(body.phone ?? '').trim().slice(0, 60),
        String(body.company ?? '').trim().slice(0, 200),
        String(body.subject ?? '').trim().slice(0, 200),
        message,
      ],
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[api/kontak]', error);
    return NextResponse.json(
      { error: 'Pesan gagal dikirim. Silakan coba lagi atau hubungi kami lewat WhatsApp.' },
      { status: 500 },
    );
  }
}
