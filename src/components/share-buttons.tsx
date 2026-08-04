'use client';

import { useState } from 'react';
import {
  IconCheck,
  IconFacebook,
  IconLinkedin,
  IconMail,
  IconWhatsapp,
} from '@/components/icons';

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const targets = [
    {
      label: 'WhatsApp',
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      Icon: IconWhatsapp,
      className: 'hover:bg-[#25D366] hover:border-[#25D366]',
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: IconLinkedin,
      className: 'hover:bg-[#0a66c2] hover:border-[#0a66c2]',
    },
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      Icon: IconFacebook,
      className: 'hover:bg-[#1877f2] hover:border-[#1877f2]',
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      Icon: IconMail,
      className: 'hover:bg-ink-800 hover:border-ink-800',
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Peramban menolak akses papan klip — abaikan. */
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-100 bg-mesh p-5">
      <span className="text-[13px] font-bold text-ink-700">Bagikan artikel ini:</span>

      <div className="flex flex-wrap gap-2">
        {targets.map(({ label, href, Icon, className }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Bagikan ke ${label}`}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink-200 bg-white text-ink-700 transition-all hover:-translate-y-0.5 hover:text-white ${className}`}
          >
            <Icon className="h-[17px] w-[17px]" />
          </a>
        ))}

        <button
          type="button"
          onClick={copyLink}
          className="flex h-10 items-center gap-2 rounded-xl border-2 border-ink-200 bg-white px-4 text-[12.5px] font-bold text-ink-700 transition-all hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-700"
        >
          {copied ? <IconCheck className="h-4 w-4 text-green-600" strokeWidth={3} /> : null}
          {copied ? 'Tersalin!' : 'Salin tautan'}
        </button>
      </div>
    </div>
  );
}
