'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { FieldControl } from '@/components/admin/fields';
import { IconArrowRight, IconCheckCircle, IconExternal, IconTrash } from '@/components/icons';
import { deleteResourceAction, saveResourceAction, type ActionState } from '@/lib/admin/actions';
import type { Resource } from '@/lib/admin/resources';
import { cn } from '@/lib/utils';

const SPAN_CLASS: Record<number, string> = {
  4: 'sm:col-span-4',
  6: 'sm:col-span-6',
  12: 'sm:col-span-12',
};

function SubmitButton({ isNew }: { isNew: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full !py-3">
      {pending ? 'Menyimpan…' : isNew ? 'Simpan & Terbitkan' : 'Simpan Perubahan'}
    </button>
  );
}

export function ResourceForm({
  resource,
  record,
  isNew,
  publicPath,
}: {
  resource: Resource;
  record: Record<string, unknown>;
  isNew: boolean;
  publicPath?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveResourceAction, {});

  const main = resource.fields.filter((field) => !field.aside);
  const aside = resource.fields.filter((field) => field.aside);
  const title = String(record[resource.titleField] ?? '');

  return (
    <form action={formAction} data-resource-form className="pb-16">
      <input type="hidden" name="__resource" value={resource.key} />
      <input type="hidden" name="__id" value={isNew ? 'baru' : String(record.id ?? '')} />

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

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Kolom utama */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft sm:p-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
              {main.map((field) => (
                <div key={field.name} className={cn('col-span-1', SPAN_CLASS[field.span ?? 12])}>
                  {field.type !== 'boolean' ? (
                    <label className="field-label" htmlFor={`f-${field.name}`}>
                      {field.label}
                      {field.required ? <span className="ml-1 text-sun-600">*</span> : null}
                    </label>
                  ) : null}
                  <FieldControl
                    field={field}
                    value={record[field.name]}
                    sourceValue={field.from ? String(record[field.from] ?? '') : undefined}
                  />
                  {field.hint ? <p className="mt-1.5 text-[12px] text-ink-400">{field.hint}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel samping */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-5">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
              <SubmitButton isNew={isNew} />

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/${resource.key}`}
                  className="flex-1 rounded-xl border-2 border-ink-200 px-4 py-2.5 text-center text-[13px] font-bold text-ink-700 transition-colors hover:border-ink-300"
                >
                  Kembali
                </Link>
                {!isNew && publicPath ? (
                  <a
                    href={publicPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Lihat di website"
                    className="flex items-center justify-center rounded-xl border-2 border-ink-200 px-4 text-ink-600 transition-colors hover:border-brand-400 hover:text-brand-700"
                  >
                    <IconExternal className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            </div>

            {aside.length > 0 ? (
              <div className="space-y-5 rounded-3xl border border-ink-100 bg-white p-6 shadow-soft">
                {aside.map((field) => (
                  <div key={field.name}>
                    {field.type !== 'boolean' && field.type !== 'image' && field.type !== 'gallery' ? (
                      <label className="field-label">{field.label}</label>
                    ) : null}
                    {field.type === 'image' || field.type === 'gallery' ? (
                      <span className="field-label">{field.label}</span>
                    ) : null}
                    <FieldControl
                      field={field}
                      value={record[field.name]}
                      sourceValue={field.from ? String(record[field.from] ?? '') : undefined}
                    />
                    {field.hint ? (
                      <p className="mt-1.5 text-[12px] text-ink-400">{field.hint}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}

            {!isNew ? (
              <div className="rounded-3xl border border-red-100 bg-red-50/60 p-6">
                <h3 className="text-[13px] font-extrabold uppercase tracking-wider text-red-700">
                  Zona Berbahaya
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-red-600/80">
                  Menghapus {resource.labelSingular.toLowerCase()} “{title}” tidak dapat dibatalkan.
                </p>
                <button
                  type="submit"
                  formAction={deleteResourceAction}
                  formNoValidate
                  onClick={(event) => {
                    if (!window.confirm(`Hapus "${title}" secara permanen?`)) event.preventDefault();
                  }}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-red-200 bg-white px-4 py-2.5 text-[13px] font-bold text-red-700 transition-colors hover:bg-red-600 hover:text-white"
                >
                  <IconTrash className="h-4 w-4" />
                  Hapus Permanen
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </form>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[13px] font-bold text-ink-500 transition-colors hover:text-brand-700"
    >
      <IconArrowRight className="h-4 w-4 rotate-180" />
      {label}
    </Link>
  );
}
