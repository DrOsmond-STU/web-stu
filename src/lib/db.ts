import { Pool, type QueryResultRow } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __stuPool: Pool | undefined;
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL belum diatur. Salin .env.example menjadi .env lalu isi koneksi PostgreSQL Anda.',
    );
  }
  return new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

/**
 * Pool dibuat saat pertama kali dipakai (bukan saat modul diimpor) supaya
 * proses build tetap berjalan walau DATABASE_URL belum tersedia.
 * Instance yang sama dipakai ulang antar hot-reload dan antar request.
 */
export function getPool(): Pool {
  if (!global.__stuPool) global.__stuPool = createPool();
  return global.__stuPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params as never[]);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Menjalankan query tetapi mengembalikan nilai cadangan bila database belum siap.
 * Berguna agar halaman publik tetap tampil (memakai data bawaan) walau koneksi DB
 * bermasalah — website tidak mati total hanya karena database sedang down.
 */
export async function safeQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
  fallback: T[] = [],
): Promise<T[]> {
  try {
    return await query<T>(text, params);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[db] query gagal, memakai data cadangan:', (error as Error).message);
    }
    return fallback;
  }
}
