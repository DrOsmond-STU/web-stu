import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconBriefcase, IconMapPin } from '@/components/icons';
import { ExperienceTable } from '@/components/experience-table';
import { PageHero } from '@/components/page-hero';
import { getExperiences } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Daftar Pengalaman Pekerjaan',
    description:
      'Daftar pengalaman pekerjaan CV. Semesta Teknologi Utama pada instansi pemerintah, BUMN, dan perusahaan swasta sejak 2020 — lengkap dengan nomor kontrak dan nilai pekerjaan.',
    alternates: { canonical: '/pengalaman' },
  };
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  const clients = new Set(experiences.map((item) => item.client)).size;
  const fields = new Set(experiences.map((item) => item.field)).size;
  const years = experiences.map((item) => item.year).filter(Boolean) as number[];
  const range = years.length ? `${Math.min(...years)} – ${Math.max(...years)}` : '—';

  const summary = [
    { label: 'Total Pekerjaan', value: String(experiences.length), hint: 'Kontrak yang telah diselesaikan' },
    { label: 'Institusi Klien', value: String(clients), hint: 'Kementerian, lembaga & korporasi' },
    { label: 'Rentang Tahun', value: range, hint: 'Sejak perusahaan berdiri' },
    { label: 'Bidang Layanan', value: String(fields), hint: 'Teknologi informasi & konsultasi manajemen' },
  ];

  return (
    <>
      <PageHero
        eyebrow="Rekam Jejak"
        title="Daftar pengalaman pekerjaan"
        description="Rekam jejak pekerjaan kami bersama kementerian, lembaga negara, pemerintah daerah, dan perusahaan nasional."
        image="/images/hero/tower.jpg"
        breadcrumbs={[{ label: 'Pengalaman' }]}
      />

      {/* Ringkasan */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {summary.map((item) => (
            <div key={item.label} className="reveal">
              <p className="text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-brand-600">
                {item.label}
              </p>
              <p className="mt-3 text-[26px] font-extrabold leading-tight text-ink-900 sm:text-[30px]">
                {item.value}
              </p>
              <p className="mt-1.5 text-[13px] text-ink-500">{item.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section bg-mesh">
        <div className="container-page">
          <div className="reveal mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">
                <IconBriefcase className="h-3.5 w-3.5" />
                Daftar Kontrak
              </span>
              <h2 className="mt-4 text-3xl">Seluruh pekerjaan yang telah kami selesaikan</h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-ink-500">
              Gunakan pencarian dan penyaring tahun untuk menelusuri daftar pekerjaan di bawah ini.
            </p>
          </div>

          <ExperienceTable items={experiences} />
        </div>
      </section>

      <section className="bg-deep py-20">
        <div className="container-page reveal grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow-light">
              <IconMapPin className="h-3.5 w-3.5" />
              Jangkauan Layanan
            </span>
            <h2 className="mt-5 text-3xl leading-tight text-white sm:text-[38px]">
              Melayani klien di Jakarta hingga Nusa Tenggara Timur
            </h2>
            <p className="mt-5 max-w-xl text-[16.5px] leading-relaxed text-brand-100/80">
              Kami terbiasa bekerja lintas wilayah — baik untuk pengadaan perangkat, pengembangan
              aplikasi, maupun pendampingan sertifikasi di lokasi klien.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/kontak" className="btn-accent !px-8 !py-4">
              Ajukan Penawaran
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/proyek" className="btn-ghost-light !px-8 !py-4">
              Lihat Portofolio
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
