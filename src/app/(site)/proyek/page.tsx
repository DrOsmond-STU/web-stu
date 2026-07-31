import type { Metadata } from 'next';
import Link from 'next/link';
import { IconArrowRight, IconGithub } from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { ProjectExplorer } from '@/components/project-explorer';
import { getProjects, getSettings } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Proyek & Produk Aplikasi',
    description:
      'Portofolio proyek CV. Semesta Teknologi Utama: sistem informasi untuk kementerian dan perusahaan nasional, serta produk aplikasi yang kami kembangkan sendiri.',
    alternates: { canonical: '/proyek' },
  };
}

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  const githubCount = projects.filter((p) => p.source === 'github').length;

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

          {githubCount > 0 && settings.social_github ? (
            <div className="reveal mt-16 flex flex-col items-center justify-between gap-6 rounded-[32px] border border-ink-100 bg-mesh p-9 sm:flex-row sm:p-11">
              <div className="flex items-center gap-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-900 text-white">
                  <IconGithub className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="text-xl">Repositori pengembangan kami</h2>
                  <p className="mt-1.5 max-w-lg text-[14.5px] leading-relaxed text-ink-600">
                    {githubCount} produk aplikasi kami dikembangkan dan dikelola di GitHub. Sebagian
                    besar bersifat privat karena memuat kode milik klien.
                  </p>
                </div>
              </div>
              <a
                href={settings.social_github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline shrink-0"
              >
                <IconGithub className="h-4 w-4" />
                Kunjungi GitHub
              </a>
            </div>
          ) : null}
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
