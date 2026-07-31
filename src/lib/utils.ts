export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 90);
}

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  const time = `${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
  return `${formatDate(date)} · ${time}`;
}

export function formatRupiah(value: number | string | null | undefined): string {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number)) return 'Rp 0';
  return `Rp ${number.toLocaleString('id-ID')}`;
}

/** Membangun tautan wa.me lengkap dengan pesan yang sudah terisi. */
export function whatsappLink(number: string, message?: string): string {
  const clean = (number || '').replace(/[^0-9]/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${clean}${text}`;
}

export function truncate(value: string, max = 160): string {
  const text = (value || '').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

/** Mengubah teks bertingkat baris menjadi array (dipakai untuk setting multi-baris). */
export function linesToArray(value: string | undefined): string[] {
  return (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export function absoluteUrl(path = ''): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://semestateknologiutama.com').replace(/\/$/, '');
  if (!path) return base;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
