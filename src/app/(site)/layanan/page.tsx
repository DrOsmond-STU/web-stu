import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicIcon, IconArrowRight, IconCheck, IconWhatsapp } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { getServices, getSettings } from '@/lib/content';
import { whatsappLink } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Layanan',
    description:
      'Layanan CV. Semesta Teknologi Utama: pengembangan aplikasi khusus, desain & pembangunan jaringan, service & maintenance, serta implementasi dan sertifikasi ISO.',
    alternates: { canonical: '/layanan' },
  };
}

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <PageHero
        eyebrow="Layanan Kami"
        title="Solusi menyeluruh untuk kebutuhan teknologi informasi Anda"
        description="Empat pilar layanan yang saling melengkapi — dari perangkat lunak, infrastruktur, pemeliharaan, hingga tata kelola sistem manajemen."
        image="/images/hero/analytics.jpg"
        breadcrumbs={[{ label: 'Layanan' }]}
      />

      <section className="section bg-white">
        <div className="container-page space-y-20 lg:space-y-28">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.slug}
              className="reveal grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-16"
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] bg-ink-100 shadow-lift">
                  <Image
                    src={service.image || '/images/hero/city-1.jpg'}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/45 to-transparent" />

                  <span className="absolute left-6 top-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/95 text-brand-600 shadow-lg backdrop-blur">
                    <DynamicIcon name={service.icon} className="h-7 w-7" />
                  </span>
                  <span className="absolute bottom-6 left-6 rounded-full bg-white/95 px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-ink-800 backdrop-blur">
                    Layanan {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <h2 className="text-[27px] leading-tight sm:text-[34px]">{service.title}</h2>
                <p className="mt-5 text-[16.5px] leading-relaxed text-ink-600">{service.summary}</p>

                {service.features.length > 0 ? (
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                          <IconCheck className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="text-[14.5px] leading-relaxed text-ink-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href={`/layanan/${service.slug}`} className="btn-primary">
                    Detail Layanan
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={whatsappLink(
                      settings.whatsapp_number,
                      `Halo Semesta Teknologi Utama, saya ingin berkonsultasi mengenai layanan ${service.title}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                  >
                    <IconWhatsapp className="h-4 w-4 text-[#25D366]" />
                    Tanya via WhatsApp
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-deep py-20">
        <div className="container-page reveal text-center">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-white sm:text-[38px]">
            Belum yakin layanan mana yang Anda butuhkan?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed text-brand-100/80">
            Ceritakan kendala yang Anda hadapi. Kami bantu petakan kebutuhannya lebih dulu — tanpa
            biaya konsultasi awal.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/kontak" className="btn-accent !px-8 !py-4">
              Konsultasi Sekarang
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/proyek" className="btn-ghost-light !px-8 !py-4">
              Lihat Hasil Kerja Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
