import Link from 'next/link';
import {
  IconArrowUpRight,
  IconBriefcase,
  IconImage,
  IconInbox,
  IconLayers,
  IconNews,
  IconPlus,
  IconQuote,
  IconSettings,
  IconUsers,
} from '@/components/icons';
import { getSession } from '@/lib/auth';
import { safeQuery } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function count(table: string, where = ''): Promise<number> {
  const rows = await safeQuery<{ n: number }>(
    `SELECT COUNT(*)::int AS n FROM ${table}${where ? ` WHERE ${where}` : ''}`,
  );
  return rows[0]?.n ?? 0;
}

export default async function AdminDashboard() {
  const session = await getSession();

  const [
    projects,
    projectsDraft,
    posts,
    postsDraft,
    testimonials,
    testimonialsDraft,
    services,
    team,
    gallery,
    experiences,
    unread,
    media,
  ] = await Promise.all([
    count('projects', 'published = TRUE'),
    count('projects', 'published = FALSE'),
    count('posts', 'published = TRUE'),
    count('posts', 'published = FALSE'),
    count('testimonials', 'published = TRUE'),
    count('testimonials', 'published = FALSE'),
    count('services', 'published = TRUE'),
    count('team_members', 'published = TRUE'),
    count('gallery_items', 'published = TRUE'),
    count('experiences', 'published = TRUE'),
    count('messages', 'is_read = FALSE'),
    count('media'),
  ]);

  const messages = await safeQuery<{
    id: number;
    name: string;
    subject: string;
    company: string;
    created_at: string;
    is_read: boolean;
  }>('SELECT id, name, subject, company, created_at, is_read FROM messages ORDER BY id DESC LIMIT 5');

  const recentPosts = await safeQuery<{
    id: number;
    title: string;
    published: boolean;
    updated_at: string;
  }>('SELECT id, title, published, updated_at FROM posts ORDER BY updated_at DESC LIMIT 5');

  const stats = [
    { label: 'Proyek Terbit', value: projects, draft: projectsDraft, href: '/admin/proyek', Icon: IconLayers, accent: 'from-brand-500 to-brand-700' },
    { label: 'Artikel Terbit', value: posts, draft: postsDraft, href: '/admin/artikel', Icon: IconNews, accent: 'from-sun-400 to-sun-600' },
    { label: 'Testimoni Terbit', value: testimonials, draft: testimonialsDraft, href: '/admin/testimoni', Icon: IconQuote, accent: 'from-emerald-400 to-emerald-600' },
    { label: 'Pesan Belum Dibaca', value: unread, draft: 0, href: '/admin/pesan', Icon: IconInbox, accent: 'from-rose-400 to-rose-600' },
  ];

  const quick = [
    { label: 'Tulis Artikel Baru', href: '/admin/artikel/baru', Icon: IconNews },
    { label: 'Tambah Proyek', href: '/admin/proyek/baru', Icon: IconLayers },
    { label: 'Tambah Testimoni', href: '/admin/testimoni/baru', Icon: IconQuote },
    { label: 'Ubah Pengaturan Situs', href: '/admin/pengaturan', Icon: IconSettings },
  ];

  const others = [
    { label: 'Layanan', value: services, href: '/admin/layanan', Icon: IconBriefcase },
    { label: 'Pengalaman Pekerjaan', value: experiences, href: '/admin/pengalaman', Icon: IconBriefcase },
    { label: 'Anggota Tim', value: team, href: '/admin/tim', Icon: IconUsers },
    { label: 'Item Galeri', value: gallery, href: '/admin/galeri', Icon: IconImage },
    { label: 'Berkas Media', value: media, href: '/admin/media', Icon: IconImage },
  ];

  return (
    <>
      <header className="mb-8">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">Dasbor</p>
        <h1 className="mt-2 text-3xl">Selamat datang, {session?.name.split(' ')[0]} 👋</h1>
        <p className="mt-2 text-[15px] text-ink-500">
          Ringkasan konten website Semesta Teknologi Utama.
        </p>
      </header>

      {/* Statistik utama */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, draft, href, Icon, accent }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-3xl border border-ink-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
          >
            <div className="flex items-start justify-between">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} p-3 text-white`}
              >
                <Icon className="h-full w-full" />
              </span>
              <IconArrowUpRight className="h-4 w-4 text-ink-300 transition-colors group-hover:text-brand-600" />
            </div>
            <p className="mt-5 text-4xl font-extrabold tabular-nums text-ink-900">{value}</p>
            <p className="mt-1 text-[13.5px] font-semibold text-ink-600">{label}</p>
            {draft > 0 ? (
              <p className="mt-1 text-[12px] text-sun-600">{draft} masih berstatus draf</p>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* Aksi cepat */}
        <section className="lg:col-span-4">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
              Aksi Cepat
            </h2>
            <ul className="mt-5 space-y-2">
              {quick.map(({ label, href, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-100 text-ink-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon className="h-[17px] w-[17px]" />
                    </span>
                    <span className="flex-1">{label}</span>
                    <IconPlus className="h-4 w-4 text-ink-300 group-hover:text-brand-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
            <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
              Konten Lain
            </h2>
            <ul className="mt-5 space-y-1">
              {others.map(({ label, value, href, Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] text-ink-700 transition-colors hover:bg-ink-50"
                  >
                    <Icon className="h-4 w-4 text-ink-400" />
                    <span className="flex-1">{label}</span>
                    <span className="font-bold tabular-nums text-ink-900">{value}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pesan & artikel terbaru */}
        <section className="lg:col-span-8">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                Pesan Terbaru
              </h2>
              <Link href="/admin/pesan" className="text-[12.5px] font-bold text-brand-700 hover:underline">
                Lihat semua
              </Link>
            </div>

            {messages.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-ink-50 px-5 py-8 text-center text-[13.5px] text-ink-500">
                Belum ada pesan masuk dari formulir kontak.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-ink-100">
                {messages.map((message) => (
                  <li key={message.id}>
                    <Link
                      href="/admin/pesan"
                      className="flex items-center gap-4 py-3.5 transition-colors hover:bg-ink-50/60"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${
                          message.is_read ? 'bg-ink-200' : 'bg-sun-500'
                        }`}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-bold text-ink-900">
                          {message.name}
                          {message.company ? (
                            <span className="font-normal text-ink-500"> · {message.company}</span>
                          ) : null}
                        </span>
                        <span className="block truncate text-[12.5px] text-ink-500">
                          {message.subject || 'Tanpa perihal'}
                        </span>
                      </span>
                      <span className="hidden shrink-0 text-[12px] text-ink-400 sm:block">
                        {formatDateTime(message.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                Artikel Terakhir Diubah
              </h2>
              <Link href="/admin/artikel" className="text-[12.5px] font-bold text-brand-700 hover:underline">
                Kelola artikel
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <p className="mt-6 rounded-2xl bg-ink-50 px-5 py-8 text-center text-[13.5px] text-ink-500">
                Belum ada artikel. Mulai tulis artikel pertama Anda agar website terindeks mesin
                pencari.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-ink-100">
                {recentPosts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/admin/artikel/${post.id}`}
                      className="flex items-center gap-4 py-3.5 transition-colors hover:bg-ink-50/60"
                    >
                      <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink-800">
                        {post.title}
                      </span>
                      <span
                        className={`badge shrink-0 ${
                          post.published ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-600'
                        }`}
                      >
                        {post.published ? 'Terbit' : 'Draf'}
                      </span>
                      <span className="hidden shrink-0 text-[12px] text-ink-400 sm:block">
                        {formatDateTime(post.updated_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      <p className="mt-8 rounded-2xl bg-brand-50 px-5 py-4 text-[13px] leading-relaxed text-brand-900">
        <strong>Tips SEO:</strong> terbitkan artikel baru secara berkala dan isi kolom “Judul SEO”
        serta “Deskripsi SEO” pada setiap artikel. Website ini sudah otomatis menghasilkan{' '}
        <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">sitemap.xml</code>,{' '}
        <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">robots.txt</code>, umpan RSS,
        dan data terstruktur agar mudah diindeks Google.
      </p>
    </>
  );
}
