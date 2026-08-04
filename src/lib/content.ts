import { safeQuery } from '@/lib/db';
import { DEFAULT_SETTINGS_MAP } from '@/lib/defaults';
import certificationsData from '@/data/certifications.json';
import certificateProofsData from '@/data/certificate-proofs.json';
import clientsData from '@/data/clients.json';
import galleryData from '@/data/gallery.json';
import projectsData from '@/data/projects.json';
import postsData from '@/data/posts.json';
import servicesData from '@/data/services.json';
import teamData from '@/data/team.json';
import experiencesData from '@/data/experiences.json';
import type {
  CertificateProof,
  Certification,
  Client,
  Experience,
  GalleryItem,
  Post,
  Project,
  Service,
  SettingsMap,
  TeamMember,
  Testimonial,
} from '@/lib/types';

/* -------------------------------------------------------------------------- */
/*  Data cadangan                                                             */
/*  Dipakai hanya bila database belum diisi atau sedang tidak dapat diakses,  */
/*  supaya halaman publik tetap tampil utuh.                                  */
/* -------------------------------------------------------------------------- */

const fallbackServices: Service[] = (servicesData as never[]).map((s: any, i) => ({
  id: i + 1,
  slug: s.slug,
  title: s.title,
  summary: s.summary,
  description: s.description,
  icon: s.icon,
  image: s.image ?? null,
  features: s.features ?? [],
  sort_order: s.sort_order ?? i,
  published: true,
}));

const fallbackProjects: Project[] = (projectsData as never[]).map((p: any, i) => ({
  id: i + 1,
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  description: p.description,
  features: p.features ?? [],
  tech: p.tech ?? [],
  gallery: p.gallery ?? [],
  cover_image: p.cover_image ?? null,
  client: p.client ?? null,
  category: p.category ?? 'Aplikasi',
  year: p.year ?? null,
  repo_name: p.repo_name ?? null,
  repo_url: p.repo_url ?? null,
  demo_url: p.demo_url ?? null,
  is_private: p.is_private ?? false,
  source: p.source ?? 'manual',
  featured: p.featured ?? false,
  sort_order: p.sort_order ?? i,
  published: true,
}));

const fallbackTeam: TeamMember[] = (teamData as never[]).map((m: any, i) => ({
  id: i + 1,
  name: m.name,
  position: m.position,
  photo: m.photo ?? null,
  bio: m.bio ?? '',
  email: null,
  linkedin: null,
  sort_order: m.sort_order ?? i,
  published: true,
}));

const fallbackGallery: GalleryItem[] = (galleryData as never[]).map((g: any, i) => ({
  id: i + 1,
  title: g.title,
  caption: g.caption,
  image: g.image,
  category: g.category,
  sort_order: g.sort_order ?? i,
  published: true,
}));

const fallbackClients: Client[] = (clientsData as never[]).map((c: any, i) => ({
  id: i + 1,
  name: c.name,
  logo: c.logo ?? null,
  website: c.website ?? null,
  sort_order: c.sort_order ?? i,
  published: true,
}));

const fallbackCertifications: Certification[] = (certificationsData as never[]).map((c: any, i) => ({
  id: i + 1,
  name: c.name,
  vendor: c.vendor ?? '',
  scheme: c.scheme ?? 'internasional',
  exam_fee: c.exam_fee ?? null,
  field: c.field ?? '',
  also_for: c.also_for ?? '',
  priority: c.priority ?? '',
  summary: c.summary ?? '',
  sort_order: c.sort_order ?? i + 1,
  published: true,
}));

const fallbackExperiences: Experience[] = (experiencesData as never[]).map((e: any, i) => ({
  id: i + 1,
  title: e.title,
  field: e.field,
  location: e.location,
  client: e.client,
  client_address: e.client_address,
  contract_no: e.contract_no,
  contract_date: e.contract_date,
  contract_value: e.contract_value,
  year: e.year ?? null,
  sort_order: i + 1,
  published: true,
}));

const fallbackPosts: Post[] = (postsData as never[]).map((p: any, i) => ({
  id: i + 1,
  slug: p.slug,
  title: p.title,
  excerpt: p.excerpt,
  content: p.content,
  cover_image: p.cover_image ?? null,
  category: p.category,
  tags: p.tags ?? [],
  author: p.author ?? 'Redaksi STU',
  meta_title: p.meta_title ?? null,
  meta_description: p.meta_description ?? null,
  focus_keyword: p.focus_keyword ?? null,
  views: 0,
  published: true,
  published_at: new Date('2025-01-15').toISOString(),
  created_at: new Date('2025-01-15').toISOString(),
  updated_at: new Date('2025-01-15').toISOString(),
}));

/* -------------------------------------------------------------------------- */
/*  Pengaturan (settings)                                                     */
/* -------------------------------------------------------------------------- */

export async function getSettings(): Promise<SettingsMap> {
  const rows = await safeQuery<{ key: string; value: string | null }>(
    'SELECT key, value FROM settings',
  );
  const fromDb = Object.fromEntries(rows.map((r) => [r.key, r.value ?? '']));
  return { ...DEFAULT_SETTINGS_MAP, ...fromDb };
}

/** Membaca setting bertipe JSON dengan aman — mengembalikan `fallback` bila tidak valid. */
export function parseJsonSetting<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/* -------------------------------------------------------------------------- */
/*  Layanan                                                                   */
/* -------------------------------------------------------------------------- */

