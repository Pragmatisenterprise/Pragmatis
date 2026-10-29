import { json, parseId, readJson, text, type Handler } from "./utils";

const COLUMNS = "id, token, client_label, name, role, company, text, rating, status, sort_order, created_at, submitted_at";
const STATUSES = ["invited", "pending", "approved", "hidden"];

// Lo que escribe el cliente (y lo que el admin puede corregir después).
function parseContent(body: Record<string, unknown>) {
  const name = text(body.name, 80);
  const role = text(body.role, 80);
  const company = text(body.company, 80);
  const message = text(body.text, 600);
  const rating = body.rating == null || body.rating === "" ? null : Number(body.rating);
  if (!name || name.length < 2) return "Escribe tu nombre";
  if (role === null) return "Cargo demasiado largo";
  if (company === null) return "Empresa demasiado larga";
  if (!message || message.length < 10) return "Cuéntanos un poco más (mínimo 10 caracteres)";
  if (rating !== null && !(Number.isInteger(rating) && rating >= 1 && rating <= 5)) return "Calificación inválida";
  return { name, role, company, message, rating };
}

export const listPublic: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(
    "SELECT id, name, role, company, text, rating FROM testimonials WHERE status = 'approved' ORDER BY sort_order, id",
  ).all();
  return json(results);
};

// El formulario público consulta primero si su enlace sigue disponible.
export const getInvite: Handler = async (_r, env, params) => {
  const row = await env.DB.prepare("SELECT status FROM testimonials WHERE token = ?").bind(params.token).first<{ status: string }>();
  if (!row) return json({ error: "Este enlace no existe" }, 404);
  if (row.status !== "invited") return json({ error: "Este enlace ya se usó" }, 410);
  return json({ ok: true });
};

export const submit: Handler = async (request, env, params) => {
  const body = await readJson(request);
  if (!body) return json({ error: "Solicitud inválida" }, 400);
  // Campo trampa: los bots lo rellenan, las personas no lo ven.
  if (body.website) return json({ ok: true });
  const c = parseContent(body);
  if (typeof c === "string") return json({ error: c }, 400);
  // El `status = 'invited'` del WHERE hace que cada enlace sirva una sola vez.
  const row = await env.DB.prepare(
    `UPDATE testimonials SET name = ?, role = ?, company = ?, text = ?, rating = ?, status = 'pending', submitted_at = datetime('now')
     WHERE token = ? AND status = 'invited' RETURNING id`,
  ).bind(c.name, c.role, c.company, c.message, c.rating, params.token).first();
  return row ? json({ ok: true }) : json({ error: "Este enlace no existe o ya se usó" }, 410);
};

export const listAdmin: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(`SELECT ${COLUMNS} FROM testimonials ORDER BY sort_order, id DESC`).all();
  return json(results);
};

export const invite: Handler = async (request, env) => {
  const body = await readJson(request);
  const label = text(body?.client_label, 80);
  if (label === null) return json({ error: "Etiqueta demasiado larga" }, 400);
  const row = await env.DB.prepare(
    `INSERT INTO testimonials (token, client_label, sort_order)
     VALUES (?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM testimonials)) RETURNING ${COLUMNS}`,
  ).bind(crypto.randomUUID(), label).first();
  return json(row, 201);
};

export const update: Handler = async (request, env, params) => {
  const id = parseId(params.id);
  const body = await readJson(request);
  if (!id || !body) return json({ error: "Solicitud inválida" }, 400);
  const label = text(body.client_label, 80);
  if (label === null) return json({ error: "Etiqueta demasiado larga" }, 400);
  const current = await env.DB.prepare("SELECT status FROM testimonials WHERE id = ?").bind(id).first<{ status: string }>();
  if (!current) return json({ error: "No encontrado" }, 404);

  // Mientras el cliente no responda solo se puede cambiar la etiqueta interna.
  if (current.status === "invited") {
    const row = await env.DB.prepare(`UPDATE testimonials SET client_label = ? WHERE id = ? RETURNING ${COLUMNS}`).bind(label, id).first();
    return json(row);
  }
  const status = String(body.status ?? "");
  if (!STATUSES.includes(status) || status === "invited") return json({ error: "Estado inválido" }, 400);
  const c = parseContent(body);
  if (typeof c === "string") return json({ error: c }, 400);
  const row = await env.DB.prepare(
    `UPDATE testimonials SET client_label = ?, name = ?, role = ?, company = ?, text = ?, rating = ?, status = ?
     WHERE id = ? RETURNING ${COLUMNS}`,
  ).bind(label, c.name, c.role, c.company, c.message, c.rating, status, id).first();
  return json(row);
};

export const remove: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  if (!id) return json({ error: "Solicitud inválida" }, 400);
  await env.DB.prepare("DELETE FROM testimonials WHERE id = ?").bind(id).run();
  return json({ ok: true });
};

// Recibe los ids en el orden deseado y reescribe `sort_order`.
export const reorder: Handler = async (request, env) => {
  const body = await readJson(request);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.length > 500 || !ids.every((i) => Number.isInteger(i))) {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const stmt = env.DB.prepare("UPDATE testimonials SET sort_order = ? WHERE id = ?");
  await env.DB.batch(ids.map((id, i) => stmt.bind(i + 1, id)));
  return json({ ok: true });
};
