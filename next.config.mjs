/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // Shared hosting (cPanel/Passenger) sering tidak menyediakan sharp,
    // jadi optimasi gambar dimatikan dan kita pakai aset yang sudah dikompresi.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'opengraph.githubassets.com' },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
  /*
   * Build dijalankan dalam satu proses.
   *
   * Secara bawaan `next build` mem-fork satu worker per inti CPU untuk
   * membuat halaman statis. Di shared hosting cPanel jumlah proses per akun
   * dibatasi, dan ketika akun ini menjalankan beberapa aplikasi sekaligus,
   * fork tersebut ditolak sistem dengan `spawn ... EAGAIN` sehingga build
   * berhenti di tengah jalan. Situs ini hanya punya tiga halaman statis,
   * jadi merender semuanya di proses utama praktis tanpa biaya waktu.
   */
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
