import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DynamicIcon, IconArrowRight, IconCheck, IconWhatsapp } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { getServiceBySlug, getServices, getSettings } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl, whatsappLink } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: 'Layanan tidak ditemukan' };

  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/layanan/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.summary,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSettings(),
  ]);

  if (!service) notFound();
  const others = services.filter((item) => item.slug !== service.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.summary,
    serviceType: service.title,
    provider: { '@type': 'Organization', name: settings.company_name, url: absoluteUrl() },
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    url: absoluteUrl(`/layanan/${service.slug}`),
  };

  return (
    <>
      <PageHero
        eyebrow="Layanan"
        title={service.title}
        description={service.summary}
        image={service.image || '/images/hero/city-1.jpg'}
        breadcrumbs={[{ label: 'Layanan', href: '/layanan' }, { label: service.title }]}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="reveal flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                <DynamicIcon name={service.icon} className="h-8 w-8" />
              </span>
              <div>
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-600">
                  Layanan Kami
                </p>
                <h2 className="mt-1 text-2xl leading-tight">{service.title}</h2>
              </div>
            </div>

            <div
              className="prose-stu reveal mt-9"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(service.description) }}
            />

            {service.features.length > 0 ? (
              <div className="reveal mt-12 rounded-3xl border border-ink-100 bg-mesh p-8">
                <h3 className="text-xl">Cakupan Pekerjaan</h3>
                <ul className="mt-6 grid gap-3.5 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white">
                        <IconCheck className="h-3 w-3" strokeWidth={3} />
                      </span>
                      <span className="text-[14.5px] leading-relaxed text-ink-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="reveal sticky top-28 space-y-6">
              <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-ink-900 p-7 text-white shadow-lift">
                <h3 className="text-[19px] font-extrabold leading-snug text-white">
                  Butuh layanan ini untuk organisasi Anda?
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-100/80">
                  Konsultasi awal gratis. Kami bantu petakan kebutuhan sebelum menyusun penawaran.
                </p>
                <a
                  href={whatsappLink(
                    settings.whatsapp_number,
                    `Halo Semesta Teknologi Utama, saya ingin berkonsultasi mengenai layanan ${service.title}.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent mt-6 w-full"
                >
                  <IconWhatsapp className="h-4 w-4" />
                  Chat WhatsApp
                </a>
                <Link href="/kontak" className="btn-ghost-light mt-3 w-full">
                  Kirim Permintaan
                </Link>
              </div>

              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-soft">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover object-top"
                  />
                </div>
              ) : null}

              <div className="card p-6">
                <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                  Layanan Lainnya
                </h3>
                <ul className="mt-5 space-y-2">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/layanan/${item.slug}`}
                        className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-brand-50"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                          <DynamicIcon name={item.icon} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-[14px] font-semibold leading-snug text-ink-800 transition-colors group-hover:text-brand-700">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-mesh py-16">
        <div className="container-page reveal flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl">Lihat bagaimana kami mengerjakannya</h2>
            <p className="mt-2 text-[15px] text-ink-600">
              Telusuri portofolio proyek dan produk aplikasi kami.
            </p>
          </div>
          <Link href="/proyek" className="btn-primary shrink-0">
            Lihat Portofolio
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
