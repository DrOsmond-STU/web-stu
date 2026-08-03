import type { Metadata } from 'next';
import Link from 'next/link';
import { CertificateWall } from '@/components/certificate-wall';
import { CertificationCatalog } from '@/components/certification-catalog';
import {
  IconArrowRight,
  IconAward,
  IconCertificate,
  IconExternal,
  IconShield,
} from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { getCertificateProofs, getCertifications, getSettings } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.sertifikasi_title || 'Sertifikasi Kompetensi',
    description:
      settings.sertifikasi_subtitle ||
      'Sertifikasi kompetensi internasional lewat Certiport dan PASAS Academy Singapore, serta sertifikasi nasional BNSP bersama LSP Media Informatika.',
    alternates: { canonical: '/sertifikasi' },
  };
}

type Mitra = { name: string; url: string };

function KartuMitra({ mitra }: { mitra: Mitra }) {
  const isi = (
    <>
      <span className="text-[14.5px] font-bold text-ink-900 group-hover:text-brand-700">
        {mitra.name}
      </span>
      {mitra.url ? <IconExternal className="h-4 w-4 shrink-0 text-ink-400" /> : null}
    </>
  );

  const kelas =
    'group flex items-center justify-between gap-3 rounded-2xl border-2 border-ink-100 bg-white px-4 py-3.5 transition-colors hover:border-brand-300';

  return mitra.url ? (
    <a href={mitra.url} target="_blank" rel="noopener noreferrer" className={kelas}>
      {isi}
    </a>
  ) : (
    <div className={kelas}>{isi}</div>
  );
}

