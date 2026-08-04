'use client';

import { useState } from 'react';
import { IconCheckCircle, IconSend, IconWhatsapp } from '@/components/icons';
import { whatsappLink } from '@/lib/utils';

const SUBJECTS = [
  'Pengembangan Aplikasi',
  'Desain & Pembangunan Jaringan',
  'Service & Maintenance',
  'Implementasi / Sertifikasi ISO',
  'Lainnya',
];

export function ContactForm({ whatsappNumber }: { whatsappNumber: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: SUBJECTS[0],
    message: '',
  });

  const update = (key: keyof typeof form) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    setError('');

    try {
      const response = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Pesan gagal dikirim.');
      setStatus('sent');
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
    }
  }

  const waMessage = [
    `Halo Semesta Teknologi Utama, saya ${form.name || '[nama]'}`,
    form.company ? `dari ${form.company}` : '',
    `\n\nPerihal: ${form.subject}`,
    form.message ? `\nPesan: ${form.message}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  if (status === 'sent') {
    return (
      <div className="card flex flex-col items-center p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white">
          <IconCheckCircle className="h-8 w-8" />
        </span>
        <h3 className="mt-6 text-2xl">Terima kasih, pesan Anda terkirim!</h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-600">
          Tim kami akan menghubungi Anda melalui email atau telepon pada jam kerja. Bila mendesak,
          silakan langsung menghubungi kami lewat WhatsApp.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappLink(whatsappNumber, waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            <IconWhatsapp className="h-4 w-4" />
            Lanjut Chat WhatsApp
          </a>
          <button
            type="button"
            onClick={() => {
              setForm({ name: '', email: '', phone: '', company: '', subject: SUBJECTS[0], message: '' });
              setStatus('idle');
            }}
            className="btn-outline"
          >
            Kirim Pesan Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card p-7 sm:p-9">
      <h3 className="text-2xl">Kirim Pesan</h3>
      <p className="mt-2 text-[14.5px] text-ink-600">
        Isi formulir berikut, tim kami akan membalas pada jam kerja.
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="cf-name">
            Nama Lengkap <span className="text-sun-600">*</span>
          </label>
          <input
            id="cf-name"
            required
            value={form.name}
            onChange={update('name')}
            className="field"
            placeholder="Nama Anda"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="cf-company">
            Instansi / Perusahaan
          </label>
          <input
            id="cf-company"
            value={form.company}
            onChange={update('company')}
            className="field"
            placeholder="Nama instansi Anda"
            autoComplete="organization"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="cf-email">
            Email <span className="text-sun-600">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="field"
            placeholder="nama@instansi.go.id"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="cf-phone">
            Nomor Telepon / WhatsApp
          </label>
          <input
            id="cf-phone"
            value={form.phone}
            onChange={update('phone')}
            className="field"
            placeholder="0812xxxxxxxx"
            autoComplete="tel"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="cf-subject">
            Kebutuhan Anda
          </label>
          <select id="cf-subject" value={form.subject} onChange={update('subject')} className="field">
            {SUBJECTS.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="field-label" htmlFor="cf-message">
            Pesan <span className="text-sun-600">*</span>
          </label>
          <textarea
            id="cf-message"
            required
            rows={5}
            value={form.message}
            onChange={update('message')}
            className="field resize-y"
            placeholder="Ceritakan kebutuhan atau kendala yang ingin Anda selesaikan…"
          />
        </div>
      </div>

      {status === 'error' ? (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === 'sending'} className="btn-primary">
          <IconSend className="h-4 w-4" />
          {status === 'sending' ? 'Mengirim…' : 'Kirim Pesan'}
        </button>
        <a
          href={whatsappLink(whatsappNumber, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          <IconWhatsapp className="h-4 w-4 text-[#25D366]" />
          Kirim lewat WhatsApp
        </a>
      </div>
    </form>
  );
}
