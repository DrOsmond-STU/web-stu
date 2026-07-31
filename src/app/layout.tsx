import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSettings } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

/**
 * Layout paling luar: hanya menyiapkan dokumen HTML dan metadata dasar.
 *
 * Kepala/kaki halaman publik berada di `(site)/layout.tsx`, sedangkan panel CMS
 * memakai tata letaknya sendiri di `admin/(panel)/layout.tsx` — sehingga menu
 * website tidak ikut tampil di dalam panel.
 */
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_title || settings.site_name;
  const description = settings.seo_description;

  return {
    metadataBase: new URL(absoluteUrl()),
    title: {
      default: title,
      template: `%s | ${settings.site_name}`,
    },
    description,
    keywords: settings.seo_keywords?.split(',').map((k) => k.trim()).filter(Boolean),
    applicationName: settings.site_name,
    authors: [{ name: settings.company_name }],
    creator: settings.company_name,
    publisher: settings.company_name,
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      siteName: settings.site_name,
      title,
      description,
      url: absoluteUrl(),
      images: [{ url: settings.seo_og_image, width: 1200, height: 630, alt: settings.company_name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [settings.seo_og_image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    verification: {
      google: settings.seo_google_verification || undefined,
      other: settings.seo_bing_verification
        ? { 'msvalidate.01': settings.seo_bing_verification }
        : undefined,
    },
    icons: {
      icon: '/icon.png',
      shortcut: '/favicon.ico',
      apple: '/apple-icon.png',
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0b2740',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
