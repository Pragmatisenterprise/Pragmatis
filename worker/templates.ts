import { cleanUrl, json, parseId, readJson, text, type Handler } from "./utils";

const COLUMNS = "id, slug, name, business, kind, summary, features, price_from, thumb_url, demo_url, sort_order, published";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function parse(body: Record<string, unknown>) {
  const slug = text(body.slug, 80);
  const name = text(body.name, 80);
  const business = text(body.business, 40);
  const summary = text(body.summary, 300);
  const thumbUrl = cleanUrl(body.thumb_url);
  const demoUrl = cleanUrl(body.demo_url);
  const price = Number(body.price_from ?? 0);
  const features = Array.isArray(body.features) ? body.features.map((f) => text(f, 80)).filter((f) => f !== "") : null;
  if (!name) return "Nombre inválido";
  if (!slug || !SLUG.test(slug)) return "Identificador (slug) inválido";
  if (business === null) return "Rubro demasiado largo";
  if (body.kind !== "web" && body.kind !== "app") return "Tipo inválido";
  if (summary === null) return "Descripción demasiado larga";
  if (!features || features.length > 12 || features.includes(null)) return "Características inválidas (máx. 12, 80 caracteres c/u)";
  if (!Number.isInteger(price) || price < 0 || price > 1_000_000_000) return "Precio inválido";
  if (thumbUrl === null) return "URL de miniatura inválida";
  // La demo se muestra en un iframe dentro de un sitio https: tiene que ser https.
  if (demoUrl === null || (demoUrl && !demoUrl.startsWith("https://"))) return "La URL de la demo debe empezar por https://";
  return {
    slug, name, business, kind: body.kind, summary, features: JSON.stringify(features), price, thumbUrl, demoUrl,
    published: body.published === false ? 0 : 1,
  };
}

// D1 guarda `features` como texto JSON; al cliente le llega como arreglo.
const decode = (row: Record<string, unknown>) => ({ ...row, features: JSON.parse(String(row.features || "[]")) });

const conflict = (e: unknown) => String(e).includes("UNIQUE") ? json({ error: "Ya existe una plantilla con ese identificador" }, 409) : null;

export const listPublic: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(
    "SELECT id, slug, name, business, kind, summary, features, price_from, thumb_url, demo_url FROM templates WHERE published = 1 ORDER BY sort_order, id",
  ).all();
  return json(results.map(decode));
};

export const listAdmin: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(`SELECT ${COLUMNS} FROM templates ORDER BY sort_order, id`).all();
  return json(results.map(decode));
};

export const create: Handler = async (request, env) => {
  const body = await readJson(request);
  const p = body && parse(body);
  if (!p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  try {
    const row = await env.DB.prepare(
      `INSERT INTO templates (slug, name, business, kind, summary, features, price_from, thumb_url, demo_url, published, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM templates))
       RETURNING ${COLUMNS}`,
    ).bind(p.slug, p.name, p.business, p.kind, p.summary, p.features, p.price, p.thumbUrl, p.demoUrl, p.published).first();
    return json(row && decode(row), 201);
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
      `UPDATE templates SET slug = ?, name = ?, business = ?, kind = ?, summary = ?, features = ?, price_from = ?,
       thumb_url = ?, demo_url = ?, published = ? WHERE id = ? RETURNING ${COLUMNS}`,
    ).bind(p.slug, p.name, p.business, p.kind, p.summary, p.features, p.price, p.thumbUrl, p.demoUrl, p.published, id).first();
    return row ? json(decode(row)) : json({ error: "No encontrado" }, 404);
  } catch (e) {
    const res = conflict(e);
    if (res) return res;
    throw e;
  }
};

export const remove: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  if (!id) return json({ error: "Solicitud inválida" }, 400);
  await env.DB.prepare("DELETE FROM templates WHERE id = ?").bind(id).run();
  return json({ ok: true });
};

// Recibe los ids en el orden deseado y reescribe `sort_order`.
export const reorder: Handler = async (request, env) => {
  const body = await readJson(request);
  const ids = body?.ids;
  if (!Array.isArray(ids) || ids.length > 500 || !ids.every((i) => Number.isInteger(i))) {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const stmt = env.DB.prepare("UPDATE templates SET sort_order = ? WHERE id = ?");
  await env.DB.batch(ids.map((id, i) => stmt.bind(i + 1, id)));
  return json({ ok: true });
};
