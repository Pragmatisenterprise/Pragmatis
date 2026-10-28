import { cleanUrl, json, parseId, readJson, text, type Handler } from "./utils";

const COLUMNS = "id, title, summary, category, image_url, link_url, sort_order, published";

function parse(body: Record<string, unknown>) {
  const title = text(body.title, 120);
  const summary = text(body.summary, 400);
  const category = text(body.category, 40);
  const imageUrl = cleanUrl(body.image_url);
  const linkUrl = cleanUrl(body.link_url);
  if (!title) return "Título inválido";
  if (summary === null) return "Descripción demasiado larga";
  if (category === null) return "Categoría demasiado larga";
  if (imageUrl === null) return "URL de imagen inválida";
  if (linkUrl === null) return "URL del enlace inválida";
  return { title, summary, category, imageUrl, linkUrl, published: body.published === false ? 0 : 1 };
}

export const listPublic: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(
    "SELECT id, title, summary, category, image_url, link_url FROM projects WHERE published = 1 ORDER BY sort_order, id",
  ).all();
  return json(results);
};

export const listAdmin: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(`SELECT ${COLUMNS} FROM projects ORDER BY sort_order, id`).all();
  return json(results);
};

export const create: Handler = async (request, env) => {
  const body = await readJson(request);
  const p = body && parse(body);
  if (!p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  const row = await env.DB.prepare(
    `INSERT INTO projects (title, summary, category, image_url, link_url, published, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM projects))
     RETURNING ${COLUMNS}`,
  ).bind(p.title, p.summary, p.category, p.imageUrl, p.linkUrl, p.published).first();
  return json(row, 201);
};

export const update: Handler = async (request, env, params) => {
  const id = parseId(params.id);
  const body = await readJson(request);
  const p = body && parse(body);
  if (!id || !p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  const row = await env.DB.prepare(
    `UPDATE projects SET title = ?, summary = ?, category = ?, image_url = ?, link_url = ?, published = ?
     WHERE id = ? RETURNING ${COLUMNS}`,
  ).bind(p.title, p.summary, p.category, p.imageUrl, p.linkUrl, p.published, id).first();
  return row ? json(row) : json({ error: "No encontrado" }, 404);
};

export const remove: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  if (!id) return json({ error: "Solicitud inválida" }, 400);
  await env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
  return json({ ok: true });
};

// Recibe los ids en el orden deseado y reescribe `sort_order`.
export const reorder: Handler = async (request, env) => {
  const body = await readJson(request);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.length > 500 || !ids.every((i) => Number.isInteger(i))) {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const stmt = env.DB.prepare("UPDATE projects SET sort_order = ? WHERE id = ?");
  await env.DB.batch(ids.map((id, i) => stmt.bind(i + 1, id)));
  return json({ ok: true });
};
