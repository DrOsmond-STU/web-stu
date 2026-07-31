/**
 * Titik masuk aplikasi untuk hosting Node.js berbasis Passenger
 * (cPanel → Setup Node.js App), Plesk, atau PM2.
 *
 * Cara pakai di cPanel:
 *   1. Setup Node.js App → Application startup file: server.js
 *   2. Jalankan "npm install" lalu "npm run build" dari tombol
 *      "Run NPM Install" / terminal cPanel.
 *   3. Restart aplikasi.
 *
 * Untuk menjalankan secara manual: node server.js
 */
const { createServer } = require('node:http');
const { parse } = require('node:url');
const next = require('next');

const port = Number(process.env.PORT) || 3000;
const hostname = process.env.HOSTNAME || '0.0.0.0';
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      try {
        handle(req, res, parse(req.url, true));
      } catch (error) {
        console.error('Gagal menangani permintaan:', req.url, error);
        res.statusCode = 500;
        res.end('Terjadi kesalahan pada server.');
      }
    }).listen(port, hostname, () => {
      console.log(`✅ Server berjalan pada http://${hostname}:${port} (mode ${dev ? 'development' : 'production'})`);
    });
  })
  .catch((error) => {
    console.error('Gagal menyiapkan aplikasi Next.js:', error);
    process.exit(1);
  });
