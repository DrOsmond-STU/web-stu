'use client';

import { useRef, useState } from 'react';
import { IconEye, IconEdit, IconImage } from '@/components/icons';
import { cn } from '@/lib/utils';

type Tool = { label: string; title: string; before: string; after?: string; block?: boolean };

const TOOLS: Tool[] = [
  { label: 'H2', title: 'Sub judul', before: '## ', block: true },
  { label: 'H3', title: 'Sub judul kecil', before: '### ', block: true },
  { label: 'B', title: 'Tebal', before: '**', after: '**' },
  { label: 'I', title: 'Miring', before: '_', after: '_' },
  { label: '“ ”', title: 'Kutipan', before: '> ', block: true },
  { label: '• Daftar', title: 'Daftar poin', before: '- ', block: true },
  { label: '1. Daftar', title: 'Daftar bernomor', before: '1. ', block: true },
  { label: 'Tautan', title: 'Sisipkan tautan', before: '[', after: '](https://)' },
];

/**
 * Editor Markdown sederhana dengan bilah alat, penghitung kata,
 * dan pratinjau langsung — tanpa pustaka pihak ketiga.
 */
export function MarkdownEditor({
  name,
  defaultValue = '',
  rows = 20,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function apply(tool: Tool) {
    const area = areaRef.current;
    if (!area) return;

    const { selectionStart: start, selectionEnd: end } = area;
    const selected = value.slice(start, end);

    let next: string;
    let caret: number;

    if (tool.block) {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      next = `${value.slice(0, lineStart)}${tool.before}${value.slice(lineStart)}`;
      caret = end + tool.before.length;
    } else {
      const inner = selected || 'teks';
      next = `${value.slice(0, start)}${tool.before}${inner}${tool.after ?? ''}${value.slice(end)}`;
      caret = start + tool.before.length + inner.length;
    }

    setValue(next);
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(caret, caret);
    });
  }

  function insert(text: string) {
    const area = areaRef.current;
    const position = area?.selectionStart ?? value.length;
    setValue(`${value.slice(0, position)}${text}${value.slice(position)}`);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const response = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await response.json();
      if (response.ok) insert(`\n![${file.name.replace(/\.[^.]+$/, '')}](${data.url})\n`);
    } finally {
      setUploading(false);
    }
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-ink-200 bg-white focus-within:border-brand-500">
      <div className="flex flex-wrap items-center gap-1 border-b border-ink-100 bg-ink-50 px-2 py-2">
        {TOOLS.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.title}
            onClick={() => apply(tool)}
            className="rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-ink-700 transition-colors hover:bg-white hover:text-brand-700"
          >
            {tool.label}
          </button>
        ))}

        <button
          type="button"
          title="Sisipkan gambar"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-ink-700 transition-colors hover:bg-white hover:text-brand-700 disabled:opacity-50"
        >
          <IconImage className="h-3.5 w-3.5" />
          {uploading ? 'Mengunggah…' : 'Gambar'}
        </button>

        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className={cn(
            'ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-bold transition-colors',
            preview ? 'bg-brand-600 text-white' : 'text-ink-700 hover:bg-white hover:text-brand-700',
          )}
        >
          {preview ? <IconEdit className="h-3.5 w-3.5" /> : <IconEye className="h-3.5 w-3.5" />}
          {preview ? 'Tulis' : 'Pratinjau'}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) uploadImage(file);
          event.target.value = '';
        }}
      />

      {preview ? (
        <div
          className="prose-stu max-h-[560px] overflow-y-auto px-5 py-5 text-[15px]"
          dangerouslySetInnerHTML={{ __html: simplePreview(value) }}
        />
      ) : (
        <textarea
          ref={areaRef}
          name={name}
          rows={rows}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full resize-y border-0 px-5 py-4 font-mono text-[14px] leading-relaxed text-ink-900 focus:outline-none focus:ring-0"
          placeholder="Tulis isi konten di sini menggunakan format Markdown…"
        />
      )}

      {preview ? <input type="hidden" name={name} value={value} /> : null}

      <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-4 py-2 text-[11.5px] text-ink-500">
        <span>
          {words} kata · sekitar {minutes} menit baca
        </span>
        <span className="hidden sm:inline">
          Markdown: **tebal** · _miring_ · ## judul · - daftar · [tautan](url)
        </span>
      </div>
    </div>
  );
}

/** Pratinjau ringan di sisi peramban (rendering final tetap dilakukan server). */
function simplePreview(source: string): string {
  const escape = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const blocks = escape(source).split(/\n{2,}/);

  return blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      if (trimmed.startsWith('### ')) return `<h3>${inline(trimmed.slice(4))}</h3>`;
      if (trimmed.startsWith('## ')) return `<h2>${inline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith('&gt; ')) return `<blockquote>${inline(trimmed.slice(5))}</blockquote>`;

      if (/^[-*] /m.test(trimmed)) {
        const items = trimmed
          .split('\n')
          .filter((line) => /^[-*] /.test(line.trim()))
          .map((line) => `<li>${inline(line.trim().slice(2))}</li>`)
          .join('');
        if (items) return `<ul>${items}</ul>`;
      }

      if (/^\d+\. /m.test(trimmed)) {
        const items = trimmed
          .split('\n')
          .filter((line) => /^\d+\. /.test(line.trim()))
          .map((line) => `<li>${inline(line.trim().replace(/^\d+\.\s*/, ''))}</li>`)
          .join('');
        if (items) return `<ol>${items}</ol>`;
      }

      return `<p>${inline(trimmed).replace(/\n/g, '<br />')}</p>`;
    })
    .join('');
}

function inline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])_([^_]+)_/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
