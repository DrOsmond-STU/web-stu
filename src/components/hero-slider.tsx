'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconArrowRight, IconChevronLeft, IconChevronRight, IconPhone } from '@/components/icons';
import { cn } from '@/lib/utils';

export type HeroSlide = {
  image: string;
  eyebrow: string;
  title: string;
  subtitle: string;
};

type Props = {
  slides: HeroSlide[];
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
  phone: string;
};

const DURATION = 7000;

export function HeroSlider({
  slides,
  primaryText,
  primaryLink,
  secondaryText,
  secondaryLink,
  phone,
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startedAt = useRef<number>(0);

  const total = slides.length;
  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  useEffect(() => {
    if (total <= 1 || paused) return;
    startedAt.current = Date.now();
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, paused, total, go]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  // Geser dengan sentuhan pada perangkat mobile.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (event: React.TouchEvent) => {
    touchX.current = event.touches[0].clientX;
  };
  const onTouchEnd = (event: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 55) go(index + (delta < 0 ? 1 : -1));
    touchX.current = null;
  };

  const active = slides[index];

  return (
    <section
      className="relative isolate overflow-hidden bg-ink-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Sorotan utama"
    >
      {/* Lapisan gambar */}
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={`${slide.image}-${i}`}
            className={cn(
              'absolute inset-0 transition-opacity duration-[1100ms] ease-out',
              i === index ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn('object-cover', i === index && 'animate-slow-zoom')}
            />
          </div>
        ))}
      </div>

      {/* Gradasi agar teks terbaca */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/78 to-ink-950/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/45" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      {/* Aksen warna merek */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-brand-500/22 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-sun-500/18 blur-[130px]" />

      <div className="container-page relative flex min-h-[600px] flex-col justify-center py-24 sm:min-h-[660px] lg:min-h-[720px]">
        <div className="max-w-3xl">
          <span key={`e-${index}`} className="eyebrow-light animate-fade-up">
            <span className="h-1.5 w-1.5 rounded-full bg-sun-400" />
            {active.eyebrow}
          </span>

          <h1
            key={`t-${index}`}
            className="animate-fade-up mt-6 text-[34px] leading-[1.1] text-white sm:text-5xl lg:text-[58px]"
            style={{ animationDelay: '90ms' }}
          >
            {active.title}
          </h1>

          <p
            key={`s-${index}`}
            className="animate-fade-up mt-6 max-w-2xl text-[16px] leading-relaxed text-brand-100/85 sm:text-[18px]"
            style={{ animationDelay: '180ms' }}
          >
            {active.subtitle}
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            style={{ animationDelay: '270ms' }}
          >
            <Link href={primaryLink} className="btn-accent !px-7 !py-3.5">
              {primaryText}
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href={secondaryLink} className="btn-ghost-light !px-7 !py-3.5">
              {secondaryText}
            </Link>
            <a
              href={`tel:${(phone || '').replace(/[^0-9+]/g, '')}`}
              className="mt-2 flex items-center gap-3 text-white/85 transition-colors hover:text-white sm:ml-4 sm:mt-0"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur">
                <IconPhone className="h-[18px] w-[18px]" />
              </span>
              <span className="text-left">
                <span className="block text-[11px] uppercase tracking-wider text-white/55">
                  Telepon Kami
                </span>
                <span className="block text-[14px] font-bold">{phone}</span>
              </span>
            </a>
          </div>
        </div>

        {/* Kendali slider */}
        {total > 1 ? (
          <div className="mt-14 flex items-center gap-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Slide sebelumnya"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 backdrop-blur transition-all hover:border-white hover:bg-white hover:text-ink-900"
              >
                <IconChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Slide berikutnya"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/80 backdrop-blur transition-all hover:border-white hover:bg-white hover:text-ink-900"
              >
                <IconChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 items-center gap-2.5">
              {slides.map((slide, i) => (
                <button
                  key={`dot-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Ke slide ${i + 1}`}
                  aria-current={i === index}
                  className="group relative h-1 flex-1 max-w-[86px] overflow-hidden rounded-full bg-white/22"
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-sun-400 transition-[width]',
                      i === index ? 'w-full' : 'w-0 group-hover:w-1/3',
                    )}
                    style={i === index && !paused ? { transitionDuration: `${DURATION}ms`, transitionTimingFunction: 'linear' } : undefined}
                  />
                </button>
              ))}
            </div>

            <span className="hidden text-[13px] font-bold tabular-nums text-white/70 sm:block">
              <span className="text-white">{String(index + 1).padStart(2, '0')}</span>
              <span className="mx-1.5 text-white/35">/</span>
              {String(total).padStart(2, '0')}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
