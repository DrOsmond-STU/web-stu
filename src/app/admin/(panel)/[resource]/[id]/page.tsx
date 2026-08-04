import { notFound } from 'next/navigation';
import { BackLink, ResourceForm } from '@/components/admin/resource-form';
import { getResource } from '@/lib/admin/resources';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ status?: string }>;
};

/** Tautan pratinjau di website publik untuk jenis konten yang punya halaman sendiri. */
const PUBLIC_PATH: Record<string, string> = {
  proyek: '/proyek',
  artikel: '/berita',
  layanan: '/layanan',
};

export default async function ResourceEditPage({ params, searchParams }: Props) {
  const { resource: key, id } = await params;
  const { status } = await searchParams;

  const resource = getResource(key);
  if (!resource) notFound();

  const isNew = id === 'baru';
  let record: Record<string, unknown> = {};

  if (!isNew) {
    const numericId = Number(id);
    if (!Number.isInteger(numericId)) notFound();

    const row = await queryOne<Record<string, unknown>>(
      `SELECT * FROM ${resource.table} WHERE id = $1 LIMIT 1`,
      [numericId],
    ).catch(() => null);

    if (!row) notFound();
    record = row;
  } else {
    // Nilai bawaan yang masuk akal untuk data baru.
    record = {
      published: true,
      featured: false,
      is_private: false,
      rating: 5,
      sort_order: 0,
      author: 'Redaksi STU',
      category: resource.key === 'artikel' ? 'Berita' : 'Aplikasi',
      icon: 'code',
      field: 'Teknologi Informasi dan Telematika',
      location: 'Jakarta',
    };
  }

  const slugValue = String(record.slug ?? '');
  const publicBase = PUBLIC_PATH[resource.key];

  return (
    <>
      <header className="mb-7">
        <BackLink href={`/admin/${resource.key}`} label={`Kembali ke ${resource.label}`} />
        <h1 className="mt-3 text-3xl">
          {isNew ? `Tambah ${resource.labelSingular}` : `Ubah ${resource.labelSingular}`}
        </h1>
        {!isNew ? (
          <p className="mt-2 text-[14.5px] text-ink-500">
            {String(record[resource.titleField] ?? '')}
          </p>
        ) : null}
      </header>

      {status ? (
        <p className="mb-6 rounded-2xl bg-green-50 px-5 py-3.5 text-[13.5px] font-semibold text-green-700">
          {resource.labelSingular} berhasil dibuat. Anda dapat melanjutkan penyuntingan di bawah ini.
        </p>
      ) : null}

      <ResourceForm
        resource={resource}
        record={record}
        isNew={isNew}
        publicPath={publicBase && slugValue ? `${publicBase}/${slugValue}` : undefined}
      />
    </>
  );
}
