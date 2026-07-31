'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { slugify } from '@/lib/utils';
import type { ActionState } from '@/lib/admin/actions';

type Repo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  private: boolean;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
};

/**
 * Menarik daftar repositori dari GitHub lalu menyimpannya sebagai proyek.
 *
 * - Repositori yang belum ada akan dibuat sebagai DRAF (published = false)
 *   supaya Anda bisa melengkapi tangkapan layar dan deskripsinya lebih dulu.
 * - Repositori yang sudah ada hanya diperbarui metadata teknisnya
 *   (bahasa, tautan, status privat) — judul, deskripsi, fitur, dan gambar
 *   yang sudah Anda sunting tidak akan tertimpa.
 */
export async function syncGithubAction(): Promise<ActionState> {
  const session = await getSession();
  if (!session) return { error: 'Tidak memiliki akses.' };

  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return { error: 'GITHUB_USERNAME belum diatur pada berkas .env.' };
  }

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'semesta-teknologi-utama-website',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Dengan token: /user/repos ikut menyertakan repositori privat.
  const endpoint = token
    ? 'https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner'
    : `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;

  let repos: Repo[];
  try {
    const response = await fetch(endpoint, { headers, cache: 'no-store' });
    if (!response.ok) {
      const detail = response.status === 401 ? ' (token tidak valid)' : '';
      return { error: `GitHub menolak permintaan: ${response.status}${detail}.` };
    }
    repos = (await response.json()) as Repo[];
  } catch {
    return { error: 'Tidak dapat terhubung ke GitHub. Periksa koneksi internet server.' };
  }

  const usable = repos.filter((repo) => !repo.fork && !repo.archived);

  let created = 0;
  let updated = 0;

  for (const repo of usable) {
    const existing = await queryOne<{ id: number }>(
      'SELECT id FROM projects WHERE repo_name = $1 LIMIT 1',
      [repo.name],
    );

    const tech = [repo.language, ...(repo.topics ?? [])].filter(Boolean) as string[];

    if (existing) {
      await query(
        `UPDATE projects
            SET repo_url   = $1,
                is_private = $2,
                demo_url   = COALESCE(NULLIF($3, ''), demo_url),
                tech       = CASE WHEN cardinality(tech) = 0 THEN $4::text[] ELSE tech END,
                source     = 'github',
                updated_at = NOW()
          WHERE id = $5`,
        [repo.private ? null : repo.html_url, repo.private, repo.homepage ?? '', tech, existing.id],
      );
      updated += 1;
      continue;
    }

    const title = repo.name
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .trim();

    let slug = slugify(repo.name);
    const clash = await queryOne<{ id: number }>('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (clash) slug = `${slug}-${Date.now().toString(36)}`;

    await query(
      `INSERT INTO projects
        (slug, title, summary, description, tech, category, repo_name, repo_url,
         demo_url, is_private, source, published, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'github', FALSE, 999)`,
      [
        slug,
        title,
        repo.description ?? '',
        repo.description ?? '',
        tech,
        'Produk Aplikasi',
        repo.name,
        repo.private ? null : repo.html_url,
        repo.homepage ?? null,
        repo.private,
      ],
    );
    created += 1;
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/', 'layout');

  return {
    ok: true,
    message: `Sinkronisasi selesai: ${created} repositori baru ditambahkan sebagai draf, ${updated} diperbarui. Lengkapi tangkapan layar dan deskripsinya, lalu ubah status menjadi Terbit.`,
  };
}
