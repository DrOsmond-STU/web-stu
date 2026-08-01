import Image from 'next/image';
import Link from 'next/link';
import { ClientMarquee } from '@/components/client-marquee';
import { HeroSlider, type HeroSlide } from '@/components/hero-slider';
import {
  DynamicIcon,
  IconArrowRight,
  IconArrowUpRight,
  IconCalendar,
  IconCheckCircle,
  IconQuote,
  IconWhatsapp,
} from '@/components/icons';
import { ProjectCard } from '@/components/project-card';
import { SectionHeading } from '@/components/section-heading';
import { StatCounter, type Stat } from '@/components/stat-counter';
import { TestimonialSlider } from '@/components/testimonial-slider';
import {
  getClients,
  getGallery,
  getPosts,
  getProjects,
  getServices,
  getSettings,
  getTestimonials,
  parseJsonSetting,
} from '@/lib/content';
import { formatDate, whatsappLink } from '@/lib/utils';

type ValueItem = { title: string; icon: string; text: string };

export default async function HomePage() {
  const [settings, services, projects, testimonials, posts, gallery, clients] = await Promise.all([
    getSettings(),
    getServices(),
    getProjects({ limit: 6 }),
    getTestimonials(6),
    getPosts({ limit: 3 }),
    getGallery(),
    getClients(),
  ]);

  const slides = parseJsonSetting<HeroSlide[]>(settings.hero_slides, []);
  const stats = parseJsonSetting<Stat[]>(settings.stats, []);
  const values = parseJsonSetting<ValueItem[]>(settings.values, []);

  const heroSlides: HeroSlide[] =
    slides.length > 0
      ? slides
      : [
          {
            image: '/images/hero/city-2.jpg',
            eyebrow: settings.hero_eyebrow,
            title: settings.hero_title,
            subtitle: settings.hero_subtitle,
          },
        ];

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        primaryText={settings.hero_cta_primary_text}
        primaryLink={settings.hero_cta_primary_link}
        secondaryText={settings.hero_cta_secondary_text}
        secondaryLink={settings.hero_cta_secondary_link}
        phone={settings.contact_phone}
      />

      {/* ------------------------------------------------------------ statistik */}
      <section className="relative z-10 -mt-px border-b border-ink-100 bg-white">
        <div className="container-page">
          <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {stats.map((stat) => (
              <StatCounter key={stat.label} stat={stat} />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- klien kami */}
      <ClientMarquee clients={clients} title={settings.clients_title} />

      {/* -------------------------------------------------------- tentang kami */}
      <section className="section bg-white">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="reveal relative">
            <div className="relative aspect-[4/3.2] overflow-hidden rounded-[32px] shadow-lift">
              <Image
                src={settings.about_image || '/images/hero/meeting.jpg'}
                alt={settings.company_name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            {/* Kartu kecil menumpuk */}
            <div className="absolute -bottom-8 -right-4 hidden w-[248px] rounded-3xl bg-white p-6 shadow-lift sm:block lg:-right-10">
              <p className="text-gradient text-4xl font-extrabold leading-none">
                {settings.founded_year}
              </p>
              <p className="mt-2 text-[14px] font-bold text-ink-900">Berdiri sejak</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-500">
                Melayani klien di sektor pemerintahan dan korporasi
              </p>
            </div>

            <div className="absolute -left-5 top-8 hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-5 py-4 text-white shadow-glow lg:block">
              <p className="text-[11px] font-bold uppercase tracking-wider text-brand-100">
                Standar Mutu
              </p>
              <p className="mt-1 text-[15px] font-extrabold">ISO 9001 · 27001 · 20000-1</p>
            </div>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Tentang Kami"
              title={`Mitra teknologi informasi yang tumbuh bersama klien`}
              description={settings.about_intro}
            />

            <div className="reveal mt-8 space-y-4">
              {[
                'Pengembangan aplikasi sesuai proses bisnis, bukan sekadar produk jadi',
                'Pendampingan sertifikasi ISO hingga lolos audit lembaga sertifikasi',
                'Dukungan teknis dan pemeliharaan setelah sistem diserahterimakan',
              ].map((point) => (
                <div key={point} className="flex gap-3.5">
                  <IconCheckCircle className="mt-0.5 h-[21px] w-[21px] shrink-0 text-brand-500" />
                  <p className="text-[15.5px] leading-relaxed text-ink-700">{point}</p>
                </div>
              ))}
            </div>

            <div className="reveal mt-9 flex flex-wrap gap-3">
              <Link href="/tentang-kami" className="btn-primary">
                Profil Perusahaan
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <IconWhatsapp className="h-4 w-4 text-[#25D366]" />
                Konsultasi Gratis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- layanan */}
      <section className="section bg-mesh">
        <div className="container-page">
          <SectionHeading
            eyebrow="Layanan Kami"
            title="Empat pilar layanan untuk kebutuhan teknologi informasi Anda"
            description="Dari perancangan aplikasi hingga pendampingan sertifikasi — satu mitra untuk seluruh siklus sistem informasi organisasi Anda."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/layanan/${service.slug}`}
                className="reveal card card-hover group relative flex flex-col overflow-hidden p-7"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <span className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-brand-100 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow transition-transform duration-500 group-hover:scale-110">
                  <DynamicIcon name={service.icon} className="h-7 w-7" />
                </span>

                <h3 className="relative mt-6 text-[18px] font-extrabold leading-snug text-ink-900">
                  {service.title}
                </h3>
                <p className="relative mt-3 flex-1 text-[14.5px] leading-relaxed text-ink-600">
                  {service.summary}
                </p>

                <span className="relative mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700">
                  Selengkapnya
                  <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- proyek */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Portofolio"
              title="Proyek & produk aplikasi yang kami kerjakan"
              description="Sistem yang kami bangun untuk kementerian, pemerintah daerah, dan perusahaan nasional — beserta produk aplikasi yang kami kembangkan sendiri."
              className="max-w-2xl"
            />
            <Link href="/proyek" className="btn-outline shrink-0">
              Semua Proyek
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- nilai kami */}
      <section className="bg-deep section relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '58px 58px',
          }}
        />
        <div className="container-page relative">
          <SectionHeading
            light
            eyebrow="Nilai Perusahaan"
            title="Empat nilai yang kami pegang di setiap pekerjaan"
            description="Bukan sekadar slogan — inilah cara kami bekerja bersama klien sejak hari pertama."
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="reveal group rounded-3xl border border-white/12 bg-white/[0.06] p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/50 hover:bg-white/[0.1]"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sun-400 to-sun-600 p-3.5 text-white shadow-lg">
                  <DynamicIcon name={value.icon} className="h-full w-full" />
                </span>
                <h3 className="mt-6 text-[18px] font-extrabold text-white">{value.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-brand-100/70">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ testimoni */}
      {testimonials.length > 0 ? (
        <section className="section bg-mesh">
          <div className="container-page">
            <SectionHeading
              eyebrow="Testimoni"
              title="Apa kata klien kami"
              description="Kepercayaan klien adalah ukuran keberhasilan kami."
            />
            <div className="mx-auto mt-14 max-w-4xl">
              <TestimonialSlider items={testimonials} />
            </div>
          </div>
        </section>
      ) : null}

      {/* --------------------------------------------------------------- galeri */}
      <section className="section bg-white">
        <div className="container-page">
          <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Dokumentasi"
              title="Kegiatan pelatihan & pendampingan"
              description="Dokumentasi pelatihan, pendampingan audit, dan implementasi sistem manajemen bersama klien kami."
              className="max-w-2xl"
            />
            <Link href="/galeri" className="btn-outline shrink-0">
              Semua Dokumentasi
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid auto-rows-[168px] grid-cols-2 gap-4 sm:auto-rows-[190px] lg:grid-cols-4">
            {gallery.slice(0, 7).map((item, index) => (
              <Link
                key={item.id}
                href="/galeri"
                className={`reveal group relative overflow-hidden rounded-2xl bg-ink-100 ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[13px] font-bold leading-snug text-white">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- artikel */}
      <section className="section bg-mesh">
        <div className="container-page">
          <div className="reveal flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              align="left"
              eyebrow="Berita & Artikel"
              title="Wawasan terbaru dari tim kami"
              description="Panduan praktis seputar sistem informasi, tata kelola TI, dan sertifikasi ISO."
              className="max-w-2xl"
            />
            <Link href="/berita" className="btn-outline shrink-0">
              Semua Artikel
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="reveal card card-hover group overflow-hidden">
                <Link href={`/berita/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-100">
                  <Image
                    src={post.cover_image || '/images/hero/city-1.jpg'}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <span className="badge absolute left-4 top-4 bg-white/95 text-ink-800 backdrop-blur">
                    {post.category}
                  </span>
                </Link>

                <div className="p-6">
                  <p className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
                    <IconCalendar className="h-3.5 w-3.5" />
                    {formatDate(post.published_at || post.created_at)}
                  </p>
                  <h3 className="mt-3 text-[18px] font-extrabold leading-snug text-ink-900">
                    <Link href={`/berita/${post.slug}`} className="transition-colors hover:text-brand-700">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-ink-600">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/berita/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-brand-700 transition-colors hover:text-brand-900"
                  >
                    Baca selengkapnya
                    <IconArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ ajakan bertindak */}
      <section className="relative overflow-hidden bg-ink-950 py-20 sm:py-24">
        <Image
          src="/images/hero/handshake.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-brand-950/70" />
        <div className="pointer-events-none absolute -right-24 top-1/4 h-96 w-96 rounded-full bg-sun-500/22 blur-[120px]" />

        <div className="container-page relative">
          <div className="reveal mx-auto max-w-3xl text-center">
            <IconQuote className="mx-auto h-9 w-9 text-sun-400/70" />
            <h2 className="mt-6 text-3xl leading-tight text-white sm:text-[42px]">
              {settings.cta_title}
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-brand-100/80">
              {settings.cta_subtitle}
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={whatsappLink(settings.whatsapp_number, settings.whatsapp_default_message)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent !px-8 !py-4"
              >
                <IconWhatsapp className="h-5 w-5" />
                Chat WhatsApp Sekarang
              </a>
              <Link href="/kontak" className="btn-ghost-light !px-8 !py-4">
                Kirim Permintaan Penawaran
              </Link>
            </div>

            <p className="mt-7 text-[13.5px] text-brand-100/50">
              Atau hubungi kami di {settings.contact_phone} · {settings.contact_email}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
