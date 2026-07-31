import Image from 'next/image';
import Link from 'next/link';
import { IconArrowUpRight, IconGithub, IconLock } from '@/components/icons';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const cover = project.cover_image || '/images/hero/analytics.jpg';

  return (
    <article
      className={cn(
        'reveal card card-hover group relative flex flex-col overflow-hidden',
        className,
      )}
    >
      <Link href={`/proyek/${project.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-100">
        <Image
          src={cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

        <span className="badge absolute left-4 top-4 bg-white/95 text-ink-800 backdrop-blur">
          {project.category}
        </span>

        {project.year ? (
          <span className="badge absolute right-4 top-4 bg-ink-950/55 text-white backdrop-blur">
            {project.year}
          </span>
        ) : null}

        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white text-ink-900 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <IconArrowUpRight className="h-[18px] w-[18px]" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {project.client ? (
          <p className="text-[12px] font-bold uppercase tracking-wider text-brand-600">
            {project.client}
          </p>
        ) : null}

        <h3 className="mt-2 text-[19px] font-extrabold leading-snug text-ink-900">
          <Link href={`/proyek/${project.slug}`} className="transition-colors hover:text-brand-700">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 flex-1 text-[14.5px] leading-relaxed text-ink-600">
          {project.summary}
        </p>

        {project.tech.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 3).map((tech) => (
              <span key={tech} className="badge bg-ink-100 text-ink-700">
                {tech}
              </span>
            ))}
            {project.tech.length > 3 ? (
              <span className="badge bg-ink-100 text-ink-500">+{project.tech.length - 3}</span>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
          <Link
            href={`/proyek/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700 transition-colors hover:text-brand-900"
          >
            Lihat detail
            <IconArrowUpRight className="h-4 w-4" />
          </Link>

          {project.source === 'github' ? (
            project.repo_url && !project.is_private ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-500 transition-colors hover:text-ink-900"
                title="Lihat di GitHub"
              >
                <IconGithub className="h-4 w-4" />
                GitHub
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-400"
                title="Kode sumber bersifat privat"
              >
                <IconLock className="h-3.5 w-3.5" />
                Repositori privat
              </span>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}
