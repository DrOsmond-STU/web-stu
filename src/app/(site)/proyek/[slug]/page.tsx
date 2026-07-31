import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  IconArrowRight,
  IconCheck,
  IconExternal,
  IconGithub,
  IconLock,
  IconWhatsapp,
} from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { ProjectCard } from '@/components/project-card';
import { ProjectGallery } from '@/components/project-gallery';
import { getProjectBySlug, getProjects, getSettings } from '@/lib/content';
import { renderMarkdown } from '@/lib/markdown';
import { absoluteUrl, whatsappLink } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Proyek tidak ditemukan' };

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyek/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const [project, all, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSettings(),
  ]);

  if (!project) notFound();

  const related = all
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3);
  const fallbackRelated = all.filter((item) => item.slug !== project.slug).slice(0, 3);
  const suggestions = related.length >= 2 ? related : fallbackRelated;

  const images = [project.cover_image, ...project.gallery].filter(
    (image, index, list): image is string => Boolean(image) && list.indexOf(image) === index,
  );

  const facts = [
    { label: 'Klien', value: project.client },
    { label: 'Kategori', value: project.category },
    { label: 'Tahun', value: project.year ? String(project.year) : null },
    { label: 'Teknologi', value: project.tech.join(', ') || null },
  ].filter((fact) => Boolean(fact.value));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/proyek/${project.slug}`),
    image: project.cover_image ? absoluteUrl(project.cover_image) : undefined,
    dateCreated: project.year ? String(project.year) : undefined,
    creator: { '@type': 'Organization', name: settings.company_name, url: absoluteUrl() },
  };

  return (
    <>
      <PageHero
        eyebrow={project.category}
        title={project.title}
        description={project.summary}
        image={project.cover_image || '/images/hero/analytics.jpg'}
        breadcrumbs={[{ label: 'Proyek', href: '/proyek' }, { label: project.title }]}
      />

      <section className="section bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <ProjectGallery images={images} title={project.title} />

            <div
              className="prose-stu reveal mt-12"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(project.description) }}
            />

            {project.features.length > 0 ? (
              <div className="reveal mt-12">
                <h2 className="text-2xl">Fitur Aplikasi</h2>
                <p className="mt-2.5 text-[15px] text-ink-600">
                  Modul dan kemampuan utama yang tersedia di dalam sistem ini.
                </p>
                <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 rounded-2xl border border-ink-100 bg-mesh p-4 transition-colors hover:border-brand-200"
                    >
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
              <div className="card p-7">
                <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                  Ringkasan Proyek
                </h2>
                <dl className="mt-6 space-y-5">
                  {facts.map((fact) => (
                    <div key={fact.label}>
                      <dt className="text-[12px] font-bold uppercase tracking-wider text-brand-600">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-[15px] font-semibold leading-snug text-ink-900">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {project.source === 'github' ? (
                  <div className="mt-6 border-t border-ink-100 pt-6">
                    {project.repo_url && !project.is_private ? (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline w-full !py-2.5 text-[13px]"
                      >
                        <IconGithub className="h-4 w-4" />
                        Lihat di GitHub
                      </a>
                    ) : (
                      <p className="flex items-start gap-2.5 rounded-xl bg-ink-50 p-3.5 text-[12.5px] leading-relaxed text-ink-500">
                        <IconLock className="mt-0.5 h-4 w-4 shrink-0" />
                        Kode sumber bersifat privat karena memuat data dan properti milik klien.
                      </p>
                    )}
                  </div>
                ) : null}

                {project.demo_url ? (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-3 w-full !py-2.5 text-[13px]"
                  >
                    <IconExternal className="h-4 w-4" />
                    Kunjungi Aplikasi
                  </a>
                ) : null}
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-brand-700 to-ink-900 p-7 text-white shadow-lift">
                <h2 className="text-[19px] font-extrabold leading-snug text-white">
                  Ingin sistem serupa untuk organisasi Anda?
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-100/80">
                  Kami dapat menyesuaikan sistem ini dengan proses bisnis dan regulasi yang berlaku
                  di tempat Anda.
                </p>
                <a
                  href={whatsappLink(
                    settings.whatsapp_number,
                    `Halo Semesta Teknologi Utama, saya tertarik dengan proyek "${project.title}". Bisa dijelaskan lebih lanjut?`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent mt-6 w-full"
                >
                  <IconWhatsapp className="h-4 w-4" />
                  Tanya via WhatsApp
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {suggestions.length > 0 ? (
        <section className="section bg-mesh">
          <div className="container-page">
            <div className="reveal flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="eyebrow">Proyek Lainnya</span>
                <h2 className="mt-4 text-3xl">Lihat pekerjaan kami yang lain</h2>
              </div>
              <Link href="/proyek" className="btn-outline shrink-0">
                Semua Proyek
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((item) => (
                <ProjectCard key={item.id} project={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
