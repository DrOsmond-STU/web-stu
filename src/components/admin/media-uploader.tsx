'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { IconImage, IconPlus } from '@/components/icons';
import { cn } from '@/lib/utils';

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  async function upload(files: FileList | File[]) {
    setBusy(true);
    setError('');
    let failed = 0;

    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      try {
        const response = await fetch('/api/admin/upload', { method: 'POST', body });
        if (!response.ok) failed += 1;
      } catch {
        failed += 1;
      }
    }

    setBusy(false);
    if (failed > 0) setError(`${failed} berkas gagal diunggah.`);
    router.refresh();
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (event.dataTransfer.files.length) upload(event.dataTransfer.files);
      }}
      className={cn(
        'rounded-3xl border-2 border-dashed bg-white px-6 py-10 text-center transition-colors',
        dragging ? 'border-brand-500 bg-brand-50' : 'border-ink-200',
      )}
    >
      <IconImage className="mx-auto h-10 w-10 text-ink-300" />
      <p className="mt-4 text-[15px] font-bold text-ink-800">
        Seret berkas ke sini atau pilih dari komputer
      </p>
      <p className="mt-1.5 text-[13px] text-ink-500">
        Format JPG, PNG, WebP, GIF, atau SVG · maksimal 8 MB per berkas
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="btn-primary mt-6 !py-2.5"
      >
        <IconPlus className="h-4 w-4" />
        {busy ? 'Mengunggah…' : 'Pilih Berkas'}
      </button>

      {error ? <p className="mt-4 text-[13px] font-semibold text-red-600">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          if (event.target.files?.length) upload(event.target.files);
          event.target.value = '';
        }}
      />
    </div>
  );
}
