import { cleanUrl, json, parseId, readJson, text, type Handler } from "./utils";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Palabras ≈ espacios + 1; 200 palabras por minuto.
const READ_MIN = "MAX(1, (LENGTH(content) - LENGTH(REPLACE(content, ' ', '')) + 1) / 200) AS read_min";
const LIST = `id, slug, title, excerpt, tag, cover_url, author, published, published_at, ${READ_MIN}`;

function parse(body: Record<string, unknown>) {
  const slug = String(body.slug ?? "").trim();
  const title = text(body.title, 160);
  const excerpt = text(body.excerpt, 300);
  const content = text(body.content, 50_000);
  const tag = text(body.tag, 30);
  const author = text(body.author, 60);
  const coverUrl = cleanUrl(body.cover_url);
  if (!SLUG.test(slug) || slug.length > 80) return "Slug inválido: usa minúsculas, números y guiones";
  if (!title) return "Título inválido";
  if (excerpt === null) return "Resumen demasiado largo (máx. 300)";
  if (content === null) return "Contenido demasiado largo";
  if (tag === null || author === null) return "Etiqueta o autor demasiado largos";
  if (coverUrl === null) return "URL de portada inválida";
  return { slug, title, excerpt, content, tag, author, coverUrl, published: body.published === true ? 1 : 0 };
}

const isUnique = (e: unknown) => String(e).includes("UNIQUE");

export const listPublic: Handler = async (request, env) => {
  const limit = Math.min(Math.max(Number(new URL(request.url).searchParams.get("limit")) || 50, 1), 50);
  const { results } = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, tag, cover_url, author, published_at, ${READ_MIN}
     FROM posts WHERE published = 1 ORDER BY published_at DESC LIMIT ?`,
  ).bind(limit).all();
  return json(results);
};

export const getPublic: Handler = async (_r, env, params) => {
  const row = await env.DB.prepare(
    `SELECT id, slug, title, excerpt, content, tag, cover_url, author, published_at, ${READ_MIN}
     FROM posts WHERE slug = ? AND published = 1`,
  ).bind(params.slug).first();
  return row ? json(row) : json({ error: "No encontrado" }, 404);
};

export const listAdmin: Handler = async (_r, env) => {
  const { results } = await env.DB.prepare(`SELECT ${LIST} FROM posts ORDER BY COALESCE(published_at, created_at) DESC`).all();
  return json(results);
};

export const getAdmin: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  const row = id && (await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first());
  return row ? json(row) : json({ error: "No encontrado" }, 404);
};

export const create: Handler = async (request, env) => {
  const body = await readJson(request);
  const p = body && parse(body);
  if (!p) return json({ error: "Solicitud inválida" }, 400);
  if (typeof p === "string") return json({ error: p }, 400);
  try {
    const row = await env.DB.prepare(
      `INSERT INTO posts (slug, title, excerpt, content, tag, cover_url, author, published, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 1 THEN datetime('now') END)
       RETURNING id`,
    ).bind(p.slug, p.title, p.excerpt, p.content, p.tag, p.coverUrl, p.author, p.published, p.published).first();
    return json(row, 201);
  } catch (e) {
    return isUnique(e) ? json({ error: "Ya existe un artículo con ese slug" }, 409) : Promise.reject(e);
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
      `UPDATE posts SET slug = ?, title = ?, excerpt = ?, content = ?, tag = ?, cover_url = ?, author = ?, published = ?,
         published_at = CASE WHEN ? = 1 AND published_at IS NULL THEN datetime('now') ELSE published_at END,
         updated_at = datetime('now')
       WHERE id = ? RETURNING id`,
    ).bind(p.slug, p.title, p.excerpt, p.content, p.tag, p.coverUrl, p.author, p.published, p.published, id).first();
    return row ? json(row) : json({ error: "No encontrado" }, 404);
  } catch (e) {
    return isUnique(e) ? json({ error: "Ya existe un artículo con ese slug" }, 409) : Promise.reject(e);
  }
};

export const remove: Handler = async (_r, env, params) => {
  const id = parseId(params.id);
  if (!id) return json({ error: "Solicitud inválida" }, 400);
  await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
  return json({ ok: true });
};
