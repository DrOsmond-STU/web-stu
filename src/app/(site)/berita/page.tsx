import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { PostExplorer } from '@/components/post-explorer';
import { getPosts } from '@/lib/content';
import { readingTime } from '@/lib/markdown';
import { absoluteUrl } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Berita & Artikel',
    description:
      'Artikel dan berita dari CV. Semesta Teknologi Utama seputar sistem informasi, digitalisasi proses bisnis, tata kelola TI, dan sertifikasi ISO.',
    alternates: { canonical: '/berita', types: { 'application/rss+xml': '/feed.xml' } },
  };
}

export default async function BlogPage() {
  const posts = await getPosts();
  const withReading = posts.map((post) => ({ ...post, reading: readingTime(post.content) }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Berita & Artikel Semesta Teknologi Utama',
    url: absoluteUrl('/berita'),
    blogPost: posts.slice(0, 10).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: absoluteUrl(`/berita/${post.slug}`),
      datePublished: post.published_at || post.created_at,
      description: post.excerpt,
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="Berita & Artikel"
        title="Wawasan seputar teknologi informasi & tata kelola sistem"
        description="Panduan praktis yang kami tulis dari pengalaman langsung mendampingi instansi pemerintah dan perusahaan."
        image="/images/hero/analytics.jpg"
        breadcrumbs={[{ label: 'Berita' }]}
      />

      <section className="section bg-white">
        <div className="container-page">
          <PostExplorer posts={withReading} />
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
