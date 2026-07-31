'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconQuote, IconStar } from '@/components/icons';
import type { Testimonial } from '@/lib/types';
import { cn } from '@/lib/utils';

export function TestimonialSlider({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;

  const go = (next: number) => setIndex(((next % total) + total) % total);

  useEffect(() => {
    if (total <= 1 || paused) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % total), 8000);
    return () => window.clearTimeout(timer);
  }, [index, paused, total]);

  if (total === 0) return null;
  const active = items[index];

  const initials = active.name
    .replace(/\[[^\]]*\]\s*/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  return (
    <div
      className="reveal relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-[32px] border border-ink-100 bg-white p-8 shadow-soft sm:p-12">
        <IconQuote className="absolute right-8 top-8 h-16 w-16 text-brand-100" />

        <div key={active.id} className="animate-fade-in relative">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <IconStar
                key={i}
                className={cn('h-[18px] w-[18px]', i < active.rating ? 'text-sun-400' : 'text-ink-200')}
              />
            ))}
          </div>

          <blockquote className="mt-7 text-[19px] font-medium leading-[1.7] text-ink-800 sm:text-[22px]">
            “{active.message}”
          </blockquote>

          <div className="mt-9 flex items-center gap-4">
            {active.avatar ? (
              <Image
                src={active.avatar}
                alt={active.name}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-100"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[17px] font-extrabold text-white">
                {initials || 'ST'}
              </span>
            )}
            <div>
              <p className="text-[16px] font-extrabold text-ink-900">{active.name}</p>
              <p className="text-[13.5px] text-ink-500">
                {[active.position, active.company].filter(Boolean).join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {total > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Testimoni sebelumnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-200 text-ink-700 transition-all hover:border-brand-500 hover:bg-brand-500 hover:text-white"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Testimoni ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === index ? 'w-8 bg-gradient-to-r from-brand-500 to-sun-400' : 'w-2 bg-ink-200 hover:bg-ink-300',
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Testimoni berikutnya"
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink-200 text-ink-700 transition-all hover:border-brand-500 hover:bg-brand-500 hover:text-white"
          >
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
