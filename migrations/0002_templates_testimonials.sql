-- Plantillas para negocios locales. `kind`: 'web' (portal) o 'app' (PWA instalable).
-- `features` es un arreglo JSON de textos cortos; `price_from` en pesos colombianos (0 = sin precio).
CREATE TABLE templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  business TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL DEFAULT 'web' CHECK (kind IN ('web', 'app')),
  summary TEXT NOT NULL DEFAULT '',
  features TEXT NOT NULL DEFAULT '[]',
  price_from INTEGER NOT NULL DEFAULT 0,
  thumb_url TEXT NOT NULL DEFAULT '',
  demo_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Testimonios reales: el admin genera un enlace con `token` para un cliente; el cliente lo llena una vez
-- (invited -> pending) y el admin decide si se publica (approved) o no (hidden).
CREATE TABLE testimonials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL UNIQUE,
  client_label TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  rating INTEGER,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'pending', 'approved', 'hidden')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT
);
CREATE INDEX idx_testimonials_status ON testimonials(status);
