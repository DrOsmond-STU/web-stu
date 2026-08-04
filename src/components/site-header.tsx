'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconArrowRight, IconClose, IconMenu, IconPhone } from '@/components/icons';
import { cn, whatsappLink } from '@/lib/utils';

export type NavItem = {
  label: string;
  href: string;
};

/*
 * Tautan menu header.
 *
 * "Kontak" sengaja tidak ada di daftar ini — di header sudah ada tombol
 * "Hubungi Kami" yang menuju halaman yang sama, jadi menampilkan keduanya
 * hanya menggandakan tautan. Halamannya sendiri tetap ada dan tetap
 * terhubung lewat tombol tersebut, footer, peta situs, dan sitemap.xml.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang Kami', href: '/tentang-kami' },
  { label: 'Layanan', href: '/layanan' },
  { label: 'Sertifikasi', href: '/sertifikasi' },
  { label: 'Proyek', href: '/proyek' },
  { label: 'Pengalaman', href: '/pengalaman' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Berita', href: '/berita' },
];

type Props = {
  logo: string;
  companyName: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export function SiteHeader({ logo, companyName, phone, whatsappNumber, whatsappMessage }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* Bar informasi tipis */}
      <div className="hidden bg-ink-900 text-white lg:block">
        <div className="container-page flex h-10 items-center justify-between text-[12.5px]">
          <p className="text-ink-200">
            Melayani instansi pemerintah &amp; perusahaan di seluruh Indonesia sejak 2020
          </p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-2 text-ink-200 transition-colors hover:text-white"
            >
              <IconPhone className="h-3.5 w-3.5" />
              {phone}
            </a>
            <a
              href={whatsappLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-semibold text-sun-400 transition-colors hover:text-sun-300"
            >
              Konsultasi via WhatsApp
              <IconArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-ink-100 bg-white/92 shadow-soft backdrop-blur-xl'
            : 'border-b border-transparent bg-white/80 backdrop-blur-md',
        )}
      >
        <div className="container-page flex h-[74px] items-center justify-between gap-3 sm:gap-4">
          <Link href="/" className="flex shrink-0 items-center" aria-label={companyName}>
            <Image
              src={logo}
              alt={companyName}
              width={260}
              height={47}
              priority
              className="h-8 w-auto sm:h-10"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors',
                  isActive(item.href)
                    ? 'text-brand-700'
                    : 'text-ink-700 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                {item.label}
                {isActive(item.href) ? (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-gradient-to-r from-brand-600 to-sun-400" />
                ) : null}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/*
             * Satu-satunya tautan ke halaman Kontak di header, jadi tombol ini
             * tampil di semua lebar layar. Di bawah lebar sm ruang header tidak
             * cukup untuk teksnya, sehingga yang tampil hanya ikon telepon —
             * `aria-label` menjaga tombol tetap terbaca pembaca layar.
             */}
            <Link
              href="/kontak"
              aria-label="Hubungi Kami"
              className="btn-primary !px-3 !py-2.5 text-[13px] sm:!px-5"
            >
              <IconPhone className="h-4 w-4 sm:hidden" />
              <span className="hidden sm:inline">Hubungi Kami</span>
              <IconArrowRight className="hidden h-4 w-4 sm:inline" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-200 text-ink-800 transition-colors hover:border-brand-400 hover:text-brand-700 sm:h-11 sm:w-11 xl:hidden"
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
            >
              {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu layar kecil */}
      <div
        className={cn(
          'fixed inset-0 z-40 xl:hidden',
          open ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            'absolute inset-0 bg-ink-950/45 backdrop-blur-sm transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0',
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            'absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-white pb-8 pt-[74px] shadow-lift transition-transform duration-300',
            open ? 'translate-y-0' : '-translate-y-full',
          )}
        >
          <nav className="container-page flex flex-col gap-1 pt-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-bold transition-colors',
                  isActive(item.href)
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-800 hover:bg-ink-50',
                )}
              >
                {item.label}
                <IconArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
            <a
              href={whatsappLink(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent mt-4 w-full"
            >
              Chat WhatsApp Sekarang
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
