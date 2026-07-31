import Image from 'next/image';
import Link from 'next/link';
import { IconChevronRight } from '@/components/icons';

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  breadcrumbs?: Crumb[];
};

export function PageHero({
  eyebrow,
  title,
  description,
  image = '/images/hero/city-1.jpg',
  breadcrumbs = [],
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/88 to-ink-950/55" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '58px 58px',
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-sun-500/20 blur-[120px]" />

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        {breadcrumbs.length > 0 ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-brand-100/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Beranda
                </Link>
              </li>
              {breadcrumbs.map((crumb) => (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  <IconChevronRight className="h-3.5 w-3.5 opacity-50" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition-colors hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <span className="eyebrow-light">{eyebrow}</span> : null}

        <h1 className="mt-5 max-w-3xl text-[32px] leading-[1.15] text-white sm:text-5xl">{title}</h1>

        {description ? (
          <p className="mt-5 max-w-2xl text-[16.5px] leading-relaxed text-brand-100/80">
            {description}
          </p>
        ) : null}
      </div>

      <div className="divider-gradient" />
    </section>
  );
}
