'use client';

import { useEffect, useRef, useState } from 'react';
import { IconClose, IconSend, IconWhatsapp } from '@/components/icons';
import { cn, whatsappLink } from '@/lib/utils';

type Props = {
  number: string;
  greeting: string;
  defaultMessage: string;
  quickReplies: string[];
  agentName: string;
  agentRole: string;
};

/**
 * Tombol chat mengambang yang membuka panel percakapan kecil,
 * lalu meneruskan pesan ke WhatsApp perusahaan (wa.me).
 */
export function WhatsAppWidget({
  number,
  greeting,
  defaultMessage,
  quickReplies,
  agentName,
  agentRole,
}: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(defaultMessage);
  const [nudge, setNudge] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /**
   * Gelembung ajakan muncul sekali per sesi, tetapi hanya setelah pengguna
   * menggulir melewati bagian hero. Di layar ponsel gelembung ini duduk tepat
   * di atas tombol mengambang dan sempat menutupi tombol "Konsultasi Gratis"
   * serta titik navigasi hero — menunggu guliran membuat area itu sudah lewat
   * sebelum gelembung muncul. Gelembung juga menghilang sendiri setelah 12
   * detik agar tidak menghalangi konten di bawahnya.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.sessionStorage.getItem('stu_wa_nudge') === 'seen') return;

    let siap = false;
    let sudahGulir = window.scrollY > 320;
    let sembunyi: number | undefined;

    const tampilkan = () => {
      if (!siap || !sudahGulir) return;
      setNudge(true);
      window.removeEventListener('scroll', onScroll);
      sembunyi = window.setTimeout(() => {
        setNudge(false);
        window.sessionStorage.setItem('stu_wa_nudge', 'seen');
      }, 12000);
    };

    const onScroll = () => {
      if (window.scrollY > 320) {
        sudahGulir = true;
        tampilkan();
      }
    };

    const jeda = window.setTimeout(() => {
      siap = true;
      tampilkan();
    }, 6000);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(jeda);
      if (sembunyi) window.clearTimeout(sembunyi);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setNudge(false);
    window.sessionStorage.setItem('stu_wa_nudge', 'seen');
    const timer = window.setTimeout(() => inputRef.current?.focus(), 260);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  const send = (text?: string) => {
    const body = (text ?? message).trim() || defaultMessage;
    window.open(whatsappLink(number, body), '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    /*
     * `pointer-events-none` pada pembungkus ini WAJIB. Panel percakapan tetap
     * berada di alur tata letak saat tertutup (supaya animasinya mulus), jadi
     * pembungkus ini selalu setinggi panel — sekitar 526 px. Tanpa baris itu,
     * kotak tak terlihat tersebut menelan klik di seluruh area kanan layar,
     * termasuk tombol "Hubungi Kami" di header pada layar yang pendek.
     * Setiap elemen yang memang dapat diklik mengaktifkan kembali lewat
     * `pointer-events-auto`.
     */
    <div className="pointer-events-none fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {/* Panel percakapan */}
      <div
        ref={panelRef}
        className={cn(
          'w-[calc(100vw-2.5rem)] max-w-[366px] origin-bottom-right overflow-hidden rounded-3xl bg-white shadow-lift transition-all duration-300',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none translate-y-3 scale-95 opacity-0',
        )}
        role="dialog"
        aria-label="Chat WhatsApp"
        aria-hidden={!open}
      >
        {/* Kepala panel */}
        <div className="relative overflow-hidden bg-[#075E54] px-5 py-4 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(at 88% 10%, rgba(37,211,102,.7) 0px, transparent 55%)',
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366]">
              <IconWhatsapp className="h-6 w-6 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#075E54] bg-[#4ade80]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-bold leading-tight">{agentName}</p>
              <p className="truncate text-[12px] text-white/75">{agentRole}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            >
              <IconClose className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Isi percakapan */}
        <div
          className="max-h-[290px] space-y-3 overflow-y-auto px-4 py-5"
          style={{
            backgroundColor: '#ece5dd',
            backgroundImage:
              'radial-gradient(rgba(255,255,255,.55) 1px, transparent 1px), radial-gradient(rgba(0,0,0,.03) 1px, transparent 1px)',
            backgroundSize: '22px 22px, 22px 22px',
            backgroundPosition: '0 0, 11px 11px',
          }}
        >
          <div className="max-w-[86%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm">
            <p className="text-[14px] leading-relaxed text-ink-800">{greeting}</p>
            <span className="mt-1 block text-right text-[10.5px] text-ink-400">Baru saja</span>
          </div>

          {quickReplies.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => send(reply)}
                  className="rounded-full border border-[#25D366]/40 bg-white px-3.5 py-2 text-left text-[12.5px] font-semibold text-[#0f8a4a] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-white"
                >
                  {reply}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Kotak kirim */}
        <div className="flex items-end gap-2 border-t border-ink-100 bg-white p-3">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Tulis pesan Anda…"
            className="max-h-28 min-h-[46px] flex-1 resize-none rounded-2xl border-2 border-ink-200 px-3.5 py-2.5 text-[14px] leading-snug text-ink-900 transition-colors placeholder:text-ink-400 focus:border-[#25D366] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => send()}
            aria-label="Kirim ke WhatsApp"
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md transition-all hover:scale-105 hover:bg-[#1eb757]"
          >
            <IconSend className="h-[19px] w-[19px]" />
          </button>
        </div>
      </div>

      {/* Gelembung ajakan */}
      {nudge && !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="animate-fade-up pointer-events-auto max-w-[250px] rounded-2xl rounded-br-sm bg-white px-4 py-3 text-left text-[13px] font-semibold leading-snug text-ink-800 shadow-lift"
        >
          Butuh bantuan? Chat tim kami sekarang 👋
        </button>
      ) : null}

      {/* Tombol mengambang */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Tutup chat WhatsApp' : 'Buka chat WhatsApp'}
        aria-expanded={open}
        className="group pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_38px_-10px_rgba(37,211,102,.9)] transition-all duration-300 hover:scale-105 sm:h-[60px] sm:w-[60px]"
      >
        {/*
         * `animate-ping` membesarkan cincin ini sampai dua kali ukuran tombol,
         * jadi tanpa `pointer-events-none` ia menelan klik pada elemen di
         * sekitarnya (mis. tautan footer dan titik navigasi hero).
         */}
        {!open ? (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
        ) : null}
        <span className="relative">
          {open ? (
            <IconClose className="h-6 w-6" />
          ) : (
            <IconWhatsapp className="h-[30px] w-[30px]" />
          )}
        </span>
      </button>
    </div>
  );
}
