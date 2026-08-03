#!/usr/bin/env node
/**
 * Mengisi database dengan konten awal (profil perusahaan, layanan, proyek,
 * pengalaman pekerjaan, tim, galeri, artikel) serta membuat akun admin pertama.
 *
 * Jalankan: npm run db:seed
 *
 * Aman dijalankan berulang: baris yang sudah ada tidak akan diduplikasi.
 * Untuk mengulang dari awal, gunakan: npm run db:seed -- --reset
 */
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { loadEnv } from './env.mjs';

loadEnv();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const reset = process.argv.includes('--reset');

const read = (name) => JSON.parse(readFileSync(join(root, 'src', 'data', name), 'utf8'));

const settings = read('settings.json');
const services = read('services.json');
const projects = read('projects.json');
const experiences = read('experiences.json');
const team = read('team.json');
const gallery = read('gallery.json');
const clients = read('clients.json');
const certifications = read('certifications.json');
const certificateProofs = read('certificate-proofs.json');
const testimonials = read('testimonials.json');
const posts = read('posts.json');

if (!process.env.DATABASE_URL) {
  console.error('\n❌ DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi koneksi PostgreSQL Anda.\n');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

const q = (text, params = []) => client.query(text, params);

try {
  await client.connect();

  if (reset) {
    console.log('⚠️  Mode --reset: mengosongkan seluruh tabel konten…');
    await q(
      'TRUNCATE settings, services, projects, testimonials, posts, team_members, experiences, gallery_items, clients, certifications, certificate_proofs RESTART IDENTITY',
    );
  }

  // -------------------------------------------------------------- pengaturan
  for (const s of settings) {
    await q(
      `INSERT INTO settings (key, value, "group", label, type, hint, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (key) DO UPDATE
         SET "group" = EXCLUDED."group",
             label   = EXCLUDED.label,
             type    = EXCLUDED.type,
             hint    = EXCLUDED.hint`,
      [s.key, s.value, s.group, s.label, s.type, s.hint ?? null, settings.indexOf(s)],
    );
  }
  console.log(`✅ ${settings.length} pengaturan konten disiapkan`);

  // ----------------------------------------------------------------- layanan
  for (const s of services) {
    await q(
      `INSERT INTO services (slug, title, summary, description, icon, image, features, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (slug) DO NOTHING`,
      [s.slug, s.title, s.summary, s.description, s.icon, s.image, s.features, s.sort_order],
    );
  }
  console.log(`✅ ${services.length} layanan`);

  // ------------------------------------------------------------------ proyek
  for (const p of projects) {
    await q(
      `INSERT INTO projects
        (slug, title, summary, description, features, tech, gallery, cover_image, client,
         category, year, repo_name, repo_url, demo_url, is_private, source, featured, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (slug) DO NOTHING`,
      [
        p.slug, p.title, p.summary, p.description, p.features ?? [], p.tech ?? [], p.gallery ?? [],
        p.cover_image ?? null, p.client ?? null, p.category ?? 'Aplikasi', p.year ?? null,
        p.repo_name ?? null, p.repo_url ?? null, p.demo_url ?? null, p.is_private ?? false,
        p.source ?? 'manual', p.featured ?? false, p.sort_order ?? 0,
      ],
    );
  }
  console.log(`✅ ${projects.length} proyek`);

  // ----------------------------------------------------- pengalaman pekerjaan
  const { rows: expCount } = await q('SELECT COUNT(*)::int AS n FROM experiences');
  if (expCount[0].n === 0) {
    let i = 0;
    for (const e of experiences) {
      i += 1;
      await q(
        `INSERT INTO experiences
          (title, field, location, client, client_address, contract_no, contract_date, contract_value, year, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [e.title, e.field, e.location, e.client, e.client_address, e.contract_no, e.contract_date, e.contract_value, e.year, i],
      );
    }
    console.log(`✅ ${experiences.length} daftar pengalaman pekerjaan`);
  } else {
    console.log('↩︎  Daftar pengalaman pekerjaan sudah ada — dilewati');
  }

  // --------------------------------------------------------------------- tim
  for (const m of team) {
    await q(
      `INSERT INTO team_members (name, position, photo, bio, sort_order)
       SELECT $1,$2,$3,$4,$5
       WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = $1)`,
      [m.name, m.position, m.photo, m.bio, m.sort_order],
    );
  }
  console.log(`✅ ${team.length} anggota tim`);

  // ------------------------------------------------------------------ galeri
  for (const g of gallery) {
    await q(
      `INSERT INTO gallery_items (title, caption, image, category, sort_order)
       SELECT $1,$2,$3,$4,$5
       WHERE NOT EXISTS (SELECT 1 FROM gallery_items WHERE image = $3)`,
      [g.title, g.caption, g.image, g.category, g.sort_order],
    );
  }
  console.log(`✅ ${gallery.length} item galeri`);

  // ------------------------------------------------------------------ klien
  for (const c of clients) {
    await q(
      `INSERT INTO clients (name, logo, website, sort_order)
       SELECT $1,$2,$3,$4
       WHERE NOT EXISTS (SELECT 1 FROM clients WHERE name = $1)`,
      [c.name, c.logo ?? null, c.website ?? null, c.sort_order ?? 0],
    );
  }
  console.log(`✅ ${clients.length} klien & mitra (unggah logonya lewat CMS)`);

  // --------------------------------------------------------- sertifikasi
  for (const c of certifications) {
    await q(
      `INSERT INTO certifications (name, vendor, scheme, exam_fee, field, also_for, priority, summary, sort_order)
       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
       WHERE NOT EXISTS (SELECT 1 FROM certifications WHERE name = $1 AND vendor = $2)`,
      [c.name, c.vendor, c.scheme, c.exam_fee, c.field, c.also_for, c.priority, c.summary, c.sort_order],
    );
  }
  console.log(`✅ ${certifications.length} skema sertifikasi`);

  // ------------------------------------------------------- bukti sertifikat
  // Sengaja disimpan sebagai DRAFT (published = false) karena memuat nama
  // pemegang dan nomor verifikasi. Terbitkan lewat CMS hanya yang sudah
  // disetujui pemiliknya.
  for (const b of certificateProofs) {
    await q(
      `INSERT INTO certificate_proofs
        (title, vendor, holder, issued_on, credential_id, verify_url, image, sort_order, published)
       SELECT $1,$2,$3,$4,$5,$6,$7,$8,$9
       WHERE NOT EXISTS (SELECT 1 FROM certificate_proofs WHERE title = $1 AND holder = $3)`,
      [b.title, b.vendor, b.holder, b.issued_on, b.credential_id, b.verify_url, b.image, b.sort_order, b.published ?? false],
    );
  }
  console.log(`✅ ${certificateProofs.length} bukti sertifikat (status DRAFT — terbitkan lewat CMS bila pemiliknya setuju)`);

  // --------------------------------------------------------------- testimoni
  // Sengaja disimpan sebagai DRAFT (published = false). Isi dengan testimoni
  // asli dari klien Anda lewat CMS, lalu ubah statusnya menjadi Terbit.
  const { rows: tCount } = await q('SELECT COUNT(*)::int AS n FROM testimonials');
  if (tCount[0].n === 0) {
    for (const t of testimonials) {
      await q(
        `INSERT INTO testimonials (name, position, company, message, rating, featured, published, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [t.name, t.position, t.company, t.message, t.rating, t.featured, t.published ?? false, t.sort_order],
      );
    }
    console.log(`✅ ${testimonials.length} contoh testimoni (status DRAFT — ganti dengan testimoni asli lewat CMS)`);
  } else {
    console.log('↩︎  Testimoni sudah ada — dilewati');
  }

  // ----------------------------------------------------------------- artikel
  for (const p of posts) {
    await q(
      `INSERT INTO posts
        (slug, title, excerpt, content, cover_image, category, tags, author,
         meta_title, meta_description, focus_keyword, published, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12, NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [
        p.slug, p.title, p.excerpt, p.content, p.cover_image ?? null, p.category,
        p.tags ?? [], p.author ?? 'Redaksi STU', p.meta_title ?? null,
        p.meta_description ?? null, p.focus_keyword ?? null, p.published ?? true,
      ],
    );
  }
  console.log(`✅ ${posts.length} artikel`);

  // ------------------------------------------------------------- akun admin
  const email = (process.env.ADMIN_EMAIL || 'admin@semestateknologiutama.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'StuAdmin#2025';
  const name = process.env.ADMIN_NAME || 'Administrator';
  const hash = bcrypt.hashSync(password, 10);

  const { rowCount } = await q(
    `INSERT INTO users (email, password_hash, name)
     VALUES ($1,$2,$3)
     ON CONFLICT (email) DO NOTHING`,
    [email, hash, name],
  );

  console.log('');
  if (rowCount > 0) {
    console.log('🔑 Akun admin dibuat:');
    console.log(`   Email    : ${email}`);
    console.log(`   Password : ${password}`);
    console.log('   ⚠️  Segera ganti password setelah login pertama (menu Akun Saya).');
  } else {
    console.log(`🔑 Akun admin "${email}" sudah ada — tidak diubah.`);
  }
  console.log('\n🎉 Seed selesai. Buka /admin untuk mulai mengelola konten.\n');
} catch (error) {
  console.error('❌ Seed gagal:', error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
