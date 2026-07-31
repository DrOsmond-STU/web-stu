import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  IconArrowRight,
  IconCalendar,
  IconClock,
  IconTag,
  IconUsers,
  IconWhatsapp,
} from '@/components/icons';
import { PageHero } from '@/components/page-hero';
import { ShareButtons } from '@/components/share-buttons';
import { getPostBySlug, getPosts, getSettings } from '@/lib/content';
import { extractHeadings, readingTime, renderMarkdown, slugifyHeading } from '@/lib/markdown';
import { absoluteUrl, formatDate, truncate, whatsappLink } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Artikel tidak ditemukan' };

  const description = post.meta_description || truncate(post.excerpt, 160);

  return {
    title: post.meta_title || post.title,
    description,
    keywords: post.tags,
    alternates: { canonical: `/berita/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.meta_title || post.title,
      description,
      url: absoluteUrl(`/berita/${post.slug}`),
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author],
      tags: post.tags,
      images: post.cover_image ? [{ url: post.cover_image, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) notFound();

  const related = await getPosts({ limit: 3, excludeSlug: post.slug });
  const headings = extractHeadings(post.content);
  const minutes = readingTime(post.content);

  // Sisipkan id pada setiap heading level 2 agar daftar isi bisa melompat.
  const html = renderMarkdown(post.content).replace(
    /<h2>(.*?)<\/h2>/g,
    (_match, inner: string) =>
      `<h2 id="${slugifyHeading(inner.replace(/<[^>]+>/g, ''))}">${inner}</h2>`,
  );

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    image: post.cover_image ? absoluteUrl(post.cover_image) : undefined,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: post.author, url: absoluteUrl() },
    publisher: {
      '@type': 'Organization',
      name: settings.company_name,
      logo: { '@type': 'ImageObject', url: absoluteUrl(settings.logo) },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/berita/${post.slug}`) },
    keywords: post.tags.join(', '),
    inLanguage: 'id-ID',
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Beranda', item: absoluteUrl() },
      { '@type': 'ListItem', position: 2, name: 'Berita', item: absoluteUrl('/berita') },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(`/berita/${post.slug}`) },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        image={post.cover_image || '/images/hero/city-1.jpg'}
        breadcrumbs={[{ label: 'Berita', href: '/berita' }, { label: truncate(post.title, 48) }]}
      />

      <article className="section bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            {/* Meta artikel */}
            <div className="reveal flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-ink-100 pb-7 text-[13.5px] text-ink-500">
              <span className="flex items-center gap-2">
                <IconUsers className="h-4 w-4 text-brand-500" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-brand-500" />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <IconClock className="h-4 w-4 text-brand-500" />
                {minutes} menit baca
              </span>
            </div>

            {post.cover_image ? (
              <div className="reveal relative mt-9 aspect-[16/9] overflow-hidden rounded-3xl bg-ink-100 shadow-soft">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <p className="reveal mt-9 text-[19px] font-medium leading-relaxed text-ink-700">
              {post.excerpt}
            </p>

            <div className="prose-stu reveal mt-9" dangerouslySetInnerHTML={{ __html: html }} />

            {post.tags.length > 0 ? (
              <div className="reveal mt-12 flex flex-wrap items-center gap-2.5 border-t border-ink-100 pt-8">
                <IconTag className="h-4 w-4 text-ink-400" />
                {post.tags.map((tag) => (
                  <span key={tag} className="badge bg-ink-100 text-ink-700">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="reveal mt-8">
              <ShareButtons url={absoluteUrl(`/berita/${post.slug}`)} title={post.title} />
            </div>

            {/* Ajakan bertindak dalam artikel */}
            <div className="reveal mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-ink-900 p-8 text-white sm:p-10">
              <h2 className="text-2xl text-white">Butuh pendampingan untuk kebutuhan serupa?</h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-brand-100/80">
                Tim {settings.company_name} siap membantu — mulai dari pemetaan kebutuhan hingga
                sistem berjalan dan bersertifikat.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href={whatsappLink(
                    settings.whatsapp_number,
                    `Halo, saya membaca artikel "${post.title}" di website Anda dan ingin berkonsultasi.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-accent"
                >
                  <IconWhatsapp className="h-4 w-4" />
                  Konsultasi via WhatsApp
                </a>
                <Link href="/kontak" className="btn-ghost-light">
                  Kirim Pesan
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="reveal sticky top-28 space-y-6">
              {headings.length > 1 ? (
                <nav className="card p-6" aria-label="Daftar isi">
                  <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                    Daftar Isi
                  </h2>
                  <ol className="mt-5 space-y-2.5 text-[14px]">
                    {headings.map((heading, index) => (
                      <li key={heading.id} className="flex gap-3">
                        <span className="shrink-0 font-mono text-[12px] font-bold text-brand-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <a
                          href={`#${heading.id}`}
                          className="leading-snug text-ink-700 transition-colors hover:text-brand-700"
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              ) : null}

              {related.length > 0 ? (
                <div className="card p-6">
                  <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
                    Artikel Terkait
                  </h2>
                  <ul className="mt-5 space-y-5">
                    {related.map((item) => (
                      <li key={item.id}>
                        <Link href={`/berita/${item.slug}`} className="group flex gap-3.5">
                          <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                            <Image
                              src={item.cover_image || '/images/hero/city-1.jpg'}
                              alt={item.title}
                              fill
                              sizes="80px"
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 text-[13.5px] font-bold leading-snug text-ink-800 transition-colors group-hover:text-brand-700">
                              {item.title}
                            </span>
                            <span className="mt-1.5 block text-[11.5px] text-ink-400">
                              {formatDate(item.published_at || item.created_at)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/berita"
                    className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700 transition-colors hover:text-brand-900"
                  >
                    Semua artikel
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </>
  );
}
