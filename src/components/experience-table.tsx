'use client';

import { useMemo, useState } from 'react';
import { IconSearch } from '@/components/icons';
import type { Experience } from '@/lib/types';
import { cn, formatRupiah } from '@/lib/utils';

export function ExperienceTable({ items }: { items: Experience[] }) {
  const years = useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.year).filter(Boolean) as number[])).sort(
        (a, b) => b - a,
      ),
    [items],
  );

  const [year, setYear] = useState<number | 'semua'>('semua');
  const [keyword, setKeyword] = useState('');

  const visible = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return items.filter((item) => {
      if (year !== 'semua' && item.year !== year) return false;
      if (!q) return true;
      return [item.title, item.client, item.field, item.location, item.contract_no]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [items, year, keyword]);

  return (
    <div className="reveal">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setYear('semua')}
            className={cn(
              'rounded-full px-4 py-2 text-[13px] font-bold transition-all',
              year === 'semua'
                ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                : 'border-2 border-ink-200 bg-white text-ink-700 hover:border-brand-400',
            )}
          >
            Semua Tahun
          </button>
          {years.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setYear(item)}
              className={cn(
                'rounded-full px-4 py-2 text-[13px] font-bold transition-all',
                year === item
                  ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                  : 'border-2 border-ink-200 bg-white text-ink-700 hover:border-brand-400',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative lg:w-80">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari pekerjaan, klien, atau nomor kontrak…"
            aria-label="Cari pengalaman pekerjaan"
            className="field !rounded-full !py-3 pl-11"
          />
        </div>
      </div>

      {/* Tampilan tabel (layar lebar) */}
      <div className="hidden overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-[13.5px]">
            <thead>
              <tr className="bg-ink-900 text-white">
                <th className="w-14 px-5 py-4 font-bold">No</th>
                <th className="px-5 py-4 font-bold">Nama Pekerjaan</th>
                <th className="px-5 py-4 font-bold">Bidang</th>
                <th className="px-5 py-4 font-bold">Pemberi Tugas</th>
                <th className="px-5 py-4 font-bold">Kontrak</th>
                <th className="px-5 py-4 text-right font-bold">Nilai</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-ink-100 transition-colors last:border-0 hover:bg-brand-50/50"
                >
                  <td className="px-5 py-4 font-bold tabular-nums text-ink-400">{index + 1}</td>
                  <td className="px-5 py-4">
                    <p className="font-bold leading-snug text-ink-900">{item.title}</p>
                    <p className="mt-1 text-[12px] text-ink-500">{item.location}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-600">{item.field}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold leading-snug text-ink-800">{item.client}</p>
                    <p className="mt-1 text-[12px] text-ink-500">{item.client_address}</p>
                  </td>
                  <td className="px-5 py-4">
                    {item.contract_no ? (
                      <p className="font-mono text-[12px] leading-snug text-ink-600">
                        {item.contract_no}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[12px] font-semibold text-brand-600">
                      {item.contract_date}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-right font-bold tabular-nums text-ink-900">
                    {formatRupiah(item.contract_value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan kartu (layar kecil) */}
      <div className="space-y-4 lg:hidden">
        {visible.map((item, index) => (
          <article key={item.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="badge bg-brand-50 text-brand-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.year ? <span className="badge bg-ink-100 text-ink-600">{item.year}</span> : null}
            </div>

            <h3 className="mt-3.5 text-[15.5px] font-extrabold leading-snug text-ink-900">
              {item.title}
            </h3>

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-ink-400">Pemberi Tugas</dt>
                <dd className="flex-1 text-ink-700">{item.client}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-ink-400">Bidang</dt>
                <dd className="flex-1 text-ink-700">{item.field}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-ink-400">Lokasi</dt>
                <dd className="flex-1 text-ink-700">{item.location}</dd>
              </div>
              {item.contract_no ? (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-ink-400">No. SPK</dt>
                  <dd className="flex-1 break-all font-mono text-[12px] text-ink-600">
                    {item.contract_no}
                  </dd>
                </div>
              ) : null}
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-ink-400">Tanggal</dt>
                <dd className="flex-1 text-ink-700">{item.contract_date}</dd>
              </div>
            </dl>

            <p className="mt-4 border-t border-ink-100 pt-4 text-right text-[16px] font-extrabold text-brand-700">
              {formatRupiah(item.contract_value)}
            </p>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink-200 py-16 text-center">
          <p className="text-[16px] font-bold text-ink-800">Tidak ada data yang cocok</p>
          <p className="mt-2 text-[14px] text-ink-500">Coba ubah kata kunci atau pilih tahun lain.</p>
        </div>
      ) : (
        <p className="mt-6 text-center text-[13px] text-ink-500">
          Menampilkan {visible.length} dari {items.length} pekerjaan
        </p>
      )}
    </div>
  );
}
