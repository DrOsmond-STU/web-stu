'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconClose } from '@/components/icons';
import { cn } from '@/lib/utils';

/** Galeri tangkapan layar aplikasi dengan gambar utama + thumbnail. */
export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoom(false);
      if (event.key === 'ArrowRight') setActive((i) => (i + 1) % images.length);
      if (event.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [zoom, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="reveal">
        <button
          type="button"
          onClick={() => setZoom(true)}
          className="group relative block aspect-[16/10] w-full overflow-hidden rounded-3xl bg-ink-100 shadow-lift"
          aria-label="Perbesar tangkapan layar"
        >
          <Image
            src={images[active]}
            alt={`${title} — tangkapan layar ${active + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="absolute bottom-4 right-4 rounded-full bg-ink-950/70 px-4 py-2 text-[12px] font-bold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            Klik untuk memperbesar
          </span>
        </button>

        {images.length > 1 ? (
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Tangkapan layar ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  'relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-ink-100 transition-all sm:w-32',
                  index === active
                    ? 'border-brand-500 opacity-100 ring-2 ring-brand-200'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover object-top"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {zoom ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm"
          onClick={() => setZoom(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setZoom(false)}
            aria-label="Tutup"
            className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink-900"
          >
            <IconClose className="h-6 w-6" />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setActive((i) => (i - 1 + images.length) % images.length);
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
                  setActive((i) => (i + 1) % images.length);
                }}
                aria-label="Berikutnya"
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-white hover:text-ink-900 sm:right-8"
              >
                <IconChevronRight className="h-6 w-6" />
              </button>
            </>
          ) : null}

          <figure className="w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={images[active]}
                alt={`${title} — tangkapan layar ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-[13px] text-white/55">
              {title} · {active + 1} dari {images.length}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
