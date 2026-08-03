'use client';

import { useMemo, useState } from 'react';
import { IconSearch } from '@/components/icons';
import type { Certification } from '@/lib/types';
import { cn, formatRupiah } from '@/lib/utils';

const SEMUA = 'Semua';

export function CertificationCatalog({
  items,
  showFee,
}: {
  items: Certification[];
  showFee: boolean;
}) {
  const vendors = useMemo(
    () => [SEMUA, ...Array.from(new Set(items.map((i) => i.vendor).filter(Boolean))).sort()],
    [items],
  );
  const fields = useMemo(
    () => [SEMUA, ...Array.from(new Set(items.map((i) => i.field).filter(Boolean))).sort()],
    [items],
  );

  const [vendor, setVendor] = useState(SEMUA);
  const [field, setField] = useState(SEMUA);
  const [keyword, setKeyword] = useState('');

  const visible = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return items.filter((item) => {
      if (vendor !== SEMUA && item.vendor !== vendor) return false;
      if (field !== SEMUA && item.field !== field) return false;
      if (!q) return true;
      return [item.name, item.vendor, item.field, item.also_for, item.summary]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [items, vendor, field, keyword]);

  return (
    <div className="reveal">
      {/* Penyaring */}
      <div className="mb-7 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
        <div className="relative">
          <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Cari sertifikat, vendor, atau bidang…"
            aria-label="Cari skema sertifikasi"
            className="field !rounded-full !py-3 pl-11"
          />
        </div>

        <label className="sr-only" htmlFor="saring-vendor">
          Saring berdasarkan penyelenggara
        </label>
        <select
          id="saring-vendor"
          value={vendor}
          onChange={(event) => setVendor(event.target.value)}
          className="field !rounded-full !py-3 lg:w-60"
        >
          {vendors.map((v) => (
            <option key={v} value={v}>
              {v === SEMUA ? 'Semua penyelenggara' : v}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="saring-bidang">
          Saring berdasarkan bidang
        </label>
        <select
          id="saring-bidang"
          value={field}
          onChange={(event) => setField(event.target.value)}
          className="field !rounded-full !py-3 lg:w-64"
        >
          {fields.map((f) => (
            <option key={f} value={f}>
              {f === SEMUA ? 'Semua bidang' : f}
            </option>
          ))}
        </select>
      </div>

      {/* Tampilan tabel (layar lebar) */}
      <div className="hidden overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[13.5px]">
            <thead>
              <tr className="bg-ink-900 text-white">
                <th className="w-14 px-5 py-4 font-bold">No</th>
                <th className="px-5 py-4 font-bold">Nama Sertifikat</th>
                <th className="px-5 py-4 font-bold">Penyelenggara</th>
                <th className="px-5 py-4 font-bold">Bidang</th>
                {showFee ? <th className="px-5 py-4 text-right font-bold">Biaya Ujian</th> : null}
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
                    <p className="font-bold leading-snug text-ink-900">{item.name}</p>
                    {item.summary ? (
                      <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{item.summary}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <span className="badge bg-brand-50 text-brand-700">{item.vendor}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold leading-snug text-ink-800">{item.field}</p>
                    {item.also_for ? (
                      <p className="mt-1 text-[12px] leading-snug text-ink-500">{item.also_for}</p>
                    ) : null}
                  </td>
                  {showFee ? (
                    <td className="whitespace-nowrap px-5 py-4 text-right font-bold tabular-nums text-ink-900">
                      {item.exam_fee ? formatRupiah(item.exam_fee) : '—'}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan kartu (layar kecil) */}
      <div className="space-y-4 lg:hidden">
        {visible.map((item) => (
          <article key={item.id} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <span className="badge bg-brand-50 text-brand-700">{item.vendor}</span>
              {showFee && item.exam_fee ? (
                <span className="badge bg-ink-100 tabular-nums text-ink-700">
                  {formatRupiah(item.exam_fee)}
                </span>
              ) : null}
            </div>

            <h3 className="mt-3.5 text-[15.5px] font-extrabold leading-snug text-ink-900">
              {item.name}
            </h3>
            {item.summary ? (
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">{item.summary}</p>
            ) : null}

            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex gap-2">
                <dt className="w-24 shrink-0 font-semibold text-ink-400">Bidang</dt>
                <dd className="min-w-0 flex-1 text-ink-700">{item.field}</dd>
              </div>
              {item.also_for ? (
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 font-semibold text-ink-400">Juga untuk</dt>
                  <dd className="min-w-0 flex-1 text-ink-700">{item.also_for}</dd>
                </div>
              ) : null}
            </dl>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-ink-200 py-16 text-center">
          <p className="text-[16px] font-bold text-ink-800">Tidak ada sertifikat yang cocok</p>
          <p className="mt-2 text-[14px] text-ink-500">Coba ubah kata kunci atau pilih penyaring lain.</p>
        </div>
      ) : (
        <p className="mt-6 text-center text-[13px] text-ink-500">
          Menampilkan {visible.length} dari {items.length} skema sertifikasi
        </p>
      )}
    </div>
  );
}
