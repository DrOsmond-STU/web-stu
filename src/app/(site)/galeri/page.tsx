import type { Metadata } from 'next';
import Link from 'next/link';
import { GalleryGrid } from '@/components/gallery-grid';
import { IconArrowRight } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { getGallery } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Galeri Kegiatan',
    description:
      'Dokumentasi kegiatan CV. Semesta Teknologi Utama: pelatihan COBIT, ITIL, CDCP, Lead Auditor, pendampingan audit, serta implementasi dan sertifikasi ISO di berbagai instansi.',
    alternates: { canonical: '/galeri' },
  };
}

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <>
      <PageHero
        eyebrow="Dokumentasi"
        title="Galeri kegiatan kami"
        description="Rekam jejak pelatihan, pendampingan audit, dan implementasi sistem manajemen bersama klien di berbagai instansi."
        image="/images/docs/doc-05.jpg"
        breadcrumbs={[{ label: 'Galeri' }]}
      />

      <section className="section bg-white">
        <div className="container-page">
          <GalleryGrid items={gallery} />
        </div>
      </section>

      <section className="border-t border-ink-100 bg-mesh py-16">
        <div className="container-page reveal flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl">Ingin tim Anda mendapat pendampingan serupa?</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-600">
              Kami menyediakan pelatihan, pendampingan implementasi, hingga persiapan audit
              sertifikasi ISO.
            </p>
          </div>
          <Link href="/kontak" className="btn-primary shrink-0">
            Hubungi Kami
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
