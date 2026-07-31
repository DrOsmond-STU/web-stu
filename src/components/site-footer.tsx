import Image from 'next/image';
import Link from 'next/link';
import {
  IconArrowRight,
  IconClock,
  IconFacebook,
  IconGithub,
  IconInstagram,
  IconLinkedin,
  IconMail,
  IconMapPin,
  IconPhone,
  IconYoutube,
} from '@/components/icons';
import type { Service } from '@/lib/types';
import type { SettingsMap } from '@/lib/types';

const SOCIALS = [
  { key: 'social_linkedin', label: 'LinkedIn', Icon: IconLinkedin },
  { key: 'social_instagram', label: 'Instagram', Icon: IconInstagram },
  { key: 'social_facebook', label: 'Facebook', Icon: IconFacebook },
  { key: 'social_youtube', label: 'YouTube', Icon: IconYoutube },
  { key: 'social_github', label: 'GitHub', Icon: IconGithub },
] as const;

const QUICK_LINKS = [
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Proyek & Produk', href: '/proyek' },
  { label: 'Pengalaman Pekerjaan', href: '/pengalaman' },
  { label: 'Galeri Kegiatan', href: '/galeri' },
  { label: 'Berita & Artikel', href: '/berita' },
];

export function SiteFooter({ settings, services }: { settings: SettingsMap; services: Service[] }) {
  const year = new Date().getFullYear();
  const socials = SOCIALS.filter((s) => (settings[s.key] || '').trim().length > 0);

  return (
    <footer className="bg-deep relative overflow-hidden text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />

      <div className="container-page relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Identitas */}
          <div className="lg:col-span-4">
            <Image
              src={settings.logo || '/images/brand/logo-horizontal.png'}
              alt={settings.company_name}
              width={280}
              height={51}
              className="h-11 w-auto brightness-0 invert"
            />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-brand-100/75">
              {settings.tagline}. Kami merancang, membangun, dan memelihara sistem informasi untuk
              instansi pemerintah dan perusahaan di Indonesia.
            </p>

            <dl className="mt-7 space-y-2 text-[13px] text-brand-100/70">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-white/90">NIB</dt>
                <dd>{settings.legal_nib}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-white/90">NPWP</dt>
                <dd>{settings.legal_npwp}</dd>
              </div>
            </dl>

            {socials.length > 0 ? (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {socials.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/8 text-white/85 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-500 hover:text-white"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-2">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Perusahaan
            </h3>
            <ul className="mt-5 space-y-3 text-[14.5px]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-brand-100/75 transition-colors hover:text-sun-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Layanan Kami
            </h3>
            <ul className="mt-5 space-y-3 text-[14.5px]">
              {services.slice(0, 5).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="text-brand-100/75 transition-colors hover:text-sun-400"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h3 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-white">
              Hubungi Kami
            </h3>
            <ul className="mt-5 space-y-4 text-[14.5px] text-brand-100/75">
              <li className="flex gap-3">
                <IconMapPin className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-400" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex gap-3">
                <IconPhone className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-400" />
                <a
                  href={`tel:${(settings.contact_phone || '').replace(/[^0-9+]/g, '')}`}
                  className="transition-colors hover:text-sun-400"
                >
                  {settings.contact_phone}
                </a>
              </li>
              <li className="flex gap-3">
                <IconMail className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-400" />
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="break-all transition-colors hover:text-sun-400"
                >
                  {settings.contact_email}
                </a>
              </li>
              <li className="flex gap-3">
                <IconClock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-brand-400" />
                <span>{settings.office_hours}</span>
              </li>
            </ul>

            <Link href="/kontak" className="btn-accent mt-6 !px-5 !py-2.5 text-[13px]">
              Ajukan Penawaran
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="divider-gradient rounded-full opacity-70" />

        <div className="flex flex-col gap-3 py-6 text-[13px] text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.company_name}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/kebijakan-privasi" className="transition-colors hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link href="/peta-situs" className="transition-colors hover:text-white">
              Peta Situs
            </Link>
            <Link href="/admin" className="transition-colors hover:text-white">
              Masuk CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
