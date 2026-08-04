import Link from 'next/link';
import { IconArrowRight, IconSearch } from '@/components/icons';

export default function NotFound() {
  return (
    <section className="bg-deep relative flex min-h-[70vh] items-center overflow-hidden py-24">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sun-500/20 blur-[120px]" />

      <div className="container-page relative text-center">
        <p className="text-gradient-light text-[86px] font-extrabold leading-none sm:text-[120px]">
          404
        </p>
        <h1 className="mt-4 text-3xl text-white sm:text-4xl">Halaman tidak ditemukan</h1>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-brand-100/75">
          Halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau alamatnya salah ketik.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-accent !px-8 !py-4">
            Kembali ke Beranda
            <IconArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/peta-situs" className="btn-ghost-light !px-8 !py-4">
            <IconSearch className="h-4 w-4" />
            Lihat Peta Situs
          </Link>
        </div>
      </div>
    </section>
  );
}
