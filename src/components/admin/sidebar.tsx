'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  IconAward,
  IconBriefcase,
  IconBuilding,
  IconCertificate,
  IconClose,
  IconDashboard,
  IconExternal,
  IconImage,
  IconInbox,
  IconLayers,
  IconLogout,
  IconMenu,
  IconNews,
  IconQuote,
  IconSettings,
  IconUsers,
} from '@/components/icons';
import { logoutAction } from '@/lib/admin/actions';
import { cn } from '@/lib/utils';

const ICONS: Record<string, typeof IconLayers> = {
  layers: IconLayers,
  news: IconNews,
  quote: IconQuote,
  briefcase: IconBriefcase,
  users: IconUsers,
  image: IconImage,
  dashboard: IconDashboard,
  inbox: IconInbox,
  settings: IconSettings,
  building: IconBuilding,
  badge: IconCertificate,
  award: IconAward,
};

export type NavGroup = {
  title: string;
  items: { label: string; href: string; icon: string; badge?: number }[];
};

export function AdminSidebar({
  groups,
  user,
}: {
  groups: NavGroup[];
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const content = (
    <>
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Image
            src="/images/brand/logo-mark.png"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="leading-tight">
            <span className="block text-[13.5px] font-extrabold text-white">Panel CMS</span>
            <span className="block text-[11px] text-brand-200/70">Semesta Teknologi Utama</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Tutup menu"
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 lg:hidden"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand-200/45">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = ICONS[item.icon] ?? IconDashboard;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition-colors',
                        active
                          ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow'
                          : 'text-brand-100/70 hover:bg-white/10 hover:text-white',
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge ? (
                        <span className="rounded-full bg-sun-500 px-2 py-0.5 text-[10.5px] font-extrabold text-white">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-brand-100/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <IconExternal className="h-[18px] w-[18px]" />
          Lihat Website
        </a>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.06] px-3 py-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[13px] font-extrabold text-white">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <Link href="/admin/akun" className="block truncate text-[12.5px] font-bold text-white hover:underline">
              {user.name}
            </Link>
            <span className="block truncate text-[11px] text-brand-200/60">{user.email}</span>
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              title="Keluar"
              aria-label="Keluar"
              className="rounded-lg p-2 text-brand-100/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <IconLogout className="h-[18px] w-[18px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Bilah atas untuk layar kecil */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/images/brand/logo-mark.png" alt="" width={30} height={30} className="h-7 w-7" />
          <span className="text-[14px] font-extrabold">Panel CMS</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
          className="rounded-lg border-2 border-ink-200 p-2 text-ink-700"
        >
          <IconMenu className="h-5 w-5" />
        </button>
      </div>

      {/* Panel samping */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[268px] flex-col bg-ink-950 transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {content}
      </aside>

      {open ? (
        <div
          className="fixed inset-0 z-40 bg-ink-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
