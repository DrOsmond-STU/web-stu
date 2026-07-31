import { IconInbox, IconMail, IconPhone, IconTrash, IconWhatsapp } from '@/components/icons';
import { deleteMessageAction, markMessageReadAction } from '@/lib/admin/actions';
import { safeQuery } from '@/lib/db';
import type { ContactMessage } from '@/lib/types';
import { formatDateTime, whatsappLink } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await safeQuery<ContactMessage>(
    'SELECT * FROM messages ORDER BY is_read, id DESC LIMIT 200',
  );

  const unread = messages.filter((message) => !message.is_read).length;

  return (
    <>
      <header className="mb-7">
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-600">
          Pengelolaan
        </p>
        <h1 className="mt-2 text-3xl">Pesan Masuk</h1>
        <p className="mt-2 text-[14.5px] text-ink-500">
          {messages.length} pesan dari formulir kontak
          {unread > 0 ? ` · ${unread} belum dibaca` : ''}.
        </p>
      </header>

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-ink-100 bg-white px-6 py-20 text-center shadow-soft">
          <IconInbox className="mx-auto h-12 w-12 text-ink-300" />
          <p className="mt-5 text-[16px] font-bold text-ink-800">Belum ada pesan masuk</p>
          <p className="mt-2 text-[14px] text-ink-500">
            Pesan dari formulir di halaman Kontak akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <article
              key={message.id}
              className={`rounded-3xl border bg-white p-6 shadow-soft ${
                message.is_read ? 'border-ink-100' : 'border-sun-300 ring-1 ring-sun-200'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-[17px] font-extrabold text-ink-900">{message.name}</h2>
                    {!message.is_read ? (
                      <span className="badge bg-sun-100 text-sun-700">Baru</span>
                    ) : null}
                    {message.subject ? (
                      <span className="badge bg-brand-50 text-brand-700">{message.subject}</span>
                    ) : null}
                  </div>
                  {message.company ? (
                    <p className="mt-1 text-[13.5px] text-ink-500">{message.company}</p>
                  ) : null}
                </div>

                <span className="shrink-0 text-[12.5px] text-ink-400">
                  {formatDateTime(message.created_at)}
                </span>
              </div>

              <p className="mt-5 whitespace-pre-line rounded-2xl bg-ink-50 px-5 py-4 text-[14.5px] leading-relaxed text-ink-700">
                {message.message}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-ink-100 pt-5">
                {message.email ? (
                  <a
                    href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Pertanyaan Anda')}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3.5 py-2 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                  >
                    <IconMail className="h-4 w-4" />
                    {message.email}
                  </a>
                ) : null}

                {message.phone ? (
                  <>
                    <a
                      href={`tel:${message.phone.replace(/[^0-9+]/g, '')}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border-2 border-ink-200 px-3.5 py-2 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                    >
                      <IconPhone className="h-4 w-4" />
                      {message.phone}
                    </a>
                    <a
                      href={whatsappLink(
                        message.phone.replace(/^0/, '62'),
                        `Halo ${message.name}, terima kasih telah menghubungi Semesta Teknologi Utama.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#1eb757]"
                    >
                      <IconWhatsapp className="h-4 w-4" />
                      Balas via WhatsApp
                    </a>
                  </>
                ) : null}

                <div className="ml-auto flex gap-2">
                  <form action={markMessageReadAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <button
                      type="submit"
                      className="rounded-lg border-2 border-ink-200 px-3.5 py-2 text-[12.5px] font-bold text-ink-700 transition-colors hover:border-brand-400 hover:text-brand-700"
                    >
                      {message.is_read ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                    </button>
                  </form>

                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={message.id} />
                    <button
                      type="submit"
                      aria-label="Hapus pesan"
                      className="rounded-lg border-2 border-red-200 p-2 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
