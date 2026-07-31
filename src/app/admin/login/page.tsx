import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/admin/login-form';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Masuk Panel CMS',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/admin');

  return (
    <div className="bg-deep relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sun-500/20 blur-[120px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '54px 54px',
        }}
      />

      <div className="relative w-full max-w-[420px]">
        <div className="mb-8 text-center">
          <Image
            src="/images/brand/logo-horizontal.png"
            alt="Semesta Teknologi Utama"
            width={280}
            height={51}
            priority
            className="mx-auto h-11 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-[13.5px] text-brand-100/60">
            Panel pengelolaan konten website
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-lift">
          <h1 className="text-2xl">Masuk</h1>
          <p className="mt-2 text-[14px] text-ink-500">
            Gunakan akun administrator untuk mengelola konten website.
          </p>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-[13px] text-brand-100/50">
          <Link href="/" className="transition-colors hover:text-white">
            ← Kembali ke website
          </Link>
        </p>
      </div>
    </div>
  );
}
