/**
 * Definisi seluruh jenis konten yang bisa dikelola lewat CMS.
 *
 * Satu definisi di sini otomatis menghasilkan:
 *   - halaman daftar   : /admin/{key}
 *   - halaman tambah   : /admin/{key}/baru
 *   - halaman ubah     : /admin/{key}/{id}
 *   - aksi simpan/hapus/ubah status
 *
 * Nama tabel dan kolom hanya berasal dari berkas ini (tidak pernah dari input
 * pengguna), sehingga aman dipakai langsung dalam perintah SQL.
 */

export type FieldType =
  | 'text'
  | 'slug'
  | 'textarea'
  | 'markdown'
  | 'image'
  | 'number'
  | 'boolean'
  | 'select'
  | 'lines'      // TEXT[] — satu nilai per baris
  | 'tags'       // TEXT[] — dipisah koma
  | 'gallery'    // TEXT[] — daftar gambar
  | 'date';

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** Lebar kolom pada grid formulir (dari 12). */
  span?: 4 | 6 | 12;
  /** Ditampilkan pada panel samping, bukan kolom utama. */
  aside?: boolean;
  /** Field slug ini dibuat otomatis dari field bernama X. */
  from?: string;
};

export type ListColumn = {
  name: string;
  label: string;
  type?: 'text' | 'image' | 'boolean' | 'badge' | 'date' | 'money' | 'number';
  width?: string;
};

export type Resource = {
  key: string;
  table: string;
  label: string;
  labelSingular: string;
  description: string;
  icon: string;
  /** Kolom pengurutan pada halaman daftar. */
  orderBy: string;
  searchable: string[];
  columns: ListColumn[];
  fields: Field[];
  /** Ditampilkan sebagai judul baris pada daftar. */
  titleField: string;
  /** Kolom boolean yang bisa di-toggle langsung dari daftar. */
  toggleField?: string;
  /** Pesan bantuan di atas halaman daftar. */
  notice?: string;
};

