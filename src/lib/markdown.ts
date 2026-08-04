import { Marked } from 'marked';

/**
 * Konverter Markdown → HTML untuk isi artikel dan konten CMS.
 *
 * HTML mentah di dalam Markdown sengaja dibuang (renderer `html` mengembalikan
 * string kosong) agar tidak ada tag <script>/<iframe> yang bisa lolos ke halaman.
 * Konten tetap kaya karena seluruh sintaks Markdown didukung penuh.
 */
const marked = new Marked({
  gfm: true,
  breaks: false,
});

marked.use({
  renderer: {
    html() {
      return '';
    },
    link(href: string, title: string | null | undefined, text: string) {
      const url = String(href ?? '');
      const isExternal = /^https?:\/\//i.test(url) && !url.includes('semestateknologiutama.com');
      const safe = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : '#';
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer nofollow"' : '';
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<a href="${escapeHtml(safe)}"${titleAttr}${attrs}>${text}</a>`;
    },
    image(href: string, title: string | null | undefined, text: string) {
      const url = String(href ?? '');
      if (!/^(https?:|\/)/i.test(url)) return escapeHtml(text ?? '');
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(url)}" alt="${escapeHtml(text ?? '')}"${titleAttr} loading="lazy" />`;
    },
  },
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderMarkdown(source: string): string {
  if (!source) return '';
  return marked.parse(source, { async: false }) as string;
}

/** Membuang seluruh markup untuk keperluan ringkasan & meta description. */
export function stripMarkdown(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Estimasi waktu baca dalam menit (≈200 kata per menit). */
export function readingTime(source: string): number {
  const words = stripMarkdown(source).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Daftar heading level 2 untuk daftar isi artikel. */
export function extractHeadings(source: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  for (const line of source.split('\n')) {
    const match = /^##\s+(.+)$/.exec(line.trim());
    if (match) headings.push({ id: slugifyHeading(match[1]), text: match[1].trim() });
  }
  return headings;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
