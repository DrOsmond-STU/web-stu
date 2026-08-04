'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { IconClose, IconImage, IconPlus, IconTrash } from '@/components/icons';

type MediaItem = { id: number; url: string; filename: string };

/** Pemilih satu gambar: unggah berkas, pilih dari pustaka, atau tempel URL. */
export function ImageInput({
  name,
  defaultValue = '',
  label,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mengunggah.');
      setValue(data.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label ? <span className="field-label">{label}</span> : null}
      <input type="hidden" name={name} value={value} />

      <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/60 p-4">
        {value ? (
          <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl bg-white">
            <Image src={value} alt="" fill sizes="360px" className="object-contain" />
            <button
              type="button"
              onClick={() => setValue('')}
              aria-label="Hapus gambar"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-600 shadow transition-colors hover:bg-red-600 hover:text-white"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="mb-3 flex aspect-[16/10] items-center justify-center rounded-xl bg-white text-ink-300">
            <IconImage className="h-10 w-10" />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            {busy ? 'Mengunggah…' : 'Unggah Gambar'}
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-lg border-2 border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400"
          >
            Pustaka Media
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = '';
          }}
        />

        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="atau tempel URL gambar di sini"
          className="field-sm mt-3"
        />

        {error ? <p className="mt-2 text-[12px] font-semibold text-red-600">{error}</p> : null}
      </div>

      {pickerOpen ? (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onPick={(url) => {
            setValue(url);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

/** Pemilih banyak gambar (galeri). Nilai disimpan satu URL per baris. */
export function GalleryInput({
  name,
  defaultValue = '',
  label,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [items, setItems] = useState<string[]>(
    defaultValue.split('\n').map((line) => line.trim()).filter(Boolean),
  );
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function uploadMany(files: FileList) {
    setBusy(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append('file', file);
      try {
        const response = await fetch('/api/admin/upload', { method: 'POST', body });
        const data = await response.json();
        if (response.ok) uploaded.push(data.url);
      } catch {
        /* Lewati berkas yang gagal. */
      }
    }
    setItems((prev) => [...prev, ...uploaded]);
    setBusy(false);
  }

  const move = (index: number, direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  return (
    <div>
      {label ? <span className="field-label">{label}</span> : null}
      <input type="hidden" name={name} value={items.join('\n')} />

      <div className="rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/60 p-4">
        {items.length > 0 ? (
          <ul className="mb-3 space-y-2">
            {items.map((url, index) => (
              <li key={`${url}-${index}`} className="flex items-center gap-3 rounded-xl bg-white p-2">
                <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-100">
                  <Image src={url} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 truncate text-[12px] text-ink-500">{url}</span>
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    aria-label="Naikkan"
                    className="rounded-md px-2 py-1 text-[12px] font-bold text-ink-500 hover:bg-ink-100"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    aria-label="Turunkan"
                    className="rounded-md px-2 py-1 text-[12px] font-bold text-ink-500 hover:bg-ink-100"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                    aria-label="Hapus"
                    className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-3 rounded-xl bg-white px-4 py-6 text-center text-[13px] text-ink-400">
            Belum ada gambar
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
          >
            <IconPlus className="h-3.5 w-3.5" />
            {busy ? 'Mengunggah…' : 'Unggah Gambar'}
          </button>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-lg border-2 border-ink-200 bg-white px-3.5 py-2 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400"
          >
            Pustaka Media
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files?.length) uploadMany(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {pickerOpen ? (
        <MediaPicker
          onClose={() => setPickerOpen(false)}
          onPick={(url) => {
            setItems((prev) => [...prev, url]);
            setPickerOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function MediaPicker({ onPick, onClose }: { onPick: (url: string) => void; onClose: () => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/upload')
      .then((response) => response.json())
      .then((data) => setItems(data.items ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-lift"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h3 className="text-[16px] font-extrabold">Pustaka Media</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-ink-500 hover:bg-ink-100"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-6">
          {loading ? (
            <p className="py-10 text-center text-[14px] text-ink-500">Memuat…</p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-[14px] text-ink-500">
              Belum ada berkas. Unggah gambar terlebih dahulu.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onPick(item.url)}
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-ink-100 transition-all hover:border-brand-500"
                >
                  <Image src={item.url} alt={item.filename} fill sizes="180px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
