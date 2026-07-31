'use client';

import { useEffect, useRef, useState } from 'react';

export type Stat = { value: string; label: string; hint?: string };

/**
 * Angka statistik yang menghitung naik saat pertama kali terlihat.
 * Awalan/akhiran non-angka (mis. "25+") tetap dipertahankan.
 */
export function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(stat.value);

  useEffect(() => {
    const match = /^(\D*)(\d+)(\D*)$/.exec(stat.value.trim());
    const node = ref.current;
    if (!match || !node) return;

    const [, prefix, digits, suffix] = match;
    const target = Number(digits);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setDisplay(`${prefix}0${suffix}`);

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const duration = 1500;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <div ref={ref} className="reveal text-center sm:text-left">
      <p className="text-gradient text-[42px] font-extrabold leading-none tabular-nums sm:text-5xl">
        {display}
      </p>
      <p className="mt-3 text-[15px] font-bold text-ink-900">{stat.label}</p>
      {stat.hint ? <p className="mt-1 text-[13px] text-ink-500">{stat.hint}</p> : null}
    </div>
  );
}
