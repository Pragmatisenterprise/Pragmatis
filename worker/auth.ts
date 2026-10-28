import { json, readJson, type Env, type Handler } from "./utils";

const COOKIE = "pg_session";
const TTL = 60 * 60 * 24 * 7;
const enc = new TextEncoder();

async function digest(s: string) {
  return crypto.subtle.digest("SHA-256", enc.encode(s));
}

// Compara en tiempo constante: ambos lados se reducen a 32 bytes antes de comparar.
async function safeEqual(a: string, b: string) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  return crypto.subtle.timingSafeEqual(x, y);
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readCookie(request: Request): string | null {
  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === COOKIE) return v.join("=");
  }
  return null;
}

const cookie = (value: string, maxAge: number) =>
  `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;

async function isAdmin(request: Request, env: Env) {
  const token = readCookie(request);
  if (!token || !env.SESSION_SECRET) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !(Number(exp) > Date.now() / 1000)) return false;
  return safeEqual(sig, await sign(exp, env.SESSION_SECRET));
}

const sameOrigin = (request: Request) => request.headers.get("origin") === new URL(request.url).origin;

// Protege una ruta del panel: sesión válida y, en escrituras, mismo origen.
export function admin(handler: Handler): Handler {
  return async (request, env, params) => {
    if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: "Servicio no configurado" }, 500);
    if (!(await isAdmin(request, env))) return json({ error: "No autorizado" }, 401);
    if (request.method !== "GET" && !sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
    const res = await handler(request, env, params);
    res.headers.set("cache-control", "no-store");
    return res;
  };
}

export const login: Handler = async (request, env) => {
  if (!env.ADMIN_PASSWORD || !env.SESSION_SECRET) return json({ error: "Servicio no configurado" }, 500);
  if (!sameOrigin(request)) return json({ error: "Origen no permitido" }, 403);
  const body = await readJson(request);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!(await safeEqual(password, env.ADMIN_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 600)); // frena la fuerza bruta
    return json({ error: "Contraseña incorrecta" }, 401);
  }
  const exp = String(Math.floor(Date.now() / 1000) + TTL);
  const token = `${exp}.${await sign(exp, env.SESSION_SECRET)}`;
  return json({ ok: true }, 200, { "set-cookie": cookie(token, TTL) });
};

export const logout: Handler = async () => json({ ok: true }, 200, { "set-cookie": cookie("", 0) });

export const me = admin(async () => json({ ok: true }));
