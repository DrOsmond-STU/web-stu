'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ImageInput } from '@/components/admin/image-input';
import { MarkdownEditor } from '@/components/admin/markdown-editor';
import { IconCheckCircle } from '@/components/icons';
import { saveSettingsAction, type ActionState } from '@/lib/admin/actions';
import type { SettingDef } from '@/lib/defaults';
import { cn } from '@/lib/utils';

type FieldWithValue = SettingDef & { current: string };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary !py-3">
      {pending ? 'Menyimpan…' : 'Simpan Perubahan'}
    </button>
  );
}

export function SettingsForm({
  groups,
  activeGroup,
  fields,
}: {
  groups: { id: string; label: string; description: string }[];
  activeGroup: string;
  fields: FieldWithValue[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveSettingsAction, {});

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Daftar kelompok */}
      <nav className="lg:col-span-3">
        <ul className="space-y-1.5 lg:sticky lg:top-6">
          {groups.map((group) => (
            <li key={group.id}>
              <Link
                href={`/admin/pengaturan?grup=${group.id}`}
                className={cn(
                  'block rounded-2xl px-4 py-3 transition-colors',
                  activeGroup === group.id
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                    : 'bg-white text-ink-700 hover:bg-brand-50',
                )}
              >
                <span className="block text-[14px] font-bold">{group.label}</span>
                <span
                  className={cn(
                    'mt-0.5 block text-[11.5px] leading-snug',
                    activeGroup === group.id ? 'text-white/70' : 'text-ink-400',
                  )}
                >
                  {group.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Formulir */}
      <div className="lg:col-span-9">
        <form action={formAction}>
          {state.error ? (
            <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-[14px] font-semibold text-red-700">
              {state.error}
            </div>
          ) : null}
          {state.ok ? (
            <div className="mb-6 flex items-center gap-2.5 rounded-2xl bg-green-50 px-5 py-4 text-[14px] font-semibold text-green-700">
              <IconCheckCircle className="h-5 w-5" />
              {state.message}
            </div>
          ) : null}

          <div className="space-y-6 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="field-label" htmlFor={`s-${field.key}`}>
                  {field.label}
                </label>
                <SettingControl field={field} />
                {field.hint ? (
                  <p className="mt-1.5 text-[12px] text-ink-400">{field.hint}</p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="sticky bottom-4 z-10 mt-6 flex items-center justify-between gap-4 rounded-2xl border border-ink-100 bg-white/95 px-5 py-4 shadow-lift backdrop-blur">
            <p className="text-[13px] text-ink-500">
              Perubahan langsung tampil di website setelah disimpan.
            </p>
            <SaveButton />
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingControl({ field }: { field: FieldWithValue }) {
  const name = `setting__${field.key}`;

  switch (field.type) {
    case 'image':
      return <ImageInput name={name} defaultValue={field.current} />;

    case 'markdown':
      return <MarkdownEditor name={name} defaultValue={field.current} rows={12} />;

    case 'json':
      return (
        <textarea
          id={`s-${field.key}`}
          name={name}
          defaultValue={field.current}
          rows={14}
          spellCheck={false}
          className="field resize-y font-mono text-[13px] leading-relaxed"
        />
      );

    case 'textarea':
      return (
        <textarea
          id={`s-${field.key}`}
          name={name}
          defaultValue={field.current}
          rows={4}
          className="field resize-y"
        />
      );

    case 'number':
      return (
        <input
          id={`s-${field.key}`}
          type="number"
          name={name}
          defaultValue={field.current}
          className="field"
        />
      );

    default:
      return (
        <input id={`s-${field.key}`} name={name} defaultValue={field.current} className="field" />
      );
  }
}
