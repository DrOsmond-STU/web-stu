'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { IconEye, IconLock } from '@/components/icons';
import { loginAction, type ActionState } from '@/lib/admin/actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary mt-6 w-full !py-3.5">
      <IconLock className="h-4 w-4" />
      {pending ? 'Memeriksa…' : 'Masuk ke Panel'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(loginAction, {});
  const [visible, setVisible] = useState(false);

  return (
    <form action={formAction} className="mt-7">
      {state.error ? (
        <p className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-[13.5px] font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      <div>
        <label className="field-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          placeholder="admin@semestateknologiutama.com"
          className="field"
        />
      </div>

      <div className="mt-5">
        <label className="field-label" htmlFor="password">
          Kata Sandi
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={visible ? 'text' : 'password'}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="field pr-12"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 transition-colors hover:text-ink-700"
          >
            <IconEye className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
