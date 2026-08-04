'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { IconArrowUpRight, IconCalendar, IconClock, IconSearch } from '@/components/icons';
import type { Post } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

export function PostExplorer({ posts }: { posts: (Post & { reading: number })[] }) {
  const categories = useMemo(
    () => ['Semua', ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );

  const [category, setCategory] = useState('Semua');
  const [keyword, setKeyword] = useState('');

  const visible = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== 'Semua' && post.category !== category) return false;
      if (!q) return true;
      return [post.title, post.excerpt, ...post.tags].join(' ').toLowerCase().includes(q);
    });
  }, [posts, category, keyword]);

  const [featured, ...rest] = visible;

  return (
    <>
      <div className="reveal mb-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2.5">
          {categories.map((item) => (
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
            </button>
          ))}
        </div>

        <div className="relative lg:w-72">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari artikel…"
            aria-label="Cari artikel"
            className="field !rounded-full !py-3 pl-11"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink-200 py-20 text-center">
          <p className="text-[17px] font-bold text-ink-800">Artikel tidak ditemukan</p>
          <p className="mt-2 text-[14.5px] text-ink-500">Coba kata kunci lain atau pilih kategori berbeda.</p>
        </div>
      ) : null}

      {/* Artikel utama */}
      {featured ? (
        <article className="reveal card card-hover group grid overflow-hidden lg:grid-cols-2">
          <Link
            href={`/berita/${featured.slug}`}
            className="relative aspect-[16/10] overflow-hidden bg-ink-100 lg:aspect-auto lg:min-h-[380px]"
          >
            <Image
              src={featured.cover_image || '/images/hero/city-1.jpg'}
              alt={featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <span className="badge absolute left-5 top-5 bg-white/95 text-ink-800 backdrop-blur">
              Artikel Pilihan
            </span>
          </Link>

          <div className="flex flex-col justify-center p-8 sm:p-11">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] text-ink-500">
              <span className="badge bg-brand-50 text-brand-700">{featured.category}</span>
              <span className="flex items-center gap-1.5">
                <IconCalendar className="h-3.5 w-3.5" />
                {formatDate(featured.published_at || featured.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <IconClock className="h-3.5 w-3.5" />
                {featured.reading} menit baca
              </span>
            </div>

            <h2 className="mt-5 text-[26px] leading-tight sm:text-[32px]">
              <Link href={`/berita/${featured.slug}`} className="transition-colors hover:text-brand-700">
                {featured.title}
              </Link>
            </h2>

            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-600">{featured.excerpt}</p>

            <Link
              href={`/berita/${featured.slug}`}
              className="mt-8 inline-flex w-fit items-center gap-2 text-[14px] font-bold text-brand-700 transition-colors hover:text-brand-900"
            >
              Baca artikel lengkap
              <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </article>
      ) : null}

      {/* Sisa artikel */}
      {rest.length > 0 ? (
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <article key={post.id} className="reveal card card-hover group overflow-hidden">
              <Link
                href={`/berita/${post.slug}`}
                className="relative block aspect-[16/10] overflow-hidden bg-ink-100"
              >
                <Image
                  src={post.cover_image || '/images/hero/city-1.jpg'}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <span className="badge absolute left-4 top-4 bg-white/95 text-ink-800 backdrop-blur">
                  {post.category}
                </span>
              </Link>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-4 text-[12.5px] text-ink-500">
                  <span className="flex items-center gap-1.5">
                    <IconCalendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock className="h-3.5 w-3.5" />
                    {post.reading} menit
                  </span>
                </div>

                <h3 className="mt-3 text-[18px] font-extrabold leading-snug">
                  <Link href={`/berita/${post.slug}`} className="transition-colors hover:text-brand-700">
                    {post.title}
                  </Link>
                </h3>

                <p className="mt-3 line-clamp-3 flex-1 text-[14.5px] leading-relaxed text-ink-600">
                  {post.excerpt}
                </p>

                <Link
                  href={`/berita/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700 transition-colors hover:text-brand-900"
                >
                  Baca selengkapnya
                  <IconArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </>
  );
}
