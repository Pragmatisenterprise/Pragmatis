export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
  RESEND_AUDIENCE_ID?: string;
  ADMIN_PASSWORD?: string;
  SESSION_SECRET?: string;
}

export type Handler = (request: Request, env: Env, params: Record<string, string>) => Promise<Response>;

export const json = (body: unknown, status = 200, headers?: HeadersInit) => {
  const h = new Headers(headers);
  h.set("content-type", "application/json");
  return new Response(JSON.stringify(body), { status, headers: h });
};

export const isEmail = (v: unknown): v is string =>
  typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Texto recortado, o null si excede `max`.
export const text = (v: unknown, max: number): string | null => {
  const s = String(v ?? "").trim();
  return s.length > max ? null : s;
};

// URL vacía, ruta relativa o http(s); null si es inválida (evita `javascript:` y similares).
export function cleanUrl(v: unknown): string | null {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (s.length > 500) return null;
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  try {
    const { protocol } = new URL(s);
    return protocol === "https:" || protocol === "http:" ? s : null;
  } catch {
    return null;
  }
}

export const parseId = (v: string | undefined): number | null => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Día en hora de Colombia (UTC-5, sin horario de verano), para que las estadísticas cuadren con el día local.
export const today = (offsetDays = 0) =>
  new Date(Date.now() - 5 * 3600_000 - offsetDays * 86_400_000).toISOString().slice(0, 10);

export async function recordEvent(env: Env, type: "contact" | "subscribe") {
  try {
    await env.DB.prepare("INSERT INTO events (day, type) VALUES (?, ?)").bind(today(), type).run();
  } catch {
    // Las estadísticas nunca deben romper el envío del formulario.
  }
}
