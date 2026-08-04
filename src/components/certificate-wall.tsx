'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconClose, IconExternal } from '@/components/icons';
import type { CertificateProof } from '@/lib/types';

/**
 * Dinding bukti sertifikat. Hanya menampilkan baris yang sudah diterbitkan
 * lewat CMS — lihat `getCertificateProofs()` untuk alasannya.
 */
export function CertificateWall({ items }: { items: CertificateProof[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % items.length));
      if (event.key === 'ArrowLeft')
        setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightbox, items.length]);

  if (items.length === 0) return null;

  const current = lightbox !== null ? items[lightbox] : null;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <article key={item.id} className="reveal card card-hover group flex flex-col overflow-hidden">
            {item.image ? (
              <button
                type="button"
                onClick={() => setLightbox(index)}
                aria-label={`Perbesar sertifikat ${item.title}`}
                className="relative block aspect-[4/3] w-full overflow-hidden bg-ink-50"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </button>
            ) : null}

            <div className="flex flex-1 flex-col p-5">
              {item.vendor ? (
                <p className="text-[11.5px] font-extrabold uppercase tracking-wider text-brand-600">
                  {item.vendor}
                </p>
              ) : null}

              <h3 className="mt-2 text-[15px] font-extrabold leading-snug text-ink-900">
                {item.title}
              </h3>

              <dl className="mt-3 flex-1 space-y-1.5 text-[12.5px] text-ink-600">
                {item.holder ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-ink-400">Pemegang</dt>
                    <dd className="min-w-0 flex-1">{item.holder}</dd>
                  </div>
                ) : null}
                {item.issued_on ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-ink-400">Terbit</dt>
                    <dd className="min-w-0 flex-1">{item.issued_on}</dd>
                  </div>
                ) : null}
                {item.credential_id ? (
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 font-semibold text-ink-400">Kode</dt>
                    <dd className="min-w-0 flex-1 break-all font-mono text-[11.5px]">
                      {item.credential_id}
                    </dd>
                  </div>
                ) : null}
              </dl>

              {item.verify_url ? (
                <a
                  href={item.verify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 border-t border-ink-100 pt-3.5 text-[12.5px] font-bold text-brand-700 transition-colors hover:text-brand-900"
                >
                  Verifikasi keaslian
                  <IconExternal className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {current?.image ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <IconClose className="h-5 w-5" />
          </button>

          {items.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() => setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length))}
                aria-label="Sertifikat sebelumnya"
                className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              >
                <IconChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightbox((i) => (i === null ? i : (i + 1) % items.length))}
                aria-label="Sertifikat berikutnya"
                className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              >
                <IconChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <figure className="max-h-full w-full max-w-4xl">
            <div className="relative mx-auto aspect-[4/3] w-full">
              <Image
                src={current.image}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 text-center text-[13.5px] text-white/80">
              <span className="font-bold text-white">{current.title}</span>
              {current.holder ? ` — ${current.holder}` : ''}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
