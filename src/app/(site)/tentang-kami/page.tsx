import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  DynamicIcon,
  IconArrowRight,
  IconCheckCircle,
  IconDocument,
  IconSparkles,
  IconTrendingUp,
} from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { getSettings, getTeam, parseJsonSetting } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { linesToArray } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: 'Tentang Kami',
    description: `Profil ${settings.company_name} — visi, misi, nilai perusahaan, legalitas, dan tim di balik layanan teknologi informasi kami.`,
    alternates: { canonical: '/tentang-kami' },
  };
}

type ValueItem = { title: string; icon: string; text: string };

export default async function AboutPage() {
  const [settings, team] = await Promise.all([getSettings(), getTeam()]);
  const values = parseJsonSetting<ValueItem[]>(settings.values, []);
  const kbli = linesToArray(settings.kbli_list);

  const legal = [
    { label: 'Akta Pendirian', value: settings.legal_akta },
    { label: 'Nomor Induk Berusaha (NIB)', value: settings.legal_nib },
    { label: 'Surat Izin Usaha', value: settings.legal_siup },
    { label: 'NPWP', value: settings.legal_npwp },
  ];

  return (
    <>
      <PageHero
        eyebrow="Profil Perusahaan"
        title="Tentang CV. Semesta Teknologi Utama"
        description={settings.tagline}
        image="/images/hero/office.jpg"
        breadcrumbs={[{ label: 'Tentang Kami' }]}
      />

      {/* ----------------------------------------------------------- narasi */}
      <section className="section bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="eyebrow reveal">Siapa Kami</span>
            <h2 className="reveal mt-5 text-3xl leading-tight sm:text-[38px]">
              Membangun sistem yang dirawat, bukan sekadar dikembangkan
            </h2>
            <p className="reveal mt-6 text-[17px] leading-relaxed text-ink-700">
              {settings.about_intro}
            </p>
            <div
              className="prose-stu reveal mt-6"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.about_body) }}
            />
          </div>

          <aside className="lg:col-span-5">
            <div className="reveal sticky top-28 space-y-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-lift">
                <Image
                  src={settings.about_image || '/images/hero/meeting.jpg'}
                  alt={settings.company_name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-7 text-white shadow-glow">
                <IconSparkles className="h-8 w-8 text-sun-300" />
                <p className="mt-4 text-[15px] font-bold uppercase tracking-wider text-brand-100">
                  Filosofi Kami
                </p>
                <p className="mt-2 text-[19px] font-extrabold leading-snug">
                  “Sistem yang memelihara”, bukan hanya “mengembangkan sistem”.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-100/80">
                  Sistem tumbuh seperti makhluk hidup — semakin kompleks, semakin tinggi
                  ketidakpastiannya. Karena itu ia harus terus dipupuk hingga mandiri.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ------------------------------------------------------ visi & misi */}
      <section className="section bg-mesh">
        <div className="container-page">
          <SectionHeading
            eyebrow="Arah Perusahaan"
            title="Visi & Misi"
            description="Arah yang kami tuju dan janji yang kami pegang kepada setiap klien."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            <div className="reveal card relative overflow-hidden p-9">
              <span className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <IconTrendingUp className="h-7 w-7" />
              </span>
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                Visi
              </h3>
              <p className="mt-5 max-w-md text-[17px] font-medium leading-relaxed text-ink-800">
                {settings.vision}
              </p>
            </div>

            <div className="reveal card relative overflow-hidden p-9">
              <span className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-sun-50 text-sun-600">
                <IconCheckCircle className="h-7 w-7" />
              </span>
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-sun-600">
                Misi
              </h3>
              <p className="mt-5 max-w-md text-[17px] font-medium leading-relaxed text-ink-800">
                {settings.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- nilai perusahaan */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Nilai Perusahaan"
            title="Empat nilai yang kami pegang"
            description="Nilai-nilai ini tumbuh dari perjalanan kami sejak langkah pertama."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="reveal card card-hover flex gap-5 p-7"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                  <DynamicIcon name={value.icon} className="h-7 w-7" />
                </span>
                <div>
                  <h3 className="text-[18px] font-extrabold text-ink-900">{value.title}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-600">{value.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- legalitas */}
      <section className="section bg-deep relative overflow-hidden">
        <div className="container-page relative">
          <SectionHeading
            light
            eyebrow="Legalitas"
            title="Perusahaan yang terdaftar dan berizin lengkap"
            description="Seluruh dokumen legalitas kami tersedia dan dapat diverifikasi."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <div className="reveal lg:col-span-5">
              <dl className="space-y-3">
                {legal.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/12 bg-white/[0.06] p-5 backdrop-blur-sm"
                  >
                    <dt className="text-[11.5px] font-bold uppercase tracking-wider text-brand-300">
                      {item.label}
                    </dt>
                    <dd className="mt-1.5 text-[15px] font-semibold leading-snug text-white">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="reveal lg:col-span-7">
              <div className="rounded-3xl border border-white/12 bg-white/[0.06] p-7 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <IconDocument className="h-6 w-6 text-sun-400" />
                  <h3 className="text-[17px] font-extrabold text-white">
                    Bidang Usaha (KBLI) yang Kami Layani
                  </h3>
                </div>
                <ul className="mt-6 space-y-3">
                  {kbli.map((item) => {
                    const [code, ...rest] = item.split('—');
                    return (
                      <li key={item} className="flex gap-4">
                        <span className="mt-0.5 shrink-0 rounded-lg bg-brand-500/20 px-2.5 py-1 font-mono text-[12.5px] font-bold text-brand-300">
                          {code.trim()}
                        </span>
                        <span className="text-[14.5px] leading-relaxed text-brand-100/80">
                          {rest.join('—').trim()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ tim */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Tim Kami"
            title="Orang-orang di balik setiap proyek"
            description="Tim yang menangani langsung analisis, pengembangan, hingga pendampingan di lapangan."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {team.map((member, index) => (
              <div
                key={member.id}
                className="reveal card card-hover group overflow-hidden"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink-100">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-4xl font-extrabold text-white">
                      {member.name.slice(0, 1)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-extrabold leading-snug text-ink-900">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[12.5px] font-semibold text-brand-600">{member.position}</p>
                  {member.bio ? (
                    <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">{member.bio}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal mt-16 flex flex-col items-center gap-5 rounded-[32px] bg-mesh p-10 text-center sm:p-14">
            <h3 className="text-2xl sm:text-3xl">Ingin bekerja sama dengan tim kami?</h3>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-ink-600">
              Ceritakan kebutuhan organisasi Anda. Kami akan bantu memetakan solusinya terlebih
              dahulu sebelum bicara angka.
            </p>
            <Link href="/kontak" className="btn-primary">
              Hubungi Kami
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
