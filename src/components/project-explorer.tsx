'use client';

import { useMemo, useState } from 'react';
import { IconSearch } from '@/components/icons';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const [category, setCategory] = useState('Semua');
  const [keyword, setKeyword] = useState('');

  const visible = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return projects.filter((project) => {
      if (category !== 'Semua' && project.category !== category) return false;
      if (!q) return true;
      return [project.title, project.summary, project.client ?? '', ...project.tech]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [projects, category, keyword]);

  return (
    <>
      <div className="reveal mb-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((item) => {
            const count =
              item === 'Semua'
                ? projects.length
                : projects.filter((p) => p.category === item).length;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-[13.5px] font-bold transition-all',
                  category === item
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                    : 'border-2 border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700',
                )}
              >
                {item}
                <span className={cn('ml-2 text-[11.5px]', category === item ? 'text-white/70' : 'text-ink-400')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-72">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari proyek atau klien…"
            aria-label="Cari proyek"
            className="field !rounded-full !py-3 pl-11"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-ink-200 py-20 text-center">
          <p className="text-[17px] font-bold text-ink-800">Tidak ada proyek yang cocok</p>
          <p className="mt-2 text-[14.5px] text-ink-500">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
          <button
            type="button"
            onClick={() => {
              setKeyword('');
              setCategory('Semua');
            }}
            className="btn-outline mt-6"
          >
            Tampilkan semua proyek
          </button>
        </div>
      )}
    </>
  );
}
