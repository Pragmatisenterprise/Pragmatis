import { json, parseId, readJson, text, type Handler } from "./utils";

const COLUMNS = "id, slug, name, summary, price, sort_order, published";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parse(body: Record<string, unknown>) {
  const slug = text(body.slug, 40);
  const name = text(body.name, 40);
  const summary = text(body.summary, 200);
  const price = Number(body.price ?? 0);
  if (!name) return "Nombre inválido";
  if (!slug || !SLUG.test(slug)) return "Identificador (slug) inválido";
  if (summary === null) return "Descripción demasiado larga";
  if (!Number.isInteger(price) || price < 0 || price > 1_000_000_000) return "Precio inválido";
  return { slug, name, summary, price, published: body.published === false ? 0 : 1 };
}

const conflict = (e: unknown) => String(e).includes("UNIQUE") ? json({ error: "Ya existe un módulo con ese identificador" }, 409) : null;

export const listAdmin: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(`SELECT ${COLUMNS} FROM modules ORDER BY sort_order, id`).all();
  return json(results);
};

export const create: Handler = async (request, env) => {
  const body = await readJson(request);
  const p = body && parse(body);
  if (!p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  try {
    const row = await env.DB.prepare(
      `INSERT INTO modules (slug, name, summary, price, published, sort_order)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM modules))
       RETURNING ${COLUMNS}`,
    ).bind(p.slug, p.name, p.summary, p.price, p.published).first();
    return json(row, 201);
  } catch (e) {
    const res = conflict(e);
    if (res) return res;
    throw e;
  }
};

export const update: Handler = async (request, env, params) => {
  const id = parseId(params.id);
  const body = await readJson(request);
  const p = body && parse(body);
  if (!id || !p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  try {
    const row = await env.DB.prepare(
      `UPDATE modules SET slug = ?, name = ?, summary = ?, price = ?, published = ? WHERE id = ? RETURNING ${COLUMNS}`,
    ).bind(p.slug, p.name, p.summary, p.price, p.published, id).first();
    return row ? json(row) : json({ error: "No encontrado" }, 404);
  } catch (e) {
    const res = conflict(e);
    if (res) return res;
    throw e;
  }
};

export const remove: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  if (!id) return json({ error: "Solicitud inválida" }, 400);
  await env.DB.batch([
    env.DB.prepare("DELETE FROM template_modules WHERE module_id = ?").bind(id),
    env.DB.prepare("DELETE FROM modules WHERE id = ?").bind(id),
  ]);
  return json({ ok: true });
};

// Recibe los ids en el orden deseado y reescribe `sort_order`.
export const reorder: Handler = async (request, env) => {
  const body = await readJson(request);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.length > 500 || !ids.every((i) => Number.isInteger(i))) {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const stmt = env.DB.prepare("UPDATE modules SET sort_order = ? WHERE id = ?");
  await env.DB.batch(ids.map((id, i) => stmt.bind(i + 1, id)));
  return json({ ok: true });
};
