-- Módulos de la plataforma (reservas, pedidos, caja…). `price` en pesos colombianos, pago único (0 = sin precio).
CREATE TABLE modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Qué módulos trae cada plantilla: `included` = 1 viene en la base, 0 = se puede agregar.
CREATE TABLE template_modules (
  template_id INTEGER NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  included INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (template_id, module_id)
);

INSERT INTO modules (slug, name, summary, sort_order) VALUES
  ('catalogo', 'Catálogo', 'Tus productos o servicios con fotos, precios y disponibilidad.', 1),
  ('reservas', 'Reservas', 'Tus clientes agendan en línea según la disponibilidad de cada profesional.', 2),
  ('pedidos', 'Pedidos', 'Carrito que llega a tu WhatsApp o se paga en línea, para recoger o a domicilio.', 3),
  ('caja', 'Ventas y caja', 'Registra las ventas del local y cuadra la caja al final del día.', 4),
  ('facturacion', 'Facturación', 'Cotizaciones y facturas, con facturación electrónica a través de un proveedor autorizado.', 5),
  ('inventario', 'Inventario', 'Stock por producto, alertas de faltantes, proveedores y vencimientos.', 6),
  ('fidelizacion', 'Fidelización', 'Tarjeta de sellos o puntos, cupones y saludos de cumpleaños.', 7),
  ('membresias', 'Membresías', 'Planes mensuales, suscripciones y control de asistencia.', 8),
  ('fila-virtual', 'Fila virtual', 'Tus clientes toman turno desde el celular sin esperar en el local.', 9),
  ('pagos', 'Pagos en línea', 'Anticipos, pedidos y mensualidades pagados en línea.', 10),
  ('reportes', 'Reportes', 'Ventas por día, servicios más pedidos y ticket promedio.', 11),
  ('resenas', 'Reseñas', 'Pide una reseña después de cada servicio y publica las mejores.', 12);