export const RESOURCES: Resource[] = [
  {
    key: 'proyek',
    table: 'projects',
    label: 'Proyek & Produk',
    labelSingular: 'Proyek',
    description: 'Portofolio proyek dan produk aplikasi yang tampil di beranda serta halaman Proyek.',
    icon: 'layers',
    orderBy: 'sort_order, id',
    searchable: ['title', 'client', 'category'],
    titleField: 'title',
    toggleField: 'published',
    columns: [
      { name: 'cover_image', label: '', type: 'image', width: 'w-20' },
      { name: 'title', label: 'Judul' },
      { name: 'category', label: 'Kategori', type: 'badge' },
      { name: 'client', label: 'Klien' },
      { name: 'year', label: 'Tahun', type: 'number' },
      { name: 'featured', label: 'Unggulan', type: 'boolean' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Judul Proyek', type: 'text', required: true, span: 12 },
      { name: 'slug', label: 'Slug URL', type: 'slug', from: 'title', span: 12, hint: 'Alamat halaman: /proyek/slug-ini' },
      { name: 'summary', label: 'Ringkasan Singkat', type: 'textarea', span: 12, hint: 'Tampil pada kartu proyek. 1–2 kalimat.' },
      { name: 'description', label: 'Deskripsi Lengkap', type: 'markdown', span: 12 },
      { name: 'features', label: 'Fitur Aplikasi', type: 'lines', span: 12, hint: 'Satu fitur per baris.' },
      { name: 'cover_image', label: 'Gambar Sampul', type: 'image', span: 12, aside: true },
      { name: 'gallery', label: 'Tangkapan Layar', type: 'gallery', span: 12, aside: true, hint: 'Tampil sebagai galeri di halaman detail.' },
      { name: 'client', label: 'Klien', type: 'text', span: 12, aside: true },
      { name: 'category', label: 'Kategori', type: 'text', span: 6, aside: true, hint: 'Dipakai sebagai penyaring.' },
      { name: 'year', label: 'Tahun', type: 'number', span: 6, aside: true },
      { name: 'tech', label: 'Teknologi', type: 'tags', span: 12, aside: true, hint: 'Pisahkan dengan koma.' },
      { name: 'repo_name', label: 'Nama Repositori GitHub', type: 'text', span: 12, aside: true },
      { name: 'repo_url', label: 'Tautan GitHub', type: 'text', span: 12, aside: true },
      { name: 'demo_url', label: 'Tautan Aplikasi (demo)', type: 'text', span: 12, aside: true },
      { name: 'is_private', label: 'Repositori privat', type: 'boolean', span: 12, aside: true },
      { name: 'featured', label: 'Tampilkan sebagai unggulan', type: 'boolean', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true, hint: 'Angka kecil tampil lebih dulu.' },
      { name: 'published', label: 'Terbitkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'artikel',
    table: 'posts',
    label: 'Berita & Artikel',
    labelSingular: 'Artikel',
    description: 'Tulis artikel dan berita yang dioptimalkan agar terindeks Google dan mesin pencari lain.',
    icon: 'news',
    orderBy: 'published_at DESC NULLS LAST, id DESC',
    searchable: ['title', 'category', 'excerpt'],
    titleField: 'title',
    toggleField: 'published',
    columns: [
      { name: 'cover_image', label: '', type: 'image', width: 'w-20' },
      { name: 'title', label: 'Judul' },
      { name: 'category', label: 'Kategori', type: 'badge' },
      { name: 'author', label: 'Penulis' },
      { name: 'published_at', label: 'Terbit', type: 'date' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Judul Artikel', type: 'text', required: true, span: 12 },
      { name: 'slug', label: 'Slug URL', type: 'slug', from: 'title', span: 12, hint: 'Alamat halaman: /berita/slug-ini' },
      { name: 'excerpt', label: 'Ringkasan', type: 'textarea', span: 12, hint: 'Tampil di daftar artikel dan hasil pencarian.' },
      { name: 'content', label: 'Isi Artikel', type: 'markdown', span: 12, required: true },
      { name: 'cover_image', label: 'Gambar Utama', type: 'image', span: 12, aside: true },
      { name: 'category', label: 'Kategori', type: 'text', span: 12, aside: true },
      { name: 'tags', label: 'Tag', type: 'tags', span: 12, aside: true, hint: 'Pisahkan dengan koma.' },
      { name: 'author', label: 'Penulis', type: 'text', span: 12, aside: true },
      { name: 'published_at', label: 'Tanggal Terbit', type: 'date', span: 12, aside: true },
      { name: 'meta_title', label: 'Judul SEO', type: 'text', span: 12, aside: true, hint: 'Kosongkan untuk memakai judul artikel. Ideal 50–60 karakter.' },
      { name: 'meta_description', label: 'Deskripsi SEO', type: 'textarea', span: 12, aside: true, hint: 'Ideal 150–160 karakter.' },
      { name: 'focus_keyword', label: 'Kata Kunci Utama', type: 'text', span: 12, aside: true },
      { name: 'published', label: 'Terbitkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'testimoni',
    table: 'testimonials',
    label: 'Testimoni',
    labelSingular: 'Testimoni',
    description: 'Testimoni pelanggan yang tampil di beranda.',
    icon: 'quote',
    orderBy: 'sort_order, id',
    searchable: ['name', 'company'],
    titleField: 'name',
    toggleField: 'published',
    notice:
      'Empat entri contoh disiapkan sebagai draf. Ganti nama, jabatan, dan isi dengan testimoni asli dari klien Anda, lalu ubah statusnya menjadi Terbit. Bagian testimoni di beranda hanya muncul bila ada testimoni yang sudah diterbitkan.',
    columns: [
      { name: 'avatar', label: '', type: 'image', width: 'w-16' },
      { name: 'name', label: 'Nama' },
      { name: 'company', label: 'Instansi' },
      { name: 'rating', label: 'Rating', type: 'number' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Narasumber', type: 'text', required: true, span: 6 },
      { name: 'position', label: 'Jabatan', type: 'text', span: 6 },
      { name: 'company', label: 'Instansi / Perusahaan', type: 'text', span: 12 },
      { name: 'message', label: 'Isi Testimoni', type: 'textarea', required: true, span: 12, hint: 'Tuliskan kutipan asli dari klien.' },
      { name: 'avatar', label: 'Foto', type: 'image', span: 12, aside: true },
      { name: 'rating', label: 'Rating (1–5)', type: 'number', span: 12, aside: true },
      { name: 'featured', label: 'Tampilkan di beranda', type: 'boolean', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true },
      { name: 'published', label: 'Terbitkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'layanan',
    table: 'services',
    label: 'Layanan',
    labelSingular: 'Layanan',
    description: 'Layanan yang tampil di beranda, menu, dan halaman Layanan.',
    icon: 'briefcase',
    orderBy: 'sort_order, id',
    searchable: ['title'],
    titleField: 'title',
    toggleField: 'published',
    columns: [
      { name: 'image', label: '', type: 'image', width: 'w-20' },
      { name: 'title', label: 'Nama Layanan' },
      { name: 'icon', label: 'Ikon', type: 'badge' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Nama Layanan', type: 'text', required: true, span: 12 },
      { name: 'slug', label: 'Slug URL', type: 'slug', from: 'title', span: 12 },
      { name: 'summary', label: 'Ringkasan', type: 'textarea', span: 12 },
      { name: 'description', label: 'Deskripsi Lengkap', type: 'markdown', span: 12 },
      { name: 'features', label: 'Cakupan Pekerjaan', type: 'lines', span: 12, hint: 'Satu poin per baris.' },
      { name: 'image', label: 'Gambar', type: 'image', span: 12, aside: true },
      {
        name: 'icon',
        label: 'Ikon',
        type: 'select',
        span: 12,
        aside: true,
        options: ['code', 'network', 'wrench', 'certificate', 'layers', 'building', 'document', 'trending', 'shield', 'sparkles'],
      },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true },
      { name: 'published', label: 'Terbitkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'pengalaman',
    table: 'experiences',
    label: 'Pengalaman Pekerjaan',
    labelSingular: 'Pengalaman',
    description: 'Daftar kontrak pekerjaan yang tampil di halaman Pengalaman.',
    icon: 'briefcase',
    orderBy: 'sort_order, id',
    searchable: ['title', 'client', 'contract_no'],
    titleField: 'title',
    toggleField: 'published',
    columns: [
      { name: 'title', label: 'Nama Pekerjaan' },
      { name: 'client', label: 'Pemberi Tugas' },
      { name: 'year', label: 'Tahun', type: 'number' },
      { name: 'contract_value', label: 'Nilai', type: 'money' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Nama Pekerjaan', type: 'text', required: true, span: 12 },
      { name: 'client', label: 'Pemberi Tugas / Pengguna Jasa', type: 'text', span: 12 },
      { name: 'client_address', label: 'Alamat Pemberi Tugas', type: 'text', span: 6 },
      { name: 'location', label: 'Lokasi Pekerjaan', type: 'text', span: 6 },
      { name: 'field', label: 'Bidang / Sub Bidang', type: 'text', span: 12 },
      { name: 'contract_no', label: 'Nomor SPK / Kontrak', type: 'text', span: 6, aside: true },
      { name: 'contract_date', label: 'Tanggal Pelaksanaan', type: 'text', span: 6, aside: true, placeholder: 'contoh: 12 Desember 2023' },
      { name: 'contract_value', label: 'Nilai Kontrak (Rupiah)', type: 'number', span: 12, aside: true, hint: 'Tulis angka saja, tanpa titik.' },
      { name: 'year', label: 'Tahun', type: 'number', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true },
      { name: 'published', label: 'Tampilkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'tim',
    table: 'team_members',
    label: 'Tim',
    labelSingular: 'Anggota Tim',
    description: 'Anggota tim yang tampil di halaman Tentang Kami.',
    icon: 'users',
    orderBy: 'sort_order, id',
    searchable: ['name', 'position'],
    titleField: 'name',
    toggleField: 'published',
    columns: [
      { name: 'photo', label: '', type: 'image', width: 'w-16' },
      { name: 'name', label: 'Nama' },
      { name: 'position', label: 'Jabatan' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Lengkap', type: 'text', required: true, span: 6 },
      { name: 'position', label: 'Jabatan', type: 'text', span: 6 },
      { name: 'bio', label: 'Keterangan Singkat', type: 'textarea', span: 12 },
      { name: 'photo', label: 'Foto', type: 'image', span: 12, aside: true },
      { name: 'email', label: 'Email', type: 'text', span: 12, aside: true },
      { name: 'linkedin', label: 'LinkedIn', type: 'text', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true },
      { name: 'published', label: 'Tampilkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'klien',
    table: 'clients',
    label: 'Klien & Mitra',
    labelSingular: 'Klien',
    description:
      'Logo instansi dan perusahaan yang pernah memakai jasa kami. Tampil pada baris berjalan "Dipercaya oleh…" di beranda.',
    icon: 'building',
    orderBy: 'sort_order, id',
    searchable: ['name'],
    titleField: 'name',
    toggleField: 'published',
    notice:
      'Unggah logo dengan latar transparan (PNG) atau latar putih agar tampil rapi. Tinggi logo disamakan otomatis. Bila logo dikosongkan, yang tampil hanya nama instansi.',
    columns: [
      { name: 'logo', label: '', type: 'image', width: 'w-28' },
      { name: 'name', label: 'Nama Instansi / Perusahaan' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'name', label: 'Nama Instansi / Perusahaan', type: 'text', required: true, span: 12 },
      { name: 'website', label: 'Tautan Situs (opsional)', type: 'text', span: 12, hint: 'Bila diisi, logo dapat diklik menuju situs tersebut.' },
      { name: 'logo', label: 'Logo', type: 'image', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true, hint: 'Angka kecil tampil lebih dulu.' },
      { name: 'published', label: 'Tampilkan', type: 'boolean', span: 12, aside: true },
    ],
  },
  {
    key: 'galeri',
    table: 'gallery_items',
    label: 'Galeri',
    labelSingular: 'Item Galeri',
    description: 'Dokumentasi kegiatan yang tampil di beranda dan halaman Galeri.',
    icon: 'image',
    orderBy: 'sort_order, id',
    searchable: ['title', 'category'],
    titleField: 'title',
    toggleField: 'published',
    columns: [
      { name: 'image', label: '', type: 'image', width: 'w-20' },
      { name: 'title', label: 'Judul' },
      { name: 'category', label: 'Kategori', type: 'badge' },
      { name: 'sort_order', label: 'Urutan', type: 'number' },
      { name: 'published', label: 'Status', type: 'boolean' },
    ],
    fields: [
      { name: 'title', label: 'Judul', type: 'text', required: true, span: 12 },
      { name: 'caption', label: 'Keterangan', type: 'textarea', span: 12 },
      { name: 'image', label: 'Gambar', type: 'image', span: 12, aside: true, required: true },
      { name: 'category', label: 'Kategori', type: 'text', span: 12, aside: true },
      { name: 'sort_order', label: 'Urutan Tampil', type: 'number', span: 12, aside: true },
      { name: 'published', label: 'Tampilkan', type: 'boolean', span: 12, aside: true },
    ],
  },
];

export function getResource(key: string): Resource | undefined {
  return RESOURCES.find((resource) => resource.key === key);
}

export const ARRAY_FIELD_TYPES: FieldType[] = ['lines', 'tags', 'gallery'];
