import { AccountForms } from '@/components/admin/account-forms';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getSession();

  return (
    <>
      <header className="mb-7">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
          Pengelolaan
        </p>
        <h1 className="mt-2 text-3xl">Akun Saya</h1>
        <p className="mt-2 text-[14.5px] text-ink-500">
          Perbarui identitas dan kata sandi akun administrator Anda.
        </p>
      </header>

      <AccountForms name={session?.name ?? ''} email={session?.email ?? ''} />
    </>
  );
}
