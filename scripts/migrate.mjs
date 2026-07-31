#!/usr/bin/env node
/**
 * Membuat seluruh tabel yang dibutuhkan website.
 * Jalankan: npm run db:migrate
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { loadEnv } from './env.mjs';

loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

if (!process.env.DATABASE_URL) {
  console.error('\n❌ DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi koneksi PostgreSQL Anda.\n');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const sql = readFileSync(join(root, 'db', 'schema.sql'), 'utf8');
  await client.query(sql);
  console.log('✅ Migrasi selesai — seluruh tabel siap digunakan.');
} catch (error) {
  console.error('❌ Migrasi gagal:', error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
