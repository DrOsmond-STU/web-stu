import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GithubSyncButton } from '@/components/admin/github-sync';
import { IconEdit, IconPlus, IconSearch } from '@/components/icons';
import { toggleResourceAction } from '@/lib/admin/actions';
import { getResource } from '@/lib/admin/resources';
import { safeQuery } from '@/lib/db';
import { formatDate, formatRupiah, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ q?: string; status?: string }>;
};

export default async function ResourceListPage({ params, searchParams }: Props) {
  const { resource: key } = await params;
  const { q = '', status } = await searchParams;

  const resource = getResource(key);
  if (!resource) notFound();

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (q.trim() && resource.searchable.length > 0) {
    values.push(`%${q.trim()}%`);
    conditions.push(
      `(${resource.searchable.map((column) => `${column} ILIKE $1`).join(' OR ')})`,
    );
  }

  const rows = await safeQuery<Record<string, unknown>>(
    `SELECT * FROM ${resource.table}${
      conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''
    } ORDER BY ${resource.orderBy} LIMIT 300`,
    values,
  );

  return (
    <>
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">Konten</p>
          <h1 className="mt-2 text-3xl">{resource.label}</h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-500">
            {resource.description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-start gap-3">
          {resource.key === 'proyek' ? <GithubSyncButton /> : null}
          <Link href={`/admin/${resource.key}/baru`} className="btn-primary !py-3">
            <IconPlus className="h-4 w-4" />
            Tambah {resource.labelSingular}
          </Link>
        </div>
      </header>

      {status ? (
        <p className="mb-5 rounded-2xl bg-green-50 px-5 py-3.5 text-[13.5px] font-semibold text-green-700">
          {status === 'dihapus' ? 'Data berhasil dihapus.' : 'Data berhasil disimpan.'}
        </p>
      ) : null}

      {resource.notice ? (
        <p className="mb-5 rounded-2xl border border-sun-200 bg-sun-50 px-5 py-4 text-[13.5px] leading-relaxed text-sun-900">
          {resource.notice}
        </p>
      ) : null}

      {/* Pencarian */}
      {resource.searchable.length > 0 ? (
        <form method="get" className="mb-5">
          <div className="relative max-w-md">
            <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder={`Cari ${resource.label.toLowerCase()}…`}
              className="field !rounded-full !py-3 pl-11"
            />
          </div>
        </form>
      ) : null}

      {/* Daftar */}
      <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
        {rows.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <p className="text-[16px] font-bold text-ink-800">
              {q ? 'Tidak ada data yang cocok' : `Belum ada ${resource.labelSingular.toLowerCase()}`}
            </p>
            <p className="mt-2 text-[14px] text-ink-500">
              {q
                ? 'Coba kata kunci lain.'
                : `Klik tombol “Tambah ${resource.labelSingular}” untuk membuat yang pertama.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  {resource.columns.map((column) => (
                    <th
                      key={column.name}
                      className={`px-5 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-ink-500 ${
                        column.width ?? ''
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="w-24 px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={String(row.id)} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/60">
                    {resource.columns.map((column) => (
                      <td key={column.name} className="px-5 py-3.5 align-middle">
                        <Cell
                          column={column}
                          value={row[column.name]}
                          resourceKey={resource.key}
                          id={Number(row.id)}
                          isToggle={column.name === resource.toggleField}
                        />
                      </td>
                    ))}
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/${resource.key}/${row.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3 py-1.5 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                      >
                        <IconEdit className="h-3.5 w-3.5" />
                        Ubah
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rows.length > 0 ? (
        <p className="mt-4 text-[13px] text-ink-500">
          Menampilkan {rows.length} {resource.labelSingular.toLowerCase()}.
        </p>
      ) : null}
    </>
  );
}

function Cell({
  column,
  value,
  resourceKey,
  id,
  isToggle,
}: {
  column: { name: string; label: string; type?: string };
  value: unknown;
  resourceKey: string;
  id: number;
  isToggle: boolean;
}) {
  if (column.type === 'image') {
    const url = value ? String(value) : '';
    return url ? (
      <span className="relative block h-11 w-16 overflow-hidden rounded-lg bg-ink-100">
        <Image src={url} alt="" fill sizes="64px" className="object-cover" />
      </span>
    ) : (
      <span className="block h-11 w-16 rounded-lg bg-ink-100" />
    );
  }

  if (column.type === 'boolean') {
    const active = Boolean(value);

    if (isToggle) {
      return (
        <form action={toggleResourceAction}>
          <input type="hidden" name="__resource" value={resourceKey} />
          <input type="hidden" name="__id" value={id} />
          <input type="hidden" name="__column" value={column.name} />
          <button
            type="submit"
            className={`badge transition-colors ${
              active
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            }`}
            title="Klik untuk mengubah status"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-green-600' : 'bg-ink-400'}`} />
            {active ? 'Terbit' : 'Draf'}
          </button>
        </form>
      );
    }

    return (
      <span className={`badge ${active ? 'bg-sun-100 text-sun-700' : 'bg-ink-100 text-ink-500'}`}>
        {active ? 'Ya' : 'Tidak'}
      </span>
    );
  }

  if (column.type === 'badge') {
    return value ? (
      <span className="badge bg-brand-50 text-brand-700">{String(value)}</span>
    ) : (
      <span className="text-ink-300">—</span>
    );
  }

  if (column.type === 'date') {
    return <span className="text-ink-600">{formatDate(String(value ?? '')) || '—'}</span>;
  }

  if (column.type === 'money') {
    return <span className="font-semibold tabular-nums text-ink-800">{formatRupiah(value as number)}</span>;
  }

  if (column.type === 'number') {
    return <span className="tabular-nums text-ink-600">{value === null || value === undefined ? '—' : String(value)}</span>;
  }

  const text = String(value ?? '');
  return (
    <span className={column.name.includes('title') || column.name === 'name' ? 'font-bold text-ink-900' : 'text-ink-600'}>
      {truncate(text, 70) || '—'}
    </span>
  );
}
