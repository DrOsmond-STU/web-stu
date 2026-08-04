'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { destroySession, getSession, hashPassword, verifyCredentials } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { ARRAY_FIELD_TYPES, getResource, type Field } from '@/lib/admin/resources';
import { slugify } from '@/lib/utils';

export type ActionState = { ok?: boolean; error?: string; message?: string };

async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

/** Menyegarkan seluruh halaman publik agar perubahan langsung terlihat. */
function revalidateSite() {
  revalidatePath('/', 'layout');
}

/* -------------------------------------------------------------------------- */
/*  Autentikasi                                                               */
/* -------------------------------------------------------------------------- */

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Email dan kata sandi wajib diisi.' };

  try {
    const user = await verifyCredentials(email, password);
    if (!user) return { error: 'Email atau kata sandi salah.' };
    const { createSession } = await import('@/lib/auth');
    await createSession(user);
  } catch (error) {
    return {
      error:
        (error as Error).message.includes('AUTH_SECRET')
          ? 'AUTH_SECRET belum diatur pada berkas .env.'
          : 'Tidak dapat terhubung ke database. Periksa pengaturan DATABASE_URL.',
    };
  }

  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();

  const current = String(formData.get('current_password') ?? '');
  const next = String(formData.get('new_password') ?? '');
  const confirm = String(formData.get('confirm_password') ?? '');

  if (next.length < 8) return { error: 'Kata sandi baru minimal 8 karakter.' };
  if (next !== confirm) return { error: 'Konfirmasi kata sandi tidak cocok.' };

  const valid = await verifyCredentials(session.email, current);
  if (!valid) return { error: 'Kata sandi saat ini salah.' };

  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
    hashPassword(next),
    session.id,
  ]);

  return { ok: true, message: 'Kata sandi berhasil diganti.' };
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireSession();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!name || !email) return { error: 'Nama dan email wajib diisi.' };

  await query('UPDATE users SET name = $1, email = $2, updated_at = NOW() WHERE id = $3', [
    name,
    email,
    session.id,
  ]);

  const { createSession } = await import('@/lib/auth');
  await createSession({ ...session, name, email });

  return { ok: true, message: 'Profil berhasil diperbarui.' };
}

/* -------------------------------------------------------------------------- */
/*  Pengaturan konten (tabel settings)                                        */
/* -------------------------------------------------------------------------- */

