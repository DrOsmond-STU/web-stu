import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';
import { slugify } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Tidak memiliki akses.' }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Berkas tidak ditemukan.' }, { status: 400 });
    }
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: 'Format tidak didukung. Gunakan JPG, PNG, WebP, GIF, atau SVG.' },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Ukuran berkas melebihi 8 MB.' }, { status: 400 });
    }

    const uploadDir = process.env.UPLOAD_DIR || 'public/uploads';
    const targetDir = join(process.cwd(), uploadDir);
    await mkdir(targetDir, { recursive: true });

    const ext = (extname(file.name) || '.jpg').toLowerCase();
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'berkas';
    const filename = `${base}-${Date.now().toString(36)}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(targetDir, filename), buffer);

    const url = `/${uploadDir.replace(/^public\//, '')}/${filename}`;

    try {
      await query(
        'INSERT INTO media (url, filename, mime, size, alt) VALUES ($1,$2,$3,$4,$5)',
        [url, filename, file.type, file.size, ''],
      );
    } catch {
      // Berkas sudah tersimpan; kegagalan pencatatan tidak menggagalkan unggahan.
    }

    return NextResponse.json({ url, filename });
  } catch (error) {
    console.error('[api/admin/upload]', error);
    return NextResponse.json({ error: 'Gagal mengunggah berkas.' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Tidak memiliki akses.' }, { status: 401 });

  try {
    const rows = await query<{ id: number; url: string; filename: string }>(
      'SELECT id, url, filename FROM media ORDER BY id DESC LIMIT 120',
    );
    return NextResponse.json({ items: rows });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
