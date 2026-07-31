'use client';

import { useState } from 'react';
import { GalleryInput, ImageInput } from '@/components/admin/image-input';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import type { Field } from '@/lib/admin/resources';
import { cn, slugify } from '@/lib/utils';

function toInputValue(field: Field, value: unknown): string {
  if (value === null || value === undefined) return '';

  if (field.type === 'lines' || field.type === 'gallery') {
    return Array.isArray(value) ? value.join('\n') : String(value);
  }
  if (field.type === 'tags') {
    return Array.isArray(value) ? value.join(', ') : String(value);
  }
  if (field.type === 'date') {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
  return String(value);
}

export function FieldControl({
  field,
  value,
  sourceValue,
}: {
  field: Field;
  value: unknown;
  sourceValue?: string;
}) {
  const initial = toInputValue(field, value);

  switch (field.type) {
    case 'image':
      return <ImageInput name={field.name} defaultValue={initial} />;

    case 'gallery':
      return <GalleryInput name={field.name} defaultValue={initial} />;

    case 'markdown':
      return <MarkdownEditor name={field.name} defaultValue={initial} />;

    case 'slug':
      return <SlugField field={field} initial={initial} source={sourceValue ?? ''} />;

    case 'textarea':
      return (
        <textarea
          name={field.name}
          defaultValue={initial}
          rows={field.name === 'meta_description' ? 3 : 4}
          placeholder={field.placeholder}
          className="field resize-y"
        />
      );

    case 'lines':
      return (
        <textarea
          name={field.name}
          defaultValue={initial}
          rows={7}
          placeholder={field.placeholder ?? 'Satu poin per baris'}
          className="field resize-y font-mono text-[14px]"
        />
      );

    case 'tags':
      return (
        <input
          name={field.name}
          defaultValue={initial}
          placeholder={field.placeholder ?? 'Pisahkan dengan koma'}
          className="field"
        />
      );

    case 'boolean':
      return <ToggleField name={field.name} label={field.label} defaultChecked={Boolean(value)} />;

    case 'select':
      return (
        <select name={field.name} defaultValue={initial} className="field">
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case 'number':
      return (
        <input
          type="number"
          name={field.name}
          defaultValue={initial}
          placeholder={field.placeholder}
          className="field"
        />
      );

    case 'date':
      return <input type="date" name={field.name} defaultValue={initial} className="field" />;

    default:
      return (
        <input
          name={field.name}
          defaultValue={initial}
          placeholder={field.placeholder}
          required={field.required}
          className="field"
        />
      );
  }
}

function SlugField({ field, initial, source }: { field: Field; initial: string; source: string }) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(initial.length > 0);

  return (
    <div>
      <div className="flex gap-2">
        <input
          name={field.name}
          value={value}
          onChange={(event) => {
            setValue(slugify(event.target.value));
            setTouched(true);
          }}
          placeholder="dibuat-otomatis-dari-judul"
          className="field font-mono text-[14px]"
        />
        <button
          type="button"
          onClick={() => {
            const form = document.querySelector('form[data-resource-form]');
            const input = form?.querySelector<HTMLInputElement>(`[name="${field.from}"]`);
            setValue(slugify(input?.value || source));
            setTouched(true);
          }}
          className="shrink-0 rounded-xl border-2 border-ink-200 px-4 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
        >
          Buat dari judul
        </button>
      </div>
      {!touched ? (
        <p className="mt-1.5 text-[12px] text-ink-400">
          Dikosongkan berarti slug dibuat otomatis dari judul saat disimpan.
        </p>
      ) : null}
    </div>
  );
}

function ToggleField({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 border-ink-200 bg-white px-4 py-3 transition-colors hover:border-brand-300">
      <span className="text-[14px] font-semibold text-ink-800">{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(event) => setChecked(event.target.checked)}
        className="sr-only"
      />
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-500' : 'bg-ink-200',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
            checked ? 'left-[22px]' : 'left-0.5',
          )}
        />
      </span>
    </label>
  );
}