export default async function CertificationPage() {
  const [settings, certifications, proofs] = await Promise.all([
    getSettings(),
    getCertifications(),
    getCertificateProofs(),
  ]);

  const showFee = settings.sertifikasi_tampilkan_biaya !== 'false';

  const internasional = certifications.filter((c) => c.scheme !== 'nasional');
  const nasional = certifications.filter((c) => c.scheme === 'nasional');

  const vendors = new Set(certifications.map((c) => c.vendor).filter(Boolean)).size;
  const fields = new Set(certifications.map((c) => c.field).filter(Boolean)).size;

  const mitraInternasional: Mitra[] = [
    { name: settings.sertifikasi_intl_partner_1_name, url: settings.sertifikasi_intl_partner_1_url },
    { name: settings.sertifikasi_intl_partner_2_name, url: settings.sertifikasi_intl_partner_2_url },
    { name: settings.sertifikasi_intl_partner_3_name, url: settings.sertifikasi_intl_partner_3_url },
  ].filter((m) => m.name);

  const mitraBnsp: Mitra[] = [
    { name: settings.sertifikasi_bnsp_partner_name, url: settings.sertifikasi_bnsp_partner_url },
  ].filter((m) => m.name);

  const ringkasan = [
    { label: 'Skema Sertifikasi', value: String(certifications.length), hint: 'Internasional & nasional' },
    { label: 'Penerbit Sertifikat', value: String(vendors), hint: 'Microsoft, Cisco, Adobe, PASAS, dan lainnya' },
    { label: 'Bidang Keahlian', value: String(fields), hint: 'Dari TI hingga bisnis & desain' },
    { label: 'Jalur Sertifikasi', value: nasional.length > 0 ? '2' : '2', hint: 'Certiport/PASAS & BNSP' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: settings.sertifikasi_title || 'Sertifikasi Kompetensi',
    serviceType: 'Sertifikasi kompetensi profesional',
    description: settings.sertifikasi_subtitle,
    url: absoluteUrl('/sertifikasi'),
    provider: {
      '@type': 'Organization',
      name: settings.company_name,
      url: absoluteUrl('/'),
    },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: settings.sertifikasi_katalog_title || 'Katalog Skema Sertifikasi',
      itemListElement: certifications.slice(0, 60).map((c) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: c.name, provider: { '@type': 'Organization', name: c.vendor } },
        ...(showFee && c.exam_fee
          ? { price: String(c.exam_fee), priceCurrency: 'IDR' }
          : {}),
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={settings.sertifikasi_eyebrow}
        title={settings.sertifikasi_title}
        description={settings.sertifikasi_subtitle}
        image="/images/hero/handshake.jpg"
        breadcrumbs={[{ label: 'Sertifikasi' }]}
      />

      {/* Ringkasan angka */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container-page grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ringkasan.map((item) => (
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

      {/* Dua jalur sertifikasi */}
      <section className="section bg-ink-50/60">
        <div className="container-page">
          <SectionHeading
            eyebrow="Dua Jalur"
            title="Sertifikasi internasional dan nasional"
            description="Dua program yang berbeda pengakuannya — pilih sesuai kebutuhan karier, akreditasi, atau persyaratan pengadaan."
          />

          <div className="mt-14 grid gap-7 lg:grid-cols-2">
            {/* Internasional */}
            <article className="reveal card flex flex-col p-8">
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-glow">
                <IconCertificate className="h-6 w-6" />
              </span>

              <h3 className="mt-6 text-[22px] font-extrabold leading-snug text-ink-900">
                {settings.sertifikasi_intl_title}
              </h3>

              <div
                className="prose-stu mt-4 flex-1 text-[15px] leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.sertifikasi_intl_body) }}
              />

              {mitraInternasional.length > 0 ? (
                <div className="mt-7">
                  <p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                    Mitra penyelenggara
                  </p>
                  <div className="grid gap-2.5">
                    {mitraInternasional.map((m) => (
                      <KartuMitra key={m.name} mitra={m} />
                    ))}
                  </div>
                </div>
              ) : null}
            </article>

            {/* BNSP */}
            <article className="reveal card flex flex-col p-8">
              <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gradient-to-br from-sun-500 to-sun-400 text-white shadow-glow">
                <IconShield className="h-6 w-6" />
              </span>

              <h3 className="mt-6 text-[22px] font-extrabold leading-snug text-ink-900">
                {settings.sertifikasi_bnsp_title}
              </h3>

              <div
                className="prose-stu mt-4 flex-1 text-[15px] leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(settings.sertifikasi_bnsp_body) }}
              />

              {mitraBnsp.length > 0 ? (
                <div className="mt-7">
                  <p className="mb-3 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-ink-400">
                    Lembaga sertifikasi
                  </p>
                  <div className="grid gap-2.5">
                    {mitraBnsp.map((m) => (
                      <KartuMitra key={m.name} mitra={m} />
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          </div>
        </div>
      </section>

      {/* Katalog skema */}
      <section className="section bg-white">
        <div className="container-page">
          <SectionHeading
            align="left"
            eyebrow="Katalog"
            title={settings.sertifikasi_katalog_title}
            description="Cari berdasarkan nama sertifikat, penyelenggara, atau bidang keahlian."
            className="max-w-2xl"
          />

          <div className="mt-12">
            <CertificationCatalog items={internasional} showFee={showFee} />
          </div>

          {settings.sertifikasi_katalog_note ? (
            <p className="reveal mx-auto mt-10 max-w-3xl rounded-2xl border border-ink-100 bg-ink-50/70 px-6 py-5 text-center text-[13.5px] leading-relaxed text-ink-600">
              {settings.sertifikasi_katalog_note}
            </p>
          ) : null}
        </div>
      </section>

      {/* Katalog BNSP — hanya tampil bila sudah diisi lewat CMS */}
      {nasional.length > 0 ? (
        <section className="section bg-ink-50/60">
          <div className="container-page">
            <SectionHeading
              align="left"
              eyebrow="BNSP"
              title="Skema sertifikasi nasional"
              description="Skema kompetensi berlisensi BNSP yang dapat diikuti melalui kami."
              className="max-w-2xl"
            />
            <div className="mt-12">
              <CertificationCatalog items={nasional} showFee={showFee} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Bukti sertifikat — hanya tampil bila ada yang diterbitkan lewat CMS */}
      {proofs.length > 0 ? (
        <section className="section bg-white">
          <div className="container-page">
            <SectionHeading
              eyebrow="Bukti"
              title={settings.sertifikasi_bukti_title}
              description={settings.sertifikasi_bukti_subtitle}
            />
            <div className="mt-14">
              <CertificateWall items={proofs} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Ajakan bertindak */}
      <section className="bg-deep section relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '58px 58px',
          }}
        />
        <div className="container-page relative">
          <div className="reveal mx-auto max-w-2xl text-center">
            <span className="mx-auto flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-white/12 text-white backdrop-blur">
              <IconAward className="h-6 w-6" />
            </span>
            <h2 className="mt-7 text-3xl leading-[1.15] text-white sm:text-[40px]">
              {settings.sertifikasi_cta_title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-brand-100/85">
              {settings.sertifikasi_cta_subtitle}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href="/kontak" className="btn-accent">
                Ajukan Penawaran
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/layanan" className="btn-ghost-light">
                Lihat Layanan Lain
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
