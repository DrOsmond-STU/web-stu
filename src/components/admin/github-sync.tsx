'use client';

import { useState, useTransition } from 'react';
import { IconCheckCircle, IconGithub, IconRefresh } from '@/components/icons';
import { syncGithubAction } from '@/lib/admin/github';
import type { ActionState } from '@/lib/admin/actions';

export function GithubSyncButton() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<ActionState>({});

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setState({});
            setState(await syncGithubAction());
          })
        }
        className="inline-flex items-center gap-2 rounded-full border-2 border-ink-200 bg-white px-5 py-3 text-[13px] font-bold text-ink-800 transition-colors hover:border-brand-400 hover:text-brand-700 disabled:opacity-60"
      >
        {pending ? <IconRefresh className="h-4 w-4 animate-spin" /> : <IconGithub className="h-4 w-4" />}
        {pending ? 'Menyinkronkan…' : 'Sinkronkan dari GitHub'}
      </button>

      {state.error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.ok ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-green-50 px-4 py-3 text-[13px] font-semibold leading-relaxed text-green-700">
          <IconCheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
