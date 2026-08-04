'use client';

import { useEffect } from 'react';

/**
 * Mengaktifkan animasi masuk untuk semua elemen ber-class `.reveal`
 * begitu elemen tersebut memasuki layar. Dipasang sekali di layout.
 */
export function RevealProvider() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const activate = (el: Element) => el.classList.add('is-visible');

    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach(activate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          activate(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => observer.observe(el));
    };

    observeAll();

    // Konten yang muncul belakangan (mis. hasil filter) ikut diamati.
    const mutation = new MutationObserver(observeAll);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
