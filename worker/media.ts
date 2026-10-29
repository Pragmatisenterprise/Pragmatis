import { json, type Handler } from "./utils";

const TYPES: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" };
const MAX_BYTES = 5 * 1024 * 1024;
const KEY = /^[0-9a-f-]{36}\.(png|jpg|webp|avif)$/;

// Recibe un multipart con el campo `file` y devuelve la URL pública (/media/<clave>).
export const upload: Handler = async (request, env) => {
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BYTES + 64 * 1024) return json({ error: "La imagen supera 5 MB" }, 413);
  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return json({ error: "Falta el archivo" }, 400);
  const ext = TYPES[file.type];
  if (!ext) return json({ error: "Formato no permitido (usa PNG, JPG, WebP o AVIF)" }, 415);
  if (file.size > MAX_BYTES) return json({ error: "La imagen supera 5 MB" }, 413);
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
  return json({ url: `/media/${key}` }, 201);
};

// Las claves son aleatorias y nunca se reescriben, así que el archivo se puede cachear para siempre.
export const serve: Handler = async (_r, env, params) => {
  if (!KEY.test(params.key)) return json({ error: "No encontrado" }, 404);
  const obj = await env.MEDIA.get(params.key);
  if (!obj) return json({ error: "No encontrado" }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  headers.set("x-content-type-options", "nosniff");
  return new Response(obj.body, { headers });
};
