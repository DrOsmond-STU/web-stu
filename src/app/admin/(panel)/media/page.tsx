import Image from 'next/image';
import { MediaUploader } from '@/components/admin/media-uploader';
import { IconImage, IconTrash } from '@/components/icons';
import { deleteMediaAction } from '@/lib/admin/actions';
import { safeQuery } from '@/lib/db';
import type { MediaItem } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const items = await safeQuery<MediaItem>('SELECT * FROM media ORDER BY id DESC LIMIT 240');

  return (
    <>
      <header className="mb-7">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
          Pengelolaan
        </p>
        <h1 className="mt-2 text-3xl">Pustaka Media</h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-ink-500">
          Semua gambar yang Anda unggah tersimpan di sini dan bisa dipakai ulang pada artikel,
          proyek, galeri, maupun pengaturan situs.
        </p>
      </header>

      <MediaUploader />

      {items.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-ink-100 bg-white px-6 py-20 text-center shadow-soft">
          <IconImage className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-5 text-[16px] font-bold text-ink-800">Belum ada berkas</p>
          <p className="mt-2 text-[14px] text-ink-500">
            Unggah gambar pertama Anda melalui kotak di atas.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <figure
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft"
            >
              <div className="relative aspect-square bg-ink-100">
                <Image src={item.url} alt={item.alt || item.filename} fill sizes="220px" className="object-cover" />

                <form
                  action={deleteMediaAction}
                  className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    aria-label="Hapus dari pustaka"
                    title="Hapus dari daftar pustaka"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow transition-colors hover:bg-red-600 hover:text-white"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </form>
              </div>

              <figcaption className="p-3">
                <p className="truncate text-[12px] font-semibold text-ink-800" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-400">
                  {formatSize(item.size)} · {formatDate(item.created_at)}
                </p>
                <p className="mt-1.5 truncate rounded bg-ink-50 px-2 py-1 font-mono text-[10.5px] text-ink-500">
                  {item.url}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
