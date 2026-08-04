import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminSidebar, type NavGroup } from '@/components/admin/sidebar';
import { getSession } from '@/lib/auth';
import { safeQuery } from '@/lib/db';
import { RESOURCES } from '@/lib/admin/resources';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Panel CMS',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  const unread = await safeQuery<{ n: number }>(
    'SELECT COUNT(*)::int AS n FROM messages WHERE is_read = FALSE',
  );

  const groups: NavGroup[] = [
    {
      title: 'Ringkasan',
      items: [{ label: 'Dasbor', href: '/admin', icon: 'dashboard' }],
    },
    {
      title: 'Konten',
      items: RESOURCES.map((resource) => ({
        label: resource.label,
        href: `/admin/${resource.key}`,
        icon: resource.icon,
      })),
    },
    {
      title: 'Pengelolaan',
      items: [
        { label: 'Pesan Masuk', href: '/admin/pesan', icon: 'inbox', badge: unread[0]?.n || 0 },
        { label: 'Pustaka Media', href: '/admin/media', icon: 'image' },
        { label: 'Pengaturan Situs', href: '/admin/pengaturan', icon: 'settings' },
        { label: 'Akun Saya', href: '/admin/akun', icon: 'users' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ink-50">
      <AdminSidebar groups={groups} user={{ name: session.name, email: session.email }} />
      <div className="lg:pl-[268px]">
        <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-7 sm:py-9">{children}</div>
      </div>
    </div>
  );
}
