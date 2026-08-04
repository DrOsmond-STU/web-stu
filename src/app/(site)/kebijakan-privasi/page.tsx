import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { getSettings } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Kebijakan privasi CV. Semesta Teknologi Utama mengenai pengumpulan, penggunaan, dan perlindungan data pengunjung website.',
  alternates: { canonical: '/kebijakan-privasi' },
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Kebijakan Privasi"
        description="Bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda."
        breadcrumbs={[{ label: 'Kebijakan Privasi' }]}
      />

      <section className="section bg-white">
        <div className="container-page">
          <div className="prose-stu reveal mx-auto max-w-3xl">
            <p>
              {settings.company_name} menghormati privasi setiap pengunjung website ini. Halaman ini
              menjelaskan data apa yang kami kumpulkan, bagaimana kami menggunakannya, dan hak Anda
              atas data tersebut.
            </p>

            <h2>Data yang kami kumpulkan</h2>
            <p>Kami hanya mengumpulkan data yang Anda berikan secara sukarela, yaitu:</p>
            <ul>
              <li>Nama, alamat email, nomor telepon, dan nama instansi yang Anda isi pada formulir kontak</li>
              <li>Isi pesan atau pertanyaan yang Anda kirimkan kepada kami</li>
              <li>Data teknis dasar seperti jenis peramban dan halaman yang dikunjungi, bila layanan analitik diaktifkan</li>
            </ul>

            <h2>Penggunaan data</h2>
            <p>Data yang kami terima digunakan semata-mata untuk:</p>
            <ul>
              <li>Membalas pertanyaan dan permintaan penawaran Anda</li>
              <li>Menyusun proposal atau dokumen penawaran sesuai kebutuhan Anda</li>
              <li>Memperbaiki kualitas layanan dan isi website</li>
            </ul>
            <p>
              Kami <strong>tidak</strong> menjual, menyewakan, atau membagikan data pribadi Anda kepada
              pihak ketiga untuk kepentingan pemasaran.
            </p>

            <h2>Komunikasi melalui WhatsApp</h2>
            <p>
              Tombol chat pada website ini akan mengarahkan Anda ke aplikasi WhatsApp. Percakapan
              yang terjadi tunduk pada kebijakan privasi WhatsApp. Kami hanya menyimpan isi
              percakapan sejauh diperlukan untuk menindaklanjuti permintaan Anda.
            </p>

            <h2>Cookie dan analitik</h2>
            <p>
              Website ini dapat menggunakan cookie untuk menjaga sesi login administrator dan, bila
              diaktifkan, layanan analitik untuk memahami perilaku kunjungan secara agregat. Anda
              dapat menonaktifkan cookie melalui pengaturan peramban Anda.
            </p>

            <h2>Keamanan data</h2>
            <p>
              Kami menerapkan pengendalian keamanan yang wajar untuk melindungi data yang tersimpan.
              Sebagai perusahaan yang mendampingi penerapan ISO 27001, kami menerapkan prinsip
              keamanan informasi yang sama pada sistem kami sendiri.
            </p>

            <h2>Penyimpanan data</h2>
            <p>
              Pesan yang masuk melalui formulir kontak disimpan selama diperlukan untuk keperluan
              tindak lanjut dan pencatatan. Anda dapat meminta penghapusan data kapan saja.
            </p>

            <h2>Hak Anda</h2>
            <p>Anda berhak untuk:</p>
            <ul>
              <li>Meminta salinan data pribadi Anda yang kami simpan</li>
              <li>Meminta perbaikan data yang tidak akurat</li>
              <li>Meminta penghapusan data Anda dari sistem kami</li>
            </ul>

            <h2>Perubahan kebijakan</h2>
            <p>
              Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan langsung berlaku setelah
              dipublikasikan di halaman ini.
            </p>

            <h2>Hubungi kami</h2>
            <p>
              Untuk pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami di{' '}
              <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a> atau{' '}
              {settings.contact_phone}.
            </p>
            <p>
              <strong>{settings.company_name}</strong>
              <br />
              {settings.address}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
