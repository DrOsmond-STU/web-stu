import type { MetadataRoute } from 'next';
import { getPosts, getProjects, getServices } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects, services] = await Promise.all([getPosts(), getProjects(), getServices()]);
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: absoluteUrl('/tentang-kami'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/layanan'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/sertifikasi'), lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/proyek'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/pengalaman'), lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/galeri'), lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/berita'), lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: absoluteUrl('/kontak'), lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: absoluteUrl('/kebijakan-privasi'), lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: absoluteUrl('/peta-situs'), lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...services.map((service) => ({
      url: absoluteUrl(`/layanan/${service.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(`/proyek/${project.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/berita/${post.slug}`),
      lastModified: new Date(post.updated_at || post.published_at || post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })),
  ];
}
