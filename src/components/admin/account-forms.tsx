'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { IconCheckCircle, IconLock } from '@/components/icons';
import {
  changePasswordAction,
  updateProfileAction,
  type ActionState,
} from '@/lib/admin/actions';

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary mt-6 !py-3">
      {pending ? 'Menyimpan…' : label}
    </button>
  );
}

function Alert({ state }: { state: ActionState }) {
  if (state.error) {
    return (
      <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-700">
        {state.error}
      </p>
    );
  }
  if (state.ok) {
    return (
      <p className="mb-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-[13.5px] font-semibold text-green-700">
        <IconCheckCircle className="h-4 w-4" />
        {state.message}
      </p>
    );
  }
  return null;
}

export function AccountForms({ name, email }: { name: string; email: string }) {
  const [profileState, profileAction] = useActionState<ActionState, FormData>(
    updateProfileAction,
    {},
  );
  const [passwordState, passwordAction] = useActionState<ActionState, FormData>(
    changePasswordAction,
    {},
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={profileAction} className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
        <h2 className="text-xl">Identitas Akun</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-500">
          Nama ini tampil pada panel CMS dan sebagai penulis bawaan artikel.
        </p>

        <div className="mt-6">
          <Alert state={profileState} />

          <label className="field-label" htmlFor="acc-name">
            Nama Lengkap
          </label>
          <input id="acc-name" name="name" defaultValue={name} required className="field" />

          <label className="field-label mt-5" htmlFor="acc-email">
            Email
          </label>
          <input
            id="acc-email"
            name="email"
            type="email"
            defaultValue={email}
            required
            className="field"
          />

          <Submit label="Simpan Identitas" />
        </div>
      </form>

      <form action={passwordAction} className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft">
        <h2 className="flex items-center gap-2 text-xl">
          <IconLock className="h-5 w-5 text-brand-600" />
          Ganti Kata Sandi
        </h2>
        <p className="mt-1.5 text-[13.5px] text-ink-500">
          Gunakan kata sandi minimal 8 karakter yang tidak dipakai di tempat lain.
        </p>

        <div className="mt-6">
          <Alert state={passwordState} />

          <label className="field-label" htmlFor="pw-current">
            Kata Sandi Saat Ini
          </label>
          <input
            id="pw-current"
            name="current_password"
            type="password"
            required
            autoComplete="current-password"
            className="field"
          />

          <label className="field-label mt-5" htmlFor="pw-new">
            Kata Sandi Baru
          </label>
          <input
            id="pw-new"
            name="new_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="field"
          />

          <label className="field-label mt-5" htmlFor="pw-confirm">
            Ulangi Kata Sandi Baru
          </label>
          <input
            id="pw-confirm"
            name="confirm_password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="field"
          />

          <Submit label="Ganti Kata Sandi" />
        </div>
      </form>
    </div>
  );
}
