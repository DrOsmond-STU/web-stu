import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact-form';
import {
  IconClock,
  IconMail,
  IconMapPin,
  IconPhone,
  IconWhatsapp,
} from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { getSettings } from '@/lib/content';
import { absoluteUrl, whatsappLink } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: 'Kontak',
    description: `Hubungi ${settings.company_name} di ${settings.address}. Telepon ${settings.contact_phone}, email ${settings.contact_email}, atau chat langsung lewat WhatsApp.`,
    alternates: { canonical: '/kontak' },
  };
}

export default async function ContactPage() {
  const settings = await getSettings();

  const channels = [
    {
      Icon: IconWhatsapp,
      label: 'WhatsApp',
      value: settings.contact_phone,
      hint: 'Balasan tercepat pada jam kerja',
      href: whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message),
      external: true,
      accent: 'from-[#25D366] to-[#128C7E]',
    },
    {
      Icon: IconPhone,
      label: 'Telepon',
      value: settings.contact_phone,
      hint: settings.office_hours,
      href: `tel:${(settings.contact_phone || '').replace(/[^0-9+]/g, '')}`,
      external: false,
      accent: 'from-brand-500 to-brand-700',
    },
    {
      Icon: IconMail,
      label: 'Email',
      value: settings.contact_email,
      hint: 'Dibalas maksimal 1×24 jam kerja',
      href: `mailto:${settings.contact_email}`,
      external: false,
      accent: 'from-sun-400 to-sun-600',
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absoluteUrl('/kontak'),
    mainEntity: {
      '@type': 'Organization',
      name: settings.company_name,
      telephone: settings.contact_phone,
      email: settings.contact_email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Jakarta Selatan',
        addressRegion: 'DKI Jakarta',
        addressCountry: 'ID',
      },
      openingHours: settings.office_hours,
    },
  };

  return (
    <>
      <PageHero
        eyebrow="Hubungi Kami"
        title="Mari bicarakan kebutuhan teknologi Anda"
        description="Konsultasi awal gratis. Ceritakan kendala Anda, kami bantu petakan solusinya terlebih dahulu."
        image="/images/hero/handshake.jpg"
        breadcrumbs={[{ label: 'Kontak' }]}
      />

      {/* Kanal kontak */}
      <section className="border-b border-ink-100 bg-white py-14">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {channels.map(({ Icon, label, value, hint, href, external, accent }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="reveal card card-hover group flex min-w-0 items-start gap-5 p-6"
            >
              <span
                className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} p-3.5 text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="h-full w-full" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-extrabold uppercase tracking-wider text-ink-400">
                  {label}
                </span>
                <span className="mt-1 block break-words text-[15.5px] font-bold text-ink-900">
                  {value}
                </span>
                <span className="mt-1 block text-[12.5px] text-ink-500">{hint}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Formulir & alamat */}
      <section className="section bg-mesh">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <ContactForm whatsappNumber={settings.whatsapp_number} />
          </div>

          <div className="lg:col-span-5">
            <div className="reveal card overflow-hidden">
              <div className="p-7">
                <h2 className="text-2xl">Kantor Kami</h2>

                <dl className="mt-7 space-y-6">
                  <div className="flex gap-4">
                    <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <div>
                      <dt className="text-[12px] font-extrabold uppercase tracking-wider text-ink-400">
                        Alamat
                      </dt>
                      <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-700">
                        {settings.address}
                      </dd>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <IconClock className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                    <div>
                      <dt className="text-[12px] font-extrabold uppercase tracking-wider text-ink-400">
                        Jam Operasional
                      </dt>
                      <dd className="mt-1.5 text-[14.5px] text-ink-700">{settings.office_hours}</dd>
                    </div>
                  </div>
                </dl>

                <a
                  href={whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent mt-8 w-full"
                >
                  <IconWhatsapp className="h-4 w-4" />
                  Chat WhatsApp Sekarang
                </a>
              </div>

              {settings.map_embed ? (
                <div className="aspect-[4/3] w-full border-t border-ink-100">
                  <iframe
                    src={settings.map_embed}
                    title={`Lokasi ${settings.company_name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                    style={{ border: 0 }}
                  />
                </div>
              ) : null}
            </div>

            {/* Legalitas ringkas */}
            <div className="reveal card mt-6 p-7">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                Data Perusahaan
              </h3>
              <dl className="mt-5 space-y-3 text-[13.5px]">
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 font-semibold text-ink-400">Nama</dt>
                  <dd className="flex-1 font-semibold text-ink-800">{settings.company_name}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 font-semibold text-ink-400">NIB</dt>
                  <dd className="flex-1 text-ink-700">{settings.legal_nib}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-20 shrink-0 font-semibold text-ink-400">NPWP</dt>
                  <dd className="flex-1 text-ink-700">{settings.legal_npwp}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
