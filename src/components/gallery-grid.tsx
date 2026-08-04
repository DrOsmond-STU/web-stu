'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconClose } from '@/components/icons';
import type { GalleryItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = ['Semua', ...Array.from(new Set(items.map((item) => item.category)))];
  const [filter, setFilter] = useState('Semua');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible = filter === 'Semua' ? items : items.filter((item) => item.category === filter);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % visible.length));
      if (event.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? i : (i - 1 + visible.length) % visible.length));
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, visible.length]);

  const current = lightbox !== null ? visible[lightbox] : null;

  return (
    <>
      {categories.length > 2 ? (
        <div className="reveal mb-10 flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setFilter(category);
                setLightbox(null);
              }}
              className={cn(
                'rounded-full px-5 py-2.5 text-[13.5px] font-bold transition-all',
                filter === category
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                  : 'border-2 border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700',
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(i)}
            className="reveal group relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100 text-left shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/88 via-ink-950/25 to-transparent opacity-85 transition-opacity group-hover:opacity-95" />

            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="badge mb-2.5 bg-white/22 text-white backdrop-blur">
                {item.category}
              </span>
              <h3 className="text-[15px] font-extrabold leading-snug text-white">{item.title}</h3>
              <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-snug text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Tampilan besar */}
      {current ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/94 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink-900"
          >
            <IconClose className="h-6 w-6" />
          </button>

          {visible.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((i) => (i === null ? i : (i - 1 + visible.length) % visible.length));
                }}
                aria-label="Sebelumnya"
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink-900 sm:left-8"
              >
                <IconChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setLightbox((i) => (i === null ? i : (i + 1) % visible.length));
                }}
                aria-label="Berikutnya"
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink-900 sm:right-8"
              >
                <IconChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <figure
            className="max-h-[88vh] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink-900">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-5 text-center">
              <p className="text-[17px] font-bold text-white">{current.title}</p>
              <p className="mx-auto mt-1.5 max-w-2xl text-[14px] text-white/65">{current.caption}</p>
              <p className="mt-3 text-[12.5px] text-white/40">
                {(lightbox ?? 0) + 1} dari {visible.length}
              </p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
