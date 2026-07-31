import settingsData from '@/data/settings.json';

/**
 * Nilai bawaan seluruh konten yang bisa diedit lewat CMS.
 *
 * Sumber data: `src/data/settings.json` — berkas yang sama juga dipakai oleh
 * `npm run db:seed` sehingga isi database dan nilai cadangan selalu sinkron.
 *
 * Halaman publik selalu membaca dari database; bila sebuah key belum ada
 * (atau database belum diisi) maka nilai di berkas ini yang dipakai —
 * sehingga website tidak pernah tampil kosong.
 */

export type SettingType = 'text' | 'textarea' | 'markdown' | 'image' | 'number' | 'boolean' | 'json';

export type SettingDef = {
  key: string;
  value: string;
  group: string;
  label: string;
  type: SettingType;
  hint?: string;
};

export const SETTING_GROUPS: { id: string; label: string; description: string }[] = [
  { id: 'identitas', label: 'Identitas Perusahaan', description: 'Nama, logo, legalitas & bidang usaha' },
  { id: 'kontak', label: 'Kontak & WhatsApp', description: 'Nomor WhatsApp, telepon, email & peta lokasi' },
  { id: 'beranda', label: 'Beranda', description: 'Teks hero, slide, statistik & ajakan bertindak' },
  { id: 'tentang', label: 'Tentang Kami', description: 'Profil, visi, misi & nilai perusahaan' },
  { id: 'seo', label: 'SEO & Verifikasi', description: 'Judul meta, deskripsi, kata kunci & Search Console' },
  { id: 'sosial', label: 'Media Sosial', description: 'Tautan akun media sosial perusahaan' },
];

export const DEFAULT_SETTINGS = settingsData as SettingDef[];

export const DEFAULT_SETTINGS_MAP: Record<string, string> = Object.fromEntries(
  DEFAULT_SETTINGS.map((s) => [s.key, s.value]),
);
