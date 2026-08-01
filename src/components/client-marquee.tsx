import Image from 'next/image';
import type { Client } from '@/lib/types';

/**
 * Baris berjalan berisi logo instansi & perusahaan yang pernah memakai jasa kami.
 * Klien tanpa logo tetap tampil sebagai teks nama, sehingga baris ini
 * tidak pernah kosong meski logonya belum diunggah lewat CMS.
 */
export function ClientMarquee({ clients, title }: { clients: Client[]; title: string }) {
  if (clients.length === 0) return null;

  // Digandakan agar animasi bergulir terlihat menyambung tanpa jeda.
  const loop = [...clients, ...clients];

  return (
    <section className="overflow-hidden border-b border-ink-100 bg-ink-50/60 py-10">
      <p className="container-page mb-7 text-center text-[11.5px] font-extrabold uppercase tracking-[0.2em] text-ink-400">
        {title}
      </p>

      <div className="mask-fade-r relative flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14">
          {loop.map((client, index) => {
            const content = client.logo ? (
              <span className="relative block h-12 w-[150px] shrink-0 sm:h-14 sm:w-[180px]">
                <Image
                  src={client.logo}
                  alt={client.name}
                  fill
                  sizes="180px"
                  className="object-contain opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </span>
            ) : (
              <span className="block shrink-0 whitespace-nowrap text-[15px] font-bold text-ink-400 transition-colors hover:text-brand-600">
                {client.name}
              </span>
            );

            return client.website ? (
              <a
                key={`${client.id}-${index}`}
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                title={client.name}
                className="flex shrink-0 items-center"
              >
                {content}
              </a>
            ) : (
              <span key={`${client.id}-${index}`} title={client.name} className="flex shrink-0 items-center">
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
