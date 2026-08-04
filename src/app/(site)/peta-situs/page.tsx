import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowUpRight } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { getPosts, getProjects, getServices } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Peta Situs',
  description: 'Daftar seluruh halaman yang tersedia di website CV. Semesta Teknologi Utama.',
  alternates: { canonical: '/peta-situs' },
};

export default async function SitemapPage() {
  const [services, projects, posts] = await Promise.all([getServices(), getProjects(), getPosts()]);

  const groups = [
    {
      title: 'Halaman Utama',
      links: [
        { label: 'Beranda', href: '/' },
        { label: 'Tentang Kami', href: '/tentang-kami' },
        { label: 'Layanan', href: '/layanan' },
        { label: 'Sertifikasi Kompetensi', href: '/sertifikasi' },
        { label: 'Proyek & Produk', href: '/proyek' },
        { label: 'Pengalaman Pekerjaan', href: '/pengalaman' },
        { label: 'Galeri Kegiatan', href: '/galeri' },
        { label: 'Berita & Artikel', href: '/berita' },
        { label: 'Kontak', href: '/kontak' },
        { label: 'Kebijakan Privasi', href: '/kebijakan-privasi' },
      ],
    },
    {
      title: 'Layanan',
      links: services.map((s) => ({ label: s.title, href: `/layanan/${s.slug}` })),
    },
    {
      title: 'Proyek & Produk',
      links: projects.map((p) => ({ label: p.title, href: `/proyek/${p.slug}` })),
    },
    {
      title: 'Berita & Artikel',
      links: posts.map((p) => ({ label: p.title, href: `/berita/${p.slug}` })),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Navigasi"
        title="Peta situs"
        description="Seluruh halaman yang tersedia di website ini."
        breadcrumbs={[{ label: 'Peta Situs' }]}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-10 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.title} className="reveal card p-7">
              <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                {group.title}
              </h2>
              <ul className="mt-6 space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-[14.5px] text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span className="leading-snug">{link.label}</span>
                      <IconArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-page mt-12">
          <p className="reveal text-center text-[14px] text-ink-500">
            Versi XML untuk mesin pencari tersedia di{' '}
            <a href="/sitemap.xml" className="font-bold text-brand-700 hover:underline">
              /sitemap.xml
            </a>{' '}
            · Umpan RSS tersedia di{' '}
            <a href="/feed.xml" className="font-bold text-brand-700 hover:underline">
              /feed.xml
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
