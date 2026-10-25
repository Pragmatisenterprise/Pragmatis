import { isEmail, json, readJson, type Env } from "./utils";

export async function subscribe(request: Request, env: Env) {
  const body = await readJson(request);
  if (!body) return json({ error: "Solicitud inválida" }, 400);
  if (body.website) return json({ ok: true });
  if (!isEmail(body.email)) return json({ error: "Correo inválido" }, 400);

  const { RESEND_API_KEY, RESEND_AUDIENCE_ID } = env;
  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) return json({ error: "Servicio no configurado" }, 500);

  const res = await fetch(`https://api.resend.com/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ email: body.email, unsubscribed: false }),
  });
  if (!res.ok) return json({ error: "No se pudo suscribir" }, 502);
  return json({ ok: true });
}
