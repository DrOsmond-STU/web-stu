-- ============================================================================
--  CV. SEMESTA TEKNOLOGI UTAMA — Skema Database (PostgreSQL)
--  Dijalankan otomatis oleh: npm run db:migrate
--  Semua perintah bersifat idempotent (aman dijalankan berulang kali).
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL DEFAULT 'Administrator',
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Penyimpanan konten bebas (teks hero, profil, kontak, SEO, dsb).
CREATE TABLE IF NOT EXISTS settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  "group"    TEXT NOT NULL DEFAULT 'umum',
  label      TEXT,
  type       TEXT NOT NULL DEFAULT 'text',   -- text | textarea | markdown | image | number | boolean | json
  hint       TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  summary     TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT 'code',
  image       TEXT,
  features    TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  title        TEXT NOT NULL,
  summary      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  features     TEXT[] NOT NULL DEFAULT '{}',
  tech         TEXT[] NOT NULL DEFAULT '{}',
  gallery      TEXT[] NOT NULL DEFAULT '{}',
  cover_image  TEXT,
  client       TEXT,
  category     TEXT NOT NULL DEFAULT 'Aplikasi',
  year         INTEGER,
  repo_name    TEXT,
  repo_url     TEXT,
  demo_url     TEXT,
  is_private   BOOLEAN NOT NULL DEFAULT FALSE,
  source       TEXT NOT NULL DEFAULT 'manual',   -- manual | github
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS projects_published_idx ON projects (published, sort_order);

CREATE TABLE IF NOT EXISTS testimonials (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  position   TEXT NOT NULL DEFAULT '',
  company    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  avatar     TEXT,
  rating     INTEGER NOT NULL DEFAULT 5,
  featured   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  excerpt          TEXT NOT NULL DEFAULT '',
  content          TEXT NOT NULL DEFAULT '',
  cover_image      TEXT,
  category         TEXT NOT NULL DEFAULT 'Berita',
  tags             TEXT[] NOT NULL DEFAULT '{}',
  author           TEXT NOT NULL DEFAULT 'Redaksi STU',
  meta_title       TEXT,
  meta_description TEXT,
  focus_keyword    TEXT,
  views            INTEGER NOT NULL DEFAULT 0,
  published        BOOLEAN NOT NULL DEFAULT FALSE,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts (published, published_at DESC);

CREATE TABLE IF NOT EXISTS team_members (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  position   TEXT NOT NULL DEFAULT '',
  photo      TEXT,
  bio        TEXT NOT NULL DEFAULT '',
  email      TEXT,
  linkedin   TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS experiences (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL,
  field          TEXT NOT NULL DEFAULT 'Teknologi Informasi dan Telematika',
  location       TEXT NOT NULL DEFAULT 'Jakarta',
  client         TEXT NOT NULL DEFAULT '',
  client_address TEXT NOT NULL DEFAULT '',
  contract_no    TEXT NOT NULL DEFAULT '',
  contract_date  TEXT NOT NULL DEFAULT '',
  contract_value BIGINT NOT NULL DEFAULT 0,
  year           INTEGER,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  published      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL DEFAULT '',
  caption    TEXT NOT NULL DEFAULT '',
  image      TEXT NOT NULL,
  category   TEXT NOT NULL DEFAULT 'Dokumentasi',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS clients (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  logo       TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL DEFAULT '',
  phone      TEXT NOT NULL DEFAULT '',
  company    TEXT NOT NULL DEFAULT '',
  subject    TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  is_read    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media (
  id         SERIAL PRIMARY KEY,
  url        TEXT NOT NULL,
  filename   TEXT NOT NULL,
  mime       TEXT NOT NULL DEFAULT '',
  size       INTEGER NOT NULL DEFAULT 0,
  alt        TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