export async function getServices(): Promise<Service[]> {
  const rows = await safeQuery<Service>(
    'SELECT * FROM services WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackServices;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const rows = await safeQuery<Service>(
    'SELECT * FROM services WHERE slug = $1 AND published = TRUE LIMIT 1',
    [slug],
  );
  return rows[0] ?? fallbackServices.find((s) => s.slug === slug) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Proyek                                                                    */
/* -------------------------------------------------------------------------- */

export async function getProjects(options: { featuredOnly?: boolean; limit?: number } = {}) {
  const clauses = ['published = TRUE'];
  if (options.featuredOnly) clauses.push('featured = TRUE');

  const rows = await safeQuery<Project>(
    `SELECT * FROM projects WHERE ${clauses.join(' AND ')} ORDER BY sort_order, id${
      options.limit ? ` LIMIT ${Number(options.limit)}` : ''
    }`,
  );
  if (rows.length) return rows;

  let list = fallbackProjects;
  if (options.featuredOnly) list = list.filter((p) => p.featured);
  return options.limit ? list.slice(0, options.limit) : list;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const rows = await safeQuery<Project>(
    'SELECT * FROM projects WHERE slug = $1 AND published = TRUE LIMIT 1',
    [slug],
  );
  return rows[0] ?? fallbackProjects.find((p) => p.slug === slug) ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Testimoni                                                                 */
/* -------------------------------------------------------------------------- */

export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  // Tidak ada data cadangan: testimoni harus berupa kutipan asli dari klien.
  // Bagian testimoni otomatis disembunyikan bila belum ada yang diterbitkan.
  return safeQuery<Testimonial>(
    `SELECT * FROM testimonials WHERE published = TRUE ORDER BY sort_order, id${
      limit ? ` LIMIT ${Number(limit)}` : ''
    }`,
  );
}

/* -------------------------------------------------------------------------- */
/*  Artikel / berita                                                          */
/* -------------------------------------------------------------------------- */

export async function getPosts(options: { limit?: number; category?: string; excludeSlug?: string } = {}) {
  const params: unknown[] = [];
  const clauses = ['published = TRUE'];

  if (options.category) {
    params.push(options.category);
    clauses.push(`category = $${params.length}`);
  }
  if (options.excludeSlug) {
    params.push(options.excludeSlug);
    clauses.push(`slug <> $${params.length}`);
  }

  const rows = await safeQuery<Post>(
    `SELECT * FROM posts WHERE ${clauses.join(' AND ')}
     ORDER BY published_at DESC NULLS LAST, id DESC${options.limit ? ` LIMIT ${Number(options.limit)}` : ''}`,
    params,
  );
  if (rows.length) return rows;

  let list = fallbackPosts;
  if (options.category) list = list.filter((p) => p.category === options.category);
  if (options.excludeSlug) list = list.filter((p) => p.slug !== options.excludeSlug);
  return options.limit ? list.slice(0, options.limit) : list;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await safeQuery<Post>(
    'SELECT * FROM posts WHERE slug = $1 AND published = TRUE LIMIT 1',
    [slug],
  );
  return rows[0] ?? fallbackPosts.find((p) => p.slug === slug) ?? null;
}

export async function getPostCategories(): Promise<string[]> {
  const rows = await safeQuery<{ category: string }>(
    'SELECT DISTINCT category FROM posts WHERE published = TRUE ORDER BY category',
  );
  return rows.length
    ? rows.map((r) => r.category)
    : Array.from(new Set(fallbackPosts.map((p) => p.category)));
}

/* -------------------------------------------------------------------------- */
/*  Tim, galeri, pengalaman                                                   */
/* -------------------------------------------------------------------------- */

export async function getTeam(): Promise<TeamMember[]> {
  const rows = await safeQuery<TeamMember>(
    'SELECT * FROM team_members WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackTeam;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const rows = await safeQuery<GalleryItem>(
    'SELECT * FROM gallery_items WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackGallery;
}

export async function getClients(): Promise<Client[]> {
  const rows = await safeQuery<Client>(
    'SELECT * FROM clients WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackClients;
}

/* -------------------------------------------------------------------------- */
/*  Sertifikasi kompetensi                                                    */
/* -------------------------------------------------------------------------- */

export async function getCertifications(): Promise<Certification[]> {
  const rows = await safeQuery<Certification>(
    'SELECT * FROM certifications WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackCertifications;
}

/**
 * Bukti sertifikat memuat nama pemegang dan nomor verifikasi — data pribadi.
 * Tidak ada data cadangan di sini: yang tampil hanya baris yang benar-benar
 * diterbitkan lewat CMS, sehingga tidak ada nama yang terpublikasi tanpa
 * keputusan sadar dari pemilik situs.
 */
export async function getCertificateProofs(): Promise<CertificateProof[]> {
  return safeQuery<CertificateProof>(
    'SELECT * FROM certificate_proofs WHERE published = TRUE ORDER BY sort_order, id',
  );
}

export async function getExperiences(): Promise<Experience[]> {
  const rows = await safeQuery<Experience>(
    'SELECT * FROM experiences WHERE published = TRUE ORDER BY sort_order, id',
  );
  return rows.length ? rows : fallbackExperiences;
}
