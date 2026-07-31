# Website Company Profile — CV. Semesta Teknologi Utama

Website resmi **semestateknologiutama.com** beserta CMS (panel pengelolaan konten) bawaan.
Seluruh isi website — teks, gambar, proyek, testimoni, artikel, hingga nomor WhatsApp —
dapat diubah sendiri melalui panel di `/admin` tanpa perlu menyentuh kode.

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Teknologi](#teknologi)
3. [Menjalankan di komputer sendiri](#menjalankan-di-komputer-sendiri)
4. [Deploy ke shared hosting cPanel](#deploy-ke-shared-hosting-cpanel)
5. [Panduan memakai CMS](#panduan-memakai-cms)
6. [Optimasi SEO](#optimasi-seo)
7. [Struktur berkas](#struktur-berkas)
8. [Hal yang perlu Anda lengkapi](#hal-yang-perlu-anda-lengkapi)

---

## Fitur

**Halaman publik**

| Halaman | Alamat | Isi |
|---|---|---|
| Beranda | `/` | Hero slider, statistik, profil singkat, layanan, portofolio, nilai perusahaan, testimoni, galeri, artikel terbaru |
| Tentang Kami | `/tentang-kami` | Profil, filosofi, visi & misi, nilai, legalitas (NIB/NPWP/KBLI), tim |
| Layanan | `/layanan` + `/layanan/{slug}` | 4 pilar layanan beserta cakupan pekerjaan |
| Proyek | `/proyek` + `/proyek/{slug}` | Portofolio dengan filter kategori, pencarian, galeri tangkapan layar, dan daftar fitur aplikasi |
| Pengalaman | `/pengalaman` | 25 daftar kontrak pekerjaan dengan pencarian & penyaring tahun |
| Galeri | `/galeri` | Dokumentasi kegiatan dengan tampilan besar (lightbox) |
| Berita | `/berita` + `/berita/{slug}` | Blog/berita dengan daftar isi, tombol berbagi, dan artikel terkait |
| Kontak | `/kontak` | Formulir kontak, peta lokasi, dan kanal WhatsApp |
| Pendukung | `/peta-situs`, `/kebijakan-privasi`, `/sitemap.xml`, `/robots.txt`, `/feed.xml` | |

**Widget chat WhatsApp** — tombol mengambang di seluruh halaman dengan panel percakapan,
sapaan otomatis, dan tombol pesan cepat. Semua teksnya dapat diubah lewat CMS.

**Panel CMS** di `/admin`:

- Dasbor ringkasan seluruh konten
- Kelola **Proyek & Produk**, **Berita & Artikel**, **Testimoni**, **Layanan**,
  **Pengalaman Pekerjaan**, **Tim**, dan **Galeri** (tambah, ubah, hapus, atur urutan,
  terbitkan/draf sekali klik)
- **Editor artikel** dengan bilah alat Markdown, unggah gambar langsung, pratinjau,
  penghitung kata, serta kolom SEO (judul meta, deskripsi meta, kata kunci)
- **Pengaturan Situs** — identitas perusahaan, kontak & WhatsApp, teks beranda,
  tentang kami, SEO, dan media sosial
- **Pesan Masuk** dari formulir kontak, lengkap dengan tombol balas via email/WhatsApp
- **Pustaka Media** untuk mengunggah dan memakai ulang gambar
- **Sinkronkan dari GitHub** — menarik daftar repositori menjadi entri proyek

---

## Teknologi

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3** dengan palet warna gradasi yang diambil dari logo SAESTU
- **PostgreSQL** melalui driver `pg` (tanpa ORM, agar ringan di shared hosting)
- Autentikasi admin: cookie sesi bertanda tangan (`jose`) + kata sandi ter-hash (`bcryptjs`)
- Font **Plus Jakarta Sans** di-host sendiri di `public/fonts` — proses build tidak
  memerlukan koneksi ke Google Fonts

---

## Menjalankan di komputer sendiri

Prasyarat: **Node.js 18.18+** dan **PostgreSQL**.

```bash
# 1. Pasang dependensi
npm install

# 2. Siapkan konfigurasi
cp .env.example .env
#    lalu buka .env dan isi DATABASE_URL serta AUTH_SECRET
#    membuat AUTH_SECRET acak:  openssl rand -base64 48

# 3. Buat tabel dan isi konten awal
npm run db:setup

# 4. Jalankan
npm run dev
```

Buka http://localhost:3000 untuk website dan http://localhost:3000/admin untuk CMS.

Akun admin pertama dibuat dari nilai `ADMIN_EMAIL` dan `ADMIN_PASSWORD` di `.env`.
**Segera ganti kata sandinya** melalui menu *Akun Saya* setelah login pertama.

### Perintah yang tersedia

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Mode pengembangan |
| `npm run build` | Membuat versi produksi |
| `npm start` | Menjalankan versi produksi |
| `npm run db:migrate` | Membuat/memperbarui tabel |
| `npm run db:seed` | Mengisi konten awal (aman diulang) |
| `npm run db:seed -- --reset` | **Mengosongkan** seluruh tabel konten lalu mengisi ulang |
| `npm run db:setup` | `db:migrate` + `db:seed` |

---

## Deploy ke shared hosting cPanel

### 1. Siapkan database PostgreSQL

Di cPanel → **PostgreSQL Databases**:

1. Buat database, misalnya `akunanda_stuweb`
2. Buat pengguna database dan catat kata sandinya
3. Tambahkan pengguna tersebut ke database dengan hak **ALL PRIVILEGES**

Susunan `DATABASE_URL`-nya menjadi:

```
postgres://akunanda_userdb:KATA_SANDI@localhost:5432/akunanda_stuweb
```

> Bila hosting Anda hanya menyediakan MySQL, gunakan layanan PostgreSQL gratis
> seperti Neon atau Supabase, lalu isi `DATABASE_URL` dari sana dan setel
> `DATABASE_SSL=true`.

### 2. Unggah berkas

Unggah seluruh isi repositori ke folder aplikasi (misalnya `~/semestateknologiutama`),
**kecuali** `node_modules` dan `.next`. Cara termudah: unggah berkas ZIP lalu ekstrak
melalui File Manager.

### 3. Buat aplikasi Node.js

cPanel → **Setup Node.js App** → Create Application:

| Kolom | Nilai |
|---|---|
| Node.js version | 18.x atau lebih baru |
| Application mode | Production |
| Application root | `semestateknologiutama` |
| Application URL | domain Anda |
| Application startup file | `server.js` |

Tambahkan variabel lingkungan berikut pada bagian **Environment variables**
(atau buat berkas `.env` di dalam application root):

```
NEXT_PUBLIC_SITE_URL=https://semestateknologiutama.com
DATABASE_URL=postgres://user:sandi@localhost:5432/nama_db
DATABASE_SSL=false
AUTH_SECRET=<hasil dari: openssl rand -base64 48>
ADMIN_EMAIL=admin@semestateknologiutama.com
ADMIN_PASSWORD=<kata sandi awal Anda>
GITHUB_USERNAME=DrOsmond-STU
GITHUB_TOKEN=<opsional, untuk menarik repositori privat>
UPLOAD_DIR=public/uploads
NODE_ENV=production
```

### 4. Pasang dependensi, build, dan siapkan database

Masuk ke terminal cPanel (atau tombol **Run NPM Install**), lalu jalankan dari
application root — awali dengan perintah `source` yang ditampilkan cPanel agar
memakai Node.js yang benar:

```bash
npm install
npm run build
npm run db:setup
```

### 5. Restart aplikasi

Klik **Restart** pada halaman Setup Node.js App. Website siap diakses.

### 6. Setelah online

1. Login ke `/admin`, ganti kata sandi melalui *Akun Saya*
2. Buka **Pengaturan Situs → Kontak & WhatsApp**, isi nomor WhatsApp yang benar
3. Buka **Pengaturan Situs → SEO**, tempel kode verifikasi Google Search Console
4. Daftarkan `https://semestateknologiutama.com/sitemap.xml` di Google Search Console

> **Catatan:** gambar yang diunggah lewat CMS tersimpan di `public/uploads`.
> Sertakan folder ini dalam pencadangan rutin Anda.

---

## Panduan memakai CMS

### Menulis artikel agar terindeks Google

1. Masuk ke **Berita & Artikel → Tambah Artikel**
2. Isi **Judul** — slug URL dibuat otomatis, tetapi tetap bisa disunting
3. Isi **Ringkasan** (tampil di daftar artikel dan hasil pencarian)
4. Tulis **Isi Artikel**. Gunakan bilah alat untuk sub judul (`H2`), tebal, daftar,
   dan tautan. Sisipkan gambar lewat tombol **Gambar**
5. Pada panel kanan, isi:
   - **Gambar Utama** — tampil saat artikel dibagikan ke media sosial
   - **Kategori** dan **Tag**
   - **Judul SEO** (50–60 karakter) dan **Deskripsi SEO** (150–160 karakter)
   - **Kata Kunci Utama** — kata kunci yang Anda targetkan
6. Aktifkan **Terbitkan**, lalu **Simpan**

Artikel otomatis masuk ke `sitemap.xml`, umpan RSS, dan mendapat data terstruktur
`BlogPosting` yang dibaca Google.

### Mengelola proyek

Setiap proyek memiliki gambar sampul, galeri tangkapan layar, daftar fitur, klien,
tahun, dan teknologi. Untuk repositori GitHub, gunakan tombol **Sinkronkan dari GitHub**
di halaman *Proyek & Produk* — repositori baru masuk sebagai **draf** agar Anda dapat
melengkapi tangkapan layar dan deskripsinya lebih dulu sebelum diterbitkan.

### Mengubah nomor WhatsApp

**Pengaturan Situs → Kontak & WhatsApp**. Selain nomor, Anda juga dapat mengubah
sapaan awal, pesan otomatis, dan daftar tombol pesan cepat di widget chat.

---

## Optimasi SEO

Yang sudah berjalan otomatis:

- Meta title, description, dan keyword per halaman
- Tautan kanonik (canonical) di setiap halaman
- Open Graph & Twitter Card untuk pratinjau saat dibagikan
- Data terstruktur JSON-LD: `Organization`, `WebSite`, `Service`, `BlogPosting`,
  `BreadcrumbList`, `ContactPage`, `CreativeWork`
- `sitemap.xml` yang selalu mengikuti isi database
- `robots.txt` yang melarang perayapan `/admin` dan `/api`
- Umpan RSS di `/feed.xml`
- Bahasa halaman `id-ID`, HTML semantik, dan teks alternatif pada gambar

Yang perlu Anda lakukan sendiri:

1. Daftarkan situs di [Google Search Console](https://search.google.com/search-console)
   dan tempel kode verifikasinya di **Pengaturan Situs → SEO**
2. Kirimkan `sitemap.xml` melalui Search Console
3. Isi **ID Google Analytics** bila ingin memantau kunjungan
4. Terbitkan artikel secara berkala — ini faktor terbesar agar website muncul di pencarian

---

## Struktur berkas

```
├── db/schema.sql              Skema tabel PostgreSQL
├── scripts/
│   ├── migrate.mjs            Membuat tabel
│   └── seed.mjs               Mengisi konten awal
├── public/
│   ├── images/                Gambar dari materi company profile
│   ├── fonts/                 Font Plus Jakarta Sans (self-hosted)
│   └── uploads/               Gambar yang diunggah lewat CMS
├── server.js                  Titik masuk untuk cPanel/Passenger
└── src/
    ├── app/
    │   ├── (site)/            Seluruh halaman publik
    │   ├── admin/             Panel CMS
    │   ├── api/               Formulir kontak & unggah berkas
    │   ├── sitemap.ts robots.ts feed.xml/
    │   └── layout.tsx globals.css
    ├── components/            Komponen antarmuka
    ├── data/                  Konten awal (JSON) — dipakai seed & data cadangan
    └── lib/
        ├── admin/             Definisi CMS, server action, sinkronisasi GitHub
        ├── auth.ts db.ts content.ts markdown.ts utils.ts defaults.ts
```

Bila database sedang tidak dapat diakses, halaman publik otomatis memakai data
cadangan dari `src/data/` sehingga website tetap tampil utuh.

---

## Hal yang perlu Anda lengkapi

Beberapa isi sengaja dibiarkan sebagai placeholder karena memerlukan data asli:

| Isi | Lokasi di CMS | Keterangan |
|---|---|---|
| **Nomor WhatsApp & telepon** | Pengaturan Situs → Kontak & WhatsApp | Saat ini masih `628123456789` |
| **Email perusahaan** | Pengaturan Situs → Kontak & WhatsApp | Saat ini `info@semestateknologiutama.com` |
| **Testimoni pelanggan** | Testimoni | Empat entri contoh berstatus **draf**. Ganti dengan kutipan asli dari klien, lalu terbitkan. Bagian testimoni di beranda baru muncul setelah ada testimoni yang diterbitkan |
| **Tangkapan layar produk GitHub** | Proyek & Produk | Produk dari repositori GitHub memakai gambar sampul bergradasi. Ganti dengan tangkapan layar aplikasi yang sebenarnya |
| **Deskripsi & fitur produk GitHub** | Proyek & Produk | Ditulis berdasarkan nama dan deskripsi repositori — mohon diperiksa dan disesuaikan dengan kondisi aplikasi sebenarnya |
| **Tautan media sosial** | Pengaturan Situs → Media Sosial | Ikon hanya tampil bila tautannya diisi |
| **Peta lokasi** | Pengaturan Situs → Kontak & WhatsApp | Sesuaikan URL embed dengan titik kantor yang tepat |

---

© CV. Semesta Teknologi Utama