export async function saveSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const entries = Array.from(formData.entries()).filter(([key]) => key.startsWith('setting__'));
  if (entries.length === 0) return { error: 'Tidak ada perubahan untuk disimpan.' };

  try {
    for (const [formKey, value] of entries) {
      const key = formKey.replace('setting__', '');
      await query(
        `INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, String(value)],
      );
    }
  } catch {
    return { error: 'Gagal menyimpan. Periksa koneksi database.' };
  }

  revalidateSite();
  return { ok: true, message: `${entries.length} pengaturan tersimpan.` };
}

/* -------------------------------------------------------------------------- */
/*  CRUD generik untuk seluruh jenis konten                                   */
/* -------------------------------------------------------------------------- */

function parseValue(field: Field, raw: FormDataEntryValue | null): unknown {
  const value = raw === null ? '' : String(raw);

  switch (field.type) {
    case 'boolean':
      return value === 'on' || value === 'true' || value === '1';
    case 'number':
      return value.trim() === '' ? null : Number(value.replace(/[^0-9.-]/g, ''));
    case 'lines':
    case 'gallery':
      return value.split('\n').map((line) => line.trim()).filter(Boolean);
    case 'tags':
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    case 'date':
      return value.trim() === '' ? null : value;
    default:
      return value;
  }
}

export async function saveResourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const resourceKey = String(formData.get('__resource') ?? '');
  const idRaw = String(formData.get('__id') ?? '');
  const resource = getResource(resourceKey);

  if (!resource) return { error: 'Jenis konten tidak dikenal.' };

  const isNew = idRaw === '' || idRaw === 'baru';
  const columns: string[] = [];
  const values: unknown[] = [];

  for (const field of resource.fields) {
    // Checkbox yang tidak dicentang tidak dikirim browser — anggap false.
    const raw = formData.get(field.name);
    if (raw === null && field.type !== 'boolean') continue;

    let value = parseValue(field, raw);

    if (field.type === 'slug') {
      const source = field.from ? String(formData.get(field.from) ?? '') : '';
      const candidate = String(value || '').trim() || source;
      value = slugify(candidate) || `item-${Date.now()}`;
    }

    if (field.required && (value === '' || value === null)) {
      return { error: `Kolom "${field.label}" wajib diisi.` };
    }

    columns.push(field.name);
    values.push(value);
  }

  if (columns.length === 0) return { error: 'Tidak ada data untuk disimpan.' };

  try {
    if (isNew) {
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const row = await queryOne<{ id: number }>(
        `INSERT INTO ${resource.table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
        values,
      );
      revalidateSite();
      redirect(`/admin/${resource.key}/${row?.id}?status=dibuat`);
    }

    const assignments = columns.map((column, i) => `${column} = $${i + 1}`).join(', ');
    values.push(Number(idRaw));
    await query(
      `UPDATE ${resource.table} SET ${assignments}${
        resource.table === 'clients' ? '' : ', updated_at = NOW()'
      } WHERE id = $${values.length}`,
      values,
    );
  } catch (error) {
    // redirect() melempar error khusus Next.js — teruskan apa adanya.
    if ((error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw error;

    const message = (error as Error).message;
    if (message.includes('duplicate key')) {
      return { error: 'Slug sudah dipakai konten lain. Gunakan slug yang berbeda.' };
    }
    return { error: `Gagal menyimpan: ${message}` };
  }

  revalidateSite();
  return { ok: true, message: 'Perubahan tersimpan.' };
}

export async function deleteResourceAction(formData: FormData) {
  await requireSession();

  const resource = getResource(String(formData.get('__resource') ?? ''));
  const id = Number(formData.get('__id'));
  if (!resource || !Number.isInteger(id)) return;

  await query(`DELETE FROM ${resource.table} WHERE id = $1`, [id]);

  revalidateSite();
  redirect(`/admin/${resource.key}?status=dihapus`);
}

export async function toggleResourceAction(formData: FormData) {
  await requireSession();

  const resource = getResource(String(formData.get('__resource') ?? ''));
  const id = Number(formData.get('__id'));
  const column = String(formData.get('__column') ?? '');

  if (!resource || !Number.isInteger(id)) return;
  // Hanya kolom boolean yang terdaftar pada definisi yang boleh diubah.
  const allowed = resource.fields.some((f) => f.name === column && f.type === 'boolean');
  if (!allowed) return;

  await query(`UPDATE ${resource.table} SET ${column} = NOT ${column} WHERE id = $1`, [id]);

  revalidateSite();
  revalidatePath(`/admin/${resource.key}`);
}

/* -------------------------------------------------------------------------- */
/*  Pesan masuk                                                               */
/* -------------------------------------------------------------------------- */

export async function markMessageReadAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return;

  await query('UPDATE messages SET is_read = NOT is_read WHERE id = $1', [id]);
  revalidatePath('/admin/pesan');
}

export async function deleteMessageAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return;

  await query('DELETE FROM messages WHERE id = $1', [id]);
  revalidatePath('/admin/pesan');
}

/* -------------------------------------------------------------------------- */
/*  Media                                                                     */
/* -------------------------------------------------------------------------- */

export async function deleteMediaAction(formData: FormData) {
  await requireSession();
  const id = Number(formData.get('id'));
  if (!Number.isInteger(id)) return;

  await query('DELETE FROM media WHERE id = $1', [id]);
  revalidatePath('/admin/media');
}
