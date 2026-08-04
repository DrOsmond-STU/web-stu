import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { ProjectExplorer } from '@/components/project-explorer';
import { getProjects } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Proyek & Produk Aplikasi',
    description:
      'Portofolio proyek CV. Semesta Teknologi Utama: sistem informasi untuk kementerian dan perusahaan nasional, serta produk aplikasi yang kami kembangkan sendiri.',
    alternates: { canonical: '/proyek' },
  };
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHero
        eyebrow="Portofolio"
        title="Proyek & produk aplikasi kami"
        description={`${projects.length} sistem yang kami rancang, bangun, dan pelihara untuk instansi pemerintah, BUMN, dan perusahaan swasta di Indonesia.`}
        image="/images/apps/wsbp-dashboard.png"
        breadcrumbs={[{ label: 'Proyek' }]}
      />

      <section className="section bg-white">
        <div className="container-page">
          <ProjectExplorer projects={projects} />

        </div>
      </section>

      <section className="bg-deep py-20">
        <div className="container-page reveal text-center">
          <h2 className="mx-auto max-w-2xl text-3xl leading-tight text-white sm:text-[38px]">
            Punya kebutuhan sistem yang belum ada solusinya?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16.5px] leading-relaxed text-brand-100/80">
            Kami terbiasa membangun aplikasi untuk proses bisnis yang tidak bisa dilayani produk
            pasaran.
          </p>
          <Link href="/kontak" className="btn-accent mt-9 !px-8 !py-4">
            Diskusikan Kebutuhan Anda
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
