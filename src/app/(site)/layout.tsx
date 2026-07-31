import Script from 'next/script';
import { RevealProvider } from '@/components/reveal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WhatsAppWidget } from '@/components/whatsapp-widget';
import { getServices, getSettings } from '@/lib/content';
import { absoluteUrl, linesToArray } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/** Kerangka halaman publik: kepala halaman, kaki halaman, dan widget WhatsApp. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${absoluteUrl()}#organization`,
    name: settings.company_name,
    alternateName: settings.site_name,
    url: absoluteUrl(),
    logo: absoluteUrl(settings.logo),
    image: absoluteUrl(settings.seo_og_image),
    description: settings.seo_description,
    foundingDate: settings.founded_year,
    email: settings.contact_email,
    telephone: settings.contact_phone,
    taxID: settings.legal_npwp,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.address,
      addressLocality: 'Jakarta Selatan',
      addressRegion: 'DKI Jakarta',
      addressCountry: 'ID',
    },
    sameAs: [
      settings.social_linkedin,
      settings.social_instagram,
      settings.social_facebook,
      settings.social_youtube,
      settings.social_github,
    ].filter(Boolean),
    makesOffer: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: service.title, description: service.summary },
    })),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${absoluteUrl()}#website`,
    url: absoluteUrl(),
    name: settings.site_name,
    publisher: { '@id': `${absoluteUrl()}#organization` },
    inLanguage: 'id-ID',
  };

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-white"
      >
        Lewati ke konten utama
      </a>

      <SiteHeader
        logo={settings.logo}
        companyName={settings.company_name}
        phone={settings.contact_phone}
        whatsappNumber={settings.whatsapp_number}
        whatsappMessage={settings.whatsapp_default_message}
      />

      <main id="konten-utama">{children}</main>

      <SiteFooter settings={settings} services={services} />

      <WhatsAppWidget
        number={settings.whatsapp_number}
        greeting={settings.whatsapp_greeting}
        defaultMessage={settings.whatsapp_default_message}
        quickReplies={linesToArray(settings.whatsapp_quick_replies)}
        agentName={settings.whatsapp_agent_name}
        agentRole={settings.whatsapp_agent_role}
      />

      <RevealProvider />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {settings.seo_ga_id ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.seo_ga_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${settings.seo_ga_id}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
